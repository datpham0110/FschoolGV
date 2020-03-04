import React, { Component } from "react";
import { colors, sizes } from "../../styles";
import { Text, View, Dimensions, FlatList, TouchableOpacity, Image } from "react-native";
import ButtonCom from "../../components/Button/ButtonCom";
import Utils from "../../app/Utils";
import { Images } from "../../images";
import { nstyles } from "../../styles/styles";
const { width, height } = Dimensions.get("window");
export default class SelectHocSinhDiemDanh extends Component {
    constructor(props) {
        super(props);
        this._dataListHSReturn = Utils.ngetParam(this, "_dataListHSReturn", () => { });
        this.viTri = Utils.ngetParam(this, "viTri");
        this.data = Utils.ngetParam(this, "data");
    }
    onCancel = () => {
        Utils.goback(this, null);
    };
    _goBack = (item, index) => {
        let listHS = this.data
        if (item.IDHocSinh == '-1') {
            for (let i = 0; i < listHS.length; i++) {
                if (listHS[i].ViTriHocSinh == this.viTri.toString()) {
                    listHS[i].ViTriHocSinh = '';
                    break;
                }
            }
        } else {
            for (let i = 0; i < listHS.length; i++) {
                if (listHS[i].ViTriHocSinh == this.viTri.toString()) {
                    listHS[i].ViTriHocSinh = '';
                    for (let j = 0; j < listHS.length; j++) {
                        if (item.TenHocSinh == listHS[j].TenHocSinh) {
                            listHS[j].ViTriHocSinh = this.viTri.toString();
                            this._dataListHSReturn(listHS, this.viTri, item)
                            Utils.goback(this)
                        }
                    }
                }
            }
            listHS[index].ViTriHocSinh = this.viTri.toString();
        }
        this._dataListHSReturn(listHS, this.viTri, item)
        Utils.goback(this)
    }
    _renderItem = ({ item, index }) => {
        return (
            item.ViTriHocSinh == '' || item.ViTriHocSinh == '-1' ?
                <View style={[nstyles.nrow, { alignItems: 'center', marginBottom: 10, width: '100%' }]}>
                    <TouchableOpacity style={{ borderWidth: 1, borderRadius: 6, width: '100%', borderColor: colors.BackgroundHome }} onPress={() => this._goBack(item, index)}>
                        <Text style={{ paddingHorizontal: 10, paddingVertical: 10 }}>{item.TenHocSinh}</Text>
                    </TouchableOpacity>
                </View> : null
        )
    }
    render() {
        return (
            <View
                style={{
                    backgroundColor: colors.black_50, flex: 1, alignItems: "center", justifyContent: "center",
                }} >
                <View
                    style={{
                        backgroundColor: colors.white,
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        paddingBottom: 20,
                        borderRadius: 10,
                        minHeight: 300,
                        maxHeight: height * 0.8,
                        width: width * 0.9
                    }} >
                    <FlatList
                        data={this.data}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    <ButtonCom
                        colorChange={[colors.lightSalmon, colors.salmonTwo]}
                        onPress={this.onCancel}
                        Linear={true}
                        text={"ĐÓNG"}
                        style={{ paddingHorizontal: 50, marginTop: 10 }} />

                </View>
            </View>
        );
    }
}
