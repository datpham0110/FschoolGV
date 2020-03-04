import React, { Component, Fragment } from "react";
import { colors, sizes, nstyles } from "../../styles";
import { Text, View, FlatList, Image, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from "react-native";
import ButtonCom from "../../components/Button/ButtonCom";
import Utils from "../../app/Utils";
import HeaderCom from "../../components/HeaderCom";
import { Images } from "../../images";
import { ListLop } from "../../apis/thanhtoan";
import { Picker } from "native-base";
import { ROOTGlobal } from "../../app/data/dataGlobal";
import apis from "../../apis";
import ListEmpty from '../../components/ListEmpty';
import { RootLang } from "../../app/data/locales";
import moment from "moment";
import { appConfig } from "../../app/Config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default class ThoiKhoaBieuHome extends Component {
    constructor(props) {
        super(props);
        this.textTitle = ''
        this.checkEdit = false;
        this.IDLopHoc = null;
        this.state = {
            listLop: [],
            valuListTruong: ROOTGlobal.IdCN,
            valuListLop: 'Mam non',
            image: undefined,
            listThoiKhoaBieu: [],
            txtEmpty: RootLang.lang.loading,
            edit: [],
            isLoading: false
        };
    }
    componentDidMount() {
        this.DSLop();
    }
    DSLop = async () => {
        let res = await ListLop(this.state.valuListTruong);
        Utils.nlog('da lop', res)
        if (res.status == 1) {
            listLop = res.data;
            this.IDLopHoc = listLop[0].IDNhomKH;
            const listThoiKhoaBieu = await this._fetchListThoiKhoaBieu(listLop[0].IDNhomKH);
            this.setState({ listLop, valuListLop: listLop[0].IDNhomKH, listThoiKhoaBieu, txtEmpty: 'Không có dữ liệu' });
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', res.error.message)
        };
    }

    GetHocSinhList = async (valIdLop) => {
        this.IDLopHoc = valIdLop;
        const listThoiKhoaBieu = await this._fetchListThoiKhoaBieu(valIdLop);
        this.setState({ valuListLop: valIdLop, listThoiKhoaBieu });
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
            onPress={this._showAllImageHotel(arrImages, index)}>
            <Image
                resizeMode="cover" source={{ uri: item.uri }}
                tintColorLeft={colors.black_11}
                style={{ width: sizes.reSize(120), height: sizes.reSize(120), marginRight: 20, marginBottom: 15 }} />
            <TouchableOpacity
                onPress={this._goMediapicker}
                style={{ position: 'absolute', right: 20, top: 0, backgroundColor: 'rgba(0,0,0,0)', alignItems: 'flex-end', zIndex: 3 }}>
                <View style={[nstyles.nstyles.nIcon20, { borderRadius: sizes.reSize(10), backgroundColor: colors.white }]}>
                    <Image resizeMode='contain' style={[nstyles.nstyles.nIcon20, { tintColor: '#707070' }]} source={Images.icEdit} />
                </View>
            </TouchableOpacity>
        </TouchableOpacity>

    _deleteImage = () => {
        this.setState({ image: [] });
    }

    _showAllImageHotel = (arrImage, index) => () => {
        const imagesURL = [];
        if (!Array.isArray(arrImage)) {
            const obj = {
                url: `${appConfig.domain}${arrImage}`,
                // width: item.width,
                // height: item.height
                // Optional, if you know the image size, you can set the optimization performance
            };
            imagesURL.push(obj);
        } else
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

    _fetchListThoiKhoaBieu = async (idLop) => {
        const res = await apis.ThoiKhoaBieu.ListThoiKhoaBieu(idLop);
        Utils.nlog('ds thoi khoa bieu', res)
        if (res.status == 1) {
            const data = res.data;
            return data;
        } else return [];
    }

    _addThoiKhoaBieu = () => {
        Utils.goscreen(this, 'sc_newThoiKhoaBieu', { IDLopHoc: this.IDLopHoc, _callBack: this._callBack });
    }

    _callBack = async (valIdLop) => {
        const listThoiKhoaBieu = await this._fetchListThoiKhoaBieu(valIdLop);
        this.setState({ listThoiKhoaBieu });
    }

    _edit = (index, item) => () => {
        if (this.checkEdit) {
            this.checkEdit = false;
            if (item.TieuDe !== this.textTitle || this.state.image) {
                if (this.textTitle.trim().length == 0) {
                    Utils.showMsgBoxOK(this, 'Thông báo', 'Tiêu đề thời khoá biểu không được để trống', 'Đóng');
                    return;
                } else {
                    this._updateThoiKhoaBieu(item);
                    this.setState({ edit: [], image: undefined, isLoading: true });
                }

            } else
                this.setState({ edit: [] });
        } else {
            this.checkEdit = true;
            this.textTitle = item.TieuDe;
            this.setState({ edit: [index] });
        };
    };

    _updateThoiKhoaBieu = async (item) => {
        const { image } = this.state;
        let objImage = '';
        if (image) {
            const strBase64 = await Utils.parseBase64(image[0].uri, image[0].height, image[0].width);
            objImage = {
                strBase64,
                filename: image[0].idItem ? image[0].idItem : new Date(),
                extension: "png",
            };
        };
        const res = await apis.ThoiKhoaBieu.UpdateThoiKhoaBieu(item.IDRow, item.IDLopHoc, this.textTitle, objImage, !objImage ? false : true);
        Utils.nlog('update tkb', res)
        if (res.status == 1) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Cập nhật thời khoá biểu thành công', 'Đóng', () => this.GetHocSinhList(item.IDLopHoc));
            this.setState({ isLoading: false });
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', `${res.error.message}, vui lòng thử lại`, 'Đóng');
            this.setState({ isLoading: false });
        };
    }

    _renderItemListTKB = ({ item, index, arrImages }) => {
        const { edit, image } = this.state;
        return <Fragment>
            <View style={[nstyles.nstyles.nrow, { paddingHorizontal: 20, backgroundColor: colors.white, marginTop: 10, paddingVertical: 20 }]}>
                <View style={{ flex: 1, paddingRight: 20 }}>
                    <TextInput
                        ref={ref => this.REF = ref}
                        onChangeText={this._onChangeText}
                        editable={this.state.edit.includes(index)}
                        style={{ fontSize: sizes.reText(14), fontWeight: '700', borderBottomWidth: edit.includes(index) ? 0.5 : 0, borderBottomColor: 'red' }}>{item.TieuDe}</TextInput>
                    <Text style={{ fontSize: sizes.reText(12), color: colors.black_60, fontStyle: 'italic', marginTop: 5 }}>{`Cập nhật lúc ${moment(item.ModifiedDate ? item.ModifiedDate : item.NgayTao).format('HH:mm')}, ${moment(item.ModifiedDate ? item.ModifiedDate : item.NgayTao).format('DD/MM/YYYY')}`}</Text>
                </View>
                <TouchableOpacity
                    onPress={this._edit(index, item)}
                    style={{ paddingVertical: 4, backgroundColor: colors.azure, paddingHorizontal: 10, alignSelf: 'center', borderRadius: 3 }}>
                    <Text style={{ color: colors.white, fontSize: sizes.reText(13) }}>{edit.includes(index) ? 'Xong' : 'Sửa'}</Text>
                </TouchableOpacity>
            </View>
            {
                !image || !edit.includes(index) ? <TouchableOpacity
                    style={{ width: sizes.reSize(120), height: sizes.reSize(120), marginBottom: 15, marginLeft: 20 }}
                    onPress={this._showAllImageHotel(item.LinkHinh, 0)}>
                    <Image
                        resizeMode="cover"
                        source={{ uri: `${appConfig.domain}${item.LinkHinh}` + '?' + new Date() }}
                        tintColorLeft={colors.black_11}
                        style={{ width: sizes.reSize(120), height: sizes.reSize(120) }}
                    />

                    {
                        edit.includes(index) ? <TouchableOpacity
                            onPress={this._goMediapicker}
                            style={{ position: 'absolute', right: 0, top: 0, backgroundColor: 'rgba(0,0,0,0)', alignItems: 'flex-end', zIndex: 3 }}>
                            <View style={[nstyles.nstyles.nIcon20, { borderRadius: sizes.reSize(10), backgroundColor: colors.white }]}>
                                <Image resizeMode='contain' style={[nstyles.nstyles.nIcon20, { tintColor: '#707070' }]} source={Images.icEdit} />
                            </View>
                        </TouchableOpacity> : null
                    }

                </TouchableOpacity> : null
            }
            {edit.includes(index) && image ? <FlatList
                style={{ marginTop: 20, marginLeft: 20 }}
                numColumns={2}
                data={image}
                scrollEnabled={false}
                renderItem={({ item, index }) => this._renderImage(item, index, this.state.image)}
                keyExtractor={item => item.uri}

            /> : null}
            <View style={{ height: 0.5, backgroundColor: colors.black_20, marginHorizontal: 20 }} />
        </Fragment >

    }


    render() {
        const { listLop, valuListLop } = this.state;
        const { nrow } = nstyles.nstyles;

        return (
            <View style={[nstyles.nstyles.ncontainerX, { backgroundColor: colors.BackgroundHome }]}>
                <HeaderCom
                    nthis={this}
                    iconLeft={Images.icbackspace}
                    titleText={"Thời khoá biểu"}
                />


                <View style={[nstyles.nstyles.nbody, { paddingHorizontal: nstyles.khoangcach }]}>
                    <KeyboardAwareScrollView
                        showsVerticalScrollIndicator={false}
                        extraHeight={50}
                        keyboardShouldPersistTaps={'always'}
                    >
                        <View style={[nrow, { backgroundColor: colors.white, borderRadius: 6, marginTop: 24, paddingVertical: nstyles.khoangcach }]}>
                            <View style={[nrow, styles.container]}>
                                {Platform.OS == 'ios' ?
                                    <View style={{ position: 'absolute', right: 5, top: 0, bottom: 0, justifyContent: 'center' }}>
                                        <Image source={Images.icDown} resizeMode='contain' style={[nstyles.nIcon20, { tintColor: '#A3A3A3' }]} />
                                    </View>
                                    : null
                                }
                                <Picker
                                    mode="dropdown"
                                    placeholder={'Chọn lớp'}
                                    style={{ width: nstyles.Width(100), height: 30 }}
                                    textStyle={{ fontWeight: 'bold', fontSize: 15 }}
                                    selectedValue={valuListLop}
                                    onValueChange={(val) => {
                                        this.GetHocSinhList(val);
                                    }}>
                                    {listLop.map((item, index) =>
                                        <Picker.Item key={index} label={item.TenNhomKH} value={item.IDNhomKH} />
                                    )}
                                </Picker>
                            </View>
                        </View>
                        <View style={{ flex: 1, backgroundColor: colors.white, marginTop: 10 }}>
                            <FlatList
                                scrollEnabled={false}
                                extraData={this.state.isLoading}
                                style={{ flex: 1 }}
                                data={this.state.listThoiKhoaBieu}
                                renderItem={this._renderItemListTKB}
                                keyExtractor={(item, index) => `${index}`}
                                ListEmptyComponent={<ListEmpty textempty={this.state.txtEmpty} />}
                            />
                        </View>
                    </KeyboardAwareScrollView>
                </View>
                <ButtonCom
                    onPress={this._addThoiKhoaBieu}
                    Linear={true}
                    style={{ marginTop: 10, backgroundColor: colors.colorPink, alignSelf: 'center', paddingHorizontal: 40 }}
                    text={"Thêm mới thời khoá biểu"}
                />
                {this.state.isLoading ? <View style={[nstyles.nstyles.nmiddle, { top: 0, bottom: 0, left: 0, right: 0, backgroundColor: colors.black_20, position: 'absolute' }]}>
                    <ActivityIndicator size='large' color={colors.white} />
                </View> : null}
            </View >
        );
    }
}

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        alignItems: 'center',
    },
    container: {
        backgroundColor: colors.whitegay,
        paddingVertical: 8,
        borderRadius: 6,
        flex: 1,
        marginHorizontal: 20
    }
});
          // marginHorizontal: -this.khoangcach + 8
