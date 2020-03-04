import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { Dimensions } from 'react-native';
import { colors, sizes } from '../../styles';
import ListEmpty from "../../components/ListEmpty";
import { appConfig } from '../../app/Config';
import Utils from '../../app/Utils';
import { nstyles, Height } from '../../styles/styles';
import HeaderCom from '../../components/HeaderCom';
import { Images } from '../../images';
import { ROOTGlobal } from '../../app/data/dataGlobal';
import ButtonCom from '../../components/Button/ButtonCom';
import { ScrollView } from 'react-native-gesture-handler';
import { ListLop } from '../../apis/thanhtoan';
import DatePick from '../../components/DatePick';
import StarRating from '../../components/ComponentApps/StarRating';
import { KhaoSat_Detail } from '../../apis/apiKhaosat';
const { width } = Dimensions.get('window');
class ChiTietKhaoSat extends Component {
    constructor(props) {
        super(props);
        this.actionDetail = Utils.ngetParam(this, 'actionDetail')
        this.state = {
            data: [],
            mes: '',
            valuListLop: 'Mam non',
            classSelected: '',
            listLop: [],
            valuListTruong: ROOTGlobal.IdCN,
            _dateFr: new Date,
            _dateTo: new Date,
            refreshing: true,
        };
        this.addCauHoi = this.addCauHoi.bind(this);
    }
    componentDidMount() {
        this.DSLop()
        this._loadDetailAction()
    }
    DSLop = async () => {
        let res = await ListLop(this.state.valuListTruong)
        Utils.nlog('ListLop', res)
        if (res.status == 1) {
            listLop = res.data
            this.setState({ listLop: res.data, classSelected: res.data[0] });
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', res.error.message)
        }
    }
    _onRefresh = () => {
        this.setState({ refreshing: true }, () => this._loadDetailAction());
    }
    _loadDetailAction = async () => {
        let res = await KhaoSat_Detail(this.actionDetail.IDRow)
        Utils.nlog('_loadDetailAction', res, this.actionDetail.IDRow)
        if (res.status == 1) {
            data = res.data
        } else {
            data = []
        }
        this.setState({ data, refreshing: false })
    }

    GetHocSinhList = async (valIdLop) => {
        var { valuListTruong } = this.state;
        this.state.listLop.findIndex(item => {
            if (item.IDNhomKH == valIdLop)
                this.setState({ classSelected: item });
        });

    }

    selectOptionAction = (value) => {
        this.sortField.findIndex(item => {
            if (item.id == value) {
                this.setState({ sortFieldSelected: item });

            }
        });
    }
    selectClass = (value) => {
        this.state.listLop.findIndex(item => {
            if (item.IDNhomKH == value) {
                this.setState({ classSelected: item });
            }
        });
    }

