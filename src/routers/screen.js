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
import ListTeacher from "../screens/chat/ListTeacher";
import ListParentsChat from '../screens/chat/ListParentsChat';
import Chat from "../screens/chat/chat";
import MenuRight from "../screens/welcome/MenuRight";
import HocPhi from "../screens/hocphi/HocPhi";
import EnterYourPhoneNumber from "../screens/auth/EnterYourPhoneNumber";

import Setting from "../screens/welcome/Setting";
import { nwidth } from "../styles/styles";
import { isPad } from "../styles/size";
import InfomationAccount from "../screens/welcome/InfomationAccount";
import ThongBao from "../screens/welcome/ThongBao";
import ChangePassword from "../screens/profile/changePassword";
import ChiTietHocPhi from "../screens/hocphi/ChiTietHocPhi";
import ChiTietThongBao from "../screens/thongbao/chitietthongbao";
import DropDownChiNhanh from "../screens/chiNhanh/dropdownChiNhanh";
import Diemdanh from "../screens/diemdanh/Diemdanh";
import BaoBaiMain from "../screens/BaoBai/BaoBaiMain";
import EditBaoBai from "../screens/BaoBai/EditBaoBai";
import BaoBaiDetail from "../screens/BaoBai/BaoBaiDetail";
import BaoBaiHT from "../screens/BaoBai/BaoBaiHT";
import ModalCTHocPhi from '../screens/hocphi/modalCTHocPhi';
import ThongBaoHocPhi from '../screens/hocphi/ThongBaoHocPhi';
// import BaoBaiGhiChu from "../screens/BaoBai/BaoBaiGhiChu";
import ListHSGhichu from "../screens/BaoBai/ListHSGhichu";
import ModalghichuBB from "../screens/BaoBai/ModalghichuBB";
import ThemGhiChuu from "../screens/BaoBai/ThemGhiChuu";
import ViewImageListShow from '../components/ViewImageListShow';
import ListChatGroup from "../screens/chat/ListChatGroup";
import SodoDiemDanh from "../screens/diemdanh/SodoDiemDanh";
import SelectHocSinhDiemDanh from '../screens/diemdanh/SelectHocSinhDiemDanh';
import DetailsChatGroup from '../screens/chat/detailsChatGroup';
// Góc học tập
import HomeGocHocTap from '../screens/gocHocTap/homeGocHocTap';
import GhiChuGocHocTap from '../screens/gocHocTap/ghiChuGocHocTap';
import GocHoatDongHome from "../screens/gocchiase/GocHoatDongHome";
import ChiTietGocHoatDong from "../screens/gocchiase/ChiTietGocHoatDong";
import AddGocHoatDong from "../screens/gocchiase/AddGocHoatDong";
import KhaoSatHome from "../screens/khaosat/KhaoSatHome";
import AddKhaoSat from "../screens/khaosat/AddKhaoSat";
import ChiTietKhaoSat from "../screens/khaosat/ChiTietKhaoSat";
import AddNewKhaosat from "../screens/khaosat/AddNewKhaosat";
import AddCauhoiNew from "../screens/khaosat/AddCauhoiNew";
//thoi khoa bieu
import ThoiKhoaBieuHome from '../screens/thoikhoabieu/ThoiKhoaBieuHome';
import newThoiKhoaBieu from '../screens/thoikhoabieu/newThoiKhoaBieu';
import AddNewClass from "../screens/diemdanh/AddNewClass";
import NewLopDiemDanh from "../screens/diemdanh/NewLopDiemDanh";
import SelectStudenClass from '../screens/diemdanh/SelectStudenClass'
import TienichHome from "../screens/tienichKhac/TienichHome";
import NapTienDienThoai from "../screens/tienichKhac/NapTienDienThoai";
import ChiTietGiaodich from "../screens/tienichKhac/ChiTietGiaodich";
// EnterTheInformation
import HoTroKhachHang from '../screens/hoTroKhachHang/hoTroKhachHang';
import Thecao from "../screens/tienichKhac/TheCao/Thecao";
import ThanhToan from "../screens/tienichKhac/ThanhToan";
import ChonNhaMang from "../screens/tienichKhac/TheCao/ChonNhaMang";
import HoaDonHome from "../screens/tienichKhac/HoaDon/HoaDonHome";
import SelectSubjects from "../screens/diemdanh/SelectSubjects";
import ListUserKS from "../screens/khaosat/ListUserKS";
//----------------------------------------------------------------
import ListClassChat from '../screens/chat/ListClassChat';
import LichSuHome from "../screens/lichsu/LichSuHome";
import AddLinkVideo from '../screens/BaoBai/AddLinkVideo';
import AddCauHoi from '../screens/BaoBai/AddCauHoi';
import ThemCauHoiKiemTra from '../screens/BaoBai/ThemCauHoiKiemTra';
import LichSuBaoBai from "../screens/BaoBai/LichSuBaoBai";
import ChitietLichSuBaoBai from "../screens/BaoBai/ChitietLichSuBaoBai";
import ChiTietHSBaobai from "../screens/BaoBai/ChiTietHSBaobai";
import ChiTietThuMoiSuKien from "../screens/BaoBai/ChiTietThuMoiSuKien";
import ModalChiTietBaiTap from "../screens/BaoBai/ModalChiTietBaiTap";

