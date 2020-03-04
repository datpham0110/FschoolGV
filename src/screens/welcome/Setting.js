import React, { Component, PureComponent } from "react";
import Utils from "../../app/Utils";
import {
  Text,
  View,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import HeaderCom from "../../components/HeaderCom";
import { nkey } from "../../app/keys/keyStore";
import { nstyles } from "../../styles/styles";
import { colors } from "../../styles/color";
import { sizes } from "../../styles";
import { nGlobalKeys } from "../../app/keys/globalKey";
import { ThongBaoInsertUpdate } from "../../apis/getNotifycation";
import { appConfig } from "../../app/Config";
import { ROOTGlobal } from "../../app/data/dataGlobal";

export default class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this._postNotification();
  }
  _postNotification = async () => {
    let device = Utils.getGlobal(nGlobalKeys.notification);
    let res = await ThongBaoInsertUpdate(device.userId, ROOTGlobal.dataUser.IdUser, Platform.OS)
  }
  _logout = () => {
    Utils.nsetStore(nkey.token, null);
    Utils.nsetStore(nkey.phonenumber, null);
    Utils.nsetStore(nkey.password, null);
    Utils.goscreen(this, "sc_EnterYourPhoneNumber");
  };
  render() {
    return (
      <View
        style={[nstyles.ncontainerX, { backgroundColor: colors.BackgroundHome }]}>
        <HeaderCom
          nthis={this}
          titleText={"Cài đặt"}
          customStyleIconRight={colors.brownGreyThree}
        />
        <View style={stSetting.cardBG}>
          <View style={stSetting.cardChild}>
            <Text style={stSetting.fntStyTextTitle}>Điều khoản bảo mật</Text>
            <TouchableOpacity onPress={() => Utils.goscreen(this, 'Modal_ThoaThuanNguoiDung')}>
              <Text style={stSetting.fntStyTextUnderline}>Xem chi tiết</Text>
            </TouchableOpacity>
          </View>
          <View style={stSetting.cardChild}>
            <Text style={stSetting.fntStyTextTitle}>Phiên bản</Text>
            <Text style={stSetting.fntStyTextNormal}>
              {appConfig.version}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const stSetting = StyleSheet.create({
  cardBG: {
    flexDirection: "column",
    margin: 10,
    backgroundColor: colors.white,
    padding: 10
  },
  cardChild: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    alignItems: "center",
    marginHorizontal: 10,
    paddingVertical: 20,
    borderBottomColor: colors.veryLightPinkThree
  },
  fntStyTextTitle: {
    flex: 1,
    marginLeft: 5,
    fontSize: sizes.fs(20)
  },
  fntStyTextUnderline: {
    marginLeft: 5,
    fontSize: sizes.fs(18),
    color: 'blue',
    textDecorationLine: 'underline'
  },
  fntStyTextNormal: {
    marginLeft: 5,
    fontSize: sizes.fs(18)
  }
});