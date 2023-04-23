//import { StatusBar } from "expo-status-bar";
import React from "react";
import Toast from "react-native-root-toast";
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

import CustomButton from "../components/CustomBotton";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { initializeApp, initializeAuth } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "../../firebase-config";

import { useNavigation } from "@react-navigation/native";

function LoginScreen() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigation = useNavigation();

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const onSignUpPress = () => {
    navigation.navigate("Register");
  };

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Signed in!");
        const user = userCredential.user;
        console.log(user);
        navigation.navigate("Main");
      })
      .catch((error) => {
        Toast.show("Usuario no existe", {
          duration: Toast.durations.LONG,
        });
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
            <TouchableOpacity onPress={handleSignIn} style={[styles.button]}>
              <Text
                style={{ fontSize: 17, fontWeight: "400", color: "#FF7D61" }}
              >
                Login
              </Text>
            </TouchableOpacity>

            <CustomButton
              text="Dont't have account? Create one"
              onPress={onSignUpPress}
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
export default LoginScreen;
