import React, { Component, Fragment } from "react";
import { View, TextInput, Text, Image, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import Utils from "../../app/Utils";
import { colors, sizes, nstyles } from "../../styles";
import HeaderCom from "../../components/HeaderCom";
import { Images } from "../../images/index";
import DatePick from '../../components/DatePick';
import ButtonCom from "../../components/Button/ButtonCom";
import { LopHoc_List_App, HocSinhList } from "../../apis/thanhtoan";
import { Picker } from "native-base";
import ListEmpty from "../../components/ListEmpty";
import { ROOTGlobal } from "../../app/data/dataGlobal";
import { Width } from "../../styles/styles";
import { ScrollView } from "react-native-gesture-handler";

export default class AddNewClass extends Component {
    constructor(props) {
        super(props);
        this.idLop = Utils.ngetParam(this, 'idLop', () => { })
        nthis = this;
        this.state = {
            listLopChinhQuy: [],
            listLopKyNang: []
        };
    }
    componentDidMount() {
        this.DSLop();
    }

    DSLop = async () => {
        let res = await LopHoc_List_App(ROOTGlobal.IdCN)
        if (res.status == 1) {
            listLopChinhQuy = res.data.LopChinhQuy;
            listLopKyNang = res.data.LopKyNang
        }
        this.setState({ listLopChinhQuy, listLopKyNang })
    }
    renderItemlistLopChinhQuy = ({ item, index }) => {
        return (
            <View style={[nstyles.nstyles.nrow, { marginVertical: 5 }]}>
                <Image source={Images.icTopHotels} resizeMode='contain' />
                <View style={{ width: 8 }} />
                <View style={{ width: Width(74), justifyContent: 'center' }}>
                    <ButtonCom
                        onPress={() => this._handleOK(item, 0)}
                        text={item.TenNhomKH}
                        txtStyle={{ color: 'white', flex: 1 }}
                        style={{ borderRadius: 6, backgroundColor: '#84d3a5', alignItems: 'center' }}
                    />
                </View>
            </View >
        )
    }
    renderItemlistLopKyNang = ({ item, index }) => {
        return (
            <View style={[nstyles.nstyles.nrow, { marginVertical: 5 }]}>
                <Image source={Images.icTopHotels} resizeMode='contain' />
                <View style={{ width: 8 }} />
                <View style={{ width: Width(74), justifyContent: 'center' }}>
                    <ButtonCom
                        onPress={() => this._handleOK(item, 1)}
                        text={item.TenNhomKH}
                        txtStyle={{ color: 'white', flex: 1 }}
                        style={{ borderRadius: 6, backgroundColor: colors.colorSunflower, alignItems: 'center' }}
                    />
                </View>
            </View >
        )
    }
    _handleOK = (data, flag) => {
        this.idLop(data, flag);
        Utils.goback(this)
    }
    reloadData = async (data, flag) => {
        Utils.nlog('------------------------- Reload data Add New Class', flag)
        if (flag == true) {
            this.DSLop();
        } else {
            let res = await LopHoc_List_App(ROOTGlobal.IdCN)
            if (res.status == 1) {
                for (let i = 0; i < res.data.LopKyNang.length; i++) {
                    if (res.data.LopKyNang[i].IDNhomKH == data.IDLopHoc) {
                        this.idLop(res.data.LopKyNang[i], 1);
                        Utils.goback(this)
                    }
                }
            }
        }

    }
    render() {
        var { listLopChinhQuy, listLopKyNang } = this.state
        const { nrow, nIcon20, nbody } = nstyles.nstyles;
        return (
            <View style={[nstyles.nstyles.ncontainerX, { backgroundColor: colors.whitegay }]}>
                <HeaderCom
                    nthis={this}
                    iconLeft={Images.icBackBlue}
                    titleText={'Danh sách lớp'}
                    titleStyle={{ color: colors.white, fontSize: sizes.reText(16) }}
                />
                <View style={[nbody, { paddingHorizontal: 22 }]}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ flex: 1 }}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={listLopChinhQuy}
                                renderItem={this.renderItemlistLopChinhQuy}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={listLopKyNang}
                                renderItem={this.renderItemlistLopKyNang}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                    </ScrollView>
                    <ButtonCom
                        onPress={() => Utils.goscreen(this, 'sc_NewLopDiemDanh', { reloadData: this.reloadData })}
                        text={"Lớp tạo mới"}
                        txtStyle={{ color: 'white' }}
                        style={{ paddingHorizontal: 65, marginTop: 15, marginBottom: 20, borderRadius: 3, backgroundColor: '#f8b199' }}
                    />
                </View>
            </View >
        );
    }
}

