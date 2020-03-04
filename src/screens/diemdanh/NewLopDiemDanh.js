import React, { Component, Fragment } from "react";
import { View, TextInput, Text, Image, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import Utils from "../../app/Utils";
import { colors, sizes, nstyles } from "../../styles";
import HeaderCom from "../../components/HeaderCom";
import { Images } from "../../images/index";
import DatePick from '../../components/DatePick';
import ButtonCom from "../../components/Button/ButtonCom";
import { ROOTGlobal } from "../../app/data/dataGlobal";
import { Picker } from "native-base";
import ListEmpty from "../../components/ListEmpty";
import { LopMonHoc_Create_App } from '../../apis//thoiKhoaBieu';
import { Width } from "../../styles/styles";
import styles from "../BaoBai/styles";
import { MonHocList } from "../../apis/danhmuc";
import { DiemDanhList } from '../../apis/thanhtoan';

export default class NewLopDiemDanh extends Component {
    constructor(props) {
        super(props);
        nthis = this;
        this.clickAll = false;
        this.state = {
            textTitle: '',
            listHS: [],
            itemClick: [],
            listMonHoc: [],
            valuMonHoc: '',
        };
        this.dayInMonth = new Date().getDate();
        this.monthInYear = new Date().getMonth() + 1;
        if (this.monthInYear < 10) {
            this.monthInYear = "0" + this.monthInYear.toString()
        }
        if (this.dayInMonth < 10) {
            this.dayInMonth = "0" + this.dayInMonth.toString();
        }
        this.year = new Date().getFullYear();
        this.reloadData1 = Utils.ngetParam(this, 'reloadData', () => { })
    }
    componentDidMount() {
        this.getMonHocList();
    }
    _callBackFunction = (datatest) => {
        this.setState({ listHS: datatest })
    }
    getMonHocList = async () => {
        let res = await MonHocList()
        if (res.status == 1) {
            listMonHoc = res.data
            this.setState({ listMonHoc, valuMonHoc: res.data[0] })
        }
    }
    addhsNew = () => {
        Utils.goscreen(this, 'sc_SelectStudenClass', { listHS: this.state.listHS, callBack: this._callBackFunction, })
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
    createClass = async () => {
        if (this.state.textTitle.trim().length == 0) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Tên lớp không được để trống', 'Đóng')
            return
        }
        if (this.state.listHS.length == 0) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Chưa có học sinh nào được chọn', 'Đóng')
            return
        }
        let listMSHS = [];
        for (let i = 0; i < this.state.listHS.length; i++) {
            listMSHS.push(this.state.listHS[i].IDHocSinh)
        }
        let res = await LopMonHoc_Create_App(ROOTGlobal.IdCN, this.state.textTitle.trim(), this.state.valuMonHoc.IdMonHoc, listMSHS)
        if (res.status == 1) {
            Utils.showMsgBoxYesNo(this, 'Thông báo', 'Bạn đã tạo lớp ' + this.state.textTitle + ' thành công. TIẾP TỤC để sắp xếp sơ đồ lớp hoặc QUAY LẠI', 'TIẾP TỤC', 'QUAY LẠI', () => this._goSapXepViTri(res.data), () => {
                this.reloadData1('Không có data truyền về', true)
                Utils.goback(this)
            })
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', res.error.message, 'Đóng')
        }
    }

    _goSapXepViTri = async (IDLop) => {
        let res = await DiemDanhList(1, ROOTGlobal.IdCN, IDLop.IDLopHoc, this.monthInYear.toString() + "/" + this.year.toString(), IDLop.IDMonHoc);
        if (res.status == 1) {
            Utils.goscreen(this, 'Modal_SodoDiemDanh', { loaiLop: 1, valuListLop: IDLop.IDLopHoc, listHSTruyenQua: res.data.DanhSach, reloadData: this.reloadData, IdMonHoc: IDLop.IDMonHoc })
        }
    }
    reloadData = (flag) => {
        Utils.nlog('------------------ reload Data New Lop Diem Danh')
        this.reloadData1(flag, true)
        // this.reloadData1(flag, false)

        Utils.goback(this)
    }

    getListmonhoc = async (valIdLop) => {
        for (let i = 0; i < this.state.listMonHoc.length; i++) {
            if (this.state.listMonHoc[i].IdMonHoc == valIdLop) {
                this.setState({ valuMonHoc: this.state.listMonHoc[i] });
                return;
            }
        }
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
                    <Text style={[styles.text13, { fontWeight: 'bold' }]}>{item.TenLopHoc}</Text>
                    <Text style={[styles.text12, { color: colors.colorGrayText, marginVertical: 3 }]}>HS {item.TenHocSinh}</Text>
                </View>
            </TouchableOpacity>
        </View>
    }
    render() {
        var { listLop, valuListLop, listHS, textTitle } = this.state
        const { nrow, nIcon20, nbody } = nstyles.nstyles;
        return (
            <View style={[nstyles.nstyles.ncontainerX, { backgroundColor: colors.whitegay }]}>
                <HeaderCom
                    nthis={this}
                    iconLeft={Images.icBackBlue}
                    titleText={'Tạo lớp'}
                    titleStyle={{ color: colors.white, fontSize: sizes.reText(16) }}
                />
                <View style={[nbody, { marginHorizontal: 20, marginTop: 15 }]}>
                    <View style={{ backgroundColor: 'white', marginBottom: 15, padding: 15 }}>
                        <Text style={{ color: '#29a9e0', fontSize: sizes.fs(16), fontWeight: 'bold', textAlign: 'left', marginBottom: 16 }}>
                            Tên lớp
                        </Text>
                        <View style={{ borderWidth: 1, minHeight: 50, borderColor: colors.black_80, borderRadius: 6 }}>
                            <TextInput
                                placeholder={'Nhập tên lớp'}
                                multiline={true}
                                style={{ flex: 1, textAlignVertical: 'top', minHeight: 50, padding: 5 }}
                                onChangeText={(textTitle) => this.setState({ textTitle })}
                                value={textTitle}
                            />
                        </View>
                    </View>

                    <View style={[nrow, { backgroundColor: 'white', marginBottom: 15, padding: 8 }]}>
                        <View style={[nrow, { alignItems: 'center', marginLeft: 10, flex: 1, justifyContent: 'space-between' }]}>
                            <View style={{ flex: 1 }}>
                                {Platform.OS == 'ios' ?
                                    <View style={{ position: 'absolute', right: 5, top: 0, bottom: 0, justifyContent: 'center' }}>
                                        <Image source={Images.icDown} resizeMode='contain' style={[nstyles.nIcon20, { tintColor: '#A3A3A3' }]} />
                                    </View>
                                    : null
                                }
                                <Picker
                                    ref={ref => this.INPUT = ref}
                                    mode="dropdown"
                                    placeholder={'Chọn môn'}
                                    style={{ width: '100%', height: 30 }}
                                    textStyle={{ fontWeight: 'bold', fontSize: 15 }}
                                    selectedValue={this.state.valuMonHoc.IdMonHoc}
                                    onValueChange={(val) => {
                                        this.getListmonhoc(val);
                                    }}>
                                    {listMonHoc.map((item, index) =>
                                        <Picker.Item key={index} label={item.TenMonHoc} value={item.IdMonHoc} />
                                    )}
                                </Picker>
                            </View>
                        </View>
                    </View>
                    <ButtonCom
                        onPress={this.addhsNew}
                        text={"Thêm học sinh"}
                        txtStyle={{ color: '#00b096' }}
                        style={{ paddingHorizontal: 65, marginBottom: 20, borderRadius: 3, backgroundColor: 'white' }}
                    />
                    <View style={{ flex: 1, backgroundColor: 'white', marginBottom: 15, padding: 15 }}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={<ListEmpty textempty={'Chưa có học sinh nào được chọn'} />}
                            data={listHS}
                            renderItem={this._renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            ItemSeparatorComponent={this.renderSeparator}
                            extraData={listHS}
                        />
                    </View>
                </View>
                <View style={[nrow, { height: nstyles.Height(8), justifyContent: 'center' }]}>
                    <ButtonCom
                        colorChange={[colors.lightSalmon, colors.salmonTwo]}
                        Linear={true}
                        text={"Tạo"}
                        txtStyle={{ color: 'white' }}
                        onPress={this.createClass}
                        style={{ paddingHorizontal: 50, marginTop: 10 }}
                    />
                </View>
            </View>
        );
    }
}

