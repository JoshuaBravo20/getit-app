import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";


const ConfigurarNotificacion = () => {
  const navigation = useNavigation();
  const [frecuencia, setFrecuencia] = useState(""); // Estado para almacenar la frecuencia seleccionada
  
  const guardarNotificacion = () => {
    // Lógica para guardar la configuración de la notificación
  
    if (frecuencia) {
      // Configurar la notificación programada según la frecuencia seleccionada
  
      let fechaNotificacion = new Date();
  
      // Configurar la fecha y hora para la notificación según la frecuencia seleccionada
      if (frecuencia === "diaria") {
        fechaNotificacion.setDate(fechaNotificacion.getDate() + 1);
      } else if (frecuencia === "semanal") {
        fechaNotificacion.setDate(fechaNotificacion.getDate() + 7);
      } else if (frecuencia === "mensual") {
        fechaNotificacion.setMonth(fechaNotificacion.getMonth() + 1);
      }
  
      // Configurar opciones de la notificación
      const opcionesNotificacion = {
        title: "Recordatorio de Meta",
        message: "¡Recuerda trabajar en tu meta diariamente!",
      };
  
      // Programar la notificación local
      /* const details = {
        channelId: "channel-id",
        foreground: false, // BOOLEAN: If the notification was received in foreground or not
        userInteraction: false, // BOOLEAN: If the notification was opened by the user from the notification area or not
        message: 'My Notification Message', // STRING: The notification message
        data: {}, // OBJECT: The push data or the defined userInfo in local notifications
      } */
      //PushNotification.localNotification(details)
    }
  
    navigation.navigate("Main");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurar Notificación</Text>
      <Text style={styles.subtitle}>Seleccione la frecuencia de la notificación:</Text>
      <Button
        title="Una vez al día"
        onPress={() => setFrecuencia("diaria")}
      />
      <Button
        title="Una vez a la semana"
        onPress={() => setFrecuencia("semanal")}
      />
      <Button
        title="Una vez al mes"
        onPress={() => setFrecuencia("mensual")}
      />
      <Button title="Guardar" onPress={guardarNotificacion} />
    </View>
  );
};

export default ConfigurarNotificacion;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 16,
  },
});
