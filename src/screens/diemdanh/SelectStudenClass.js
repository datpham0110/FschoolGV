import React, { Component, Fragment } from "react";
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import Utils from "../../app/Utils";
import { colors, sizes, nstyles } from "../../styles";
import HeaderCom from "../../components/HeaderCom";
import { Images } from "../../images/index";
import DatePick from '../../components/DatePick';
import ButtonCom from "../../components/Button/ButtonCom";
import styles from './styles';
import { ListAllLop, HocSinhList, ListLop } from "../../apis/thanhtoan";
import { Picker } from "native-base";
import ListEmpty from "../../components/ListEmpty";
import { ROOTGlobal } from "../../app/data/dataGlobal";

export default class SelectStudenClass extends Component {
    constructor(props) {
        super(props);
        this.callBack = Utils.ngetParam(this, 'callBack');
        this.khoangcach = 18;
        this.clickAll = false;
        this.lop = '';
        this.state = {
            itemClick: [],
            listLop: [],
            valuListLop: '',
            listHSNew: [],
            newDate: new Date,
            listHSOld: Utils.ngetParam(this, 'listHS')
        };
        this.valuListTruong = ROOTGlobal.IdCN;
        this.listCheckStuden = []
    }
    componentDidMount() {
        this.DSLop();
    }
    DSLop = async () => {
        let res = await ListLop(this.valuListTruong)
        Utils.nlog('----------', res)
        if (res.status == 1) {
            listLop = res.data
            this.setState({ listLop }, () => {
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
        this.state.listLop.findIndex(item => {
            if (item.IDNhomKH == valIdLop) this.lop = item.TenNhomKH
        });
        this.setState({ valuListLop: valIdLop });
        let res = await HocSinhList(this.valuListTruong, valIdLop)
        if (res.status == 1) {
            const listHSNew = res.data
            this.setState({ listHSNew })
            this.listCheckStuden = res.data
        } else {
            this.setState({ listHSNew: [] })
            Utils.showMsgBoxOK(this, 'Thông báo', res.error.message)
        }
    }
    _clickItem = (item) => () => {
        let listHSOld = this.state.listHSOld;

        if (listHSOld.length < 64) {
            let flag = false;
            for (let i = 0; i < listHSOld.length; i++) {
                if (listHSOld[i].IDHocSinh == item.IDHocSinh) {
                    flag = true;
                    listHSOld.splice(i, 1)
                    break;
                }
            }
            if (flag == false) {
                listHSOld.push(item)
            }
            this.setState({ listHSOld: listHSOld });
        } else {
            Utils.showMsgBoxOK(this, ' Thông báo', 'Không thể chọn thêm học sinh vì số lượng tối đa học sinh trong lớp học là 64 học sinh!', 'Đóng')
        }
    }

    _checkTichStuden = (item) => {
        if (this.state.listHSOld.length > 0) {
            for (let i = 0; i < this.state.listHSOld.length; i++) {
                if (this.state.listHSOld[i].IDHocSinh == item.IDHocSinh) {
                    return true;
                }
            }
            return false;
        }
        else {
            return false
        }
    }

    _renderItem = ({ item, index }) => {
        const { nrow, nmiddle } = nstyles.nstyles;
        return <View key={index} style={[nrow, { alignItems: 'center', paddingVertical: 10, paddingRight: this.khoangcach }]}>
            <View style={[nmiddle, { width: sizes.reSize(48), height: sizes.reSize(48), borderRadius: sizes.reSize(24), borderWidth: 1, borderColor: colors.veryLightPinkThree }]}>
                <Image style={{ width: sizes.reSize(47), height: sizes.reSize(47) }} source={item.GioiTinh == "Nam" ? Images.icBe2 : Images.icBe1} resizeMode='contain' />
            </View>
            <TouchableOpacity style={[nrow, { marginLeft: 15, flex: 1, alignItems: 'center', justifyContent: 'space-between' }]}
                onPress={this._clickItem(item)}>
                <View>
                    <Text style={[styles.text13, { fontWeight: 'bold' }]}>HS {item.TenHocSinh}</Text>
                    <Text style={[styles.text12, { color: colors.colorGrayText, marginVertical: 3 }]}>Ngày Sinh: {item.NgaySinh}</Text>
                </View>
                <View
                    style={{ padding: 10 }}>
                    <View style={[nstyles.nstyles.nIcon12, nmiddle, {
                        borderColor: 'green', borderWidth: 0.5, width: sizes.reSize(20), height: sizes.reSize(20),
                        borderRadius: 2, backgroundColor: this._checkTichStuden(item) ? 'green' : 'white'
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
        let listHSNew = this.state.listHSNew;
        let listHSOld = this.state.listHSOld;
        if (listHSNew.length + listHSOld.length > 64) {
            Utils.showMsgBoxOK(this, ' Thông báo', 'Không thể chọn tất cả học sinh vì số lượng tối đa học sinh trong lớp học là 64 học sinh!', 'Đóng')
        } else {
            for (let i = 0; i < listHSNew.length; i++) {
                let flag = false;
                for (let j = 0; j < listHSOld.length; j++) {
                    if (listHSNew[i].IDHocSinh == listHSOld[j].IDHocSinh) {
                        flag = true;
                        break;
                    }
                }
                if (flag == false)
                    listHSOld.push(listHSNew[i])
            }
            this.setState({ listHSOld })
        }
    }
    _handleOK = (data) => () => {
        this.callBack(data);
        Utils.goback(this)
    }
    render() {
        var { listLop, valuListLop, listHSNew } = this.state
        const { nrow, nIcon20 } = nstyles.nstyles;
        return (
            <View style={[nstyles.nstyles.ncontainerX, { backgroundColor: colors.whitegay}]}>
                <HeaderCom
                    nthis={this}
                    iconLeft={Images.icBackBlue}
                    titleText={'Thêm học sinh'}
                    titleStyle={{ color: colors.white, fontSize: sizes.reText(16) }}
                />
                <View style={[nstyles.nstyles.nbody, { paddingHorizontal: 15 }]}>
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
                            {this.state.listHSNew.length == 0 ? null : <View style={{ borderBottomColor: colors.veryLightPinkThree, borderBottomWidth: 1, flex: 1, marginTop: 20 }}>
                                <TouchableOpacity onPress={this._clickAll} style={{ paddingVertical: 10 }}>
                                    <Text style={[styles.text13, { alignSelf: 'flex-end', marginRight: this.khoangcach }]}>Chọn tất cả</Text>
                                </TouchableOpacity>
                            </View>}

                        </View>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={<ListEmpty textempty={'Không có dữ liệu'} />}
                            data={listHSNew}
                            renderItem={this._renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            ItemSeparatorComponent={this.renderSeparator}
                            extraData={this.state}
                        />
                    </View>
                    <View style={[nrow, { height: nstyles.Height(8), justifyContent: 'center' }]}>
                        <ButtonCom
                            colorChange={[colors.lightSalmon, colors.salmonTwo]}
                            onPress={this._handleOK(this.state.listHSOld)}
                            Linear={true}
                            text={"Tiếp tục"}
                            style={{ paddingHorizontal: 50, marginTop: 10 }}
                        />
                    </View>
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