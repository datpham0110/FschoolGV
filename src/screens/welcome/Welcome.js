import React, { Component } from 'react';
import Utils from '../../app/Utils';
import {
	Text, View, ImageBackground, Image, TouchableOpacity,
	Platform, StyleSheet, ScrollView, Dimensions, Linking
} from 'react-native';
import HeaderCom from '../../components/HeaderCom';
import { nkey } from '../../app/keys/keyStore';
import { nstyles, nwidth } from '../../styles/styles';
import { Images } from '../../images';
import { sizes, reText } from '../../styles/size';
import { colors } from '../../styles/color';
import { ThongBaoInsertUpdate } from '../../apis/getNotifycation';
import { nGlobalKeys } from '../../app/keys/globalKey';
import apis from '../../apis';
import LinearGradient from 'react-native-linear-gradient';
import { ROOTGlobal } from "../../app/data/dataGlobal";
const { width, height } = Dimensions.get('window');
import { ListChatLop } from "../../apis/chat";
import { appConfig } from '../../app/Config';
import { Version } from '../../apis/apiLogin';
const Pulse = require('react-native-pulse').default;


class Welcome extends Component {
	constructor(props) {
		super(props);
		nthisApp = this;
		this.state = {
			lisIdtMenu: []
		};
	}
	_getMenu = async () => {
		const lisIdtMenu = [];
		const res = await apis.HomePortal.LayMenuChucNang();
		if (res.status == 1) {
			const data = res.data;
			for (let index = 0; index < data.length; index++) {
				const item = data[index];
				lisIdtMenu.push(item.IDMenu);
			};
			this.setState({ lisIdtMenu });
		} else {
			Utils.showMsgBoxOK(this, 'Cảnh báo', 'Có lỗi xảy ra, vui lòng thử lại sau')
		}
		Utils.nlog('menu', res)

	}
	_logout = () => {
		Utils.nsetStore(nkey.token, '');
		Utils.nsetStore(nkey.nameuser, '');
		Utils.nsetStore(nkey.password, '');
		Utils.goscreen(this, 'sc_EnterYourPhoneNumber');
	};

	_clickMenu = (route: String, param: Object) => () => {
		if (param) Utils.goscreen(this, route, param);
		else Utils.goscreen(this, route);
	};

	_open = () => {
		this.props.navigation.openDrawer();
	};

	postNotification = async () => {
		let device = Utils.getGlobal(nGlobalKeys.notification);
		let res = await ThongBaoInsertUpdate(device.userId, ROOTGlobal.dataUser.IdUser, Platform.OS)
		Utils.nlog('postNotification', res)
		Utils.setGlobal(nGlobalKeys.deviceToken, res.data.DevicesToken);
		Utils.nlog('device', ROOTGlobal.dataUser.IdUser)
	}

	renderItemMenuTop = (icon, routerName = '', name = '', param = false, countNotify = 0) => {
		let sizeItemTop = nwidth * 0.4;
		return (
			<View>
				<TouchableOpacity
					style={{ alignItems: 'center', flexDirection: 'column', width: sizeItemTop, margin: 10 }}
					onPress={this._clickMenu(routerName, param)}>
					<ImageBackground
						style={nstyles.nIcon120}
						resizeMode="stretch"
						source={icon}
					>
					</ImageBackground>
					<Text style={{
						textAlign: 'center', fontWeight: '500', fontSize: sizes.sText18, color: colors.black_80
					}}>{name}</Text>
				</TouchableOpacity>
				{countNotify > 0 ?
					<View style={{
						position: 'absolute', alignSelf: 'flex-end', width: width * 0.08,
						height: width * 0.08, justifyContent: 'center',
						alignItems: 'center',
					}}>
						<Image
							style={{ width: 18, height: 18, tintColor: colors.redStar }}
							source={Images.icStarReview}>
						</Image>
						<Pulse
							color='red'
							numPulses={3}
							diameter={width * 0.09}
							speed={100}
							duration={1000}
						/>
					</View> : null
				}
			</View>

		);
	}

	renderItemMenuBot = (icon, routerName = '', name = '', param = false) => {
		let sizeImg = nwidth * 0.07;
		return (
			<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
				onPress={this._clickMenu(routerName, param)}>
				<Image resizeMode="contain" source={icon}
					style={{ width: sizeImg, height: sizeImg, margin: 10 }} />
				<View style={{
					flex: 1, flexDirection: 'row', borderBottomWidth: 1, marginRight: 10,
					height: nwidth * 0.12, alignItems: 'center', borderBottomColor: colors.veryLightPinkThree
				}}>
					<Text style={{ flex: 1, marginLeft: 5, fontSize: sizes.sText17 }}>{name}</Text>
					<Image resizeMode="contain" source={Images.iconNext1} style={{ width: nwidth * 0.04, height: nwidth * 0.04 }} />
				</View>
			</TouchableOpacity>
		);
	}

	componentDidMount() {
		this._checkVersion();
		this.postNotification();
		this._getMenu();
		this._loadListDataRedux();
	}

	_checkVersion = async () => {
		let res = await Version();
		if (res.status == 1) {
			if (res.data.length > 0) {
				for (let i = 0; i < res.data.length; i++) {
					if (res.data[i].TenApp == 'GiaoVien') {
						if (appConfig.Version < res.data[i].Version) {
							Utils.showMsgBoxOK(this, 'Thông báo', 'Ứng dụng vừa có bản cập nhật mới, tiếp tục để cập nhật ứng dụng', 'Đóng', this._goStore)
						}
					}
				}
				// Utils.nlog('resresresres', res)
			}
		}
	}
	_goStore = () => {
		if (Platform.OS === 'android') {
			Linking.openURL('https://play.google.com/store/apps/details?id=com.yschool.teacher').catch((err) => Utils.nlog('Bạn phải cài đặt ứng dụng Viber trên điện thoại để sử dụng chức năng này!'));
		} else {
			Linking.openURL('https://apps.apple.com/us/app/yschool-nhàtrường/id1486290446?ls=1').catch((err) => Utils.nlog('Bạn phải cài đặt ứng dụng Viber trên điện thoại để sử dụng chức năng này!'));

		}
	}

