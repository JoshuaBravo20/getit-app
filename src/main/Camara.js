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
import { initializeApp } from "firebase/app";


export default function Camara({ route }) {
  const meta = route.params.meta
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState(null);

  const app = initializeApp(firebaseConfig);
  const database = getFirestore(app);
  const postCollectionRef = collection(database, "post");

  const navigation = useNavigation();

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      setImage(data.uri);
    }
  };

  const goToFeed = () => {
    navigation.navigate("Feed")
  };

  const post = () => {
    const objectPost = {
      description : description,
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
          We need your permission to show the camera and pick one in the gallery
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
      <Button title="Take Picture" onPress={() => takePicture()} />
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && (
        <View>
          <TextInput
            onChangeText={(text) => setDescription(text)}
            style={styles.input}
            placeholder="Escriba una descripción"
          ></TextInput>
          <Button title="Postear" onPress={post} />
        </View>
      ) }

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
