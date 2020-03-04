import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { Dimensions } from 'react-native';
import { colors, sizes } from '../../styles';
import { reText } from '../../styles/size';
import Utils from '../../app/Utils';
import { nstyles } from '../../styles/styles';
import HeaderCom from '../../components/HeaderCom';
import { Images } from '../../images';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ButtonCom from '../../components/Button/ButtonCom';
import { HoatDong_Create } from '../../apis/gocHoatDong';
const { height } = Dimensions.get('window');

class AddGocHoatDong extends Component {
    constructor(props) {
        super(props);
        this.onRefresh = Utils.ngetParam(this, '_onRefresh', () => { })
        this.state = {
            textGChu: '',
            textTitle: '',
            textContent: '',
            image: [],
            isLoading: false,
        };
        this.classSelected = Utils.ngetParam(this, "classSelected")
    }
    componentDidMount() {
        Utils.nlog('classSelected', this.classSelected)
    }
    _renderImage = ({ item, index }) => {
        var { save } = this.state
        return (
            <TouchableOpacity
                // disabled={!this.state.save}
                // onLongPress={this._deleteImage(index)}
                onPress={this._showAllImageHotel(this.state.image, index)}  >
                <Image
                    resizeMode="cover" source={{ uri: item.uri }}
                    tintColorLeft={colors.black_11}
                    style={{ width: sizes.reSize(93), height: sizes.reSize(64), marginRight: 20, marginBottom: 5 }} />
                <TouchableOpacity
                    // disabled={!save}
                    onPress={this._deleteImage(index)}
                    style={{ position: 'absolute', right: 20, top: 0, backgroundColor: 'rgba(0,0,0,0)', alignItems: 'flex-end', zIndex: 3 }}>
                    <View style={[nstyles.nIcon20, { borderRadius: sizes.reSize(10), backgroundColor: colors.white }]}>
                        <Image resizeMode='contain' style={[nstyles.nIcon20, { tintColor: '#707070' }]} source={Images.icCancelTour} />
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
                // Optional, if you know the image size, you can set the optimization performance
            };
            imagesURL.push(obj);
        };

