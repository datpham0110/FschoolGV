import React, { Component, Fragment } from "react";
import { View, TouchableOpacity, Text, Image, TextInput, FlatList, Dimensions } from "react-native";
import Utils from "../../app/Utils";
import { colors, sizes, nstyles } from "../../styles";
import HeaderCom from "../../components/HeaderCom";
import { Images } from "../../images/index";
import DatePick from '../../components/DatePick';
import ButtonCom from "../../components/Button/ButtonCom";
import styles from './styles';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const { width } = Dimensions.get("window");

export default class ThemCauHoiKiemTra extends Component {
    constructor(props) {
        super(props);
        this.edit = Utils.ngetParam(this, 'edit', false)
        this.data = Utils.ngetParam(this, 'data', () => { })
        this.state = {
            textGChu: '',
            textA: '',
            textB: '',
            textC: '',
            textD: '',
            dapAn: ''
        }
        this.indexCauHoi = Utils.ngetParam(this, 'indexCauHoi', '')
        this.countCauHoi = Utils.ngetParam(this, 'countCauHoi');
        this.dataReturn = Utils.ngetParam(this, 'dataReturn', () => { });
        this.gobackUpdate = Utils.ngetParam(this, 'gobackUpdate', () => { })
    }
    componentDidMount() {
        Utils.nlog('-----------------  this.indexCauHoi', this.indexCauHoi)
        if (this.edit == true) {
            this.setState({ textGChu: this.data.item.NoiDung, textA: this.data.item.DapAn1, textB: this.data.item.DapAn2, textC: this.data.item.DapAn3, textD: this.data.item.DapAn4, dapAn: this.data.item.DapAnDung })
        }
    }
    _themCauHoi = () => {
        if (this.state.textGChu == '') {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn phải thêm tiêu đề cho câu hỏi', 'Đóng')
            return;
        }
        if (this.state.textA == '') {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn phải nhập nội dung cho câu trả lời A', 'Đóng')
            return;
        } if (this.state.textB == '') {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn phải nhập nội dung cho câu trả lời B', 'Đóng')
            return;
        } if (this.state.textC == '') {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn phải nhập nội dung cho câu trả lời C', 'Đóng')
            return;
        } if (this.state.textD == '') {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn phải nhập nội dung cho câu trả lời D', 'Đóng')
            return;
        }
        if (this.state.dapAn == '') {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn phải lựa chọn câu trả lời đúng', 'Đóng')
            return;
        }
        if (this.edit == true) {
            this.gobackUpdate(this.state.textGChu, this.state.textA, this.state.textB, this.state.textC, this.state.textD, this.state.dapAn, this.indexCauHoi)
            Utils.goback(this)
            return;
            // this.setState({ textGChu: this.state.textGChu, textA: this.state.textA, textB: this.state.textB, textC: this.state.textC, textD: this.state.textD, dapAn: this.state.dapAn })
        } else {
            this.dataReturn(this.state.textGChu, this.state.textA, this.state.textB, this.state.textC, this.state.textD, this.state.dapAn);
            Utils.goback(this)
            return;
        }

    }

