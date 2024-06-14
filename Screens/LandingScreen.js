import React, { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getPosts } from "../Firebase/postDoc";
import { useSelector } from "react-redux";
import Card from "../CommonComponent/Card";

const LandingScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState([]);
  const auth = useSelector((state) => state.auth);

  const fetchPost = async () => {
    try {
      const data = await getPosts(auth.id, "allPost");
      setPosts(data.allPosts);
      setLikes(data.allLikes);
    } catch (err) {
      ToastAndroid.show("Unable to fetch posts",ToastAndroid.LONG)
      console.log(err.message);
    }
  };
  const renderItem = ({ item }) => {
    return <Card item={item} navigation={navigation} likes={likes} fetchPost={fetchPost} />;
  };
  useFocusEffect(
    useCallback(() => {
      if (auth.id) {
        fetchPost();
      }
    }, [])
  );
  return (
    <SafeAreaView style={styles.screenLayout}>
      <View style={styles.headerContainer}>
        <Image
          style={styles.logo}
          source={require("../assets/instaTextLogo.png")}
        />
        <View style={styles.menu}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Profile");
            }}
          >
            <Image
              style={styles.chat}
              source={
                auth.userImage && auth.userImage.length > 0
                  ? { uri: auth.userImage }
                  : require("../assets/user.png")
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Upload");
            }}
          >
            <Image
              style={[styles.chat, { borderRadius: 0 }]}
              source={require("../assets/more.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{paddingBottom:150,padding:16}}>
        <FlatList 
        data={posts} 
        renderItem={renderItem} 
        showsVerticalScrollIndicator={false} 
        showsHorizontalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  screenLayout: {
    marginTop:10
    // flex: 1,
    // flexGrow: 1,
  },
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
  },
  logo: {
    width: 120,
    height: 50,
    marginLeft: 10,
  },
  menu: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
  },
  chat: {
    borderRadius: 100,
    width: 40,
    height: 40,
    marginLeft: 10,
    marginRight: 10,
  },
});
