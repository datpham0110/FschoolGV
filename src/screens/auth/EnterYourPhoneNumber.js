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
import { appConfig } from "../../app/Config"
import * as firebase from 'firebase'
import IsLoading from "../../components/IsLoading";
const Firebase = firebase.initializeApp(appConfig)
export default class EnterYourPhoneNumber extends React.Component {
  constructor(props) {
    super(props);
    this.email = "";
    this.password = ""
    this.state = {};
  }

  // _submit = async () => {
  //   if (this.email.toString().trim().length == 0) {
  //     Utils.showMsgBoxOK(
  //       this,
  //       "Thông báo",
  //       "Tên tài khoản không được để trống",
  //       "Đóng"
  //     );
  //     return;
  //   }
  //   Utils.nsetStore(nkey.phonenumber, this.phonenumber.toString().trim());
  //   Utils.goscreen(this, "sc_AuthLogin");
  // };
  _singup = async () => {
    this.nLoading.show()
    let res = await Firebase.auth().createUserWithEmailAndPassword(this.email, this.password).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      Utils.nlog('error', errorCode, errorMessage)
      Utils.nlog('_singup', error)
    })

  }
  _login = async () => {
    if (this.email.length < 1) {
      Utils.showMsgBoxOK(this, 'Tên tài khoản không được để trống')
      return;
    }
    if (this.password.length != 6) {
      Utils.showMsgBoxOK(this, 'Password phải có 6 số')
      return;
    }
    // this.nLoading.show()
    let res = await Firebase.auth().signInWithEmailAndPassword(this.email, this.password).catch((error) => Utils.showMsgBoxOK(this,'Vui lòng kiểm tra lại'))
    Utils.nlog('_login', res)
    // var errorCode = error.code;
    // var errorMessage = error.message;

    // Utils.showMsgBoxOK(this, 'errorCode', errorMessage)
    Utils.goscreen(this, "sc_Welcome");
    // this.nLoading.hide();
  }
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
                style={{ fontWeight: "800", textAlign: "center", fontSize: reText(20), marginBottom: 10 }}>
                Nhập tên tài khoản
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
                showIcon={true}
                icon={Images.icUser}
                placeholder={"Nhập tên tài khoản"}
                onChangeText={text => (this.email = text)}
                iconStyle={{ marginRight: 10, tintColor: "gray" }}
              />
              <Input
                secureTextEntry={true}
                placeholder={"Nhập mật khẩu"}
                onChangeText={text => (this.password = text)}
                showIcon={true}
                icon={Images.icLock}
                iconStyle={{ marginRight: 10, tintColor: "gray" }}
              />
              <ButtonCom
                onPress={this._login}
                Linear={true}
                style={{ marginTop: 10, backgroundColor: colors.colorPink }}
                text={"Đăng nhập"}
              />
              <ButtonCom
                onPress={this._singup}
                Linear={true}
                style={{ marginTop: 10, backgroundColor: colors.colorPink }}
                text={"Đăng ký"}
              />
            </View>
          </View>
        </ScrollView>
        <IsLoading ref={(ref) => {
          this.nLoading = ref
        }} />
      </ImageBackground>

    );
  }
}
