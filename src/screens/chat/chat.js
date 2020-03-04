import React, { Component } from "react";
import Utils from "../../app/Utils";
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput
} from "react-native";
import { nstyles, nheight, paddingBotX } from "../../styles/styles";
import { colors } from "../../styles/color";
import HeaderCom from "../../components/HeaderCom";
import { Images } from "../../images";
import { loadmes, sendmes, ListChatLop } from "../../apis/chat";
import ListEmpty from "../../components/ListEmpty";
import Moment from "moment";
import { ROOTGlobal } from "../../app/data/dataGlobal";
import { nGlobalKeys } from '../../app/keys/globalKey';
var loadingMore = false;
import { appConfig } from '../../app/Config';

class Chat extends Component {
  constructor(props) {
    super(props);
    nthisApp = this;
    this.item = Utils.ngetParam(this, 'item');
    this.IDGiaoVien = ROOTGlobal.dataUser.IdUser
    this._reloadListChat = Utils.ngetParam(this, '_reloadListChat', () => { })
    this.state = {
      dataSource: [],
      FullName: Utils.ngetParam(this, 'FullName'),
      msgtext: "",
      issending: false,
      sizeInput: 0,
      maxRowID: 0,
      minRowID: 0,
      nameShow: ''
    };
    this.listMes = {};
    this.flag = false;
    this.flagNotify = Utils.ngetParam(this, 'flagNotify');
    this.dataNotify = Utils.ngetParam(this, 'dataNotify');
    this.countRequest = 10;

  }

  componentDidMount() {
    Utils.setGlobal(nGlobalKeys.screenSelected, 'detailChat')
    if (this.flagNotify == false) {
      Utils.setGlobal(nGlobalKeys.isFocusChatOnlyIDTaiKhoan, this.item.IDTaiKhoan)
      Utils.setGlobal(nGlobalKeys.isFocusChatOnlyIDKhachHang, this.item.IDKhachHang)
    } else {
      let data = this.dataNotify.additionalData.data;
      Utils.setGlobal(nGlobalKeys.isFocusChatOnlyIDTaiKhoan, data.IdTaiKhoan)
      Utils.setGlobal(nGlobalKeys.isFocusChatOnlyIDKhachHang, data.IdKhachHang)
    }
    this.loadMesInterval(-1);
    var intervalId = setInterval(this.timer, 1000);
    this.setState({ intervalId: intervalId });
    this._setTitle();

  }
  componentWillUnmount() {
    Utils.setGlobal(nGlobalKeys.isFocusChatOnlyIDTaiKhoan, '')
    Utils.setGlobal(nGlobalKeys.isFocusChatOnlyIDKhachHang, '')
    this._reloadListChat(true)
    try {
      clearInterval(this.state.intervalId);
    } catch (error) { }
  }
  scrollToEnd = () => {
    if (this.state.dataSource.length != 0)
      this.listView.scrollToIndex({ index: 0, animated: true });
  };
  timer = () => {
    if (this.flag == true) {
      this.loadMesInterval(-1);
    }
  };

  _setTitle = () => {
    if (this.flagNotify == true) {
      let data = this.dataNotify.additionalData.data;
      if (data.LoaiChat == '1') {
        this.setState({ nameShow: data.TenNguoiGui })
      }
    } else {
      if (this.item.IdLop != 0) {
        this.setState({ nameShow: this.item.Fullname })
      }
    }
  }
  _formatDate = list => {
    for (let i = 0; i < list.length - 1; i++) {
      var datenow = new Date(list[i].CreatedDate);
      var dateback = new Date(list[i + 1].CreatedDate);
      if (datenow.getDate() == dateback.getDate()) {
        list[i].flag = false;
      } else {
        list[i].flag = true;
      }
    }
    return list;
  };

