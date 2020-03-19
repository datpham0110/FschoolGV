import React, { Component, Fragment } from "react";
import { View, TextInput, Text, Image, StyleSheet, FlatList, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import Utils from "../../app/Utils";
import { colors, sizes, nstyles } from "../../styles";
import { reSize } from "../../styles/size";
import Moment from "moment";
import ListEmpty from "../../components/ListEmpty";
import HeaderCom from "../../components/HeaderCom";
import { Images } from "../../images/index";
import DatePick from '../../components/DatePick';
import ButtonCom from "../../components/Button/ButtonCom";
import styles from './styles';
const { width, height } = Dimensions.get('window');
import { LichSuBaiKiemTra_GV_Detail, ThongBao_Detail_V3 } from '../../apis/notifycation';
import { appConfig } from '../../app/Config';
import YouTubePlay from '../../components/YouTubePlay';
export default class ChitietLichSuBaoBai extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            tongSoClass: '',
            tongSoDaTraLoi: '',
            listImage: '',
            showVideo: false,
            loadBaiKiemTra: '',
            listHinhAnh: '',
            listCauHoi: ''
        };
        this.data = Utils.ngetParam(this, 'data', '')

    }
    componentDidMount() {
        this.reloadData();
    }
    reloadData = async () => {
        let res = await ThongBao_Detail_V3(this.data.IDThongBao);
        if (res.status == 1) {
            this.setState({ data: res.data, tongSoClass: res.data.BaiKiemTra.TongSoHSCuaLop, tongSoDaTraLoi: res.data.BaiKiemTra.TongSoHSDaTraLoi, listImage: res.data.ListImage, loadBaiKiemTra: res.data.BaiKiemTra.LoaiBaiKT })
            if (res.data.BaiKiemTra.LoaiBaiKT == 1) {
                this.setState({ listCauHoi: res.data.BaiKiemTra.data })
            } else {
                this.setState({ listHinhAnh: res.data.BaiKiemTra.data })
            }
        } else {
            this.setState({ data: '' })
        }
    }
    renderItemImg = ({ item, index }) => {
        var imageList = appConfig.domain + item
        var { listImage } = this.state
        Utils.nlog('imageList', imageList)
        return (
            <TouchableOpacity
                onPress={this._showAllImageHotel(listImage, index)}>
                <Image source={{ uri: imageList }}
                    style={{ width: sizes.sizes.nImgSize90, height: sizes.sizes.nImgSize58, margin: 5, borderRadius: 4 }} />
            </TouchableOpacity>
        );
    }
    _showAllImageHotel = (arrImage, index) => () => {
        Utils.nlog('vooooo')
        const imagesURL = [];
        for (let index = 0; index < arrImage.length; index++) {
            const item = arrImage[index];
            const obj = {
                url: appConfig.domain + item,
            };
            imagesURL.push(obj);
        };
        Utils.goscreen(this, 'sc_ViewImageListShow', { ListImages: imagesURL, index });
    }
    goChiTietHS = () => () => {
        if (this.state.data.IsCoBaiKiemTra == false) {
            return;
        }
        Utils.goscreen(this, 'sc_ChiTietHSBaobai', { dataBaoBai: this.state.data, dataList: this.data })
    }
    renderItem = ({ item, index }) => {
        return (
            <View>
                <View style={[nstyles.nstyles.nrow, { alignItems: 'center', paddingVertical: 15 }]}>
                    <Image source={Images.imgProfile} resizeMode="cover" style={nstyles.nstyles.nIcon48} />
                    <View style={{ width: 10 }} />
                    <Text>{item.TenKhachHang}</Text>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: '#4caf50', textAlign: 'right', fontSize: sizes.fs(16) }}>Đã nộp</Text>
                        <Text style={{ color: colors.brownishGrey, textAlign: 'right', fontSize: sizes.fs(14) }}>{Moment(item.NgaySubmit).format("DD/MM/YYYY HH:mm:ss")}</Text>
                    </View>
                </View>
                <View style={{ backgroundColor: '#b8b8b8', marginLeft: 45, height: 1 }} />
            </View>
        )
    }
    getIDVideo = (string) => {
        Utils.nlog('-------------------------------')
        if (string == null) return;
        const index = string.lastIndexOf('=');
        Utils.nlog('-------------------------------index', index)
        const index1 = string.lastIndexOf('/');
        Utils.nlog('-------------------------------index1', index1)
        if (index != -1 || index1 != -1) {
            if (index != -1) {
                const id = string.slice(index + 1);
                this.idVideo = id;
                return this.idVideo;
            };
            if (index1 != -1) {
                const id = string.slice(index1 + 1);
                this.idVideo = id;
                return this.idVideo;
            };
        };
    }

    _renderImage = (item, index) => {
        return (
            <TouchableOpacity key={index} style={{ borderColor: 'black', borderWidth: 1, marginHorizontal: 1, marginVertical: 1, width: (nstyles.nwidth / 3) - 20, height: nstyles.nwidth * 0.25 }}
            // onPress={() => Utils.goscreen(this, 'Modal_ShowImgBig', { data: item.item }) }
            >
                <Image
                    resizeMode="cover" source={{ uri: appConfig.domain + item.item }}
                    tintColorLeft={colors.black_11}
                    style={{ width: (nstyles.nwidth / 3) - 20, height: nstyles.nwidth * 0.25 }} />
            </TouchableOpacity>
        )
    }
    _renderItemCauHoi4TL = (item) => {
        return (
            <View style={{ backgroundColor: 'white', marginVertical: 5, padding: 8 }}>
                <Text style={{ fontSize: sizes.fs(18), fontWeight: 'bold', paddingVertical: 8 }}>{item.index + 1}. {item.item.NoiDung}</Text>
                <Text style={stBaoBaiDetail.textCauHoi}>A. {item.item.ChiTiet[0].NoiDung}</Text>
                <Text style={stBaoBaiDetail.textCauHoi}>B. {item.item.ChiTiet[1].NoiDung}</Text>
                <Text style={stBaoBaiDetail.textCauHoi}>C. {item.item.ChiTiet[2].NoiDung}</Text>
                <Text style={stBaoBaiDetail.textCauHoi}>D. {item.item.ChiTiet[3].NoiDung}</Text>
            </View>
        );
    }
    render() {
        var { data, tongSoDaTraLoi, tongSoClass, listImage, showVideo } = this.state
        Utils.nlog('------------------------data.LinkVideo', data.LinkVideo)
        return (
            <View style={[nstyles.nstyles.ncontainerX, { backgroundColor: colors.whitegay }]}>
                <HeaderCom
                    nthis={this}
                    iconLeft={Images.icBackBlue}
                    iconRight={Images.icChiTietLichSu}
                    titleText={'Chi tiết báo bài'}
                    onPressRight={this.goChiTietHS()}
                    hiddenIconRight={this.state.data.IsCoBaiKiemTra == false ? true : false}
                />
                <ScrollView showsVerticalScrollIndicator={false} style={[nstyles.nstyles.nbody, { marginHorizontal: 20 }]}>
                    <View style={{ backgroundColor: 'white', marginTop: 21 }}>
                        <View style={{ padding: 20 }}>
                            <View style={[nstyles.nstyles.nrow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                                <Text style={{ color: colors.brownishGrey, fontSize: sizes.fs(15), fontWeight: '500' }}>Nội dung</Text>
                                <Text style={{ color: colors.brownishGrey, fontSize: sizes.fs(15) }}>{Moment(data.HieuLucDen).format("DD/MM/YYYY HH:mm")}</Text>
                            </View>
                            <View style={{ borderWidth: 1, borderColor: '#b8b8b8', padding: 10, marginTop: 5 }}>
                                <Text style={{ color: colors.brownishGrey, fontSize: sizes.fs(15), fontWeight: '500' }}>
                                    {data.NoiDung}
                                </Text>
                            </View>
                        </View>
                        <View style={{ flexWrap: 'wrap', paddingVertical: 10 }}>
                            <FlatList
                                data={listImage}
                                numColumns={3}
                                renderItem={this.renderItemImg}
                                keyExtractor={(item, index) => index.toString()}
                                extraData={listImage}
                            />
                        </View>
                    </View>
                    {data.LinkVideo != null ?
                        <TouchableOpacity onPress={() => this.setState({ showVideo: !showVideo })} style={{ backgroundColor: 'white', marginTop: 10 }}>
                            <View style={[nstyles.nstyles.nrow, { alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 }]}>
                                <Image resizeMode='contain' style={nstyles.nstyles.nIcon30} source={Images.icLinkVideo} />
                                <View style={{ width: 10 }} />
                                <Text>{data.TieuDeVideo}</Text>
                            </View>
                        </TouchableOpacity> : null}
                    {showVideo == true ? <YouTubePlay idVideo={this.getIDVideo(data.LinkVideo)} /> : null}
                    {
                        data.IsCoBaiKiemTra == true ?
                            <View style={[nstyles.nstyles.nrow, { alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', marginTop: 10 }]}>
                                <View style={[nstyles.nstyles.nrow, { alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 }]}>
                                    <Image resizeMode='contain' style={nstyles.nstyles.nIcon30} source={Images.icBaiKiemTra} />
                                    <View style={{ width: 10 }} />
                                    <Text>Bài kiểm tra</Text>
                                </View>
                                <View style={[nstyles.nstyles.nrow, { alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 }]}>
                                    <Image resizeMode='contain' style={nstyles.nstyles.nIcon26} source={Images.successBB} />
                                    <View style={{ width: 10 }} />
                                    <Text>Hoàn thành {tongSoDaTraLoi} / {tongSoClass}</Text>
                                </View>
                            </View> : null
                    }
                    {
                        data.IsCoBaiKiemTra == true ? <Text style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 10 }}>{data.BaiKiemTra.TieuDeBaiKT}</Text> : null}
                    {this.state.loadBaiKiemTra == 1 ?
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={data.BaiKiemTra.data.BaoBai}
                            renderItem={this._renderItemCauHoi4TL}
                            keyExtractor={(item, index) => index.toString()}
                            ItemSeparatorComponent={this.renderSeparator}
                        />
                        :
                        <FlatList
                            style={{ marginTop: 10 }}
                            data={this.state.listHinhAnh}
                            renderItem={this._renderImage}
                            extraData={this.state.listHinhAnh}
                            keyExtractor={(item, index) => index.toString()}
                        />}
                </ScrollView>
            </View>
        );
    }
}


const stBaoBaiDetail = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.whitegay,
        paddingHorizontal: 10, paddingVertical: 8,
        borderRadius: 3,
        flex: 1, marginTop: 8
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
    },
    textCauHoi: {
        fontSize: sizes.fs(16),
        paddingBottom: 5,
        fontWeight: '500'
    }

})