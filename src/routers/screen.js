import {
  createStackNavigator,
  createBottomTabNavigator,
  createSwitchNavigator,
  createDrawerNavigator
} from "react-navigation";
import { Easing, Animated } from "react-native";

// -- Root Screen + Component native custom
import MsgBox from "../components/MsgBox";
import RootScreen from "../screens/RootScreen";
import MediaPicker from '../components/MediaPicker'
import TakeCamera from "../components/TakeCamera";
// JeeKit
import Login from "../screens/auth/Login";
import Welcome from "../screens/welcome/Welcome";
import MenuRight from "../screens/welcome/MenuRight";
import EnterYourPhoneNumber from "../screens/auth/EnterYourPhoneNumber";

import Setting from "../screens/welcome/Setting";
import { nwidth } from "../styles/styles";
import { isPad } from "../styles/size";
import InfomationAccount from "../screens/welcome/InfomationAccount";
import ThongBao from "../screens/welcome/ThongBao";
import ChangePassword from "../screens/profile/changePassword";
import ChiTietThongBao from "../screens/thongbao/chitietthongbao";
import Diemdanh from "../screens/diemdanh/Diemdanh";
import BaoBaiMain from "../screens/BaoBai/BaoBaiMain";
import EditBaoBai from "../screens/BaoBai/EditBaoBai";
import BaoBaiHT from "../screens/BaoBai/BaoBaiHT";
import ModalghichuBB from "../screens/BaoBai/ModalghichuBB";
import ThemGhiChuu from "../screens/BaoBai/ThemGhiChuu";
import ViewImageListShow from '../components/ViewImageListShow';
// Góc học tập
//thoi khoa bieu
// EnterTheInformation
import SelectSubjects from "../screens/diemdanh/SelectSubjects";
//----------------------------------------------------------------

import AddLinkVideo from '../screens/BaoBai/AddLinkVideo';
import AddCauHoi from '../screens/BaoBai/AddCauHoi';
import ThemCauHoiKiemTra from '../screens/BaoBai/ThemCauHoiKiemTra';
import ModalChiTietBaiTap from "../screens/BaoBai/ModalChiTietBaiTap";

import ThoaThuanNguoiDung from '../screens/welcome/ThoaThuanNguoiDung';
import AddNewClass from "../screens/diemdanh/AddNewClass";
// -- End --
// import WorkBaiKiemTra from '../screens/BaoBai/workBaiKiemTra';




const HomeStack = createStackNavigator(
  {
    sc_Home: Welcome,
    //--
    sc_Diemdanh: Diemdanh,
    sc_AddNewClass: AddNewClass,
    sc_SelectSubjects: SelectSubjects,
    sc_ThongBao: ThongBao,

    //--
    sc_BaoBaiMain: BaoBaiMain,
    sc_EditBaoBai: EditBaoBai,
    sc_BaoBaiHT: BaoBaiHT,
    sc_ThemGhiChu: ThemGhiChuu,
    //--

    sc_notification: BaoBaiMain,
  },
  {
    headerMode: "none",
    navigationOptions: {
      gesturesEnabled: false,
      header: null
    }
  },
);
const DrawerNativatorRight = createDrawerNavigator(
  {
    dr_Home: HomeStack,
    dr_Setting: Setting,
    dr_User: InfomationAccount,
  },
  {
    drawerWidth: isPad ? 500 : nwidth * 0.82,
    drawerPosition: "left",
    contentComponent: MenuRight,
    disableGestures: true,
    overlayColor: 0.6
  }
);

const AuthStack = createStackNavigator(
  {
    sc_EnterYourPhoneNumber: EnterYourPhoneNumber,
    sc_AuthLogin: Login
  },
  {
    headerMode: "none",
    navigationOptions: {
      gesturesEnabled: false,
      header: null
    }
  }
);
/**
 * Router Gốc không thay đổi.
 */

const RootStack = createSwitchNavigator(
  {
    sc_Root: {
      screen: RootScreen,
      navigationOptions: {
        header: null
      }
    },
    sc_Auth: {
      screen: AuthStack,
      navigationOptions: {
        header: null
      }
    },
    sc_Welcome: {
      screen: DrawerNativatorRight,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    headerMode: "none",
    navigationOptions: {
      gesturesEnabled: false,
      header: null
    }
  }
);

// - Modal native -- Các screen dạng modal, popup khai báo ở đây
const RootModalStack = createStackNavigator(
  {
    Root: {
      screen: RootStack,
      path: "root"
    },
    // -- Screen Modal, Popup
    sc_ChangePassword: ChangePassword,
    Modal_MediaPicker: MediaPicker,
    sc_ViewImageListShow: ViewImageListShow,

    Modal_ChiTietThongBao: ChiTietThongBao,
    Modal_ModalghichuBB: ModalghichuBB,
    Modal_TakeCamera: TakeCamera,
    Modal_AddLinkVideo: AddLinkVideo,
    Modal_AddCauHoi: AddCauHoi,
    Modal_ThemCauHoiKiemTra: ThemCauHoiKiemTra,
    Modal_ModalChiTietBaiTap: ModalChiTietBaiTap,
    Modal_ThoaThuanNguoiDung: ThoaThuanNguoiDung,

  },
  {
    mode: "modal",
    headerMode: "none",
    transitionConfig: () => ({
      containerStyle: {
        backgroundColor: "transparent"
      }
    }),
    transparentCard: true,
    cardStyle: {
      backgroundColor: "transparent",
      opacity: 1
    }
  }
);

export const AppStack = createStackNavigator(
  {
    RootMain: {
      screen: RootModalStack,
      path: "app"
    },
    Modal_MsgBox: {
      screen: MsgBox,
      navigationOptions: {
        gesturesEnabled: false
      }
    }
  },
  {
    mode: "modal",
    headerMode: "none",
    transitionConfig: () => ({
      containerStyle: {
        backgroundColor: "transparent"
      },
      transitionSpec: {
        duration: 0,
        timing: Animated.timing,
        easing: Easing.step0
      }
    }),
    transparentCard: true,
    cardStyle: {
      backgroundColor: "transparent",
      opacity: 1
    }
  }
);
