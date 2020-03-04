import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, TextInput, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { reSize, reText, fs } from '../../styles/size';
import Utils from '../../app/Utils';
import { nstyles, Height } from '../../styles/styles';
import HeaderCom from '../../components/HeaderCom';
import { Images } from '../../images';
import { KhaoSat_User } from '../../apis/apiKhaosat';
import StarRating from '../../components/ComponentApps/StarRating';
import { colors } from '../../styles';

const { width } = Dimensions.get('window');
export default class ListUserKS extends Component {
    constructor(props) {
        super(props);
        this.listdata = Utils.ngetParam(this, 'listdata', {})
        this.state = {
            dataListCo: [],
            datalistKhong: [],
            datalistKYK: [],
            Sao1: [],
            Sao2: [],
            Sao3: [],
            Sao4: [],
            Sao5: []
        };
    }
    componentDidMount() {
        this._KhaoSat_User();
    }
    _KhaoSat_User = async () => {
        var { dataListCo, datalistKhong, datalistKYK, Sao1, Sao2, Sao3, Sao4, Sao5 } = this.state
        let res = await KhaoSat_User(this.listdata.IDRow, this.listdata.Loai)
        // Utils.nlog('--------------------- this.listdata.Loai', this.listdata.Loai)
        Utils.nlog('_KhaoSat_User', res)
        if (this.listdata.Loai == 1) {
            if (res.status == 1) {
                dataListCo = res.data.ListCo
                datalistKhong = res.data.ListKhong
                datalistKYK = res.data.ListKhongYKien
            } else {
                datalistKhong = []
                dataListCo = []
                datalistKYK = []
            }
            this.setState({ dataListCo, datalistKYK, datalistKhong })
        } else {
            if (res.status == 1) {
                Sao1 = res.data.Sao1
                Sao2 = res.data.Sao2
                Sao3 = res.data.Sao3
                Sao4 = res.data.Sao4
                Sao5 = res.data.Sao5
            } else {
                Sao1 = []
                Sao2 = []
                Sao3 = []
                Sao4 = []
                Sao5 = []
            }
            this.setState({ Sao1, Sao2, Sao3, Sao4, Sao5 })
        }

    }
    renderItem = ({ item, index }) => {
        return (
            <View style={[nstyles.nrow, { alignItems: 'center', paddingVertical: 8 }]}>
                <Image source={Images.imgProfile} resizeMode='contain' style={nstyles.nIcon35} />
                <View style={{ width: 10 }} />
                <Text style={stText.ntext}>{item.Fullname}</Text>
            </View>
        )
    }
    render() {
        var { dataListCo, datalistKhong, datalistKYK, Sao1, Sao2, Sao3, Sao4, Sao5 } = this.state
        console.log('rs', Sao1, Sao2, Sao3, Sao4, Sao5)
        return (
            <View style={nstyles.ncontainerX}>
                <HeaderCom
                    nthis={this}
                    iconLeft={Images.icBackBlue}
                    titleText={'Danh sách phụ huynh khảo sát'}
                />
                <ScrollView showsVerticalScrollIndicator={false} style={[nstyles.nbody, { paddingHorizontal: 15 }]}>
                    {
                        this.listdata.Loai == 1 ? <View>
                            <Text style={{ fontWeight: 'bold', textAlign: 'center', fontSize: fs(20), paddingVertical: 10 }}>{this.listdata.NoiDung}</Text>
                            {
                                dataListCo.length == 0 ? null : <View style={stText.container}>
                                    <Text style={[stText.ntitle, { color: '#27a02d' }]}>Đồng ý</Text>
                                    <View style={{ backgroundColor: colors.greenyBlue, height: 1, marginVertical: 5 }} />
                                    <FlatList
                                        scrollEnabled={false}
                                        data={dataListCo}
                                        renderItem={this.renderItem}
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                </View>
                            }
                            {
                                datalistKhong.length == 0 ? null : <View style={[stText.container, { backgroundColor: '#2FBACF' }]}>
                                    <Text style={[stText.ntitle, { color: '#e6553c' }]}>Không đồng ý</Text>
                                    <View style={{ backgroundColor: colors.greenyBlue, height: 1, marginVertical: 5 }} />
                                    <FlatList
                                        scrollEnabled={false}
                                        data={datalistKhong}
                                        renderItem={this.renderItem}
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                </View>
                            }
                            {
                                datalistKYK.length == 0 ? null : <View style={[stText.container, { backgroundColor: '#84d3c6' }]}>
                                    <Text style={[stText.ntitle, { color: '#ed9264' }]}>Không ý kiến</Text>
                                    <View style={{ backgroundColor: colors.greenyBlue, height: 1, marginVertical: 5 }} />
                                    <FlatList
                                        scrollEnabled={false}
                                        data={datalistKYK}
                                        renderItem={this.renderItem}
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                </View>
                            }
                        </View> : <View>
                                <Text style={{ fontWeight: 'bold', textAlign: 'center', fontSize: fs(20), paddingVertical: 10 }}>{this.listdata.NoiDung}</Text>
                                {
                                    Sao1.length == 0 ? null : <View style={stText.container}>
                                        <View style={{ alignItems: 'flex-start' }}>
                                            <StarRating starValue={1} />
                                        </View>
                                        <View style={{ backgroundColor: colors.greenyBlue, height: 1, marginVertical: 5 }} />
                                        <FlatList
                                            scrollEnabled={false}
                                            data={Sao1}
                                            renderItem={this.renderItem}
                                            keyExtractor={(item, index) => index.toString()}
                                        />
                                    </View>
                                }
                                {
                                    Sao2.length == 0 ? null : <View style={[stText.container, { backgroundColor: '#76b590' }]}>
                                        <View style={{ alignItems: 'flex-start', marginVertical: 5 }}>
                                            <StarRating starValue={2} />
                                        </View>
                                        <View style={{ backgroundColor: colors.greenyBlue, height: 1, marginVertical: 5 }} />
                                        <FlatList
                                            scrollEnabled={false}
                                            data={Sao2}
                                            renderItem={this.renderItem}
                                            keyExtractor={(item, index) => index.toString()}
                                        />
                                    </View>
                                }
                                {
                                    Sao3.length == 0 ? null : <View style={stText.container}>
                                        <View style={{ alignItems: 'flex-start' }}>
                                            <StarRating starValue={3} />
                                        </View>
                                        <View style={{ backgroundColor: colors.greenyBlue, height: 1, marginVertical: 5 }} />
                                        <FlatList
                                            scrollEnabled={false}
                                            data={Sao3}
                                            renderItem={this.renderItem}
                                            keyExtractor={(item, index) => index.toString()}
                                        />
                                    </View>
                                }
                                {
                                    Sao4.length == 0 ? null : <View style={[stText.container, { backgroundColor: '#76b590' }]}>
                                        <View style={{ alignItems: 'flex-start' }}>
                                            <StarRating starValue={4} />
                                        </View>
                                        <View style={{ backgroundColor: colors.greenyBlue, height: 1, marginVertical: 5 }} />
                                        <FlatList
                                            scrollEnabled={false}
                                            data={Sao4}
                                            renderItem={this.renderItem}
                                            keyExtractor={(item, index) => index.toString()}
                                        />
                                    </View>
                                }
                                {
                                    Sao5.length == 0 ? null : <View style={stText.container}>
                                        <View style={{ alignItems: 'flex-start' }}>
                                            <StarRating starValue={5} />
                                        </View>
                                        <View style={{ backgroundColor: colors.greenyBlue, height: 1, marginVertical: 5 }} />
                                        <FlatList
                                            scrollEnabled={false}
                                            data={Sao5}
                                            renderItem={this.renderItem}
                                            keyExtractor={(item, index) => index.toString()}
                                        />
                                    </View>
                                }

                            </View>
                    }
                </ScrollView>
            </View >
        );
    }
}
const stText = StyleSheet.create({
    ntitle: {
        fontSize: fs(18),
        fontWeight: 'bold',
        paddingVertical: 5
    },
    ntext: {
        fontSize: fs(16),
        fontWeight: 'bold',
        color: 'white'
    },
    container: {
        borderRadius: 4,
        padding: 5,
        backgroundColor: '#84D3A5',
        marginBottom: 10
    }

})