import React, { Component, Fragment } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Switch, Dimensions, Image, ScrollView, ActivityIndicator, Platform, ListEmpty } from 'react-native';
import { colors, sizes } from '../../styles';
import { nstyles } from '../../styles/styles';
import HeaderCom from '../../components/HeaderCom';
import { Images } from '../../images';
import { reText } from '../../styles/size';
import { DiemDanhList } from '../../apis/thanhtoan';
import Utils from '../../app/Utils';
import ButtonCom from '../../components/Button/ButtonCom';
import { DiemDanh_Update } from "../../apis/thanhtoan";
import { ROOTGlobal } from '../../app/data/dataGlobal';
import DatePicker from 'react-native-datepicker'
import { MonHocList } from '../../apis/danhmuc';

const { width } = Dimensions.get("window");
export default class Diemdanh extends Component {
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
            listHS: [],
            DiemDanhData: '',
            listTruong: [],
            listLop: [],
            valuListTruong: ROOTGlobal.IdCN,
            valuListLop: '',
            isLoading: false,
            date: new Date(),
            dateGioVao: tempHouse + ":" + tempMinutes,
            dateGioVaoFlag: tempHouse + ":" + tempMinutes,
            dateGioRa: '16:30',
            isCapNhat: false,
            flagCapNhat: false,
            itemChildCapNhat: null,
            listGheRender: [],
            listMonHoc: [],
            tenLop: '...',
            nameLop: 'Chọn lớp',
            nameSubject: 'Chọn môn học',
            loaiLop: 0,
            tenLopLoai2: 'Chọn lớp',
            isSoDoHopLe: false,
            subjectsSelected: null
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
        Utils.nlog('----------------- Diem Danh', this.state.dateGioVao)
    }

    componentDidMount() {
        this.getMonHocList()
    }
    // Load list môn học
    getMonHocList = async () => {
        let res = await MonHocList()
        if (res.status == 1) {
            listMonHoc = res.data
            this.setState({ listMonHoc })
        }
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
        if (this.state.loaiLop == 1) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn không thể chọn môn vì đây là môn mặc định của lớp ' + this.state.nameLop, 'Đóng')
            return;
        }
        //sc_SelectSubjects
        Utils.goscreen(this, 'sc_SelectSubjects', { returnSubjects: this.returnSubjects })
    }
    // data môn return
    returnSubjects = (item) => {
        this.setState({ nameSubject: item.TenMonHoc, subjectsSelected: item })
        this.Listdiemdanh(this.state.valuListLop, this.state.loaiLop, item.IdMonHoc);

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
        this.setState({ listGheRender: arr, listHS: [], valuMonHoc: 'Chọn môn học' })
        if (flag == 0) {
            this.setState({ listGheRender: arr, tenLop: idLop.TenNhomKH, nameLop: idLop.TenNhomKH, valuListLop: idLop, loaiLop: flag, nameSubject: 'Chọn môn học', subjectsSelected: null });
        } else {
            let tenMonHoc = '';
            for (let i = 0; i < this.state.listMonHoc.length; i++) {
                if (this.state.listMonHoc[i].IdMonHoc == idLop.IDMonHoc) {
                    tenMonHoc = this.state.listMonHoc[i].TenMonHoc;
                    this.setState({ nameSubject: this.state.listMonHoc[i].TenMonHoc, subjectsSelected: this.state.listMonHoc[i] })
                    break;
                }
            }
            this.setState({ listGheRender: arr, tenLop: idLop.TenNhomKH, nameLop: idLop.TenNhomKH, valuListLop: idLop, loaiLop: flag, tenLopLoai2: tenMonHoc });
            this.Listdiemdanh(idLop, flag, idLop.IDMonHoc);
        }
    }
    // Select môn học
    getListmonhoc = async (valIdLop) => {
        for (let i = 0; i < this.state.listMonHoc.length; i++) {
            if (this.state.listMonHoc[i].TenMonHoc == valIdLop) {
                this.setState({ subjectsSelected: this.state.listMonHoc[i] });
                if (this.state.nameLop != 'Chọn lớp') {
                    this.Listdiemdanh(this.state.valuListLop, this.state.loaiLop, this.state.listMonHoc[i].IdMonHoc);
                }
            }
        }
    }
    _forAddDate = () => {
        let data = this.state.listHS
        for (let i = 0; i < this.state.listHS.length; i++) {
            data[i].GioVao = this.state.dateGioVao;
            data[i].GioRa = this.state.dateGioRa;
            data[i].Ngay[this.dayInMonth - 1] = -1
        }

        this.setState({ listHS: data, dateGioRa: '16:30', dateGioVao: tempHouse + ":" + tempMinutes })
    }
    _clickItem = (item, index, itemDay) => {
        if (this.state.isEnoughAllStudents == true) {
            this.setState({ isEnoughAllStudents: false })
        }
        if (this.state.itemChildCapNhat == null && this.state.isCapNhat == false) {
            var { listHS } = this.state;
            const dataTemp = listHS.slice(0);
            const day = item.Ngay;
            switch (day[itemDay]) {
                case -1:
                    day[itemDay] = 1
                    break;
                case 0:
                    day[itemDay] = 1
                    break;
                case 1:
                    day[itemDay] = 2
                    break;
                case 3:
                    day[itemDay] = 0
                    break;
                case 2:
                    day[itemDay] = 4
                    break;
                case 4:
                    day[itemDay] = 0
                    break;
                default: day[itemDay] = -1
                    break;
            }
            item.Ngay = day
            for (let i = 0; i < dataTemp.length; i++) {
                if (dataTemp[i].IDHocSinh == item.IDHocSinh) {
                    dataTemp[i] = item;
                    this.setState({ listHS: dataTemp })
                    return;
                }
            }
        }

        else if (this.state.isCapNhat == true) {
            // if (this.state.itemChildCapNhat.MaHocSinh == item.MaHocSinh) {
            var { listHS } = this.state;
            this.setState({ itemChildCapNhat: item })
            const dataTemp = listHS.slice(0);
            const day = item.Ngay;
            switch (day[itemDay]) {
                case -1:
                    day[itemDay] = 1
                    break;
                case 0:
                    day[itemDay] = 1
                    break;
                case 1:
                    day[itemDay] = 2
                    break;
                case 3:
                    day[itemDay] = 0
                    break;
                case 2:
                    day[itemDay] = 4
                    break;
                case 4:
                    day[itemDay] = 0
                    break;
                default: day[itemDay] = -1
                    break;
            }
            item = { ...item, Ngay: day }
            for (let i = 0; i < dataTemp.length; i++) {
                if (dataTemp[i].IDHocSinh == item.IDHocSinh) {
                    dataTemp[i] = item;
                    this.setState({ listHS: dataTemp, flagCapNhat: true })
                    return;
                }
            }
        }
    };
    compare(a, b) {
        if (a < b) {
            return -1;
        }
        if (a > b) {
            return 1;
        }
        return 0;
    }
    // Load list điểm danh
    Listdiemdanh = async (va, flag, idMonHoc = null) => {
        this.setState({ valuListLop: va, isCapNhat: false })
        let res = await DiemDanhList(flag, this.state.valuListTruong, va.IDNhomKH, this.monthInYear.toString() + "/" + this.year.toString(), idMonHoc)
        if (res.status == 1) {
            if (res.data.DanhSach.length == 0) {
                this.setState({ listHS: [] })
                Utils.showMsgBoxOK(this, 'Thông Báo', 'Lớp không có học sinh để hiển thị', 'Đóng');
            } else {
                if (res.data.DanhSach[0].ViTri == '-1') {
                    Utils.showMsgBoxYesNo(this, 'Thông báo', 'Học sinh lớp chưa được sắp xếp sơ đồ, TIẾP TỤC để vào màn hình sắp xếp', 'TIẾP TỤC', 'QUAY LẠI', () => { this.goSD(flag) }, () => { })
                    this.setState({ isSoDoHopLe: true })
                } else {
                    this.setState({ isSoDoHopLe: false })

                }
                for (let i = 0; i < res.data.DanhSach.length; i++) {
                    if (res.data.DanhSach[0].Ngay[this.state.tempDay - 1] != -1) {
                        this.setState({ isCapNhat: true })
                        break;
                    }
                }
                let arr = res.data.DanhSach;
                arr.sort((a, b) => this.compare(parseInt(a.ViTri), parseInt(b.ViTri)));
                let arr1 = [];
                for (let index = 0; index < 30; index++) {
                    let ghe = {
                        IDHocSinh: 'null'
                    }
                    arr1.push(ghe);
                }
                let data1 = arr1;
                for (let j = 0; j < arr.length; j++) {
                    data1[arr[j].ViTri] = arr[j]
                }
                this.setState({ listHS: arr, DiemDanhData: res.data, listGheRender: data1 })
                if (this.state.isCapNhat == true) {
                    if (this.state.loaiLop == 0) {
                        Utils.showMsgBoxYesNo(this, 'Thông báo', 'Lớp ' + va.TenNhomKH + ' môn ' + this.state.subjectsSelected.TenMonHoc + ' đã được điểm danh trước đó. Bạn muốn cập nhật lại điểm danh hay điểm danh mới',
                            'Điểm danh mới',
                            'Cập nhật lại',
                            () => {
                                this.setState({ isCapNhat: false }),
                                    this._forAddDate()
                            }, () => {
                                this.setState({ dateGioRa: arr[0].GioRa, dateGioVao: arr[0].GioVao })
                            })
                    } else {
                        Utils.showMsgBoxYesNo(this, 'Thông báo', 'Lớp ' + va.TenNhomKH + ' đã được điểm danh trước đó. Bạn muốn cập nhật lại điểm danh hay điểm danh mới',
                            'Điểm danh mới',
                            'Cập nhật lại',
                            () => {
                                this.setState({ isCapNhat: false }),
                                    this._forAddDate()
                            }, () => { })
                    }
                }
            }
        }
    }
    isEnoughAllStudentsChange = () => {
        if (this.state.isCapNhat == false) {
            this.setState({ isEnoughAllStudents: !this.state.isEnoughAllStudents })
            data2 = this.state.listHS;
            if (this.state.isEnoughAllStudents == false) {
                for (let i = 0; i < data2.length; i++) {
                    data2[i].Ngay[this.dayInMonth - 1] = 1;
                }
            } else {
                for (let i = 0; i < data2.length; i++) {
                    data2[i].Ngay[this.dayInMonth - 1] = -1;
                }
            }
            this.setState({ listHS: data2 })
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Chức năng này không thể dùng khi đã xác nhận điểm danh', 'Đóng')
        }
    }
    demSoHocSinh = (itemDay, idloai) => {
        let count = 0;
        for (let i = 0; i < this.state.listHS.length; i++) {
            if (idloai == 2) {
                if (this.state.listHS[i].Ngay[itemDay] == 2 || this.state.listHS[i].Ngay[itemDay] == 3)
                    count++
            }
            else {
                if (this.state.listHS[i].Ngay[itemDay] == idloai) count++
            }
        }
        return count;
    }
    _themDiemDanh = async () => {
        let danhSachHocSinh = this.state.listHS
        for (let i = 0; i < danhSachHocSinh.length; i++) {
            danhSachHocSinh[i].NgayDiemDanh = this.dayInMonth + '/' + this.monthInYear + '/' + this.year;
            danhSachHocSinh[i].GioVao = this.state.dateGioVao;
            danhSachHocSinh[i].GioRa = this.state.dateGioRa;
        }
        var data = {
            Chot: true,
            TongNgayHoc: this.state.DiemDanhData.TongNgayHoc,
            IDLopHoc: this.state.valuListLop.IDNhomKH,
            NgayChot: this.dayInMonth + '/' + this.monthInYear + '/' + this.year,
            ChiTiet: danhSachHocSinh
        };
        this.setState({ isLoading: true });
        let res;
        if (this.state.loaiLop == 0) {
            res = await DiemDanh_Update(data, this.state.loaiLop, this.state.subjectsSelected.IdMonHoc);
        } else {
            res = await DiemDanh_Update(data, this.state.loaiLop, this.state.valuListLop.IDMonHoc);
        }
        if (res.status == 1) {
            this.setState({ isCapNhat: true })
            Utils.showMsgBoxOK(this, 'Thành Công', 'Xác nhận điểm danh thành công', 'Đóng', () => { Utils.goback(this) });
        } else {
            Utils.showMsgBoxOK(this, 'Thất Bại', 'Điểm danh không thành công', 'Đóng');
        };
        this.setState({ isLoading: false });
    }
    _submit = async () => {
        for (let i = 0; i < this.state.listHS.length; i++) {
            if (this.state.listHS[i].Ngay[this.dayInMonth - 1] == -1) {
                Utils.showMsgBoxOK(this, 'Thông báo', 'Phải điểm danh hết tất cả học sinh trong lớp', 'Đóng');
                return;
            }
        }

        if (this.state.dateGioRa < this.state.dateGioVao) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Giờ vào không được lớn hơn giờ ra', 'Đóng')
            return;
        }

        if (this.state.dateGioRa == '16:30' && this.state.dateGioVao == this.state.dateGioVaoFlag && this.state.isCapNhat == false) {
            Utils.showMsgBoxYesNo(this, 'Thông báo', 'Giờ vào giờ ra hiện tại đang mặc định. Bạn có muốn tiếp tục không?', 'Tiếp tục', 'Quay lại', this._themDiemDanh, () => { return; })
        } else {
            let danhSachHocSinh = this.state.listHS
            for (let i = 0; i < danhSachHocSinh.length; i++) {
                danhSachHocSinh[i].NgayDiemDanh = this.dayInMonth + '/' + this.monthInYear + '/' + this.year;
                danhSachHocSinh[i].GioVao = this.state.dateGioVao;
                danhSachHocSinh[i].GioRa = this.state.dateGioRa;
            }
            var data = {
                Chot: true,
                TongNgayHoc: this.state.DiemDanhData.TongNgayHoc,
                IDLopHoc: this.state.valuListLop.IDNhomKH,
                NgayChot: this.dayInMonth + '/' + this.monthInYear + '/' + this.year,
                ChiTiet: danhSachHocSinh
            };
            this.setState({ isLoading: true });
            let res;
            if (this.state.loaiLop == 0) {
                res = await DiemDanh_Update(data, this.state.loaiLop, this.state.subjectsSelected.IdMonHoc);
            } else {
                res = await DiemDanh_Update(data, this.state.loaiLop, this.state.valuListLop.IDMonHoc);
            }
            if (res.status == 1) {
                this.setState({ isCapNhat: true })
                Utils.showMsgBoxOK(this, 'Thành Công', 'Xác nhận điểm danh thành công', 'Đóng', () => { Utils.goback(this) });
            } else {
                Utils.showMsgBoxOK(this, 'Thất Bại', 'Điểm danh không thành công', 'Đóng');
            };
            this.setState({ isLoading: false });
        }
    }
    _updateDiemDanh = async () => {
        let danhSachHocSinh = this.state.listHS
        if (this.state.itemChildCapNhat.Ngay[this.dayInMonth - 1] != this.statusDiemDanhTrung) {
            for (let i = 0; i < danhSachHocSinh.length; i++) {
                danhSachHocSinh[i].NgayDiemDanh = this.dayInMonth + '/' + this.monthInYear + '/' + this.year;
            }
            var data = {
                Chot: true,
                TongNgayHoc: this.state.DiemDanhData.TongNgayHoc,
                IDLopHoc: this.state.valuListLop.IDNhomKH,
                NgayChot: this.dayInMonth + '/' + this.monthInYear + '/' + this.year,
                ChiTiet: danhSachHocSinh
            };
            this.setState({ isLoading: true });
            let res
            if (this.state.loaiLop == 0) {
                res = await DiemDanh_Update(data, this.state.loaiLop, this.state.subjectsSelected.IdMonHoc);
            } else {
                res = await DiemDanh_Update(data, this.state.loaiLop, this.state.valuListLop.IDMonHoc);
            }
            this.setState({
                isLoading: false,
                flagCapNhat: false,
                itemChildCapNhat: null
            });
            if (res.status == 1) {
                Utils.showMsgBoxOK(this, 'Thành Công', 'Cập nhật điểm danh thành công', 'Đóng', () => Utils.goback(this));
            } else {
                Utils.showMsgBoxOK(this, 'Thất Bại', 'Cập nhật điểm danh không thành công', 'Đóng', () => Utils.goback(this));
            };
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Điểm danh chưa thay đổi', 'Đóng')
        }
    }
    _update = async () => {
        if (this.state.dateGioRa == '16:30') {
            Utils.showMsgBoxYesNo(this, 'Thông báo', 'Giờ vào giờ ra hiện tại đang mặc định. Bạn có muốn tiếp tục không?', 'Tiếp tục', 'Quay lại', this._updateDiemDanh, () => { return; })
        } else {
            let danhSachHocSinh = this.state.listHS
            if (this.state.itemChildCapNhat.Ngay[this.dayInMonth - 1] != this.statusDiemDanhTrung) {
                for (let i = 0; i < danhSachHocSinh.length; i++) {
                    danhSachHocSinh[i].NgayDiemDanh = this.dayInMonth + '/' + this.monthInYear + '/' + this.year;
                }
                var data = {
                    Chot: true,
                    TongNgayHoc: this.state.DiemDanhData.TongNgayHoc,
                    IDLopHoc: this.state.valuListLop.IDNhomKH,
                    NgayChot: this.dayInMonth + '/' + this.monthInYear + '/' + this.year,
                    ChiTiet: danhSachHocSinh
                };
                this.setState({ isLoading: true });
                let res
                if (this.state.loaiLop == 0) {
                    res = await DiemDanh_Update(data, this.state.loaiLop, this.state.subjectsSelected.IdMonHoc);
                } else {
                    res = await DiemDanh_Update(data, this.state.loaiLop, this.state.valuListLop.IDMonHoc);
                }
                this.setState({
                    isLoading: false,
                    flagCapNhat: false,
                    itemChildCapNhat: null
                });
                if (res.status == 1) {
                    Utils.showMsgBoxOK(this, 'Thành Công', 'Cập nhật điểm danh thành công', 'Đóng', () => Utils.goback(this));
                } else {
                    Utils.showMsgBoxOK(this, 'Thất Bại', 'Cập nhật điểm danh không thành công', 'Đóng', () => Utils.goback(this));
                };
            } else {
                Utils.showMsgBoxOK(this, 'Thông báo', 'Điểm danh chưa thay đổi', 'Đóng')
            }
        }
    }
    _openDatePickTu = () => {
        Utils.nlog('--------------------- _openDatePickTu')
        if (this.state.listHS.length > 0) {
            if (this.state.isCapNhat == true) {
                Utils.showMsgBoxOK(this, 'Thông báo', 'Cập nhật điểm danh không được chọn giờ', 'Đóng')
            } else {
                this.DatePicker1.onPressDate()
            }
        } else {
            this.DatePicker1.onPressDate()
        }
    }
    _openDatePickDen = () => {
        if (this.state.listHS.length > 0) {
            if (this.state.isCapNhat == true) {
                Utils.showMsgBoxOK(this, 'Thông báo', 'Cập nhật điểm danh không được chọn giờ', 'Đóng')
            } else {
                this.DatePicker2.onPressDate()
            }
        } else {
            this.DatePicker2.onPressDate()
        }
    }
    reloadData = (flag) => {
        if (this.state.loaiLop == 0) {
            this.Listdiemdanh(this.state.valuListLop, this.state.loaiLop, this.state.subjectsSelected.IdMonHoc);
        } else {
            Utils.nlog('-------------- reloadData', this.state.valuListLop, this.state.loaiLop, this.state.valuListLop.IDMonHoc)
            this.Listdiemdanh(this.state.valuListLop, this.state.loaiLop, this.state.valuListLop.IDMonHoc);
        }
    }
    goSD = (loaiLop) => {
        Utils.nlog('--------------------', this.state.subjectsSelected)
        if (this.state.subjectsSelected == null) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn phải chọn môn học để sắp xếp sơ đồ', 'Đóng')
        } else {
            if (loaiLop == 0) {
                Utils.goscreen(this, 'Modal_SodoDiemDanh', { loaiLop: this.state.loaiLop, valuListLop: this.state.valuListLop.IDNhomKH, listHSTruyenQua: this.state.listHS, reloadData: this.reloadData, IdMonHoc: this.state.subjectsSelected.IdMonHoc }) //valuMonHoc
            } else {
                Utils.goscreen(this, 'Modal_SodoDiemDanh', { loaiLop: this.state.loaiLop, valuListLop: this.state.valuListLop.IDNhomKH, listHSTruyenQua: this.state.listHS, reloadData: this.reloadData, IdMonHoc: this.state.valuListLop.IDMonHoc })
            }
        }

    }
    _back = () => {
        if (this.state.itemChildCapNhat != null) {
            Utils.showMsgBoxYesNo(this, 'Thông báo', 'Bạn có chắc chắn muốn thoát khi chưa lưu cập nhật điểm danh', 'Đồng ý', 'Huỷ', () => Utils.goback(this))
        } else {
            Utils.goback(this)
        }
    }
    renderItem = (item, index, itemDay) => {
        return (
            this.ItemStudent(item, index, itemDay)
        );
    }
    ItemStudent = (item, index, itemDay) => {

        if (item.IDHocSinh != 'null') {
            var borderColor = colors.ViewTopArea
            if (item.Ngay[itemDay] == -1) {
                borderColor = colors.ViewTopArea;
            }
            else if (item.Ngay[itemDay] == 1) {
                borderColor = 'green';
            } else if (item.Ngay[itemDay] == 3) {
                borderColor = 'blue';
            } else if (item.Ngay[itemDay] == 2) {
                borderColor = 'blue';
            } else if (item.Ngay[itemDay] == 4)
                borderColor = 'orange';
            else
                borderColor = 'red';

            return (
                <View style={[styles.viewItemStudent, { paddingHorizontal: 5 }]}>
                    <TouchableOpacity
                        onPress={() => this._clickItem(item, index, itemDay)}
                    // disabled={this.state.flagCapNhat == true ? this.state.itemChildCapNhat.MaHocSinh == item.MaHocSinh ? false : true : false}
                    >
                        <View style={[styles.viewSelectStudent, { borderColor: borderColor }]} />
                    </TouchableOpacity>
                    <Text style={styles.textNameStudent}>
                        {Utils.splitName(item.TenHocSinh)}
                    </Text>
                </View>
            )
        } else {
            return (
                <View style={[styles.viewItemStudent, { paddingHorizontal: 5 }]}>
                    <TouchableOpacity >
                        <View style={[styles.viewSelectStudent, { borderColor: colors.BackgroundHome }]} />
                    </TouchableOpacity>
                    <Text style={styles.textNameStudent, { color: colors.BackgroundHome }}>
                        --Trống--
                        </Text>
                </View>
            )
        }
    }
    renderDate = itemDay => {
        var { isEnoughAllStudents, listGheRender } = this.state;
        return (
            <View style={[styles.viewTitle, { paddingTop: -10, flex: 1 }]}>
                <View style={styles.viewTotalStudents}>
                    <Text style={styles.textThuNgayThang}>{'Tổng số học sinh: ' + this.state.listHS.length}</Text>
                    <View style={{ width: 20 }} />
                    <View style={[nstyles.nrow, { flex: 1, alignItems: 'center', justifyContent: 'flex-end' }]}>
                        <Text style={[styles.textThuNgayThang, { fontWeight: 'bold' }]}>{'Đủ tất cả'}</Text>
                        <Switch
                            style={styles.switchEnoughAllStudents}
                            thumbColor={colors.azure}
                            value={isEnoughAllStudents}
                            onValueChange={this.isEnoughAllStudentsChange} />
                    </View>
                </View>
                {/* <View style={[nstyles.nrow, { paddingVertical: 5, backgroundColor: 'white', marginBottom: 5 }]}>
                    <View style={nstyles.nrow}>
                        <Text style={[styles.stext, { color: 'green', marginLeft: 10, textAlign: 'left' }]}>{'Có mặt: ' + this.demSoHocSinh(this.dayInMonth - 1, 1)}  </Text>
                    </View>
                    <View style={{ height: 10 }} />
                    <View style={[nstyles.nrow]}>
                        <Text style={[styles.stext, { color: colors.orange, marginLeft: 10, textAlign: 'left' }]}>{'Tham gia hoạt động: ' + this.demSoHocSinh(this.dayInMonth - 1, 4)}  </Text>
                    </View>
                </View> */}
                <View style={[nstyles.nrow, { paddingVertical: 5, backgroundColor: 'white', marginBottom: 10 }]}>
                    <View style={[nstyles.nrow]}>
                        <Text style={[styles.stext, { color: colors.blue, marginLeft: 10, textAlign: 'left' }]}>{'Vắng có phép: ' + this.demSoHocSinh(this.dayInMonth - 1, 2)}  </Text>
                    </View>
                    <View style={{ height: 10 }} />
                    <View style={nstyles.nrow}>
                        <Text style={[styles.stext, { color: 'green', marginLeft: 10, textAlign: 'left' }]}>{'Có mặt: ' + this.demSoHocSinh(this.dayInMonth - 1, 1)}  </Text>
                    </View>
                    <View style={{ height: 10 }} />
                    <View style={[nstyles.nrow]}>
                        <Text style={[styles.stext, { color: 'red', marginLeft: 10, textAlign: 'left' }]}>{'Vắng không phép: ' + this.demSoHocSinh(this.dayInMonth - 1, 0)}</Text>
                    </View>
                </View>

                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    style={{ flex: 1 }}
                    horizontal={true}>
                    <FlatList
                        data={listGheRender}
                        numColumns={8}
                        renderItem={({ item, index }) => this.renderItem(item, index, itemDay)}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={this.state}
                        scrollEnabled={false}
                        ListEmptyComponent={<ListEmpty textempty={'Không có dữ liệu'} />}
                    />
                </ScrollView>
            </View >
        )
    }

    render() {
        var { isCapNhat, listHS, nameSubject, listMonHoc, tenLop, nameLop } = this.state
        layout = (data, index) => ({ length: widthScreen, offset: widthScreen * index, index });
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
                    showsHorizontalScrollIndicator={false}>
                    <View style={[styles.body, { backgroundColor: colors.white, borderRadius: 4, paddingHorizontal: 18, paddingVertical: 18, alignItems: 'center' }]}>
                        <View style={[nstyles.nrow, { flex: 1, alignItems: 'center', justifyContent: 'space-between' }]}>
                            <Text style={[styles.textThuNgayThang, { flex: 1, fontWeight: 'bold', fontSize: sizes.reText(22) }]}>{this.dayInMonth + '/' + this.monthInYear + '/' + this.year}</Text>
                            <View style={{ width: 20 }} />
                            {/* <TouchableOpacity onPress={() => this.goSD(this.state.loaiLop)} style={{ flex: 1, padding: 5, borderRadius: 6, alignItems: 'center', justifyContent: 'flex-end' }}>
                                <Text style={{ fontSize: sizes.fs(14), fontWeight: '500', color: '#2FBACF', textDecorationLine: 'underline', fontStyle: 'italic' }}>Sơ đồ điểm danh</Text>
                            </TouchableOpacity> */}
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
                        {
                            listHS.length == 0 ? <Text style={{ fontSize: sizes.fs(16), fontWeight: '700', paddingTop: 15, color: colors.black_80 }}>Vui lòng chọn lớp và môn học</Text> : <Fragment>
                                {this.renderDate(this.dayInMonth - 1)}
                                {this.state.isSoDoHopLe == false ?
                                    <View style={{ backgroundColor: 'white' }}>
                                        {isCapNhat == false ?
                                            <ButtonCom
                                                colorChange={[colors.lightSalmon, colors.salmonTwo]}
                                                onPress={this._submit}
                                                Linear={true}
                                                text={"Xác nhận"}
                                                style={{ paddingHorizontal: 65, marginTop: 15, marginBottom: 20 }} /> :
                                            <ButtonCom
                                                colorChange={this.state.flagCapNhat == false ? [colors.backgroundHistory, colors.backgroundHistory] : [colors.lightSalmon, colors.salmonTwo]}
                                                onPress={this._update}
                                                Linear={false}
                                                text={"Cập nhật"}
                                                disabled={!this.state.flagCapNhat}
                                                txtStyle={{ color: this.state.flagCapNhat == true ? 'white' : 'black' }}
                                                style={{ paddingHorizontal: 65, marginTop: 15, marginBottom: 20 }} />}
                                    </View> : null}
                            </Fragment>
                        }
                    </View>
                    {this.state.isLoading ? <View style={[nstyles.nmiddle, { position: 'absolute', width: '100%', height: '100%', backgroundColor: colors.black_20 }]}>
                        <ActivityIndicator color={colors.white} size='large' />
                    </View> : null}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    textNameStudent1: {
        marginTop: 15,
        color: colors.blackShadow,
        fontSize: reText(12),
        textAlign: 'center',
        marginBottom: 10,
        flex: 1,
        width: 100
    },
    viewItemStudent1: {
        flex: 1,
        alignItems: 'center',
    },
    body: {
        ...nstyles.nbody,
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10
    },
    viewTitle: {
        backgroundColor: colors.white,
        paddingTop: 21,
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
