import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
//import { firestore } from 'firebase/firestore';
import { firebaseConfig } from '../../firebase-config';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeApp } from "firebase/app";

import React from 'react';


const CreandoMeta = () => {
    const app = initializeApp(firebaseConfig);
    const database = getFirestore(app);
    const metasCollectionRef = collection(database, 'metas');
    const [nameMeta, setNameMeta] = React.useState('');
    const [descripcionMeta, setDescripcionMate] = React.useState('');

    const addMeta = () => {
        const nuevaMeta = {
            nombreMeta: nameMeta,
<<<<<<< HEAD
        })
=======
            descripcion: descripcionMeta
        }
        addDoc(metasCollectionRef, nuevaMeta)
            .then((docRef) => {
                console.log("Documento agregado con ID:", docRef.id);
            })
            .catch((error) => {
                console.error("Error al agregar documento:", error);
            });
>>>>>>> 13631eab5e6757f38abef48ac1640f1863dd33cf
    };



    return (
        <View>
            <View style={styles.container1}>
                <Text style={{ fontSize: 30, fontWeight: '400', textAlign: 'center' }}>Nombre de la meta</Text>
                <TextInput onChangeText={(text) => setNameMeta(text)} placeholder="Crea un nombre a tu meta " style={styles.input}></TextInput>
<<<<<<< HEAD
=======
                <Text style={{ fontSize: 30, fontWeight: '400', textAlign: 'center' }}>Descripción de la meta</Text>
                <TextInput onChangeText={(text) => setDescripcionMate(text)} placeholder="Escribe una descripción " style={styles.input}></TextInput>
>>>>>>> 13631eab5e6757f38abef48ac1640f1863dd33cf
                <Text style={{ fontSize: 17, fontWeight: '300', textAlign: 'center', margin: 10 }}>¿Como desea subir su progreso?</Text>
                <Button style={{ fontSize: 17, fontWeight: '400', color: '#FF7D61' }} onPress={addMeta} title='Crear Meta' />
            </View>

        </View>
    )
}

export default CreandoMeta
const styles = StyleSheet.create({

    input: {
        backgroundColor: 'white',
        width: 350,
        height: 45,
        borderColor: '#e8e8e8',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 15,
        marginVertical: 10,
    },
    container1: {
        alignItems: 'center',
        padding: 30,
    },
    container2: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },

})
//kjlsdakljdkslajdsa
