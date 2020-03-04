import React, { Component } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Dimensions } from "react-native";
import { colors, sizes } from "../../styles";
import Utils from "../../app/Utils";
import { nGlobalKeys } from "../../app/keys/globalKey";
import { notification } from "../../apis/notifycation";
const { width, height } = Dimensions.get("window");

class NotifyHocPhi extends Component {
  list = [];
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      tongtien: "",
      tenHocSinh: "",
      msHocSInh: ""
    };
  }
  componentDidMount() {
    this.loadData();
  }
  loadData = async () => {
    if (this.props.listchild.length > 0) {
      let da = Utils.getGlobal(nGlobalKeys.IdHocSinh, null);
      let request;
      if (da == null) {
        request = await notification(this.props.listchild[0].MaKhachHang);
      } else {
        request = await notification(da);
      }
      if (request.success == true) {
        let tien = 0;
        for (let i = 0; i < request.data.Bills.length; i++) {
          tien += request.data.Bills[i].Amount;
        }
        this.list = request.data.Bills;
        this.setState({
          tongtien: tien,
          tenHocSinh: request.data.StudentName,
          data: this.list,
          msHocSInh: request.data.SSCId
        });
      }
    }
  };
  _renderItemChild = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          Utils.goscreen(nthis, "sc_ChiTietHocPhi", {
            data: item.Month,
            ID: this.state.msHocSInh
          })
        }
        style={{ backgroundColor: colors.white, padding: 15 }}>
        <Text style={{ borderBottomColor: colors.black_11, marginBottom: 3, fontSize: sizes.sizes.sText15, marginHorizontal: 5 }}>
          {item.Month}
        </Text>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <Text style={{ fontSize: sizes.sizes.sText18, flex: 1 }}>
            Tiền nộp trong tháng:
          </Text>
          <Text
            style={{
              fontSize: sizes.sizes.sText18,
              alignItems: "flex-end"
            }}>{Utils.formatMoney(item.Amount) + "đ"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <View style={{ backgroundColor: colors.BackgroundHome, flex: 1 }}>
        {this.state.tenHocSinh == "" ? (
          <Text style={{ textAlign: "center" }}>
            Tài khoản chưa liên kết với học sinh để hiển thị
          </Text>
        ) : (
            <View style={{ backgroundColor: colors.BackgroundHome, flex: 1 }}>
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 20,
                  fontSize: sizes.fs(14)
                }}
              >
                Chi tiết học phí của
            </Text>
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 5,
                  fontSize: sizes.sizes.sText18,
                  fontWeight: "bold"
                }}
              >
                {this.state.tenHocSinh}
              </Text>
              <View
                style={{
                  backgroundColor: colors.white,
                  marginVertical: 15,
                  marginHorizontal: 25,
                  paddingHorizontal: 15,
                  borderRadius: 4
                }}
              >
                <View style={{ flexDirection: "row", marginVertical: 10 }}>
                  <Text style={{ fontSize: sizes.sizes.sText18, color: colors.orange, flex: 1 }}> Tổng tiền phải nộp</Text>
                  <Text style={{ fontSize: sizes.sizes.sText18, color: colors.orange }}>{Utils.formatMoney(this.state.tongtien)} đ</Text>
                </View>
                <View
                  style={{
                    height: 1,
                    backgroundColor: colors.brownishGreyTwo,
                    opacity: 0.3
                  }}
                />
                <View style={{ flexDirection: "row", marginVertical: 10 }}>
                  <Text
                    style={{
                      fontSize: sizes.sizes.sText14,
                      flex: 1
                    }}
                  >
                    Đã thanh toán
                </Text>
                  <Text style={{ fontSize: sizes.sizes.sText18 }}>0 đ</Text>
                </View>
                <View
                  style={{
                    height: 1,
                    backgroundColor: colors.brownishGreyTwo,
                    opacity: 0.3
                  }}
                />
                <View style={{ flexDirection: "row", marginVertical: 10 }}>
                  <Text
                    style={{
                      fontSize: sizes.sizes.sText14,
                      flex: 1,
                      fontWeight: "bold"
                    }}
                  >
                    Còn lại
                </Text>
                  <Text
                    style={{
                      fontSize: sizes.sizes.sText18,
                      color: colors.orange
                    }}
                  >
                    {Utils.formatMoney(this.state.tongtien)} đ
                </Text>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: colors.white,
                  marginHorizontal: 25,
                  borderTopRightRadius: 4,
                  borderTopLeftRadius: 4,
                  flex: 1,
                  marginBottom: 10
                }}
              >
                <Text
                  style={{
                    fontSize: sizes.sizes.sText15,
                    fontWeight: "500",
                    padding: 15,
                    color: "#0099FF"
                  }}>
                  Chi tiết các tiền phải nộp trong tháng
              </Text>
                <View
                  style={{
                    height: 1,
                    backgroundColor: colors.brownishGreyTwo,
                    opacity: 0.3,
                    marginHorizontal: 15
                  }}
                />
                <FlatList
                  showsVerticalScrollIndicator={false}
                  renderItem={this._renderItemChild}
                  data={this.state.data}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </View>
          )}
      </View>
    );
  }
}
const mapStateToProps = state => ({
  listchild: state.listchild
});
export default Utils.connectRedux(NotifyHocPhi, mapStateToProps);
