import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { doc, updateDoc, getFirestore, } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../firebase-config";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-root-toast";

function Meta({ route }) {
  const navigation = useNavigation();
  const metaState = useState(route.params.meta);
  const meta = metaState[0];
  const setMeta = metaState[1];  
  const app = initializeApp(firebaseConfig);
  const database = getFirestore(app);

  const handleBorrar = async () => {
    try {
      const metaRef = doc(database, "metas", meta.id);
      await updateDoc(metaRef, { deleted: true });
      setMeta(prevMeta => ({
        ...prevMeta,
        deleted: true
      }));
      Toast.show("Desactivada con exito!", {
        duration: Toast.durations.LONG,
      });
      returnPage();
    } catch (error) {
      console.error("Error al actualizar el documento:", error);
    }
  };
  const returnPage = () => {
    navigation.goBack();
  };


  console.log(meta);

  return (
    <View>
      <View style={styles.metaContainer}>
        <Text style={styles.metaTitulo}>
          {meta.nombreMeta ? meta.nombreMeta : "Titulo acá"}
        </Text>
        <Text style={styles.metaDescripcion}>
          {meta.descripcion ? meta.descripcion : "Descripción acá"}
        </Text>
        <Text style={styles.metaDescripcion}>
          {meta.creator ? "Creado por: " + meta.creator : "No tiene creador."}
        </Text>
        <Button title="subir meta"  />
        <Button title="Desactivar Meta" onPress={handleBorrar} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  texto: {
    fontSize: 18,
    marginBottom: 10,
  },
  tareas: {
    marginTop: 10,
  },
  tarea: {
    fontSize: 16,
    marginBottom: 5,
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

export default Meta;