  _loadListClassChatRedux = async () => {
    if (nthisApp != undefined) {
      let res = await ListChatLop();

      if (res.status == 1) {
        nthisApp.props.setListClassChat(res.data)
      } else {
        nthisApp.props.setListClassChat([])
      }
    }
  }

  loadMesInterval = async flag => {
    if (Utils.getGlobal(nGlobalKeys.flagRequest, false) == true) {
      this.countRequest = 10;
      Utils.setGlobal(nGlobalKeys.flagRequest, false)
    }
    if (this.countRequest == 10) {
      this._loadListClassChatRedux
      let res;
      if (this.flagNotify == true) {
        res = await loadmes(
          this.dataNotify.additionalData.data.IdKhachHang,
          this.dataNotify.additionalData.data.IdTaiKhoan,
          flag
        );
      } else {
        res = await loadmes(
          this.item.IDKhachHang,
          this.item.IDTaiKhoan,
          flag
        );
      }
      if (res.status == 1 && res.data.GhiChuData != null) {
        //Có dữ liệu trả về
        if (flag == -1) {
          if (this.flag == false) {
            // Lần đầu load list
            this.listMes = res.data.GhiChuData ? res.data.GhiChuData : [];
            if (this.listMes.length == 0) {
              this.flag = true;
              return;
            }
            let max = this.listMes.length - 1;
            this.setState({ dataSource: this._formatDate(this.listMes), minRowID: this.listMes[max].RowID, maxRowID: this.listMes[0].RowID });
            this.flag = true;
          } else {
            // Những lần sau load list
            if (res.data.GhiChuData[0].RowID > this.state.maxRowID) {
              for (let i = res.data.GhiChuData.length - 1; i >= 0; i--) {
                if (res.data.GhiChuData[i].RowID > this.state.maxRowID) {
                  this.listMes.unshift(res.data.GhiChuData[i]);
                }
              }
              this.setState({ dataSource: this._formatDate(this.listMes), maxRowID: res.data.GhiChuData[0].RowID }); // Có dữ liệu mơi ghép đầu list
            }
          }
        } else {
          //Load những thằng phía sau id của flag
          if (res.data.GhiChuData) {
            this.listMes = this.listMes.concat(res.data.GhiChuData);
            let minn = res.data.GhiChuData.length - 1;
            let min = res.data.GhiChuData[minn].RowID;
            this.setState({ dataSource: this._formatDate(this.listMes), minRowID: min });
          }
        }
      }
      this.countRequest = 0;
    } else {
      this.countRequest++;
    }
  };

