import React, { Component } from "react";
import {
    View, Text, FlatList,
    TouchableOpacity, Image,
    StyleSheet,
    TextInput
} from "react-native";
import HeaderCom from "../../components/HeaderCom";
import { colors } from "../../styles/color";
import { nstyles } from "../../styles/styles";
import Utils from "../../app/Utils";
import { Images } from "../../images";
import { sizes, reText, reSize } from "../../styles/size";
import { ROOTGlobal } from "../../app/data/dataGlobal";
import ListEmpty from '../../components/ListEmpty';
import moment from 'moment';
import { Allcontactedit } from "../../apis/chat";
import { appConfig } from '../../app/Config';
import { withNavigationFocus } from 'react-navigation';


function handleTime(second) {
    if (second < 60) return { value: second, name: 'giây' };
    if (second >= 60 && second < 3600) return { value: Math.round(second / 60), name: 'phút' };
    if (second >= 3600 && second < 86400) return { value: Math.round(second / 3600), name: 'giờ' };
    if (second >= 86400) return { value: Math.round(second / 86400), name: 'ngày' };
}

class ListParentsChat extends Component {
    constructor(props) {
        super(props);
        nthisApp = this;
        nthisAppListParentsChat = this;
        this.IdLop = Utils.ngetParam(this, 'IdLop')
        this.IDKhachHang = Utils.ngetParam(this, 'IDKhachHang')
        this.TenKH = Utils.ngetParam(this, 'TenKH')
        this._goBackScreen = Utils.ngetParam(this, '_reloadListChat', () => { })
        this.state = {
            listParent: [],
            refreshing: true,
        };
    }
    componentDidMount() {
        this.GetListGetListParentsStuden()
        this._loadDataInter();
        // var intervalId = setInterval(this.timer, 10000);
        // this.setState({ intervalId: intervalId });
    }
    componentWillUnmount() {
        // try {
        //     clearInterval(this.state.intervalId);
        // } catch (error) { }
    }
    timer = () => {
        this._loadDataInter();
    };
    _loadDataInter = async => {
        this.GetListGetListParentsStuden();
    }

    GetListGetListParentsStuden = async () => {
        let res = await Allcontactedit(ROOTGlobal.dataUser.IDKHDPS, false, this.IdLop, ROOTGlobal.dataUser.IdUser, this.IDKhachHang)
        if (res.status == 1 && res.data.GhiChuData.length > 0) {
            this.setState({ listParent: res.data.GhiChuData });
        }
        this.setState({ refreshing: false })
    }
    _ClickTeacher = (item) => () => {
        Utils.goscreen(this, "sc_Chat", { IDGiaoVien: ROOTGlobal.dataUser.IdUser, FullName: item.Fullname, item: item, _reloadListChat: this._reloadListChat, flagNotify: false, _reloadListChat: this._reloadListChat });
    };

    _reloadListChat = (flat) => {
        this.GetListGetListParentsStuden()
    }
    handleRefresh = () => {
        this.setState({ refreshing: true }, () => {
            this.GetListGetListParentsStuden();
        })
    }

    renderItemUser = ({ item, index }) => {
        // Utils.nlog('------------ item ', item.Avata)
        const time = handleTime(Utils.datesDiff(new Date(), moment(item.CreatedDate, 'YYYY/MM/DD HH:mm'), true));
        return (
            <View>
                <TouchableOpacity
                    onPress={this._ClickTeacher(item)}
                    activeOpacity={0.5}>
                    <View style={styles.viewRowItemChatUser}>
                        <View>
                            <Image source={Images.imgProfile} resizeMode="cover" style={[styles.imgaeAvatar]} />
                            <Image source={{ uri: appConfig.domainImageChat + item.Avata }} resizeMode="cover"
                                style={{
                                    position: 'absolute', width: reSize(48),
                                    height: reSize(48),
                                    resizeMode: 'cover',
                                    borderRadius: reSize(24)
                                }} />
                        </View>
                        <View style={{ marginLeft: 5, flex: 1 }}>
                            <Text numberOfLines={1} style={[styles.textMessage, { fontWeight: '600' }]}> Phụ huynh: {item.Fullname} </Text>
                            <Text numberOfLines={1} style={[styles.textMessage, { marginTop: 5, fontWeight: '300' }]}> {item.TenKH} </Text>
                            {item.NumberMgsUnread == 0 ?
                                <Text numberOfLines={1} style={[styles.textMessage, { marginTop: 5, opacity: 0.5 }]}> {item.NoiDung}</Text> :
                                <Text numberOfLines={1} style={[styles.textMessage, { fontWeight: 'bold', marginTop: 5 }]}> {item.NoiDung}</Text>}
                        </View>
                        <View style={{ marginLeft: 5 }}>
                            <View style={{ alignItems: 'flex-end' }}>
                                {item.NumberMgsUnread == 0 ? null :
                                    <View style={styles.viewNumberOldMessage}>
                                        <Text style={styles.textNumberOldMessage}>
                                            {item.NumberMgsUnread > 0 ? 'N' : ''}
                                        </Text>
                                    </View>
                                }
                                <Text style={styles.textMessage}> {time ? time.name == 'giây' ? 'now' : (`${time.value} ${time.name} trước`) : ''}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View >
        )
    };

    _goBack = () => {
        this._goBackScreen(true)
        Utils.goback(this)
    }
    render() {
        var { listParent } = this.state;
        return (
            <View style={[nstyles.ncontainerX]}>
                <HeaderCom
                    nthis={this}
                    titleText={"Phụ huynh học sinh " + this.TenKH}
                    titleStyle={{ color: colors.white }}
                    onPressLeft={this._goBack}
                    tintColorLeft={colors.white} />
                <View style={nstyles.nbody}>
                    <View style={styles.body}>
                        <FlatList
                            refreshing={this.state.refreshing}
                            onRefresh={this.handleRefresh}
                            ListEmptyComponent={<ListEmpty textempty={this.setState.txtLoading} />}
                            style={styles.users}
                            renderItem={this.renderItemUser}
                            data={listParent}
                            keyExtractor={(item, index) => index.toString()}
                            extraData={this.state}
                        />
                    </View>
                </View>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5
    },
    textMessage: {
        flex: 1,
        fontSize: sizes.sText12,
        color: colors.blackShadow,
        justifyContent: "center",
        marginLeft: 10,
    },
    viewNumberOldMessage: {
        backgroundColor: colors.colorRed,
        borderRadius: 3,
        width: 18,
        height: 12,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textNumberOldMessage: {
        fontSize: sizes.sText8,
        color: colors.white,
        fontWeight: 'bold'
    },
    users: {
        marginTop: 20,
        backgroundColor: colors.white
    },
    viewRowItemChatUser: {
        ...nstyles.nrow,
        padding: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    imgaeAvatar: {
        width: reSize(48),
        height: reSize(48),
        // borderColor: colors.paleGrey,
        // borderWidth: 0.5,
        resizeMode: 'cover',

        borderRadius: reSize(24)
    },
});

export default withNavigationFocus(ListParentsChat);

