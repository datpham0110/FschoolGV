import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { Dimensions } from 'react-native';
import { colors, sizes } from '../../styles';
import ListEmpty from "../../components/ListEmpty";

import { reSize, reText } from '../../styles/size';
import Utils from '../../app/Utils';
import { nstyles, Height } from '../../styles/styles';
import { nGlobalKeys } from '../../app/keys/globalKey';
import { notification } from '../../apis/notifycation';
import HeaderCom from '../../components/HeaderCom';
import { Images } from '../../images';
import { Picker } from 'native-base';
import { MonHocList } from '../../apis/danhmuc';
import DatePick from '../../components/DatePick';
import { ListLop, HocSinhList } from '../../apis/thanhtoan';
import { ROOTGlobal } from '../../app/data/dataGlobal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ButtonCom from '../../components/Button/ButtonCom';
import { HoatDong_Create } from '../../apis/gocHoatDong';
import Moment from "moment";

import { ScrollView } from 'react-native-gesture-handler';
import { KhaoSat_Create, KhaoSat_Update } from '../../apis/apiKhaosat';
const { width, height } = Dimensions.get('window');

const yesno = 1, check = 2
class AddKhaoSat extends Component {
    constructor(props) {
        super(props);
        this.onRefresh = Utils.ngetParam(this, '_onRefresh', () => { })
        this.state = {
            anser: yesno,
            textGChu: '',
            textTitle: '',
            textContent: '',
            image: []
        };
        this.actionDetail = Utils.ngetParam(this, 'actionDetail')
        this.classSelected = Utils.ngetParam(this, "classSelected")
        this._dateTo = Utils.ngetParam(this, '_dateTo')
        this._dateFr = Utils.ngetParam(this, '_dateFr')
    }
    componentDidMount() {
        Utils.nlog('classSelected', this.classSelected)
    }


    _post = async () => {
        var { anser, textContent } = this.state
        var _dateFr = Moment(new Date(this._dateFr)).format('MM/DD/YYYY');
        var _dateTo = Moment(new Date(this._dateTo)).format('MM/DD/YYYY');
        if (textContent.trim().length == 0) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Nội dung không được để trống', 'Đóng')
        }
        Utils.nlog(this.actionDetail, textContent, anser)
        let res = await KhaoSat_Update(this.actionDetail.IDRow, textContent, anser)
        if (res.status == 1) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Thêm câu hỏi thành công', 'Đóng', () => this._handleOK())
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', res.error.message, 'Đóng')

        }

    }
    _handleOK = () => {
        this.onRefresh()
        Utils.goback(this)
    }
    render() {
        const { infoUser } = this.props;
        var { listLop, textContent, anser } = this.state
        Utils.nlog(this.actionDetail, textContent, anser)
        return (
            <View style={nstyles.ncontainerX}>
                <HeaderCom
                    nthis={this}
                    iconLeft={Images.icBackBlue}
                    titleText={'Câu hỏi mới'}
                />
                <KeyboardAwareScrollView >
                    <ScrollView showsVerticalScrollIndicator={false}
                        style={[nstyles.nbody, { backgroundColor: colors.whitegay, marginTop: 15, marginHorizontal: 20, borderRadius: 4 }]}>
                        <View style={{ backgroundColor: 'white', padding: 20 }}>
                            <Text style={{ color: '#a5a7aa', fontSize: sizes.fs(14), fontWeight: 'bold', paddingBottom: 5 }}>
                                Loại câu hỏi
                            </Text>
                            <View style={[nstyles.nrow, stHoctap.container]}>
                                <View style={{ flex: 1 }}>
                                    {Platform.OS == 'ios' ?
                                        <View style={{ position: 'absolute', right: 5, top: 0, bottom: 0, justifyContent: 'center' }}>
                                            <Image source={Images.icDown} resizeMode='contain' style={[nstyles.nIcon20, { tintColor: '#A3A3A3' }]} />
                                        </View>
                                        : null
                                    }
                                    <Picker
                                        mode="dropdown"
                                        placeholder={'Câu hỏi yes/no'}
                                        style={{ width: '100%', height: 30 }}
                                        textStyle={{ fontWeight: 'bold', fontSize: 13 }}
                                        selectedValue={anser}
                                        onValueChange={(val) => {
                                            this.setState({ anser: val });
                                        }}>
                                        <Picker.Item label={'Câu hỏi Đồng ý/Không đồng ý'} value={yesno} />
                                        <Picker.Item label={'Câu hỏi đánh giá sao'} value={check} />
                                    </Picker>
                                </View>
                            </View>
                        </View>
                        <View style={{ backgroundColor: 'white', padding: 20, marginVertical: 15 }}>
                            <Text style={{ color: '#29a9e0', fontSize: sizes.fs(14), fontWeight: 'bold' }}>
                                Câu hỏi
                        </Text>
                            <View style={{ borderWidth: 1, borderRadius: 6, marginLeft: 7, padding: 5, borderColor: '#b8b8b8', marginTop: 8 }}>
                                <TextInput
                                    placeholder={'Nội dung'}
                                    multiline={true}
                                    style={{ marginLeft: 5, textAlignVertical: 'top', minHeight: height * 0.08 }}
                                    onChangeText={(textContent) => this.setState({ textContent })}
                                    value={textContent}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAwareScrollView>
                <View style={[nstyles.nrow, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ButtonCom
                        onPress={() => Utils.goback(this)}
                        text={"Huỷ"}
                        txtStyle={{ color: '#00b096' }}
                        style={{ paddingHorizontal: 50, marginTop: 10, marginBottom: 25, borderColor: '#00b096', borderWidth: 1 }} />
                    <View style={{ width: 20 }} />
                    <ButtonCom
                        onPress={this._post}
                        text={"Cập nhật"}
                        txtStyle={{ color: 'white' }}
                        style={{ paddingHorizontal: 30, backgroundColor: '#00b096', marginTop: 10, marginBottom: 25 }} />
                </View>

            </View>
        );
    }
}

const mapStateToProps = state => ({
    infoUser: state.infoUser
});

export default Utils.connectRedux(AddKhaoSat, mapStateToProps, true);

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
