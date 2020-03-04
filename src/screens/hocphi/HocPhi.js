import React, { Component, Fragment } from "react";
import { View, TextInput, Text, Image, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions } from "react-native";
import Utils from "../../app/Utils";
import { colors, sizes, nstyles } from "../../styles";
import HeaderCom from "../../components/HeaderCom";
import { Images } from "../../images/index";
import DatePicMonthYear from '../../components/DatePickerMonthYear';
import { Picker } from "native-base";
import { ListTruong, ListLop, HocSinhList, DiemDanh_Update } from "../../apis/thanhtoan";
import { KhoanThu_List } from '../../apis/TheoDoiTinhHinhHocPhi';
import ButtonCom from "../../components/Button/ButtonCom";
import { ROOTGlobal } from "../../app/data/dataGlobal";
import { thisExpression } from "@babel/types";
import styles from "../BaoBai/styles";
const { width } = Dimensions.get('window');

// import { SceneView } from "react-navigation";


export default class HocPhi extends Component {
  constructor(props) {
    super(props);
    nthis = this;
    this.khoangcach = 18;
    this.state = {
      date: "",
      tabNP: 0,
      namestudent: '',
      data: [],
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      valuListTruong: ROOTGlobal.IdCN,
      valuListLop: '',
      listTruong: [],
      listLop: [],
      tenHocSinh: '',
      tongSoHocSinh: 0,
      tongSoHocSinhConNo: 0,
      tongTien: 0,
      tienDaDong: 0,
      tienNo: 0,
      flagShowData: false,
      onLoad: false,
      onLoadList: false,
      itemClick: [],
      dataRaw: [],
      isFlagFilter: 1
    };
    this.nameClassSelected = ''

  }

  componentDidMount() {
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    this.setState({ date: "T" + month + "/" + year });
    this.DSLop();
  }

  DSLop = async () => {
    var { valuListTruong } = this.state
    let res = await ListLop(valuListTruong)
    if (res.status == 1) {
      listLop = res.data
      this.setState({ listLop }, () => {
        if (listLop.length != 0) {
          this.nameClassSelected = listLop[0].TenNhomKH;
          let tempId = listLop[0].IDNhomKH;
          this._selectLop(tempId);
        };
      });
    }
  }
  _selectLop = async (va) => {
    this.setState({ data: [], dataRaw: [], tongSoHocSinh: 0, tongSoHocSinhConNo: 0, tongTien: 0, tienDaDong: 0, tienNo: 0, flagShowData: false });
    for (let i = 0; i < this.state.listLop.length; i++) {
      if (this.state.listLop[i].IDNhomKH == va) {
        this.nameClassSelected = this.state.listLop[i].TenNhomKH;
        break;
      }
    }
    this.setState({ valuListLop: va, onLoad: true, isFlagFilter: 1, itemClick: [] })
    var { valuListTruong, tongTien, tienDaDong, tienNo } = this.state
    let res = await KhoanThu_List(0, valuListTruong, va.toString(), this.state.namestudent)
    Utils.nlog('-----------------   KhoanThu_List ', res)
    if (res.status == 1) {
      tongTien = 0;
      tienDaDong = 0;
      tienNo = 0;
      res.Alldata.length == 0 ? this.setState({ flagShowData: false }) : this.setState({ flagShowData: true })
      let tongSoHocSinhConNo = 0;
      for (let i = 0; i < res.Alldata.length; i++) {
        if (res.Alldata[i].ConNo > 0) {
          tongSoHocSinhConNo++;
        };
        tongTien += res.Alldata[i].ConNo + res.Alldata[i].TienDaThanhToan;
        tienDaDong += res.Alldata[i].TienDaThanhToan;
        tienNo += res.Alldata[i].ConNo;
      };
      Utils.nlog('-----------------   data ', res.Alldata)
      this.setState({ data: res.Alldata, dataRaw: res.Alldata, tongSoHocSinh: res.Alldata.length, tongSoHocSinhConNo: tongSoHocSinhConNo, tongTien: tongTien, tienDaDong: tienDaDong, tienNo: tienNo, onLoad: false });
    } else {
      this.setState({ onLoad: false, flagShowData: false })
    }
  }

