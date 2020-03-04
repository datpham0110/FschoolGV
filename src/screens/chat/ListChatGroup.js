import React, { Component } from "react";
import {
    View, Text, FlatList,
    TouchableOpacity, Image,
    StyleSheet,
    TextInput
} from "react-native";
import HeaderCom from "../../components/HeaderCom";
import { colors } from "../../styles/color";
import { nstyles } from "../../styles/styles";
import Utils from "../../app/Utils";
import { Images } from "../../images";
import { sizes, reText, reSize, fs } from "../../styles/size";
import apis from '../../apis';
import { ROOTGlobal } from "../../app/data/dataGlobal";
import { RootLang } from "../../app/data/locales";
import ListEmpty from '../../components/ListEmpty';
import moment from 'moment';
import { Picker } from "native-base";
import { listHSchat, TaoGroupChat } from "../../apis/chat";
import { ListLop, HocSinhList } from "../../apis/thanhtoan";
import styles from "../BaoBai/styles";
export default class ListChatGroup extends Component {
    constructor(props) {
        super(props);
        nthisApp = this;
        this.khoangcach = 18;
        this.IDGiaoVien = ROOTGlobal.dataUser.IdUser
        this.reloadData = Utils.ngetParam(this, 'reloadData', () => { })
        this.state = {
            date: "",
            tabNP: 0,
            namestudent: '',
            itemClick: [],
            listTruong: [],
            listLop: [],
            valuListTruong: ROOTGlobal.IdCN,
            valuListLop: '',
            listHS: [],
            newDate: new Date,
            nameGroup: ''
        };

    }
    componentDidMount() {
        this.DSLop();
    }
    DSLop = async () => {
        let res = await ListLop(this.state.valuListTruong)
        Utils.nlog('----------------------- ListLop', res)
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
    _getAllcontactlGroup = async (IdNhom) => {
        const res = await apis.Chat.AllcontactlGroup(ROOTGlobal.dataUser.IDKHDPS, false, IdNhom, ROOTGlobal.dataUser.IdUser);
        if (res.status == 1) {
            this.setState({
                listChatUser: res.data.GhiChuData, refreshing: false
            });
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Lớp không có học sinh để hiển thị', 'Đóng')
            this.setState({
                refreshing: false
            });
        };
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
    GetHocSinhList = async (valIdLop) => {
        var { valuListTruong } = this.state;
        this.state.listLop.findIndex(item => {
            if (item.IDNhomKH == valIdLop) this.lop = item.TenNhomKH
        });
        this.setState({ valuListLop: valIdLop });
        let res = await HocSinhList(valuListTruong, valIdLop)
        if (res.status == 1) {
            const listHS = res.data
            this.setState({ listHS, itemClick: [] })
        } else {
            this.setState({ listHS: [], itemClick: [] })
            Utils.showMsgBoxOK(this, 'Thông báo', 'Lớp không có học sinh')
        }
    }

    findNameGroupChat = (name) => {
    }

    _submit = async () => {
        if (this.state.nameGroup == '') {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Tên nhóm chat không được để trống')
            return;
        }
        if (this.state.itemClick.length == 0) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Chưa có học sinh nào được chọn')
        } else {
            let data = []
            for (let i = 0; i < this.state.listHS.length; i++) {
                for (let j = 0; j < this.state.itemClick.length; j++) {
                    if (i == this.state.itemClick[j]) {
                        let item = {
                            "IdUser": this.state.listHS[i].IDHocSinh,
                            "LoaiUser": 0
                        }
                        data.push(item)
                        break;
                    };
                };
            };
            let res = await TaoGroupChat(this.state.nameGroup, this.IDGiaoVien, ROOTGlobal.dataUser.IDKHDPS, ROOTGlobal.dataUser.IDChiNhanh, data, this.state.valuListLop)
            if (res.status == 1) {
                this.reloadData()
                Utils.showMsgBoxOK(this, 'Thông báo', 'Tạo nhóm chat thành công', 'Đóng', () => Utils.goback(this)
                )
            } else {
            }
        };
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
        const { nrow, nmiddle } = nstyles;
        return <View key={index} style={[nrow, { alignItems: 'center', paddingVertical: 10, paddingRight: this.khoangcach }]}>
            <View style={[nmiddle, { width: reSize(48), height: reSize(48), borderRadius: reSize(24), borderWidth: 1, borderColor: colors.veryLightPinkThree }]}>
                <Image style={{ width: reSize(47), height: reSize(47) }} source={item.GioiTinh == "Nam" ? Images.icBe2 : Images.icBe1} resizeMode='contain' />
            </View>
            <TouchableOpacity style={[nrow, { marginLeft: 15, flex: 1, alignItems: 'center', justifyContent: 'space-between' }]}
                onPress={this._clickItem(index)}>
                <View>
                    <Text style={[styles.text13, { fontWeight: 'bold' }]}>{item.HoTenMe}</Text>
                    <Text style={[styles.text12, { color: colors.colorGrayText, marginVertical: 3 }]}>HS {item.TenHocSinh}</Text>
                </View>
                <View
                    style={{ padding: 10 }}>
                    <View style={[nstyles.nIcon12, nmiddle, {
                        borderColor: 'green', borderWidth: 0.5, width: reSize(20), height: reSize(20),
                        borderRadius: 2, backgroundColor: this.state.itemClick.includes(index) ? 'green' : 'white'
                    }]}>
                        <Image source={Images.icCheckBlue} style={{ width: reSize(18), height: reSize(18), tintColor: colors.white }}
                            resizeMode='contain' />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    }
    render() {
        var { listChatUser, listHS, valuListLop, lopSelect, listLop } = this.state;
        const { nrow, nIcon20 } = nstyles;
        return (
            <View style={[nstyles.ncontainerX, { backgroundColor: colors.whitegay }]}>
                <HeaderCom
                    nthis={this}
                    titleText={"Tạo nhóm Chat"}
                    titleStyle={{ color: colors.white }}
                    onPressLeft={() => Utils.goback(this)}
                    tintColorLeft={colors.white}
                />
                <View style={[nstyles.nbody, { paddingHorizontal: 15 }]}>
                    <View style={{ backgroundColor: colors.white, borderRadius: 6, marginTop: 24, paddingHorizontal: this.khoangcach, paddingVertical: this.khoangcach }}>
                        <View style={nrow}>
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
                        <View style={{
                            paddingVertical: 10,
                            backgroundColor: colors.whitegay,
                            paddingHorizontal: 10,
                            borderRadius: 6,
                            marginTop: 10,
                        }}>
                            <TextInput
                                style={{ paddingVertical: 0 }}
                                underlineColorAndroid='transparent'
                                value={this.state.nameGroup}
                                returnKeyType={"next"}
                                autoCorrect={false}
                                placeholderTextColor={colors.dark_30}
                                placeholder={'Nhập tên nhóm'}
                                onChangeText={(tieude) => this.setState({ nameGroup: tieude })}
                            />
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
                            ListEmptyComponent={<ListEmpty textempty={'Không có dữ liệu'} />}
                            data={listHS}
                            renderItem={this._renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            ItemSeparatorComponent={this.renderSeparator}
                            extraData={listHS}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={this._submit}
                        style={[nstyles.shadow, { paddingVertical: 15, backgroundColor: '#2FBACF', marginVertical: 15, alignItems: 'center', borderRadius: 6 }]}>
                        <Text style={{ fontSize: fs(16), fontWeight: 'bold', color: colors.white }}>Tạo nhóm</Text>
                    </TouchableOpacity>
                </View>
            </View>

        )
    }
}
const stHocphi = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.whitegay,
        paddingHorizontal: 10, paddingVertical: 5,
        borderRadius: 6, marginTop: 10,
        flex: 1
    },
    stext: {
        fontSize: reText(13),
        fontWeight: '500'
    }
})