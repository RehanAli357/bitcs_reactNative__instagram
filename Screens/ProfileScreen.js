import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TouchableWithoutFeedback,
  Button,
  ToastAndroid,
} from "react-native";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getPosts } from "../Firebase/postDoc";
import Upload from "../CommonComponent/Upload";
import { logoutUser } from "../Firebase/userDoc";
import { logOut } from "../Redux/Actions/authActions";
import { useFocusEffect } from "@react-navigation/native";
import { followAccount, chekFollowing } from "../Firebase/followDoc";
const ProfileScreen = ({ navigation, route }) => {
  const [posts, setPosts] = useState([]);
  const [image, setImage] = useState(null);
  const [display, setDisplay] = useState({
    userProfile: false,
    userSetting: false,
  });
  const [isFollow, setIsFollow] = useState(false);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { userId, userImage, userEmail } = route.params ?? {};
  const fetchPost = async (id) => {
    try {
      const data = await getPosts(id, "userPost");
      setPosts(data.allPosts);
    } catch (err) {
      console.log(err.message);
    }
  };
  const renderItem = ({ item }) => {
    return (
      <View style={styles.postsGrid}>
        <Image style={styles.postImage} source={{ uri: item.imageUrl }} />
      </View>
    );
  };

  const signOutUser = async () => {
    await logoutUser()
      .then(() => {
        setDisplay({
          userProfile: false,
          userSetting: false,
        });
        dispatch(logOut());
        navigation.navigate("Login");
      })
      .catch((err) => {
        ToastAndroid.show("Unable to signout",ToastAndroid.LONG)
        console.log(err.message);
      });
  };

  const userSettings = () => {
    if (display.userSetting) {
      return (
        <Modal
          visible={display.userSetting}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            setDisplay(false);
          }}
        >
          <TouchableWithoutFeedback
            onPress={() =>
              setDisplay((pdata) => ({ ...pdata, userSetting: false }))
            }
          >
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("Privacy");
                          setDisplay((pdata) => ({
                            ...pdata,
                            userSetting: false,
                          }));
                        }}
                      >
                        <Image source={require("../assets/insurance.png")} />
                        <Text>Privacy</Text>
                      </TouchableOpacity>
                    </View>
                    <View>
                      <TouchableOpacity onPress={signOutUser}>
                        <Image source={require("../assets/logout.png")} />
                        <Text>Logout</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      );
    }
  };

  const uploadImage = () => {
    if (display.userProfile) {
      return (
        <Modal
          visible={display.userProfile}
          animationType="slide"
          transparent={true}
          onRequestClose={() =>
            setDisplay((pdata) => ({ ...pdata, userProfile: false }))
          }
        >
          <TouchableWithoutFeedback
            onPress={() =>
              setDisplay((pdata) => ({ ...pdata, userProfile: false }))
            }
          >
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={{
                        fontWeight: "bold",
                        marginBottom: 15,
                        fontSize: 20,
                      }}
                    >
                      Pick a profile
                    </Text>
                    <Image
                      source={
                        auth.userImage
                          ? { uri: auth.userImage }
                          : require("../assets/user.png")
                      }
                      style={[styles.ProfileImage, { marginBottom: 10 }]}
                    />
                  </View>
                  <Upload
                    type={"DP"}
                    image={image}
                    setImage={setImage}
                    navigation={navigation}
                    />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      );
    }
  };

  const followUserAccount = async () => {
    await followAccount(
      userId,
      auth.id,
      userImage,
      userEmail,
      auth.userImage,
      auth.email
    );
  };

  const followCheck = async (cId, uId) => {
    const doesFollow = await chekFollowing(uId, cId);
    setIsFollow(doesFollow);
  };
  useFocusEffect(
    React.useCallback(() => {
      if (auth.id && userId) {
        fetchPost(userId);
        followCheck(auth.id, userId);
      } else if (auth.id) {
        fetchPost(auth.id);
      }
    }, [auth.id, route.params])
  );
  return (
    <View style={styles.layout}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "5px",
          marginBottom: "5px",
          padding: 16,
        }}
      >
        <Text style={{ marginleft: 15, fontWeight: "bold" }}>{auth.email}</Text>
        <TouchableOpacity
          onPress={() => {
            setDisplay((pdata) => ({
              ...pdata,
              userSetting: !pdata.userSetting,
            }));
          }}
        >
          <Image
            source={require("../assets/menu.png")}
            style={{ width: 30, height: 30, marginRight: "5px" }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.profile}>
        <View style={styles.profilePic}>
          <TouchableOpacity
            onLongPress={() => {
              setDisplay((pdata) => ({
                ...pdata,
                userProfile: !pdata.userProfile,
              }));
            }}
          >
            <Image
              source={
                auth.userImage
                  ? { uri: auth.userImage }
                  : require("../assets/user.png")
              }
              style={styles.ProfileImage}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.profileFollow}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Search", { type: "following" });
            }}
          >
            <Text style={{ fontWeight: "bold", marginRight: 5 }}>
              Follow {auth.following}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Search", { type: "follower" });
            }}
          >
            <Text style={{ fontWeight: "bold", marginRight: 5 }}>
              Followers {auth.follower}
            </Text>
          </TouchableOpacity>
          <Text style={{ fontWeight: "bold", marginRight: 5 }}>
            Posts {posts.length}
          </Text>
        </View>
      </View>
      {userId !== undefined && userId !== auth.id ? (
        <View style={{ marginTop: 10, marginBottom: 10, padding: 16 }}>
          <Button
            title={isFollow ? "Follow Account" : "UnFollow Account"}
            onPress={followUserAccount}
          />
        </View>
      ) : (
        ""
      )}
      <View style={styles.posts}>
        <FlatList
          numColumns={3}
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text>No Posts</Text>}
        />
      </View>
      {uploadImage()}
      {userSettings()}
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
  profile: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 10,
  },
  profilePic: {
    flex: 0.3,
    marginLeft: 10,
  },
  ProfileImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  profileFollow: {
    flex: 1,
    flexDirection: "row",
  },
  posts: {
    height: "100vh",
    padding: 16,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  postsGrid: {
    marginTop: 20,
  },
  postImage: {
    width: 100,
    height: 100,
  },
  DP: {
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    width: "100%",
    position: "absolute",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  dpButton: {
    marginTop: 10,
    justifyContent: "center",
    flexDirection: "row",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "transparent",
  },
  modalContent: {
    backgroundColor: "white",
    paddingTop: 10,
    paddingBottom: 95,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
  },
});
