import React, { Component, Fragment } from "react";
import { View, ActivityIndicator, Text, Image, StyleSheet, FlatList, TouchableOpacity, Dimensions } from "react-native";
import Utils from "../../app/Utils";
import { colors, sizes, nstyles } from "../../styles";
import { reSize } from "../../styles/size";
import Moment from "moment";

import HeaderCom from "../../components/HeaderCom";
import { Images } from "../../images/index";
import DatePick from '../../components/DatePick';
import ButtonCom from "../../components/Button/ButtonCom";
import styles from './styles';
import { LichSuBaiKiemTra_GV, ThongBao_ListAll_App_V2 } from '../../apis/notifycation';
import ListEmpty from "../../components/ListEmpty";
const { width, height } = Dimensions.get('window');

export default class LichSuBaoBai extends Component {
    constructor(props) {
        super(props);
        this.valuListLop = Utils.ngetParam(this, 'valuListLop', '')
        this.type = Utils.ngetParam(this, 'type')
        this.allpage = 0;
        this.state = {
            data: '',
            // allPage: '',
            pageNow: 0,
            onLoadList: false,
        };
    }
    goChiTiet = (item) => {
        switch (this.type) {
            case 4:
                Utils.goscreen(this, 'sc_ChiTietThuMoiSuKien', { data: item })
                break;
            case 2:
                Utils.goscreen(this, 'sc_ChitietLichSuBaoBai', { data: item })
                break;
            default:
                break;
        }

    }
    componentDidMount() {
        this._reloadData(this.state.pageNow);
    }
    _reloadData = async (pageNow) => {
        let res = await ThongBao_ListAll_App_V2(this.type == 4 ? 7 : 2, this.valuListLop, pageNow);
        Utils.nlog('--------------ThongBao_ListAll_App_V2ThongBao_ListAll_App_V2', res)
        if (res.status == 1 && res.data != null) {
            // this.setState({ data: res.data.reverse() })
            this.allpage = res.page.AllPage;
            this.setState({ data: res.data, pageNow: this.state.pageNow })
        } else {
            // this.setState({ data: [] })
        }
    }
    loadMoreData = async () => {
        this.setState({ onLoadList: true });
        const { pageNow } = this.state;
        const page = pageNow + 1;
        if (page < this.allpage) {
            let res = await ThongBao_ListAll_App_V2(this.type == 4 ? 7 : 2, this.valuListLop, page);
            Utils.nlog('------------------ ----------------- ---------------------to load more', res)
            if (res.status == 1) {
                let daaa = [...this.state.data, ...res.data];
                // daaa.concat(res.data)
                this.setState({ data: daaa, pageNow: page, onLoadList: false })
            } else {
                this.setState({ onLoadList: false });
            }
        } else {
            this.setState({ onLoadList: false });
        }
    }
    renderItem = ({ item, index }) => {
        var ColorBrg = colors.whitegay;
        if (index % 2 != 0) {
            ColorBrg = colors.white;
        }
        return (
            <TouchableOpacity onPress={() => this.goChiTiet(item)} style={{ backgroundColor: ColorBrg, paddingHorizontal: 20, paddingVertical: 10 }}>
                <View style={nstyles.nstyles.nrow}>
                    <Image source={Images.icBell} resizeMode='contain' />
                    <View style={{ width: 10 }} />
                    <View>
                        {/* <Text style={{ fontSize: sizes.fs(18), fontWeight: 'bold' }}>Tiêu đề: {item.TieuDe}</Text> */}
                        <Text style={{ fontSize: sizes.fs(18), fontWeight: 'bold' }}>{item.NoiDung}</Text>
                        {/* <Text style={{ fontSize: sizes.fs(16), marginTop: 5 }}>Loại bài kiểm tra: {item.LoaiBaiKT == 0 ? 'Hình ảnh' : 'Trắc nghiệm'}</Text> */}
                        {/* <Text style={{ fontSize: sizes.fs(16), marginTop: 5 }}>Tổng số lượng câu hỏi: {item.TongSoLuongCauHoi}</Text> */}
                        <Text style={{ fontSize: sizes.fs(16), marginTop: 5 }}>{Moment(item.HieuLucDen).format("DD/MM/YYYY HH:mm")}</Text>
                    </View>
                </View>
                <View style={[nstyles.nstyles.nrow, { alignItems: 'center', justifyContent: 'space-between', paddingTop: 10 }]}>
                    <View style={{ flex: 1 }}>
                        {item.LinkVideo != '' ? <View style={[nstyles.nstyles.nrow, { alignItems: 'center' }]}>
                            <Image resizeMode='contain' style={nstyles.nstyles.nIcon18} source={Images.icLinkVideo} />
                            <Text style={{ fontSize: sizes.fs(14), paddingLeft: 8 }}>{item.TieuDeVideo}</Text>
                        </View> : null}
                    </View>
                    {
                        item.IsCoBaiKiemTra == true ? <View style={[nstyles.nstyles.nrow, { alignItems: 'center' }]}>
                            <Image resizeMode='contain' style={nstyles.nstyles.nIcon18} source={Images.icBaiKiemTra} />
                            <Text style={{ fontSize: sizes.fs(14), paddingLeft: 8 }}>Bài kiểm tra</Text>
                        </View> : null
                    }

                </View>
            </TouchableOpacity>
        )
    }
    render() {
        console.log('dasasddsadasd', this.valuListLop)
        return (
            <View style={[nstyles.nstyles.ncontainerX, { backgroundColor: colors.whitegay }]}>
                <HeaderCom
                    nthis={this}
                    iconLeft={Images.icBackBlue}
                    titleText={this.type != 4 ? 'Danh sách báo bài' : 'Danh sách thư mời sự kiện'}
                />
                <View style={[nstyles.nstyles.nbody, { marginHorizontal: 10 }]}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={<ListEmpty textempty={'Không có dữ liệu'} />}
                        extraData={this.state.data}
                        renderItem={this.renderItem}
                        data={this.state.data}
                        keyExtractor={(item, index) => index.toString()}
                        onEndReached={this.loadMoreData}
                        onEndReachedThreshold={0.2}
                        ListFooterComponent={
                            this.state.onLoadList == true ?
                                <ActivityIndicator /> : null
                        }
                    />
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