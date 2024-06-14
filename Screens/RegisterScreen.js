import React from "react";
import { StyleSheet, ToastAndroid, View } from "react-native";
import { signInUser } from "../Firebase/userDoc";
import Form from "../CommonComponent/Form";
import { useDispatch } from "react-redux";
import { addUserId } from "../Redux/Actions/authActions";
import { auth } from "../Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { hashPassowrd } from "../HashedPassword/EncryptPassowd";

const RegisterScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const handleSubmit = async (formData, setFormData) => {
    const {  email, password } = formData;
    const hash = hashPassowrd(password)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, hash);
      const userData = await signInUser({
        email: email,
        password: hash,
        uid: userCredential.user.uid,
      });

      if (userData) {
        dispatch(addUserId(userData.id))
        setFormData({
          email: "",
          password: "",
        });
        navigation.navigate("Login");
      }
    } catch (err) {
      ToastAndroid.show("Unable to create new account",ToastAndroid.LONG)
      console.log(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Form type="Register" onSubmit={handleSubmit} navigation={navigation} />
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
});
