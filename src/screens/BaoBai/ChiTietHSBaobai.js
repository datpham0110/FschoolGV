import React, { Component, Fragment } from "react";
import { View, TextInput, Text, Image, StyleSheet, FlatList, TouchableOpacity, Dimensions } from "react-native";
import Utils from "../../app/Utils";
import { colors, sizes, nstyles } from "../../styles";
import { ChiTiet_ThongBao_BaoBai, ThongBao_Detail_V3 } from '../../apis/notifycation';
import Moment from "moment";

import HeaderCom from "../../components/HeaderCom";
import { Images } from "../../images/index";
import DatePick from '../../components/DatePick';
import ButtonCom from "../../components/Button/ButtonCom";
import styles from './styles';
const { width, height } = Dimensions.get('window');

export default class ChiTietHSBaobai extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            valueSelect: 0,
            dataSor: ''
        };
        this.dataBaoBai = Utils.ngetParam(this, 'dataBaoBai', '')
        this.dataList = Utils.ngetParam(this, 'dataList', '')
    }

    componentDidMount() {
        this.reloadData();
    }
    reloadData = async () => {
        let res = await ChiTiet_ThongBao_BaoBai(this.dataBaoBai.IDThongBao, this.dataBaoBai.BaiKiemTra.LoaiBaiKT, this.dataBaoBai.BaiKiemTra.IDBaiKT, this.dataList.IDLop);
        Utils.showMsgBoxOK
        if (res.status == 1 && res.data != null) {
            this.setState({ data: res.data, dataSor: res.data })
        } else {
            this.setState({ data: [] })
        }
    }
    touchValue = (item) => {
        this.setState({ valueSelect: item })
        if (this.state.data == []) {
            return;
        }
        if (item == 0) {
            this.setState({ dataSor: this.state.data })
        } else if (item == 1) {
            let datava = [];
            let daa = this.state.data
            for (let i = 0; i < daa.length; i++) {
                if (daa[i].DaNop == 1) {
                    datava.push(daa[i])
                }
            }
            this.setState({ dataSor: datava })
        } else {
            let datava2 = [];
            let daa = this.state.data
            for (let i = 0; i < daa.length; i++) {
                if (daa[i].DaNop == 0) {
                    datava2.push(daa[i])
                }
            }
            this.setState({ dataSor: datava2 })
        }
    }
    goChiTietBaitap = (item) => {
        if (item.DaNop != 1) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Học sinh chưa nộp bài kiểm tra', 'Đóng');
            return;
        }
        Utils.goscreen(this, 'Modal_ModalChiTietBaiTap', { dataBaoBai: this.dataBaoBai, dataBaiKiemtra: item })
    }
    renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => this.goChiTietBaitap(item)} key={index}>
                <View style={[nstyles.nstyles.nrow, { alignItems: 'center', paddingVertical: 15 }]}>
                    <Image source={Images.imgProfile} resizeMode="cover" style={nstyles.nstyles.nIcon48} />
                    <View style={{ width: 10 }} />
                    <Text style={{ fontWeight: '500', fontSize: sizes.fs(18) }}>{item.TenKhachHang}</Text>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: '#4caf50', textAlign: 'right', fontSize: sizes.fs(16) }}>{item.DaNop == 1 ? 'Đã nộp' : 'Chưa nộp'}</Text>
                        <Text style={{ color: colors.brownishGrey, textAlign: 'right', fontSize: sizes.fs(14) }}>{item.DaNop == 0 ? '' : Moment(item.NgaySubmit).format("DD/MM/YYYY HH:mm")}</Text>
                    </View>
                </View>
                <View style={{ backgroundColor: '#b8b8b8', marginLeft: 45, height: 1 }} />
            </TouchableOpacity>
        )
    }
    render() {
        return (
            <View style={[nstyles.nstyles.ncontainerX, { backgroundColor: colors.whitegay }]}>
                <HeaderCom
                    nthis={this}
                    iconLeft={Images.icBackBlue}
                    titleText={'Danh sách học sinh'}
                />
                <View style={[nstyles.nstyles.nbody, { backgroundColor: 'white', marginTop: 20, marginHorizontal: 20, paddingHorizontal: 20 }]}>
                    <View style={[nstyles.nstyles.nrow, { alignItems: 'center', justifyContent: 'space-between', paddingTop: 10 }]}>
                        <TouchableOpacity style={nstyles.nstyles.nrow} onPress={() => this.touchValue(0)}>
                            {/* <Image source={Images.KSUncheck} /> */}
                            <Image source={this.state.valueSelect == 0 ? Images.KScheck : Images.KSUncheck} />
                            <View style={{ width: 10 }} />
                            <Text style={{ fontSize: sizes.fs(18) }}>
                                Tất cả
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={nstyles.nstyles.nrow} onPress={() => this.touchValue(1)}>
                            <Image source={this.state.valueSelect == 1 ? Images.KScheck : Images.KSUncheck} />
                            <View style={{ width: 10 }} />
                            <Text style={{ fontSize: sizes.fs(18) }}>Đã nộp</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={nstyles.nstyles.nrow} onPress={() => this.touchValue(2)}>
                            <Image source={this.state.valueSelect == 2 ? Images.KScheck : Images.KSUncheck} />
                            <View style={{ width: 10 }} />
                            <Text style={{ fontSize: sizes.fs(18) }}>Chưa nộp</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ backgroundColor: '#b8b8b8', marginVertical: 10, height: 1 }} />
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={this.state.dataSor}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </View >
        );
    }
}

