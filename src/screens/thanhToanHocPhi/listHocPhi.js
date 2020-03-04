import React, { Component, PureComponent } from "react";
import Utils from "../../app/Utils";
import {
  Text,
  View,
  Dimensions,
  ImageBackground,
  Image,
  TouchableOpacity
} from "react-native";
import HeaderCom from "../../components/HeaderCom";
import ButtonCom from "../../components/Button/ButtonCom";
import { nkey } from "../../app/keys/keyStore";
import { nstyles } from "../../styles/styles";
import { Images } from "../../images";
import { sizes } from "../../styles/size";
import { colors } from "../../styles/color";
import { hocSinh_CreateOrders } from "../../apis/thanhtoan";
import WebView from "react-native-webview";

class ListHocPhi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isThanhToanSuccees: false,
      linkWebview: ""
    };
  }
  _subThanhToan = async () => {
    let MaHocSinh = 1202012416000070;
    let tien = 5000;
    let res = await hocSinh_CreateOrders(MaHocSinh, tien);
    if (res.status == 1) {
      this.setState({ isThanhToanSuccees: true });
      this.setState({ linkWebview: res.data.redirectURL.toString() });
    }
  };
  handleMessage = event => {
    Utils.nlog('handleMessage',event.nativeEvent.data)
  };
  render() {
    return (
      <View style={[nstyles.ncontainerX, { backgroundColor: colors.white }]}>
        <HeaderCom
          nthis={this}
          iconLeft={Images.icBackBlue}
          tintColorLeft={colors.brownGreyThree}
          customStyleIconRight={colors.brownGreyThree}
          titleText={"Thanh toán học phí"}
        />
        <TouchableOpacity
          onPress={this._subThanhToan}
          // onPress={() => Utils.goscreen(this, "sc_GiaoDichThanhCong")}
          style={{ backgroundColor: colors.bgYSchoold }}
        >
          <Text style={{ marginHorizontal: 30, marginVertical: 20 }}>
            Thanh toán
          </Text>
        </TouchableOpacity>
        {this.state.isThanhToanSuccees == true ? (
          <View
            style={[
              nstyles.nbody,
              { backgroundColor: colors.white, marginBottom: 20 }
            ]}
          >
            <WebView
              nativeConfig={{ props: { webContentsDebuggingEnabled: true } }}
              style={{ marginTop: 15 }}
              useWebKit={true}
              source={{ uri: this.state.linkWebview }}
              onMessage={this.handleMessage}
            />
          </View>
        ) : null}
      </View>
    );
  }
}


export default ListHocPhi;
