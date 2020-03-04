import React, { Component, Fragment } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Picker, Dimensions, Image, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { colors, sizes } from '../../styles';
import { nstyles } from '../../styles/styles';
import HeaderCom from '../../components/HeaderCom';
import { Images } from '../../images';
import { reSize, reText } from '../../styles/size';
import { DiemDanhList } from '../../apis/thanhtoan';
import Utils from '../../app/Utils';
import ButtonCom from '../../components/Button/ButtonCom';
import { ROOTGlobal } from "../../app/data/dataGlobal";
import { HocSinhList, SoDoLop_Update } from "../../apis/thanhtoan";
import DatePicker from 'react-native-datepicker';
// import { SoDoLop_Update } from '../../apis/thanhtoan/SoDoLop_Update'
const { width, height } = Dimensions.get("window");

export default class SodoDiemDanh extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            valuListTruong: ROOTGlobal.IdCN,
        };
        this.listHS = [];
        this.valueLop = Utils.ngetParam(this, 'valuListLop', '');
        this.listHSShow = [];
        this.listHSTruyenQua = Utils.ngetParam(this, 'listHSTruyenQua');
        this.reloadData = Utils.ngetParam(this, 'reloadData', () => { });
        this.loaiLop = Utils.ngetParam(this, 'loaiLop', '');
        this.IdMonHoc = Utils.ngetParam(this, 'IdMonHoc', '')
    }
    componentDidMount() {
        let arr = [];
        let ghe = {
            IDHocSinh: '',
            TenHocSinh: '--Trống--',
            ViTriHocSinh: ''
        }
        for (let index = 0; index < 64; index++) {
            ghe.ViTriHocSinh = ''
            arr.push(ghe)
        }
        this.setState({ data: arr }, this._loadData)
    }
    _dataListHSReturn = (data, vtri, item) => {
        this.listHSShow = data;
        let data1 = this.state.data;
        if (item.IDHocSinh == '-1') {
            let ghe = {
                IDHocSinh: '',
                TenHocSinh: '--Trống--',
                ViTriHocSinh: ''
            }
            data1[vtri] = ghe;
        } else {
            data1[vtri] = item;
        }
        this.setState({ data: data1 })
    }
    _loadData = async () => {
        let item1 = {
            IDHocSinh: '-1',
            TenHocSinh: '-- Đổi vị trí --',
            ViTriHocSinh: '-1'
        }
        this.listHSShow.push(item1);
        let data1 = this.state.data;
        for (let i = 0; i < this.listHSTruyenQua.length; i++) {
            let item2 = {
                IDHocSinh: '',
                TenHocSinh: '',
                ViTriHocSinh: ''
            }
            item2.IDHocSinh = this.listHSTruyenQua[i].IDHocSinh;
            item2.TenHocSinh = this.listHSTruyenQua[i].TenHocSinh;
            item2.ViTriHocSinh = this.listHSTruyenQua[i].ViTri;
            data1[this.listHSTruyenQua[i].ViTri] = item2
            this.listHSShow.push(item2)
        }
        this.setState({ data: data1 })
    }
    renderItem = ({ item, index }) => {
        return (
            <View style={styles.viewItemStudent} >
                <TouchableOpacity onPress={() => {
                    Utils.goscreen(this, 'Modal_SelectHocSinhDiemDanh', { data: this.listHSShow, viTri: index, _dataListHSReturn: this._dataListHSReturn })
                }}>
                    <View style={[styles.viewSelectStudent, { borderColor: item.TenHocSinh == '--Trống--' ? colors.ViewTopArea : 'green' }]} />
                </TouchableOpacity>
                <Text style={styles.textNameStudent}>
                    {item.TenHocSinh}
                </Text>
            </View >
        );
    }
    _submit = () => {
        let daa = []
        Utils.nlog(this.listHSShow)
        for (let i = 1; i < this.listHSShow.length; i++) {
            if (this.listHSShow[i].ViTriHocSinh == '' || this.listHSShow[i].ViTriHocSinh == '-1') {
                Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn phải xếp sơ đồ lớp hết tất cả học sinh', 'Đồng ý')
                return;
            }
            daa.push(this.listHSShow[i])
        }
        this.upDateDiemDanh(daa);
    }
    upDateDiemDanh = async (daa) => {
        let res = await SoDoLop_Update(this.valueLop, daa, this.loaiLop, this.IdMonHoc)
        Utils.nlog('SoDoLop_Update', res)
        if (res.status == 1) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Cập nhật vị trí chỗ ngồi thành công', 'Đóng', () => this.goBack(res.data))
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Cập nhật vị trí chỗ ngồi thất bại', 'Đóng')
        }
    }
    goBack = (data) => {
        this.reloadData(data)
        Utils.goback(this)
    }
    render() {
        var { data } = this.state;
        return (
            <View style={nstyles.ncontainerX}>
                <HeaderCom
                    nthis={this}
                    iconLeft={Images.icBackBlue}
                    titleText={"Sơ đồ điểm danh"}
                    titleStyle={{ color: colors.white, fontSize: sizes.reText(16) }}
                    onPressLeft={this.goBack
                    } />
                <ScrollView
                    showsHorizontalScrollIndicator={false} >
                    < View style={[styles.viewTitle, { flex: 1 }]}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{
                                fontSize: sizes.fs(16), textDecorationLine: 'underline', fontStyle: 'italic',
                                fontWeight: '500', paddingVertical: 20,
                            }}>
                                BẢNG SƠ ĐỒ LỚP
                    </Text>
                        </View>
                        <View style={[nstyles.nrow, { justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }]}>
                            <View >
                                <Text style={{
                                    fontSize: sizes.fs(16), textDecorationLine: 'underline', fontStyle: 'italic',
                                    fontWeight: '500'
                                }}> Bàn giáo viên</Text>
                                <Image source={Images.imagesIc} resizeMode='contain' />
                            </View>
                            <View style={{ borderWidth: 1, borderRadius: 6, borderColor: colors.ViewTopArea, paddingHorizontal: 50, paddingVertical: 10 }}>
                                <Text style={{ fontSize: sizes.fs(14), fontWeight: '500' }}>BẢNG</Text>
                            </View>
                            <Image source={Images.icOutlineExitToApp} style={nstyles.nIcon40} resizeMode='contain' />
                        </View>
                        <ScrollView
                            showsHorizontalScrollIndicator={false}
                            style={{ flex: 1 }}
                            horizontal={true}>
                            {/* <View style={{ flex: 1 }}> */}
                            <FlatList
                                data={data}
                                numColumns={8}
                                renderItem={this.renderItem}
                                keyExtractor={(item, index) => index.toString()}
                                extraData={this.state}
                                scrollEnabled={false}
                            />
                        </ScrollView>
                    </View>
                    <ButtonCom
                        colorChange={[colors.lightSalmon, colors.salmonTwo]}
                        onPress={this._submit}
                        Linear={true}
                        text={"Xác nhận"}
                        style={{ marginHorizontal: 65, marginTop: 10, marginBottom: 25 }} />
                </ScrollView>

            </View>
        )
    }
}
const styles = StyleSheet.create({
    body: {
        ...nstyles.nbody,
        marginTop: 28,
        marginLeft: 22,
        marginRight: 20
    },
    viewTitle: {
        backgroundColor: colors.white,
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    viewStudents: {
        backgroundColor: colors.white,
    },
    textThuNgayThang: {
        color: colors.blackShadow,
        fontSize: reText(16),
        fontWeight: '500',
        textAlign: 'center'
    },
    textThuNgayThang1: {
        color: colors.blackShadow,
        fontSize: reText(20),
        fontWeight: '500',
        textAlign: 'center'
    },
    textSubtitle: {
        marginTop: 4,
        color: colors.grey,
        fontSize: reText(12),
        textAlign: 'center'
    },
    viewTime: {
        flex: 1,
        backgroundColor: colors.white,
        borderColor: colors.veryLightPinkFour,
        borderWidth: 0.2,
        borderRadius: 3,
        padding: 9,
        paddingTop: 7,
    },
    viewTotalStudents: {
        ...nstyles.nrow,
        marginTop: 12,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    switchEnoughAllStudents: {
        ...Platform.select({
            ios: {
                transform: [
                    { scaleX: .6 },
                    { scaleY: .6 }
                ],
            },

        }),
        marginLeft: 10
    },
    viewItemStudent: {
        // width: '33%',
        flex: 1,
        alignItems: 'center',
        // backgroundColor: 'white'
    },
    viewSelectStudent: {
        ...nstyles.nIcon32,
        marginTop: 22,
        borderRadius: 5,
        borderWidth: 3,
        borderColor: colors.mediumGreen
    },
    textNameStudent: {
        marginTop: 15,
        color: colors.blackShadow,
        fontSize: reText(12),
        textAlign: 'center',
        paddingHorizontal: 15,
        marginBottom: 10,
        flex: 1,
        width: 100


    },
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
})