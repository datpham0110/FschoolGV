import React, { Component } from "react";
import {
  Image,
  View,
  StyleSheet,
  Text,
  ScrollView,
  ImageBackground,
} from "react-native";
import Input from "../../components/componentsYSchool/Input";
import ButtonCom from "../../components/Button/ButtonCom";
import { nstyles, nwidth, nheight } from "../../styles/styles";
import { styles } from "./styles";
import { colors } from "../../styles/color";
import Utils from "../../app/Utils";
import { nkey } from "../../app/keys/keyStore";
import { Images } from "../../images";
import { reText } from "../../styles/size";

export default class EnterYourPhoneNumber extends React.Component {
  constructor(props) {
    super(props);
    this.phonenumber = "";
    this.state = {};
  }

  _submit = async () => {
    if (this.phonenumber.toString().trim().length == 0) {
      Utils.showMsgBoxOK(
        this,
        "Thông báo",
        "Tên tài khoản không được để trống",
        "Đóng"
      );
      return;
    }
    Utils.nsetStore(nkey.phonenumber, this.phonenumber.toString().trim());
    Utils.goscreen(this, "sc_AuthLogin");
  };

  render() {
    return (
      <ImageBackground
        style={{
          height: nheight,
          width: nwidth
        }}
        resizeMode="stretch"
        source={Images.bgYSchool}
      >
        <ScrollView>
          <View style={([nstyles.ncontainerX], { marginTop: nheight / 5 })}>
            <View
              style={{ justifyContent: "center", marginLeft: nwidth / 5, marginRight: nwidth / 5 }}>
              <Text
                style={{ fontWeight: "800", textAlign: "center", fontSize: reText(24), marginBottom: 10 }}>
                Nhập tên tài khoản
            </Text>
              <Text style={{ textAlign: "center" }}>
                Dùng tài khoản đã được nhà trường cung cấp
            </Text>
            </View>
            <View
              style={{
                marginLeft: nwidth / 10,
                marginRight: nwidth / 10,
                marginTop: 10
              }}
            >
              <Input
                placeholder={"Nhập tên tài khoản"}
                onChangeText={text => (this.phonenumber = text)}
              />
              <ButtonCom
                onPress={this._submit}
                Linear={true}
                style={{ marginTop: 10, backgroundColor: colors.colorPink }}
                text={"TIẾP TỤC"}
              />
            </View>
          </View>
        </ScrollView>
      </ImageBackground>

    );
  }
}
