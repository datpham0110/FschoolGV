import React, { Component, Fragment } from "react";
import { View, TextInput, Text, Image, StyleSheet, FlatList, TouchableOpacity, Dimensions } from "react-native";
import Utils from "../../app/Utils";
import { colors, sizes, nstyles } from "../../styles";
import { reSize } from "../../styles/size";

import HeaderCom from "../../components/HeaderCom";
import { Images } from "../../images/index";
import DatePick from '../../components/DatePick';
import ButtonCom from "../../components/Button/ButtonCom";
import styles from './styles';
import { ListLop, HocSinhList } from "../../apis/thanhtoan";
import { Picker } from "native-base";
import ListEmpty from "../../components/ListEmpty";
import { ROOTGlobal } from "../../app/data/dataGlobal";
import { nGlobalKeys } from "../../app/keys/globalKey";
import { RootLang } from "../../app/data/locales";
const { width, height } = Dimensions.get('window');

export default class BaoBaiMain extends Component {
    constructor(props) {
        super(props);
        this.callBack = Utils.ngetParam(this, 'callBack');
        nthis = this;
        this.type = Utils.ngetParam(this, 'type');
        this.listHS = Utils.ngetParam(this, 'listHS')
        this.khoangcach = 18;
        this.clickAll = false;
        this.lop = '';
        this.state = {
            date: "",
            tabNP: 0,
            namestudent: '',
            itemClick: [],
            listTruong: [],
            listLop: [],
            valuListTruong: ROOTGlobal.IdCN,
            valuListLop: 'Mam non',
            listHS: [],
            newDate: new Date,
            txtEmpty: 'Không có dữ liệu',
        };
    }
    componentDidMount() {
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        this.setState({ date: "T" + month + "/" + year });
        this.DSLop();
    }
    DSLop = async () => {
        let res = await ListLop(this.state.valuListTruong)
        if (res.status == 1) {
            listLop = res.data
            this.setState({ listLop, txtEmpty: RootLang.lang.loading }, () => {
                if (listLop.length != 0) {
                    let tempId = listLop[0].IDNhomKH;
                    this.lop = listLop[0].TenNhomKH;
                    this.GetHocSinhList(tempId)
                };
            });
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', res.error.message)
        }
    }
    GetHocSinhList = async (valIdLop) => {
        var { valuListTruong } = this.state;
        this.state.listLop.findIndex(item => {
            if (item.IDNhomKH == valIdLop) this.lop = item.TenNhomKH
        });
        this.setState({ valuListLop: valIdLop, itemClick: [] });
        Utils.setGlobal(nGlobalKeys.baobai, []);
        this.clickAll = false;
        let res = await HocSinhList(valuListTruong, valIdLop)
        if (res.status == 1) {
            const listHS = res.data
            this.setState({ listHS })
        } else {
            this.setState({ listHS: [] })
            Utils.showMsgBoxOK(this, 'Thông báo', res.error.message)
        }
    }
    _clickItem = (id) => () => {
        const itemClick = this.state.itemClick.slice();
        if (itemClick.includes(id)) {
            const index = itemClick.indexOf(id);
            itemClick.splice(index, 1)
        } else {
            itemClick.push(id)
        };
        this.setState({ itemClick });
    }
    _renderItem = ({ item, index }) => {
        const { nrow, nmiddle } = nstyles.nstyles;
        return <View key={index} style={[nrow, { alignItems: 'center', paddingVertical: 10, paddingRight: this.khoangcach }]}>
            <View style={[nmiddle, { width: sizes.reSize(48), height: sizes.reSize(48), borderRadius: sizes.reSize(24), borderWidth: 1, borderColor: colors.veryLightPinkThree }]}>
                <Image style={{ width: sizes.reSize(47), height: sizes.reSize(47) }} source={item.GioiTinh == "Nam" ? Images.icBe2 : Images.icBe1} resizeMode='contain' />
            </View>
            <TouchableOpacity style={[nrow, { marginLeft: 15, flex: 1, alignItems: 'center', justifyContent: 'space-between' }]}
                onPress={this._clickItem(index)}>
                <View>
                    <Text style={[styles.text12, { color: colors.colorGrayText, marginVertical: 3, maxWidth: width * 0.5 }]}>{item.TenHocSinh}</Text>
                </View>
                <View
                    style={{ padding: 5 }}>
                    <View style={[nstyles.nstyles.nIcon12, nmiddle, {
                        borderColor: 'green', borderWidth: 0.5, width: sizes.reSize(20), height: sizes.reSize(20),
                        borderRadius: 2, backgroundColor: this.state.itemClick.includes(index) ? 'green' : 'white'
                    }]}>
                        <Image source={Images.icCheckBlue} style={{ width: sizes.reSize(18), height: sizes.reSize(18), tintColor: colors.white }}
                            resizeMode='contain' />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    }

