import React from "react";
import Toast from "react-native-root-toast";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Switch,
  ScrollView,
} from "react-native";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { firebaseConfig } from "../../firebase-config";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const CreandoMeta = () => {
  const app = initializeApp(firebaseConfig);
  const database = getFirestore(app);
  const auth = getAuth(app);
  const [user, loading, error] = useAuthState(auth);

  const navigation = useNavigation();
  const [nameMeta, setNameMeta] = React.useState("");
  const [descripcionMeta, setDescripcionMate] = React.useState("");
  const [useProgressBar, setUseProgressBar] = React.useState(false);
  const [usePhotoUpload, setUsePhotoUpload] = React.useState(false);
  const [useBoth, setUseBoth] = React.useState(false);
  const [uploadType, setUploadType] = React.useState(false);
  const [taskName, setTaskName] = React.useState("");
  const [tasks, setTasks] = React.useState([]);
  const [addingTask, setAddingTask] = React.useState(false);
  const [newTasks, setNewTask] = React.useState("");
  const [deleted, setDeleted] = React.useState(false);
  const [cantTotalPost, setCantTotalPost] = React.useState("");
  
  const addMeta = () => {
    const metasCollectionRef = collection(database, "metas");
    const creationDate = serverTimestamp();
    const nuevaMeta = {
      nombreMeta: nameMeta,
      descripcion: descripcionMeta,
      creator: user.email,
      uploadType: uploadType, 
      tasks: tasks,
      deleted: deleted,
      creationDate,
      cantTotalPost,
      cantActualPost: 0
    };

    if (useProgressBar) {
      nuevaMeta.useProgressBar = true;
    }

    if (usePhotoUpload) {
      nuevaMeta.usePhotoUpload = true;
    }

    addDoc(metasCollectionRef, nuevaMeta)
      .then((docRef) => {
        console.log("Documento agregado con ID:", docRef.id);
        Toast.show("Creada con éxito!", {
          duration: Toast.durations.LONG,
        });
        
      })
      .catch((error) => {
        console.error("Error al agregar documento:", error);
      });
    
      navigation.goBack();
  };

  const addTask = () => {
    const tasksCopy = [...tasks];
    tasksCopy.push(newTasks);
    setTasks(tasksCopy);
    setNewTask("");
  };

  const crearMeta = () => {
    navigation.navigate("CreandoMeta");
  };

  return (
    <View>
      <ScrollView scrollEnabled={true}>
        <View style={styles.container1}>
          <Text
            style={{ fontSize: 30, fontWeight: "150", textAlign: "center" }}
          >
            Nombre de la meta
          </Text>
          <TextInput
            onChangeText={(text) => setNameMeta(text)}
            placeholder="Crea un nombre a tu meta "
            style={styles.input}
          ></TextInput>
          <Text
            style={{ fontSize: 30, fontWeight: "400", textAlign: "center" }}
          >
            Descripción de la meta
          </Text>
          <TextInput
            onChangeText={(text) => setDescripcionMate(text)}
            placeholder="Escribe una descripción "
            style={styles.input}
          ></TextInput>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "300",
              textAlign: "center",
              margin: 10,
            }}
          >
            ¿Como desea subir su progreso?
          </Text>
          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>Barra de progreso</Text>
            <Switch
              value={useProgressBar}
              onValueChange={setUseProgressBar}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={useProgressBar ? "#f5dd4b" : "#f4f3f4"}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>Subir fotos</Text>
            <Switch
              value={usePhotoUpload}
              onValueChange={setUsePhotoUpload}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={usePhotoUpload ? "#f5dd4b" : "#f4f3f4"}
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>
              Agregar tareas
            </Text>
            <Switch
              value={uploadType.tasks}
              onValueChange={(value) =>
                setUploadType({ ...uploadType, tasks: value })
              }
            />
          </View>
          {uploadType.tasks && (
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: "200",
                    textAlign: "center",
                    margin: 10,
                  }}
                >
                  ¿Quieres agregar tareas?
                </Text>
                <Button title="+" onPress={() => setAddingTask(true)} />
              </View>
              {addingTask && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TextInput
                    onChangeText={(text) => setNewTask(text)}
                    placeholder="Agrega una tarea"
                    style={{ ...styles.input2 }}
                  />
                  <Button title="Agregar" onPress={() => addTask()} />
                </View>
              )}
              {tasks.length > 0 && (
                <View style={{ marginTop: 10 }}>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: "300",
                      textAlign: "center",
                      marginBottom: 10,
                    }}
                  >
                    Tareas agregadas:
                  </Text>
                  {tasks.map((task, index) => (
                    <Text key={index} style={{ fontSize: 16 }}>
                      {task}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}
          <Text
            style={{ fontSize: 30, fontWeight: "400", textAlign: "center" }}
          >
            ¿Cuantos post vas a subir?
          </Text>
          <TextInput
            onChangeText={(text) => setCantTotalPost(parseInt(text))}
            placeholder="Cantidad"
            style={styles.input}
            keyboardType="numeric"
            maxLength={3}
          ></TextInput>

          <Button
            style={{ fontSize: 17, fontWeight: "400", color: "#FF7D61" }}
            onPress={addMeta}
            title="Crear Meta"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default CreandoMeta;

const styles = StyleSheet.create({
  input: {
    backgroundColor: "white",
    width: 350,
    height: 45,
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  input2: {
    backgroundColor: "white",
    width: 235,
    height: 45,
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  container1: {
    alignItems: "center",
    padding: 30,
  },
  container2: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 20,
  },
  switchText: {
    fontSize: 17,
    fontWeight: "300",
    textAlign: "left",
    flex: 1,
  },
  addButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  addButtonText: {
    fontSize: 17,
    fontWeight: "400",
    color: "#FF7D61",
    marginLeft: 5,
  },
  taskListContainer: {
    marginTop: 10,
    width: "100%",
    paddingHorizontal: 10,
  },
  taskListItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  taskListItemText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  taskListItemButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#FF7D61",
  },
  taskListItemButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
