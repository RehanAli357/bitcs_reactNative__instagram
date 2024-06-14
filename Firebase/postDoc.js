import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  setDoc,
  query,
  where,
  deleteDoc,
  increment,
  getDoc,
} from "firebase/firestore";
import { db } from "./index";

export const addPost = async (image, uId, caption, type) => {
  try {
    const res = await fetch(image);

    if (!res.ok) {
      throw new Error(`Failed to fetch the image. Status: ${res.status}`);
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.startsWith("image/")) {
      throw new Error(`Invalid content type: ${contentType}`);
    }

    const blob = await res.blob();

    const storage = getStorage();
    const fileName = `${new Date().getTime()}_${uId}`;
    const imageRef = ref(
      storage,
      `${type === "posts" ? "images" : "displayPic"}/${uId}/${fileName}`
    );

    await uploadBytes(imageRef, blob);
    const imageUrl = await getDownloadURL(imageRef);

    const date = new Date();
    const dateFormat = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
    const timeFormat = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    if (type === "posts") {
      const userPostsCollectionRef = collection(db, "users", uId, "posts");
      await addDoc(userPostsCollectionRef, {
        imageUrl: imageUrl,
        createDate: dateFormat,
        createdTime: timeFormat,
        likes: 0,
        caption: caption,
        path: imageRef.fullPath,
      })
        .then(() => {
        })
        .catch((err) => {
          console.log("err added", err.message);
        });
    } else {
      const updateUserProfileRef = doc(db, "users", uId);
      await updateDoc(updateUserProfileRef, {
        userImage: imageUrl,
      });
      const followingRef = collection(db, "users", uId, "following");
      const followingDoc = await getDocs(followingRef);
      let following = followingDoc.docs.map((doc) => doc.id);
      following.forEach(async (data) => {
        let result = data.replace(uId, "");
        let ref = doc(db, "users", result, "following", `${uId + result}`);
        try {
          await updateDoc(ref, {
            newUserImage: imageUrl,
          });
        } catch (error) {
          console.error(`Error updating document for user: ${result}`, error);
        }
      });
      return imageUrl;
    }
  } catch (error) {
    console.error("Error uploading post:", error.message);
    throw error;
  }
};

export const deletePost = async (path, imageId, userId) => {
  const storage = getStorage();
  const imageRef = ref(storage, path);
  try {
    await deleteObject(imageRef);
    const ref = doc(db, "users", userId, "posts", imageId);
    await deleteDoc(ref);
  } catch (error) {
    console.log(error.message);
  }
};

export const editPost = async (imageUrl, caption, userId, imageId, path) => {
  if (imageUrl.startsWith("data:")) {
    await deletePost(path, imageId, userId);
    await addPost(imageUrl, userId, caption, "posts");
  } else {
    const updateCaptionRef = doc(db, "users", userId, "posts", imageId);
    await updateDoc(updateCaptionRef, {
      caption: caption,
    });
  }
};

export const likeUnlikePost = async (cUserId, postId, userId) => {
  try {
    const likesCollectionRef = collection(db, "users", cUserId, "likes");
    const queryRef = query(
      likesCollectionRef,
      where("postId", "==", postId),
      where("userId", "==", userId)
    );

    const postsSnapshot = await getDocs(queryRef);
    const postRef = doc(db, "users", userId, "posts", postId);

    if (!postsSnapshot.empty) {
      const likeDocId = postsSnapshot.docs[0].id;
      await deleteDoc(doc(db, "users", cUserId, "likes", likeDocId));

      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        const currentLikes = postDoc.data().likes || 0;
        if (currentLikes > 0) {
          await updateDoc(postRef, {
            likes: increment(-1),
          });
        }
      }
    } else {
      const likeRef = doc(db, "users", cUserId, "likes", `${cUserId + postId}`);
      await setDoc(likeRef, {
        isLiked: true,
        postId: postId,
        userId: userId,
      });

      await updateDoc(postRef, {
        likes: increment(1),
      });
    }
  } catch (err) {
    console.log(err.message);
  }
};

export const deleteDp = async (uId) => {
  try {
    const updateUserProfileRef = doc(db, "users", uId);
    await updateDoc(updateUserProfileRef, {
      userImage: "",
    });
    return true;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getPosts = async (id, type) => {
  try {
    let allPosts = [];
    let allLikes = [];
    if (id && type === "userPost") {
      const postRef = collection(db, "users", id, "posts");
      const postsSnapshot = await getDocs(postRef);
      const userPosts = postsSnapshot.docs.map((doc) => ({
        ...doc.data(),
        userId: id,
      }));
      allPosts = [...allPosts, ...userPosts];
    } else {
      const usersRef = collection(db, "users", id, "following");
      const usersSnapshot = await getDocs(usersRef);
      const userRef = doc(db, "users", id);
      const userSnapShot = await getDoc(userRef);

      const users = usersSnapshot.docs.map((doc) => ({
        id: doc.data().newUserId,
        email: doc.data().newUserEmail,
        userImage: doc.data().newUserImage,
      }));
      users.push({
        id: id,
        email: userSnapShot.data().email,
        userImage: userSnapShot.data().userImage,
      });
      const likeRef = collection(db, "users", id, "likes");
      const likeSnapshot = await getDocs(likeRef);
      let likes = likeSnapshot.docs.map((doc) => ({ ...doc.data() }));
      allLikes = [...allLikes, ...likes];
      for (const user of users) {
        const postRef = collection(db, "users", user.id, "posts");
        const postsSnapshot = await getDocs(postRef);
        const userPosts = postsSnapshot.docs.map((doc) => ({
          ...doc.data(),
          imageId: doc.id,
          userId: user.id,
          userEmail: user.email,
          userImage: user.userImage,
        }));
        allPosts = [...allPosts, ...userPosts];
      }
    }
    return { allPosts: allPosts, allLikes: allLikes };
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};