  loadMesMore = async flag => {
    let res;
    if (this.flagNotify == true) {
      res = await loadmes(
        this.dataNotify.additionalData.data.IdKhachHang,
        this.dataNotify.additionalData.data.IdTaiKhoan,
        flag
      );
    } else {
      res = await loadmes(
        this.item.IDKhachHang,
        this.item.IDTaiKhoan,
        flag
      );
    }

    if (res.status == 1) {
      //Có dữ liệu trả về
      if (flag == -1) {
        if (this.flag == false) {
          // Lần đầu load list
          this.listMes = res.data.GhiChuData ? res.data.GhiChuData : [];
          if (this.listMes.length == 0) {
            this.flag = true;
            return;
          }
          let max = this.listMes.length - 1;
          this.setState({ dataSource: this._formatDate(this.listMes), minRowID: this.listMes[max].RowID, maxRowID: this.listMes[0].RowID });
          this.flag = true;
        } else {
          // Những lần sau load list
          if (res.data.GhiChuData[0].RowID > this.state.maxRowID) {
            for (let i = res.data.GhiChuData.length - 1; i >= 0; i--) {
              if (res.data.GhiChuData[i].RowID > this.state.maxRowID) {
                this.listMes.unshift(res.data.GhiChuData[i]);
              }
            }
            this.setState({ dataSource: this._formatDate(this.listMes), maxRowID: res.data.GhiChuData[0].RowID }); // Có dữ liệu mơi ghép đầu list
          }
        }
      } else {
        //Load những thằng phía sau id của flag
        // this.listMes = [ ...this.listMes, res.data.GhiChuData ];
        if (res.data.GhiChuData) {
          this.listMes = this.listMes.concat(res.data.GhiChuData);
          let minn = res.data.GhiChuData.length - 1;
          let min = res.data.GhiChuData[minn].RowID;
          this.setState({ dataSource: this._formatDate(this.listMes), minRowID: min });
        }
      }
    }
    this.countRequest = 0;
  }
  sendmes = async () => {
    if (!this.state.msgtext.trim().length == 0) {
      let mess = this.state.msgtext.trim();
      this.setState({ msgtext: "" });
      if (this.flagNotify == true) {
        let data = this.dataNotify.additionalData.data;
        let res = await sendmes(this.IDGiaoVien, mess, data.IdKhachHang, data.GhiChu.IDChiNhanh, data.IdTaiKhoan);
        if (res.status == 1) {
          this.countRequest = 10;
        }
      } else {
        let res = await sendmes(this.IDGiaoVien, mess, this.item.IDKhachHang, this.item.IDChiNhanh, this.item.IDTaiKhoan);
        if (res.status == 1) {
          this.countRequest = 10;
        }
      }
    };
  };
  _renderItemChat = ({ item, index }) => {
    return (
      <View>
        {item.flag == true ? (
          <Text style={[styles.ntext, styles.ntextDay]}>
            {Moment(item.CreatedDate, 'MM/DD/YYYY h:m:s A').format("DD/MM/YYYY")}
          </Text>
        ) : null}
        {item.Isclient === false ? (
          <View style={styles.nmsgRep}>
            <View style={styles.nboxRep}>
              <Text style={[styles.ntext, styles.ntextmsgRep]}>
                {item.NoiDung}
              </Text>
              {item.CreatedDate !== "" ? (
                <Text
                  style={[
                    styles.ntext,
                    styles.ntextmsgRep,
                    styles.ntexttime
                  ]}
                >
                  {Moment(item.CreatedDate, 'MM/DD/YYYY h:m:s A').format("HH:mm")}
                </Text>
              ) : null}
            </View>
          </View>
        ) : (
            <View style={[styles.nmsgSend, nstyles.nrow]}>
              {/* <Image defaultSource={Images.imgProfile} source={{ uri: appConfig.domainImageChat + item.Avata }} resizeMode="contain" style={[styles.imgaeAvatar]} /> */}
              <Image defaultSource={Images.imgProfile} source={{ uri: appConfig.domainImageChat + item.Avata }} resizeMode='cover' style={[nstyles.nIcon38, { borderRadius: 19 }]} />
              <View style={{ width: 9 }} />
              <View style={[styles.nboxSend,]}>
                <Text style={[styles.ntext, styles.ntextmsgSend]}>
                  {item.NoiDung}
                </Text>
                <View >
                  {item.CreatedDate !== "" ? (
                    <Text
                      style={[
                        styles.ntext,
                        styles.ntextmsgSend,
                        styles.ntexttime
                      ]}
                    >
                      {Moment(item.CreatedDate, 'MM/DD/YYYY h:m:s A').format("HH:mm")}
                    </Text>
                  ) : null}
                </View>
              </View>
              <View style={styles.nspace} />
            </View>
          )}
      </View>
    );
  }