    renderItem = ({ item, index }) => {
        return (
            <View style={{ marginLeft: 7, padding: 5, flex: 1 }}>
                <Text style={{ fontSize: sizes.fs(13), fontWeight: '500', paddingBottom: 10, alignSelf: 'flex-end', fontStyle: 'italic', color: item.Loai == 1 ? '#84D3A5' : '#2FBACF' }}>
                    {item.Loai == 1 ? '- Câu hỏi Đồng ý/Không đồng ý:' : '- Câu hỏi đánh giá sao:'}
                </Text>
                <Text style={{ fontSize: sizes.fs(14), fontWeight: 'bold', paddingBottom: 10 }}>
                    {item.NoiDung}
                </Text>
                <TouchableOpacity onPress={() => Utils.goscreen(this, 'Modal_ListUserKS', { listdata: item })} style={[nstyles.nrow, { alignItems: 'center', paddingBottom: 20 }]}>
                    <Text style={[stHoctap.stext]}>{item.Loai == 1 ? 'Kết quả khảo sát:' : 'Tỉ lệ đánh giá sao:'}</Text>
                    <View style={{ width: 10 }} />
                    <Image source={Images.icseeAll} resizeMode='contain' />
                </TouchableOpacity>
                {
                    item.Loai == 1 ? <View style={[nstyles.nrow, { paddingBottom: 10, alignItems: 'center', justifyContent: 'space-around' }]}>
                        <View style={[nstyles.nrow, { alignItems: 'center' }]}>
                            <View style={[nstyles.nIcon8, { borderRadius: sizes.reSize(4), backgroundColor: '#27a02d' }]} />
                            <View style={{ width: 5 }} />
                            <Text style={{ fontSize: sizes.fs(13), fontWeight: '500', color: '#27a02d' }}>Đồng ý: {item.SoLuongCo}</Text>
                        </View>
                        <View style={[nstyles.nrow, { alignItems: 'center' }]}>
                            <View style={[nstyles.nIcon8, { borderRadius: sizes.reSize(4), backgroundColor: 'orange' }]} />
                            <View style={{ width: 5 }} />
                            <Text style={{ fontSize: sizes.fs(13), fontWeight: '500', color: 'orange' }}>Không ý kiến: {item.KhongYKien}</Text>
                        </View>
                        <View style={[nstyles.nrow, { alignItems: 'center' }]}>
                            <View style={[nstyles.nIcon8, { borderRadius: sizes.reSize(4), backgroundColor: '#ff4a4a' }]} />
                            <View style={{ width: 5 }} />
                            <Text style={{ fontSize: sizes.fs(13), fontWeight: '500', color: '#ff4a4a' }}>Không đồng ý: {item.SoLuongKhong}</Text>
                        </View>

                    </View> : <View style={{ paddingBottom: 10 }}>
                            <StarRating starValue={parseFloat(item.TiLeSao)} />
                        </View>
                }
                <View style={{ backgroundColor: '#A3A3A3', height: 1 }} />
            </View >
        )
    }
    renderItemImg = ({ item, index }) => {
        return (
            <Image source={{ uri: appConfig.domain + item }}
                style={{ width: sizes.sizes.nImgSize90, height: sizes.sizes.nImgSize58, margin: 5, borderRadius: 4 }} />
        );
    }
    addCauHoi() {
        Utils.goscreen(this, 'Modal_AddKhaoSat', {
            actionDetail: this.actionDetail,
            _onRefresh: this._onRefresh
        })
    }
    render() {
        var { data } = this.state
        return (
            <View style={nstyles.ncontainerX}>
                <HeaderCom
                    nthis={this}
                    iconLeft={Images.icBackBlue}
                    titleText={'KHẢO SÁT'}
                />
                <ScrollView showsVerticalScrollIndicator={false}
                    style={[nstyles.nbody, { backgroundColor: colors.whitegay, marginTop: 15, marginHorizontal: 21, borderRadius: 4 }]}>
                    <Text style={{ color: '#29a9e0', fontSize: sizes.fs(16), fontWeight: 'bold', textAlign: 'center', marginBottom: 16 }}>
                        {this.actionDetail.TieuDe}
                    </Text>
                    <View style={{ backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 6, marginVertical: 13 }}>
                        <FlatList
                            ListEmptyComponent={<ListEmpty textempty={'Không có dữ liệu'} />}
                            data={this.state.data}
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                            renderItem={this.renderItem}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                </ScrollView>
                {
                    this.actionDetail.TrangThai == 2 ? null : <TouchableOpacity
                        onPress={this.addCauHoi}
                        style={[nstyles.nrow, { backgroundColor: 'white', paddingVertical: 15, alignItems: 'center', marginVertical: 10, borderRadius: 4, justifyContent: 'center' }]}>
                        <Text style={{ fontWeight: 'bold', fontSize: 13, color: '#00b096' }}>
                            Thêm câu hỏi
                        </Text>
                    </TouchableOpacity>
                }
                {
                    this.actionDetail.TrangThai == 2 ? <ButtonCom
                        onPress={() => Utils.goback(this)}
                        text={"Quay về"}
                        txtStyle={{ color: '#00b096' }}
                        style={{ marginHorizontal: 30, marginTop: 10, marginBottom: 25, borderColor: '#00b096', borderWidth: 1 }} />
                        :
                        <View style={[nstyles.nrow, { justifyContent: 'center', alignItems: 'center' }]}>
                            <ButtonCom
                                onPress={() => Utils.goback(this)}
                                text={"Huỷ"}
                                txtStyle={{ color: '#00b096' }}
                                style={{ paddingHorizontal: 50, marginTop: 10, marginBottom: 25, borderColor: '#00b096', borderWidth: 1 }} />
                            <View style={{ width: 20 }} />
                            <ButtonCom
                                onPress={() => Utils.goback(this)}
                                text={"Hoàn tất"}
                                txtStyle={{ color: 'white' }}
                                style={{ paddingHorizontal: 30, backgroundColor: '#00b096', marginTop: 10, marginBottom: 25 }} />
                        </View>
                }
            </View>
        );
    }
}
const stHoctap = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.whitegay,
        padding: 5,
        flex: 1, borderRadius: 4
    },
    stext: {
        fontSize: sizes.fs(13),
        fontWeight: '500',
        fontStyle: 'italic',
        textDecorationLine: 'underline',
        color: colors.blueTwo
    },
    containText: {
        backgroundColor: colors.whitegay,
        alignSelf: 'flex-start',
        padding: 5,
        borderRadius: 3,
        paddingHorizontal: 10
    }
})
const mapStateToProps = state => ({
    infoUser: state.infoUser
});

export default Utils.connectRedux(ChiTietKhaoSat, mapStateToProps, true);