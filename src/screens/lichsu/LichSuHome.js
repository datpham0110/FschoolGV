import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, FlatList, ScrollView } from 'react-native';
import { Dimensions } from 'react-native';
import { colors, sizes } from '../../styles';
import { reSize, reText } from '../../styles/size';
import Utils from '../../app/Utils';
import { nstyles, Height, nwidth } from '../../styles/styles';
import HeaderCom from '../../components/HeaderCom';
import { Images } from '../../images';
import AllLichsu from './AllLichsu';
import LichSuDiemDanh from './LichSuDiemDanh';
import LichSuThongBao from './LichSuThongBao';

const { width } = Dimensions.get('window');

export default class LichSuHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: 0,
        };
    }
    tab_menu = (check) => {
        this.setState({ tab: check })
    }
    renderTabMenu = () => {
        var { tab } = this.state
        switch (tab) {
            case 0:
                return <AllLichsu nthis={this} />
            case 1:
                return <LichSuDiemDanh />
            case 2:
                return <LichSuThongBao />
        };
    }

    render() {
        return (
            <View style={[nstyles.ncontainerX, { backgroundColor: colors.whitegay }]}>
                <HeaderCom
                    nthis={this}
                    iconLeft={Images.icBackBlue}
                    titleText={'Lịch sử'} />
                <View style={nstyles.nbody}>
                    <View style={[nstyles.nrow, { alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white' }]}>
                        <TouchableOpacity
                            style={[Styles.containerTab, nstyles.nrow, Styles.containerTabSignIn, { flex: 1, borderBottomColor: this.state.tab == 0 ? '#5ca178' : colors.black_16 }]}
                            onPress={() => this.tab_menu(0)}>
                            <Text style={{ color: this.state.tab == 0 ? '#5ca178' : colors.black_16, fontWeight: this.state.tab == 0 ? 'bold' : '500', fontSize: reText(18) }}>{'ALL'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[Styles.containerTab, nstyles.nrow, Styles.containerTabSignIn, { flex: 1, borderBottomColor: this.state.tab == 1 ? '#5ca178' : colors.black_16 }]}
                            onPress={() => this.tab_menu(1)}>
                            <Text style={{ color: this.state.tab == 1 ? '#5ca178' : colors.black_16, fontWeight: this.state.tab == 1 ? 'bold' : '500', fontSize: reText(18) }}>{'Điểm danh'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[Styles.containerTab, nstyles.nrow, Styles.containerTabSignIn, { flex: 1, borderBottomColor: this.state.tab == 2 ? '#5ca178' : colors.black_16 }]}
                            onPress={() => this.tab_menu(2)}>
                            <Text style={{ color: this.state.tab == 2 ? '#5ca178' : colors.black_16, fontWeight: this.state.tab == 2 ? 'bold' : '500', fontSize: reText(18) }}>{'Thông báo'}</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        {
                            this.renderTabMenu()
                        }
                    </ScrollView>
                </View>

            </View>
        );
    }
}
const Styles = StyleSheet.create({
    containerTab: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerTabSignIn: {
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 5,
        borderBottomWidth: 3,
        alignItems: 'center',
    },
})