        Utils.goscreen(this, 'sc_ViewImageListShow', { ListImages: imagesURL, index });
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
    _deleteImage = (nindex) => () => {
        const image = this.state.image.filter((item, index) => nindex !== index);
        this.setState({ image });
    }
    _post = async (infoUser) => {
        //HoatDong_Create
        if (this.state.textTitle.trim().length == 0) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Tiêu đề không được để trống', 'Đóng')
        }
        if (this.state.textContent.trim().length == 0) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Nội dung không được để trống', 'Đóng')
        }
        this.setState({ isLoading: true });
        let img = []
        if (this.state.image.length > 0) {
            for (let index1 = 0; index1 < this.state.image.length; index1++) {
                const itemimg = this.state.image[index1];
                const imgbase64 = await Utils.parseBase64(itemimg.uri, itemimg.height, itemimg.width);
                const objImage = {
                    strBase64: imgbase64,
                    filename: itemimg.idItem,
                    extension: "png",
                    // IdUser: ROOTGlobal.dataUser.IdUser
                };
                img.push(objImage);
            };
        }

        let res = await HoatDong_Create(this.classSelected.IDNhomKH, this.classSelected.TenNhomKH, infoUser.FullName, this.state.textTitle, this.state.textContent, img)
        Utils.nlog('HoatDong_Create', res)
        if (res.status == 1) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Đăng bài thành công', 'Đóng',
                () => {

                    this._goBack(this)
                })
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Đăng bài thất bại vui lòng kiểm tra lại', 'Đóng')

        }
        this.setState({ isLoading: false });
    }
    _goBack = () => {
        this.onRefresh();
        Utils.goback(this)
    };
    render() {
        const { infoUser } = this.props;
        var { listLop, valuListLop } = this.state
        return (
            <View style={nstyles.ncontainerX}>
                <HeaderCom
                    iconLeft={Images.icBackBlue}
                    nthis={this}
                    titleText={'Góc hoạt động'}
                />
                <KeyboardAwareScrollView extraHeight={50}
                    keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false}
                    style={[nstyles.nbody, { backgroundColor: colors.whitegay, marginTop: 15, marginHorizontal: 20 }]}>
                    <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 4 }}>
                        <Text style={{ color: '#29a9e0', fontSize: sizes.fs(14), fontWeight: 'bold' }}>
                            Tiêu đề
                        </Text>
                        <View style={{ borderWidth: 1, borderRadius: 6, marginLeft: 7, padding: 5, borderColor: '#b8b8b8', marginTop: 8 }}>
                            <TextInput
                                placeholder={'Tiêu đề các hoạt động lớp học hôm nay'}
                                multiline={true}
                                style={{ marginLeft: 5, textAlignVertical: 'top', minHeight: height * 0.08 }}
                                onChangeText={(textTitle) => this.setState({ textTitle })}
                                value={this.state.textTitle}
                            />
                        </View>
                    </View>
                    <View style={{ backgroundColor: 'white', padding: 20, marginVertical: 15, borderRadius: 4 }}>
                        <Text style={{ color: '#29a9e0', fontSize: sizes.fs(14), fontWeight: 'bold' }}>
                            Nội dung
                        </Text>
                        <View style={{ borderWidth: 1, borderRadius: 6, marginLeft: 7, padding: 5, borderColor: '#b8b8b8', marginTop: 8 }}>
                            <TextInput
                                placeholder={'Các hoạt động hôm nay của lớp'}
                                multiline={true}
                                style={{ marginLeft: 5, textAlignVertical: 'top', minHeight: height * 0.08 }}
                                onChangeText={(textContent) => this.setState({ textContent })}
                                value={this.state.textContent}
                            />
                        </View>
                    </View>
                    <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 4 }}>
                        <Text style={{ color: '#29a9e0', fontSize: sizes.fs(14), fontWeight: 'bold' }}>
                            Hình ảnh hoạt động
                        </Text>
                        <View style={{ height: 1, backgroundColor: '#b8b8b8', opacity: 0.4, marginVertical: 8 }} />
                        <View style={nstyles.nrow}>
                            <View style={{ flexWrap: 'wrap' }}>
                                {this.state.image.length > 0 ? <FlatList
                                    numColumns={2}
                                    data={this.state.image}
                                    scrollEnabled={false}
                                    renderItem={this._renderImage}
                                    keyExtractor={item => item.uri}
                                    extraData={this.state.save}
                                /> : null}
                            </View>
                            <TouchableOpacity onPress={this._goMediapicker} style={{
                                flex: 1,
                                borderWidth: 1, borderRadius: 6, marginLeft: 7, width: '30%',
                                padding: 10, borderColor: '#b8b8b8', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Image source={Images.icaddpicture} />
                                <Text style={{ color: '#cccccc', fontSize: sizes.fs(10) }}>Thêm hình ảnh</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                    <View style={[nstyles.nrow, { justifyContent: 'center', alignItems: 'center' }]}>
                        <ButtonCom
                            onPress={() => Utils.goback(this)}
                            text={"Huỷ"}
                            // disabled={!this.state.flagCapNhat}
                            txtStyle={{ color: '#00b096' }}
                            style={{ paddingHorizontal: 50, marginTop: 10, marginBottom: 25, borderColor: '#00b096', borderWidth: 1 }} />
                        <View style={{ width: 20 }} />
                        <ButtonCom
                            onPress={() => this._post(infoUser)}
                            text={"Cập nhật"}
                            // disabled={!this.state.flagCapNhat}
                            txtStyle={{ color: 'white' }}
                            style={{ paddingHorizontal: 30, backgroundColor: '#00b096', marginTop: 10, marginBottom: 25 }} />
                    </View>
                </KeyboardAwareScrollView>
                {this.state.isLoading ? <View style={[nstyles.nmiddle, { position: 'absolute', width: '100%', height: '100%', backgroundColor: colors.black_20 }]}>
                    <ActivityIndicator color={colors.white} size='large' />
                </View> : null}
            </View>
        );
    }
}

const mapStateToProps = state => ({
    infoUser: state.infoUser
});

export default Utils.connectRedux(AddGocHoatDong, mapStateToProps, true);

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
