import React, { Component } from "react";
import { Text, View, Dimensions, TouchableOpacity, StyleSheet, Image, FlatList } from "react-native";
import ButtonCom from "../../components/Button/ButtonCom";
import { BaoBaiSend } from '../../apis/thanhtoan';
import Utils from "../../app/Utils";
import { colors, sizes, nstyles } from "../../styles";
import { ROOTGlobal } from "../../app/data/dataGlobal";
import { nwidth } from "../../styles/styles";
import { GV_Detail_HocSinh } from "../../apis/thoiKhoaBieu";
import moment from "moment";
import { appConfig } from "../../app/Config";
const { width, height } = Dimensions.get("window");
export default class ModalChiTietBaiTap extends Component {
    constructor(props) {
        super(props);
        dataDapAn = ['A', 'B', 'C', 'D', 'A', 'B', 'C', 'D', 'A', 'B', 'C', 'D',]
        this.dataBaoBai = Utils.ngetParam(this, 'dataBaoBai', () => { })
        this.dataBaiKiemtra = Utils.ngetParam(this, 'dataBaiKiemtra', () => { })
        this.state = {
            dapAn: []
        };
    }
    componentDidMount() {
        this.loadData()
    }
    loadData = async () => {
        let res = await GV_Detail_HocSinh(this.dataBaoBai.IDThongBao, this.dataBaiKiemtra.IDBaiKiemTra, this.dataBaoBai.BaiKiemTra.LoaiBaiKT, this.dataBaiKiemtra.IDKhachHang)
        Utils.nlog('loadDataloadData', res)
        if (res.status == 1) {
            dapAn = res.data
        } else {
        }
        this.setState({ dapAn })
    }

    _goBack = () => {
        Utils.goback(this)
    };
    renderDapAn = ({ item, index }) => {
        var colorText = colors.redStar
        if (item.IsDapAn == false && item.DuocChon > 0) {
            colorText
        } else if (item.IsDapAn == true && item.DuocChon > 0) {
            colorText = '#3d72f5'
        } else {
            colorText = colors.black
        }
        return (
            <View style={{ paddingVertical: 5, width: nwidth / 3 - 50, alignItems: 'center' }}>
                <Text style={{ fontSize: sizes.fs(20) }}>{index + 1 + '. '}<Text style={{ fontSize: sizes.fs(20), color: colorText, fontWeight: 'bold' }}>{item.TenDapAn}</Text></Text>
            </View>
        )
    }
    renderItemImg = (item, index) => {
        var imageList = appConfig.domain + item.HinhAnhCH
        return (
            <View key={index}>
                <Image source={{ uri: imageList }}
                    style={{ width: sizes.sizes.nImgSize90, height: sizes.sizes.nImgSize58, margin: 5, borderRadius: 4 }} />
            </View>

        );
    }
    _showAllImageHotel = (arrImage, index) => () => {
        const imagesURL = [];
        for (let index = 0; index < arrImage.length; index++) {
            const item = arrImage[index];
            const obj = {
                url: appConfig.domain + item,
            };
            imagesURL.push(obj);
        };
        Utils.goscreen(this, 'sc_ViewImageListShow', { ListImages: imagesURL, index });
    }
    renderItem = ({ item, index }) => {
        return (
            <View style={{ paddingVertical: 5 }}>
                {
                    this.dataBaoBai.BaiKiemTra.LoaiBaiKT == 1 ? <Text style={{ fontSize: sizes.fs(18) }}>{index + 1 + '. '}<Text style={{ fontSize: sizes.fs(18), fontWeight: 'bold' }}>
                        {item.NoiDungCauHoi}</Text></Text> :
                        <View style={{ flexWrap: 'wrap', paddingVertical: 10 }}>
                            {item.NoiDungCauHoi.map(this.renderItemImg)}
                        </View>
                }
                <View style={{ flexWrap: 'wrap', alignItems: 'center', paddingVertical: 13 }}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        numColumns={3}
                        data={item.CauTraLoi}
                        renderItem={this.renderDapAn}
                        keyExtractor={(item, index2) => index2.toString()}
                    />
                </View>
                <View style={{ backgroundColor: '#b8b8b8', width: width * 0.7, height: 1 }} />
            </View>
        )
    }
    render() {
        return (
            <View style={{
                justifyContent: 'center', alignItems: 'center', flex: 1,
            }}>
                <View style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0, right: 0,
                    backgroundColor: colors.black_50
                }} onTouchEnd={this._goBack} />
                <View style={{ backgroundColor: colors.white, borderRadius: 4, width: width * 0.8, height: height * 0.7, paddingHorizontal: 15 }}>
                    <View style={[nstyles.nstyles.nrow, { alignItems: 'center', justifyContent: 'space-between', paddingVertical: 13 }]}>
                        <Text style={{ flex: 1, fontSize: sizes.fs(20), color: '#29A9E0', fontWeight: 'bold' }}>{this.dataBaiKiemtra.TenKhachHang}</Text>
                        <Text style={{ fontSize: sizes.fs(16), color: colors.brownishGreyTwo, fontWeight: 'bold' }}>{moment(this.dataBaiKiemtra.NgaySubmit).format("DD/MM/YYYY")}</Text>
                    </View>
                    <View style={{ backgroundColor: '#b8b8b8', width: width * 0.7, height: 1 }} />
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={this.state.dapAn}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>

            </View >
        );
    }
}

