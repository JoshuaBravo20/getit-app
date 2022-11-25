

import { View, Text, TextInput, StyleSheet, Button, ScrollView, } from 'react-native';
import React, { Component } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ListItem } from 'react-native-elements';

import { collection, firestore, getFirestore, doc, getDocFromCache  } from 'firebase/firestore';
import { database } from '../../firebase-config';
import { firebaseConfig } from '../../firebase-config';


function ListarMetas(){
    const navigation =useNavigation();
    const [metas, setMetas] = React.useState([]);
    const docRef = doc(database, "metas");
    const ListMetas = async() =>{
        try {
            const collectionRef = collection(database, 'metas');
            const doc = await getDocFromCache(docRef);
          
            // Document was found in the cache. If no cached document exists,
            // an error will be returned to the 'catch' block below.
            console.log("Cached document data:", doc.data());
          } catch (e) {
            console.log("Error getting cached document:", e);
          }
    }
 

    const crearMeta = () =>{
        navigation.navigate('CreandoMeta');

    }

  return (
    <View style={styles.container}>
        <View >
            <Text style={styles.welcome} > Crea tu meta </Text>
            <Text style={styles.instructions} > Aqui van el listado de metas </Text>
            <Text styles >{metas.map(metas => <Product key={metas.id} {...metas} />)}</Text>
           
        </View>
        <View>
        
            <Button onPress={crearMeta}  style={{fontSize:17, fontWeight: '400', color:'#FF7D61'}} title='Crear Meta' />
        </View>
    </View>
  )
}

export default ListarMetas

const styles = StyleSheet.create({
    instructions:{
        textAlign: 'center',
        color: '#333333',
        margin:10,
    },
    welcome:{
        fontSize: 20,
        textAlign:'center',
        margin:10,
    },
    button:{
        width:250,
        height:40,
        borderRadius:10,
        backgroundColor:'#FFA495',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        borderColor:'#fff',
        borderWidth: 1,
    },

    container: {
      flex: 2,

    },
})
