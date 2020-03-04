import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { Dimensions } from 'react-native';
import { colors, sizes } from '../../styles';
import { reSize, reText, fs } from '../../styles/size';
import Utils from '../../app/Utils';
import { nstyles, Height, nwidth } from '../../styles/styles';
import HeaderCom from '../../components/HeaderCom';
import { Images } from '../../images';

const { width } = Dimensions.get('window');

export default class TienichHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount() {

    }
    _clickMenu = (route: String, param: Object) => () => {
        if (param) Utils.goscreen(this, route, param);
        else Utils.goscreen(this, route);
    };
    renderItemMenuBot = (icon, routerName = '', name = '', param = false) => {
        let sizeImg = nwidth * 0.09;
        return (
            <TouchableOpacity style={{ borderColor: '#e3e1e1', borderWidth: 0.5, width: nwidth / 3, alignItems: 'center' }}
                // onPress={this._clickMenu(routerName, param)}>
                onPress={() => Utils.showMsgBoxOK(this, 'Thông báo', 'Chức năng đang cập nhật', 'Đóng')}>

                <Image resizeMode="contain" source={icon}
                    style={[nstyles.nIcon56, { margin: 10 }]} />
                <Text style={{ textAlign: 'center', flex: 1, marginRight: 7, fontSize: fs(16) }}>{name}</Text>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={nstyles.ncontainerX}>
                <HeaderCom
                    nthis={this}
                    iconLeft={Images.icBackBlue}
                    titleText={'Tiện ích'} />
                <View style={nstyles.nbody}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                        {this.renderItemMenuBot(Images.icBook, '', 'Nhà sách')}
                        {this.renderItemMenuBot(Images.icHoaDon, 'sc_HoaDonHome', 'Hoá đơn')}
                        {this.renderItemMenuBot(Images.icNapTien, 'sc_NapTienDienThoai', 'Nạp tiền điện thoại')}
                        {this.renderItemMenuBot(Images.icTheCao, 'sc_Thecao', 'Mua thẻ cào')}
                        {this.renderItemMenuBot(Images.icMuaSam, '', 'Mua sắm')}
                        {this.renderItemMenuBot(Images.icGiaiTri, '', 'Giải trí')}
                    </View>
                </View>
                {/* <View style={{ flex: 1, alignItems: 'center', top: -50 }}>
                    <Image source={Images.icnapas} resizeMode='cover' style={{ width: nwidth }} />
                </View> */}
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
