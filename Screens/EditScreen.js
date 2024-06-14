import { View } from "react-native";
import Upload from "../CommonComponent/Upload";
import React, { useState } from "react";
import { useSelector } from "react-redux";
const EditScreen = ({ navigation }) => {
  const post = useSelector((state) => state.post);
  const [image, setImage] = useState(post.imageUrl);

  return (
    <View style={{ flex: 1 }}>
      <Upload
        navigation={navigation}
        image={image}
        setImage={setImage}
        type={"edit"}
      />
    </View>
  );
};

export default EditScreen;
