import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { useNavigation } from '@react-navigation/native';
import React from 'react';

function ListarMetas(){
    const navigation =useNavigation();

    const crearMeta = () =>{
        navigation.navigate('CreandoMeta');

    }


  return (
    <View style={styles.container}>
        <View >
            <Text style={styles.welcome} > Crea tu meta </Text>
            <Text style={styles.instructions} > Aqui van el listado de metas </Text>
            
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