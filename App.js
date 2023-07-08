//import { StatusBar } from "expo-status-bar";
import React from "react";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from "./src/login/LoginScreen";
import RegisterScreen from "./src/login/RegisterScreen";
import Main from "./src/main/Main";
import Feed from "./src/main/Feed";
import Camara from "./src/main/Camara";
import ListarMetas from "./src/main/ListarMetas";
import CreandoMeta from "./src/metas/CreandoMeta";
import meta from "./src/metas/meta";
import notification from "./src/metas/notification";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen options= {{ headerShown: false }} name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen options= {{ headerShown: false }} name="Main" component={Main} />
        <Stack.Screen options= {{ headerShown: false }} name="Feed" component={Feed} />
        <Stack.Screen options= {{ headerShown: false }} name="ListarMetas" component={ListarMetas} />
        <Stack.Screen name="CreandoMeta" component={CreandoMeta} />
        <Stack.Screen name="meta" component={meta} />
        <Stack.Screen name="Camara" component={Camara} />
        <Stack.Screen name="notification" component={notification}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
