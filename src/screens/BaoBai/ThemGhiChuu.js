import React, { Component } from "react";
import { View, TextInput, Text, Image, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import Utils from "../../app/Utils";
import { colors, sizes, nstyles } from "../../styles";
import HeaderCom from "../../components/HeaderCom";
import { Images } from "../../images/index";
import ButtonCom from "../../components/Button/ButtonCom";
import styles from './styles';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { BaoBaiSend, BaoBai_Send_App_V2 } from "../../apis/thanhtoan";
import { ROOTGlobal } from "../../app/data/dataGlobal";

export default class ThemGhiChuu extends Component {
    constructor(props) {
        super(props);
        this.valuListLop = Utils.ngetParam(this, 'valuListLop', '')
        this.type = Utils.ngetParam(this, 'type');
        this.listChild = Utils.ngetParam(this, 'listChild');
        this.nameLop = Utils.ngetParam(this, 'lop')
        nthis = this;
        this.khoangcach = 18;
        this.index = 0;
        this.id = 0;
        this.state = {
            date: "",
            namestudent: '',
            textGChu: '',
            image: [],
            isLoading: false,
            save: true
        };
    }
    _save = async () => {
        this.setState({ save: false })
    }
    _editText = () => {
        this.setState({ save: true }, this.INPUT.focus());
    }
    BaobaiHT = () => {
        switch (this.type) {
            case 1:
                Utils.goscreen(this, 'sc_BaoBaiHT', { type: 1, ghichu: 'ghichu', lop: this.nameLop, textGChu: this.state.textGChu });
                break;
            case 2:
                Utils.goscreen(this, 'sc_BaoBaiHT', { type: 2, ghichu: 'ghichu', lop: this.nameLop, textGChu: this.state.textGChu });
                break;
            case 3:
                Utils.goscreen(this, 'sc_BaoBaiHT', { type: 3, ghichu: 'ghichu', lop: this.nameLop, textGChu: this.state.textGChu });
                break;
            case 4:
                Utils.goscreen(this, 'sc_BaoBaiHT', { type: 4 });
                break;
            case 5:
                Utils.goscreen(this, 'sc_BaoBaiHT', { type: 5 });
                break;
            default:
                break;
        }

    }
    _titleType = () => {
        let title = '';
        switch (this.type) {
            case 1:
                title = 'Thêm thông báo';
                return title;
            case 2:
                title = 'Thêm ghi chú';
                return title;
            case 3:
                title = 'Thêm thông báo học phí';
                return title;
            case 4:
                title = 'Thêm nội dung thư mời';
                return title;
            case 5:
                title = 'Thêm kết quả học tập';
                return title
        };
    }
    _handleSend = async () => {
        const { image } = this.state;
        this.setState({ isLoading: true });
        const listLinkImage = [];
        if (image)
            for (let index = 0; index < image.length; index++) {
                const itemimg = image[index];
                const imgbase64 = await Utils.parseBase64(itemimg.uri, itemimg.height, itemimg.width);
                const objImage = {
                    strBase64: imgbase64,
                    filename: itemimg.idItem,
                    extension: "png",
                    IdUser: ROOTGlobal.dataUser.IdUser
                };
                listLinkImage.push(objImage);
            };
        // let tenthongbao = this.type == 4 ? 'Thư mời sự kiện' : this.type == 5 ? 'Kết quả học tập' : 'Báo bài'
        let tenthongbao = this.type == 4 ? 'Thư mời sự kiện' : this.type == 5 ? 'Kết quả học tập' : this.type == 1 ? 'Thông báo' : this.type == 3 ? 'Học phí' : 'Báo bài'
        let tieude = this.type == 1 ? 'Thông báo' : "Ghi chú"
        const listBB = [{
            TenThongBao: tenthongbao,
            IDThongBao: '',
            TieuDe: tieude,
            MonHoc: '',
            NoiDung: this.state.textGChu == '' ? 'Nội dung hình ảnh' : this.state.textGChu,
            HieuLucDen: '',
            IDLoai: this.type == 2 ? 5 : this.type == 4 ? 7 : this.type == 1 ? 1 : this.type == 3 ? 3 : 8, // 5 gắn cứng cho ghi chú
            IDChiNhanh: ROOTGlobal.IdCN,
            listLinkImage,
            IDLopHoc: this.valuListLop
        }];
        // IDLoai: 1: Thông báo
        // 2: Báo bài
        // 3: Thông báo học phí
        // 4: Thông báo điểm danh
        // 5: Ghi chú
        let res = await BaoBai_Send_App_V2(listBB, this.listChild, this.nameLop);
        if (res.status == 1) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Gửi nội dung thành công', 'OK', this.BaobaiHT);
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Có lỗi xảy ra vui lòng thử lại sau', 'OK');
        };
        this.setState({ isLoading: false });
    }

    sendBaobai = () => {
        var { save, textGChu, image } = this.state
        if (!textGChu && !image.length > 0) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Vui lòng nhập nội dung  hoặc chọn hình ảnh!', 'Đóng');
            return;
        };
        if (save) {
            Utils.showMsgBoxYesNo(this, 'Thông báo', 'Nội dung chưa được lưu, bạn có muốn lưu lại?', 'Đồng ý', 'Huỷ bỏ', this._save);
        } else
            Utils.showMsgBoxYesNo(this, 'Thông báo', 'Bạn có chắc chắn gửi nội dung này?', 'OK', 'Cancel', this._handleSend);
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
                // Utils.nlog('this.state.imagethis.state.imagethis.state.image', this.state.image)
                if (this.state.image.length == 0) {
                    this.setState({ image: res });
                } else {
                    let data = this.state.image;
                    data = data.concat(res);
                    this.setState({ image: data });
                }

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
            };
            imagesURL.push(obj);
        };

        Utils.goscreen(this, 'sc_ViewImageListShow', { ListImages: imagesURL, index });
    }

    _renderImage = ({ item, index }) => {
        var { save } = this.state
        return (
            <TouchableOpacity
                onPress={this._showAllImageHotel(this.state.image, index)} >
                <Image
                    resizeMode="cover" source={{ uri: item.uri }}
                    tintColorLeft={colors.black_11}
                    style={{ width: sizes.reSize(120), height: sizes.reSize(120), marginRight: 20, marginBottom: 5 }} />
                {
                    !save ? null : <TouchableOpacity
                        onPress={this._deleteImage(index)}
                        style={{ position: 'absolute', right: 20, top: 0, backgroundColor: 'rgba(0,0,0,0)', alignItems: 'flex-end', zIndex: 3 }}>
                        <View style={[nstyles.nstyles.nIcon20, { borderRadius: sizes.reSize(10), backgroundColor: colors.white }]}>
                            <Image resizeMode='contain' style={[nstyles.nstyles.nIcon20, { tintColor: '#707070' }]} source={Images.icCancelTour} />
                        </View>
                    </TouchableOpacity>
                }

            </TouchableOpacity>
        )

    }

    _deleteImage = (nindex) => () => {

        const image = this.state.image.filter((item, index) => nindex !== index);
        this.setState({ image });
    }

    render() {
        var { textGChu, save } = this.state
        const { nrow } = nstyles.nstyles;
        return (
            <View style={[nstyles.nstyles.ncontainerX, { backgroundColor: colors.whitegay }]}>
                <HeaderCom
                    nthis={this}
                    iconLeft={Images.icBackBlue}
                    titleText={this._titleType()}
                    titleStyle={{ color: colors.white, fontSize: sizes.reText(15) }}
                />
                {/* //body------- */}
                <KeyboardAwareScrollView
                    extraHeight={50}
                    keyboardShouldPersistTaps={'always'}>
                    <View style={nstyles.nbody}>
                        {/* {listBB.length < 1 ? */}
                        <View style={{
                            paddingHorizontal: 15, backgroundColor: colors.white, marginHorizontal: this.khoangcach,
                            marginVertical: 15, borderBottomEndRadius: 6, borderBottomStartRadius: 6, paddingVertical: 15
                        }}>
                            {save ? <Text style={{ fontSize: sizes.reText(18), color: colors.azure, marginTop: 13 }}>Thêm nội dung</Text>
                                :
                                <View style={stBaoBaiDetail.containText}>
                                    <Text style={stBaoBaiDetail.stext} numberOfLines={1}> nội dung</Text>
                                </View>
                            }

                            <View style={{
                                borderColor: colors.veryLightPinkThree, borderWidth: 0.5,
                                paddingHorizontal: this.khoangcach, marginTop: 13, paddingBottom: 20
                            }}>
                                <TextInput
                                    ref={ref => this.INPUT = ref}
                                    editable={save}
                                    placeholder={'Nội dung'}
                                    multiline={true}
                                    style={{ flex: 1, textAlignVertical: 'top', minHeight: 80 }}
                                    onChangeText={(textGChu) => this.setState({ textGChu })}
                                    value={textGChu}
                                />
                                <View style={{ flexWrap: 'wrap', flex: 1, marginHorizontal: -this.khoangcach + 8 }}>
                                    {this.state.image.length > 0 ? <FlatList
                                        numColumns={2}
                                        data={this.state.image}
                                        scrollEnabled={false}
                                        renderItem={this._renderImage}
                                        keyExtractor={item => item.uri}
                                        extraData={this.state.save}
                                    /> : null}
                                </View>
                            </View>
                            <View style={[nrow, { justifyContent: 'space-between', marginTop: 13, paddingHorizontal: this.khoangcach }]}>
                                {
                                    !save ? null :
                                        <TouchableOpacity
                                            onPress={this._goMediapicker}>
                                            <Image resizeMode='contain' style={nstyles.nstyles.nIcon20} source={Images.icCameraBlack} />
                                        </TouchableOpacity>
                                }
                                <TouchableOpacity onPress={save ? this._save : this._editText}
                                    style={[stBaoBaiDetail.containText, { backgroundColor: save ? colors.colorGreenTwo1 : colors.azure, alignSelf: 'flex-end', }]}>
                                    <Text style={[styles.text13, { color: colors.white }]}>{save ? 'Lưu' : 'Sửa'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                <View style={[nrow, { height: 55, justifyContent: 'center', marginBottom: 10 }]}>
                    <ButtonCom
                        colorChange={[colors.lightSalmon, colors.salmonTwo]}
                        onPress={this.sendBaobai}
                        Linear={true}
                        text={"Hoàn thành"}
                        style={{ paddingHorizontal: 50, marginTop: 10 }}
                    />
                </View>
                {this.state.isLoading ? <View style={[nstyles.nstyles.nmiddle, { position: 'absolute', width: '100%', height: '100%', backgroundColor: colors.black_20 }]}>
                    <ActivityIndicator color={colors.white} size='large' />
                </View> : null}
            </View>
        );
    }
    componentDidMount() {
        setTimeout(() => {
            this.INPUT.focus();
        }, 500);
    }
}

const stBaoBaiDetail = StyleSheet.create({
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
        fontWeight: '500',
        fontStyle: 'italic'
    },
    containText: {
        backgroundColor: colors.whitegay,
        alignSelf: 'flex-start',
        padding: 5,
        borderRadius: 3,
        paddingHorizontal: 10
    }
})