import React, { Component } from "react";
import { Text, View, Dimensions, TextInput, ActivityIndicator, TouchableOpacity, Image, FlatList, ScrollView } from "react-native";
import ButtonCom from "../../components/Button/ButtonCom";
import apis from '../../apis';
import Utils from "../../app/Utils";
import { colors, sizes, nstyles } from "../../styles";
import { BaoBaiSend } from '../../apis/thanhtoan';
import { Images } from "../../images";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const { width, height } = Dimensions.get("window");
import { ROOTGlobal } from "../../app/data/dataGlobal";

export default class ThongBaoHocPhi extends Component {
    constructor(props) {
        super(props);
        this.type = Utils.ngetParam(this, 'type');
        this.khoangcach = 18;
        this.ListHocSinh = Utils.ngetParam(this, "ListHocSinh");
        this.IDChiNhanh = Utils.ngetParam(this, "IDChiNhanh");
        this.state = {
            textGChu: '',
            isLoading: false,
            ObjThongBao: [],
            image: []
        };
        this.lop = Utils.ngetParam(this, 'lop')
    }
    _send = () => {
        this.setState({ isLoading: true }, this._CreateThongBao);
    };
    _CreateThongBao = async () => {
        var { textGChu, image } = this.state
        if (image.length > 0) {
            const res = await this._handelCreateThongBao();
            if (res.status == 1) {
                Utils.nlog('thong bao', res.data)
                this._handleSend(res.data, this.ListHocSinh);
            } else {
                Utils.showMsgBoxOK(this, 'Thông báo', 'Có lỗi xảy ra vui lòng thử lại sau', 'Đóng', this._goBack)
                this.setState({ isLoading: false });
            };
        }
        else if (textGChu.trim().length > 0) {
            const res = await this._handelCreateThongBao();
            Utils.nlog('Create thong bao', res)
            if (res.status == 1) {
                this._handleSend(res.data, this.ListHocSinh);
            } else {
                Utils.showMsgBoxOK(this, 'Thông báo', 'Có lỗi xảy ra vui lòng thử lại sau', 'Đóng', this._goBack)
                this.setState({ isLoading: false });
            };
        }
        else {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Vui lòng nhập nội dung thông báo');
            this.setState({ isLoading: false });
        };
    }

