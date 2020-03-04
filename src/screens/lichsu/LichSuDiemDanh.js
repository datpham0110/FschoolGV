import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { Dimensions } from 'react-native';
import { colors, sizes } from '../../styles';
import { reSize, reText } from '../../styles/size';
import Utils from '../../app/Utils';
import { nstyles, Height, nwidth } from '../../styles/styles';
import HeaderCom from '../../components/HeaderCom';
import { Images } from '../../images';

const { width } = Dimensions.get('window');

export default class LichSuDiemDanh extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={{ paddingVertical: 10, marginHorizontal: 20 }}>
                <Text>Điểm danh</Text>
            </View>
        );
    }
}