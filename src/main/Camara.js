import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { ScreenStackHeaderBackButtonImage } from 'react-native-screens';
import * as ImagePicker from 'expo-image-picker';


export default function Camara() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
 


  const takePicture = async() =>{
    if(camera){
      const data = await camera.takePictureAsync(null);
      setImage(data.uri)
    }
  }

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

  if (!permission ) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted ) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera and pick one in the gallery</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  return (
    <View style={styles.container}>   
      <View style={styles.cameraContainer}>
        <Camera ref={ref=>setCamera(ref)} style={styles.fixedRatio} type={type} ratio={'1:1'} />
      </View>

      <Button style={styles.buttonContainer} title="Flip image" onPress={toggleCameraType}/>      
      <Button title='Take Picture' onPress={()=> takePicture()} />
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{uri : image}} style={{flex: 1}} /> }
      
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  cameraContainer:{
    flex:1,
    flexDirection: 'row',
  }, 
  fixedRatio: {
    flex: 1,
    aspectRatio:1,
  }
});