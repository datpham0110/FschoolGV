import React, { Component } from "react";
import { colors, sizes } from "../../styles";
import { Text, View, Dimensions, TouchableOpacity, TextInput } from "react-native";
import ButtonCom from "../../components/Button/ButtonCom";
import Utils from "../../app/Utils";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const { width, height } = Dimensions.get("window");

export default class GhiChuGocHocTap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "",
        };
        this._addGhiChu = Utils.ngetParam(this, '_addGhiChu', () => { })
        this.index = Utils.ngetParam(this, 'index')
    }
    onCancel = () => {
        Utils.goback(this, null);
    };
    _onSubmit = async () => {
        this._addGhiChu(this.index, this.state.text)
        Utils.goback(this)
    };
    render() {
        return (

            <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
                <View style={{
                    opacity: 0.7, position: 'absolute', left: 0, top: 0, bottom: 0, right: 0,
                    backgroundColor: 'black'
                }} onTouchEnd={this.onCancel} />
                <KeyboardAwareScrollView
                    style={{ flex: 1, marginTop: 30 }}
                    keyboardShouldPersistTaps={'always'}>
                    <View
                        style={{ backgroundColor: colors.white, width: width * 0.9, padding: width * 0.1, borderRadius: 10 }} >
                        <Text style={{ fontWeight: "800", textAlign: "center", marginBottom: 20, fontSize: sizes.sizes.sText24 }} > Ghi chú học sinh</Text>
                        {/* <Input
                        placeholder={"Nhập ghi chú"}
                        onChangeText={text => this.setState({ text: text })}
                        iconStyle={{ marginRight: 10, tintColor: "gray" }} /> */}
                        <View style={{
                            borderColor: colors.veryLightPinkThree, borderWidth: 0.5, marginVertical: 20,
                            width: width * 0.7, borderRadius: 6,
                        }}>
                            <TextInput
                                placeholder={"Nhập ghi chú"}
                                multiline={true}
                                style={{ marginLeft: 5, textAlignVertical: 'top', minHeight: height * 0.3 }}
                                onChangeText={text => this.setState({ text: text })}
                                value={this.state.text}
                            />
                        </View>
                        <ButtonCom
                            onPress={this._onSubmit}
                            Linear={true}
                            colorChange={[colors.lightSalmon, colors.salmonTwo]}
                            style={{ marginTop: 10 }}
                            text={"Xác nhận"}
                        />
                    </View>
                </KeyboardAwareScrollView>
            </View >
        );
    }
}
