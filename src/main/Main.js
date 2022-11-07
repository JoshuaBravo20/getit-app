import { View, Text } from 'react-native';
import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//import Camara from './Camara';
import Feed from './Feed';
import Profile from './Profile';
import ListarMetas from './ListarMetas';

const Tab = createMaterialBottomTabNavigator();

const Main = () => {
  return (
    <Tab.Navigator labeled={false} >
      <Tab.Screen name="Feed" component={Feed}
      options={{
        tabBarIcon: ({color, size})=>(
            <MaterialCommunityIcons name="home" color={color} size={26}/>
        ),
      }}
      />
      <Tab.Screen name="ListarMetas" component={ListarMetas}
      options={{
        tabBarIcon: ({color, size})=>(
            <MaterialCommunityIcons name="flag-variant" color={color} size={26}/>
        ),
      }}
      />
      <Tab.Screen name="Perfil" component={Profile}
      options={{
        tabBarIcon: ({color, size})=>(
            <MaterialCommunityIcons name="account-circle" color={color} size={26}/>
        ),
      }}
      />
    </Tab.Navigator>
  )
}

export default Main;