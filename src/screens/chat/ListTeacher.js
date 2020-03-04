import React, { Component } from "react";
import {
  View, Text, FlatList,
  TouchableOpacity, Image,
  StyleSheet,
  TextInput
} from "react-native";
import HeaderCom from "../../components/HeaderCom";
import { colors } from "../../styles/color";
import { nstyles } from "../../styles/styles";
import Utils from "../../app/Utils";
import { Images } from "../../images";
import { sizes, fs, reSize } from "../../styles/size";
import apis from '../../apis';
import { ROOTGlobal } from "../../app/data/dataGlobal";
import { RootLang } from "../../app/data/locales";
import ListEmpty from '../../components/ListEmpty';
import moment from 'moment';
import { Picker } from "native-base";
import { listHSchat, ListChatLop } from "../../apis/chat";
import { nGlobalKeys } from "../../app/keys/globalKey";
import { withNavigationFocus } from 'react-navigation';



function handleTime(second) {
  if (second < 60) return { value: second, name: 'giây' };
  if (second >= 60 && second < 3600) return { value: Math.round(second / 60), name: 'phút' };
  if (second >= 3600 && second < 86400) return { value: Math.round(second / 3600), name: 'giờ' };
  if (second >= 86400) return { value: Math.round(second / 86400), name: 'ngày' };
}

// const ItemChatUser = (props) => {
//   var {
//     item, index,
//     onItemClick = () => { }
//   } = props;

//   const time = handleTime(Utils.datesDiff(new Date(), moment(item.CreatedDate, 'DD/MM/YYYY HH:mm'), true));
//   return (
//     <TouchableOpacity
//       activeOpacity={0.5}
//       onPress={onItemClick(item)}>
//       <View style={styles.viewRowItemChatUser}>
//         <Image
//           source={Images.imgProfile}
//           // source={{ uri: item.Avata == '' ? undefined : item.Avata }}
//           resizeMode="contain"
//           style={styles.imgaeAvatar}
//         />
//         <View style={{ marginLeft: 5, flex: 1 }}>
//           <Text
//             numberOfLines={1}
//             style={[styles.textMessage, { fontWeight: '600' }]}>
//             {item.TenKH}
//           </Text>
//           <Text
//             numberOfLines={1}
//             style={[styles.textMessage, { marginTop: 5, fontWeight: '300' }]}>
//             (Phụ huynh: {item.Fullname})
//           </Text>
//           <Text
//             numberOfLines={1}
//             style={[styles.textMessage, { marginTop: 5, opacity: item.NumberMgsUnread == 0 ? 0.5 : 1 }]}>
//             {item.NoiDung}
//           </Text>
//         </View>
//         <View style={{ marginLeft: 5 }}>
//           <View style={{ alignItems: 'flex-end' }}>
//             <Text style={styles.textMessage}>
//               {time ? (`${time.value} ${time.name} trước`) : ''}
//             </Text>
//             {
//               item.NumberMgsUnread == 0 ? null :
//                 <View style={styles.viewNumberOldMessage}>
//                   <Text style={styles.textNumberOldMessage}>
//                     {item.NumberMgsUnread > 5 ? '5+' : item.NumberMgsUnread}
//                   </Text>
//                 </View>
//             }
//           </View>
//         </View>
//       </View>
//     </TouchableOpacity>
//   )
// }
class ListTeacher extends Component {
  constructor(props) {
    super(props);
    nthisApp = this;
    nthisAppListTeacher = this;
    // this.IDGiaoVien = 0;
    this.state = {
      tabNP: 0,
      // valuListLop: 'Mam non',
      listLop: [],
      lopSelect: '',
      listChatUser: [],
      listChatUserGroup: [],
      txtLoading: RootLang.lang.loading,
      refreshing: false,
      // valueListTruong: ROOTGlobal.IdCN,
      titleChat: 'Chat với phụ huynh'
    };
    // this.keywordNameStudent = '';
    this.isNotify = Utils.ngetParam(this, 'isNotify', false);
    this.dataClass = Utils.ngetParam(this, 'dataClass', '');
    this.reload = Utils.ngetParam(this, 'reload', () => { })
  }

