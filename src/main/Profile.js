import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
  ScrollView,
  TextInput,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { getAuth, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  query,
  onSnapshot,
  getFirestore,
  orderBy,
  doc,
  updateDoc,
  arrayUnion
} from "firebase/firestore";
import { firebaseConfig } from "../../firebase-config";
import { initializeApp } from "firebase/app";

const Profile = () => {
  const [profileImage, setProfileImage] = useState(
    require("../../assets/blank-profile.png")
  );
  const app = initializeApp(firebaseConfig);
  const database = getFirestore(app);
  const auth = getAuth(app);
  const [user, loading, error] = useAuthState(auth);
  const email = user.email;
  const displayName = user.displayName;
  const [numeroMetas, setNumeroMetas] = React.useState("");
  const [posts, setPosts] = React.useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [comment, setComment] = useState("");
  const [likedEmails, setLikedEmails] = useState(new Set());

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

  useEffect(() => {
    const metasCollectionRef = collection(database, "metas");
    const q = query(metasCollectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });
      docs = docs.filter(
        (meta) => meta.creator === user.email && meta.deleted === false
      );

      setNumeroMetas(docs.length);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const postCollectionRef = collection(database, "post");
    const q = query(postCollectionRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });
      docs = docs.filter((post) => post.creator === user.email);
      setPosts(docs);
    });
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Perfil</Text>
      <View style={styles.profileContainer}>
        <TouchableOpacity>
          <Image source={profileImage} style={styles.profileImage} />
        </TouchableOpacity>
        <Text style={styles.profileInfo}>Nombre: {displayName}</Text>
        <Text style={styles.profileInfo}>Correo: {email}</Text>
        <Text style={styles.profileInfo}>
          Cantidad metas activas: {numeroMetas}
        </Text>
      </View>

      <Text style={styles.heading}>Posts</Text>
      <View style={styles.container}>
        <ScrollView scrollEnabled={true}>
          <View>
            {posts.map((post) => (
              <TouchableOpacity
                key={post.id}
                style={styles.metaBox}
                onPress={() => handleLikePost(post.id)}
              >
                <View style={styles.postContainer}>
                  <Text style={styles.createdBy}>
                    Creado por: {post.creator}
                  </Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 25,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  profileInfo: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
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

export default Profile;
