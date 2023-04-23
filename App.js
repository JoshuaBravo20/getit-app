//import { StatusBar } from "expo-status-bar";
import React from "react";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from "./src/login/LoginScreen";
import RegisterScreen from "./src/login/RegisterScreen";
//import Home from "./src/main/home";
import Main from "./src/main/Main";
import Feed from "./src/main/Feed";
//import Camara from "./src/main/Camara";
import ListarMetas from "./src/main/ListarMetas";
import CreandoMeta from "./src/metas/CreandoMeta";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="Feed" component={Feed} />
        <Stack.Screen name="ListarMetas" component={ListarMetas} />
        <Stack.Screen name="CreandoMeta" component={CreandoMeta} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}