  componentDidMount() {
    this.getlistHSchat();
    this._loadDataInter();
  }


  _loadListClassChatRedux = async () => {
    let res = await ListChatLop();
    if (res.status == 1) {
      this.props.setListClassChat(res.data)
    } else {
      this.props.setListClassChat([])
    }
  }

  componentWillUnmount() {
  }


  getlistHSchat = async () => {
    this._getAllcontactl(this.dataClass.IDLop);
    this._getChatGroupGVPH();
  }
  _getAllcontactl = async (IdNhom) => {
    const res = await apis.Chat.ContactHocSinh(ROOTGlobal.dataUser.IDKHDPS, IdNhom, ROOTGlobal.dataUser.IdUser);
    if (res.status == 1) {
      this.setState({
        listChatUser: res.data.GhiChuData, refreshing: false
      });
    } else {
      this.setState({
        listChatUser: [], refreshing: false
      });
    };
  };

  _getChatGroupGVPH = async () => {
    const res = await apis.Chat.ChatGroupGVPH(ROOTGlobal.dataUser.IDKHDPS, ROOTGlobal.dataUser.IdUser);
    Utils.nlog('ChatGroupGVPH', res)
    if (res.status == 1) {
      this.setState({
        listChatUserGroup: res.data.GhiChuData, refreshing: false
      });
    } else {
    };
  };

  _ClickTeacher = (item) => () => {
    Utils.goscreen(this, "sc_ListParentsChat", { TenKH: item.TenKH, IdLop: item.IdLop, IDKhachHang: item.IDKhachHang, _reloadListChat: this._reloadListChat });
  };

  _ClickChatGroup = (item) => () => {
    Utils.goscreen(this, "sc_DetailsChatGroup", { IdUser: ROOTGlobal.dataUser.IdUser, IdLop: item.IdLop, TenLop: item.TenLop, dataParam: item, flagNotify: false, reloadData1: this.reloadData1 });
  };

