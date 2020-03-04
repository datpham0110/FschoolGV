import React, { Component } from "react";
import { Text, View, Dimensions, Image, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import Input from "../../components/componentsYSchool/Input";
import ButtonCom from "../../components/Button/ButtonCom";
// import { styles } from "./styles";
import { Images } from "../../images/index";

import Utils from "../../app/Utils";
import { chiTietHocPhi } from "../../apis/notifycation";
import { nheight, nColors } from "../../styles/styles";
import { colors, sizes, nstyles } from "../../styles";
import { Phi_Detail_v0 } from '../../apis/TheoDoiTinhHinhHocPhi';
import { FlatList } from "react-native-gesture-handler";
import { ROOTGlobal } from "../../app/data/dataGlobal";
const { width, height } = Dimensions.get("window");
export default class ChiTietHocPhi extends Component {
  constructor(props) {
    super(props);
    this.hocSinh = Utils.ngetParam(this, "hocSinh", () => { });
    this.state = {
      data: [],
      TongTien: 0,
      TongTru: 0,
      valuListTruong: ROOTGlobal.IdCN,
    };
  }
  onCancel = () => {
    Utils.goback(this);
  };

  componentDidMount() {
    this._getData();
  }

  _getData = async () => {
    let res = await Phi_Detail_v0(this.hocSinh.MaHocSinh, true, this.state.valuListTruong);
    Utils.nlog('-------------- Phi_Detail_v0', res)
    if (res.status == 1) {
      this.setState({ data: res.data.Bills });
      let tong = 0;
      for (let i = 0; i < res.data.Bills.length; i++) {
        tong += res.data.Bills[i].Amount;
      }
      this.setState({ TongTien: tong });
    } else {
      Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi khi lấy chi tiết học phí')
    }
  };
  _renderItem = ({ item, index }) => {
    Utils.nlog('--------------  _renderItem', item)
    return (
      <View style={[styles.nitemrow, { margin: 0 }]}>
        <Text style={[styles.lbl1, styles.ntext, { width: '14%', textAlign: 'center', fontWeight: 'bold' }]}>{index + 1}</Text>
        <Text style={[styles.lbl1, styles.ntext, { width: '56%', textAlign: 'center', fontWeight: 'bold' }]}>{item.Month}</Text>
        <Text style={[styles.lbl1, styles.ntext, { width: '30%', textAlign: 'center', fontWeight: 'bold' }]}>{Utils.formatMoney(item.Amount)}</Text>
      </View>
    );
  };

  render() {
    const { nrow, ncol, nIcon20 } = nstyles.nstyles;
    return (
      <View style={{ backgroundColor: colors.black_16, flex: 1, alignItems: "center", justifyContent: "center" }}   >
        <View style={[styles.nmodal]}>
          <View style={styles.ncontentcenter}>
            <ScrollView showsVerticalScrollIndicator={false} style={[styles.ncontentmodal, { maxHeight: Platform.OS == 'ios' ? height - 132 : height - 126 }]}>
              <View>
                <View style={[styles.nitemrow, { margin: 5, marginLeft: 8, marginTop: -10, alignItems: 'center' }]}>
                  <Image style={{ width: sizes.reSize(60), height: sizes.reSize(60) }} source={Images.icBe1} resizeMode='contain' />
                  <View style={[styles.nitemcolumn, { marginLeft: 5, flex: 1 }]}>
                    <Text style={[styles.ntext, { fontSize: 15 }]}>Tên:          {this.hocSinh.TenHocSinh}</Text>
                    {/* <Text style={[styles.ntext, { fontSize: 15, marginBottom: 2, marginTop: 2 }]}>Ngày sinh: {this.hocSinh.NgaySinh}</Text> */}
                    <Text style={[styles.ntext, { fontSize: 15 }]}>{this.hocSinh.TenNhomKH}</Text>
                  </View>
                </View>
                <Text style={[styles.ntext, styles.ntitlemodel]}>Chi tiết học phí</Text>

                <View style={[styles.nitemrow, { margin: 0 }]}>
                  <Text style={[styles.ntext, styles.lbl3, { width: '14%', textAlign: 'center', fontWeight: 'bold' }]}>STT</Text>
                  <Text style={[styles.ntext, styles.lbl3, { width: '56%', textAlign: 'center', fontWeight: 'bold' }]}>Khoản thu</Text>
                  <Text style={[styles.ntext, styles.lbl3, { width: '30%', textAlign: 'center', fontWeight: 'bold' }]}>Số tiền</Text>
                </View>
                <View style={[styles.nitemrow, { margin: 0 }]}>
                  <FlatList
                    data={this.state.data}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.state.data}
                  />
                </View>
                <View style={[styles.nitemrow, { margin: 0 }]}>
                  <Text style={[styles.ntext, styles.lbl2, { width: '70%', textAlign: 'right' }]}>Tổng tiền:</Text>
                  <Text style={[styles.ntext, styles.lbl2, { width: '30%' }]}>{Utils.formatMoney(this.state.TongTien)}</Text>
                </View>
                {/* <View style={[styles.nitemrow, { margin: 0 }]}>
                  <Text style={[styles.ntext, styles.lbl2, { width: '70%', textAlign: 'right' }]}>Giảm trừ:</Text>
                  <Text style={[styles.ntext, styles.lbl2, { width: '30%' }]}>{this.state.TongTru}</Text>
                </View>
                <View style={[styles.nitemrow, { margin: 0 }]}>
                  <Text style={[styles.ntext, styles.lbl2, { width: '70%', textAlign: 'right' }]}>Tổng tiền học:</Text>
                  <Text style={[styles.ntext, styles.lbl2, { width: '30%', fontWeight: 'bold' }]}>{this.state.TongTien - this.state.TongTru}</Text>
                </View>
                <View style={[styles.nitemrow, { margin: 0 }]}>
                  <Text style={[styles.ntext, styles.lbl2, { width: '70%', textAlign: 'right' }]}>Tiền đã đóng:</Text>
                  <Text style={[styles.ntext, styles.lbl2, {
                    width: '30%', fontWeight: 'bold',
                    color: (this.state.TongTien - this.state.TongTru - this.state.TongTra > 0) ? 'red' : '#31D5A6'
                  }]}>{this.state.TongTra}</Text>
                </View> */}
              </View>
            </ScrollView>
            <View style={[nrow, { height: nstyles.Height(8), justifyContent: 'center' }]}>
              <ButtonCom
                colorChange={[colors.lightSalmon, colors.salmonTwo]}
                onPress={this.onCancel}
                Linear={true}
                text={"Đóng"}
                style={{ paddingHorizontal: 50 }}
              />
            </View>
          </View>
        </View>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  ncontain: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#F6F6F6'
  },
  ntitle: {
    color: '#31D5A6',
    fontSize: 20
  },
  nheader: {
    height: 50,
    backgroundColor: '#FFFFFF',
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: {
      height: 2,
      width: 0
    },
    elevation: 3
  },
  nbody: {
    flex: 1,
    margin: 8
  },
  ntext: {
    color: '#193B57'
  },
  ntextbtn: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white'
  },
  ntextbtn2: {
    fontSize: 14,
    fontWeight: '400',
    color: 'white'
  },
  nicontop: {
    resizeMode: 'contain',
    height: 28,
    width: 28
  },
  nHcontent: {
    flex: 1,
    paddingTop: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  nHleft: {
    width: 50,
    alignItems: 'center',
    paddingRight: 2
  },
  nHmid: {
    flex: 1,
    alignItems: 'center'
  },
  nHright: {
    width: 50,
    alignItems: 'center',
    paddingLeft: 2
  },
  nbutton: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    flex: 1,
    marginLeft: 6,
    backgroundColor: '#30cfa1'
  },
  nbtnitem: {
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C3C3C3',
  },
  nbtnactive: {
    backgroundColor: '#30cfa1',
    padding: 5,
    textAlign: 'center'
  },
  nbtnnone: {
    backgroundColor: 'transparent',
    color: '#193B57',
    padding: 5,
    textAlign: 'center'
  },
  nempty: {
    alignSelf: 'center'
  },
  nitemcontent: {
    borderWidth: 1.5,
    borderColor: '#BDBEBE',
    borderRadius: 5,
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    },
    backgroundColor: 'white',
    padding: 4,
    flexDirection: 'column',
    marginBottom: 5,
  },
  nitemrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 3
  },
  nitemcolumn: {
    flexDirection: 'column',
  },
  npicker: {
    marginLeft: 4,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#E1E1E1',
    height: 30,
  },
  nicon: {
    resizeMode: 'contain',
    height: 20,
    width: 20,
    marginRight: 5,
    marginLeft: 8,
  },
  navatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderColor: '#D0D0CE',
    borderWidth: 1,
    resizeMode: 'cover',
  },
  navatar2: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: '#D0D0CE',
    borderWidth: 1,
    resizeMode: 'cover',
  },
  ntext1: {
    margin: 3
  },
  //--Modal - style
  nbuttonm: {
    borderRadius: 25,
    borderColor: '#30cfa1',
    borderWidth: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    padding: 10,
    marginBottom: 16
  },
  ntextbtnm: {
    fontSize: 18,
    fontWeight: '500'
  },
  nviewmodal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  nbgrmodal: {
    flex: 1,
    backgroundColor: 'black',
    opacity: 0.7
  },
  nmodal: {
    position: 'absolute',
    left: 10,
    right: 10,
    top: 0,
    bottom: 0,

    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  ncontentcenter: {
    borderRadius: 5,
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: {
      height: 2,
      width: 0
    },
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%'
  },
  ncontentmodal: {
    margin: 8,
    marginTop: 16,
    marginBottom: 16,
    paddingBottom: 10
  },
  ntitlemodel: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold'
  },
  //--Modal - end
  lbl1: {
    // backgroundColor: '#31D5A6',
    borderWidth: 1,
    borderColor: '#D8D8D8',
    padding: 5,
    width: '35%',
    color: 'white',
    fontSize: 16
  },
  lbl3: {
    backgroundColor: '#31D5A6',
    borderWidth: 1,
    borderColor: '#D8D8D8',
    padding: 5,
    width: '35%',
    color: 'white',
    fontSize: 16
  },
  lbl2: {
    borderWidth: 1,
    borderColor: '#D8D8D8',
    padding: 5,
    width: '65%',
    textAlign: 'right',
    fontSize: 16
  },
});