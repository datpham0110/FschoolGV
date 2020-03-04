import React, { Component } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { nstyles, nwidth, nheight } from "../../styles/styles";
import Input from "../../components/componentsYSchool/Input";
import ButtonCom from "../../components/Button/ButtonCom";
import { onCheckLogin } from "../../apis/apiLogin";
import Utils from "../../app/Utils";
import { Images } from "../../images";
import { nkey } from "../../app/keys/keyStore";
import { styles } from "./styles";
import apis from '../../apis';
class Login extends Component {
  constructor(props) {
    super(props);
    this.password = "";
    this.state = {
      sodienthoai: ""
    };
  }
  componentDidMount() {
    this._getData();
  }
  _getData = async () => {
    let phone = await Utils.ngetStore(nkey.phonenumber);
    if (phone != null) {
      this.setState({ sodienthoai: phone });
    }
  };

  _submit = async () => {
    let ps = this.password.toString().trim();
    if (ps.length < 1) {
      Utils.showMsgBoxOK(
        this,
        "Thông báo",
        "Mật khẩu không được để trống!",
        "Đóng"
      );
      return;
    };
    let res = await onCheckLogin(this.state.sodienthoai, ps, this);
    if (res) {
      await this._infomationUser();
      Utils.nsetStore(nkey.password, ps);
      Utils.goscreen(this, "sc_Welcome");
    } else {
      Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi kết nối', 'Đóng')
    }
  };

  _infomationUser = async () => {
    let res = await apis.Hosonguoidung.NguoiDungContact()
    Utils.nlog('NguoiDung', res)
    if (res.status == 1) {
      const data = res.data;
      this.props.getInfomation(data);
    };
  }


  render() {
    return (
      <ScrollView style={{ height: nheight, width: nwidth }}>
        <ImageBackground
          style={{ height: nheight, width: nwidth }} resizeMode="stretch" source={Images.bgLogin}  >
          <View style={([nstyles.ncontainerX], {
            marginTop: nheight / 5, flex: 1
          })}>
            <View style={{ justifyContent: "center", marginLeft: nwidth / 5, marginRight: nwidth / 5 }}>
              <Text style={[styles.text24, { fontWeight: "800", textAlign: "center" }]}>
                Xin chào
            </Text>
              <Text style={{ textAlign: "center" }}>
                {this.state.sodienthoai}
              </Text>
            </View>
            <View
              style={{
                marginLeft: nwidth / 10,
                marginRight: nwidth / 10,
                marginTop: 10,
              }}
            >
              <Input
                secureTextEntry={true}
                placeholder={"Nhập mật khẩu"}
                onChangeText={text => (this.password = text)}
                showIcon={true}
                icon={Images.icLock}
                iconStyle={{ marginRight: 10, tintColor: "gray" }}
              />
              <ButtonCom
                onPress={this._submit}
                Linear={true}
                style={{ marginTop: 10 }}
                text={"ĐĂNG NHẬP"}
              />
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 20,
                  width: nwidth - (nwidth / 10) * 2
                }}
              >
                <View style={{ width: (nwidth - (nwidth / 10) * 2) / 2 }}>
                  <TouchableOpacity onPress={() => {
                    Utils.showMsgBoxOK(this, 'Thông báo', 'Vui lòng liên hệ với chăm sóc khách hàng để lấy lại mật khẩu', 'Đóng')

                  }}>
                    <Text>Quên mật khẩu</Text>

                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={async () => {
                    await Utils.nsetStore(nkey.phonenumber, null);
                    Utils.goscreen(this, "sc_EnterYourPhoneNumber");
                  }}
                  style={{
                    justifyContent: "flex-start", width: (nwidth - (nwidth / 10) * 2) / 2
                  }}>
                  <Text style={{ alignSelf: "flex-end" }}>Thoát tài khoản</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flex: 1 }}></View>
            <TouchableOpacity onPress={() => Utils.goscreen(this, 'Modal_HoTroKhachHang')}>
              <Text style={{
                alignSelf: "center", marginBottom: 40, textDecorationLine: 'underline', fontWeight: 'bold'
              }}>Liên hệ với chăm sóc khách hàng</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground >
      </ScrollView>

    );
  }
}
export default Utils.connectRedux(Login, null, true);
