import { View, Text, StyleSheet, Pressable } from 'react-native';
import React from 'react';


const CustomButton = ({onPress, text, type = "PRIMERY", bgColor, fgColor}) => {
  return (
    <Pressable 
    onPress={onPress} 
    style={[
        styles.container, 
        styles["container_${type}"],
        bgColor ? {backgroundColor: bgColor}: {} ]}>
      <Text 
      style={[
        styles.text, 
        styles["text_${type}"],
        fgColor ? {color: fgColor}: {} ]}>{text}</Text>
    </Pressable>
  )
}
const styles =StyleSheet.create({
    container: {
        
        width:350,
        padding:15,
        marginVertical:5,
        alignItems: 'center',
        borderRadius:10,

    },
    container_PRIMERY:{
        backgroundColor: '#FF7D61',

    },

    Container_SECONDARY:{
      borderColor:'#FF7D61',
      borderWidth:2,
    },

    container_TERTIARY:{

    },

    text:{
        fontWeight: 'bold',
        color:'white',

    },

    text_SECONDARY:{
      COLOR: '#FF7D61',
    },
    
    text_TERTIARY:{
        color: 'gray'
    },


})

export default CustomButton;