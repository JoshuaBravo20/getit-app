import { Camera, CameraType } from "expo-camera";
import Toast from "react-native-root-toast";
import { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import {
  collection,
  getFirestore,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { firebaseConfig } from "../../firebase-config";
import { initializeApp, } from "firebase/app";
import { getStorage, ref, put } from 'firebase/storage';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base-64';

export default function Camara({ route }) {
  const meta = route.params.meta
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState(null);

  const app = initializeApp(firebaseConfig);
  const databasebase = getFirestore(app);
  const postCollectionRef = collection(databasebase, "post");
  const navigation = useNavigation();

  const uploadToFirebase = async (uriInput, metaId) => {
    try {
      const storage = getStorage();
      const { uri } = uriInput;
  
      const response = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      const byteArray = Uint8Array.from(decode(response), (c) => c.charCodeAt(0));
  
      const archivoRef = ref(storage);
      await put(archivoRef, byteArray);
  
      console.log('Archivo subido correctamente.');
    } catch (error) {
      console.error('Error al subir el archivo:', error);
    }
  };
  
  const takePicture = async () => {
    if (camera) {
      const { uri } = await camera.takePictureAsync(null);
  
      const response = await uploadToFirebase({ uri }, meta.id);
      console.log('LINEA 61 CÁMARA, RESPONSE: ', response);
      setImage(uri);
    }
  };
  

  const goToFeed = () => {
    navigation.navigate("Feed")
  };

  const post = () => {
    const objectPost = {
      description: description,
      creator: meta.creator,
      imgUri: image,
      likes: 0,
      comments: [],
      relatedGoal: meta.id,
      createdAt: serverTimestamp(),
    }
    console.log("objectPost: ", objectPost)
    addDoc(postCollectionRef, objectPost)
      .then((docRef) => {
        console.log("Post agregado con ID:", docRef.id);
        Toast.show("Post hecho con éxito!", {
          duration: Toast.durations.LONG,
        });
        goToFeed();
      })
      .catch((error) => {
        console.error("Error al agregar Post:", error);
      });
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          Necesitamos tu permiso para mostrar la cámara y elegir una en la galería.
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera
          ref={(ref) => setCamera(ref)}
          style={styles.fixedRatio}
          type={type}
          ratio={"1:1"}
        />
      </View>

      <Button
        style={styles.buttonContainer}
        title="Flip image"
        onPress={toggleCameraType}
      />
      <Button title="Tomar la foto" onPress={() => takePicture()} />
      <Button title="Elija una imagen de tu galeria de la cámara" onPress={pickImage} />
      {image && (
        <View>
          <TextInput
            onChangeText={(text) => setDescription(text)}
            style={styles.input}
            placeholder="Escriba una descripción"
          ></TextInput>
          <Button title="Postear" onPress={post} />
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "white",
    width: 350,
    height: 45,
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  cameraContainer: {
    flex: 1,
    flexDirection: "row",
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
});
