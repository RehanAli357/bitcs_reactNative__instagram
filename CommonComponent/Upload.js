import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  PixelRatio,
  ToastAndroid,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useRef, useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { addPost, deleteDp, editPost } from "../Firebase/postDoc";
import { useSelector, useDispatch } from "react-redux";
import { updateImageUrl, deleteImageUrl } from "../Redux/Actions/authActions";
import { captureRef } from "react-native-view-shot";

const Upload = ({ navigation, type, image, setImage, setResult }) => {
  const post = useSelector((state) => state.post);
  const [caption, setCaption] = useState(post.caption);
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraButtonClicked, setIsCameraButtonClicked] = useState(false);
  const [isCameraVisible, setIsCameraVisible] = useState(false);

  const cameraRef = useRef(null);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result?.assets[0]?.uri);
    }else{
      ToastAndroid.show("Opps Somthing Went Wrong",ToastAndroid.LONG)
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const openCamera = async () => {
    setIsCameraButtonClicked(true);
    if (!permission) {
      await requestPermission();
    } else if (!permission.granted) {
      await requestPermission();
    } else {
      setIsCameraVisible(true);
    }
  };

  const takePhoto = async () => {
    const targetPixelCount = 1080;
    const pixelRatio = PixelRatio.get();
    const pixels = targetPixelCount / pixelRatio;
    if (cameraRef.current) {
      try {
        const result = await captureRef(cameraRef, {
          result: "tmpfile",
          height: pixels,
          width: pixels,
          quality: 1,
          format: "png",
        });
        setImage(result);
        setIsCameraVisible(false);
      } catch (error) {
        console.error("Capture error:", error.message);
        ToastAndroid.show("Cant Take Picture",ToastAndroid.LONG)
        setIsCameraVisible(false);
      }
    }
  };

  const uploadPost = async () => {
    const url = await addPost(image, auth.id, caption, type);
    if (url) {
      setImage("");
      if (type === "DP") {
        dispatch(updateImageUrl(url));
      }
    } else {
      if (type === "posts") {
        navigation.navigate("Landing");
        setCaption("");
      }
    }
  };

  const editPostHandler = async () => {
    editPost(image, caption, auth.id, post.imageID, post.path)
      .then(() => {
        navigation.navigate("Landing");
      })
      .catch((err) => {
        ToastAndroid.show("Data Missing",ToastAndroid.LONG)
        console.log(err.message);
      });
  };

  const deleteDP = async () => {
    try {
      const status = await deleteDp(auth.id);

      if (status) {
        dispatch(deleteImageUrl());
      }
    } catch (error) {
      ToastAndroid.show("Cant delete the picture",ToastAndroid.LONG)
      console.error("Error deleting profile image:", error.message);
    }
  };

  if (isCameraButtonClicked && !permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {!isCameraVisible ? (
        <>
          {type === "posts" || type === "edit" ? (
            <>
              <TouchableOpacity style={styles.btn} onPress={pickImage}>
                <Text style={styles.btnText}>Pick a post</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={openCamera}>
                <Text style={styles.btnText}>Open Camera</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.imageRow}>
              <TouchableOpacity onPress={pickImage}>
                <Image
                  style={styles.icon}
                  source={require("../assets/more.png")}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={openCamera}>
                <Image
                  style={styles.icon}
                  source={require("../assets/camera.png")}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={deleteDP}>
                <Image
                  style={styles.icon}
                  source={require("../assets/delete.png")}
                />
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        <View
          style={{
            height: "100vh",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CameraView ref={cameraRef} style={[styles.camera,type==="DP" ? {bottom:80}:{bottom:-180}]} facing={facing}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={toggleCameraFacing}
              >
                <Text style={styles.text}>Flip Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setIsCameraVisible(false)}
              >
                <Text style={styles.text}>Close Camera</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
          <View
            style={[{
              height: 70,
              backgroundColor: "white",
              width: "100%",
              borderWidth: 1,
            },type==="posts" ? { position:"absolute",
              zIndex:1,
              top:180,}:{ marginTop: -100}]}
          >
            <TouchableOpacity onPress={takePhoto}>
              <Text
                style={{
                  textAlign: "center",
                  width: 50,
                  height: 50,
                  backgroundColor: "white",
                  margin: "auto",
                  borderRadius: 50,
                  borderWidth: 10,
                  marginTop: 10,
                }}
              ></Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {image && (type === "posts" || type === "edit") ? (
        <View>
          <Image source={{ uri: image }} style={styles.image} />
          <TextInput
            placeholder="Caption"
            onChangeText={(value) => {
              setCaption(value);
            }}
            value={caption}
            style={styles.input}
          />
        </View>
      ) : (
        ""
      )}
      {image &&
        (type === "posts" || type === "DP" ? (
          <TouchableOpacity style={styles.btn} onPress={uploadPost}>
            <Text style={styles.btnText}>Upload Post</Text>
          </TouchableOpacity>
        ) : type === "edit" ? (
          <TouchableOpacity style={styles.btn} onPress={editPostHandler}>
            <Text style={styles.btnText}>Edit Post</Text>
          </TouchableOpacity>
        ) : (
          ""
        ))}
    </View>
  );
};

export default Upload;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  btn: {
    marginTop: 50,
    marginBottom: 10,
    padding: 12,
    backgroundColor: "#6200ee",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
    width:150,
    height:50
  },
  btnText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    cursor:"pointer"
  },
  image: {
    marginTop: 20,
    marginBottom: 20,
    width: 200,
    height: 200,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  camera: {
    flex: 1,
    width: "100%",
    position: "absolute",
    height: 600,
    zIndex: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "space-around",
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  button: {
    marginTop: 40,
    borderColor: "white",
    borderWidth: 2,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginLeft: 3,
    marginRight: 3,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginTop: 10,
  },
  imageRow: {
    width: "20%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 40,
    marginRight: 100,
  },
  icon: {
    width: 40,
    height: 40,
  },
});
