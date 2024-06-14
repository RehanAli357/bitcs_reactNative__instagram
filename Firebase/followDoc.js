import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  count,
  getDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "./index";

export const searchFollowing = async () => {
  try {
    const followingRef = collection(db, "users");
    const snapShot = await getDocs(followingRef);
    const docs = snapShot.docs.map((doc) => ({
      email: doc.data().email,
      userImage: doc.data().userImage,
      uId: doc.data().uId,
    }));
    return docs;
  } catch (error) {
    console.error("Error fetching following:", error);
    return [];
  }
};

export const followAccount = async (
  newUserId,
  crrUserId,
  newUserImage,
  newUserEmail,
  crrUserImage,
  crrUserEmail
) => {
  try {
    const followingCollectionRef = collection(
      db,
      "users",
      crrUserId,
      "following"
    );
    const queryRef = query(
      followingCollectionRef,
      where("newUserId", "==", newUserId)
    );
    const followingSnapshot = await getDocs(queryRef);
    if (!followingSnapshot.empty) {
      const followingDocId = followingSnapshot.docs[0].id;
      await deleteDoc(doc(db, "users", crrUserId, "following", followingDocId));
      await deleteDoc(
        doc(db, "users", newUserId, "follower", `${crrUserId + newUserId}`)
      );

      const followingRef = doc(db, "users", crrUserId);
      const followingDoc = await getDoc(followingRef);
      if (followingDoc.exists()) {
        const followingCount = followingDoc.data().following || 0;
        if (followingCount > 0) {
          await updateDoc(followingRef, {
            following: increment(-1),
          });
        }
      }

      const followerRef = doc(db, "users", newUserId);
      const followerDoc = await getDoc(followerRef);
      if (followerDoc.exists()) {
        const followerCount = followerDoc.data().follower || 0;
        if (followerCount > 0) {
          await updateDoc(followerRef, {
            follower: increment(-1),
          });
        }
      }
    } else {
      const followingCollectionRef = doc(
        db,
        "users",
        crrUserId,
        "following",
        `${newUserId + crrUserId}`
      );
      await setDoc(followingCollectionRef, {
        newUserId: newUserId,
        newUserImage: newUserImage,
        newUserEmail: newUserEmail,
      });
      const followerCollectionRef = doc(
        db,
        "users",
        newUserId,
        "follower",
        `${crrUserId + newUserId}`
      );
      await setDoc(followerCollectionRef, {
        newUserId: crrUserId,
        newUserEmail:crrUserEmail,
        newUserImage:crrUserImage
      });
      const followingRef = doc(db, "users", crrUserId);
      await updateDoc(followingRef, {
        following: increment(1),
      });
      const followerRef = doc(db, "users", newUserId);
      await updateDoc(followerRef, {
        follower: increment(1),
      });
    }
  } catch (err) {
    console.log(err.message);
  }
};


export const chekFollowing = async (uId,cId)=>{
  const followingRef = doc(db,"users",cId,"following",`${uId+cId}`);
  const followingDoc = await getDoc(followingRef);
  let flag;
  if(followingDoc.data()===undefined){
    flag=true
  }else{
    flag=false
  }
  return flag
}