import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { database } from '../../firebase-config';

function ListarMetas() {
  const navigation = useNavigation();
  const [metas, setMetas] = useState([]);

  useEffect(() => {
    const q = query(collection(database, 'metas'));
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
    navigation.navigate('CreandoMeta');
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.welcome}>Lista de Metas</Text>
        <ScrollView>
          {metas.map((meta) => (
            <View key={meta.id} style={styles.metaContainer}>
              <Text style={styles.metaTitulo}>{meta.titulo}</Text>
              <Text style={styles.metaDescripcion}>{meta.descripcion}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <View>
        <Button onPress={crearMeta} title="Crear Meta" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  metaContainer: {
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 4,
    padding: 10,
    marginVertical: 5,
  },
  metaTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  metaDescripcion: {
    fontSize: 16,
  },
});

export default ListarMetas;
