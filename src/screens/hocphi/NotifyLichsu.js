import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Dimensions } from 'react-native';
import { colors, sizes } from '../../styles';
import Utils from '../../app/Utils';
import { nGlobalKeys } from '../../app/keys/globalKey';
import { notification } from '../../apis/notifycation';
const { width } = Dimensions.get('window');

export default class NotifyLichsu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tenHocSinh: '',
        };
    }

    _renderItemChild = ({ item, index }) => {
        var { CTlichSu } = this.props
        return (
            <View style={{ backgroundColor: colors.white, paddingHorizontal: 15, paddingVertical: 10 }}>
                <Text style={{
                    marginBottom: 3,
                    fontSize: sizes.sizes.sText15, marginHorizontal: 5
                }}>{item.Thang}/{item.Nam}</Text>
                <View style={{ flexDirection: 'row', flex: 1, paddingVertical: 7 }}>
                    <Text style={{ fontSize: sizes.sizes.sText18, flex: 1 }}>
                        Tổng tiền:</Text>
                    <Text style={{ fontSize: sizes.sizes.sText18, alignItems: 'flex-end' }}>
                        {/* {Utils.formatMoney(item.TongTienNop) + 'đ'} */}
                        {item.TongTienNop}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', flex: 1, paddingBottom: 10 }}>
                    <Text style={{ fontSize: sizes.sizes.sText18, flex: 1 }}>
                        Đã thanh toán:</Text>
                    <Text style={{ fontSize: sizes.sizes.sText18, alignItems: 'flex-end' }}>
                        {/* {Utils.formatMoney(item.TongTienDaTra) + 'đ'} */}
                        {item.TongTienDaTra}
                    </Text>
                </View>
                {
                    index == CTlichSu.length - 1 ? null : <View style={{ height: 1, backgroundColor: colors.brownishGreyTwo, opacity: 0.3 }} />
                }
            </View>
        );
    };
    render() {
        var { CTlichSu } = this.props
        return (
            <View style={{ backgroundColor: colors.BackgroundHome, flex: 1 }}>
                <View style={{ backgroundColor: colors.white, marginHorizontal: 25, borderTopRightRadius: 4, borderTopLeftRadius: 4 }}>
                    <Text style={{ fontSize: sizes.sizes.sText15, fontWeight: '500', padding: 15, color: '#0099FF' }}>Lịch sử cần nộp từng tháng</Text>
                    <View style={{ height: 1, backgroundColor: colors.brownishGreyTwo, opacity: 0.3, marginHorizontal: 15 }} />
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        renderItem={this._renderItemChild}
                        data={CTlichSu}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </View>
        )
    }
}

