import React, { useCallback, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { searchFollowing } from "../Firebase/followDoc";

const SearchScreen = ({ navigation, route }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const { type } = route.params;

  const auth = useSelector((state) => state.auth);

  const handleSearch = (text) => {
    setQuery(text);
  };

  const fetchAllUsers = async () => {
    try {
      const data = await searchFollowing();
      if (query.trim() === "") {
        setResults(data);
      } else {
        const filteredData = data.filter((item) =>
          item.email.includes(query.toLowerCase())
        );
        setResults(filteredData);
      }
    } catch (error) {
      ToastAndroid.show("Unable to fetch user", ToastAndroid.LONG);
      console.error("Error fetching users:", error);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      if (auth.id) {
        fetchAllUsers();
      }
    }, [auth.id, query])
  );

  return (
    <View style={styles.container}>
      <View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={query}
          onChangeText={handleSearch}
        />
      </View>
      <ScrollView style={{ height: "100vh" }}>
        {query.length > 0 ? (
          <FlatList
            data={results}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Profile", {
                    userId: item.uId,
                    userImage: item.userImage,
                    userEmail: item.email,
                  })
                }
              >
                <View style={styles.resultItem}>
                  <Image
                    source={
                      item.userImage && item.userImage.length > 0
                        ? { uri: item.userImage }
                        : require("../assets/user.png")
                    }
                    style={{
                      height: 50,
                      width: 50,
                      borderRadius: 50,
                      marginRight: 10,
                    }}
                  />
                  <Text style={{ fontWeight: "bold" }}>{item.email}</Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text>No Item Match</Text>}
          />
        ) : (
          <Text>No Item Search Yet</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  resultItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
