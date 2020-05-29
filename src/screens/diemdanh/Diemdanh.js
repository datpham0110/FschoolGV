import React, { Component, Fragment } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Switch, Dimensions, Image, ScrollView, ActivityIndicator, Platform, ListEmpty } from 'react-native';
import { colors, sizes } from '../../styles';
import { nstyles } from '../../styles/styles';
import HeaderCom from '../../components/HeaderCom';
import { Images } from '../../images';
import { reText, fs } from '../../styles/size';
import { DiemDanhList } from '../../apis/thanhtoan';
import Utils from '../../app/Utils';
import ButtonCom from '../../components/Button/ButtonCom';
import { DiemDanh_Update } from "../../apis/thanhtoan";
import { ROOTGlobal } from '../../app/data/dataGlobal';
import DatePicker from 'react-native-datepicker'
import { MonHocList } from '../../apis/danhmuc';
export const db1 = db.database();
import { db } from '../../app/Config';
const { width } = Dimensions.get("window");
class Diemdanh extends Component {
    constructor(props) {
        super(props);
        tempDate = new Date();
        tempDate = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate());
        tempDate2 = new Date();
        tempHouse = tempDate2.getHours().toString().length == 1 ? "0" + tempDate2.getHours().toString() : tempDate2.getHours().toString();
        tempMinutes = tempDate2.getMinutes().toString().length == 1 ? "0" + tempDate2.getMinutes().toString() : tempDate2.getMinutes().toString();
        this.state = {
            isEnoughAllStudents: false,
            tempDay: tempDate.getDate(),
            valuListLop: '',
            isLoading: false,
            date: new Date(),
            dateGioVao: tempHouse + ":" + tempMinutes,
            dateGioRa: '16:30',
            listGheRender: [],
            listMonHoc: [],
            tenLop: '...',
            nameLop: 'Chọn lớp',
            nameSubject: 'Chọn môn học',
            loaiLop: 0,
            tenLopLoai2: 'Chọn lớp',
            subjectsSelected: null,
            listHocSinh: []
        };
        this.dayInMonth = new Date().getDate();
        this.monthInYear = new Date().getMonth() + 1;
        if (this.monthInYear < 10) {
            this.monthInYear = "0" + this.monthInYear.toString()
        }
        if (this.dayInMonth < 10) {
            this.dayInMonth = "0" + this.dayInMonth.toString();
        }
        this.year = new Date().getFullYear();
        this.statusDiemDanhTrung = null;
    }

    componentDidMount() {
        this.getMonHocList()
        this.dsHocSinh()
    }
    // Load list môn học
    getMonHocList = async () => {
        let res = await MonHocList()
        if (res.status == 1) {
            listMonHoc = res.data
            this.setState({ listMonHoc })
        }
    }
    ///Listhocsinh từ fireBase
    dsHocSinh = async () => {
        db1.ref('/Tbl_HocSinh').on('value', (snapshot) => {
            let data = snapshot.val();
            let items = Object.values(data);
            if (items != null) {
                for (let i = 0; i < items.length; i++) {
                    items[i].isDiemDanh = -1
                }
                this.setState({ listHocSinh: items })
            } else {
                Utils.showMsgBoxOK(this, 'Thông báo', 'Không có học sinh để hiển thị', 'Đóng')
            }
        });
    }

    loadListClass = () => {
        Utils.goscreen(this, 'sc_AddNewClass', { idLop: this.onloadData })
    }
    // Go screen select môn
    selectSubject = () => {
        if (this.state.nameLop == 'Chọn lớp') {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Phải chọn lớp trước khi chọn môn', 'Đóng')
            return;
        }
        //sc_SelectSubjects
        Utils.goscreen(this, 'sc_SelectSubjects', { returnSubjects: this.returnSubjects })
    }
    // data môn return
    returnSubjects = (item) => {
        this.setState({ nameSubject: item.TenMonHoc, subjectsSelected: item })

    }


    // Select lớp trả data về
    onloadData = (idLop, flag, isNewClassGoback = false) => {
        let arr = [];
        for (let index = 0; index < 30; index++) {
            let ghe = {
                IDHocSinh: 'null'
            }
            arr.push(ghe);
        }
        this.setState({ listGheRender: arr, valuMonHoc: 'Chọn môn học' })
        if (flag == 0) {
            this.setState({ listGheRender: arr, tenLop: idLop.TenLop, nameLop: idLop.TenLop, valuListLop: idLop, loaiLop: flag, nameSubject: 'Chọn môn học', subjectsSelected: null });
        } else {
            let tenMonHoc = '';
            for (let i = 0; i < this.state.listMonHoc.length; i++) {
                if (this.state.listMonHoc[i].IdMonHoc == idLop.IDMonHoc) {
                    tenMonHoc = this.state.listMonHoc[i].TenMonHoc;
                    this.setState({ nameSubject: this.state.listMonHoc[i].TenMonHoc, subjectsSelected: this.state.listMonHoc[i] })
                    break;
                }
            }
            this.setState({ listGheRender: arr, tenLop: idLop.TenLop, nameLop: idLop.TenLop, valuListLop: idLop, loaiLop: flag, tenLopLoai2: tenMonHoc });
        }
    }
    // Select môn học



    // Load list điểm danh

    isEnoughAllStudentsChange = () => {
        if (this.state.isEnoughAllStudents) return;
        this.setState({ isEnoughAllStudents: !this.state.isEnoughAllStudents })
        data2 = this.state.listHocSinh;
        for (let i = 0; i < data2.length; i++) {
            data2[i].isDiemDanh = 1;
        }
        this.setState({ listHocSinh: data2 })
    }
    demSoHocSinh = (idloai) => {
        let count = 0;
        for (let i = 0; i < this.state.listHocSinh.length; i++) {
            if (this.state.listHocSinh[i].isDiemDanh == idloai)
                count++
        }
        return count;
    }

    _send = async (item) => {
        const { infoUser } = this.props;
        Utils.nlog('--------------------item', item)
        db1.ref('/Tbl_DiemDanh').push({
            Giaovien: infoUser.name,
            NgayDiemDanh: item.NgayDiemDanh,
            TenHocSinh: item.TenHocSinh,
            IDHocSinh: item.IDHocSinh,
            LopHoc: item.LopHoc,
            MonHoc: item.MonHoc,
            isDiemDanh: item.isDiemDanh,
            GioVao: item.GioVao,
            GioRa: item.GioRa
        });
        Utils.showMsgBoxOK(this, 'Thông báo', 'Điểm danh thành công')
    }

    _submit = async () => {
        for (let i = 0; i < this.state.listHocSinh.length; i++) {
            if (this.state.listHocSinh[i].isDiemDanh == -1) {
                Utils.showMsgBoxOK(this, 'Thông báo', 'Phải điểm danh hết tất cả học sinh trong lớp', 'Đóng');
                return;
            }
        }
        if (this.state.dateGioRa < this.state.dateGioVao) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Giờ vào không được lớn hơn giờ ra', 'Đóng')
            return;
        }
        let listHocSinh = this.state.listHocSinh;
        Utils.nlog('--------------------listHocSinh', listHocSinh)
        for (let i = 0; i < listHocSinh.length; i++) {
            let item = {
                NgayDiemDanh: this.dayInMonth + '/' + this.monthInYear + '/' + this.year,
                IDHocSinh: listHocSinh[i].IDHocSinh,
                isDiemDanh: listHocSinh[i].isDiemDanh,
                TenHocSinh: listHocSinh[i].TenHocSinh,
                MonHoc: this.state.nameSubject,
                LopHoc: this.state.nameLop,
                GioVao: this.state.dateGioVao,
                GioRa: this.state.dateGioRa
            }
            this._send(item)
        }
    }

    _openDatePickTu = () => {
        this.DatePicker1.onPressDate()
    }
    _openDatePickDen = () => {
        this.DatePicker2.onPressDate()
    }
    _touchItemDiemDanh = (value) => {
        let isDiemDanh = value.isDiemDanh == -1 ? 1 : value.isDiemDanh == 2 ? 1 : 2;
        if (isDiemDanh == 2) this.setState({ isEnoughAllStudents: false })
        let listHS = this.state.listHocSinh;
        for (let i = 0; i < listHS.length; i++) {
            if (listHS[i].IDHocSinh == value.IDHocSinh) {
                listHS[i].isDiemDanh = isDiemDanh;
                this.setState({ listHocSinh: listHS })
                break;
            }
        }
    }

    _renderItem = ({ item, index }) => {
        var borderColor = colors.ViewTopArea
        if (item.isDiemDanh == -1) {
            borderColor = colors.ViewTopArea;
        } else if (item.isDiemDanh == 1) {
            borderColor = 'green';
        } else {
            borderColor = 'red';
        }
        return (
            <View style={[styles.viewItemStudent, { paddingHorizontal: 5 }]}>
                <TouchableOpacity onPress={() => this._touchItemDiemDanh(item)}>
                    <View style={[styles.viewSelectStudent, { borderColor: borderColor }]} />
                </TouchableOpacity>
                <Text style={styles.textNameStudent}>
                    {Utils.splitName(item.TenHocSinh)}
                </Text>
            </View>
        );
    }

    render() {
        var { isEnoughAllStudents, nameSubject, listMonHoc, tenLop, nameLop, listHocSinh } = this.state
        Utils.nlog('_touchItemDiemDanh', listHocSinh)
        return (
            <View style={nstyles.ncontainerX}>
                <HeaderCom
                    nthis={this}
                    iconLeft={Images.icBackBlue}
                    tintColorLeft={colors.white}
                    titleText={tenLop == undefined ? 'Điểm danh lớp... ' : 'Điểm danh ' + tenLop}
                    titleStyle={{ color: colors.white, fontSize: sizes.reText(16) }}
                    onPressLeft={this._back}
                />
                <ScrollView
                    style={{ flex: 1, backgroundColor: 'white' }}
                    showsHorizontalScrollIndicator={false}>
                    <View style={[styles.body, { backgroundColor: colors.white, borderRadius: 4, paddingHorizontal: 18, paddingVertical: 18, alignItems: 'center' }]}>
                        <View style={[nstyles.nrow, { flex: 1, alignItems: 'center', justifyContent: 'space-between' }]}>
                            <Text style={[styles.textThuNgayThang, { flex: 1, fontWeight: 'bold', fontSize: sizes.reText(22) }]}>{this.dayInMonth + '/' + this.monthInYear + '/' + this.year}</Text>
                            <View style={{ width: 20 }} />
                        </View>
                        <View style={[nstyles.nrow, { marginTop: 12 }]}>
                            <TouchableOpacity style={styles.viewTime} onPress={this._openDatePickTu}>
                                <Text style={styles.textThuNgayThang1}> {this.state.dateGioVao} </Text>
                                <DatePicker
                                    style={{ height: 0, width: 0 }}
                                    showIcon={false}
                                    mode="time"
                                    hideText
                                    locale='vi-VN'
                                    confirmBtnText="Xác nhận"
                                    cancelBtnText="Đóng"
                                    timeZoneOffsetInMinutes={undefined}
                                    onDateChange={(date) => { this.setState({ dateGioVao: date }) }}
                                    ref={ref => this.DatePicker1 = ref} />
                                <Text style={styles.textSubtitle}> {'Giờ vào'} </Text>
                            </TouchableOpacity>
                            <View style={{ width: 15 }} />
                            <TouchableOpacity style={styles.viewTime} onPress={this._openDatePickDen}>
                                <Text style={styles.textThuNgayThang1}>{this.state.dateGioRa}</Text>
                                <DatePicker
                                    showIcon={false}
                                    style={{ height: 0, width: 0 }}
                                    mode="time"
                                    hideText
                                    locale='vi-VN'
                                    confirmBtnText="Xác nhận"
                                    cancelBtnText="Đóng"
                                    onDateChange={(date) => { this.setState({ dateGioRa: date }) }}
                                    ref={ref => this.DatePicker2 = ref}
                                />
                                <Text style={styles.textSubtitle}>{'Giờ ra'}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[nstyles.nrow, { marginTop: 10, marginBottom: 6 }]}>
                            <View style={[nstyles.nrow, styles.nviewPicker]}>
                                <TouchableOpacity onPress={this.loadListClass}
                                    style={[nstyles.nrow, { alignItems: 'center', flex: 1, justifyContent: 'space-between' }]}>
                                    <View style={{ position: 'absolute', right: 5, top: 0, bottom: 0, justifyContent: 'center' }}>
                                        <Image source={Images.icDown} resizeMode='contain' style={[nstyles.nIcon20, { tintColor: '#A3A3A3' }]} />
                                    </View>
                                    <Text style={styles.ntextViewPicker}>{nameLop}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: 15 }} />

                            <View style={[nstyles.nrow, styles.nviewPicker]}>
                                <TouchableOpacity onPress={this.selectSubject}
                                    style={[nstyles.nrow, { alignItems: 'center', flex: 1, justifyContent: 'space-between' }]}>
                                    <View style={{ position: 'absolute', right: 5, top: 0, bottom: 0, justifyContent: 'center' }}>
                                        <Image source={Images.icDown} resizeMode='contain' style={[nstyles.nIcon20, { tintColor: '#A3A3A3' }]} />
                                    </View>
                                    <Text style={styles.ntextViewPicker}>{nameSubject}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.viewTotalStudents}>
                            <View style={[nstyles.nrow, { backgroundColor: 'white' }]}>
                                <View style={nstyles.nrow}>
                                    <Text style={[styles.stext, { color: 'green', marginLeft: 10, textAlign: 'left' }]}>{'Có mặt: ' + this.demSoHocSinh(1)}  </Text>
                                </View>
                                <View style={{ height: 10 }} />
                                <View style={[nstyles.nrow]}>
                                    <Text style={[styles.stext, { color: 'red', marginLeft: 10, textAlign: 'left' }]}>{'Vắng mặt: ' + this.demSoHocSinh(2)}</Text>
                                </View>
                            </View>
                            {/* <Text style={styles.textThuNgayThang}>{'Tổng số học sinh: ' + this.state.listHocSinh.length}</Text> */}
                            <View style={[nstyles.nrow, { flex: 1, alignItems: 'center', justifyContent: 'flex-end' }]}>
                                <Text style={[styles.textThuNgayThang, { fontWeight: 'bold' }]}>{'Đủ tất cả'}</Text>
                                <Switch
                                    style={styles.switchEnoughAllStudents}
                                    thumbColor={colors.azure}
                                    value={isEnoughAllStudents}
                                    onValueChange={this.isEnoughAllStudentsChange} />
                            </View>
                        </View>

                    </View>
                    {this.state.nameSubject == 'Chọn môn học' && this.state.tenLopLoai2 == 'Chọn lớp' ?
                        <Text style={{ textAlign: 'center', fontSize: fs(16), fontWeight: '500' }}>Vui lòng chọn lớp vào môn học</Text> :
                        <FlatList
                            data={listHocSinh}
                            numColumns={4}
                            renderItem={this._renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            extraData={this.state}
                        />}


                </ScrollView>
                <View style={{ backgroundColor: 'white' }}>
                    <ButtonCom
                        colorChange={[colors.lightSalmon, colors.salmonTwo]}
                        onPress={this._submit}
                        Linear={true}
                        text={"Xác nhận"}
                        style={{ marginHorizontal: 30, paddingHorizontal: 65, marginTop: 15, marginBottom: 20 }} />

                </View>
                {this.state.isLoading ? <View style={[nstyles.nmiddle, { position: 'absolute', width: '100%', height: '100%', backgroundColor: colors.black_20 }]}>
                    <ActivityIndicator color={colors.white} size='large' />
                </View> : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        ...nstyles.nbody,
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10
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
        // backgroundColor: colors.redStar,
        borderColor: colors.veryLightPinkFour,
        borderWidth: 1,
        borderRadius: 3,
        padding: 10,
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
                    { scaleX: .8 },
                    { scaleY: .8 }
                ],
            },

        }),
        marginLeft: 10
    },
    viewItemStudent: {
        flex: 1,
        alignItems: 'center',
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
        marginBottom: 10,
        width: 70,
    },
    stext: {
        fontSize: sizes.reText(13),
        fontWeight: '500'
    },
    nviewPicker: {
        flex: 1,
        borderRadius: 6,
        backgroundColor: colors.paleGreyTwo, alignItems: 'center',
        height: 40
    },
    ntextViewPicker: {
        paddingLeft: 15, fontWeight: 'bold', fontSize: 15
    }
})
const mapStateToProps = state => ({
    infoUser: state.infoUser,
});

export default Utils.connectRedux(Diemdanh, mapStateToProps, true);