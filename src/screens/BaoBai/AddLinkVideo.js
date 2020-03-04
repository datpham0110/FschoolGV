import React, { Component, Fragment } from "react";
import { View, TextInput, Text, Image, StyleSheet, FlatList, Dimensions, TouchableOpacity } from "react-native";
import Utils from "../../app/Utils";
import { colors, sizes, nstyles } from "../../styles";
import HeaderCom from "../../components/HeaderCom";
import { Images } from "../../images/index";
import DatePick from '../../components/DatePick';
import ButtonCom from "../../components/Button/ButtonCom";
import styles from './styles';
const { width } = Dimensions.get("window");
import { Clipboard } from 'react-native'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";


export default class AddLinkVideo extends Component {
    constructor(props) {
        super(props);
        this.linkVideo = Utils.ngetParam(this, 'linkVideo', 'Link');
        this.state = {
            textGChu: Utils.ngetParam(this, 'tenVideo', ''),
            Link: this.linkVideo
        }
        this.goBackAddLink = Utils.ngetParam(this, 'goBackAddLink', () => { })
    }


    readFromClipboard = async () => {
        //To get the text from clipboard
        const clipboardContent = await Clipboard.getString();
        const index = clipboardContent.indexOf('https://www.youtube.com/watch?v=');
        const index1 = clipboardContent.indexOf('https://youtu.be/');
        if (index != -1 || index1 != -1) {
            //link oK
            Utils.showMsgBoxOK(this, 'Thông báo', 'Dán Link Youtube thành công', 'Đóng')
            this.setState({ Link: clipboardContent });

        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Link không phải là link của Youtube, vui lòng nhập lại', 'Đóng')
            //Link ko hợp lệ
        }
    };
    _goBackData = () => {
        if (this.state.textGChu == '') {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Vui lòng thêm tiêu đề video', 'Đóng')
            return;
        }
        if (this.state.Link == 'Link') {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Vui lòng thêm link video Youtube', 'Đóng')
            return;
        }
        this.goBackAddLink(this.state.textGChu, this.state.Link)
        Utils.nlog('----------------------_goBackData')
        Utils.goback(this)
    }
    render() {
        var { textGChu } = this.state
        const { nrow, nIcon20 } = nstyles.nstyles;
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
                        <Text style={{ fontWeight: 'bold', fontSize: sizes.fs(20), color: colors.colorGreenThere1 }}>Link video</Text>
                        <View style={{
                            borderColor: colors.veryLightPinkThree, borderWidth: 0.5,
                            paddingHorizontal: 5, marginTop: 13,
                            paddingBottom: 20,
                            borderRadius: 3, padding: 3, paddingVertical: 5, height: 100
                        }}>
                            <TextInput
                                ref={ref => this.INPUT = ref}
                                placeholder={'Tiêu đề video'}
                                multiline={true}
                                style={{ flex: 1, textAlignVertical: 'top', minHeight: 80 }}
                                onChangeText={(textGChu) => this.setState({ textGChu })}
                                value={textGChu}
                            />
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{
                                borderColor: colors.colorGreenTwo1, borderWidth: 0.5,
                                paddingHorizontal: 5, marginTop: 13,
                                borderTopStartRadius: 3, borderBottomStartRadius: 3, padding: 3, paddingVertical: 8, flex: 1, justifyContent: 'center'
                            }}>
                                <Text>{this.state.Link}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={this.readFromClipboard}
                                style={{
                                    backgroundColor: colors.colorGreenTwo1, marginTop: 13, padding: 3, flexDirection: 'row', justifyContent: 'center',
                                    alignItems: 'center', borderTopRightRadius: 3, borderBottomRightRadius: 3
                                }}>
                                <Image resizeMode='contain' style={[nstyles.nstyles.nIcon12, { tintColor: 'white' }]} source={Images.linkicon} />
                                <Text style={{ color: 'white', marginRight: 5, fontWeight: '400' }}>Dán Link</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[nrow, { justifyContent: 'center', marginTop: 20 }]}>
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
                                    onPress={this._goBackData}
                                    Linear={true}
                                    text={"Thêm"}
                                    style={{ paddingHorizontal: 50, marginTop: 10 }}
                                />
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </View>
            </View>
        );
    }
}