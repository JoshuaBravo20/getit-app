import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  TouchableOpacity,
  Image
} from "react-native";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigation } from "@react-navigation/native";
import {
  collection,
  query,
  onSnapshot,
  getFirestore,
} from "firebase/firestore";
import { firebaseConfig } from "../../firebase-config";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const Feed = () => {
  const app = initializeApp(firebaseConfig);
  const database = getFirestore(app);
  const auth = getAuth(app);

  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const postCollectionRef = collection(database, "post");
    const q = query(postCollectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });

      setPosts(docs);
    });
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView scrollEnabled={true}>
        <View>
          <Text style={styles.welcome}>Feed</Text>
          {posts.map((post) => (
            <TouchableOpacity
              key={post.id}
              style={styles.metaBox}
            >
              <View style={styles.postContainer}>
                <Text style={styles.createdBy}>
                  Creado por: {post.creator}
                </Text>
                <Image source={{
                  uri: post.imgUri
                }} alt="Alternate Text" size="sm" style={styles.postImg} />
                <Text style={styles.likes}>
                  Likes: {post.likes}
                </Text>
                <Text style={styles.description}>
                  {post.description ? post.description : "Descripcion de post acá"}
                </Text>
                <Text style={styles.comments}>
                  Comentarios: {post.comments.length ? `${post.comments[0].user + ' dice: ' + post.comments[0].content}` : 'No hay comentarios aún.'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
    padding: 10,
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  postContainer: {
    borderWidth: 1,
    borderColor: "#d3d3d3",
    borderRadius: 4,
    padding: 10,
    marginVertical: 5,
    width: 500,
    alignSelf: "center"
  },
  likes: {
    fontSize: 15,
    fontWeight: "bold",
  },
  comments: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 20
  },
  description: {
    fontSize: 18,
    marginBottom: 5,
    marginTop: 8,
    textAlign: "left"
  },
  createdBy: {
    fontSize: 13,
    marginBottom: 15,
    textAlign: "left",
    fontWeight: "bold"
  },
  postImg: {
    width: 300,
    height: 300,
    alignSelf: "center",
    marginBottom: 15
  },
  metaDescripcion: {
    fontSize: 16,
  },
  botonBorrar: {
    position: "absolute",
    right: 10,
    top: 10,
    backgroundColor: "red",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});

export default Feed;