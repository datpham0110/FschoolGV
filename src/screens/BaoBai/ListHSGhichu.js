import React, { Component } from "react";
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import Utils from "../../app/Utils";
import { colors, sizes, nstyles } from "../../styles";
import HeaderCom from "../../components/HeaderCom";
import { Images } from "../../images/index";
import ButtonCom from "../../components/Button/ButtonCom";
import styles from './styles';
import { ListLop, HocSinhList } from "../../apis/thanhtoan";
import ListEmpty from "../../components/ListEmpty";
import { ROOTGlobal } from "../../app/data/dataGlobal";

export default class ListHSGhichu extends Component {
    constructor(props) {
        super(props);
        this.DSlistBB = Utils.ngetParam(this, 'DSlistBB', {})
        listChild = Utils.ngetParam(this, 'listChild'),
            nthis = this;
        this.khoangcach = 18;
        this.clickAll = false;
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
        };
    }

    componentDidMount() {
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        this.setState({ date: "T" + month + "/" + year });
        this.DSLop();
    }

    DSLop = async () => {
        var { valuListTruong } = this.state
        // Utils.nlog('listTruong', valuListTruong)
        let res = await ListLop(valuListTruong)
        // Utils.nlog('DSLop', res)
        if (res.status == 1) {
            listLop = res.data
            this.setState({ listLop }, () => {
                if (listLop.length != 0) {
                    let tempId = listLop[0].IDNhomKH;
                    this.GetHocSinhList(tempId)
                };
            });
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', res.error.message)
        }
    }
    GetHocSinhList = async (valIdLop) => {
        var { valuListTruong } = this.state;
        this.setState({ valuListLop: valIdLop });
        let res = await HocSinhList(valuListTruong, valIdLop)
        // Utils.nlog('GetHocSinhList', res)
        if (res.status == 1) {
            listHS = res.data
            this.setState({ listHS })
        } else {
            this.setState({ listHS: [] })
            Utils.showMsgBoxOK(this, 'Thông báo', res.error.message)
        }
    }
    
    _clickItem = (id) => {
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
                onPress={() => this._clickItem(index)}>
                <View style={{}}>
                    <Text style={[styles.text13, { fontWeight: 'bold' }]}>{item.HoTenMe}</Text>
                    <Text style={[styles.text12, { color: colors.colorGrayText, marginVertical: 3 }]}>HS {item.TenHocSinh}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => this._clickItem(index)}
                    style={{ padding: 10 }}>
                    <View style={[nstyles.nstyles.nIcon12, nmiddle, {
                        borderColor: 'green', borderWidth: 0.5,
                        borderRadius: 2, backgroundColor: this.state.itemClick.includes(index) ? 'green' : 'white'
                    }]}>
                        <Image source={Images.icCheckBlue} style={{ width: sizes.reSize(10), height: sizes.reSize(10), tintColor: colors.white }}
                            resizeMode='contain' />
                    </View>
                </TouchableOpacity>
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
        Utils.nlog('itemClick', itemClick)
        this.setState({ itemClick });
    }

    _submit = () => {
        if (this.state.itemClick.length == 0) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Chưa có học sinh nào được chọn')
        } else {
            let data = []
            for (let i = 0; i < this.state.listHS.length; i++) {
                for (let j = 0; j < this.state.itemClick.length; j++) {
                    if (i == this.state.itemClick[j]) {
                        data.push(this.state.listHS[i].IDHocSinh)
                        break;
                    }
                }
            }
            Utils.goscreen(this, 'Modal_ModalghichuBB', { listChildGC: data, listChild: listChild, DSlistBB: this.DSlistBB });
        }
    }


    render() {
        var { listHS } = this.state
        Utils.nlog('listChild', this.DSlistBB, listChild)
        const { nrow, nIcon20 } = nstyles.nstyles;
        return (
            <View style={[nstyles.nstyles.ncontainerX, { backgroundColor: colors.whitegay }]}>
                <HeaderCom
                    nthis={this}
                    iconLeft={Images.icBackBlue}
                    titleText={"Báo bài"}
                    titleStyle={{ color: colors.white, fontSize: sizes.reText(18) }}
                />
                {/* //body------- */}
                <View style={[nstyles.nstyles.nbody, { paddingHorizontal: 15 }]}>
                    <View style={{ backgroundColor: colors.white, borderRadius: 6, marginTop: 15, flex: 1, paddingLeft: 30 }}>
                        <View style={nrow}>

                            {this.state.listHS.length == 0 ? null :
                                <View style={[nrow, {
                                    borderBottomColor: colors.veryLightPinkThree, borderBottomWidth: 1, flex: 1,
                                    paddingVertical: 10, marginTop: 20, justifyContent: 'space-between', marginHorizontal: 15
                                }]}>
                                    <Text style={[styles.text13, { fontStyle: 'italic' }]}>Chọn để gửi ghi chú</Text>
                                    <Text onPress={this._clickAll} style={styles.text13}> Chọn tất cả</Text>
                                </View>
                            }

                        </View>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={<ListEmpty textempty={'Không có dữ liệu'} />}
                            data={listChild}
                            renderItem={this._renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            ItemSeparatorComponent={this.renderSeparator}
                            extraData={listHS}
                        />
                    </View>
                    <View style={[nrow, { height: nstyles.Height(8), justifyContent: 'center' }]}>
                        <ButtonCom
                            colorChange={[colors.lightSalmon, colors.salmonTwo]}
                            onPress={this._submit}
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