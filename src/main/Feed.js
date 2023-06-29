import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigation } from "@react-navigation/native";
import {
  collection,
  query,
  onSnapshot,
  getFirestore,
  orderBy,
  doc,
  updateDoc,
  arrayUnion,
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
  const [likedPosts, setLikedPosts] = useState([]);
  const [likedEmails, setLikedEmails] = useState(new Set());
  const [comment, setComment] = useState("");


  useEffect(() => {
    const postCollectionRef = collection(database, "post");
    const q = query(postCollectionRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });

      setPosts(docs);
    });
    return unsubscribe;
  }, []);

  const handleLikePost = async (postId, email) => {
    if (!likedEmails.has(email)) {
      if (!likedPosts.includes(postId)) {
        const updatedPosts = posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              likes: post.likes + 1,
            };
          }
          return post;
        });

        setPosts(updatedPosts);
        setLikedPosts([...likedPosts, postId]);
        setLikedEmails(new Set([...likedEmails, email]));

        const postRef = doc(database, "post", postId);
        await updateDoc(postRef, {
          likes: updatedPosts.find((post) => post.id === postId).likes,
        });
      }
    }
  };

  const handleAddComment = async (postId, commentContent) => {
    const comment = {
      user: currentUserEmail, // El correo electrónico del usuario actual
      content: commentContent
    };
  
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, comment]
        };
      }
      return post;
    });
  
    setPosts(updatedPosts);
    setComment("");
  
    const postRef = doc(database, "post", postId);
    await updateDoc(postRef, { comments: arrayUnion(comment) });
  };

  return (
    <View style={styles.container}>
      <ScrollView scrollEnabled={true}>
        <View>
          <Text style={styles.welcome}>Feed</Text>
          {posts.map((post) => (
            <TouchableOpacity
              key={post.id}
              style={styles.metaBox}
              onPress={() => handleLikePost(post.id)}
            >
              <View style={styles.postContainer}>
                <Text style={styles.createdBy}>Creado por: {post.creator}</Text>
                <Image
                  source={{
                    uri: post.imgUri,
                  }}
                  alt="Alternate Text"
                  size="sm"
                  style={styles.postImg}
                />
                <Text style={styles.likes}>
                  Likes: {post.likes}{" "}
                  {likedPosts.includes(post.id) ? "❤️" : "🤍"}
                </Text>
                <Text style={styles.description}>
                  {post.description ? post.description : "No hay descripción"}
                </Text>
                <TextInput
                  placeholder="Ingrese un comentario"
                  value={comment}
                  onChangeText={setComment}
                  style={styles.commentInput}
                />
                <Button
                  title="Comentar"
                  onPress={() => handleAddComment(post.id, comment)}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
    padding: 20,
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  postContainer: {
    borderWidth: 2,
    borderColor: "#d3d3d3",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: 321,
    alignSelf: "center",
  },
  likes: {
    fontSize: 15,
    fontWeight: "bold",
  },
  comments: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 20,
  },
  description: {
    fontSize: 18,
    marginBottom: 5,
    marginTop: 8,
    textAlign: "left",
  },
  createdBy: {
    fontSize: 13,
    marginBottom: 20,
    textAlign: "left",
    fontWeight: "bold",
  },
  postImg: {
    width: 300,
    height: 300,
    alignSelf: "center",
    marginBottom: 15,
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