  reloadData1 = () => {
    this.getlistHSchat();
  }
  _reloadListChat = (flat) => {
    this.getlistHSchat();
  }
  renderItemUser = ({ item, index }) => {
    var { listChatUserGroup } = this.state;
    const time = handleTime(Utils.datesDiff(new Date(), moment(item.CreatedDate, 'YYYY/MM/DD HH:mm'), true));
    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={this._ClickTeacher(item)}>
          <View style={styles.viewRowItemChatUser}>
            <Image
              source={Images.imgProfile}
              resizeMode="contain"
              style={styles.imgaeAvatar}
            />
            <Text
              numberOfLines={1}
              style={[styles.textTitleMessage, { fontWeight: item.NumberMgsUnread == 0 ? '400' : '800' }]}>
              {item.TenKH}
            </Text>
            <View style={{ marginLeft: 5 }}>
              <View style={{ alignItems: 'flex-end' }}>
                {
                  item.NumberMgsUnread == 0 ? null :
                    <View style={styles.viewNumberOldMessage}>
                      <Text style={styles.textNumberOldMessage}>
                        {item.NumberMgsUnread > 0 ? 'N' : ''}
                      </Text>
                    </View>
                }
                <Text style={styles.textMessage}>
                  {time ? time.name == 'giây' ? 'now' : (`${time.value} ${time.name} trước`) : ''}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity >
        {
          index == listChatUserGroup.lenght - 1 ? null : <View style={{ height: 1, backgroundColor: colors.black_20, marginLeft: 80 }} />
        }
      </View >
    )
  };

  renderItemUserGroup = ({ item, index }) => {
    var { listChatUser } = this.state;
    const time = handleTime(Utils.datesDiff(new Date(), moment(item.CreatedDate, 'YYYY/MM/DD HH:mm'), true));
    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={this._ClickChatGroup(item)}>
          <View style={styles.viewRowItemChatUser}>
            <Image
              source={Images.imgProfile}
              resizeMode="contain"
              style={styles.imgaeAvatar}
            />
            <View style={{ marginLeft: 5, flex: 1 }}>
              <Text
                numberOfLines={1}
                style={[styles.textMessage, { fontWeight: '600' }]}>
                {item.IdLop != 0 ? item.TenLop : item.TenChatGroup}
              </Text>
              <Text
                numberOfLines={1}
                style={[styles.textMessage, { marginTop: 5, opacity: item.NumberMgsUnread == 0 ? 0.5 : 1 }]}>
                {item.NoiDung}
              </Text>
            </View>
            <View style={{ marginLeft: 5 }}>
              <View style={{ alignItems: 'flex-end' }}>

                {
                  item.NumberMgsUnread == 0 ? null :
                    <View style={styles.viewNumberOldMessage}>
                      <Text style={styles.textNumberOldMessage}>
                        {item.NumberMgsUnread > 0 ? 'N' : ''}
                      </Text>
                    </View>
                }
                <Text style={styles.textMessage}>
                  {time ? time.name == 'giây' ? 'now' : (`${time.value} ${time.name} trước`) : ''}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        {
          index == listChatUser.lenght - 1 ? null : <View style={{ height: 1, backgroundColor: colors.black_20, marginLeft: 80 }} />
        }
      </View>
    )

  };



  handleRefresh = () => {
    this.setState({ refreshing: true }, () => {
      this._getAllcontactl(this.dataClass.IDLop);
      this._loadListClassChatRedux();
    })
  }
  timer = () => {
    this._loadDataInter();

  };
  _loadDataInter = async => {
    this._getAllcontactl(this.dataClass.IDLop);
    this._getChatGroupGVPH();
    this._loadListClassChatRedux();
  }

  GetHocSinhList = async (valIdLop) => {
    this.state.listLop.findIndex(item => {
      if (item.IdNhom == valIdLop) {
        this.setState({ lopSelect: item },
          this.handleRefresh)
      }
    });
  }
  reloadData = () => {
    this._getChatGroupGVPH()
  }
  _goBackSreen = () => {
    this.reload();
    Utils.goback(this)
  }
  render() {
    var { listChatUser, tabNP, listChatUserGroup, lopSelect, listLop } = this.state;
    return (
      <View style={[nstyles.ncontainerX]}>
        <HeaderCom
          nthis={this}
          titleText={this.state.titleChat}
          titleStyle={{ color: colors.white }}
          onPressLeft={this._goBackSreen}
          tintColorLeft={colors.white}
          style={{ paddingBottom: 0, paddingTop: 0, marginTop: 0, marginBottom: 0 }}
        />
        <View style={styles.body}>
          {/* {tabNP == 0 ?
              <View style={styles.viewTitle}>
                <View style={[nstyles.nrow, styles.container]}>
                  <View style={{ flex: 1 }}>
                    {Platform.OS == 'ios' ?
                      <View style={{ position: 'absolute', right: 5, top: 0, bottom: 0, justifyContent: 'center' }}>
                        <Image source={Images.icDown} resizeMode='contain' style={[nstyles.nIcon20, { tintColor: '#A3A3A3' }]} />
                      </View>
                      : null
                    }
                    <Picker
                      mode="dropdown"
                      style={{ width: '100%', height: 30 }}
                      textStyle={{ fontWeight: 'bold', fontSize: 16 }}
                      selectedValue={lopSelect.IdNhom}
                      onValueChange={(val) => {
                        this.GetHocSinhList(val);
                      }}>
                      {listLop.map((item, index) => <Picker.Item key={index} label={item.TenNhomKH} value={item.IdNhom} />)}
                    </Picker>
                  </View>
                </View>
              </View> : null} */}
          {tabNP == 0 ? <FlatList
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
            ListEmptyComponent={<ListEmpty textempty={this.setState.txtLoading} />}
            style={styles.users}
            renderItem={this.renderItemUser}
            data={listChatUser}
            keyExtractor={(item, index) => index.toString()}
          /> : <FlatList
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
              ListEmptyComponent={<ListEmpty textempty={this.setState.txtLoading} />}
              style={styles.users}
              renderItem={this.renderItemUserGroup}
              data={listChatUserGroup}
              keyExtractor={(item, index) => index.toString()}
            />}
        </View>
        {
          this.state.tabNP == 0 ? null : <TouchableOpacity onPress={() => Utils.goscreen(this, 'sc_ListChatGroup', { reloadData: this.reloadData })}
            style={{ paddingVertical: 10, backgroundColor: 'white', marginTop: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: fs(14), fontWeight: 'bold' }}>Thêm nhóm mới</Text>
          </TouchableOpacity>
        }
        <View style={[nstyles.nrow, {
          justifyContent: 'center', alignItems: 'center', marginLeft: - 22,
          marginRight: -20, paddingTop: 10, paddingBottom: 10, marginTop: 8, backgroundColor: 'white'
        }]}>
          <TouchableOpacity onPress={() => { this.setState({ tabNP: 0, titleChat: 'Chat với phụ huynh' }), Utils.setGlobal(nGlobalKeys.tabChatSelect, 'listChat') }}
            style={{ alignItems: 'center' }}>
            <Image
              source={this.state.tabNP == 0 ? Images.groupchat1 : Images.Ungroupchat1}
              resizeMode="contain"
              style={{
                width: reSize(25),
                height: reSize(25),
              }}
            />
            <Text style={{ fontSize: fs(14), paddingVertical: 5 }}>Chat riêng</Text>
          </TouchableOpacity>
          <View style={{ width: 20, marginHorizontal: 20 }} />
          <TouchableOpacity onPress={() => { this.setState({ tabNP: 1, titleChat: 'Chat với nhóm' }), Utils.setGlobal(nGlobalKeys.tabChatSelect, 'chatGroup') }}
            style={{ alignItems: 'center' }}>
            <Image
              source={this.state.tabNP == 1 ? Images.Ungroupchat2 : Images.groupchat2}
              resizeMode="contain"
              style={{
                width: reSize(25),
                height: reSize(25),
              }}
            />
            <Text style={{ fontSize: fs(14), paddingVertical: 5 }}>Chat nhóm</Text>
          </TouchableOpacity>
        </View>
      </View>
      // </View >
    );
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5
  },
  viewTitle: {
    ...nstyles.nrow,
    backgroundColor: colors.white,
    padding: 18,
    paddingTop: 20,
    paddingRight: 14,
  },
  viewItemTitle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.paleGreyTwo,
    padding: 8
  },
  textMessage: {
    flex: 1,
    fontSize: sizes.sText12,
    color: colors.blackShadow,
    justifyContent: "center",
    marginLeft: 10,
  },
  textTitleMessage: {
    flex: 1,
    fontSize: sizes.sText16,
    color: colors.blackShadow,
    justifyContent: "center",
    marginLeft: 10,
  },
  viewNumberOldMessage: {
    backgroundColor: colors.colorRed,
    borderRadius: 16,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textNumberOldMessage: {
    fontSize: sizes.sText8,
    color: colors.white,
    fontWeight: 'bold'
  },
  users: {
    marginTop: 20,
    backgroundColor: colors.white
  },
  viewRowItemChatUser: {
    ...nstyles.nrow,
    padding: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  imgaeAvatar: {
    width: reSize(48),
    height: reSize(48),
    borderColor: colors.paleGrey,
    borderWidth: 0.5,
    borderRadius: reSize(24)
  },
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.whitegay,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1
  },
});

const mapStateToProps = state => ({
  infoUser: state.infoUser,
  listClassChat: state.listClassChat
});

export default Utils.connectRedux(withNavigationFocus(ListTeacher), mapStateToProps, true);
