import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

function Meta({ route }) {
  const meta = route.params.meta;
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
          {meta.creator ? "Creado por: " + meta.creator : "No tiene creator."}
        </Text>
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
});

export default Meta;