  render() {
    Moment.locale("en");
    return (
      <KeyboardAvoidingView style={styles.ncontain} behavior={Platform.OS === "ios" ? "padding" : null} >
        <View style={{ flex: 1, flexDirection: "column", paddingBottom: paddingBotX }}>
          <HeaderCom
            nthis={this}
            titleText={this.state.nameShow}
            onPressLeft={() => {
              this._reloadListChat(true)
              Utils.goback(this)
            }}
            customStyleIconRight={colors.brownGreyThree}
          />
          <View style={styles.nbody} onLayout={this.setScroll}>
            <FlatList
              showsVerticalScrollIndicator={false}
              style={[styles.ncontenchat]}
              ref={listView => { this.listView = listView; }}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
              data={this.state.dataSource}
              onEndReached={() => { if (this.state.minRowID !== false) { this.loadMesMore(this.state.minRowID); } }}
              onEndReachedThreshold={0.25}
              ListEmptyComponent={
                <ListEmpty textempty="Bạn chưa có tin nhắn nào với người này." />
              }
              inverted
              renderItem={this._renderItemChat}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>

          <View style={[nstyles.ncol]}>
            <View
              style={{
                height: this.state.sizeInput - 30,
                borderColor: "#C0C0C0",
                borderWidth: 0.5
              }}
            >
              <View style={styles.nboxinput}>
                <TextInput
                  style={[
                    styles.ntextinput,
                    { flex: 1, textAlignVertical: "top" }
                  ]}
                  onChangeText={text => {
                    this.state.msgtext = text;
                    if (text.length < 5) {
                      this.setState({});
                    }
                  }}
                  placeholder="Tin nhắn..."
                  autoCorrect={false}
                  multiline={true}
                  onContentSizeChange={event => {
                    if (
                      50 + event.nativeEvent.contentSize.height <
                      nheight * 0.3
                    )
                      if (
                        this.state.sizeInput !=
                        50 + event.nativeEvent.contentSize.height
                      ) {
                        this.setState({
                          sizeInput: 50 + event.nativeEvent.contentSize.height
                        });
                      }
                  }}
                  underlineColorAndroid="rgba(0,0,0,0)"
                >
                  {this.state.msgtext}
                </TextInput>

                <TouchableOpacity onPress={() => this.sendmes()} disabled={this.state.issending}>
                  <Image
                    style={[styles.nicon2, { marginRight: 15 }]}
                    source={require("../../images/imgApp/icSendBig.png")}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  ncontain: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF"
  },
  nbody: {
    flex: 1,
    marginLeft: 6,
    marginRight: 6
  },
  ntext: {
    color: "#193B59",
    fontSize: 16
  },
  nicon2: {
    resizeMode: "contain",
    height: 30,
    width: 30,
    marginLeft: 10
  },
  ncontenchat: {
    flex: 1
  },
  nmsgRep: {
    maxWidth: "88%",
    alignSelf: "flex-end",
    alignItems: "flex-end",
    padding: 3
  },
  nmsgSend: {
    maxWidth: "88%",
    alignSelf: "flex-start",
    alignItems: "flex-start",
    padding: 3
  },
  nboxRep: {
    padding: 8,
    maxWidth: "88%",
    backgroundColor: "#4080FF",
    borderRadius: 10,
    shadowColor: "#000000",
    shadowOpacity: 0.4,
    shadowRadius: 2,
    shadowOffset: {
      height: 2,
      width: 0
    }
  },
  nboxSend: {
    marginVertical: 8,
    padding: 8,
    backgroundColor: "#F1F0F0",
    maxWidth: "88%",
    borderRadius: 10,
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: {
      height: 2,
      width: 0
    }
  },
  ntextmsgRep: {
    color: "#FCFDFF",
    fontWeight: "600"
  },
  ntextmsgSend: {
    flex: 1
  },
  ntexttime: {
    fontSize: 11,
    fontWeight: "400",
    marginTop: 5,
    marginLeft: 5
  },
  nspace: {
    padding: 5
  },
  nboxinput: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  ntextinput: {
    color: "black",
    fontSize: 17,
    paddingVertical: 4,
    paddingHorizontal: 10
  },
  ntextDay: {
    alignSelf: "center",
    fontSize: 13,
    fontWeight: "bold",
    color: "#C0C0C0",
    margin: 8
  },
});

export default Chat;
