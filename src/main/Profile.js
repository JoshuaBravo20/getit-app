import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { getAuth, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  query,
  onSnapshot,
  getFirestore,
} from "firebase/firestore";
import { firebaseConfig } from "../../firebase-config";
import { initializeApp } from "firebase/app";

const Profile = () => {
  const [profileImage, setProfileImage] = useState(
    require("G:/geit/tesis-main/assets/blank-profile.png")
  );
  const app = initializeApp(firebaseConfig);
  const database = getFirestore(app);
  const auth = getAuth(app);
  const [user, loading, error] = useAuthState(auth);
  const email = user.email;
  const displayName = user.displayName;

  const handleProfileImageChange = () => {
    launchImageLibrary({ mediaType: "photo" }, async (response) => {
      if (!response.didCancel && !response.errorCode) {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          try {
            const storage = getStorage();
            const storageRef = ref(storage, `profile-images/${user.uid}`);
            await uploadBytes(storageRef, response.assets[0].uri, {
              contentType: "image/jpeg",
            });

            const newProfileImage = { uri: response.assets[0].uri };
            setProfileImage(newProfileImage);

            await updateProfile(user, { photoURL: newProfileImage.uri });
          } catch (error) {
            console.error("Error uploading profile image:", error);
          }
        }
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Perfil</Text>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={handleProfileImageChange}>
          <Image source={profileImage} style={styles.profileImage} />
        </TouchableOpacity>
        <Text style={styles.profileInfo}>Nombre: {displayName}</Text>
        <Text style={styles.profileInfo}>Correo: {email}</Text>
        <Button
          title="Cambiar Foto de Perfil"
          onPress={handleProfileImageChange}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  profileContainer: {
    alignItems: "center",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  profileInfo: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default Profile;
