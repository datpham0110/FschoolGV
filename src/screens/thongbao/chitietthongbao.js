import React, { Component } from "react";
import { colors, sizes } from "../../styles";
import { Text, View, Dimensions, TouchableOpacity } from "react-native";
import Input from "../../components/componentsYSchool/Input";
import { Images } from "../../images";
import ButtonCom from "../../components/Button/ButtonCom";
import { styles } from "./styles";
import Utils from "../../app/Utils";
const { width } = Dimensions.get("window");
export default class ChiTietThongBao extends Component {
  constructor(props) {
    super(props);
    data = Utils.ngetParam(this, "data");
    this.state = {};
  }

  onCancel = () => {
    Utils.goback(this, null);
  };
  render() {
    return (
      <View
        style={{
          backgroundColor: colors.black_16,
          flex: 1,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <View
          style={{
            backgroundColor: colors.white,
            paddingHorizontal: 20,
            paddingVertical: 10,
            paddingBottom: 20,
            borderRadius: 10,
            width: width * 0.9
          }} >
          <Text
            style={{
              textAlign: "center",
              fontSize: sizes.sizes.sText17
            }}
          >
            {data.TenLoai}
          </Text>

          <Text
            style={{
              textAlign: "left",
              fontSize: sizes.sizes.sText17,
              marginTop: 20
            }}
          >
            {data.NoiDung}
          </Text>
          <Text
            style={{
              textAlign: "right",
              fontSize: sizes.sizes.sText12,
              marginVertical: 10
            }}
          >
            {data.NgayGui}
          </Text>
          <ButtonCom
            onPress={() => this.onCancel()}
            style={{ marginTop: 10, backgroundColor: colors.colorPink }}
            text={"ĐÓNG"}
          />
        </View>
      </View>
    );
  }
}
