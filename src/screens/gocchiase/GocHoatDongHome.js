import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { colors, sizes } from '../../styles';
import { reSize, reText } from '../../styles/size';
import Utils from '../../app/Utils';
import { nstyles, Height } from '../../styles/styles';
import HeaderCom from '../../components/HeaderCom';
import { Images } from '../../images';
import { Picker } from 'native-base';
import { ListLop } from '../../apis/thanhtoan';
import { ROOTGlobal } from '../../app/data/dataGlobal';
import { HoatDong_List } from '../../apis/gocHoatDong';
import moment from 'moment';

export default class GocHoatDongHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listLop: [],
            valuListLop: 'Mam non',
            valuListTruong: ROOTGlobal.IdCN,
            classSelected: '',
            refreshing: true,
            listAction: [],
            sortFieldSelected: {
                id: 'NgayDang',
                value: 'Mới nhất'
            }
        };
        this.pageNumberListAction = 0;
        this.loadAllListAction = true;
        this.pageSizeListAction = 10;
        this.sortOrderAction = 'desc';
        this.sortField = [
            {
                id: 'NgayDang',
                value: 'Mới nhất'
            },
            {
                id: 'Tim',
                value: 'Lượt thích nhiều nhất'
            }
        ]
    }
    componentDidMount() {
        this.DSLop();
        // this.loadListAction();
    }
    DSLop = async () => {
        let res = await ListLop(this.state.valuListTruong)
        Utils.nlog('ListLop', res)
        if (res.status == 1) {
            listLop = res.data
            this.setState({ listLop: res.data, classSelected: res.data[0] });
            this.loadListAction(res.data[0].IDNhomKH, this.state.sortFieldSelected)
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', res.error.message)
        }
    }
    GetHocSinhList = async (valIdLop) => {
        var { valuListTruong } = this.state;
        this.state.listLop.findIndex(item => {
            if (item.IDNhomKH == valIdLop)
                this.setState({ classSelected: item });
            // this.lop = item.TenNhomKH
        });
        // let res = await HocSinhList(valuListTruong, valIdLop)
        // Utils.nlog('GetHocSinhList', res)
        // if (res.status == 1) {
        //     let listChild = []
        //     for (let i = 0; i < res.data.length; i++) {
        //         let objChild = {
        //             IDHocSinh: '',
        //             TenHocSinh: '',
        //             XepLoai: '',
        //             GhiChu: ''
        //         }
        //         objChild.IDHocSinh = res.data[i].IDHocSinh
        //         objChild.TenHocSinh = res.data[i].TenHocSinh
        //         objChild.XepLoai = 0
        //         listChild.push(objChild);
        // }
        //     this.setState({ listChild: listChild })
        // else {
        //     this.setState({ listChild: [] })
        //     Utils.showMsgBoxOK(this, 'Thông báo', res.error.message)
        // }
    }
    loadListAction = async (classSelect, sortFieldSelected = this.state.sortFieldSelected) => {
        this.setState({ refreshing: true })
        // Utils.nlog('HoatDong_List  loadListAction----------------------------', this.state.sortFieldSelected)
        let res = await HoatDong_List(this.loadAllListAction, this.pageNumberListAction, this.pageSizeListAction, this.sortOrderAction, sortFieldSelected.id, classSelect)
        // Utils.nlog('HoatDong_List', classSelect, res)
        if (res.status == 1) {
            // Utils.nlog('listAction ----------------------------', res.data)
            listAction = res.data
        } else {
            listAction = []
            Utils.showMsgBoxOK(this, 'Thông báo', 'Không có bài đăng để hiển thị', 'Đóng')
        }
        this.setState({ listAction, refreshing: false })
    }
    _onRefresh = () => {
        this.setState({ refreshing: true }, () => this.loadListAction(this.state.classSelected.IDNhomKH));
    }
    selectOptionAction = (value) => {
        Utils.nlog('valu--------------value ', value)
        this.sortField.findIndex(item => {
            if (item.id == value) {
                Utils.nlog('valu-------------- if', item)
                this.setState({ sortFieldSelected: item });
                this.loadListAction(this.state.classSelected.IDNhomKH, item)
            }
        });

    }
    selectClass = (value) => {
        this.state.listLop.findIndex(item => {
            if (item.IDNhomKH == value) {
                this.setState({ classSelected: item });
                this.loadListAction(value);
            }
        });
    }
    _renderItem = ({ item, index }) => {
        return (
            <View>
                <TouchableOpacity onPress={() => Utils.goscreen(this, 'sc_ChiTietGocHoatDong', { actionDetail: item, _onRefresh: this._onRefresh })} style={[nstyles.nrow, { paddingVertical: 14, paddingHorizontal: 10, backgroundColor: 'white', alignItems: 'center', justifyContent: 'space-between' }]}>
                    <View style={[nstyles.nmiddle, { width: sizes.reSize(48), height: sizes.reSize(48), borderRadius: sizes.reSize(24), borderWidth: 1, borderColor: colors.veryLightPinkThree }]}>
                        <Image style={{ width: sizes.reSize(47), height: sizes.reSize(47) }} source={Images.icGocHD} resizeMode='contain' />
                    </View>
                    <View style={{ flexDirection: 'column', flex: 1 }}>
                        <View style={{ flex: 1, paddingHorizontal: 7 }}>
                            <Text numberOfLines={2} style={{ fontWeight: 'bold', fontSize: sizes.fs(15) }}>{item.TieuDe}</Text>
                        </View>
                        <View style={[nstyles.nrow, { flex: 1, paddingHorizontal: 7, paddingTop: 7 }]}>
                            <Text numberOfLines={3} style={{ fontSize: sizes.fs(14), flex: 1, fontStyle: 'italic' }}>{item.NoiDung}</Text>
                        </View>
                        <View style={[nstyles.nrow, { flex: 1, paddingHorizontal: 7, paddingTop: 7 }]}>
                            <Text numberOfLines={1} style={{ fontSize: sizes.fs(10), flex: 1, fontStyle: 'italic', color: colors.black_80 }}>
                                {moment(item.NgayDang, 'MM/DD/YYYY hh:mm:ss A').format("DD/MM/YYYY HH:mm")}
                            </Text>
                        </View>
                    </View>
                    <View style={nstyles.nrow}>
                        <Image source={Images.icLikeGocHD} resizeMode='contain' />
                        <Text style={{ fontSize: sizes.fs(14), marginLeft: 5 }}>{item.Tim > 0 ? item.Tim : 0}</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ height: 1, backgroundColor: '#b8b8b8', marginLeft: 85, opacity: 0.4 }} />
            </View >
        )
    }

    render() {
        var { listLop, listAction, sortFieldSelected, classSelected } = this.state
        Utils.nlog('sortFieldSelected', sortFieldSelected)
        return (
            <View style={nstyles.ncontainerX}>
                <HeaderCom
                    nthis={this}
                    iconLeft={Images.icBackBlue}
                    titleText={'Góc hoạt động'} />
                <View style={[nstyles.nbody, { backgroundColor: colors.whitegay, marginTop: 15, marginHorizontal: 20, borderRadius: 4 }]}>
                    <View style={[nstyles.nrow, { backgroundColor: 'white', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 6 }]}>
                        <TouchableOpacity style={[nstyles.nrow, stHoctap.container]}>
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
                                    textStyle={{ fontWeight: 'bold', fontSize: 13 }}
                                    selectedValue={classSelected.IDNhomKH}
                                    onValueChange={(val) => {
                                        this.selectClass(val);
                                    }}>
                                    {listLop.map((item, index) =>
                                        <Picker.Item key={index} label={item.TenNhomKH} value={item.IDNhomKH} />
                                    )}
                                </Picker>
                            </View>
                            {/* {Platform.OS == 'ios' ?
                                <View style={{ position: 'absolute', right: 5, top: 0, bottom: 0, justifyContent: 'center' }}>
                                    <Image source={Images.icDown} resizeMode='contain' style={[nstyles.nIcon20, { tintColor: '#A3A3A3' }]} />
                                </View>

                                : null
                            } */}
                        </TouchableOpacity>
                    </View>
                    <View style={[nstyles.nrow, { backgroundColor: 'white', paddingHorizontal: 20, paddingBottom: 20 }]}>
                        <View style={[nstyles.nrow, stHoctap.container]}>
                            <View style={{ flex: 1, }}>
                                {Platform.OS == 'ios' ?
                                    <View style={{ position: 'absolute', right: 5, top: 0, bottom: 0, justifyContent: 'center' }}>
                                        <Image source={Images.icDown} resizeMode='contain' style={[nstyles.nIcon20, { tintColor: '#A3A3A3' }]} />
                                    </View>
                                    : null
                                }
                                <Picker
                                    mode="dropdown"
                                    // placeholder={sortFieldSelected.value}
                                    style={{ width: '100%', height: 30 }}
                                    textStyle={{ fontWeight: 'bold', fontSize: 13 }}
                                    selectedValue={sortFieldSelected.id}
                                    onValueChange={(val) => {
                                        this.selectOptionAction(val);
                                    }}>
                                    {this.sortField.map((item, index) =>
                                        <Picker.Item key={index} label={item.value} value={item.id} />
                                    )}
                                </Picker>
                            </View>

                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => Utils.goscreen(this, 'Modal_AddGocHoatDong', { classSelected: this.state.classSelected, _onRefresh: this._onRefresh })}
                        style={[nstyles.nrow, { backgroundColor: 'white', paddingVertical: 15, alignItems: 'center', marginVertical: 10, borderRadius: 4, justifyContent: 'center' }]}>
                        <Text style={{ fontWeight: 'bold', fontSize: 13, color: '#00b096' }}>
                            Thêm hoạt động
                        </Text>
                    </TouchableOpacity>
                    <FlatList
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                        showsVerticalScrollIndicator={false}
                        data={listAction}
                        renderItem={this._renderItem}
                        extraData={this.state}
                    />
                </View>
            </View>
        );
    }
}
const stHoctap = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.whitegay,
        padding: 5,
        flex: 1, borderRadius: 4
    },
    stext: {
        fontSize: sizes.reText(13),
        fontWeight: '500'
    },
    containText: {
        backgroundColor: colors.whitegay,
        alignSelf: 'flex-start',
        padding: 5,
        borderRadius: 3,
        paddingHorizontal: 10
    }
})

