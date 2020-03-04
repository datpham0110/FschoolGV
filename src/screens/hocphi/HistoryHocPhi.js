import React, { Component } from 'react';
import { Text, View, Dimensions } from 'react-native';
import { colors } from '../../styles/color';
import Input from '../../components/Input';
import ButtonCom from '../../components/Button/ButtonCom';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { nstyles } from '../../styles/styles';
import { getchiethocphi } from '../../apis/chitiethocphi';
import Utils from '../../app/Utils';
import { nGlobalKeys } from '../../app/keys/globalKey';
import NotifyLichsu from './NotifyLichsu';
const { width, height } = Dimensions.get('window');


export default class HistoryHocPhi extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			CTlichSu: {}
		};
	}
	componentDidMount() {
		this.getchitiet();
	}
	getchitiet = async () => {
		let IDkH = Utils.getGlobal(nGlobalKeys.IDKhachHang, '');
		let res = await getchiethocphi('1', '2018', '2', '2018', IDkH)
		Utils.nlog('getchitiet', res)
		if (res.success == true) {
			this.setState({ CTlichSu: res.data })
		}
	}
	render() {
		return (
			<View style={nstyles.nbody}>
				<View
					style={[nstyles.nrow, {
						marginHorizontal: 20, marginVertical: 10, backgroundColor: colors.white,
						borderRadius: 5,
					}]}
				>
					<View style={{ flex: 1, padding: 10 }}>
						<Text style={{ textAlign: 'center' }}>Từ tháng</Text>
						<Input
							editable={false}
							style={{
								borderRadius: 6,
								paddingHorizontal: 20,
								marginHorizontal: 20,
							}}
							placeholder={'10/2019'}
						/>
					</View>
					<View style={{ flex: 1, marginVertical: 10 }}>
						<Text style={{ textAlign: 'center' }}>Đến tháng</Text>
						<Input
							editable={false}
							style={{
								borderRadius: 6,
								paddingHorizontal: 20,
								marginHorizontal: 20,

							}}
							placeholder={'10/2019'}
						/>
					</View>
					<View style={{ justifyContent: 'flex-end', marginVertical: 10 }}>
						<TouchableOpacity style={{ backgroundColor: colors.bgYSchoold, borderRadius: 6, marginHorizontal: 10, }}>
							<Text style={{ color: colors.white, marginHorizontal: 20, paddingVertical: 10 }}>
								TRA CỨU
					</Text>
						</TouchableOpacity>
					</View>
				</View>
				<View style={{ flex: 1 }}>
					<NotifyLichsu CTlichSu={this.state.CTlichSu} />
				</View>
			</View>
		);
	}
}
