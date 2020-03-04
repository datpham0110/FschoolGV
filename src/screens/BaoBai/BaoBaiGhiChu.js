// import React, { Component } from "react";
// import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
// import Utils from "../../app/Utils";
// import { colors, sizes, nstyles } from "../../styles";
// import HeaderCom from "../../components/HeaderCom";
// import { Images } from "../../images/index";
// import ButtonCom from "../../components/Button/ButtonCom";
// import styles from './styles';
// import { BaoBaiSend, ThongBaoCreate } from "../../apis/thanhtoan";
// import { ROOTGlobal } from "../../app/data/dataGlobal";
// import ListEmpty from "../../components/ListEmpty";

// export default class BaoBaiGhiChu extends Component {
//     constructor(props) {
//         super(props);
//         DSlistBB = Utils.ngetParam(this, 'DSlistBB', {})
//         listChild = Utils.ngetParam(this, 'listChild'),
//             nthis = this;
//         this.khoangcach = 18;
//         this.clickAll = false;
//         this.state = {
//             date: "",
//             namestudent: '',
//             checkBB: [],
//             content: '',
//             textGChu: '',
//             tieude: '',
//             tenthongbao: 'Báo bài',
//             isLoading: false
//         };
//         Utils.nlog('listChild', listChild)
//     }

//     componentDidMount() {
//         var month = new Date().getMonth() + 1; //Current Month
//         var year = new Date().getFullYear();
//         this.setState({ date: "T" + month + "/" + year });
//     }

//     _CheckItem = (id) => {
//         Utils.nlog('check', id)
//         const checkBB = this.state.checkBB.slice();
//         if (checkBB.includes(id)) {
//             const index = checkBB.indexOf(id);
//             checkBB.splice(index, 1)
//         } else {
//             checkBB.push(id)
//         };
//         Utils.nlog('check', checkBB)
//         this.setState({ checkBB });
//     }

//     _GhiChu = () => {
//         Utils.nlog('_GhiChu', this.state.checkBB)
//         if (this.state.checkBB.length == 0) {
//             Utils.showMsgBoxOK(this, 'Thông báo', 'Vui lòng chọn bài tập cho bé')
//             return;
//         } else {
//             let data = []
//             for (let i = 0; i < DSlistBB.length; i++) {
//                 for (let j = 0; j < this.state.checkBB.length; j++) {
//                     if (i == this.state.checkBB[j]) {
//                         data.push(DSlistBB[i])
//                         break;
//                     };
//                 };
//             };
//             Utils.goscreen(this, 'sc_ListHSGhichu', { listChild: listChild, DSlistBB: data })
//         }
//     }

//     sendBaobai = async () => {
//         if (this.state.checkBB.length <= 0) {
//             Utils.showMsgBoxOK(this, 'Thông báo', 'Vui lòng chọn bài tập cho bé', 'OK');
//             return;
//         };
//         this.setState({ isLoading: true });
//         const listImage = [];
//         for (let index = 0; index < DSlistBB.length; index++) {
//             const item = DSlistBB[index];
//             const listLinkImage = [];
//             const dataImage = item.image;
//             if (dataImage)
//                 for (let index = 0; index < dataImage.length; index++) {
//                     const itemimg = dataImage[index];
//                     const imgbase64 = await Utils.parseBase64(itemimg.uri, itemimg.height, itemimg.width);
//                     const objImage = {
//                         strBase64: imgbase64,
//                         filename: itemimg.idItem,
//                         extension: "png",
//                         IdUser: ROOTGlobal.dataUser.IdUser
//                     };
//                     listLinkImage.push(objImage);
//                     listImage.push(objImage);
//                 };
//             item.listLinkImage = listLinkImage;
//         };
//         const listIDHS = listChild.map(item => item.IDHocSinh)
//         Utils.nlog('lis iamge', listImage)
//         Utils.nlog('sendBaobai', DSlistBB, listIDHS)
//         let res = await BaoBaiSend(DSlistBB, listIDHS, [], '', listImage);
//         Utils.nlog('res sendBaobai', res)
//         if (res.status == 1) {
//             Utils.showMsgBoxOK(this, 'Thông báo', 'Gửi báo bài thành công', 'OK', this._submit);
//         } else {
//             Utils.showMsgBoxOK(this, 'Thông báo', 'Có lỗi xảy ra vui lòng thử lại sau', 'OK');
//         };
//         this.setState({ isLoading: false });
//     }

//     PostBaoBai = async () => {
//         var { tenthongbao, tieude, textGChu } = this.state;
//         let res = await ThongBaoCreate(tenthongbao, tieude, textGChu, '2', ROOTGlobal.IdCN, '2019/10/30')
//         Utils.nlog('PostBaoBai', res)
//         if (res.status == 1) {
//             Utils.showMsgBoxOK(this, 'Thông báo', 'Lưu báo bài thành công');
//             await this.PhuHuynhList();
//         } else {
//             Utils.showMsgBoxOK(
//                 this, 'Thông báo', res.error.message)
//         }
//     }

//     _renderImage = ({ item }) => <Image
//         resizeMode="cover" source={{ uri: item.uri }}
//         tintColorLeft={colors.black_11}
//         style={{ width: sizes.fs(106), height: sizes.fs(106), marginRight: 5, marginBottom: 5 }} />

