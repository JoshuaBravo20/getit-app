import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ProgressBarAndroid,
} from "react-native";
import { doc, updateDoc, getFirestore } from "firebase/firestore";
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
      setMeta((prevMeta) => ({
        ...prevMeta,
        deleted: true,
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

  const handleUploadPost = (meta) => {
    navigation.navigate("Camara", { meta });
  };

  const calcularProgresoMeta = (cantActual, cantTotal) => {
    if (cantActual === 0) return 0;
    if (cantActual > 0) {
      return (cantActual * 1) / cantTotal;
    }
  }
  const metaProgress = calcularProgresoMeta(meta.cantActualPost, meta.cantTotalPost);

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
        <Text>Progreso</Text>
        {meta.useProgressBar && (
          <ProgressBarAndroid
            styleAttr="Horizontal"
            indeterminate={false}
            progress={metaProgress}
          />
        )}
  
        {meta.uploadType.tasks && meta.tasks && meta.tasks.length > 0 && (
          <View>
            <Text>Tareas que debes cumplir:</Text>
            {meta.tasks.map((task, index) => (
              <Text key={index}>{task}</Text>
            ))}
          </View>
        )}
  
        <Button title="Subir Foto" onPress={() => handleUploadPost(meta)} />
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