	_loadListDataRedux = () => {
		this._loadListClassChatRedux();
	}

	_loadListClassChatRedux = async () => {
		let res = await ListChatLop();
		if (res.status == 1) {
			this.props.setListClassChat(res.data)
		} else {
			this.props.setListClassChat([])
		}
	}

	_countTraoDoi = (data) => {
		let count = 0;
		for (let i = 0; i < data.length; i++) {
			count += data[i].IsRead;
		}
		return count;
	}

	_hidenMenu = (id) => {
		let hiden = true;
		if (this.state.lisIdtMenu.includes(id))
			hiden = false;
		return hiden;
	}

	render() {
		const { infoUser } = this.props;
		isTransparent = false;
		const { lisIdtMenu } = this.state;
		return (
			<View style={[nstyles.ncontainerX, { backgroundColor: colors.white }]}>
				<HeaderCom
					titleText={ROOTGlobal.dataUser.TenChiNhanh}
					nthis={this}
					iconLeft={Images.icMenu1}
					onPressLeft={this._open}
				/>
				<LinearGradient
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
					colors={isTransparent ? [colors.nocolor, colors.nocolor] : ['#84D3A5', '#2FBACF']}
					style={{ height: 130 }}>
				</LinearGradient >
				<View style={{ top: -130, flex: 1 }} >
					<View style={{ paddingVertical: 10, paddingHorizontal: 15, alignItems: 'center' }}>
						<Text style={{ fontSize: reText(16), fontWeight: '700', color: 'white', fontStyle: 'italic' }}>{'Giáo viên:  '}{infoUser.FullName}</Text>
					</View>
					<View style={[nstyles.nbody, { marginHorizontal: 10, backgroundColor: 'white', borderRadius: 6 }]}>
						<View style={[nstyles.nrow, { flexWrap: 'wrap', justifyContent: 'center', marginTop: 5 }]}>
							{this.renderItemMenuTop(Images.icHomeDd, 'sc_Diemdanh', 'Điểm danh')}
							{this.renderItemMenuTop(Images.icHomeBaoBai, 'sc_BaoBaiMain', 'Báo bài', { type: 2 })}
							{this.renderItemMenuTop(Images.icHomeChat, 'sc_ChatStack', 'Trao đổi', this._countTraoDoi(this.props.listClassChat))}
							{this.renderItemMenuTop(Images.bgHocPhi, 'sc_HocPhi', 'Học phí')}
							{this.renderItemMenuTop(Images.icNotifycation1, 'sc_notification', 'Gửi thông báo')}
							{this.renderItemMenuTop(Images.icThpiKhoaBieu1, 'sc_ThoiKhoaBieuHome', 'Thời khoá biểu')}
							{this.renderItemMenuTop(Images.icKhaosat, 'sc_KhaoSatHome', 'Khảo sát')}
							{this.renderItemMenuTop(Images.icoCam, 'sc_KhaoSatHome', 'Camera')}
						</View>
						{/* menu 2 */}
						{/* <View style={[nstyles.nrow, { marginTop: 5, alignItems: 'center', justifyContent: 'center' }]}>
							<TouchableOpacity onPress={() => Utils.goscreen(this, 'sc_GocHocTapStack', { nthisApp })} >
								<Image source={Images.icGochocTap} resizeMode='contain' style={{ width: width * 0.26, height: width * 0.26 }} />
							</TouchableOpacity>
							<View style={{ width: 15 }} />
							<TouchableOpacity onPress={() => Utils.goscreen(this, 'sc_GocHoatDongStack')}>
								<Image source={Images.icGocHoatDong} resizeMode='contain' style={{ width: width * 0.26, height: width * 0.26 }} />
							</TouchableOpacity>
							<View style={{ width: 15 }} />
							<TouchableOpacity onPress={() => Utils.goscreen(this, 'sc_KhaoSatHome')}>
								<Image source={Images.icKhaosat} resizeMode='contain' style={{ width: width * 0.26, height: width * 0.26 }} />
							</TouchableOpacity>
						</View> */}
						{/* menu 3 */}
						{/* <View style={{ marginHorizontal: 10, marginTop: 15, marginBottom: 10 }}>
							{this.renderItemMenuBot(Images.icNotifycation1, 'sc_notification', 'Gửi thông báo', { type: 1 })}
							{this.renderItemMenuBot(Images.iconMail1, 'sc_notification', 'Thư mời - Sự kiện', { type: 4 })}
							{this.renderItemMenuBot(Images.icThpiKhoaBieu1, 'sc_ThoiKhoaBieuHome', 'Thời khoá biểu')}
							{this.renderItemMenuBot(Images.icKhac, 'sc_TienichHome', 'Các tiện ích khác')}
							{this.renderItemMenuBot(Images.icCall, 'sc_HoTroKhachHang', 'Hỗ trợ 24/7')}
						</View> */}
					</View>
				</View>
			</View >
		);
	}
}

const mapStateToProps = state => ({
	infoUser: state.infoUser,
	listClassChat: state.listClassChat
});

export default Utils.connectRedux(Welcome, mapStateToProps, true);

const stWelcome = StyleSheet.create({
	titleGrp: {
		fontSize: sizes.sText20,
		marginLeft: 15,
		fontWeight: '500',
		marginTop: 20
	}
});