    _handleSend = async (IDThongBao, ListHocSinh) => {
        let listThongBao = [];
        IDThongBao.MonHoc = ''
        listThongBao.push(IDThongBao)
        let res = await BaoBaiSend(listThongBao, ListHocSinh, this.lop);
        Utils.nlog('resres', this.lop)
        if (res.status == 1) {
            Utils.goscreen(nthis, 'sc_BaoBaiHT', { type: this.type, textGChu: this.state.textGChu == '' ? 'Thông báo bằng hình ảnh' : this.state.textGChu, lop: this.lop });
            this._goBack();
        } else {
            Utils.showMsgBoxYesNo(this, 'Thông báo', 'Có lỗi xảy ra vui lòng thử lại', 'Đồng ý', 'Đóng', () => this._handleSend(IDThongBao), this._goBack);
        };
        this.setState({ isLoading: false });
    }
    _renderImage = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={this._showAllImageHotel(this.state.image, index)}>
                <Image
                    resizeMode="cover" source={{ uri: item.uri }}
                    tintColorLeft={colors.black_11}
                    style={{ width: sizes.reSize(120), height: sizes.reSize(120), marginRight: 20, marginBottom: 5 }} />
                <TouchableOpacity
                    onPress={this._deleteImage(index)}
                    style={{ position: 'absolute', right: 20, top: 0, backgroundColor: 'rgba(0,0,0,0)', alignItems: 'flex-end', zIndex: 3 }}>
                    <View style={[nstyles.nstyles.nIcon20, { borderRadius: sizes.reSize(10), backgroundColor: colors.white }]}>
                        <Image resizeMode='contain' style={[nstyles.nstyles.nIcon20, { tintColor: '#707070' }]} source={Images.icCancelTour} />
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        )

    }
    _showAllImageHotel = (arrImage, index) => () => {
        const imagesURL = [];
        for (let index = 0; index < arrImage.length; index++) {
            const item = arrImage[index];
            const obj = {
                url: item.uri,
                width: item.width,
                height: item.height
            };
            imagesURL.push(obj);
        };

        Utils.goscreen(this, 'sc_ViewImageListShow', { ListImages: imagesURL, index });
    }
    _deleteImage = (nindex) => () => {
        const image = this.state.image.filter((item, index) => nindex !== index);
        this.setState({ image });
    }
    _goMediapicker = (optionsCus) => {
        if (optionsCus == undefined || optionsCus == null)
            optionsCus = {};
        response = (res) => {
            if (res.iscancel) {
            }
            else if (res.error) {
            }
            else {
                this.setState({ image: res });
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
    };

    _handelCreateThongBao = async () => {
        const date = new Date().getDate();
        const month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();
        let image = [];
        if (this.state.image.length == 0) {
            image = [];
        } else {
            let listLinkImage = [];
            for (let index1 = 0; index1 < this.state.image.length; index1++) {
                const itemimg = this.state.image[index1];
                const imgbase64 = await Utils.parseBase64(itemimg.uri, itemimg.height, itemimg.width);
                const objImage = {
                    strBase64: imgbase64,
                    filename: itemimg.idItem,
                    extension: "png",
                    IdUser: ROOTGlobal.dataUser.IdUser,
                    src: "sample string 4",
                };
                listLinkImage.push(objImage);
            };
            image = listLinkImage;
        }
        let hieuluc = year + '/' + (month < 10 ? ('0' + month) : month) + '/' + (date < 10 ? '0' + date : date);
        const funnday = hieuluc;
        if (this.state.image.length == 0 && this.state.textGChu == '') {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Gửi thông báo phải có hình ảnh hoặc nội dung', 'ĐỒNG Ý')
            return;
        }
        let res = null;
        switch (this.type) {
            case 3: // Thông báo học phí
                res = await apis.Notifycation.ThongBaoCreate('Thông báo học phí', 'Thông báo', '', this.state.textGChu, this.type, parseInt(this.IDChiNhanh, 10), funnday, image);
                return res;
            case 1: // thong bao 
                res = await apis.Notifycation.ThongBaoCreate('Thông báo', 'Thông báo', '', this.state.textGChu == '' ? 'Thông báo bằng hình ảnh' : this.state.textGChu, this.type, parseInt(this.IDChiNhanh, 10), funnday, image);
                return res;
        };
    };
    _goBack = () => {
        Utils.goback(this)
    };
    render() {
        return (
            <View style={[{ flex: 1, alignItems: 'center' }]}>
                <View style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0, right: 0,
                    backgroundColor: colors.black_50
                }} />
                <KeyboardAwareScrollView extraHeight={50} keyboardShouldPersistTaps={'always'}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{
                            backgroundColor: colors.white, width: width * 0.88,
                            paddingHorizontal: 10, paddingBottom: this.khoangcach, alignItems: 'center', borderRadius: 4, marginTop: 100
                        }}>
                            <Text style={{ fontSize: sizes.reText(18), color: colors.azure, marginTop: 20, fontWeight: 'bold', textAlign: 'center' }}>THÔNG BÁO</Text>
                            <View style={{
                                borderColor: colors.veryLightPinkThree, borderWidth: 0.5, marginVertical: 20,
                                width: width * 0.7, flex: 1, borderRadius: 6, height: height * 0.4,
                            }}>
                                <TextInput
                                    placeholder={'Nội dung'}
                                    multiline={true}
                                    style={{ marginLeft: 5, textAlignVertical: 'top', paddingVertical: 10 }}
                                    onChangeText={(textGChu) => this.setState({ textGChu })}
                                    value={this.state.textGChu} />
                                <View style={{ flexWrap: 'wrap', flex: 1 }}>
                                    {this.state.image ? <FlatList
                                        numColumns={2}
                                        data={this.state.image}
                                        renderItem={this._renderImage}
                                        keyExtractor={item => item.uri}
                                    /> : null}
                                </View>
                            </View>

                            <View style={[nstyles.nstyles.nrow, { justifyContent: 'space-around', marginBottom: 10 }]}>
                                <TouchableOpacity style={{ alignSelf: 'flex-start', marginLeft: 30, top: -10, flex: 1 }} onPress={this._goMediapicker}>
                                    <Image resizeMode='contain' style={nstyles.nstyles.nIcon20} source={Images.icCameraBlack} />
                                </TouchableOpacity>
                                <View>
                                    <ButtonCom
                                        colorChange={[colors.lightSalmon, colors.salmonTwo]}
                                        onPress={this._send}
                                        Linear={true}
                                        text={"GỬI"}
                                        style={{ paddingHorizontal: 60, marginRight: 30 }}
                                    />
                                    <View style={{ height: 5 }} />
                                    <ButtonCom
                                        colorChange={[colors.lightSalmon, colors.salmonTwo]}
                                        onPress={this._goBack}
                                        Linear={true}
                                        text={"HUỶ"}
                                        style={{ paddingHorizontal: 60, marginRight: 30 }}
                                    />
                                </View>
                            </View>
                            {this.state.isLoading ? <View style={[nstyles.nstyles.nmiddle, { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: colors.black_20 }]}>
                                <ActivityIndicator color='white' size='large' />
                            </View> : null}
                        </View>
                    </ScrollView>
                </KeyboardAwareScrollView>
            </View>
        );
    }
}