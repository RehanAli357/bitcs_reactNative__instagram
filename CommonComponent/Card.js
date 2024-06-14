import { Image, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import React, { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { editPost } from "../Redux/Actions/postAction";
import { likeUnlikePost } from "../Firebase/postDoc";
import { useFocusEffect } from "@react-navigation/native";
import { deletePost } from "../Firebase/postDoc";
const Card = ({ navigation, item, likes, fetchPost }) => {
  const [isliked, setIsLike] = useState(false);
  const [likeCount, setLikeCount] = useState(item?.likes ? item.likes : 0);
  const [isVisible, setIsVisible] = useState(false);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const toggleNavCardVisibility = () => {
    setIsVisible(!isVisible);
  };

  const editHandler = (caption, imageUrl, imageId,path) => {
    toggleNavCardVisibility()

    if (imageUrl && imageId ) {
      dispatch(
        editPost({
          caption: caption,
          imageUrl: imageUrl,
          imageId: imageId,
          userId: auth.id,
          path:path
        })
      );
      navigation.navigate("Edit");
    }
    setIsVisible(false);
  };

  const deleteHandeler = async (path, imageId, userId) => {
    toggleNavCardVisibility();
    await deletePost(path, imageId, userId).then(() => {
      fetchPost();
    });
  };

  const postLike = async (cUserId, postId, userId) => {
    await likeUnlikePost(cUserId, postId, userId)
      .then(() => {
        let flag;
        setIsLike((flag = !isliked));
        if (flag) {
          setLikeCount((pdata) => pdata + 1);
        } else {
          setIsLike((flag = !isliked));
          likeCount > 0 ? setLikeCount((pdata) => pdata - 1) : setLikeCount(0);
        }
      })
      .catch((err) => {
        ToastAndroid.show("Unable to like the post",ToastAndroid.LONG)
        console.log("like err", err.message);
      });
  };
  useFocusEffect(
    useCallback(() => {
      const liked = likes.filter((data) => data.postId === item.imageId);
      setIsLike(liked[0]?.isLiked);
    }, [])
  );
  return (
    <TouchableOpacity key={item.index}>
      <View style={styles.postContainer}>
        <View style={styles.header}>
          <Image
            source={
              item.userImage!==undefined && item.userImage.length > 0
                ? { uri: item?.userImage }
                : require("../assets/user.png")
            }
            style={styles.profileImage}
          />
          <Text style={styles.username}>{item?.userEmail}</Text>
          {auth.id === item?.userId && (
            <TouchableOpacity
              style={styles.threeDotsContainer}
              onPress={toggleNavCardVisibility}
            >
              <Image
                source={require("../assets/dots.png")}
                style={styles.threeDotsImage}
              />
            </TouchableOpacity>
          )}
          {isVisible && (
            <View style={styles.navCard}>
              <TouchableOpacity
                style={styles.navCardItem}
                onPress={() => {
                  editHandler(item.caption, item?.imageUrl, item?.imageId,item.path);
                }}
              >
                <Image
                  source={require("../assets/edit.png")}
                  style={styles.navCardIcon}
                />
                <Text style={styles.navCardText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navCardItem}
                onPress={() => {
                  deleteHandeler(item.path, item.imageId, item.userId);
                }}
              >
                <Image
                  source={require("../assets/delete.png")}
                  style={styles.navCardIcon}
                />
                <Text style={styles.navCardText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <Image source={{ uri: item?.imageUrl }} style={styles.postImage} />
        <View style={styles.footer}>
          <Text style={styles.caption}>{item?.caption}</Text>
          <TouchableOpacity
            onPress={() => {
              postLike(auth.id, item.imageId, item.userId);
            }}
          >
            <Text style={styles.likes}>
              <Image
                source={
                  isliked
                    ? require("../assets/like.png")
                    : require("../assets/unlike.png")
                }
                style={{ width: 20, height: 20 }}
              />{" "}
              {likeCount} likes
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Card;

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: "white",
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    position: "relative",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  threeDotsContainer: {
    position: "absolute",
    right: 10,
    top: 15,
  },
  threeDotsImage: {
    width: 20,
    height: 20,
  },
  navCard: {
    backgroundColor: "white",
    padding: 10,
    position: "absolute",
    top: 35,
    right: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    zIndex: 1000,
    width: 100,
    alignItems: "center",
  },
  navCardItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  navCardIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  navCardText: {
    fontSize: 16,
  },
  postImage: {
    width: "100%",
    height: 300,
    zIndex: -1,
  },
  footer: {
    padding: 10,
  },
  caption: {
    marginBottom: 5,
  },
  likes: {
    fontWeight: "bold",
  },
});
