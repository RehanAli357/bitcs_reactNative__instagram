import React from "react";
import { StyleSheet, View ,Text,ToastAndroid} from "react-native";
import Form from "../CommonComponent/Form";
import { loginUser } from "../Firebase/userDoc"; 
import { useDispatch } from "react-redux";
import { loginUserAction } from "../Redux/Actions/authActions";
const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const handleSubmit = async (formData, setFormData) => {
    try {
      let user = await loginUser(formData); 

      if (user) {
        dispatch(loginUserAction(user)); 
        navigation.navigate("Landing");
        setFormData({
          email: "",
          password: "",
        });

      }
    } catch (err) {
      ToastAndroid.show("Invalid UserName Password",ToastAndroid.LONG)
      console.log("Err", err.message);
    }
  };
  return (
    <View style={styles.container}>
      <Form type="login" onSubmit={handleSubmit} navigation={navigation} />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
});
