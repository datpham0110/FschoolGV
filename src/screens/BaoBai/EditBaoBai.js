

import React, { Component } from "react";
import { View, TextInput, Text, Image, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import Utils from "../../app/Utils";
import { colors, sizes, nstyles } from "../../styles";
import HeaderCom from "../../components/HeaderCom";
import { Images } from "../../images/index";
import ButtonCom from "../../components/Button/ButtonCom";
import styles from './styles';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { BaoBai_Send_App_V2 } from "../../apis/thanhtoan";
import { ROOTGlobal } from "../../app/data/dataGlobal";
import { MonHocList } from "../../apis/danhmuc";
import { Picker } from "native-base";
import { nGlobalKeys } from "../../app/keys/globalKey";
export default class EditBaoBai extends Component {
    constructor(props) {
        super(props);
        listChild = Utils.ngetParam(this, 'listChild');
        nthis = this;
        this.khoangcach = 18;
        this.clickAll = false;
        this.index = 0;
        // this.checkFix = false;
        this.id = 0;
        this.nameLop = Utils.ngetParam(this, 'lop');
        this.idYoutube = '';
        this.valuListLop = Utils.ngetParam(this, 'valuListLop', '')
        this.state = {
            date: "",
            namestudent: '',
            checkBB: [],
            textGChu: '',
            tieude: 'Báo bài',
            tenthongbao: 'Báo bài',
            listBB: Utils.getGlobal(nGlobalKeys.baobai, []),
            image: undefined,
            isLoading: false,
            listMonHoc: [],
            valuMonHoc: '',
            save: true,
            textLink: '',
            IsCoBaiKiemTra: false,
            listCauHoi: '', // Đây là thông tin của bài kiểm tra, do ban đầu định dùng cho câu hỏi mà không kịp nên dùng đại nó
            tenVideo: '',
            linkVideo: 'Link',
            tenBaiKiemTra: '',
            soCauHoi: '',
            checkFix: false,
            danhSachCauHoi: [], //
            flagCauHoi: -1
        };
        Utils.nlog('-------------------------------this.nameLopthis.nameLopthis.nameLop', this.valuListLop)
    }
    componentDidMount() {
        Utils.nlog('this.nameLop', this.nameLop)
        this.getMonHocList()
    }

    getMonHocList = async () => {
        let res = await MonHocList()
        Utils.nlog('getMonHocList', res)
        if (res.status == 1) {
            listMonHoc = res.data
            this.setState({ listMonHoc })
        }
    }
    getListmonhoc = async (valIdLop) => {
        this.setState({ valuMonHoc: valIdLop });
    }
    PostBaoBai = async () => {
        Utils.nlog('----------------------------------PostBaoBaiPostBaoBai')
        var { textGChu, valuMonHoc, tenthongbao, image, tieude } = this.state
        if (valuMonHoc == '') {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Vui lòng chọn môn học', 'Đóng');
            return;
        };
        if (textGChu == '' && image == undefined) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Vui lòng thêm nội dung', 'Đóng');
            return;
        }
        // const listBB = this.state.listBB.slice();
        const listBB = []
        listBB.push(
            // const bb =
            {
                TenThongBao: tenthongbao,
                IDThongBao: '',
                MonHoc: valuMonHoc,
                NoiDung: textGChu == '' ? 'Báo bài hình' : textGChu,
                TieuDe: tieude,
                HieuLucDen: '',
                IDLoai: 2,
                IDChiNhanh: ROOTGlobal.IdCN,
                listLinkImage: this.state.image,
                id: this.index,
                IsCoBaiKiemTra: false,
                linkVideo: '',
                BaiKiemTra: '',
                TieuDeVideo: '',
                IDLopHoc: this.valuListLop
            }
        );
        // Utils.setGlobal(nGlobalKeys.baobai, listBB)
        Utils.setGlobal(nGlobalKeys.baobai, listBB)
        this.index++;
        this.setState({ listBB: listBB, save: false, checkFix: true })
        // this.setState({ listBB, valuMonHoc: '', textGChu: '', image: undefined, save: false })
    }
    _renderImage1 = (nitem) => {
        return <FlatList
            numColumns={2}
            data={nitem.listLinkImage}
            scrollEnabled={false}
            renderItem={({ item, index }) => this._renderImage(item, index, nitem.image)}
            keyExtractor={item => item.idItem}
        />
    }
    _renderItem = ({ item, index }) => {
        const { nrow, nmiddle } = nstyles.nstyles;
        return <View style={[{
            backgroundColor: colors.white, marginTop: 24,
            paddingHorizontal: this.khoangcach, marginHorizontal: this.khoangcach, paddingVertical: nstyles.khoangcach
        }]}
        >
            <TouchableOpacity
                onPress={this._deleteItem(item.id)}
                style={{ right: -10, top: -5, backgroundColor: 'rgba(0,0,0,0)', alignItems: 'flex-end' }}>
                <View style={[nstyles.nstyles.nIcon20, { borderRadius: sizes.reSize(10), backgroundColor: colors.red }]}>
                    <Image resizeMode='contain' style={[nstyles.nstyles.nIcon20, { tintColor: 'red' }]} source={Images.icCancelTour} />
                </View>
            </TouchableOpacity>
            <View style={stBaoBaiDetail.containText}>
                <Text style={stBaoBaiDetail.stext} numberOfLines={1}>{item.MonHoc}</Text>
            </View>
            <View style={{
                borderColor: colors.veryLightPinkThree, borderWidth: 0.5,
                paddingHorizontal: this.khoangcach, marginTop: 13, paddingBottom: 20
            }}>
                <Text style={[styles.text13, { flex: 1, paddingVertical: 10 }]}>{item.NoiDung == 'Báo bài hình' ? '' : item.NoiDung}</Text>
                <View style={{ flexWrap: 'wrap', flex: 1, marginHorizontal: -this.khoangcach + 8 }}>
                    {item.listLinkImage ? this._renderImage1(item) : null}
                </View>

            </View>
            <View style={[nrow, { marginTop: 13, paddingHorizontal: this.khoangcach, justifyContent: 'flex-end' }]}>
                <TouchableOpacity
                    onPress={this._editText(item.id)}
                    style={[stBaoBaiDetail.containText, { backgroundColor: colors.azure, marginLeft: 20, paddingHorizontal: 15 }]}>
                    <Text style={[styles.text13, { color: colors.white }]}>Sửa</Text>
                </TouchableOpacity>
            </View>
        </View>
    }
    _deleteItem = (id) => () => {
        if (this.state.checkFix) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Vui lòng lưu báo bài trước khi xoá', 'Đóng');
        } else {
            const listBB = this.state.listBB.filter((item) => {
                if (item.id == id) return false;
                return true;
            });
            this.setState({ listBB });
            Utils.nlog('listBB delete', listBB)
            Utils.setGlobal(nGlobalKeys.baobai, listBB)
        };
    }
    _editText = (id) => () => {
        // this.checkFix = true;
        this.setState({ checkFix: true })
        this.id = id;
        const data = this.state.listBB.filter(item => {
            if (item.id == id) return true;
            return false;
        });
        Utils.setGlobal(nGlobalKeys.baobai, data)
        this.INPUT.focus();
        this.setState({ textGChu: data[0].NoiDung, valuMonHoc: data[0].MonHoc, image: data[0].listLinkImage, save: true });
    }
    _doneEditText = (id) => () => {
        Utils.nlog('----------------------------------_doneEditText_doneEditText')
        // this.checkFix = false;
        this.setState({ checkFix: false })
        // const listBB = this.state.listBB.map(item => {
        //     if (item.id == id) {
        //         if ((this.state.image == undefined || this.state.image.length == 0) && this.state.textGChu.trim().length == 0) {
        //             Utils.showMsgBoxOK(this, 'Thông báo', 'Lưu thất bại. Nội dung và hình ảnh không được để trống', 'Đóng')
        //             return item;
        //         }
        //         if (this.state.textGChu == 'Báo bài hình' && this.state.image.length == 0) {
        //             Utils.showMsgBoxOK(this, 'Thông báo', 'Lưu thất bại. Vui lòng thêm hình ảnh', 'Đóng')
        //             return item;
        //         }
        //         item.NoiDung = this.state.textGChu;
        //         item.MonHoc = this.state.valuMonHoc;
        //         item.listLinkImage = this.state.image;
        //     }
        //     return item;
        // });
        const bb = this.state.listBB[0];
        if ((this.state.image == undefined || this.state.image.length == 0) && this.state.textGChu.trim().length == 0) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Lưu thất bại. Nội dung và hình ảnh không được để trống', 'Đóng')
            return item;
        }
        if (this.state.textGChu == 'Báo bài hình' && this.state.image.length == 0) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Lưu thất bại. Vui lòng thêm hình ảnh', 'Đóng')
            return item;
        }
        bb.NoiDung = this.state.textGChu;
        bb.MonHoc = this.state.valuMonHoc;
        bb.listLinkImage = this.state.image;

        Utils.setGlobal(nGlobalKeys.baobai, bb)
        this.setState({ bb });
    }
    renderSeparator = () => {
        return (
            <View style={[nstyles.nstyles.nrow, { height: 1, width: '100%' }]}>
                <View style={{ width: '20%', backgroundColor: colors.white }} />
                <View style={{ width: '80%', backgroundColor: colors.veryLightPinkSeven }} />
            </View>
        );
    };
    BaobaiHT = () => {
        Utils.goscreen(this, 'sc_BaoBaiHT', { type: 2 });
    }

    sendBaobai = async () => {
        var { listBB, image, textGChu, linkVideo, tenVideo, tenBaiKiemTra, soCauHoi, flagCauHoi, danhSachCauHoi } = this.state
        if (listBB.length <= 0) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Vui lòng thêm bài tập cho bé', 'OK');
            return;
        };
        Utils.showMsgBoxYesNo(this, 'Thông báo', 'Bạn có chắc chắn gửi báo bài này?',
            'OK', 'Cancel', async () => {
                this.setState({ isLoading: true });
                const listImage = [];
                const listBBB = []
                for (let index = 0; index < listBB.length; index++) {
                    const item = listBB[index];
                    const listLinkImage = [];
                    const dataImage = item.listLinkImage;
                    if (dataImage)
                        for (let index = 0; index < dataImage.length; index++) {
                            const itemimg = dataImage[index];
                            const imgbase64 = await Utils.parseBase64(itemimg.uri, itemimg.height, itemimg.width);
                            const objImage = {
                                strBase64: imgbase64,
                                filename: itemimg.idItem,
                                extension: "png",
                                IdUser: ROOTGlobal.dataUser.IdUser
                            };
                            listLinkImage.push(objImage);
                            listImage.push(objImage);
                        };
                    item.listLinkImage = listLinkImage;
                    if (linkVideo != 'Link') {
                        if (tenVideo == '') {
                            Utils.showMsgBoxOK(this, 'Thông báo', 'Tiêu đều video không được để trống', 'Đóng')
                            this.setState({ isLoading: false });
                            return
                        }
                        item.linkVideo = linkVideo;
                        item.TieuDeVideo = tenVideo;
                    }
                    if (this.state.IsCoBaiKiemTra == true) {
                        if (tenBaiKiemTra == '') {
                            Utils.showMsgBoxOK(this, 'Thông báo', 'Tên bài kiểm tra không được để trống', 'Đóng')
                            this.setState({ isLoading: false });
                            return
                        }
                        if (flagCauHoi == 1 && danhSachCauHoi.length == 0) {
                            Utils.showMsgBoxOK(this, 'Thông báo', 'Bài kiểm tra chưa có câu hỏi', 'Đóng')
                            this.setState({ isLoading: false });
                            return
                        }
                        item.IsCoBaiKiemTra = true;
                        if (this.state.listCauHoi != '') {
                            const listImageCauHoi = [];
                            const listCauHoiBaoBai = [];
                            if (flagCauHoi == 0) {
                                for (let index = 0; index < this.state.listCauHoi.length; index++) {
                                    const itemimg = this.state.listCauHoi[index];
                                    const imgbase64 = await Utils.parseBase64(itemimg.uri, itemimg.height, itemimg.width);
                                    const objImage = {
                                        strBase64: imgbase64,
                                        filename: itemimg.idItem,
                                        extension: "png",
                                    };
                                    listImageCauHoi.push(objImage);
                                };
                            }
                            item.BaiKiemTra = {
                                "baiKiemTra": {
                                    "IDBaiKT": "",
                                    "TieuDe": tenBaiKiemTra,
                                    "TongSoLuongCauHoi": soCauHoi,
                                    "TongDaNop": 0,
                                    "IDThongBao": '',
                                    "LoaiBaiKT": flagCauHoi
                                },
                                listCauHoi: listImageCauHoi,
                                listCauHoiBaoBai: listCauHoiBaoBai
                            }
                        } else {
                            item.BaiKiemTra = {
                                "baiKiemTra": {
                                    "IDBaiKT": "",
                                    "TieuDe": tenBaiKiemTra,
                                    "TongSoLuongCauHoi": danhSachCauHoi.length,
                                    "TongDaNop": 0,
                                    "IDThongBao": '',
                                    "LoaiBaiKT": flagCauHoi
                                },
                                listCauHoi: '',
                                listCauHoiBaoBai: danhSachCauHoi
                            }
                        }
                    }
                    listBBB.push(item);
                }
                Utils.nlog('-------------BaoBai_Send_App_V2', listBBB)
                let res = await BaoBai_Send_App_V2(listBBB, listChild, this.nameLop);
                Utils.nlog('-------------BaoBai_Send_App_V2', res)
                if (res.status == 1) {
                    Utils.setGlobal(nGlobalKeys.baobai, [])
                    Utils.showMsgBoxOK(this, 'Thông báo', 'Gửi báo bài thành công', 'OK', this.BaobaiHT);
                } else {
                    Utils.showMsgBoxOK(this, 'Thông báo', 'Gửi báo bài thất bại vui lòng thử lại sau.', 'OK');
                };
                this.setState({ isLoading: false });
            }
        )
    }
    _goMediapicker = (optionsCus) => {
        if (optionsCus == undefined || optionsCus == null)
            optionsCus = {};
        response = (res) => {
            Utils.nlog('images', res)
            if (res.iscancel) {
            }
            else if (res.error) {
            }
            else {
                this.setState({ image: res });
                //--dữ liệu media trả về là 1 item or 1 mảng item
                //--Xử lý dữ liệu trong đây-----
                //Utils.nlog('img', res);
                // this._uploadAvatar(res[0]);
                //-----
            }
        }
        let options = {
            assetType: 'Photos', //All,Videos,Photos - default
            multi: true,// chọn 1 or nhiều item
            response: response, // callback giá trị trả về khi có chọn item
            limitCheck: -1, //gioi han sl media chon: -1 la khong co gioi han, >-1 la gioi han sl =  limitCheck
            ...optionsCus
        };
        Utils.goscreen(this, 'Modal_MediaPicker', options);
        //--End dialog media
    };
    _showAllImageHotel = (arrImage, index) => () => {
        const imagesURL = [];
        for (let index = 0; index < arrImage.length; index++) {
            const item = arrImage[index];
            const obj = {
                url: item.uri,
                width: item.width,
                height: item.height
                // Optional, if you know the image size, you can set the optimization performance
            };
            imagesURL.push(obj);
        };

        Utils.goscreen(this, 'sc_ViewImageListShow', { ListImages: imagesURL, index });
    }
    _renderImage = (item, index, arrImages) =>
        <TouchableOpacity onPress={this._showAllImageHotel(arrImages, index)}>
            <Image
                resizeMode="cover" source={{ uri: item.uri }}
                tintColorLeft={colors.black_11}
                style={{ width: sizes.reSize(120), height: sizes.reSize(120), marginRight: 20, marginBottom: 15 }} />
            {
                this.state.checkFix ? null : <TouchableOpacity
                    // disabled={!save}
                    onPress={this._deleteImage(index)}
                    style={{ position: 'absolute', right: 20, top: 0, backgroundColor: 'rgba(0,0,0,0)', alignItems: 'flex-end', zIndex: 3 }}>
                    <View style={[nstyles.nstyles.nIcon20, { borderRadius: sizes.reSize(10), backgroundColor: colors.white }]}>
                        <Image resizeMode='contain' style={[nstyles.nstyles.nIcon20, { tintColor: '#707070' }]} source={Images.icCancelTour} />
                    </View>
                </TouchableOpacity>
            }
        </TouchableOpacity>
    _deleteImage = (nindex) => () => {
        const image = this.state.image.filter((item, index) => nindex !== index);
        this.setState({ image });
    }
    _showAllImageHotel111 = (arrImage, index) => () => {
        const imagesURL = [];
        for (let index = 0; index < arrImage.length; index++) {
            const item = arrImage[index];
            const obj = {
                url: item.uri,
                width: item.width,
                height: item.height
                // Optional, if you know the image size, you can set the optimization performance
            };
            imagesURL.push(obj);
        };
        Utils.goscreen(this, 'sc_ViewImageListShow', { ListImages: imagesURL, index });
    }
    _addLink = () => {
        Utils.goscreen(this, 'Modal_AddLinkVideo', {
            goBackAddLink: this.goBackAddLink,
            linkVideo: this.state.linkVideo,
            tenVideo: this.state.tenVideo
        });
    }
    _removeLink = () => {
        this.setState({ linkVideo: 'Link', tenVideo: '' });
    }

    goBackAddLink = (tenVideo, Link) => {
        Utils.nlog('------------------tenVideo', tenVideo)
        Utils.nlog('------------------Link', Link)
        this.setState({ linkVideo: Link, tenVideo: tenVideo }, () => this._getIDYoutube(Link))
    }
    _renderItemCauHoi = (item, index) => {
        return (
            <View>
                <TouchableOpacity onPress={this._showAllImageHotel111(item.item, item.index)}>
                    <Image
                        resizeMode="cover" source={{ uri: item.item.uri }}
                        tintColorLeft={colors.black_11}
                        style={{ width: sizes.reSize(120), height: sizes.reSize(120), marginRight: 20, marginBottom: 15 }} />
                </TouchableOpacity>
            </View>
        )
    }
    suaCauHoi = (item, index) => {
        Utils.goscreen(this, 'Modal_ThemCauHoiKiemTra', { edit: true, data: item, indexCauHoi: index, gobackUpdate: this.gobackUpdate });
    }
    gobackUpdate = (CauNoi, A, B, C, D, DapAn, index) => {
        let ds = this.state.danhSachCauHoi;
        let ds2 = [];
        ch = {
            "Loai": 1,
            "NoiDung": CauNoi,
            "DapAn1": A,
            "DapAn2": B,
            "DapAn3": C,
            "DapAn4": D,
            "DapAnDung": DapAn
        }
        // ds.push(ch);
        for (let i = 0; i < ds.length; i++) {
            if (i == index) {
                ds2.push(ch);
            } else {
                ds2.push(ds[i])
            }
        }

        this.setState({ danhSachCauHoi: ds2 })
    }
    deleteitem = (index) => {
        Utils.showMsgBoxYesNo(this, 'Thông báo', 'Bạn có chắc chắn muốn xoá bài tập này?', 'Đồng ý', 'Huỷ bỏ', this._deleteCauHoi(index))
    }
    _deleteCauHoi = (nindex) => () => {
        const danhSachCauHoi = this.state.danhSachCauHoi.filter((item, index) => nindex !== index);
        this.setState({ danhSachCauHoi });
        Utils.nlog('bvcbcvbcvbcv')
    }
    _renderItemCauHoi4TL = (item) => {
        return (
            <TouchableOpacity onLongPress={() => this.deleteitem(item.index)}>
                <TouchableOpacity
                    onPress={() => this.suaCauHoi(item, item.index)}
                    style={{ position: 'absolute', right: 0, top: 0, backgroundColor: 'rgba(0,0,0,0)', alignItems: 'flex-end', zIndex: 3 }}>
                    <View style={[nstyles.nstyles.nIcon20, { borderRadius: sizes.reSize(10), backgroundColor: colors.white }]}>
                        <Image resizeMode='contain' style={[nstyles.nstyles.nIcon20, { tintColor: '#707070' }]} source={Images.icEdit} />
                    </View>
                </TouchableOpacity>
                <Text style={{ fontSize: sizes.fs(18), fontWeight: 'bold', paddingVertical: 8 }}>{item.index + 1}. {item.item.NoiDung}</Text>
                <Text style={stBaoBaiDetail.textCauHoi}>A. {item.item.DapAn1}</Text>
                <Text style={stBaoBaiDetail.textCauHoi}>B. {item.item.DapAn2}</Text>
                <Text style={stBaoBaiDetail.textCauHoi}>C. {item.item.DapAn3}</Text>
                <Text style={stBaoBaiDetail.textCauHoi}>D. {item.item.DapAn4}</Text>
            </TouchableOpacity>
        );
    }

    addCauHoi = () => {
        Utils.goscreen(this, 'Modal_AddCauHoi', {
            tenBaiKiemTra: this.state.tenBaiKiemTra,
            listCauHoi: this.state.listCauHoi,
            countCauHoi: this.state.danhSachCauHoi.length,
            dataReturn: this.dataReturnAddCauHoi,
            valueCauHoi: this.state.flagCauHoi,
            soCauHoi: this.state.soCauHoi
        });
    }
    dataReturnAddCauHoi = (flagCauHoi, item, tenBaiKiemTra, soCauHoi) => {
        this.setState({ listCauHoi: item, tenBaiKiemTra, flagCauHoi: flagCauHoi })
        Utils.nlog('-------------------------dsoCauHoi', soCauHoi)
        // Utils.nlog('-------------------------flagCauHoi', flagCauHoi)
        // Utils.nlog('-------------------------tenBaiKiemTra', tenBaiKiemTra)
        if (flagCauHoi == 0) {
            this.setState({ soCauHoi: soCauHoi })
        }
    }
    dataReturnCauhoi = (CauNoi, A, B, C, D, DapAn) => {
        let ds = this.state.danhSachCauHoi;
        ch = {
            "Loai": 1,
            "NoiDung": CauNoi,
            "DapAn1": A,
            "DapAn2": B,
            "DapAn3": C,
            "DapAn4": D,
            "DapAnDung": DapAn
        }
        ds.push(ch);
        this.setState({ danhSachCauHoi: ds })
    }



    themCauHoi = () => {
        Utils.goscreen(this, 'Modal_ThemCauHoiKiemTra', { countCauHoi: this.state.danhSachCauHoi.length, dataReturn: this.dataReturnCauhoi });

    }
    _getIDYoutube = (string) => {
        const index = string.indexOf('https://www.youtube.com/watch?v=');
        const index1 = string.indexOf('https://youtu.be/');
        if (index != -1 || index1 != -1) {
            if (index != -1) {
                this.idYoutube = string.slice(index + 1);
                return;
            };
            if (index1 != -1) {
                this.idYoutube = string.slice(index1 + 1);
                return;
            };
        }
    }


    render() {
        var { textGChu, listBB, checkBB, valuMonHoc, listMonHoc, textLink, IsCoBaiKiemTra, listCauHoi, linkVideo, tenVideo, tenBaiKiemTra, flagCauHoi, danhSachCauHoi } = this.state
        const { nrow, nIcon20 } = nstyles.nstyles;
        return (
            <View style={[nstyles.nstyles.ncontainerX, { backgroundColor: colors.whitegay }]}>
                <HeaderCom
                    nthis={this}
                    onPressLeft={this.goback}
                    iconLeft={Images.icBackBlue}
                    titleText={"Báo bài"}
                    titleStyle={{ color: colors.white, fontSize: sizes.reText(18) }}
                />
                <KeyboardAwareScrollView
                    extraHeight={50}
                    keyboardShouldPersistTaps={'always'}
                >
                    <View style={nstyles.nbody}>
                        <View style={{
                            paddingHorizontal: 15, backgroundColor: colors.white, marginHorizontal: this.khoangcach,
                            marginVertical: 15, borderBottomEndRadius: 6, borderBottomStartRadius: 6, paddingVertical: 15
                        }}>
                            <Text style={{ fontSize: sizes.reText(18), color: colors.azure, marginTop: 13 }}>Nhập báo bài</Text>
                            <View style={[nrow, stBaoBaiDetail.container]}>
                                <Text style={{ fontSize: sizes.fs(16), fontWeight: 'bold' }}>Môn học:</Text>
                                <View style={{ width: 5 }} />
                                <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 3 }}>
                                    {Platform.OS == 'ios' ?
                                        <View style={{ position: 'absolute', right: 5, top: 0, bottom: 0, justifyContent: 'center' }}>
                                            <Image source={Images.icDown} resizeMode='contain' style={[nstyles.nIcon20, { tintColor: '#A3A3A3' }]} />
                                        </View>
                                        : null
                                    }
                                    <Picker
                                        mode="dropdown"
                                        placeholder={'Chọn môn'}
                                        style={{ width: '100%', height: 30 }}
                                        textStyle={{ fontWeight: 'bold', fontSize: 15 }}
                                        selectedValue={valuMonHoc}
                                        onValueChange={(val) => {
                                            this.getListmonhoc(val);
                                        }}>
                                        {listMonHoc.map((item, index) =>
                                            <Picker.Item key={index} label={item.TenMonHoc} value={item.TenMonHoc} />
                                        )}
                                    </Picker>
                                </View>
                            </View>
                            <View style={{
                                borderColor: colors.veryLightPinkThree, borderWidth: 0.5,
                                paddingHorizontal: this.khoangcach, marginTop: 13, paddingBottom: 15
                            }}>
                                <TextInput
                                    editable={!this.state.checkFix}
                                    ref={ref => this.INPUT = ref}
                                    placeholder={'Nội dung'}
                                    multiline={true}
                                    style={{ flex: 1, textAlignVertical: 'top', minHeight: 80 }}
                                    onChangeText={(textGChu) => this.setState({ textGChu })}
                                    value={textGChu}
                                />
                                <View style={{ flexWrap: 'wrap', flex: 1, marginHorizontal: -this.khoangcach + 8 }}>
                                    {this.state.image ? <FlatList
                                        numColumns={2}
                                        data={this.state.image}
                                        scrollEnabled={false}
                                        renderItem={({ item, index }) => this._renderImage(item, index, this.state.image)}
                                        keyExtractor={item => item.uri}
                                        extraData={this.state.checkFix}
                                    /> : null}
                                </View>
                                {
                                    this.state.linkVideo == 'Link' ? null :
                                        <TouchableOpacity disabled={this.state.checkFix == true} style={{ flexDirection: 'row', alignItems: 'center' }}
                                            onPress={this._addLink}>
                                            <Image resizeMode='contain' style={nstyles.nstyles.nIcon30} source={Images.icLinkVideo} />
                                            <Text style={{ marginLeft: 10, flex: 1 }}>{this.state.tenVideo}</Text>
                                            {
                                                this.state.checkFix ? null : <TouchableOpacity style={{
                                                    backgroundColor: colors.colorGrayIcon, width: 20, height: 20,
                                                    borderRadius: 10, justifyContent: 'center', alignItems: 'center'
                                                }}
                                                    onPress={this._removeLink}>
                                                    <Image resizeMode='contain' style={nstyles.nstyles.nIcon16} source={Images.icCloseWhite} />
                                                </TouchableOpacity>
                                            }

                                        </TouchableOpacity>
                                }
                            </View>

                            <View style={[nrow, { justifyContent: 'space-between', marginTop: 13, paddingHorizontal: this.khoangcach }]}>
                                <TouchableOpacity disabled={this.state.checkFix == true} onPress={this._goMediapicker}>
                                    <Image resizeMode='contain' style={nstyles.nstyles.nIcon20} source={Images.icCameraBlack} />
                                </TouchableOpacity>
                                <TouchableOpacity disabled={this.state.checkFix == true} onPress={this._addLink}>
                                    <Image resizeMode='contain' style={[nstyles.nstyles.nIcon20, this.state.linkVideo == 'Link' ? {} : { tintColor: colors.greenBlue }]}
                                        source={Images.linkicon} />
                                </TouchableOpacity>
                                <TouchableOpacity disabled={this.state.checkFix == true} style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => this.setState({ IsCoBaiKiemTra: !IsCoBaiKiemTra })}>
                                    <View
                                        style={[nstyles.nstyles.nIcon12, nstyles.nstyles.nmiddle, {
                                            borderColor: 'black', borderWidth: 0.5, width: sizes.reSize(20), height: sizes.reSize(20),
                                            borderRadius: 2, backgroundColor: IsCoBaiKiemTra ? 'green' : 'white'
                                        }]}>
                                        <Image source={Images.icCheckBlue} style={{ width: sizes.reSize(18), height: sizes.reSize(18), tintColor: colors.white }}
                                            resizeMode='contain' />
                                    </View>
                                    <Text style={{ marginLeft: 5, fontWeight: 'bold' }}>Có bài kiểm tra</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.state.checkFix ? this._doneEditText(0) : this.PostBaoBai}
                                    style={[stBaoBaiDetail.containText, { backgroundColor: colors.colorGreenTwo1, alignSelf: 'flex-end', }]}>
                                    <Text style={[styles.text13, { color: colors.white }]}>{!this.state.checkFix ? 'Lưu' : 'Sửa'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    {IsCoBaiKiemTra ?
                        <TouchableOpacity
                            onPress={this.addCauHoi}
                            style={{
                                paddingHorizontal: 15, backgroundColor: colors.white, marginHorizontal: this.khoangcach,
                                marginBottom: 5, borderRadius: 6, paddingVertical: 15
                            }}>
                            <Text style={{ fontWeight: 'bold', color: 'green', textAlign: 'center' }}>{IsCoBaiKiemTra == true && tenBaiKiemTra == '' ? 'Thêm bài kiểm tra' : 'Sửa thông tin bài kiểm tra'}</Text>
                        </TouchableOpacity> : null
                    }

                    {/* <View>
                        <FlatList
                            scrollEnabled={false}
                            data={listCauHoi}
                            ref={refs => this.listCauHoi = refs}
                            renderItem={this._renderItemCauHoi}
                            extraData={listCauHoi}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View> */}
                    {listCauHoi != '' ?
                        <View style={{
                            paddingHorizontal: 15, backgroundColor: colors.white, marginHorizontal: this.khoangcach,
                            marginBottom: 5, borderRadius: 6, paddingVertical: 15
                        }}>
                            <Text style={{ fontWeight: 'bold', color: 'black', textAlign: 'center', marginBottom: 5 }}>Thông tin bài kiểm tra</Text>
                            <Text style={{ color: 'black', marginBottom: 5 }}>Tiêu đề: {tenBaiKiemTra}</Text>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={listCauHoi}
                                numColumns={2}
                                renderItem={this._renderItemCauHoi}
                                keyExtractor={(item, index) => index.toString()}
                                ItemSeparatorComponent={this.renderSeparator}
                                extraData={listCauHoi.length}
                            />
                        </View> : null}
                    {flagCauHoi == 1 && IsCoBaiKiemTra == true ?
                        <View style={{
                            paddingHorizontal: 15, backgroundColor: colors.white, marginHorizontal: this.khoangcach,
                            marginBottom: 5, borderRadius: 6, paddingVertical: 15
                        }}>
                            <Text style={{ fontWeight: 'bold', color: 'black', textAlign: 'center', marginBottom: 5 }}>Thông tin bài kiểm tra</Text>
                            <Text style={{ color: 'black', marginBottom: 5 }}>Tiêu đề: {tenBaiKiemTra}</Text>
                        </View> : null}
                    {IsCoBaiKiemTra == true && flagCauHoi == 1 ?
                        <TouchableOpacity
                            onPress={this.themCauHoi}
                            style={{
                                paddingHorizontal: 15, backgroundColor: colors.white, marginHorizontal: this.khoangcach,
                                marginBottom: 5, borderRadius: 6, paddingVertical: 15
                            }}>
                            <Text style={{ fontWeight: 'bold', color: 'green', textAlign: 'center' }}>Thêm câu hỏi</Text>
                        </TouchableOpacity> : null
                    }
                    {
                        danhSachCauHoi.length > 0 ?
                            <View style={{
                                paddingHorizontal: 15, backgroundColor: colors.white, marginHorizontal: this.khoangcach,
                                marginBottom: 5, borderRadius: 6, paddingVertical: 15
                            }}>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={danhSachCauHoi}
                                    renderItem={this._renderItemCauHoi4TL}
                                    keyExtractor={(item, index) => index.toString()}
                                    ItemSeparatorComponent={this.renderSeparator}
                                    extraData={danhSachCauHoi.length}
                                />
                            </View> : null
                    }


                    <View style={[nrow, { height: 55, justifyContent: 'center', marginTop: 10 }]}>
                        <ButtonCom
                            colorChange={[colors.lightSalmon, colors.salmonTwo]}
                            onPress={this.sendBaobai}
                            Linear={true}
                            text={"Hoàn thành"}
                            style={{ paddingHorizontal: 50, marginTop: 10 }}
                        />
                    </View>
                </KeyboardAwareScrollView>
                {
                    this.state.isLoading ? <View style={[nstyles.nstyles.nmiddle, { position: 'absolute', width: '100%', height: '100%', backgroundColor: colors.black_20 }]}>
                        <ActivityIndicator color={colors.white} size='large' />
                    </View> : null
                }
            </View >
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