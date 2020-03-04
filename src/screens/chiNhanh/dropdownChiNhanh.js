import React, { Component } from "react";
import { colors, sizes } from "../../styles";
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList
} from "react-native";
import Input from "../../components/componentsYSchool/Input";
import { Images } from "../../images";
import ButtonCom from "../../components/Button/ButtonCom";
import { getListChiNhanh } from "../../apis/chiNhanh";
// import { styles } from './styles';
import Utils from "../../app/Utils";
const { width } = Dimensions.get("window");
export default class DropDownChiNhanh extends Component {
  constructor(props) {
    super(props);
    this.getMaTruong = Utils.ngetParam(this, "getMaTruong", () => { });
    this.state = {
      data: ""
    };
  }
  componentDidMount() {
    this.getData();
  }
  getData = async () => {
    let res = await getListChiNhanh();
    if (res.success == true) {
      this.setState({ data: res.data });
    }
  };
  onCancel = () => {
    Utils.goback(this, null);
  };

  _touchItem = item => () => {
    this.getMaTruong(item.MaChiNhanh, item.TenChiNhanh);
    Utils.goback(this, null);
  };
  _renderItemChild = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={this._touchItem(item)}
        style={{
          fontSize: sizes.sizes.sText18,
          borderWidth: 1,
          marginVertical: 5,
          marginHorizontal: 5,
          borderRadius: 5,
          borderColor: colors.veryLightPinkThree
        }}
      >
        <Text style={{ textAlign: "center", marginVertical: 10 }}>
          {item.TenChiNhanh}
        </Text>
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <View
        style={{
          backgroundColor: colors.black_16,
          flex: 1,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <View
          style={{
            backgroundColor: colors.white,
            width: width * 0.7,
            borderRadius: 3
          }}
        >
          <Text
            style={{
              textAlign: "center",
              marginBottom: 10,
              marginTop: 15,
              fontSize: sizes.sizes.sText15
            }}
          >
            Danh sách trường
          </Text>
          <View style={{ marginHorizontal: 5, marginBottom: 5 }}>
            <FlatList
              renderItem={this._renderItemChild}
              data={this.state.data}
              extraData={this.state.id}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </View>
    );
  }
}