//     _renderItem = ({ item, index }) => {
//         const { nrow, nmiddle } = nstyles.nstyles;
//         return <TouchableOpacity
//             activeOpacity={0.5}
//             onPress={() => this._CheckItem(index)}
//             style={[{ backgroundColor: colors.white, marginTop: index == 0 ? 24 : 10, paddingHorizontal: this.khoangcach, marginHorizontal: this.khoangcach, paddingVertical: nstyles.khoangcach }]}>
//             <View style={stBaoBaiDetail.containText}>
//                 <Text style={stBaoBaiDetail.stext} numberOfLines={1}>{item.TieuDe}</Text>
//             </View>
//             <View
//                 style={{
//                     borderColor: colors.veryLightPinkThree, borderWidth: 0.5,
//                     paddingHorizontal: this.khoangcach, marginTop: 13, paddingBottom: 20
//                 }}>
//                 {/* <Text style={[styles.text13, { flex: 1, alignSelf: 'flex-end' }]}>{item.NoiDung}</Text> */}

//                 <Text style={[styles.text13, { flex: 1, paddingVertical: 10 }]}>{item.NoiDung}</Text>

//                 <View style={{ flexWrap: 'wrap', flex: 1, marginHorizontal: -this.khoangcach + 8 }}>
//                     {item.image ? <FlatList
//                         numColumns={3}
//                         data={item.image}
//                         scrollEnabled={false}
//                         renderItem={this._renderImage}
//                         keyExtractor={item => item.uri}
//                     /> : null}
//                 </View>

//             </View>
//             <TouchableOpacity
//                 onPress={() => this._CheckItem(index)}
//                 // style={{ padding: 10 }}
//                 style={{ position: 'absolute', right: 0, left: '105%', top: 0, bottom: '120%', backgroundColor: 'rgba(0,0,0,0)', alignItems: 'flex-end', zIndex: 3 }}>
//                 <View style={[nstyles.nstyles.nIcon12, nmiddle, {
//                     borderColor: 'green', borderWidth: 0.5,
//                     borderRadius: 2, backgroundColor: this.state.checkBB.includes(index) ? 'green' : 'white'
//                 }]}>
//                     <Image source={Images.icCheckBlue} style={{ width: sizes.reSize(10), height: sizes.reSize(10), tintColor: colors.white }}
//                         resizeMode='contain' />
//                 </View>
//             </TouchableOpacity>
//         </TouchableOpacity>
//     }

//     renderSeparator = () => {
//         return (
//             <View style={[nstyles.nstyles.nrow, { height: 1, width: '100%' }]}>
//                 <View style={{ width: '20%', backgroundColor: colors.white }} />
//                 <View style={{ width: '80%', backgroundColor: colors.veryLightPinkSeven }} />
//             </View>
//         );
//     };

//     _submit = () => {
//         Utils.goscreen(this, 'sc_BaoBaiHT', { type: 2 });
//     }

//     render() {
//         const { nrow } = nstyles.nstyles;
//         return (
//             <View style={[nstyles.nstyles.ncontainerX, { backgroundColor: colors.whitegay }]}>
//                 <HeaderCom
//                     nthis={this}
//                     iconLeft={Images.icBackBlue}
//                     titleText={"Báo bài"}
//                     titleStyle={{ color: colors.white, fontSize: sizes.reText(18) }}
//                 />
//                 {/* //body------- */}
//                 <View style={{ flex: 1 }}>
//                     <FlatList
//                         ListEmptyComponent={<ListEmpty textempty={'Không có dữ liệu'} />}
//                         data={DSlistBB}
//                         renderItem={this._renderItem}
//                         extraData={this.state.checkBB}
//                         keyExtractor={(item, index) => index.toString()}
//                     />
//                 </View>
//                 <View style={nstyles.nbody}>
//                     <TouchableOpacity onPress={this._GhiChu} style={{
//                         paddingHorizontal: 15, backgroundColor: colors.white, marginHorizontal: this.khoangcach,
//                         marginVertical: 15, paddingVertical: 15, alignItems: 'center'
//                     }}>
//                         <Text style={{ fontWeight: 'bold', fontSize: sizes.fs(14) }}>Thêm ghi chú</Text>
//                     </TouchableOpacity>
//                 </View>
//                 <View style={[nrow, { height: 55, justifyContent: 'center' }]}>
//                     <ButtonCom
//                         colorChange={[colors.lightSalmon, colors.salmonTwo]}
//                         onPress={this.sendBaobai}
//                         Linear={true}
//                         text={"Hoàn thành"}
//                         style={{ paddingHorizontal: 50, marginTop: 10 }}
//                     />
//                 </View>
//                 {this.state.isLoading ? <View style={[nstyles.nstyles.nmiddle, { position: 'absolute', width: '100%', height: '100%', backgroundColor: colors.black_20 }]}>
//                     <ActivityIndicator color={colors.white} size='large' />
//                 </View> : null}
//             </View>
//         );
//     }
// }

// const stBaoBaiDetail = StyleSheet.create({
//     container: {
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         backgroundColor: colors.whitegay,
//         paddingHorizontal: 10, paddingVertical: 8,
//         borderRadius: 6,
//         flex: 1
//     },
//     stext: {
//         fontSize: sizes.reText(13),
//         fontWeight: '500'
//     },
//     containText: {
//         backgroundColor: colors.whitegay,
//         alignSelf: 'flex-start',
//         padding: 5,
//         borderRadius: 3,
//         paddingHorizontal: 10
//     }
// })