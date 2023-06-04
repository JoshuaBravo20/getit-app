import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigation } from "@react-navigation/native";
import {
  collection,
  query,
  onSnapshot,
  getFirestore,
} from "firebase/firestore";
import { firebaseConfig } from "../../firebase-config";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";

function ListarMetas() {
  const app = initializeApp(firebaseConfig);
  const database = getFirestore(app);
  const auth = getAuth(app);
  const [user, loading, error] = useAuthState(auth);

  const navigation = useNavigation();
  const [metas, setMetas] = useState([]);

  useEffect(() => {
    const metasCollectionRef = collection(database, "metas");
    const q = query(metasCollectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });
      docs = docs.filter((meta) => meta.creator === user.email);
      setMetas(docs);
    });
    return unsubscribe;
  }, []);

  const crearMeta = () => {
    navigation.navigate("CreandoMeta");
  };
  const handleBorrar = (id) => {
    deleteDoc(doc(database, "metas", id));
  };
  const handleVerDetalle = (meta) => {
    navigation.navigate("meta");
  };

  return (
    <View style={styles.container}>
      <ScrollView scrollEnabled={true}>
        <View>
          <Text style={styles.welcome}>Lista de Metas</Text>
          {metas.map((meta) => (
            <TouchableOpacity
              key={meta.id}
              style={styles.metaBox}
              onPress={() => navigation.navigate("meta", { meta })}
            >
              <View style={styles.metaContainer}>
                <Text style={styles.metaTitulo}>
                  {meta.nombreMeta ? meta.nombreMeta : "Titulo acá"}
                </Text>
                <Text style={styles.metaDescripcion}>
                  {meta.descripcion ? meta.descripcion : "Descripción acá"}
                </Text>
                <Text style={styles.metaDescripcion}>
                  {meta.creator
                    ? "Creado por: " + meta.creator
                    : "No tiene creator."}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <Button onPress={crearMeta} title="Crear Meta" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
    padding: 10,
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  metaContainer: {
    borderWidth: 1,
    borderColor: "#d3d3d3",
    borderRadius: 4,
    padding: 10,
    marginVertical: 5,
  },
  metaTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  metaDescripcion: {
    fontSize: 16,
  },
  botonBorrar: {
    position: "absolute",
    right: 10,
    top: 10,
    backgroundColor: "red",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});

export default ListarMetas;
