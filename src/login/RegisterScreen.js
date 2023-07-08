//import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Button,
} from "react-native";
import { BlurView } from "expo-blur";
import Toast from "react-native-root-toast";

import { initializeApp, initializeAuth } from "firebase/app";
import {
  collection,
  firestore,
  getFirestore,
  addDoc,
} from "firebase/firestore";
import { ref, set, getDatabase } from "firebase/database";
import { firebaseConfig } from "../../firebase-config";
import "firebase/auth";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";

import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomBotton";

function RegisterScreen() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");

  const navigation = useNavigation();
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  //const firebase = getFirestore();

  const handleCreateAccount = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Actualizar el displayName del usuario
      await updateProfile(user, { displayName: name });
  
      // Guardar el nombre en la base de datos de Firestore
      const db = getFirestore();
      await addDoc(collection(db, "users"), {
        name: name,
        email: email
      });
  
      console.log("Usuario creado exitosamente");
      Toast.show("Se ha creado el usuario con éxito", {
        duration: Toast.durations.LONG,
      });
      backLogin();
    } catch (error) {
      console.log("Error al crear el usuario:", error);
      Toast.show("Ha ocurrido un error al crear el usuario", {
        duration: Toast.durations.LONG,
      });
    }
  };

  const backLogin = () => {
    navigation.navigate("Login");
  };

  const addUser = () => {
    firestore(name, email).collection("user").add({
      email: email,
      name: name,
    });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/login1.png")}
        style={[styles.image, StyleSheet.absoluteFill]}
      />
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BlurView intensity={250}>
          <View style={styles.login}>
            <Image
              source={require("../../assets/linea-de-meta.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <View>
              <Text
                style={{ fontSize: 17, fontWeight: "400", color: "#FF7D61" }}
              >
                Nombre
              </Text>
              <TextInput
                onChangeText={(text) => setName(text)}
                placeholder="Nombre"
                style={styles.input}
              ></TextInput>
            </View>
            <View>
              <Text
                style={{ fontSize: 17, fontWeight: "400", color: "#FF7D61" }}
              >
                E-mail
              </Text>
              <TextInput
                onChangeText={(text) => setEmail(text)}
                placeholder="E-mail"
                style={styles.input}
              ></TextInput>
            </View>
            <View>
              <Text
                style={{ fontSize: 17, fontWeight: "400", color: "#FF7D61" }}
              >
                Password
              </Text>
              <TextInput
                onChangeText={(text) => setPassword(text)}
                style={styles.input}
                placeholder="Password"
                secureTextEntry={true}
              ></TextInput>
            </View>
            <TouchableOpacity
              onPress={handleCreateAccount}
              style={[styles.button]}
            >
              <Text
                style={{ fontSize: 17, fontWeight: "400", color: "#FF7D61" }}
              >
                Crear usuario
              </Text>
            </TouchableOpacity>

            <CustomButton
              text="¿Ya tienes una cuenta? Vuelve Iniciar sesión"
              onPress={backLogin}
            />
          </View>
        </BlurView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  logo: {
    width: 250,
    maxWidth: 500,
    height: 100,
  },

  login: {
    width: 350,
    height: 520,
    borderColor: "#fff",
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },

  prefilePicture: {
    width: 100,
    height: 120,
    borderRadius: 50,
    borderColor: "#fff",
    borderWidth: 1,
    marginVertical: 30,
  },

  input: {
    width: 250,
    height: 40,
    borderColor: "#fff",
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#ffffff90",
    marginBottom: 20,
  },

  button: {
    width: 250,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#FFA495",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    borderColor: "#fff",
    borderWidth: 1,
  },
});

export default RegisterScreen;
