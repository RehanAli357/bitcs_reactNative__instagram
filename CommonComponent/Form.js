import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, Button, Image } from "react-native";
const Form = ({ type, onSubmit, navigation }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const validate = () => {
    let valid = true;
    let newErrors = {
      email: "",
      password: "",
    };
   

      if (!formData.email) {
        newErrors.email = "Email is required.";
        valid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid.";
        valid = false;
      }

    if (!formData.password) {
      newErrors.password = "Password is required.";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(formData, setFormData);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/instagram.png")}
        style={styles.logoImg}
      />
      <Image
        source={require("../assets/instaTextLogo.png")}
        style={styles.logoText}
      />
      
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(value) => handleChange("email", value)}
          value={formData.email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      

      {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(value) => handleChange("password", value)}
        value={formData.password}
        secureTextEntry
      />
      {errors.password ? (
        <Text style={styles.error}>{errors.password}</Text>
      ) : null}
      <Button
        title={type === "Register" ? "Register" : "Login"}
        onPress={handleSubmit}
      />
      <Text style={styles.text}>
        {type === "Register"
          ? "Already have an account? "
          : "Create new account? "}
        <Text
          onPress={() =>
            navigation.navigate(type === "Register" ? "Login" : "Register")
          }
          style={styles.loginText}
        >
          {type === "Register" ? "Login" : "Register"}
        </Text>
      </Text>
    </View>
  );
};

export default Form;

const styles = StyleSheet.create({
  logoImg: {
    width: 50,
    height: 50,
    alignSelf: "center",
    marginBottom: 20,
  },
  logoText: {
    width: 250,
    height: 100,
    alignSelf: "center",
    marginBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  error: {
    color: "red",
    marginBottom: 12,
  },
  text: {
    textAlign: "center",
    marginTop: 10,
  },
  loginText: {
    color: "blue",
  },
});