import ThoaThuanNguoiDung from '../screens/welcome/ThoaThuanNguoiDung';
// -- End --
// import WorkBaiKiemTra from '../screens/BaoBai/workBaiKiemTra';
const GocHocTapStack = createStackNavigator(
  {
    sc_HomeGocHocTap: {
      screen: HomeGocHocTap,
      path: 'homeGocHocTap'
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
const GocHoatDongStack = createStackNavigator(
  {
    sc_GocHoatDongHome: {
      screen: GocHoatDongHome,
      path: 'GocHoatDongHome'
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
const ChatStack = createStackNavigator(
  {
    sc_ListClassChat: {
      screen: ListClassChat,
      path: 'ListClassChat'
    },
    sc_ListTeacher: {
      screen: ListTeacher,
      path: "ListTeacher"
    },
    sc_ListParentsChat: {
      screen: ListParentsChat,
      path: "ListParentsChat"
    },
    sc_Chat: {
      screen: Chat,
      path: "Chat"
    },
    sc_DetailsChatGroup: {
      screen: DetailsChatGroup,
      path: "DetailsChatGroup"
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
const TienIchStack = createStackNavigator({
  sc_TienichHome: {
    screen: TienichHome,
    path: 'TienichHome'
  },
  sc_NapTienDienThoai: {
    screen: NapTienDienThoai,
    path: 'NapTienDienThoai'
  },
  sc_Thecao: {
    screen: Thecao,
    path: 'Thecao'
  },
  sc_ThanhToan: {
    screen: ThanhToan,
    path: 'ThanhToan'
  },
  sc_HoaDonHome: {
    screen: HoaDonHome,
    path: 'HoaDonHome'
  }

},
  {
    headerMode: "none",
    navigationOptions: {
      gesturesEnabled: false,
      header: null
    }
  })
const HomeStack = createStackNavigator(
  {
    sc_Home: Welcome,
    //--
    sc_Diemdanh: Diemdanh,
    sc_AddNewClass: AddNewClass,
    sc_SelectSubjects: SelectSubjects,
    sc_NewLopDiemDanh: NewLopDiemDanh,
    sc_SelectStudenClass: SelectStudenClass,
    sc_ThongBao: ThongBao,
    //--
    sc_BaoBaiMain: BaoBaiMain,
    sc_EditBaoBai: EditBaoBai,
    sc_BaoBaiDetail: BaoBaiDetail,
    sc_BaoBaiHT: BaoBaiHT,
    sc_HocPhi: HocPhi,
    // sc_BaoBaiGhiChu: BaoBaiGhiChu,
    sc_ListHSGhichu: ListHSGhichu,
    sc_ThemGhiChu: ThemGhiChuu,
    //--
    sc_ChatStack: {
      screen: ChatStack,
      path: "ChatStack"
    },
    sc_notification: BaoBaiMain,
    Modal_SodoDiemDanh: SodoDiemDanh,
    sc_GocHocTapStack: {
      screen: GocHocTapStack,
      path: 'GocHocTapStack'
    },
    sc_GocHoatDongStack: {
      screen: GocHoatDongStack,
      path: 'GocHoatDongStack'
    },
    sc_ChiTietGocHoatDong: {
      screen: ChiTietGocHoatDong,
      path: 'sc_ChiTietGocHoatDong'
    },
    sc_KhaoSatHome: {
      screen: KhaoSatHome,
      path: 'KhaoSatHome'
    },
    sc_ChiTietKhaoSat: {
      screen: ChiTietKhaoSat,
      path: 'ChiTietKhaoSat'
    },
    sc_AddNewKhaosat: {
      screen: AddNewKhaosat,
      path: 'AddNewKhaosat'
    },
    sc_TienichHome: TienIchStack,
    sc_ThoiKhoaBieuHome: ThoiKhoaBieuHome,
    sc_newThoiKhoaBieu: newThoiKhoaBieu,
    sc_HoTroKhachHang: HoTroKhachHang,
    Modal_LichSuBaoBai: LichSuBaoBai,
    sc_ChitietLichSuBaoBai: ChitietLichSuBaoBai,
    sc_ChiTietHSBaobai: ChiTietHSBaobai,
    sc_ChiTietThuMoiSuKien: ChiTietThuMoiSuKien
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
    dr_LichSuHome: LichSuHome
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
    sc_ChiTietHocPhi: ChiTietHocPhi,
    sc_ThongBaoHocPhi: ThongBaoHocPhi,
    Modal_MediaPicker: MediaPicker,
    sc_ViewImageListShow: ViewImageListShow,

    Modal_ChiTietThongBao: ChiTietThongBao,
    Modal_DDropDownChiNhanh: DropDownChiNhanh,
    Modal_ModalCTHocPhi: ModalCTHocPhi,
    Modal_ModalghichuBB: ModalghichuBB,
    Modal_TakeCamera: TakeCamera,
    sc_ListChatGroup: ListChatGroup,
    Modal_SelectHocSinhDiemDanh: SelectHocSinhDiemDanh,
    Modal_GhiChuGocHocTap: GhiChuGocHocTap,
    Modal_AddGocHoatDong: AddGocHoatDong,
    Modal_AddKhaoSat: AddKhaoSat,
    Modal_AddCauhoiNew: AddCauhoiNew,
    Modal_ChonNhaMang: ChonNhaMang,
    Modal_HoTroKhachHang: HoTroKhachHang,
    Modal_ListUserKS: ListUserKS,
    Modal_AddLinkVideo: AddLinkVideo,
    Modal_AddCauHoi: AddCauHoi,
    Modal_ThemCauHoiKiemTra: ThemCauHoiKiemTra,
    Modal_ModalChiTietBaiTap: ModalChiTietBaiTap,
    Modal_ThoaThuanNguoiDung: ThoaThuanNguoiDung,
    sc_ChiTietGiaodich: {
      screen: ChiTietGiaodich,
      path: 'ChiTietGiaodich'
    }
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
