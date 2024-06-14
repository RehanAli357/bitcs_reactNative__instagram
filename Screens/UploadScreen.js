import React, { useState } from "react";
import Upload from "../CommonComponent/Upload";
import { View } from "react-native";

const UploadScreen = ({navigation}) => {
  const [image, setImage] = useState(null);
 
  return (
    <View style={{flex:1}}>
      <Upload 
      type={"posts"}
      image = {image}
      setImage={setImage}
      navigation={navigation}
      />
    </View>
  );
};

export default UploadScreen;