const styles = StyleSheet.create({
    textNameStudent1: {
        marginTop: 15,
        color: colors.blackShadow,
        fontSize: reText(12),
        textAlign: 'center',
        // paddingHorizontal: 15,
        marginBottom: 10,
        flex: 1,
        width: 100
    },
    viewItemStudent1: {
        // width: '33%',
        flex: 1,
        alignItems: 'center',
        // backgroundColor: 'white'
    },
    body: {
        ...nstyles.nbody,
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10
    },
    viewTitle: {
        backgroundColor: colors.white,
        paddingTop: 21,
        paddingHorizontal: 25,
        paddingRight: 26,
    },
    viewStudents: {
        backgroundColor: colors.white,
    },
    textThuNgayThang: {
        color: colors.blackShadow,
        fontSize: reText(16),
        fontWeight: '500',
        textAlign: 'center'
    },
    textThuNgayThang1: {
        color: colors.blackShadow,
        fontSize: reText(20),
        fontWeight: '500',
        textAlign: 'center'
    },
    textSubtitle: {
        marginTop: 4,
        color: colors.grey,
        fontSize: reText(12),
        textAlign: 'center'
    },
    viewTime: {
        flex: 1,
        backgroundColor: colors.white,
        borderColor: colors.veryLightPinkFour,
        borderWidth: 0.2,
        borderRadius: 3,
        padding: 9,
        paddingTop: 7,
    },
    viewTotalStudents: {
        ...nstyles.nrow,
        marginTop: 12,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    switchEnoughAllStudents: {
        ...Platform.select({
            ios: {
                transform: [
                    { scaleX: .8 },
                    { scaleY: .8 }
                ],
            },

        }),
        marginLeft: 10
    },
    viewItemStudent: {
        // width: '33%',
        flex: 1,
        alignItems: 'center',
        // backgroundColor: 'white'
    },
    viewSelectStudent: {
        ...nstyles.nIcon32,
        marginTop: 22,
        borderRadius: 5,
        borderWidth: 3,
        borderColor: colors.mediumGreen
    },
    textNameStudent: {
        marginTop: 15,
        color: colors.blackShadow,
        fontSize: reText(12),
        textAlign: 'center',
        paddingHorizontal: 15,
        marginBottom: 10,
        flex: 1,
        width: 100


    },
    stext: {
        fontSize: sizes.reText(13),
        fontWeight: '500'
    },

})
