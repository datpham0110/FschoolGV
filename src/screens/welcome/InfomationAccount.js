import React, { Component } from "react";
import Utils from "../../app/Utils";
import {
  Text,
  View,
  Image,
  TouchableOpacity, TextInput,
  ScrollView,
  ActivityIndicator
} from "react-native";
import HeaderCom from "../../components/HeaderCom";
import { nstyles, Height, nwidth } from "../../styles/styles";
import { Images } from "../../images";
import { colors } from "../../styles/color";
import { sizes } from "../../styles/size";
import ButtonCom from "../../components/Button/ButtonCom";
import apis from "../../apis";
import { appConfig } from '../../app/Config';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

class InfomationAccount extends Component {
  constructor(props) {
    super(props);
    this.checkChangeAvatar = false;
    this.avatar = null;
    this.state = {
      show: false,
      chucvu: "",
      phutrach: "",
      phonenumber: this.props.infoUser.PhoneNumber,
      email: this.props.infoUser.Email,
      DiaChi: this.props.infoUser.DiaChi,
      dataTK: this.props.infoUser,
      avatar: this.props.infoUser.Avatar,
      isLoading: false
    };
    this.fullname = this.props.infoUser.FullName;
  }

  _handleUpdateInfomation = async () => {
    var { dataTK, phonenumber, email, DiaChi } = this.state
    let LastName = '';
    let FirstName = '';
    const fullname = this.fullname.trim();
    const index = fullname.indexOf(' ');
    if (index != -1) {
      FirstName = fullname.slice(0, index);
      LastName = fullname.slice(index).trim();
    } else {
      Utils.showMsgBoxOK(this, 'Thông báo', 'Nhập đủ họ và tên')
    };
    if (this.checkChangeAvatar)
      if (!await this._uadateAvata()) {
        this.setState({ isLoading: false });
        return;
      };
    let res = await apis.Hosonguoidung.updateNguoiDung(dataTK.Id, dataTK.Username, LastName, FirstName, phonenumber, email, DiaChi);
    if (res.status == 1) {
      await this._infomationUser();
      Utils.showMsgBoxOK(this, 'Thông báo', res.data);

    } else {
      Utils.showMsgBoxOK(
        this, 'Thông báo', res.error.message)
    };
    this.setState({ isLoading: false });
  }
  Update = async () => {
    if (this.state.phonenumber.length != 10) {
      Utils.showMsgBoxOK(this, 'Thông báo', 'Số điện thoại phải có 10 số')
      return;
    }
    if (!Utils.validateEmail(this.state.email)) {
      Utils.showMsgBoxOK(this, 'Thông báo', 'Email không hợp lệ!', 'Đóng');
      return;
    }
    this.setState({ isLoading: true }, this._handleUpdateInfomation);
  }
  _infomationUser = async () => {
    let res = await apis.Hosonguoidung.NguoiDungContact()
    if (res.status == 1) {
      res.data.Avatar = res.data.Avatar + "?" + new Date();
      const data = res.data;
      this.props.getInfomation(data);
    };
  }

  _uadateAvata = async () => {
    const { dataTK } = this.state;
    const resBase64 = await Utils.parseBase64(this.avatar[0].uri, this.avatar[0].height, this.avatar[0].width);
    const res = await apis.Hosonguoidung.NguoiDung_UpdateImage(resBase64, dataTK.FullName, dataTK.Id);
    Utils.nlog('res 64', res)
    if (res.status == 0) {
      Utils.showMsgBoxOK(this, 'Cảnh báo', res.error.message);
      return false;
    } else return true
  }

  _clickMenu = route => () => {
    Utils.goscreen(this, route);
  };
  _clickChild = () => {
    Utils.goscreen(this, "Modal_EnterStudentInformation", { flag: true });
  };


  _goMediapicker = (optionsCus) => {
    //Keyboard.dismiss();
    if (optionsCus == undefined || optionsCus == null)
      optionsCus = {};
    //--Open dialog choose media - ncustom
    response = (res) => {
      Utils.nlog('images', res)
      if (res.iscancel) {
        //--ko chon item or back

      }
      else if (res.error) {
        //--lỗi khi chon media
      }
      else {
        // const listImages = this.state.listImages.concat(res)
        this.checkChangeAvatar = true;
        this.avatar = res;
        this.setState({ avatar: res[0].uri + '?' + new Date() });
        //--dữ liệu media trả về là 1 item or 1 mảng item
        //--Xử lý dữ liệu trong đây-----
        //Utils.nlog('img', res);
        // this._uploadAvatar(res[0]);
        //-----
      }
    };
    let options = {
      assetType: 'Photos', //All,Videos,Photos - default
      multi: false,// chọn 1 or nhiều item
      response: response, // callback giá trị trả về khi có chọn item
      limitCheck: -1, //gioi han sl media chon: -1 la khong co gioi han, >-1 la gioi han sl =  limitCheck
      ...optionsCus
    };
    Utils.goscreen(this, 'Modal_MediaPicker', options);
    //--End dialog media
  }



