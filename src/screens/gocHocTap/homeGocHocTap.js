import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { Dimensions } from 'react-native';
import { colors, sizes } from '../../styles';
import ListEmpty from "../../components/ListEmpty";

import { reSize, reText } from '../../styles/size';
import Utils from '../../app/Utils';
import { nstyles, Height } from '../../styles/styles';
import { nGlobalKeys } from '../../app/keys/globalKey';
import { notification } from '../../apis/notifycation';
import HeaderCom from '../../components/HeaderCom';
import { Images } from '../../images';
import { Picker } from 'native-base';
import { MonHocList } from '../../apis/danhmuc';
import DatePick from '../../components/DatePick';
import { ListLop, HocSinhList } from '../../apis/thanhtoan';
import { ROOTGlobal } from '../../app/data/dataGlobal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ButtonCom from '../../components/Button/ButtonCom';
import { GocHocTap_Create } from '../../apis/gochoctap';
import Moment from "moment";
const { width } = Dimensions.get('window');

class HomeGocHocTap extends Component {
    constructor(props) {
        super(props);
        search = '';
        this.khoangcach = 18;
        this.index = 0;
        this.id = 0;
        nthis = this;
        this.state = {
            keyWord: '',
            data: '',
            listLop: [],
            listMonHoc: [],
            valuListTruong: ROOTGlobal.IdCN,
            valuListLop: 'Mam non',
            valuMonHoc: 'Hóa học',
            newDate: new Date,
            textGChu: '',
            save: true,
            image: [],
            isLoading: false,
            listChild: [],
            classSelect: '',
            subjectsSelect: ''
        };
    }
    componentDidMount() {
        this.DSLop();
        this.getMonHocList()
    }
    _save = async () => {
        this.setState({ save: false })
    }
    _goMediapicker = (optionsCus) => {
        if (optionsCus == undefined || optionsCus == null)
            optionsCus = {};
        response = (res) => {
            // Utils.nlog('images', res)
            if (res.iscancel) {
            }
            else if (res.error) {
            }
            else {
                this.setState({ image: res });
            }
        }
        let options = {
            assetType: 'Photos', //All,Videos,Photos - default
            multi: true,// chọn 1 or nhiều item
            response: response, // callback giá trị trả về khi có chọn item
            limitCheck: -1, //gioi han sl media chon: -1 la khong co gioi han, >-1 la gioi han sl =  limitCheck
            ...optionsCus
        };
        Utils.goscreen(this, 'Modal_MediaPicker', options);
    };
    getMonHocList = async () => {
        let res = await MonHocList()
        if (res.status == 1) {
            listMonHoc = res.data
            this.setState({ listMonHoc, subjectsSelect: res.data[0] })
        }
    }
    _editText = () => {
        this.setState({ save: true }, this.INPUT.focus());
    }
    getListmonhoc = async (valIdLop) => {
        for (let i = 0; i < this.state.listMonHoc.length; i++) {
            if (this.state.listMonHoc[i].IdMonHoc == valIdLop) {
                this.setState({ subjectsSelect: this.state.listMonHoc[i] });
                return
            }
        }
    }
    DSLop = async () => {
        let res = await ListLop(this.state.valuListTruong)
        if (res.status == 1) {
            listLop = res.data
            this.setState({ listLop }, () => {
                if (listLop.length != 0) {
                    let tempId = listLop[0].IDNhomKH;
                    this.lop = listLop[0].TenNhomKH;
                    this.setState({ classSelect: listLop[0] })
                    this.GetHocSinhList(tempId)
                };
            });
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', res.error.message)
        }
    }
    _SendGocHocTap_CreateSend = async (IDNhomKH, TenNhomKH, IDMonHoc, NoiDung, Ngay, ThoiGian, ListHinhAnh, ListHocSinh) => {
        let tenmon = this.state.subjectsSelect
        let res = await GocHocTap_Create(IDNhomKH, TenNhomKH, IDMonHoc, NoiDung, Ngay, ThoiGian, ListHinhAnh, ListHocSinh, tenmon.TenMonHoc);
        if (res.status == 1) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Gửi thông báo góc học tập thành công', 'Đóng', () => this._goback());
            this.setState({ image: [], textGChu: '', save: true })
        }
        else {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Gửi thông báo góc học tập thất bại', 'Đóng')
        }
        this.setState({ isLoading: false });
    }
    _goback = () => {
        Utils.goscreen(this, 'sc_Home');
    }
    _showAllImageHotel = (arrImage, index) => () => {
        const imagesURL = [];
        for (let index = 0; index < arrImage.length; index++) {
            const item = arrImage[index];
            const obj = {
                url: item.uri,
                width: item.width,
                height: item.height
            };
            imagesURL.push(obj);
        };

        Utils.goscreen(this, 'sc_ViewImageListShow', { ListImages: imagesURL, index });
    }
    _renderImage = ({ item, index }) => {
        var { save } = this.state
        return (
            <TouchableOpacity onPress={this._showAllImageHotel(this.state.image, index)}>
                <Image
                    resizeMode="cover" source={{ uri: item.uri }}
                    tintColorLeft={colors.black_11}
                    style={{ width: sizes.reSize(120), height: sizes.reSize(120), marginRight: 20, marginBottom: 5 }} />
                {
                    !save ? null : <TouchableOpacity
                        onPress={this._deleteImage(index)}
                        style={{ position: 'absolute', right: 20, top: 0, backgroundColor: 'rgba(0,0,0,0)', alignItems: 'flex-end', zIndex: 3 }}>
                        <View style={[nstyles.nIcon20, { borderRadius: sizes.reSize(10), backgroundColor: colors.white }]}>
                            <Image resizeMode='contain' style={[nstyles.nIcon20, { tintColor: '#707070' }]} source={Images.icCancelTour} />
                        </View>
                    </TouchableOpacity>
                }
            </TouchableOpacity>
        )

    }
    _deleteImage = (nindex) => () => {
        const image = this.state.image.filter((item, index) => nindex !== index);
        this.setState({ image });
    }
    GetHocSinhList = async (valIdLop) => {
        var { valuListTruong } = this.state;
        this.state.listLop.findIndex(item => {
            if (item.IDNhomKH == valIdLop) this.lop = item.TenNhomKH
        });
        this.setState({ valuListLop: valIdLop });
        let res = await HocSinhList(valuListTruong, valIdLop)
        if (res.status == 1) {
            let listChild = []
            for (let i = 0; i < res.data.length; i++) {
                let objChild = {
                    IDHocSinh: '',
                    TenHocSinh: '',
                    XepLoai: '',
                    GhiChu: ''
                }
                objChild.IDHocSinh = res.data[i].IDHocSinh
                objChild.TenHocSinh = res.data[i].TenHocSinh
                objChild.XepLoai = 0
                listChild.push(objChild);
            }
            this.setState({ listChild: listChild })
        } else {
            this.setState({ listChild: [] })
            Utils.showMsgBoxOK(this, 'Thông báo', res.error.message)
        }
    }

    getListSubjects = async () => {
        let res = await MonHocList()
        // if (res.status == 1) {
        //     listMonHoc = res.data
        //     this.setState({ listMonHoc })
        // }
    }

    getListClass = async () => {
        let res = await ListLop(ROOTGlobal.IdCN)
        if (res.status == 1) {
            dataListClass = res.data;
            this.setState({ dataListClass }, () => {
                if (dataListClass.length != 0) {
                    // let tempId = listLop[0].IDNhomKH;
                    // this.onloadData(tempId);
                };
            });
        }
    }
    _touchItemStar = (item, index, number) => {
        let listChild = this.state.listChild;
        if (number == listChild[index].XepLoai) {
            item.XepLoai = 0;
        } else {
            if (number == 1) {
                item.XepLoai = 1
            } else if (number == 2) {
                item.XepLoai = 2
            } else {
                item.XepLoai = 3
            }
        }
        listChild[index] = item;
        this.setState({ listChild: listChild })
    }
    _touchGhiChu = (item, index) => {
        Utils.goscreen(this, 'Modal_GhiChuGocHocTap', { index: index, _addGhiChu: this._addGhiChu })
    }
    _addGhiChu = (index, text) => {
        let listHocSinh = this.state.listChild;
        listHocSinh[index].GhiChu = text;
        this.setState({ listChild: listHocSinh })
    }
    _renderItem = ({ item, index }) => {
        const { nrow, nmiddle } = nstyles;
        return <View style={{ paddingVertical: 14, paddingHorizontal: 15, marginVertical: 5, backgroundColor: 'white', flexDirection: 'row' }}>
            <View style={[nstyles.nmiddle, { width: sizes.reSize(48), height: sizes.reSize(48), borderRadius: sizes.reSize(24), borderWidth: 1, borderColor: colors.veryLightPinkThree }]}>
                <Image style={{ width: sizes.reSize(47), height: sizes.reSize(47) }} source={item % 2 == 0 ? Images.icBe1 : Images.icBe2} resizeMode='contain' />
            </View>
            <View style={{ flexDirection: 'column' }}>
                <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 7 }}>
                    <Text style={[styles.text13, { fontWeight: 'bold' }]}>{item.TenHocSinh}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => this._touchItemStar(item, index, 1)}
                        style={[nrow, { alignItems: 'center' }]}>
                        <TouchableOpacity
                            onPress={() => this._touchItemStar(item, index, 1)}
                            style={{ padding: 5 }}>
                            <Image source={item.XepLoai == 1 ? Images.icstarHS : Images.icUnstarHS}
                                resizeMode='contain' style={{ tintColor: item.XepLoai == 1 ? '#a67747' : null }} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: sizes.fs(16), fontWeight: '500', marginLeft: 5 }}>Đồng</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this._touchItemStar(item, index, 2)}
                        style={[nrow, { alignItems: 'center' }]}>
                        <TouchableOpacity
                            onPress={() => this._touchItemStar(item, index, 2)}
                            style={{ padding: 5 }}>
                            <Image source={item.XepLoai == 2 ? Images.icstarHS : Images.icUnstarHS}
                                resizeMode='contain' style={{ tintColor: item.XepLoai == 2 ? '#b0aca7' : null }} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: sizes.fs(16), fontWeight: '500', marginLeft: 5 }}>Bạc</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this._touchItemStar(item, index, 3)}
                        style={[nrow, { alignItems: 'center' }]}>
                        <TouchableOpacity
                            onPress={() => this._touchItemStar(item, index, 3)}
                            style={{ padding: 5 }}>
                            <Image source={item.XepLoai == 3 ? Images.icstarHS : Images.icUnstarHS}
                                resizeMode='contain' />
                        </TouchableOpacity>
                        <Text style={{ fontSize: sizes.fs(16), fontWeight: '500', marginLeft: 5 }}>Vàng</Text>
                    </TouchableOpacity>
                    <View style={{ width: 13 }} />
                    <TouchableOpacity
                        style={{ backgroundColor: '#29aae1', padding: 7, justifyContent: 'flex-end' }}
                        onPress={() => this._touchGhiChu(item, index)}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Ghi chú</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    }

    sendsendGocHocTap = async () => {
        this.setState({ isLoading: true });
        let listHS = [];
        let countCheck = 0;
        for (let j = 0; j < this.state.listChild.length; j++) {
            if (this.state.listChild[j].XepLoai != 0 || this.state.listChild[j].GhiChu != '') {
                listHS.push(this.state.listChild[j])
                countCheck++;
            }
        }
        if (countCheck == 0) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Chưa có học sinh nào được đánh giá học tập hoặc ghi chú', 'Quay lại')
            this.setState({ isLoading: false });
        } else {
            this.cbiSend(listHS)
        }

    }
    cbiSend = async (listHS) => {
        let day = Moment(this.state.newDate, 'MM/DD/YYYY h:m:s A').format("YYYY/MM/DD");
        let image = this.state.image;
        const listLinkImage = [];
        for (let index = 0; index < image.length; index++) {
            const itemimg = image[index];
            const imgbase64 = await Utils.parseBase64(itemimg.uri, itemimg.height, itemimg.width);
            const objImage = {
                strBase64: imgbase64,
                filename: itemimg.idItem,
                extension: "png",
            };
            listLinkImage.push(objImage);
        };
        this._SendGocHocTap_CreateSend(this.state.valuListLop, this.state.classSelect.TenNhomKH, this.state.subjectsSelect.IdMonHoc, this.state.textGChu, day, 'sss', listLinkImage, listHS);
    }

    render() {
        const { infoUser } = this.props;
        var { listMonHoc, valuMonHoc, listLop, valuListLop, save, textGChu, listChild, subjectsSelect } = this.state
        return (
            <View style={nstyles.ncontainerX}>
                <HeaderCom
                    titleStyle={{ fontSize: reText(16) }}
                    onPressLeft={this._goback}
                    iconLeft={Images.icBackBlue}
                    titleText={'Góc học tập'} />
                <View style={[nstyles.nbody, { backgroundColor: colors.whitegay, marginTop: 15, marginHorizontal: 20, borderRadius: 4 }]}>
                    <View style={[nstyles.nrow, { backgroundColor: colors.white, paddingTop: 10, paddingHorizontal: 20, alignItems: 'center' }]}>
                        <View style={[nstyles.nrow, stHoctap.container]}>
                            <View style={{ flex: 1, paddingVertical: 5 }}>
                                <DatePick
                                    disabled={true}
                                    value={this.state.newDate}
                                    style={{ fontWeight: 'bold', fontSize: sizes.reText(12), alignItems: 'center' }}
                                    format='DD/MM/YYYY'
                                />
                            </View>
                            <Image source={Images.icCalendar} resizeMode='contain' style={[nstyles.nIcon15, { tintColor: '#A3A3A3' }]} />
                        </View>
                        <View style={[nstyles.nrow, stHoctap.container]}>
                            <View style={{ flex: 1, }}>
                                {Platform.OS == 'ios' ?
                                    <View style={{ position: 'absolute', right: 5, top: 0, bottom: 0, justifyContent: 'center' }}>
                                        <Image source={Images.icDown} resizeMode='contain' style={[nstyles.nIcon20, { tintColor: '#A3A3A3' }]} />
                                    </View> : null}
                                <Picker
                                    mode="dropdown"
                                    placeholder={'Chọn lớp'}
                                    style={{ width: '100%', height: 30 }}
                                    textStyle={{ fontWeight: 'bold', fontSize: 13 }}
                                    selectedValue={valuListLop}
                                    onValueChange={(val) => {
                                        this.GetHocSinhList(val);
                                    }}>
                                    {listLop.map((item, index) =>
                                        <Picker.Item key={index} label={item.TenNhomKH} value={item.IDNhomKH} />
                                    )}
                                </Picker>
                            </View>
                        </View>
                    </View>
                    <View style={[nstyles.nrow, { backgroundColor: colors.white, paddingHorizontal: 20, alignItems: 'center' }]}>
                        <View style={[nstyles.nrow, stHoctap.container]}>
                            <View style={{ flex: 1 }}>
                                {Platform.OS == 'ios' ?
                                    <View style={{ position: 'absolute', right: 5, top: 0, bottom: 0, justifyContent: 'center' }}>
                                        <Image source={Images.icDown} resizeMode='contain' style={[nstyles.nIcon20, { tintColor: '#A3A3A3' }]} />
                                    </View>
                                    : null
                                }
                                <Picker
                                    mode="dropdown"
                                    placeholder={'Chọn môn'}
                                    style={{ width: '100%', height: 30 }}
                                    textStyle={{ fontWeight: 'bold', fontSize: 13 }}
                                    selectedValue={subjectsSelect.IdMonHoc}
                                    onValueChange={(val) => { this.getListmonhoc(val); }}>
                                    {listMonHoc.map((item, index) =>
                                        <Picker.Item key={index} label={item.TenMonHoc} value={item.IdMonHoc} />
                                    )}
                                </Picker>
                            </View>
                        </View>
                    </View>
                    <KeyboardAwareScrollView
                        getTextInputRefs={() => { return [this._textInputRef]; }}
                        showsVerticalScrollIndicator={false} extraHeight={100} keyboardShouldPersistTaps={'always'}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            style={{ marginTop: 5 }}>
                            <FlatList
                                scrollEnabled={false}
                                ListEmptyComponent={<ListEmpty textempty={'Lớp không có học sinh để hiển thị'} />}
                                data={listChild}
                                renderItem={this._renderItem}
                                keyExtractor={(item, index) => index.toString()}
                                ItemSeparatorComponent={this.renderSeparator}
                                extraData={listChild} />
                            <View style={nstyles.nbody}>
                                <View style={{ paddingHorizontal: 15, backgroundColor: colors.white, marginVertical: 15, borderBottomEndRadius: 6, borderBottomStartRadius: 6, paddingVertical: 15 }}>
                                    {save ? <Text style={{ fontSize: sizes.reText(18), color: colors.azure, marginTop: 13 }}>Nhập kết quả học trong ngày</Text>
                                        : <View style={stHoctap.containText}>
                                            <Text style={stHoctap.stext} numberOfLines={1}>Nội dung</Text></View>
                                    }
                                    <View style={{
                                        borderColor: colors.veryLightPinkThree, borderWidth: 0.5,
                                        paddingHorizontal: this.khoangcach, marginTop: 13, paddingBottom: 20
                                    }}>
                                        <TextInput
                                            ref={ref => this.INPUT = ref}
                                            editable={save}
                                            placeholder={'Nội dung'}
                                            multiline={true}
                                            style={{ flex: 1, textAlignVertical: 'top', minHeight: 80 }}
                                            onChangeText={(textGChu) => this.setState({ textGChu })}
                                            value={textGChu}
                                            placeholderTextColor="#DCDCDC"
                                            returnKeyType="go"
                                            onSubmitEditing={this.handleEditComplete}
                                            ref={(r) => { this._textInputRef = r; }}
                                        />
                                        <View style={{ flexWrap: 'wrap', flex: 1, marginHorizontal: -this.khoangcach + 8 }}>
                                            {this.state.image.length > 0 ? <FlatList
                                                numColumns={2}
                                                data={this.state.image}
                                                scrollEnabled={false}
                                                renderItem={this._renderImage}
                                                keyExtractor={item => item.uri}
                                                extraData={this.state.save}
                                            /> : null}
                                        </View>
                                    </View>
                                    <View style={[nstyles.nrow, { justifyContent: 'space-between', marginTop: 13, paddingHorizontal: this.khoangcach }]}>
                                        {
                                            !save ? null :
                                                <TouchableOpacity
                                                    onPress={this._goMediapicker}>
                                                    <Image resizeMode='contain' style={nstyles.nIcon20} source={Images.icCameraBlack} />
                                                </TouchableOpacity>
                                        }
                                        {/* <TouchableOpacity onPress={this._editText}
                                            style={[stHoctap.containText, { backgroundColor: save ? colors.colorGreenTwo1 : 'blue', alignSelf: 'flex-end', }]}>
                                            <Text style={[styles.text13, { color: colors.white }]}>{'Sửa'}</Text>
                                        </TouchableOpacity> */}
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </KeyboardAwareScrollView>
                </View>
                <View style={[nstyles.nrow, { height: 55, justifyContent: 'center', marginBottom: 10 }]}>
                    <ButtonCom
                        colorChange={[colors.lightSalmon, colors.salmonTwo]}
                        onPress={this.sendsendGocHocTap}
                        Linear={true}
                        text={"Hoàn thành"}
                        style={{ paddingHorizontal: 50, marginTop: 10 }}
                    />
                </View>
                {this.state.isLoading ? <View style={[nstyles.nmiddle, { position: 'absolute', width: '100%', height: '100%', backgroundColor: colors.black_20 }]}>
                    <ActivityIndicator color={colors.white} size='large' />
                </View> : null}
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
        flex: 1, margin: 7, borderRadius: 4
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
    }
})

const styles = StyleSheet.create({
    stext: {
        fontSize: sizes.reText(13),
        fontWeight: '500'
    },

})

const mapStateToProps = state => ({
    infoUser: state.infoUser
});

export default Utils.connectRedux(HomeGocHocTap, mapStateToProps, true);