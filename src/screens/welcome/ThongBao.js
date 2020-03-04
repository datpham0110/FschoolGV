import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Dimensions } from 'react-native';
import { colors, sizes } from '../../styles';
import Utils from '../../app/Utils';
import { nstyles } from '../../styles/styles';
import { nGlobalKeys } from '../../app/keys/globalKey';
import { notification } from '../../apis/notifycation';
import HeaderCom from '../../components/HeaderCom';
import { Images } from '../../images';
import { chiTietThongBao } from '../../apis/notifycation';
import ListEmpty from '../../components/ListEmpty';
import { ROOTGlobal } from '../../app/data/dataGlobal';
const { width } = Dimensions.get('window');

export default class ThongBao extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: ''
		};
	}
	componentDidMount() {
		this._getData();
	}
	//Modal_ChiTietThongBao
	_getData = async () => {
		let IDKhachHang = Utils.getGlobal(nGlobalKeys.IDKhachHang, '');
		let IDKHDPS = ROOTGlobal.dataUser.IDKHDPS;
		let IdCN = Utils.getGlobal(nGlobalKeys.IdCN, 0);
		let res = await chiTietThongBao(IDKhachHang, IDKHDPS, IdCN, 1);
		if (res.success == true) {
			this.setState({ data: res.data });
		}
	};
	goModalChiTiet = (item) => {
		Utils.goscreen(this, 'Modal_ChiTietThongBao', { data: item })
	}
	_renderItemChild = ({ item, index }) => {
		return (
			<TouchableOpacity onPress={() => this.goModalChiTiet(item)} key={index} >
				<View
					style={{
						backgroundColor: colors.white,
						marginHorizontal: 30,
						marginVertical: 10,
						padding: 10,
						borderRadius: 3
					}}
				>
					<Text style={{ fontSize: sizes.sizes.nImgSize17, color: colors.colorBlue }}>{item.TieuDe}</Text>
					<Text style={{ fontSize: sizes.sizes.nImgSize17, marginTop: 5 }}>{item.NoiDung}</Text>
					<Text style={{ fontSize: sizes.sizes.nImgSize12, marginTop: 5, textAlign: 'right' }}>
						{item.NgayGui}
					</Text>
				</View>
			</TouchableOpacity>
		);
	};

	render() {
		return (
			<View style={[nstyles.ncontainerX, { backgroundColor: colors.BackgroundHome }]}>
				<HeaderCom
					nthis={this}
					iconLeft={Images.icBackBlue}
					tintColorLeft={colors.brownGreyThree}
					customStyleIconRight={colors.brownGreyThree}
					titleText={'Thông báo'}
				/>
				<FlatList
					ListEmptyComponent={<ListEmpty textempty={'Không có dữ liệu'} />}
					renderItem={this._renderItemChild}
					data={this.state.data}
					keyExtractor={(item, index) => index.toString()}
				/>
			</View>
		);
	}
}
