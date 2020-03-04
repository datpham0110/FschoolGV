import React, { Component } from "react";
import {
	Text,
	View,
	Image,
	TouchableOpacity,
} from "react-native";
import Utils from "../../app/Utils";
import { colors, sizes } from "../../styles";
import { nkey } from "../../app/keys/keyStore";
import { Images } from "../../images";
import { paddingTopMul, Width } from "../../styles/styles";
import { appConfig } from '../../app/Config';
import OneSignal from "react-native-onesignal";
import { nGlobalKeys } from '../../app/keys/globalKey';
import { LogOut } from '../../apis/autheUser';
import { ListChatLop } from "../../apis/chat";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

class MenuRight extends Component {
	constructor(props) {
		super(props);
		this.onOpened = this.onOpened.bind(this);
		OneSignal.addEventListener("opened", this.onOpened);
	}
	_clickMenu = (route, onAction) => () => {
		Utils.toggleDrawer(this, true);
		if (!onAction) {
			Utils.goscreen(this, route);
		} else
			onAction();
	};
	_loadListClassChatRedux = async () => {
		let res = await ListChatLop();
		Utils.nlog('----------------------------------- ListChatLop', res)
		if (res.status == 1) {
			this.props.setListClassChat(res.data)
		} else {
			this.props.setListClassChat([])
		}
	}
	onOpened(openResult) {
		if (openResult.notification.payload.additionalData.data.deeplink == 'jeekidstudent://app/root/DrawerNativatorRight/HomeStack/ListTeacher') {
			this._loadListClassChatRedux();
			if (openResult.notification.payload.additionalData.data.LoaiChat == 1) {
				if (Utils.getGlobal(nGlobalKeys.screenSelected, '') == 'detailChat') {
					Utils.goback(nthisApp)
					setTimeout(() => {
						Utils.goscreen(nthisApp, 'sc_Chat', { dataNotify: openResult.notification.payload, flagNotify: true })
					}, 500);
				} else {
					Utils.goscreen(nthisApp, 'sc_Chat', { dataNotify: openResult.notification.payload, flagNotify: true })
				}
			}
		}
		if (openResult.notification.payload.additionalData.data.deeplink == undefined) {
			this._loadListClassChatRedux();
			if (Utils.getGlobal(nGlobalKeys.screenSelected, '') == 'detailChat') {
				Utils.goback(nthisApp)
				setTimeout(() => {
					Utils.goscreen(nthisApp, 'sc_DetailsChatGroup', { dataNotify: openResult.notification.payload.additionalData.data, flagNotify: true })
				}, 500);
			} else {
				Utils.goscreen(nthisApp, 'sc_DetailsChatGroup', { dataNotify: openResult.notification.payload.additionalData.data, flagNotify: true })
			}
		}
	}
	onLogout = () => {
		Utils.showMsgBoxYesNo(this, 'Thông báo', 'Bạn có chắc chắn muốn đăng xuất?', 'Đăng xuất', 'Xem lại', this.logOutAuth);
	}
	logOutAuth = async () => {
		let res = await LogOut();
		Utils.nsetStore(nkey.password, null);
		Utils.goscreen(this, 'sc_AuthLogin');
	}
	renderItemMenu = (icon, routerName = '', name = '', onAction = null) => {
		return (
			<TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}
				onPress={this._clickMenu(routerName, onAction)}>
				<Image resizeMode="contain" source={icon}
					style={{ width: Width(7), height: Width(7), margin: 10 }} />
				<View style={{
					flex: 1, flexDirection: "row", borderBottomWidth: 1, alignItems: "center",
					borderBottomColor: colors.veryLightPinkThree, height: Width(12),
				}}>
					<Text style={{ flex: 1, marginLeft: 5, fontSize: sizes.sText17 }}>{name}</Text>
					<Image resizeMode="contain" source={Images.iconNext1}
						style={{ width: Width(4), height: Width(4) }}
					/>
				</View>
			</TouchableOpacity>
		)
	}

	render() {
		const { infoUser } = this.props;
		return (
			<View style={{ flex: 1, flexDirection: "row", backgroundColor: colors.nocolor }}>
				<View style={{ backgroundColor: colors.white, flex: 1 }}>
					<View style={{ alignItems: "center", paddingTop: 30 + paddingTopMul, paddingBottom: 20, backgroundColor: colors.colorGreenOne1, }}>
						<Image
							resizeMode="cover"
							defaultSource={Images.icPhotoBlack}
							source={{ uri: appConfig.domain + infoUser.Avatar }}
							style={{ width: Width(23), height: Width(23), borderRadius: Width(23) / 2 }} />
						<Text
							style={[{ justifyContent: "center", color: "white", marginTop: 10, fontSize: sizes.reText(24) }]}>
							{infoUser.FullName}
						</Text>
					</View>
					<View style={{
						flexDirection: "column", marginLeft: Width(6.25),
						marginRight: Width(6.25), marginTop: Width(5)
					}}>
						{this.renderItemMenu(Images.icManUser, 'dr_User', 'Tài khoản')}
						{/* {this.renderItemMenu(Images.icHistory, 'dr_LichSuHome', 'Lịch sử')} */}
						{this.renderItemMenu(Images.icCaiDat1, 'dr_Setting', 'Cài đặt')}
						{this.renderItemMenu(Images.icExit1, '', 'Đăng xuất', this.onLogout)}
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

export default Utils.connectRedux(MenuRight, mapStateToProps, true);