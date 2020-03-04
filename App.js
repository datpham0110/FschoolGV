
import React, { Component } from "react"
import {
  Platform,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  Vibration
} from "react-native"
import { AppStack } from "./src/routers/screen"
import { nColors, nstyles } from "./src/styles/styles"
import { createAppContainer } from "react-navigation"
import codePush from "react-native-code-push"
import { Provider } from "react-redux"
import store from "./src/srcRedux/store"
import OneSignal from 'react-native-onesignal';
import { Images } from "./src/images"
import { ifIphoneX } from "react-native-iphone-x-helper"
import Utils from "./src/app/Utils"
import { nGlobalKeys } from "./src/app/keys/globalKey"
import { ListChatLop } from "./src/apis/chat";

const { width, height } = Dimensions.get("window")
const DURATION = 1000;
const prefix = "jeekidteacher://";
const AppContainer = createAppContainer(AppStack)
class App extends Component {
  constructor(props) {
    super(props);
    nthisApp = undefined;
    nthisRedux = undefined;
    nthisAppListParentsChat = undefined;
    nthisAppListTeacher = undefined;
    this.state = {
      snoti: '',
      stitle: '',
      topnotifi: new Animated.Value(-100),
    }
    this.dataNotify = ''
  }

  componentDidMount() {
    this.onReceived = this.onReceived.bind(this);
    OneSignal.addEventListener('received', this.onReceived);
  }


  _loadListClassChatRedux = async () => {
    if (nthisAppListParentsChat != undefined && nthisAppListParentsChat.props.isFocused) {
      nthisAppListParentsChat.GetListGetListParentsStuden();
    }
    if (nthisAppListTeacher != undefined && nthisAppListTeacher.props.isFocused) {
      nthisAppListTeacher.getlistHSchat();
    }

    if (nthisRedux != undefined) {
      let res = await ListChatLop();
      if (res.status == 1) {
        nthisRedux.props.setListClassChat(res.data)
      } else {
        nthisRedux.props.setListClassChat([])
      }
    }
  }
  onReceived(notification) {
    let data = notification.payload.additionalData.data;

    if (data.LoaiChat == '1') {
      this._loadListClassChatRedux();
      //Chat thường
      if (Utils.getGlobal(nGlobalKeys.screenSelected, '') == 'detailChat') {
        if (Utils.getGlobal(nGlobalKeys.isFocusChatOnlyIDTaiKhoan, '') == data.IdTaiKhoan && Utils.getGlobal(nGlobalKeys.isFocusChatOnlyIDKhachHang, '') == data.IdKhachHang) {
          Utils.setGlobal(nGlobalKeys.flagRequest, true)
          return;
        }
      }
    }
    if (data.LoaiChat == '2' || data.LoaiChat == '3') {
      this._loadListClassChatRedux();
      if (data.LoaiChat == '2') {
        //Chat class
        if (Utils.getGlobal(nGlobalKeys.isFocusChatGroupClass, '') == data.IdNhom) {
          Utils.setGlobal(nGlobalKeys.flagRequest, true)
          return;
        }
      } else {
        //Chat tự tạo
        if (Utils.getGlobal(nGlobalKeys.isFocusChatGroupCreate, '') == data.IdNhom) {
          Utils.setGlobal(nGlobalKeys.flagRequest, true)
          return;
        }
      }
    }
    this.openNotifiCus(notification.payload);
  }

  openNotifiCus = async (notifi) => {
    strTitle = notifi.title;
    strThongBao = notifi.body;
    this.dataNotify = notifi
    this.setState({ stitle: strTitle, snoti: strThongBao });
    Vibration.vibrate(DURATION);
    Animated.timing(
      this.state.topnotifi,
      {
        toValue: 0,
        duration: 800
      }
    ).start();
    setTimeout(() => {
      Animated.timing(
        this.state.topnotifi,
        {
          toValue: -100,
          duration: 450
        }
      ).start();
      this.setState({ stitle: '' });
    }, 4000);
  }


  onnotiClick = () => {
    Animated.timing(
      this.state.topnotifi,
      {
        toValue: -100,
        duration: 450
      }
    ).start();
    if (!nthisApp)
      return;
    if (this.dataNotify.additionalData.data.deeplink == 'jeekidstudent://app/root/DrawerNativatorRight/HomeStack/ListTeacher') {
      if (this.dataNotify.additionalData.data.LoaiChat == 1) {
        Utils.goback(nthisApp)
        setTimeout(() => {
          Utils.goscreen(nthisApp, 'sc_Chat', { dataNotify: this.dataNotify, flagNotify: true })
        }, 500);
      }
      else {

      }
    }
    if (this.dataNotify.additionalData.data.deeplink == undefined) {
      Utils.goback(nthisApp)
      setTimeout(() => {
        Utils.goscreen(nthisApp, 'sc_DetailsChatGroup', { dataNotify: this.dataNotify.additionalData.data, flagNotify: true })
      }, 500);
    }
  }

  render() {
    return (
      <Provider store={store}>
        <AppContainer
          uriPrefix={prefix}
          ref={nav => { this.navigator = nav }} >
          <StatusBar
            backgroundColor={nColors.main}
            barStyle="light-content"
            translucent={true}
          />
        </AppContainer>

        <Animated.View style={{
          position: 'absolute', left: 0, top: this.state.topnotifi,
          right: 0, ...ifIphoneX({
            height: 94,
            paddingTop: 30
          }, {
            height: 94
          }),
          backgroundColor: '#FFFFFF',
          shadowColor: "#000000",
          shadowOpacity: 0.3,
          shadowRadius: 1,
          shadowOffset: {
            height: 0.5,
            width: 0
          },
          elevation: 2,
          borderRadius: 10,
        }}>
          <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', padding: 10 }} onPress={this.onnotiClick}>
            <Image style={{ width: 40, height: 40, resizeMode: 'contain', marginRight: 12, borderRadius: 5 }} source={Images.logoYSchool} />
            <View style={{ flex: 1 }} >
              {
                this.state.stitle == '' ? null :
                  <Text style={{ color: '#193B57', fontWeight: '800' }}>{this.state.stitle}</Text>
              }
              <Text numberOfLines={1} style={{ color: '#193B57' }}>{this.state.snoti}</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </Provider>
    )
  }
}

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
  installMode: codePush.InstallMode.ON_NEXT_RESTART
}

export default codePush(codePushOptions)(App)
