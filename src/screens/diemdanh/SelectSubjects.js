import React, { Component, Fragment } from "react";
import { View, TextInput, Text, Image, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import Utils from "../../app/Utils";
import { colors, sizes, nstyles } from "../../styles";
import HeaderCom from "../../components/HeaderCom";
import { Images } from "../../images/index";
import DatePick from '../../components/DatePick';
import ButtonCom from "../../components/Button/ButtonCom";
import { LopHoc_List_App, HocSinhList } from "../../apis/thanhtoan";
import { Picker } from "native-base";
import { MonHocList } from '../../apis/danhmuc';
import { ROOTGlobal } from "../../app/data/dataGlobal";
import { Width } from "../../styles/styles";
import { ScrollView } from "react-native-gesture-handler";
export const db1 = db.database();
import { db } from '../../app/Config';
export default class SelectSubjects extends Component {
    constructor(props) {
        super(props);
        this.returnSubjects = Utils.ngetParam(this, 'returnSubjects', () => { })
        this.state = {
            listSubjects: []
        };
    }
    componentDidMount() {
        // this.getMonHocList();
        this.dsMonHocTest()
    }

    // getMonHocList = async () => {
    //     let res = await MonHocList()
    //     if (res.status == 1) {
    //         listSubjects = res.data
    //         this.setState({ listSubjects })
    //     }
    // }
    dsMonHocTest = async () => {
        //   //Lấy list
        db1.ref('/Tbl_MonHoc').on('value', (snapshot) => {
            let data = snapshot.val();
            let keys = Object.keys(data);
            let items = Object.values(data);
            let items2 = data[keys[0]];
            Utils.nlog('dsMonHocTest', items, items2)
            this.setState({ listSubjects: items })
        });
    }
    renderItem = ({ item, index }) => {
        return (
            <View style={[nstyles.nstyles.nrow, { marginVertical: 5 }]}>
                <Image source={Images.icTopHotels} resizeMode='contain' />
                <View style={{ width: 8 }} />
                <View style={{ width: Width(74), justifyContent: 'center' }}>
                    <ButtonCom
                        onPress={() => this.goBack(item)}
                        text={item.TenMonHoc}
                        txtStyle={{ color: 'white', flex: 1 }}
                        style={{ borderRadius: 6, backgroundColor: '#84d3a5', alignItems: 'center' }}
                    />
                </View>
            </View >
        )
    }

    goBack = (item) => {
        this.returnSubjects(item);
        Utils.goback(this);
    }

    render() {
        var { listSubjects } = this.state
        const { nrow, nIcon20, nbody } = nstyles.nstyles;
        return (
            <View style={[nstyles.nstyles.ncontainerX, { backgroundColor: colors.whitegay }]}>
                <HeaderCom
                    nthis={this}
                    iconLeft={Images.icBackBlue}
                    titleText={'Danh sách môn học'}
                    titleStyle={{ color: colors.white, fontSize: sizes.reText(16) }}
                />
                <View style={[nbody, { paddingHorizontal: 22 }]}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ flex: 1 }}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={listSubjects}
                                renderItem={this.renderItem}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                    </ScrollView>
                </View>
            </View >
        );
    }
}