  _onLongPressHocSinh = (item) => () => {
    if (item.ConNo == 0) {
      Utils.showMsgBoxOK(this, 'Thông báo', 'Học sinh không còn nợ học phí');
    } else {
      Utils.goscreen(this, 'sc_ChiTietHocPhi', { hocSinh: item })
    }
  }
  _clickItem = (id) => () => {
    Utils.nlog('--------------- click', this.state.data[id])
    if (this.state.data[id].ConNo == 0) {
      Utils.showMsgBoxOK(this, 'Thông báo', 'Học sinh đã thanh toán hết học phí, không thể gửi thông báo', 'Đóng');
      return;
    }
    const itemClick = this.state.itemClick.slice();
    if (itemClick.includes(id)) {
      const index = itemClick.indexOf(id);
      itemClick.splice(index, 1)
    } else {
      itemClick.push(id)
    };
    this.setState({ itemClick }, console.log('list', this.state.itemClick));
  }

  _clickAll = () => {
    Utils.nlog('----------------   ', this.state.data.length)
    const itemClick = this.state.itemClick.slice();
    for (let index = 0; index < this.state.data.length; index++) {
      if (!itemClick.includes(index)) {
        itemClick.push(index);
      };
    };
    this.setState({ itemClick });
    // const itemClick = this.state.itemClick.slice();
    // if (itemClick.includes(id)) {
    //   const index = itemClick.indexOf(id);
    //   itemClick.splice(index, 1)
    // } else {
    //   itemClick.push(id)
    // };
    // this.setState({ itemClick }, console.log('list', this.state.itemClick));
    //   for (let index = 0; index < length; index++) {
    //     if (!itemClick.includes(index)) {
    //         itemClick.push(index);
    //     };
    // };
  }
  _renderItem = ({ item, index }) => {
    const { nrow, nIcon20 } = nstyles.nstyles;
    return (
      <View key={index} style={[nrow, { alignItems: 'center', paddingVertical: 10, marginRight: 30 }]}>
        <TouchableOpacity
          style={[nrow, { alignItems: 'center', paddingVertical: this.khoangcach, paddingHorizontal: this.khoangcach }]}
          onLongPress={this._onLongPressHocSinh(item)}
          onPress={this._clickItem(index)}
        >
          <View style={[nstyles.nstyles.nmiddle, { width: sizes.reSize(48), height: sizes.reSize(48), borderRadius: sizes.reSize(24), borderWidth: 1, borderColor: colors.veryLightPinkThree }]}>
            <Image style={{ width: sizes.reSize(47), height: sizes.reSize(47) }} source={item % 2 == 0 ? Images.icBe1 : Images.icBe2} resizeMode='contain' />
          </View>
          <View style={{ marginLeft: 15, flex: 1 }}>
            <View style={[nrow, { alignItems: 'center', justifyContent: 'space-between' }]}>
              <Text style={[stHocphi.stext]}>{item.TenHocSinh}</Text>
            </View>
            <View style={[nrow, { alignItems: 'center', justifyContent: 'space-between' }]}>
              <Text style={[stHocphi.stext, { color: colors.colorGrayText, marginVertical: 3 }]}>{item.MaHocSinh}</Text>
            </View>
            <View style={[nrow, { alignItems: 'center', justifyContent: 'space-between' }]}>
              <Text style={stHocphi.stext}>Còn lại: {Utils.formatMoney(item.ConNo)} đ</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={[nstyles.nstyles.nIcon12, nstyles.nstyles.nmiddle, {
          borderColor: 'green', borderWidth: 0.5, marginRight: 20,
          borderRadius: 2, backgroundColor: this.state.itemClick.includes(index) ? 'green' : 'white'
        }]}>
          <TouchableOpacity onPress={this._clickItem(index)}>
            <Image source={Images.icCheckBlue} style={{ width: sizes.reSize(15), height: sizes.reSize(15), tintColor: colors.white }}
              resizeMode='contain' />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  renderSeparator = () => {
    return (
      <View style={[nstyles.nstyles.nrow, { height: 1, width: '100%' }]}>
        <View style={{ width: '22%', backgroundColor: colors.white }} />
        <View style={{ width: '78%', backgroundColor: colors.veryLightPinkSeven }} />
      </View>
    );
  };

  tiepTuc = () => {
    if (this.state.itemClick.length == 0) {
      Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn phải chọn ít nhất một học sinh để tiếp tục')
    } else {
      let listMa = [];
      for (let i = 0; i < this.state.data.length; i++) {
        for (let j = 0; j < this.state.itemClick.length; j++) {
          if (i == this.state.itemClick[j]) {
            listMa.push(this.state.data[i].IDKhachHang);
            break;
          };
        };
      };

      Utils.goscreen(this, 'sc_ThemGhiChu', { type: 3, listChild: listMa, lop: this.nameClassSelected, valuListLop: this.state.valuListLop });



      // Utils.goscreen(this, 'sc_ThongBaoHocPhi', { 'ListHocSinh': listMa, 'IDChiNhanh': this.state.valuListTruong, type: 3, lop: this.nameClassSelected });
    };
  }

  loadMore = async () => {
    if (this.state.dataRaw.length == 0)
      return;
    this.setState({ onLoadList: true });
    var { valuListTruong, valuListLop, tenHocSinh, pageNow, pageAll, dataRaw, tongTien, tienDaDong, tienNo, isFlagFilter } = this.state
    if (pageNow < pageAll - 1) {
      tongTien = 0;
      tienDaDong = 0;
      tienNo = 0;
      let res = await KhoanThu_List(pageNow + 1, valuListTruong, valuListLop, tenHocSinh)
      if (res.status == 1) {
        this.setState({ flagShowData: res.data.length == 0 ? false : true });
        let dataOld = dataRaw;
        dataOld = dataOld.concat(res.data)
        let tongSoHocSinhConNo = 0;
        for (let i = 0; i < dataOld.length; i++) {
          if (dataOld[i].ConNo > 0) {
            tongSoHocSinhConNo++;
          }
          tongTien += dataOld[i].ConNo + dataOld[i].TienDaThanhToan;
          tienDaDong += dataOld[i].TienDaThanhToan;
          tienNo += dataOld[i].ConNo;
        }
        if (isFlagFilter == 1) {
          this.setState({ dataRaw: dataOld, data: dataOld, pageAll: res.page.AllPage, pageNow: pageNow + 1, tongSoHocSinhConNo: tongSoHocSinhConNo, tongSoHocSinh: dataOld.length, tongTien: tongTien, tienDaDong: tienDaDong, tienNo: tienNo, onLoadList: false, flagShowData: true });
          return;
        } else if (isFlagFilter == 2) {
          let dataShow = [];
          for (let i = 0; i < dataOld.length; i++) {
            if (dataOld[i].ConNo == 0) {
              dataShow.push(dataOld[i]);
            }
          }
          this.setState({ dataRaw: dataOld, data: dataShow, pageAll: res.page.AllPage, pageNow: pageNow + 1, tongSoHocSinhConNo: tongSoHocSinhConNo, tongSoHocSinh: dataOld.length, tongTien: tongTien, tienDaDong: tienDaDong, tienNo: tienNo, onLoadList: false, flagShowData: true });
          return;
        } else {
          let dataShow = [];
          for (let i = 0; i < dataOld.length; i++) {
            if (dataOld[i].ConNo > 0) {
              dataShow.push(dataOld[i]);
            }
          }
          this.setState({ dataRaw: dataOld, data: dataShow, pageAll: res.page.AllPage, pageNow: pageNow + 1, tongSoHocSinhConNo: tongSoHocSinhConNo, tongSoHocSinh: dataOld.length, tongTien: tongTien, tienDaDong: tienDaDong, tienNo: tienNo, onLoadList: false, flagShowData: true });
          return;
        }
      }
    }
    else {
      this.setState({ onLoadList: false });
    }
  }
  searchName = async (text) => {
    if (this.state.valuListTruong == '') {
      Utils.showMsgBoxOK(this, ' Thông báo', 'Bạn phải chọn lớp học');
    } else {
      this.setState({ namestudent: text, onLoad: true, itemClick: [] })
      tongTien = 0;
      tienDaDong = 0;
      tienNo = 0;
      var { valuListTruong, valuListLop, namestudent, data, tongTien, tienDaDong, tienNo } = this.state
      let res = await KhoanThu_List(0, valuListTruong, valuListLop, text)
      if (res.status == 1) {
        if (res.Alldata.length == 0) {
          this.setState({ data: [], tongSoHocSinhConNo: 0, tongSoHocSinh: 0, tongTien: 0, tienDaDong: 0, tienNo: 0, flagShowData: false, onLoad: false });
          return;
        } else {
          let tongSoHocSinhConNo = 0;
          for (let i = 0; i < res.Alldata.length; i++) {
            if (res.Alldata[i].ConNo > 0) {
              tongSoHocSinhConNo++;
            }
            tongTien += res.Alldata[i].ConNo + res.Alldata[i].TienDaThanhToan;
            tienDaDong += res.Alldata[i].TienDaThanhToan;
            tienNo += res.Alldata[i].ConNo;
          }
          this.setState({ data: res.Alldata, dataRaw: res.Alldata, tongSoHocSinhConNo: tongSoHocSinhConNo, tongSoHocSinh: res.data.length, tongTien: tongTien, tienDaDong: tienDaDong, tienNo: tienNo, flagShowData: true, onLoad: false });
        }
      }
    }
  }
  _changeFlitter = async (number) => {
    this.setState({ onLoad: true, isFlagFilter: number, flagShowData: false, itemClick: [] })
    var { dataRaw } = this.state
    if (dataRaw.length > 0) {
      let dataShow = [];
      let dataRaw1 = [];
      if (number == 1) {
        dataRaw1 = dataRaw;
        dataShow = dataRaw
      }
      else if (number == 2) {
        for (let i = 0; i < dataRaw.length; i++) {
          if (dataRaw[i].ConNo == 0) {
            dataShow.push(dataRaw[i]);
          }
        }
      }
      else {
        for (let i = 0; i < dataRaw.length; i++) {
          if (dataRaw[i].ConNo > 0) {
            dataShow.push(dataRaw[i]);
          }
        }
      }
      this.setState({ data: dataShow, onLoad: false, flagShowData: true });
      return;
    };
    this.setState({ onLoad: false, flagShowData: true })
  }
  _keyExtractor = (item, index) => `${index}`
  render() {


    const { nrow, nIcon22 } = nstyles.nstyles;
    return (
      <View style={[nstyles.nstyles.ncontainerX, { backgroundColor: colors.whitegay }]}>
        <HeaderCom
          nthis={this}
          iconLeft={Images.icBackBlue}
          titleText={"Theo dõi học phí"}
          titleStyle={{ color: colors.white, fontSize: sizes.reText(18) }} />
        <View style={[nstyles.nstyles.nbody, { paddingHorizontal: 15 }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ width: width, alignItems: 'center', backgroundColor: 'white' }}>
              <Image resizeMode="contain" source={Images.logoSSC} style={{ width: width * 0.25, height: width * 0.15 }}></Image>
            </View>
            <View style={{ backgroundColor: colors.white, borderRadius: 6, paddingHorizontal: this.khoangcach, paddingVertical: nstyles.khoangcach }}>
              <View style={nrow}>
                <View style={[nrow, stHocphi.container]}>
                  <DatePicMonthYear style={{ flex: 1 }}
                    month={this.state.month}
                    year={this.state.year}>
                  </DatePicMonthYear>
                  <View>
                    <Image source={Images.icCalendar} resizeMode='contain' style={[nstyles.nIcon20, { tintColor: '#A3A3A3' }]} />
                  </View>
                </View>
                <View style={{ backgroundColor: colors.white, width: 10 }} />
                <View style={[nrow, stHocphi.container]}>
                  <View style={{ flex: 1 }}>
                    {Platform.OS == 'ios' ?
                      <View style={{ position: 'absolute', right: 5, top: 0, bottom: 0, justifyContent: 'center' }}>
                        <Image source={Images.icDown} resizeMode='contain' style={[nstyles.nIcon20, { tintColor: '#A3A3A3' }]} />
                      </View>
                      : null
                    }
                    <Picker
                      style={{ flex: 1 }}
                      mode="dropdown"
                      placeholder={'Chọn lớp'}
                      style={{ width: '100%', height: 28 }}
                      textStyle={{ fontWeight: '600', fontSize: 12 }}
                      selectedValue={this.state.valuListLop}
                      onValueChange={(val) => {
                        this.setState({ pageNow: 0 }, () => this._selectLop(val));
                      }}>
                      {this.state.listLop.map((item, index) =>
                        <Picker.Item key={index} label={item.TenNhomKH} value={item.IDNhomKH} />
                      )}
                    </Picker>
                  </View>
                </View>
              </View>
              {/* <View>
                <View style={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: colors.whitegay,
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  borderRadius: 6,
                  marginTop: 13, flexDirection: 'row'
                }}>
                  <TouchableOpacity>
                    <Image source={Images.icSearchGrey} resizeMode='contain' style={nIcon22} />
                  </TouchableOpacity>
                  <View style={{ width: 1, height: '100%', backgroundColor: colors.black_80, marginHorizontal: 8 }} />
                  <View style={{ flex: 1 }}>
                    <TextInput
                      style={{ paddingVertical: 0 }}
                      underlineColorAndroid='transparent'
                      value={this.state.namestudent}
                      returnKeyType={"next"} autoCorrect={false}
                      placeholderTextColor={colors.dark_30}
                      placeholder={'Nhập tên học sinh'}
                      onChangeText={(text) => this.searchName(text)} />
                  </View>
                </View>
              </View> */}

              {this.state.flagShowData == true ?
                <View>
                  <View style={{ backgroundColor: colors.veryLightPinkSeven, height: 1, marginTop: 14 }} />
                  <Text style={{ marginVertical: 10, color: '#A5A7AA', fontSize: sizes.reText(15), fontStyle: 'italic' }}>
                    Học sinh còn nợ học phí: {this.state.tongSoHocSinhConNo}/{this.state.tongSoHocSinh}
                  </Text>
                  <View style={[nrow]}>
                    <View style={{ flex: 1 }}>
                      <Text style={stHocphi.stext}>{Utils.formatMoney(this.state.tongTien)} đ</Text>
                    </View>
                    <View style={{ paddingHorizontal: 15, borderRightWidth: 1, borderLeftWidth: 1, borderRightColor: colors.veryLightPinkThree, borderLeftColor: colors.veryLightPinkThree }}>
                      <Text style={[stHocphi.stext, { color: colors.greenBlue }]}>{Utils.formatMoney(this.state.tienDaDong)} đ</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                      <Text style={[stHocphi.stext, { color: 'red' }]}>{Utils.formatMoney(this.state.tienNo)} đ</Text>
                    </View>
                  </View>
                </View> : null
              }
            </View>
            {this.state.onLoad == true ? <ActivityIndicator style={{ marginTop: 30 }} /> :
              this.state.flagShowData == false ? this.state.onLoad == false ? <Text style={{ textAlign: 'center', marginTop: 30, color: '#A3A3A3' }}>Không có học sinh để hiển thị</Text> : null :
                null
            }
            {
              this.state.flagShowData == false ? null :
                <View style={{ backgroundColor: this.state.flagShowData == false ? colors.whitegay : colors.white, borderRadius: 6, marginTop: 15, flex: 1, height: '100%' }}>
                  {this.state.isFlagFilter == 3 ?
                    <TouchableOpacity onPress={this._clickAll} style={{ paddingVertical: 10 }}>
                      <Text style={[stHocphi.text13, { alignSelf: 'flex-end', marginRight: this.khoangcach }]}>Chọn tất cả</Text>
                    </TouchableOpacity> : null}
                  <FlatList
                    data={this.state.data}
                    renderItem={this._renderItem}
                    keyExtractor={this._keyExtractor}
                    ItemSeparatorComponent={this.renderSeparator}
                    extraData={this.state}
                    ListFooterComponent={
                      this.state.onLoadList == true ?
                        <ActivityIndicator /> : null
                    }
                  />
                </View>
            }
          </ScrollView>
          {
            this.state.flagShowData == false ? null : <View style={[nrow, { justifyContent: 'center', paddingVertical: 15 }]}>
              <TouchableOpacity onPress={() => this._changeFlitter(1)} style={[nrow, stHocphi.shadown, { backgroundColor: this.state.isFlagFilter == 1 ? '#84D3A5' : colors.backgroundHistory, borderRadius: 6, padding: 10 }]}>
                <Text style={[stHocphi.stext, { fontSize: sizes.fs(15), fontWeight: '800' }]}>Tất cả</Text>
              </TouchableOpacity>
              <View style={{ width: 20 }} />
              <TouchableOpacity onPress={() => this._changeFlitter(2)} style={[nrow, stHocphi.shadown, { backgroundColor: this.state.isFlagFilter == 2 ? '#84D3A5' : colors.backgroundHistory, borderRadius: 6, padding: 10, alignItems: 'center' }]}>
                <View style={[nstyles.nstyles.nIcon8, { borderRadius: sizes.reSize(4), backgroundColor: 'green' }]} />
                <Text style={[stHocphi.stext, { color: 'green', marginLeft: 10 }]}>Đã đóng</Text>
              </TouchableOpacity>
              <View style={{ width: 20 }} />
              <TouchableOpacity onPress={() => this._changeFlitter(3)} style={[nrow, stHocphi.shadown, { backgroundColor: this.state.isFlagFilter == 3 ? '#84D3A5' : colors.backgroundHistory, borderRadius: 6, padding: 10, alignItems: 'center' }]}>
                <View style={[nstyles.nstyles.nIcon8, { borderRadius: sizes.reSize(4), backgroundColor: 'red' }]} />
                <Text style={[stHocphi.stext, { color: 'red', marginLeft: 10 }]}>Còn nợ</Text>
              </TouchableOpacity>
            </View>
          }
          {this.state.flagShowData == false ? null : <View>
            <ButtonCom
              onPress={this.tiepTuc}
              Linear={true}
              colorChange={[colors.lightSalmon, colors.salmonTwo]}
              style={{ marginTop: 5, marginBottom: 5 }}
              text={"Gửi thông báo"}
            />
          </View>}
        </View>
      </View >
    );
  }
}

const stHocphi = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.whitegay,
    paddingHorizontal: 10, paddingVertical: 8,
    borderRadius: 6,
    flex: 1
  },

  stext: {
    fontSize: sizes.fs(15),
    fontWeight: '500'
  },
  shadown: {
    padding: 10,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.16)',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
        shadowColor: 'rgba(0,0,0,0.16)',
        // shadowOffset: { width: 3, height: 0 },
        shadowOpacity: 0.1,
        // shadowRadius: 30,
      },
    }),
  },
  text13: {
    fontSize: sizes.fs(15)
  },
})