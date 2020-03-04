import React, { Component } from "react";
import {
  Image,
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Dimensions,
  Platform
} from "react-native";
import { nstyles } from "../../styles/styles";
// import { styles } from "./styles";
import { colors } from "../../styles/color";
// import { Images } from "../../images";

export default class GiaoDichThanhCong extends React.Component {
  render() {
    return (
      <View
        style={[
          nstyles.ncontainerX,
          { backgroundColor: colors.BackgroundHome }
        ]}
      >
        <Image s></Image>
        <Text>fffff</Text>
      </View>
    );
  }
}
