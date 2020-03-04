import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { Dimensions } from 'react-native';
import { colors, sizes } from '../../styles';
import ListEmpty from "../../components/ListEmpty";
import moment from "moment";

import { reSize, reText } from '../../styles/size';
import Utils from '../../app/Utils';
import { nstyles, Height } from '../../styles/styles';
import HeaderCom from '../../components/HeaderCom';
import { Images } from '../../images';
import { Picker } from 'native-base';
import { ListLop, HocSinhList } from '../../apis/thanhtoan';
import { ROOTGlobal } from '../../app/data/dataGlobal';

import { KhaoSat_List } from '../../apis/apiKhaosat';
const { width } = Dimensions.get('window');

const dangtienhanh = 1, daxong = 2, tatca = 0, chuatienhanh = 3
export default class KhaoSatHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listLop: [],
            valuListLop: 'Mam non',
            valuListTruong: ROOTGlobal.IdCN,
            classSelected: '',
            listAction: [],
            tinhtrangSelect: tatca,
            sortField: '',
            refreshing: true,
        };
        this.pageNumberListAction = 0;
        this.loadAllListAction = true;
        this.pageSizeListAction = 10;
        this.sortOrderAction = 'desc';
    }
    componentDidMount() {
        this.DSLop();
    }
    DSLop = async () => {
        let res = await ListLop(this.state.valuListTruong)
        Utils.nlog('ListLop', res)
        if (res.status == 1) {
            listLop = res.data
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', res.error.message)
        }
        this.setState({ listLop, classSelected: res.data[0].IDNhomKH });
        this.loadListAction()
    }
    loadListAction = async () => {
        var { tinhtrangSelect, classSelected } = this.state
        let res = await KhaoSat_List(this.loadAllListAction, this.pageNumberListAction, this.pageSizeListAction, this.sortOrderAction, this.state.sortField, classSelected, tinhtrangSelect)
        Utils.nlog('HoatDong_List', tinhtrangSelect, classSelected, res)
        if (res.status == 1) {
            listAction = res.data
        } else {
            listAction = [];
            Utils.showMsgBoxOK(this, 'Thông báo', 'Không có bài đăng để hiển thị', 'Đóng')

        }
        this.setState({ listAction, refreshing: false })

    }
    _onRefresh = () => {
        this.setState({ refreshing: true }, () => this.loadListAction());
    }

    _renderItem = ({ item, index }) => {
        Utils.nlog('------------ item', item)
        var { tinhtrangSelect } = this.state
        return (
            <View>
                <TouchableOpacity onPress={() => Utils.goscreen(this, 'sc_ChiTietKhaoSat', { actionDetail: item })}
                    style={{ paddingVertical: 14, paddingHorizontal: 18, backgroundColor: 'white' }}>
                    <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                        <Text style={{ fontSize: sizes.fs(16), fontWeight: 'bold', textAlign: 'left' }}>{item.TieuDe}</Text>
                    </View>
                    <View style={[nstyles.nrow, { justifyContent: 'space-between', paddingTop: 15 }]}>
                        <Text style={{ fontSize: sizes.fs(14), fontStyle: 'italic', flex: 1 }}>{moment(item.NgayTao).format('DD/MM/YYYY HH:mm')}</Text>
                        <Text style={{ fontSize: sizes.fs(14), color: item.TrangThai == 2 ? '#29AAE1' : item.TrangThai == 1 ? '#f5911e' : '#84D3A5' }}>{item.TrangThai == 2 ? 'Đã xong' : item.TrangThai == 1 ? 'Đang tiến hành' : 'Chưa tiến hành'}</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ height: 1, backgroundColor: '#b8b8b8', marginHorizontal: 18, opacity: 0.4 }} />
            </View>
        )
    }

    render() {
        var { listLop, listAction, tinhtrangSelect, classSelected } = this.state
        return (
            <View style={nstyles.ncontainerX}>
                <HeaderCom
                    nthis={this}
                    iconLeft={Images.icBackBlue}
                    titleText={'Danh sách khảo sát'} />
                <View style={[nstyles.nbody, { backgroundColor: colors.whitegay, marginTop: 15, marginHorizontal: 20, borderRadius: 4 }]}>
                    <View style={[nstyles.nrow, { backgroundColor: 'white', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 6 }]}>
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
                                    placeholder={'Chọn lớp'}
                                    style={{ width: '100%', height: 30 }}
                                    textStyle={{ fontWeight: 'bold', fontSize: 13 }}
                                    selectedValue={classSelected}
                                    onValueChange={(val) => {
                                        this.setState({ classSelected: val }, () => this._onRefresh())
                                    }}>
                                    {listLop.map((item, index) =>
                                        <Picker.Item key={index} label={item.TenNhomKH} value={item.IDNhomKH} />
                                    )}
                                </Picker>
                            </View>
                        </View>
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
                                    placeholder={'Chọn tính trạng'}
                                    style={{ width: '100%', height: 30 }}
                                    textStyle={{ fontWeight: 'bold', fontSize: 13 }}
                                    selectedValue={tinhtrangSelect}
                                    onValueChange={(val) => {
                                        this.setState({ tinhtrangSelect: val }, () => this._onRefresh());

                                    }}>
                                    <Picker.Item label={'Tất cả'} value={tatca} />
                                    <Picker.Item label={'Đang tiến hành'} value={dangtienhanh} />
                                    <Picker.Item label={'Chưa tiến hành'} value={chuatienhanh} />
                                    <Picker.Item label={'Đã xong'} value={daxong} />
                                    {/* {this.sortField.map((item, index) =>
                                        <Picker.Item key={index} label={item.value} value={item.id} />
                                    )} */}
                                </Picker>
                            </View>

                        </View>
                    </View>
                    <TouchableOpacity onPress={() => { Utils.goscreen(this, 'sc_AddNewKhaosat', { _onRefresh: this._onRefresh }) }}
                        style={[nstyles.nrow, { backgroundColor: 'white', paddingVertical: 15, alignItems: 'center', marginVertical: 10, borderRadius: 4, justifyContent: 'center' }]}>
                        <Text style={{ fontWeight: 'bold', fontSize: 13, color: '#00b096' }}>
                            Thêm khảo sát
                        </Text>
                    </TouchableOpacity>
                    <FlatList
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                        showsVerticalScrollIndicator={false}
                        data={listAction}
                        renderItem={this._renderItem}
                        extraData={this.state}
                        keyExtractor={(item, index) => index.toString()}
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
