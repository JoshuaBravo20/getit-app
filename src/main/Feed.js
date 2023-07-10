import React, { useState, useEffect } from "react";
import Toast from "react-native-root-toast";
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
  where,
  addDoc,
  serverTimestamp
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
  const [user, loading, error] = useAuthState(auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMetas, setFilteredMetas] = useState([]);
  const [metas, setMetas] = useState([]);

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

  useEffect(() => {
    const metaCollectionRef = collection(database, "metas");
    const q = query(
      metaCollectionRef,
      where("nombreMeta", ">=", searchTerm),
      orderBy("nombreMeta")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let metas = [];
      querySnapshot.forEach((doc) => {
        metas.push({ id: doc.id, ...doc.data() });
      });

      setFilteredMetas(metas);
    });
    return unsubscribe;
  }, [searchTerm]);

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
    setPosts(
      updatedPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [comment, ...post.comments],
          };
        }
        return post;
      })
    );
  };

  const handleAddComment = async (postId, commentContent) => {
    const comment = {
      creator: user.email,
      content: commentContent,
    };

    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, comment],
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    setComment("");

    const postRef = doc(database, "post", postId);
    await updateDoc(postRef, { comments: arrayUnion(comment) });
  };

  const handleSearchedMeta = async (meta) => {
    if (meta.creator !== user.email) {
      const metaCollectionRef = collection(database, "metas");
      const creationDate = serverTimestamp();
      const metaClone = {
        nombreMeta: meta.nombreMeta,
        descripcion: meta.descripcion,
        creator: user.email,
        uploadType: meta.uploadType ? meta.uploadType : false,
        tasks: meta.tasks,
        deleted: meta.deleted ? meta.deleted : false,
        usePhotoUpload: meta.usePhotoUpload ? meta.usePhotoUpload : false,
        useProgressBar: meta.useProgressBar ? meta.useProgressBar : false,
        creationDate
      };

      addDoc(metaCollectionRef, metaClone)
        .then((docRef) => {
          console.log("Documento clonado agregado con ID:", docRef.id);
          Toast.show("Guardada con éxito!", {
            duration: Toast.durations.LONG,
          });
        })
        .catch((error) => {
          console.error("Error al agregar documento:", error);
        });
    } else {
      Toast.show("Ya tienes esta meta agregada a tu lista!", {
        duration: Toast.durations.LONG,
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView scrollEnabled={true}>
        <View>
          <Text style={styles.welcome}>Feed</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar metas..."
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
          {(searchTerm !== "" ? filteredMetas : metas).map((meta) => (
            <TouchableOpacity
              key={meta.id}
              style={styles.metaBox}
              onPress={() => handleSearchedMeta(meta)}
            >
              <View style={styles.metaContainer}>
                <Text style={styles.createdBy}>Creado por: {meta.creator}</Text>
                <Text style={styles.metaName}>{meta.nombreMeta}</Text>
                <Text style={styles.metaDescription}>{meta.descripcion}</Text>
              </View>
            </TouchableOpacity>
          ))}
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
                <View style={styles.commentsContainer}>
                  {post.comments.map((comment, index) => (
                    <View style={styles.comment} key={index}>
                      <Text style={styles.commentCreator}>
                        {comment.creator}:<Text>{comment.content}</Text>
                      </Text>
                    </View>
                  ))}
                </View>
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
  commentsContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },

  comment: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },

  commentCreator: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  searchContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 5,
    backgroundColor: "#f5f5f5",
  },
  searchInput: {
    height: 40,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
  },
});

export default Feed;
