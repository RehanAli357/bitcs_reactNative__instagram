import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from "react-native";
import React, { useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import {
  updateEmail,
  updatePassword,
  logOut,
} from "../Redux/Actions/authActions";
import {
  deleteAccount,
  updateEmailUser,
  updatePasswordUser,
} from "../Firebase/userDoc";

import { compareHashPassword } from "../HashedPassword/EncryptPassowd";

const PrivacyScreen = ({ navigation }) => {
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deleteEmail, setDeleteEmail] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [isShow, setIsShow] = useState({
    email: false,
    password: false,
    delete: false,
  });

  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const updateUserEmail = async () => {
    if (
      currentEmail !== newEmail &&
      currentEmail.length > 0 &&
      newEmail.length > 0 &&
      /\S+@\S+\.\S+/.test(currentEmail) &&
      /\S+@\S+\.\S+/.test(newEmail)
    ) {
      await updateEmailUser(newEmail, auth.id)
        .then(() => {
          dispatch(updateEmail(newEmail));
          navigation.navigate("Login");
        })
        .catch((err) => {
          console.log(err.message);
          ToastAndroid.show("Unable to update email",ToastAndroid.LONG)
        });
    } else {
      ToastAndroid.show("Please provide valid email",ToastAndroid.LONG)
    }
  };
  const updateUserPassword = async () => {
    if (
      currentPassword.length > 6 &&
      newPassword.length > 6 &&
      compareHashPassword(currentPassword, auth.password)
    ) {
      await updatePasswordUser(newPassword, auth.id)
        .then((data) => {

          dispatch(updatePassword(data));
          navigation.navigate("Login");
        })
        .catch((err) => {
          console.log(err.message);
          ToastAndroid.show("Unable to update password",ToastAndroid.LONG)
        });
    } else {
      ToastAndroid.show("Password must be least 6 character",ToastAndroid.LONG)
    }
  };

  const deleteUserAccount = async () => {
    if (
      /\S+@\S+\.\S+/.test(deleteEmail) &&
      deleteEmail === auth.email &&
      deletePassword.length > 6 &&
      compareHashPassword(deletePassword, auth.password)
    ) {
      await deleteAccount(auth.id).then(() => {
        dispatch(logOut());
        navigation.navigate("Login");
      }).catch((err)=>{
        ToastAndroid.show("Unable to delete the account",ToastAndroid.LONG);
        console.log(err.message);
      });
    } else {
      ToastAndroid.show("Enter valid email and password",ToastAndroid.LONG)
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView style={{ height: "100vh", paddingBottom: 90 }}>
        <View style={styles.section}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Update Email</Text>
            <TouchableOpacity
              onPress={() =>
                setIsShow((pdata) => ({
                  email: !pdata.email,
                  password: false,
                  delete: false,
                }))
              }
            >
              <Image
                source={
                  !isShow.email
                    ? require("../assets/add.png")
                    : require("../assets/close.png")
                }
                style={styles.headerIcon}
              />
            </TouchableOpacity>
          </View>
          {isShow.email && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Current Email"
                onChangeText={setCurrentEmail}
                value={currentEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="New Email"
                onChangeText={setNewEmail}
                value={newEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={updateUserEmail} style={styles.button}>
                <Text style={styles.buttonText}>Update Email</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Update Password</Text>
            <TouchableOpacity
              onPress={() =>
                setIsShow((pdata) => ({
                  email: false,
                  password: !pdata.password,
                  delete: false,
                }))
              }
            >
              <Image
                source={
                  !isShow.password
                    ? require("../assets/add.png")
                    : require("../assets/close.png")
                }
                style={styles.headerIcon}
              />
            </TouchableOpacity>
          </View>
          {isShow.password && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Current Password"
                onChangeText={setCurrentPassword}
                value={currentPassword}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder="New Password"
                onChangeText={setNewPassword}
                value={newPassword}
                secureTextEntry
              />
              <TouchableOpacity
                onPress={updateUserPassword}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Update Password</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Delete Account</Text>
            <TouchableOpacity
              onPress={() =>
                setIsShow((pdata) => ({
                  email: false,
                  password: false,
                  delete: !pdata.delete,
                }))
              }
            >
              <Image
                source={
                  !isShow.delete
                    ? require("../assets/add.png")
                    : require("../assets/close.png")
                }
                style={styles.headerIcon}
              />
            </TouchableOpacity>
          </View>
          {isShow.delete && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Current Email"
                onChangeText={setDeleteEmail}
                value={deleteEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Current Password"
                onChangeText={setDeletePassword}
                value={deletePassword}
                autoCapitalize="none"
                secureTextEntry
              />
              <TouchableOpacity
                onPress={deleteUserAccount}
                style={[styles.button, styles.deleteButton]}
              >
                <Text style={styles.buttonText}>Delete Account</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {/* <PrivacyForm name={"Email"}/> */}
      </ScrollView>
    </View>
  );
};

export default PrivacyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  headerIcon: {
    width: 20,
    height: 20,
  },
  inputContainer: {
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: "#cccccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#f44336",
  },
});
