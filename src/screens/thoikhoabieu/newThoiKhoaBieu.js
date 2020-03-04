import React, { Component } from "react";
import { colors, sizes, nstyles } from "../../styles";
import { Text, View, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import ButtonCom from "../../components/Button/ButtonCom";
import Utils from "../../app/Utils";
import HeaderCom from "../../components/HeaderCom";
import { Images } from "../../images";

import { TextInput } from "react-native-gesture-handler";
import apis from "../../apis";

export default class newThoiKhoaBieu extends Component {
    constructor(props) {
        super(props);
        this.textTitle = ''

        this.IDLopHoc = Utils.ngetParam(this, 'IDLopHoc');
        this.callback = Utils.ngetParam(this, '_callBack');
        this.state = {
            listLop: [],
            image: undefined,
            listThoiKhoaBieu: [],
            isLoading: false
        };
    }


    _goMediapicker = (optionsCus) => {
        //Keyboard.dismiss();
        if (optionsCus == undefined || optionsCus == null)
            optionsCus = {};
        //--Open dialog choose media - ncustom
        response = (res) => {
            Utils.nlog('images', res)
            if (res.iscancel) {
                //--ko chon item or back

            }
            else if (res.error) {
                //--lỗi khi chon media
            }
            else {
                // const listImages = this.state.listImages.concat(res)
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
            multi: false,// chọn 1 or nhiều item
            response: response, // callback giá trị trả về khi có chọn item
            limitCheck: -1, //gioi han sl media chon: -1 la khong co gioi han, >-1 la gioi han sl =  limitCheck
            ...optionsCus
        };
        Utils.goscreen(this, 'Modal_MediaPicker', options);
        //--End dialog media
    };

    _onChangeText = (text) => {
        this.textTitle = text;
    }

    _renderImage = (item, index, arrImages) =>
        <TouchableOpacity
            onPress={this._showAllImageHotel(arrImages, index)}
        >
            <Image
                resizeMode="cover" source={{ uri: item.uri }}
                tintColorLeft={colors.black_11}
                style={{ width: sizes.reSize(120), height: sizes.reSize(120), marginRight: 20, marginBottom: 15 }} />
            <TouchableOpacity
                onPress={this._deleteImage}
                style={{ position: 'absolute', right: 20, top: 0, backgroundColor: 'rgba(0,0,0,0)', alignItems: 'flex-end', zIndex: 3 }}>
                <View style={[nstyles.nstyles.nIcon20, { borderRadius: sizes.reSize(10), backgroundColor: colors.white }]}>
                    <Image resizeMode='contain' style={[nstyles.nstyles.nIcon20, { tintColor: '#707070' }]} source={Images.icCancelTour} />
                </View>
            </TouchableOpacity>
        </TouchableOpacity>

    _deleteImage = () => {
        this.setState({ image: [] });
    }

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



    _addThoiKhoaBieu = async () => {
        this.setState({ isLoading: true });
        if (!this.textTitle) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Vui lòng nhập vào tiêu đề', 'Đóng');
            this.setState({ isLoading: false });
            return;
        };
        if (!this.state.image) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Vui lòng chọn file để hoàn tất', 'Đóng');
            this.setState({ isLoading: false });
            return;
        };
        const { image } = this.state;
        const strBase64 = await Utils.parseBase64(image[0].uri, image[0].height, image[0].width);
        const objImage = {
            strBase64,
            filename: image[0].idItem,
            extension: "png",
        };
        const res = await apis.ThoiKhoaBieu.CreateThoiKhoaBieu(this.IDLopHoc, this.textTitle, objImage);
        if (res.status == 1) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Tạo thời khoá biểu hoàn tất', 'Đóng', this._succsess);

        } else
            Utils.showMsgBoxOK(this, 'Thông báo', 'Có lỗi xảy ra, vui lòng thử lại', 'Đóng');
        Utils.nlog('create thoi khao bieu', res)
        this.setState({ isLoading: false });
    }

    _succsess = () => {
        this.callback(this.IDLopHoc);
        this.textTitle = '';
        this.setState({ image: undefined })
        Utils.goback(this)
    }

    componentDidMount() {
        setTimeout(() => {
            this.INPUT.focus();
        }, 500);
    }


    render() {
        const { listLop, valuListLop } = this.state;
        const { nrow } = nstyles.nstyles;

        return (
            <View style={[nstyles.nstyles.ncontainerX, { backgroundColor: colors.BackgroundHome }]}>
                <HeaderCom
                    nthis={this}
                    iconLeft={Images.icbackspace}
                    titleText={"Thời khoá biểu"} />
                <View style={[nstyles.nstyles.nbody, { paddingHorizontal: nstyles.khoangcach }]}>
                    <View style={{ backgroundColor: colors.white, paddingHorizontal: 20, marginTop: 10, flex: 1, paddingTop: 20 }}>
                        <Text style={{ fontSize: sizes.reText(18), fontWeight: '700', color: colors.softBlue }}>Nhập thời khoá biểu mới</Text>
                        <View style={{ borderBottomColor: colors.black_20, borderBottomWidth: 0.5, paddingBottom: 3, marginTop: 10 }}>
                            <TextInput
                                ref={ref => this.INPUT = ref}
                                placeholder={'Tiêu đề'}
                                style={{ paddingVertical: 0, fontSize: sizes.reText(14) }}
                                onChangeText={this._onChangeText}
                            >{this.textTitle}</TextInput>
                        </View>
                        <TouchableOpacity
                            onPress={this._goMediapicker}
                            style={{ paddingVertical: 8, borderWidth: 0.5, borderRadius: 3, borderColor: colors.black_20, marginTop: 10 }}>
                            <Text style={{ fontSize: sizes.reText(13), color: colors.black_50, textAlign: 'center' }}>Đường dẫn file</Text>
                        </TouchableOpacity>

                        {this.state.image ? <FlatList
                            style={{ marginTop: 20 }}
                            numColumns={2}
                            data={this.state.image}
                            scrollEnabled={false}
                            renderItem={({ item, index }) => this._renderImage(item, index, this.state.image)}
                            keyExtractor={item => item.uri}
                        /> : null}
                    </View>

                    <ButtonCom
                        onPress={this._addThoiKhoaBieu}
                        Linear={true}
                        style={{ marginTop: 10, backgroundColor: colors.colorPink, alignSelf: 'center', paddingHorizontal: 40 }}
                        text={"Hoàn thành"}
                    />
                    {this.state.isLoading ? <View style={[nstyles.nstyles.nmiddle, { top: 0, bottom: 0, left: 0, right: 0, position: 'absolute' }]}>
                        <ActivityIndicator size='large' color={colors.black_50} />
                    </View> : null}
                </View>

            </View >
        );
    }
}