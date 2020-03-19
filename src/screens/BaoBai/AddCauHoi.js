import React, { Component, Fragment } from "react";
import { View, TouchableOpacity, Text, Image, TextInput, FlatList, Dimensions, StyleSheet, Platform } from "react-native";
import Utils from "../../app/Utils";
import { colors, sizes, nstyles } from "../../styles";
import HeaderCom from "../../components/HeaderCom";
import { Images } from "../../images/index";
import DatePick from '../../components/DatePick';
import ButtonCom from "../../components/Button/ButtonCom";
import styles from './styles';
const { width } = Dimensions.get("window");
import { Picker } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default class AddCauHoi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textGChu: Utils.ngetParam(this, 'tenBaiKiemTra', ''),
            image: Utils.ngetParam(this, 'listCauHoi', undefined),
            soCauHoi: Utils.ngetParam(this, 'soCauHoi', ''),
            valueCauHoi: Utils.ngetParam(this, 'valueCauHoi') == -1 ? 0 : Utils.ngetParam(this, 'valueCauHoi')
        }
        this.countCauHoi = Utils.ngetParam(this, 'countCauHoi');
        this.dataReturn = Utils.ngetParam(this, 'dataReturn', () => { });
        this.valueLoaiBaiKK = [{
            id: 0, title: 'Hình ảnh'
        }, {
            id: 1, title: 'Câu hỏi trắc nghiệm'
        }]
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
    _deleteImage = (nindex) => () => {
        const image = this.state.image.filter((item, index) => nindex !== index);
        this.setState({ image });
    }
    _themCauHoi = () => {
        Utils.nlog('-------------- _themCauHoi', this.state.image)
        if (this.state.textGChu == '') {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn phải thêm tiêu đề cho bài kiểm tra', 'Đóng')
            return;
        }
        if (this.state.valueCauHoi == 0) {
            if (this.state.soCauHoi == 0) {
                Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn phải thêm số câu hỏi cho bài kiểm tra', 'Đóng')
                return;
            }
            if (this.state.image == undefined || this.state.image == '') {
                Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn phải thêm hình ảnh cho bài kiểm tra', 'Đóng')
                return;
            }

        } else {

        }
        this.dataReturn(this.state.valueCauHoi, this.state.image, this.state.textGChu, this.state.soCauHoi);
        Utils.goback(this)
    }
    _renderImage = (item, index, arrImages) =>
        <TouchableOpacity onPress={this._showAllImageHotel(arrImages, index)}>
            <Image
                resizeMode="cover" source={{ uri: item.uri }}
                tintColorLeft={colors.black_11}
                style={{ width: sizes.reSize(120), height: sizes.reSize(120), marginRight: 20, marginBottom: 15 }} />
            <TouchableOpacity
                onPress={this._deleteImage(index)}
                style={{ position: 'absolute', right: 20, top: 0, backgroundColor: 'rgba(0,0,0,0)', alignItems: 'flex-end', zIndex: 3 }}>
                <View style={[nstyles.nstyles.nIcon20, { borderRadius: sizes.reSize(10), backgroundColor: colors.white }]}>
                    <Image resizeMode='contain' style={[nstyles.nstyles.nIcon20, { tintColor: '#707070' }]} source={Images.icCancelTour} />
                </View>
            </TouchableOpacity>
        </TouchableOpacity>

    getListmonhoc = async (valIdLop) => {
        this.setState({ valueCauHoi: valIdLop });
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
                if (this.state.image.length == 0) {
                    this.setState({ image: res });
                } else {
                    let dataImage = this.state.image;
                    dataImage = dataImage.concat(res);
                    this.setState({ image: dataImage });
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
    render() {
        var { textGChu, soCauHoi, valueCauHoi } = this.state
        const { nrow, nIcon20 } = nstyles.nstyles;
        console.log('this.IsCoBaiKiemTra', this.countCauHoi, this.state.image)
        return (
            <View
                style={{
                    backgroundColor: colors.black_16,
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center"
                }} >
                <View
                    style={{
                        backgroundColor: colors.white,
                        width: width * 0.9,
                        padding: 20,
                        borderRadius: 5
                    }}>
                    <KeyboardAwareScrollView
                        extraHeight={30}
                        keyboardShouldPersistTaps={'always'}
                    >
                        <Text style={{ fontWeight: 'bold', fontSize: sizes.fs(20), color: colors.colorGreenThere1 }}>Bài kiểm tra</Text>
                        {/* <View style={[stBaoBaiDetail.container, { flexDirection: 'row' }]}> */}
                        {
                            this.countCauHoi > 0 || this.state.image.length > 0 ? null : <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                // justifyContent: 'space-between',
                                backgroundColor: colors.whitegay,
                                paddingHorizontal: 10,
                                paddingVertical: 8,
                                borderRadius: 3,
                                // flex: 1, 
                                marginTop: 8
                            }}>
                                <Text style={{ fontSize: sizes.fs(16), fontWeight: 'bold' }}>Loại:</Text>
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
                                        placeholder={'Loại bài kiểm tra'}
                                        style={{ width: '100%', height: 30 }}
                                        textStyle={{ fontWeight: 'bold', fontSize: 15 }}
                                        selectedValue={valueCauHoi}
                                        onValueChange={(val) => {
                                            this.getListmonhoc(val);
                                        }}>
                                        {this.valueLoaiBaiKK.map((item, index) =>
                                            <Picker.Item key={index} label={item.title} value={item.id} />
                                        )}
                                    </Picker>
                                </View>
                            </View>
                        }




                        {valueCauHoi == 0 ?
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ marginRight: 10, fontWeight: 'bold' }}>Số câu hỏi:</Text>
                                <View style={{
                                    borderColor: colors.veryLightPinkThree, borderWidth: 0.5,
                                    paddingHorizontal: this.khoangcach, marginTop: 13,
                                    // paddingBottom: 20,
                                    flex: 1,
                                    borderRadius: 3, padding: 3, paddingVertical: 5
                                }}>
                                    <TextInput
                                        // keyboardType={Platform.OS != 'ios' ? "numeric" : "number-pad"}
                                        keyboardType='number-pad'
                                        ref={ref => this.INPUT = ref}
                                        placeholder={'Nhập số câu hỏi'}
                                        multiline={true}
                                        style={{ flex: 1, textAlignVertical: 'top', marginLeft: 5 }}
                                        onChangeText={(soCauHoi) => this.setState({ soCauHoi: soCauHoi.replace(/[- #*;,.<>\{\}\[\]\\\/]/gi, '') })}
                                        value={soCauHoi.toString()}
                                    />
                                </View>
                            </View>

                            : null}
                        <View style={{
                            borderColor: colors.veryLightPinkThree, borderWidth: 0.5,
                            paddingHorizontal: 5, marginTop: 13,
                            paddingBottom: 20,
                            borderRadius: 3, padding: 3, paddingVertical: 5, height: 100
                        }}>
                            <TextInput
                                ref={ref => this.INPUT = ref}
                                placeholder={'Nhập tiêu đề bài kiểm tra'}
                                multiline={true}
                                style={{ flex: 1, textAlignVertical: 'top', minHeight: 80, marginLeft: 5 }}
                                onChangeText={(textGChu) => this.setState({ textGChu })}
                                value={textGChu}
                            />
                        </View>


                        {valueCauHoi == 0 ?
                            <TouchableOpacity onPress={this._goMediapicker} style={{
                                flexDirection: 'row',
                                alignItems: 'center', paddingVertical: 4,
                                //  borderWidth: 0.5, 
                                borderRadius: 3, borderColor: colors.black_20, marginTop: 10
                            }}>
                                <Image resizeMode='contain' style={[nstyles.nstyles.nIcon26, {}
                                ]} source={Images.icCameraBlack} />
                                <Text style={{ marginLeft: 3 }}>Hình ảnh bài kiểm tra</Text>
                            </TouchableOpacity> : null}
                        {this.state.image ?
                            <FlatList
                                style={{ marginTop: 20 }}
                                numColumns={2}
                                data={this.state.image}
                                scrollEnabled={false}
                                renderItem={({ item, index }) => this._renderImage(item, index, this.state.image)}
                                keyExtractor={item => item.uri}
                            /> : null}
                        <View style={[nrow, { height: 55, justifyContent: 'center', marginTop: 20 }]}>
                            <View style={{ marginHorizontal: 5 }}>
                                <ButtonCom
                                    colorChange={[colors.lightSalmon, colors.salmonTwo]}
                                    onPress={() => Utils.goback(this)}
                                    Linear={true}
                                    text={"Huỷ"}
                                    style={{ paddingHorizontal: 50, marginTop: 10 }}
                                />
                            </View>
                            <View style={{ marginHorizontal: 5 }}>
                                <ButtonCom
                                    colorChange={[colors.lightSalmon, colors.salmonTwo]}
                                    onPress={this._themCauHoi}
                                    Linear={true}
                                    text={"Thêm"}
                                    style={{ paddingHorizontal: 50, marginTop: 10 }}
                                />
                            </View>

                        </View>
                    </KeyboardAwareScrollView >
                </View>
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

})