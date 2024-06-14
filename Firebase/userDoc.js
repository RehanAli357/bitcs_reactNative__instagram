import { db } from "./index";
import { getDoc, setDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { auth } from "./index";
import { hashPassowrd } from "../HashedPassword/EncryptPassowd";

export const signInUser = async (data) => {
  try {
    const docRef = doc(db, "users", data.uid);
    await setDoc(docRef, {
      email: data.email,
      password: data.password,
      uId: data.uid,
      userImage: "",
      following:0,
      follower:0
    });
    return { data, id: docRef.id };
  } catch (err) {
    throw err;
  }
};

export const loginUser = async (data) => {
  const hash = hashPassowrd(data.password);
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      hash
    );
    const uid = userCredential.user.uid;

    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

export const logoutUser = async () => {
  await auth.signOut();
};

export const updateEmailUser = async (newEmail, id) => {
  const user = auth.currentUser;

  if (user) {
    try {
      await updateEmail(user, newEmail);
      const userRef = doc(db, "users", id);
      await updateDoc(userRef, { email: newEmail });
      console.log("Updated Successfully");
    } catch (error) {
      console.error(
        "Error updating email or Firestore document:",
        error.message
      );
    }
  } else {
    console.error("No user is signed in");
  }
};

export const updatePasswordUser = async (newPassword, id) => {
  const user = auth.currentUser;
  const hash = hashPassowrd(newPassword)
  if (user) {
    try {
      await updatePassword(user, hash);
      const userRef = doc(db, "users", id);
      await updateDoc(userRef, { password: hash });
      return hash;
    } catch (error) {
      console.error(
        "Error updating password or Firestore document:",
        error.message
      );
    }
  } else {
    console.error("No user is signed in");
  }
};

export const deleteAccount = async (id) => {
  const user = auth.currentUser;
  if (user) {
    try {
      await user.delete();
      const userRef = doc(db, "users", id);
      await deleteDoc(userRef);
    } catch (err) {
      console.log(err.message);
    }
  }
};