    render() {
        var { textGChu, textA, textB, textC, textD } = this.state
        const { nrow, nIcon20 } = nstyles.nstyles;
        Utils.nlog('this.data', this.data, this.edit, textGChu, textA, textB, textC, textD)

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
                        showsVerticalScrollIndicator={false}
                        extraHeight={30}
                        keyboardShouldPersistTaps={'always'}
                    >
                        <Text style={{ fontWeight: 'bold', fontSize: sizes.fs(20), color: colors.colorGreenThere1 }}>Câu hỏi {this.edit == true ? this.indexCauHoi + 1 : this.countCauHoi + 1}</Text>
                        <View style={{
                            borderColor: colors.veryLightPinkThree, borderWidth: 0.5,
                            marginTop: 13,
                            paddingBottom: 18,
                            borderRadius: 3, padding: 3, paddingVertical: 5, height: 100
                        }}>
                            <TextInput
                                ref={ref => this.INPUT = ref}
                                placeholder={'Nội dung câu hỏi'}
                                multiline={true}
                                style={{ flex: 1, textAlignVertical: 'top', minHeight: 80, marginLeft: 5 }}
                                onChangeText={(textGChu) => this.setState({ textGChu })}
                                value={textGChu}
                            />
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                            <Text style={{ color: 'green', fontWeight: '800', marginVertical: 5 }}>A.</Text>
                            <View style={{
                                borderColor: colors.veryLightPinkThree, borderWidth: 0.5,
                                flex: 1,
                                paddingBottom: 18,
                                borderRadius: 3, padding: 3, paddingVertical: 5, height: 50, marginLeft: 5, minHeight: 50
                            }}>
                                <TextInput
                                    ref={ref => this.INPUT = ref}
                                    placeholder={'Nội dung câu trả lời A'}
                                    multiline={true}
                                    style={{ flex: 1, textAlignVertical: 'top', marginLeft: 5 }}
                                    onChangeText={(textA) => this.setState({ textA })}
                                    value={textA}
                                />
                            </View>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20 }} onPress={() => this.setState({ dapAn: 'A' })}>
                                <View
                                    style={[nstyles.nstyles.nIcon12, nstyles.nstyles.nmiddle, {
                                        borderColor: 'green', borderWidth: 0.5, width: sizes.reSize(20), height: sizes.reSize(20),
                                        borderRadius: 2, backgroundColor: this.state.dapAn == 'A' ? 'green' : 'white'
                                    }]}>
                                    <Image source={Images.icCheckBlue} style={{ width: sizes.reSize(18), height: sizes.reSize(18), tintColor: colors.white }}
                                        resizeMode='contain' />
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                            <Text style={{ color: 'green', fontWeight: '800', marginVertical: 5 }}>B.</Text>
                            <View style={{
                                borderColor: colors.veryLightPinkThree, borderWidth: 0.5,
                                flex: 1,
                                paddingBottom: 18,
                                borderRadius: 3, padding: 3, paddingVertical: 5, height: 50, marginLeft: 5, minHeight: 50
                            }}>
                                <TextInput
                                    ref={ref => this.INPUT = ref}
                                    placeholder={'Nội dung câu trả lời B'}
                                    multiline={true}
                                    style={{ flex: 1, textAlignVertical: 'top', marginLeft: 5 }}
                                    onChangeText={(textB) => this.setState({ textB })}
                                    value={textB}
                                />
                            </View>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20 }} onPress={() => this.setState({ dapAn: 'B' })}>
                                <View
                                    style={[nstyles.nstyles.nIcon12, nstyles.nstyles.nmiddle, {
                                        borderColor: 'green', borderWidth: 0.5, width: sizes.reSize(20), height: sizes.reSize(20),
                                        borderRadius: 2, backgroundColor: this.state.dapAn == 'B' ? 'green' : 'white'
                                    }]}>
                                    <Image source={Images.icCheckBlue} style={{ width: sizes.reSize(18), height: sizes.reSize(18), tintColor: colors.white }}
                                        resizeMode='contain' />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                            <Text style={{ color: 'green', fontWeight: '800', marginVertical: 5 }}>C.</Text>
                            <View style={{
                                borderColor: colors.veryLightPinkThree, borderWidth: 0.5,
                                flex: 1,
                                paddingBottom: 18,
                                borderRadius: 3, padding: 3, paddingVertical: 5, height: 50, marginLeft: 5, minHeight: 50
                            }}>
                                <TextInput
                                    ref={ref => this.INPUT = ref}
                                    placeholder={'Nội dung câu trả lời C'}
                                    multiline={true}
                                    style={{ flex: 1, textAlignVertical: 'top', marginLeft: 5 }}
                                    onChangeText={(textC) => this.setState({ textC })}
                                    value={textC}
                                />
                            </View>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20 }} onPress={() => this.setState({ dapAn: 'C' })}>
                                <View
                                    style={[nstyles.nstyles.nIcon12, nstyles.nstyles.nmiddle, {
                                        borderColor: 'green', borderWidth: 0.5, width: sizes.reSize(20), height: sizes.reSize(20),
                                        borderRadius: 2, backgroundColor: this.state.dapAn == 'C' ? 'green' : 'white'
                                    }]}>
                                    <Image source={Images.icCheckBlue} style={{ width: sizes.reSize(18), height: sizes.reSize(18), tintColor: colors.white }}
                                        resizeMode='contain' />
                                </View>
                            </TouchableOpacity>

                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                            <Text style={{ color: 'green', fontWeight: '800', marginVertical: 5 }}>D.</Text>
                            <View style={{
                                borderColor: colors.veryLightPinkThree, borderWidth: 0.5,
                                flex: 1,
                                paddingBottom: 18,
                                borderRadius: 3, padding: 3, paddingVertical: 5, height: 50, marginLeft: 5,
                                minHeight: 50,
                            }}>
                                <TextInput
                                    ref={ref => this.INPUT = ref}
                                    placeholder={'Nội dung câu trả lời D'}
                                    multiline={true}
                                    style={{ flex: 1, textAlignVertical: 'top', marginLeft: 5 }}
                                    onChangeText={(textD) => this.setState({ textD })}
                                    value={textD}
                                />
                            </View>


                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20 }} onPress={() => this.setState({ dapAn: 'D' })}>
                                <View
                                    style={[nstyles.nstyles.nIcon12, nstyles.nstyles.nmiddle, {
                                        borderColor: 'green', borderWidth: 0.5, width: sizes.reSize(20), height: sizes.reSize(20),
                                        borderRadius: 2, backgroundColor: this.state.dapAn == 'D' ? 'green' : 'white'
                                    }]}>
                                    <Image source={Images.icCheckBlue} style={{ width: sizes.reSize(18), height: sizes.reSize(18), tintColor: colors.white }}
                                        resizeMode='contain' />
                                </View>
                            </TouchableOpacity>



                        </View>
                        <View style={[nrow, { height: 55, justifyContent: 'center', marginTop: 10 }]}>
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
                    </KeyboardAwareScrollView>
                </View>
            </View >
        );
    }
}