  _renderItemChild = ({ item, index }) => {
    return (
      <View key={index}>
        <View style={{
          flexDirection: "row",
          height: nwidth * 0.12,
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: colors.veryLightPinkThree
        }}>
          <Text style={{ flex: 1, fontSize: sizes.sText17 }}>
            Mã học sinh {index + 1}
          </Text>
          <Text style={{ marginRight: 20 }}>{item.MaKhachHang}</Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            height: nwidth * 0.12,
            alignItems: "center",
            borderBottomWidth: 1,
            borderBottomColor: colors.veryLightPinkThree
          }}
        >
          <Text style={{ flex: 1, fontSize: sizes.sText17 }}>
            Tên học sinh {index + 1}
          </Text>
          <Text style={{ marginRight: 20 }}>{item.TenKhachHang}</Text>
        </View>
      </View>
    );
  };

  onChangePass = () => {
    Utils.goscreen(this, 'sc_ChangePassword');
  }

  render() {
    var { dataTK } = this.state
    console.log('this.state.phonenumber', this.state.phonenumber, this.state.email)
    return (
      <View style={[nstyles.ncontainerX, { backgroundColor: colors.BackgroundHome }]}>
        <HeaderCom
          nthis={this}
          titleText={"Thông tin tài khoản"}
        />
        <KeyboardAwareScrollView
          extraHeight={50}
          keyboardShouldPersistTaps={'always'}
        >
          <View style={{
            flexDirection: "column", marginVertical: 10, marginHorizontal: nwidth * 0.05,
            backgroundColor: colors.white, padding: 20, borderTopLeftRadius: 6, borderTopRightRadius: 6
          }}>
            <View style={{
              alignItems: "center",
              borderBottomColor: colors.veryLightPinkThree, paddingVertical: 20
            }}>
              <TouchableOpacity onPress={this._goMediapicker}>
                <Image
                  resizeMode="cover" source={{ uri: this.checkChangeAvatar ? this.state.avatar : appConfig.domain + this.state.avatar }}
                  defaultSource={Images.icPhotoBlack}
                  tintColorLeft={colors.black_11}
                  style={{ width: 106, height: 106, borderRadius: 53, backgroundColor: colors.black_16 }} />
              </TouchableOpacity>

            </View>
            <View style={{
              flexDirection: "row", height: nwidth * 0.12, alignItems: "center", borderBottomWidth: 1,
              borderBottomColor: colors.veryLightPinkThree
            }}>
              <Text style={{ flex: 1, fontSize: sizes.sText17, fontWeight: 'bold' }}>
                Tài khoản
              </Text>
              <Text style={{ fontSize: sizes.sText16, color: '#808080' }}>{dataTK.Username}</Text>
            </View>
            <TouchableOpacity
              style={{
                flexDirection: "row", height: nwidth * 0.12, alignItems: "center",
                borderBottomColor: colors.veryLightPinkThree
              }} onPress={this.onChangePass}>
              <Text style={{ flex: 1, fontSize: sizes.sText17, fontWeight: 'bold' }}>
                Mật khẩu
              </Text>
              <Text style={{ fontSize: sizes.sText16, color: '#808080', marginRight: 10, marginTop: 5 }}>{'******'}</Text>
              <Image resizeMode="contain" source={Images.iconNext1}
                style={{ width: nwidth * 0.04, height: nwidth * 0.04 }}
              />
            </TouchableOpacity>
          </View>
          <View style={{
            flexDirection: "column", backgroundColor: colors.white,
            marginHorizontal: nwidth * 0.05, paddingHorizontal: 20, marginTop: 10
          }}>
            <View
              style={{
                flexDirection: "row", height: nwidth * 0.12, alignItems: "center",
                borderBottomWidth: 1, borderBottomColor: colors.veryLightPinkThree, justifyContent: 'space-between'
              }}>
              <Text style={{ flex: 1, fontSize: sizes.sText17, fontWeight: 'bold' }}>
                Họ và tên
              </Text>
              <TextInput
                multiline={true}
                style={[nstyles.ntextinput, { maxHeight: 100, flex: 1, textAlign: 'right' }]}
                onChangeText={(text) => this.fullname = text}
              >{dataTK.FullName}</TextInput>
              {/* <Text style={{ fontSize: sizes.sText16, fontWeight: '400' }}>{dataTK.FullName}</Text> */}
            </View>
            <View
              style={{
                flexDirection: "row", height: nwidth * 0.12, alignItems: "center",
                borderBottomWidth: 1, borderBottomColor: colors.veryLightPinkThree
              }}>
              <Text style={{ flex: 1, fontSize: sizes.sText17, fontWeight: 'bold' }}>
                Chức vụ
              </Text>
              {/* <TextInput
                multiline={true}
                style={[nstyles.ntextinput, { maxHeight: 100 }]}
                onChangeText={(chucvu) => this.setState({ chucvu })}
              >{'Giáo viên'}</TextInput> */}
              <Text style={{ fontSize: sizes.sText13, textAlign: 'right' }}>{dataTK.ChucVu}</Text>
            </View>
            {this.state.show == false ? <TouchableOpacity onPress={() => this.setState({ show: !this.state.show })}
              style={{
                flexDirection: "row",
                alignItems: "center", marginBottom: 5, justifyContent: 'space-between', paddingVertical: 7
              }}>
              <Text style={{ flex: 1, fontSize: sizes.sText17, fontWeight: 'bold' }}>
                Lớp phụ trách
              </Text>
              <Text numberOfLines={1} style={{ fontSize: sizes.sText13, flex: 1, textAlign: 'right' }}>
                {dataTK.LopPhuTrach}</Text>
              <View style={{ width: 5 }} />
              <Image resizeMode="contain" source={Images.icNext}
                style={[nstyles.nIcon10, { tintColor: colors.brownishGreyTwo }]}
              />
            </TouchableOpacity> : <TouchableOpacity onPress={() => this.setState({ show: !this.state.show })}
              style={{
                flexDirection: "row",
                alignItems: "center", marginBottom: 5, justifyContent: 'space-between', paddingVertical: 7
              }}>
                <Text style={{ flex: 1, fontSize: sizes.sText17, fontWeight: 'bold' }}>
                  Lớp phụ trách
              </Text>
                <Text style={{ fontSize: sizes.sText13, flex: 1, textAlign: 'right' }}>
                  {dataTK.LopPhuTrach}</Text>
                <View style={{ width: 5 }} />
                <Image resizeMode="contain" source={Images.icDropDown}
                  style={[nstyles.nIcon10, { tintColor: colors.brownishGreyTwo }]}
                />
              </TouchableOpacity>
            }
          </View>
          <View
            style={{
              flexDirection: "column", marginHorizontal: nwidth * 0.05,
              backgroundColor: colors.white, paddingHorizontal: 20, marginTop: 20,
              borderBottomLeftRadius: 6, borderBottomRightRadius: 6
            }}>
            <View style={{
              flexDirection: "row", height: nwidth * 0.12, alignItems: "center",
              borderBottomWidth: 1, borderBottomColor: colors.veryLightPinkThree
            }}>
              <Text style={{ flex: 1, fontSize: sizes.sText17, fontWeight: 'bold' }}>
                Số điện thoại
              </Text>
              <TextInput
                multiline={true}
                style={[nstyles.ntextinput, { maxHeight: 100, flex: 1, textAlign: 'right' }]}
                onChangeText={(phonenumber) => this.setState({ phonenumber })}
              >{dataTK.PhoneNumber}</TextInput>
              {/* <Text style={{ color: '#808080', fontSize: sizes.sText13 }}>{dataTK.PhoneNumber}</Text> */}
            </View>
            <View style={{
              flexDirection: "row", height: nwidth * 0.12,
              alignItems: "center", marginBottom: 5, borderBottomWidth: 1, borderBottomColor: colors.veryLightPinkThree
            }} >
              <Text style={{ flex: 1, fontSize: sizes.sText17, fontWeight: 'bold' }}>
                Email
              </Text>
              <TextInput
                multiline={true}
                style={[nstyles.ntextinput, { maxHeight: 100, flex: 1, textAlign: 'right' }]}
                onChangeText={(email) => this.setState({ email })}
              >{dataTK.Email}</TextInput>
              {/* <Text style={{ color: '#808080', fontSize: sizes.sText13 }}>{dataTK.Email}</Text> */}
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5, justifyContent: 'space-between' }} >
              <Text style={{ fontSize: sizes.sText17, fontWeight: 'bold', flex: 1 }}>
                Địa chỉ
              </Text>
              <TextInput
                multiline={true}
                style={[nstyles.ntextinput, { flex: 1, maxHeight: 100, textAlign: 'right' }]}
                onChangeText={(DiaChi) => this.setState({ DiaChi })}
              >{this.props.infoUser.DiaChi}</TextInput>
            </View>
          </View>
          <View style={[nstyles.nrow, { height: Height(8), justifyContent: 'center' }]}>
            <ButtonCom
              colorChange={[colors.lightSalmon, colors.salmonTwo]}
              onPress={this.Update}
              Linear={true}
              text={"Xác nhận"}
              style={{ paddingHorizontal: 50, marginTop: 10 }}
            />
          </View>
        </KeyboardAwareScrollView>
        {this.state.isLoading ? <View style={[nstyles.nmiddle, { position: 'absolute', width: '100%', height: '100%', backgroundColor: colors.black_20 }]}>
          <ActivityIndicator color={colors.white} size='large' />
        </View> : null}
      </View >
    );
  }
}

const mapStateToProps = state => ({
  infoUser: state.infoUser
});

export default Utils.connectRedux(InfomationAccount, mapStateToProps, true);