    renderSeparator = () => {
        return (
            <View style={[nstyles.nstyles.nrow, { height: 1, width: '100%' }]}>
                <View style={{ width: '20%', backgroundColor: colors.white }} />
                <View style={{ width: '80%', backgroundColor: colors.veryLightPinkSeven }} />
            </View>
        );
    };
    _clickAll = () => {
        const length = this.state.listHS.length;
        let itemClick = this.state.itemClick.slice();
        if (this.clickAll) {
            this.clickAll = false;
            itemClick = [];
        } else {
            this.clickAll = true;
            for (let index = 0; index < length; index++) {
                if (!itemClick.includes(index)) {
                    itemClick.push(index);
                };
            };
        };
        this.setState({ itemClick });
    }

    _submit = (check) => () => {
        if (this.state.itemClick.length == 0) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Chưa có học sinh nào được chọn')
        } else {
            let data = []
            for (let i = 0; i < this.state.listHS.length; i++) {
                for (let j = 0; j < this.state.itemClick.length; j++) {
                    if (i == this.state.itemClick[j]) {
                        data.push(this.state.listHS[i].IDHocSinh)
                        break;
                    };
                };
            };
            let dataItem = []
            for (let i = 0; i < this.state.listHS.length; i++) {
                for (let j = 0; j < this.state.itemClick.length; j++) {
                    if (i == this.state.itemClick[j]) {
                        dataItem.push(this.state.listHS[i])
                        break;
                    };
                };
            };
            this._handleGoscreen(data, check, dataItem);
        };
    }


    _handleGoscreen = (data, check, dataItem) => {
        switch (check) {
            case 1:
                Utils.goscreen(this, 'sc_ThemGhiChu', { type: this.type, listChild: data, lop: this.lop, valuListLop: this.state.valuListLop });
                break;
            // case 3:
            //     Utils.goscreen(this, 'sc_ThongBaoHocPhi', { ListHocSinh: data, type: this.type, IDChiNhanh: this.state.valuListTruong, lop: this.lop });
            //     break;
            case 3:
                Utils.goscreen(this, 'sc_ThemGhiChu', { listChild: data, lop: this.lop, valuListLop: this.state.valuListLop });
                break;
            case 2:
                Utils.goscreen(this, 'sc_EditBaoBai', { listChild: data, lop: this.lop, valuListLop: this.state.valuListLop });
                break;
            case 5:
                Utils.goscreen(this, 'sc_ThemGhiChu', { type: this.type, listChild: data, lop: this.lop, valuListLop: this.state.valuListLop });
                break;
            case 7:
                Utils.goscreen(this, 'sc_ThemGhiChu', { type: this.type, listChild: data, lop: this.lop, valuListLop: this.state.valuListLop });
                break;
            case 8:
                Utils.goscreen(this, 'sc_ThemGhiChu', { type: this.type, listChild: data, lop: this.lop, valuListLop: this.state.valuListLop });
                break;
            case 9:
                this._handleOK(dataItem)
                break;
        };
    }
    _goscreenDetails = (loai) => () => {
        switch (loai) {
            case 2:
                Utils.goscreen(this, 'Modal_LichSuBaoBai', { type: this.type, valuListLop: this.state.valuListLop });
                break;
            case 7:
                Utils.goscreen(this, 'Modal_LichSuBaoBai', { type: this.type, valuListLop: this.state.valuListLop });
                break;
        }
    }
    _handleOK = (data) => {
        this.callBack(data);
        Utils.goback(this)
    }

    _titleType = () => {
        let title = '';
        switch (this.type) {
            case 1:
                title = 'Thông báo';
                return title;
            case 2:
                title = 'Báo bài';
                return title
            case 4:
                title = 'Thư mời sự kiện';
                return title
            case 5:
                title = 'Kết quả học tập';
                return title
            case 9:
                title = 'Thêm học sinh';
                return title
        };
    }

    render() {
        var { listLop, valuListLop, listHS } = this.state
        const { nrow, nIcon20 } = nstyles.nstyles;
        return (
            <View style={[nstyles.nstyles.ncontainerX, { backgroundColor: colors.whitegay }]}>
                <HeaderCom
                    nthis={this}
                    iconLeft={Images.icBackBlue}
                    // iconRight={Images.icCTbaobai}
                    iconRight={this.type == 4 ? Images.icCTbaobai : this.type == 2 ? Images.icCTbaobai : null}
                    titleText={this._titleType()}
                    _onPressLeftDefault={() => Utils.gobackTop(this)}
                    onPressRight={this.type == 4 ? this._goscreenDetails(7) : this.type == 2 ? this._goscreenDetails(2) : null}
                    titleStyle={{ color: colors.white, fontSize: sizes.reText(16) }}
                />
                <View style={[nstyles.nstyles.nbody, { paddingHorizontal: 15 }]}>
                    <DatePick
                        disabled={true}
                        isVisible={false}
                        value={this.state.newDate}
                        style={{ fontWeight: 'bold', fontSize: sizes.reText(18), marginTop: 15 }}
                        format='DD/MM/YYYY'
                    />
                    <View style={[nrow, { backgroundColor: colors.white, borderRadius: 6, marginTop: 24, paddingHorizontal: this.khoangcach, paddingVertical: nstyles.khoangcach }]}>
                        <View style={[nrow, stHocphi.container]}>
                            <View style={{ flex: 1 }}>
                                {Platform.OS == 'ios' ?
                                    <View style={{ position: 'absolute', right: 5, top: 0, bottom: 0, justifyContent: 'center' }}>
                                        <Image source={Images.icDown} resizeMode='contain' style={[nstyles.nIcon20, { tintColor: '#A3A3A3' }]} />
                                    </View>
                                    : null
                                }
                                <Picker
                                    mode="dropdown"
                                    placeholder={'Chọn lớp'}
                                    style={{ width: '100%', height: 30 }}
                                    textStyle={{ fontWeight: 'bold', fontSize: 15 }}
                                    selectedValue={valuListLop}
                                    onValueChange={(val) => {
                                        this.GetHocSinhList(val);
                                    }}>
                                    {listLop.map((item, index) =>
                                        <Picker.Item key={index} label={item.TenNhomKH} value={item.IDNhomKH} />
                                    )}
                                </Picker>
                            </View>

                        </View>
                    </View>
                    <View style={{ backgroundColor: colors.white, borderRadius: 6, marginTop: 15, flex: 1, paddingLeft: 30 }}>
                        <View style={nrow}>
                            {this.state.listHS.length == 0 ? null : <View style={{ borderBottomColor: colors.veryLightPinkThree, borderBottomWidth: 1, flex: 1, marginTop: 20 }}>
                                <TouchableOpacity onPress={this._clickAll} style={{ paddingVertical: 10 }}>
                                    <Text style={[styles.text13, { alignSelf: 'flex-end', marginRight: this.khoangcach }]}>Chọn tất cả</Text>
                                </TouchableOpacity>
                            </View>}

                        </View>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={<ListEmpty textempty={this.state.txtEmpty} />}
                            data={listHS}
                            renderItem={this._renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            ItemSeparatorComponent={this.renderSeparator}
                            extraData={listHS}
                        />
                    </View>
                    {
                        this.type == 1 || this.type == 4 || this.type == 5 || this.type == 9 ? <View style={[nrow, { height: 55, justifyContent: 'center' }]}>
                            <ButtonCom
                                colorChange={[colors.lightSalmon, colors.salmonTwo]}
                                onPress={this.type == 9 ? this._submit(9) : this.type == 1 ? this._submit(1) : this.type == 4 ? this._submit(7) : this._submit(8)}

                                // onPress={this.type == 9 ? this._submit(9) : this.type == 1 ? this._submit(3) : this.type == 4 ? this._submit(7) : this._submit(8)}
                                Linear={true}
                                text={"Tiếp tục"}
                                style={{ paddingHorizontal: 50, marginTop: 10 }}
                            />
                        </View> : <View style={[nrow, { justifyContent: 'center', marginBottom: 10 }]}>
                                <View style={[nrow, { height: 52, justifyContent: 'center' }]}>
                                    <ButtonCom
                                        colorChange={[colors.lightSalmon, colors.salmonTwo]}
                                        onPress={this._submit(5)}
                                        Linear={true}
                                        text={"Gửi ghi chú"}
                                        style={{ paddingHorizontal: 30, marginTop: 10 }}
                                    />
                                </View>
                                <View style={{ width: 10 }} />
                                <View style={[nrow, { height: 52, justifyContent: 'center' }]}>
                                    <ButtonCom
                                        colorChange={[colors.lightSalmon, colors.salmonTwo]}
                                        onPress={this._submit(2)}
                                        Linear={true}
                                        text={"Gửi báo bài"}
                                        style={{ paddingHorizontal: 30, marginTop: 10 }}
                                    />
                                </View>
                            </View>
                    }

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
        fontSize: sizes.reText(13),
        fontWeight: '500'
    }
})