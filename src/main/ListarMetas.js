import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  collection,
  query,
  onSnapshot,
  getFirestore,
} from "firebase/firestore";
import { firebaseConfig } from "../../firebase-config";
import { initializeApp } from "firebase/app";

function ListarMetas() {
  const app = initializeApp(firebaseConfig);
  const database = getFirestore(app);
  const navigation = useNavigation();
  const [metas, setMetas] = useState([]);

  useEffect(() => {
    const metasCollectionRef = collection(database, "metas");
    const q = query(metasCollectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });
      setMetas(docs);
    });
    return unsubscribe;
  }, []);

  const crearMeta = () => {
    navigation.navigate("CreandoMeta");
  };

  return (
    <View style={styles.container}>
      <ScrollView scrollEnabled={true}>
        <View>
          <Text style={styles.welcome}>Lista de Metas</Text>
          {metas.map((meta) => (
            <View key={meta.id} style={styles.metaContainer}>
              <Text style={styles.metaTitulo}>
                {meta.nombreMeta ? meta.nombreMeta : "Titulo acá"}
              </Text>
              <Text style={styles.metaDescripcion}>
                {meta.descripcion ? meta.descripcion : "Descripción acá"}
              </Text>
            </View>
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
});

export default ListarMetas;
