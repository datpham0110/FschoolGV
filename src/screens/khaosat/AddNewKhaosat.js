import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { Dimensions } from 'react-native';
import { colors, sizes } from '../../styles';
import ListEmpty from "../../components/ListEmpty";
import { appConfig } from '../../app/Config';
import { reSize, reText } from '../../styles/size';
import Utils from '../../app/Utils';
import { nstyles, Height } from '../../styles/styles';
import { nGlobalKeys } from '../../app/keys/globalKey';
import { notification } from '../../apis/notifycation';
import HeaderCom from '../../components/HeaderCom';
import { Images } from '../../images';
import { Picker } from 'native-base';
import { MonHocList } from '../../apis/danhmuc';
import { ROOTGlobal } from '../../app/data/dataGlobal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ButtonCom from '../../components/Button/ButtonCom';
import Moment from "moment";

import { ScrollView } from 'react-native-gesture-handler';
import { ListLop } from '../../apis/thanhtoan';
import DatePick from '../../components/DatePick';
import { KhaoSat_Create } from '../../apis/apiKhaosat';
const { width } = Dimensions.get('window');

class AddNewKhaosat extends Component {
    constructor(props) {
        super(props);
        this.index = 0;
        this.onRefresh = Utils.ngetParam(this, '_onRefresh', () => { })
        this.actionDetail = Utils.ngetParam(this, 'actionDetail')
        this.state = {
            data: [],
            mes: '',
            valuListLop: 'Mam non',
            classSelected: '',
            listLop: [],
            textTitle: '',
            valuListTruong: ROOTGlobal.IdCN,
            _dateFr: new Date,
            _dateTo: new Date,
            refreshing: true,
            listCauHoi: [],
            isLoading: false,
        };
        this.addCauHoi = this.addCauHoi.bind(this);
    }
    componentDidMount() {
        this.DSLop()
    }
    DSLop = async () => {
        let res = await ListLop(this.state.valuListTruong)
        Utils.nlog('ListLop', res)
        if (res.status == 1) {
            listLop = res.data
            this.setState({ listLop: res.data, classSelected: res.data[0] });
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', res.error.message)
        }
    }
    _post = async () => {
        var { anser, textTitle, _dateFr, _dateTo, textContent, classSelected, listCauHoi } = this.state
        _dateFr = Moment(new Date(_dateFr)).format('MM/DD/YYYY');
        _dateTo = Moment(new Date(_dateTo)).format('MM/DD/YYYY');
        if (textTitle.length == 0) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Vui lòng thêm tiêu đề')
            return;
        }
        if (listCauHoi.length == 0) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Vui lòng thêm câu hỏi')
            return;
        }
        this.setState({ isLoading: true });
        let res = await KhaoSat_Create(classSelected.IDNhomKH, _dateFr, _dateTo, textTitle, listCauHoi)
        Utils.nlog('KhaoSat_Create', classSelected.IDNhomKH, _dateFr, _dateTo, textTitle, listCauHoi, res)
        if (res.status == 1) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Đăng khảo sát mới thành công', 'Đóng', () => this._handleOK())
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', res.error.message, 'Đóng')
        }
        this.setState({ isLoading: false });
    }
    _handleOK = () => {
        this.onRefresh()
        Utils.goback(this)
    }

    GetHocSinhList = async (valIdLop) => {
        var { valuListTruong } = this.state;
        this.state.listLop.findIndex(item => {
            if (item.IDNhomKH == valIdLop)
                this.setState({ classSelected: item });
        });

    }

    selectOptionAction = (value) => {
        this.sortField.findIndex(item => {
            if (item.id == value) {
                this.setState({ sortFieldSelected: item });

            }
        });
    }
    selectClass = (value) => {
        this.state.listLop.findIndex(item => {
            if (item.IDNhomKH == value) {
                this.setState({ classSelected: item });
            }
        });
    }
    _callBackFunction = (datatest) => {
        if (this.state.listCauHoi.length > 0) {
            const listCauHoi = this.state.listCauHoi.concat(datatest)
            this.setState({ listCauHoi })
        } else {
            this.setState({ listCauHoi: datatest })
        }
    }
    renderItem = ({ item, index }) => {
        return (
            <View style={{ marginLeft: 7, padding: 5, flex: 1 }}>
                <Text style={{ fontSize: sizes.fs(14), fontWeight: '500', paddingBottom: 10, alignSelf: 'flex-end', fontStyle: 'italic', color: item.loai == 1 ? '#84D3A5' : '#2FBACF' }}>
                    {item.loai == 1 ? '*Câu hỏi Đồng ý/Không đồng ý' : '*Câu hỏi đánh giá sao'}
                </Text>
                <Text style={{ fontSize: sizes.fs(14), fontWeight: 'bold', paddingBottom: 10 }}>
                    {item.noidung}
                </Text>
                <View style={{ backgroundColor: '#A3A3A3', height: 1 }} />
            </View>
        )
    }
    renderItemImg = ({ item, index }) => {
        return (
            <Image source={{ uri: appConfig.domain + item }}
                style={{ width: sizes.sizes.nImgSize90, height: sizes.sizes.nImgSize58, margin: 5, borderRadius: 4 }} />
        );
    }
    addCauHoi() {
        Utils.goscreen(this, 'Modal_AddCauhoiNew', {
            callBack: this._callBackFunction,
        })
    }

    render() {
        var { data, textTitle, _dateFr, _dateTo, classSelected } = this.state
        Utils.nlog('callback', this.state.listCauHoi)
        return (
            <View style={nstyles.ncontainerX}>
                <HeaderCom
                    nthis={this}
                    iconLeft={Images.icBackBlue}
                    titleText={'KHẢO SÁT '}
                />
                <ScrollView showsVerticalScrollIndicator={false}
                    style={[nstyles.nbody, { backgroundColor: colors.whitegay, marginTop: 15, marginHorizontal: 21, borderRadius: 4 }]}>
                    <Text style={{ color: '#29a9e0', fontSize: sizes.fs(18), fontWeight: 'bold', textAlign: 'center', marginBottom: 16 }}>
                        KHẢO SÁT MỚI
                    </Text>
                    <View style={{ borderWidth: 1, borderColor: colors.black_20, borderRadius: 6, backgroundColor: 'white', padding: 5 }}>
                        <TextInput
                            placeholder={'Nhập tiêu đề'}
                            placeholderTextColor="#29a9e0"
                            multiline={true}
                            style={{ flex: 1, textAlignVertical: 'top', minHeight: 50, padding: 10 }}
                            onChangeText={(textTitle) => this.setState({ textTitle })}
                            value={textTitle}
                        />
                    </View>

                    <View style={[nstyles.nrow, { backgroundColor: 'white', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 6, marginTop: 10, alignItems: 'center' }]}>
                        <Text style={{ fontSize: sizes.fs(14), fontWeight: '500', color: '#A3A3A3', marginRight: 5 }}>Chọn lớp: </Text>
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
                                    selectedValue={this.state.classSelected.IDNhomKH}
                                    onValueChange={(val) => {
                                        this.selectClass(val);
                                    }}>
                                    {listLop.map((item, index) =>
                                        <Picker.Item key={index} label={item.TenNhomKH} value={item.IDNhomKH} />
                                    )}
                                </Picker>
                            </View>

                        </View>
                    </View>
                    <View style={[nstyles.nrow, { backgroundColor: 'white', paddingHorizontal: 20, paddingBottom: 6 }]}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: sizes.fs(14), color: '#A3A3A3', fontWeight: '500', marginVertical: 5 }}>{'Bắt đầu'}</Text>
                            <View style={[nstyles.nrow, stHoctap.container]}>
                                <View style={{ flex: 1 }}>
                                    <DatePick
                                        value={this.state._dateFr}
                                        ref={refs => this.datePickFr = refs}
                                        style={{ fontSize: 12, fontWeight: '600' }}
                                        activeOpacity={0.9}
                                        onValueChange={(val) => {
                                            if (this.state._dateTo < val) {
                                                Utils.showMsgBoxOK(this, ' Thông báo', 'Ngày bắt đầu không được lớn hơn ngày kết thúc', 'Đóng')
                                            } else {
                                                this.setState({ _dateFr: val });
                                            }
                                        }}
                                        format='DD/MM/YYYY'
                                    />
                                </View>
                                <Image source={Images.icCalendar} resizeMode='contain' style={[nstyles.nIcon12, { tintColor: '#A3A3A3' }]} />
                            </View>
                        </View>
                        <View style={{ width: 10 }} />
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: sizes.fs(14), color: '#A3A3A3', fontWeight: '500', marginVertical: 5 }}>{'Kết thúc'}</Text>
                            <View style={[nstyles.nrow, stHoctap.container]}>
                                <View style={{ flex: 1 }}>
                                    <DatePick
                                        value={this.state._dateTo}
                                        ref={refs => this.datePickTo = refs}
                                        style={{ fontSize: 12, fontWeight: '600' }}
                                        activeOpacity={0.9}
                                        onValueChange={(val) => {
                                            if (val < this.state._dateFr) {
                                                Utils.showMsgBoxOK(this, ' Thông báo', 'Ngày bắt đầu không được lớn hơn ngày kết thúc', 'Đóng')
                                            } else {
                                                this.setState({ _dateTo: val });
                                            }
                                        }}
                                        format='DD/MM/YYYY'
                                    />
                                </View>
                                <Image source={Images.icCalendar} resizeMode='contain' style={[nstyles.nIcon12, { tintColor: '#A3A3A3' }]} />
                            </View>
                        </View>
                    </View>
                    <View style={{ backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 6, marginVertical: 13 }}>
                        <FlatList
                            ListEmptyComponent={<ListEmpty textempty={'Không có dữ liệu'} />}
                            data={this.state.listCauHoi}
                            renderItem={this.renderItem}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                </ScrollView>
                <TouchableOpacity
                    onPress={this.addCauHoi}
                    style={[nstyles.nrow, { backgroundColor: 'white', paddingVertical: 15, alignItems: 'center', marginVertical: 10, borderRadius: 4, justifyContent: 'center' }]}>
                    <Text style={{ fontWeight: 'bold', fontSize: 13, color: '#00b096' }}>
                        Thêm câu hỏi
                        </Text>
                </TouchableOpacity>
                <View style={[nstyles.nrow, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ButtonCom
                        onPress={() => Utils.goback(this)}
                        text={"Huỷ"}
                        txtStyle={{ color: '#00b096' }}
                        style={{ paddingHorizontal: 50, marginTop: 10, marginBottom: 25, borderColor: '#00b096', borderWidth: 1 }} />
                    <View style={{ width: 20 }} />
                    <ButtonCom
                        onPress={this._post}
                        text={"Hoàn tất"}
                        txtStyle={{ color: 'white' }}
                        style={{ paddingHorizontal: 30, backgroundColor: '#00b096', marginTop: 10, marginBottom: 25 }} />
                </View>
                {this.state.isLoading ? <View style={[nstyles.nmiddle, { position: 'absolute', width: '100%', height: '100%', backgroundColor: colors.black_20 }]}>
                    <ActivityIndicator color={colors.white} size='large' />
                </View> : null}
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
    nicon2: {
        resizeMode: "contain",
        height: 30,
        width: 30,
        marginLeft: 10
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

const mapStateToProps = state => ({
    infoUser: state.infoUser
});

export default Utils.connectRedux(AddNewKhaosat, mapStateToProps, true);