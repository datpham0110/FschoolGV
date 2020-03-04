import React, { Component, Fragment } from "react";
import { View, TextInput, Text, Image, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import Utils from "../../app/Utils";
import { colors, sizes, nstyles } from "../../styles";
import HeaderCom from "../../components/HeaderCom";
import { Images } from "../../images/index";
import DatePick from '../../components/DatePick';
import ButtonCom from "../../components/Button/ButtonCom";
import styles from './styles';

export default class BaoBaiDetail extends Component {
    constructor(props) {
        super(props);
        nthis = this;
        this.khoangcach = 18;
        this.clickAll = false;
        this.state = {
            date: "",
            tabNP: 0,
            namestudent: '',
            data: [
                { id: 1, title: 'Bài 1', content: 'Lam bai tap toan, bai 03, trang 112' },
                { id: 1, title: 'Bài 2', content: 'Lam bai tap toan, bai 03, trang 112' },
            ],
            itemClick: [],
            content: ''
        };
    }

    componentDidMount() {
        var month = new Date().getMonth() + 1; //Current Month
        var year = new Date().getFullYear();
        this.setState({ date: "T" + month + "/" + year });
    }

    _clickItem = (id) => () => {
        const itemClick = this.state.itemClick.slice();
        if (itemClick.includes(id)) {
            const index = itemClick.indexOf(id);
            itemClick.splice(index, 1)
        } else {
            itemClick.push(id)
        };
        this.setState({ itemClick });
    }

    _renderItem = ({ item, index }) => {
        const { nrow, nmiddle } = nstyles.nstyles;
        return <View style={[{ backgroundColor: colors.white, marginTop: index == 0 ? 24 : 10, paddingHorizontal: this.khoangcach, paddingVertical: nstyles.khoangcach }]}>
            <View style={stBaoBaiDetail.containText}>
                <Text style={stBaoBaiDetail.stext} numberOfLines={1}> {item.title}</Text>
            </View>
            <View style={nrow}>
                <Text style={[styles.text13, { flex: 1, alignSelf: 'flex-end' }]}>{item.content}</Text>
                <TouchableOpacity
                    style={[stBaoBaiDetail.containText, { backgroundColor: colors.azure, marginLeft: 20, paddingHorizontal: 15, alignSelf: 'flex-end' }]}>
                    <Text style={[styles.text13, { color: colors.white }]}>Sửa</Text>
                </TouchableOpacity>
            </View>
        </View>
    }

    renderSeparator = () => {
        return (
            <View style={[nstyles.nstyles.nrow, { height: 1, width: '100%' }]}>
                <View style={{ width: '20%', backgroundColor: colors.white }} />
                <View style={{ width: '80%', backgroundColor: colors.veryLightPinkSeven }} />
            </View>
        );
    };
    _keyExtractor = (item, index) => `${index}`;

    _clickAll = () => {
        const length = this.state.data.length;
        let itemClick = this.state.itemClick.slice();
        if (this.clickAll) {
            this.clickAll = false;
            itemClick = [];
        } else {
            this.clickAll = true;
            for (let index = 0; index < length; index++) {
                if (!itemClick.includes(index)) {
                    itemClick.push(index);
                };
            };
        };
        Utils.nlog('itemClick', itemClick)
        this.setState({ itemClick });
    }
    render() {
        Utils.nlog('re-render', this.state.itemClick)
        const { nrow, nIcon20 } = nstyles.nstyles;
        return (
            <View style={[nstyles.nstyles.ncontainerX, { backgroundColor: colors.whitegay }]}>
                <HeaderCom
                    nthis={this}
                    iconLeft={Images.icBackBlue}
                    titleText={"Báo bài"}
                    titleStyle={{ color: colors.white, fontSize: sizes.reText(18) }}
                />
                <View style={[nstyles.nstyles.nbody, { paddingHorizontal: 15 }]}>
                    <View>
                        <FlatList
                            data={this.state.data}
                            renderItem={this._renderItem}
                            keyExtractor={this._keyExtractor}
                        />
                    </View>
                    <View style={{ backgroundColor: colors.white, borderBottomEndRadius: 3, borderBottomStartRadius: 3, marginTop: 15, flex: 1, paddingHorizontal: this.khoangcach }}>
                        <Text style={{ fontSize: sizes.reText(18), color: colors.azure, marginTop: 13 }}>Nhập báo bài</Text>
                        <View style={{ borderColor: colors.veryLightPinkThree, borderWidth: 0.5, minHeight: 100, paddingHorizontal: this.khoangcach, marginTop: 13, paddingTop: 6 }}>
                            <TextInput
                                placeholder={'Nội dung'}
                                multiline
                                style={{ flex: 1, textAlignVertical: 'top' }}
                            >
                                {}
                            </TextInput>
                        </View>
                        <TouchableOpacity
                            style={[stBaoBaiDetail.containText, { backgroundColor: colors.colorGreenTwo1, alignSelf: 'flex-end', marginTop: 13, paddingHorizontal: this.khoangcach }]}>
                            <Text style={[styles.text13, { color: colors.white }]}>Gửi</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[nrow, { height: nstyles.Height(8), justifyContent: 'center' }]}>
                        <ButtonCom
                            colorChange={[colors.lightSalmon, colors.salmonTwo]}
                            onPress={this._submit}
                            Linear={true}
                            style={{ marginTop: 10, backgroundColor: colors.colorPink }}
                            text={"Tiếp tục"}
                            style={{ paddingHorizontal: 50, marginTop: 10 }}
                        />
                    </View>
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

})