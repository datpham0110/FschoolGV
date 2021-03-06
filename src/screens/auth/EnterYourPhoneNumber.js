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
import IsLoading from "../../components/IsLoading";
export const db1 = db.database();
import { db } from '../../app/Config';

//const Firebase = firebase.initializeApp(appConfig)
class EnterYourPhoneNumber extends React.Component {
  constructor(props) {
    super(props);
    this.email = "";
    this.password = ""
    this.phonenumber = ""
    this.state = {};
  }

  componentDidMount() {
  }

  login = () => {
    if (!this.phonenumber.trim()) {
      Utils.showMsgBoxOK(this, 'Thông báo', 'Vui lòng nhập tên đăng nhập', 'Đóng');
      return;
    };
    const ref = db1.ref('/Tbl_GiaoVien')
    ref.orderByChild('userName')
      .equalTo(this.phonenumber)
      .once('value')
      .then((snapshot) => {
        const value = snapshot.val();
        if (value == null) {
          Utils.showMsgBoxOK(this, 'Thông báo', 'Tài khoản không tồn tại')
        } else {
          const data = value[Object.keys(value)[0]];
          if (data.password == this.password.trim()) {
            Utils.nsetStore(nkey.phonenumber, this.phonenumber);
            Utils.nsetStore(nkey.password, this.password);
            this.props.getInfomation(data);
            Utils.goscreen(this, "sc_Welcome");
            Utils.nlog('datadata', data)
          } else {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Mật khẩu không đúng', 'Đóng')
          };
        };
      })
  }
  render() {
    return (
      <ImageBackground
        style={{ height: nheight, width: nwidth }}
        resizeMode="stretch"
        source={Images.bgYSchool} >
        <ScrollView>
          <View style={([nstyles.ncontainerX], { marginTop: nheight / 5 })}>
            <View style={{ alignItems: 'center' }}>
              <Image source={Images.icFSchool} resizeMode='contain' style={nstyles.nIcon120} />
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
                onChangeText={text => (this.phonenumber = text)}
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
                onPress={this.login}
                Linear={true}
                style={{ marginTop: 10, backgroundColor: colors.colorPink }}
                text={"Đăng nhập"}
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
export default Utils.connectRedux(EnterYourPhoneNumber, null, true);