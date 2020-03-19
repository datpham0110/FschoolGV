import React, { Component, Fragment } from "react";
import { View, TextInput, Text, Image, StyleSheet, FlatList, ScrollView, Dimensions } from "react-native";
import Utils from "../../app/Utils";
import { colors, sizes, nstyles } from "../../styles";
import { reSize, fs } from "../../styles/size";
import Moment from "moment";
import ListEmpty from "../../components/ListEmpty";
import HeaderCom from "../../components/HeaderCom";
import { Images } from "../../images/index";
import DatePick from '../../components/DatePick';
import ButtonCom from "../../components/Button/ButtonCom";
import styles from './styles';
const { width, height } = Dimensions.get('window');
import { LichSuBaiKiemTra_GV_Detail, ThongBao_Detail_V3 } from '../../apis/notifycation';
import { ThuMoiSuKien_Detail } from "../../apis/thoiKhoaBieu";

export default class ChiTietThuMoiSuKien extends Component {
    constructor(props) {
        super(props);
        this.data = Utils.ngetParam(this, 'data', {})
        this.state = {
            listPhanHoi: [],
            listdata: []
        };

    }
    componentDidMount() {
        this.getData()
    }
    getData = async () => {
        let res = await ThuMoiSuKien_Detail(this.data.IDThongBao)
        Utils.nlog('getData', res)
        if (res.status == 1) {
            listdata = res.data
            listPhanHoi = res.data.listPhanHoi
        } else {
            listPhanHoi = []
        }
        this.setState({ listPhanHoi, listdata })
    }
    renderItem = ({ item, index }) => {
        Utils.nlog('------------------------renderItem', item)
        return (
            <View>
                <View style={{ marginBottom: 10 }} >
                    <View style={[nstyles.nstyles.nrow, { alignItems: 'center', paddingVertical: 15 }]}>
                        <Image source={Images.imgProfile} resizeMode="cover" style={nstyles.nstyles.nIcon48} />
                        <View style={{ width: 10 }} />
                        <View>
                            <Text style={{ paddingBottom: 5, fontSize: sizes.fs(14), textDecorationLine: 'underline' }}>{'Phụ huynh: '}</Text>
                            <Text style={{ fontWeight: '500', fontSize: sizes.fs(18) }}>{item.TenPhuHuynh}</Text>
                            <Text style={{ paddingVertical: 5, fontSize: sizes.fs(14), textDecorationLine: 'underline' }}>{'Học sinh: '}</Text>
                            <Text style={{ fontWeight: '500', fontSize: sizes.fs(18) }}>{item.TenHocSinh}</Text>
                        </View>
                        <View style={{ marginLeft: 8, flex: 1 }}>
                            <Text style={{ color: '#4caf50', textAlign: 'right', fontSize: sizes.fs(16) }}>{item.TenTrangThaiTMSK}</Text>
                            {
                                item.NgayPhanHoi != null ? <Text style={{ paddingTop: 6, color: colors.brownishGrey, textAlign: 'right', fontSize: sizes.fs(14) }}>{Moment(item.NgayPhanHoi, 'DD/MM/YYYY HH:mm:ss').format("DD/MM/YYYY HH:mm")}</Text> : null
                            }
                        </View>

                    </View>
                    {
                        item.TrangThaiTMSK == 0 ? null : <View style={{ borderWidth: 1, borderColor: colors.brownishGreyTwo, padding: 5 }}>
                            <Text style={{ color: colors.brownishGrey, fontSize: sizes.fs(14) }}>{'Kết quả phản hồi: ' + item.PhanHoi}</Text>
                            {
                                item.NoiDung != '' ? <Text style={{ paddingTop: 6, color: colors.brownishGrey, fontSize: sizes.fs(14) }}>{'Nội dung ý kiến: ' + item.NoiDung}</Text> : null
                            }
                        </View>
                    }
                </View>
                <View style={{ backgroundColor: '#b8b8b8', marginLeft: 45, height: 1 }} />
            </View>
        )

    }
    render() {
        return (
            <View style={[nstyles.nstyles.ncontainerX, { backgroundColor: colors.whitegay }]}>
                <HeaderCom
                    nthis={this}
                    iconLeft={Images.icBackBlue}
                    titleText={'Danh sách phụ huynh phản hồi'}
                />
                <View style={[nstyles.nstyles.nbody, { marginHorizontal: 20 }]}>
                    <View style={{ padding: 15, backgroundColor: '#29A9E0', marginTop: 21 }}>
                        <Text style={{ fontSize: sizes.fs(16), color: 'white', textAlign: 'center', fontWeight: 'bold' }}>{'Số Phụ huynh tham gia: ' + this.state.listdata.SoLuongThamGia}</Text>
                        <View style={{ height: 5 }} />
                        <Text style={{ fontSize: sizes.fs(16), color: 'white', textAlign: 'center', fontWeight: 'bold' }}>{'Số Phụ huynh không tham gia: ' + this.state.listdata.SoLuongKhongThamGia}</Text>
                    </View>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{ backgroundColor: 'white', paddingHorizontal: 15, marginBottom: 20 }}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={this.state.listPhanHoi}
                            renderItem={this.renderItem}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </ScrollView>
                </View>
            </View >
        );
    }
}
const stText = StyleSheet.create({
    ntitle: {
        fontSize: fs(18),
        fontWeight: 'bold',
        paddingVertical: 5
    },
    ntext: {
        fontSize: fs(16),
        fontWeight: 'bold',
        color: 'black'
    },

})
