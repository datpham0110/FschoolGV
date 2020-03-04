import React, { Component } from "react";
import { Text, View, Dimensions, TextInput, StyleSheet, ActivityIndicator } from "react-native";
import ButtonCom from "../../components/Button/ButtonCom";
import { BaoBaiSend } from '../../apis/thanhtoan';
import Utils from "../../app/Utils";
import { colors, sizes, nstyles } from "../../styles";
import { ROOTGlobal } from "../../app/data/dataGlobal";
const { width, height } = Dimensions.get("window");
export default class ModalghichuBB extends Component {
    constructor(props) {
        super(props);
        this.DSlistBB = Utils.ngetParam(this, 'DSlistBB');
        this.listChild = Utils.ngetParam(this, 'listChild');
        this.listChildGC = Utils.ngetParam(this, 'listChildGC');
        this.state = {
            textGChu: '',
            isLoading: false
        };
    }

    sendBaobai = async () => {

        // Utils.nlog('sendBaobai-------------------------', ROOTGlobal.dataUser.IdUser)
        var { textGChu } = this.state
        if (textGChu == '') {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Vui lòng nhập ghi chú');
            return;
        };
        this.setState({ isLoading: true });

        const listImage = [];
        for (let index = 0; index < this.DSlistBB.length; index++) {
            const item = this.DSlistBB[index];
            const listLinkImage = [];
            const dataImage = item.image;
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
        };
        const listChild = this.listChild.map(item => item.IDHocSinh);
        let res = await BaoBaiSend(this.DSlistBB, listChild, this.listChildGC, textGChu, listImage);
        Utils.nlog('sendBaobai', res)
        if (res.status == 1) {
            Utils.showMsgBoxOK(
                this, 'Thông báo', 'Gửi báo bài thành công', 'OK', this._CreateThongBao)
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Có lỗi xảy ra vui lòng thử lại sau', 'OK')
        };
        this.setState({ isLoading: false });
    }

    _CreateThongBao() {
        Utils.goscreen(nthis, 'sc_BaoBaiHT', { type: 2 });
    }
    _goBack = () => {
        Utils.goback(this)
    };
    render() {
        return (
            <View style={{
                justifyContent: 'flex-start', alignItems: 'center', flex: 1,
            }}>
                <View style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0, right: 0,
                    backgroundColor: colors.black_50
                }} onTouchEnd={this._goBack} />
                <View style={{ backgroundColor: colors.white, width: width * 0.8, height: height * 0.4, paddingHorizontal: 10, paddingBottom: this.khoangcach, alignItems: 'center', marginTop: 70 }}>
                    <Text style={{ fontSize: sizes.reText(18), color: colors.azure, marginTop: 13, textAlign: 'center' }}>GHI CHÚ</Text>
                    <View style={{
                        borderColor: colors.veryLightPinkThree, borderWidth: 0.5, marginVertical: 20,
                        width: width * 0.7, flex: 1, borderRadius: 6
                    }}>
                        <TextInput
                            placeholder={'Hoàn thành'}
                            multiline={true}
                            style={{ flex: 1, margin: 10 }}
                            onChangeText={(textGChu) => this.setState({ textGChu })}
                            value={this.state.textGChu}
                        />
                    </View>

                    {/* <ButtonCom
                        onPress={() => this._CreateThongBao()}
                        Linear={true}
                        colorChange={[colors.lightSalmon, colors.salmonTwo]}
                        style={{ marginTop: 10, width: width * 0.4, marginBottom: 10 }}
                        text={"Gửi"}
                    /> */}
                    <View style={[nstyles.nstyles.nrow, { height: 55, justifyContent: 'center', marginBottom: 10 }]}>
                        <ButtonCom
                            colorChange={[colors.lightSalmon, colors.salmonTwo]}
                            onPress={this.sendBaobai}
                            Linear={true}
                            text={"Hoàn thành"}
                            style={{ paddingHorizontal: 50 }}
                        />
                    </View>
                </View>
                {this.state.isLoading ? <View style={[nstyles.nstyles.nmiddle, { position: 'absolute', width: '100%', height: '100%', backgroundColor: colors.black_20 }]}>
                    <ActivityIndicator color={colors.white} size='large' />
                </View> : null}
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
        borderRadius: 6,
        flex: 1
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
    nmodal: {
        position: 'absolute',
        left: 10,
        right: 10,
        top: 0,
        bottom: 0,

        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
})