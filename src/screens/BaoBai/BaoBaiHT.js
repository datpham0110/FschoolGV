import React, { Component, Fragment } from "react";
import { View, TextInput, Text, Image, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import Utils from "../../app/Utils";
import { colors, sizes, nstyles } from "../../styles";
import HeaderCom from "../../components/HeaderCom";
import { Images } from "../../images/index";
import DatePick from '../../components/DatePick';
import ButtonCom from "../../components/Button/ButtonCom";
import styles from './styles';

export default class BaoBaiHT extends Component {
    constructor(props) {
        super(props);
        this.type = Utils.ngetParam(this, 'type');
        this.ghichu = Utils.ngetParam(this, 'ghichu')
        this.textGChu = Utils.ngetParam(this, 'textGChu', '');
        nthis = this;
        this.state = {
        };
    }
    _submit = () => {
        Utils.goscreen(this, 'sc_Home');
    }

    _titleType = () => {
        let title = '';
        switch (this.type) {
            case 1:
                title = 'Thông báo';
                return title;
            case 2:
                title = 'Báo bài';
                return title;
            case 3:
                title = 'Theo dõi học phí';
                return title
            case 4:
                title = 'Thư mời và sự kiện';
                return title
            case 5:
                title = 'Kết quả học tập';
                return title
        };
    }

    _text = () => {
        let text = '';
        switch (this.type) {
            case 1:
                text = 'Hoàn thành';
                return text;
            case 2:
                if (this.ghichu) {
                    text = 'Gửi ghi chú thành công';
                } else {
                    text = 'Gửi báo bài thành công';
                }
                return text;
            case 3:
                text = 'Hoàn thành';
                return text
            case 4:
                text = 'Gửi thành công';
                return text
            case 5:
                text = 'Gửi kết quả học tập thành công';
                return text
        };
    }

    render() {
        const { nrow, nIcon48 } = nstyles.nstyles;
        return (
            <View style={[nstyles.nstyles.ncontainerX, { backgroundColor: colors.whitegay }]}>
                <HeaderCom
                    nthis={this}
                    iconLeft={null}
                    titleText={this._titleType()}
                    titleStyle={{ color: colors.white, fontSize: sizes.reText(18) }}
                />
                <View style={[nstyles.nstyles.nbody, { paddingTop: 40, paddingHorizontal: 24 }]}>
                    <View style={{ alignItems: 'center', justifyContent: 'flex-start' }}>
                        <Image source={Images.successBB} resizeMode='contain' style={nIcon48} />
                        <Text style={{ fontSize: sizes.fs(20), fontWeight: 'bold', paddingTop: 20 }}>{this._text()}</Text>
                    </View>
                    {this.type == 1 || this.type == 3 ? <View style={{ padding: 20, backgroundColor: colors.white, marginTop: 40 }}>
                        <Text style={{ fontSize: sizes.reText(13), fontWeight: 'bold', marginTop: 5 }}>{Utils.ngetParam(this, 'lop')}</Text>
                        <View style={{
                            borderColor: colors.veryLightPinkThree, borderWidth: 0.5,
                            borderRadius: 3, backgroundColor: colors.white, padding: 15, marginVertical: 20
                        }}>
                            <Text>{this.textGChu}</Text>
                        </View>

                    </View> : null}

                    <View style={{ alignItems: 'center', justifyContent: 'flex-start', marginTop: 40 }}>
                        <ButtonCom
                            colorChange={[colors.colorGreenOne1, colors.colorGreenOne1]}
                            onPress={this._submit}
                            Linear={true}
                            style={{ backgroundColor: colors.colorPink }}
                            text={"Màn hình chính"}
                            style={{ paddingHorizontal: 50, marginTop: 10 }}
                        />
                    </View>
                </View>
            </View >
        );
    }
}