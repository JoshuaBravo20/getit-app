import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import React from 'react';




const CreandoMeta = () => {
    const [nameMeta, setNameMeta] = React.useState('');

    const addMeta = () => {

        firestore(nameMeta).collection('metas').add({
            nombreMeta: nameMeta,
        })
      };

 
    
  return (
    <View>
        <View style={styles.container1}>
            <Text style={{fontSize:30, fontWeight: '400', textAlign:'center'}}>Nombre de la meta</Text>
            <TextInput onChangeText={(text) => setNameMeta(text)} placeholder="Crea un nombre a tu meta " style={styles.input}></TextInput>
            <Text style={{fontSize:17, fontWeight: '300', textAlign:'center', margin:10}}>¿Como desea subir su progreso?</Text>
            <Button  style={{fontSize:17, fontWeight: '400', color:'#FF7D61'}} onPress={addMeta} title='Crear Meta' />
        </View>
 
    </View>
  )
}

export default CreandoMeta
const styles = StyleSheet.create({

    input:{
        backgroundColor: 'white',
        width:350,
        height:45,
        borderColor: '#e8e8e8',
        borderWidth:1,
        borderRadius:5,
        paddingHorizontal:15,
        marginVertical: 10,
    },
    container1:{
        alignItems:'center',
        padding:30,
    },
    container2: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },

})
//kjlsdakljdkslajdsa
