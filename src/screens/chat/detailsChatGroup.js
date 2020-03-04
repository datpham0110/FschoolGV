import React, { Component } from "react";
import Utils from "../../app/Utils";
import {
    View,
    FlatList,
    TouchableOpacity,
    Image,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    TextInput, Dimensions
} from "react-native";
import { nstyles, nheight, paddingBotX, nwidth } from "../../styles/styles";
import { colors } from "../../styles/color";
import HeaderCom from "../../components/HeaderCom";
import { Images } from "../../images";
import { ChatGroupSingle, TaoTinNhanGroup } from "../../apis/chat";
import ListEmpty from "../../components/ListEmpty";
import Moment from "moment";
import { ROOTGlobal } from "../../app/data/dataGlobal";
import { nGlobalKeys } from '../../app/keys/globalKey';
var loadingMore = false;
const { width } = Dimensions.get('window');

class DetailsChatGroup extends Component {
    constructor(props) {
        super(props);
        nthisApp = this;
        this.IdUser = Utils.ngetParam(this, 'IdUser');
        this.TenLop = Utils.ngetParam(this, 'TenLop');
        this.IdLop = Utils.ngetParam(this, 'IdLop');
        this.dataParam = Utils.ngetParam(this, 'dataParam');
        this.IDGiaoVien = ROOTGlobal.dataUser.IdUser
        this._reloadListChat = Utils.ngetParam(this, '_reloadListChat', () => { })
        this.state = {
            dataSource: [],
            FullName: Utils.ngetParam(this, 'FullName'),
            msgtext: "",
            issending: false,
            sizeInput: 0,
            maxRowID: 0,
            minRowID: 0
        };
        this.listMes = {};
        this.flag = false;
        this.flagNotify = Utils.ngetParam(this, 'flagNotify')
        this.dataNotify = Utils.ngetParam(this, 'dataNotify')
        this.reloadData1 = Utils.ngetParam(this, 'reloadData1', () => { })
    }

    componentDidMount() {
        Utils.setGlobal(nGlobalKeys.screenSelected, 'detailChat')
        if (this.flagNotify == false) {
            if (this.dataParam.IdLop != 0) {
                //Chat group bt
                Utils.setGlobal(nGlobalKeys.isFocusChatGroupClass, this.dataParam.IdLop)
                Utils.setGlobal(nGlobalKeys.isFocusChatGroupCreate, 0)
            } else {
                //Chat group create
                Utils.setGlobal(nGlobalKeys.isFocusChatGroupCreate, this.dataParam.IdChatGroup)
                Utils.setGlobal(nGlobalKeys.isFocusChatGroupClass, 0)
            }
        } else {
            if (this.dataNotify.LoaiChat == '2') {
                //Chat group bt
                Utils.setGlobal(nGlobalKeys.isFocusChatGroupClass, this.dataNotify.IdNhom)
                Utils.setGlobal(nGlobalKeys.isFocusChatGroupCreate, 0)
            } else {
                //Chat group create
                Utils.setGlobal(nGlobalKeys.isFocusChatGroupCreate, this.dataNotify.IdNhom)
                Utils.setGlobal(nGlobalKeys.isFocusChatGroupClass, 0)
            }
        }
        this.loadMesInterval(-1);
        var intervalId = setInterval(this.timer, 3000);
        this.setState({ intervalId: intervalId });
    }


    componentWillUnmount() {
        Utils.setGlobal(nGlobalKeys.isFocusChatGroupCreate, 0)
        Utils.setGlobal(nGlobalKeys.isFocusChatGroupClass, 0)
        this._reloadListChat(true)
        try {
            clearInterval(this.state.intervalId);
        } catch (error) { }
    }
    scrollToEnd = () => {
        if (this.state.dataSource.length != 0)
            this.listView.scrollToIndex({ index: 0, animated: true });
    };
    timer = () => {
        if (this.flag == true) {
            this.loadMesInterval(-1);
        }
    };

    _formatDate = list => {
        for (let i = 0; i < list.length - 1; i++) {
            var datenow = new Date(list[i].CreatedDate);
            var dateback = new Date(list[i + 1].CreatedDate);
            if (datenow.getDate() == dateback.getDate()) {
                list[i].flag = false;
            } else {
                list[i].flag = true;
            }
        }
        return list;
    };

    loadMesInterval = async flag => {
        let res;
        if (this.flagNotify == true) {
            if (this.dataNotify.LoaiChat == '2') {
                //Chat group class
                res = await ChatGroupSingle(
                    ROOTGlobal.dataUser.IDKHDPS,
                    ROOTGlobal.dataUser.IdUser,
                    this.dataNotify.IdNhom,
                    flag,
                    true
                );
            } else {
                //Chat group tự tạo
                res = await ChatGroupSingle(
                    ROOTGlobal.dataUser.IDKHDPS,
                    ROOTGlobal.dataUser.IdUser,
                    this.dataNotify.IdNhom,
                    flag,
                    false
                );
            }
        } else {
            if (this.dataParam.IdLop != 0) {
                res = await ChatGroupSingle(
                    ROOTGlobal.dataUser.IDKHDPS,
                    ROOTGlobal.dataUser.IdUser,
                    this.dataParam.IdLop,
                    flag,
                    true
                );
            } else {
                res = await ChatGroupSingle(
                    ROOTGlobal.dataUser.IDKHDPS,
                    ROOTGlobal.dataUser.IdUser,
                    this.dataParam.IdChatGroup,
                    flag,
                    false
                );
            }

        }
        if (res.status == 1) {
            //Có dữ liệu trả về
            if (flag == -1) {
                if (this.flag == false) {
                    // Lần đầu load list
                    this.listMes = res.data.ChatGroup ? res.data.ChatGroup : [];
                    if (this.listMes.length == 0) {
                        this.flag = true;
                        return;
                    }
                    let max = this.listMes.length - 1;
                    this.setState({ dataSource: this._formatDate(this.listMes), minRowID: this.listMes[max].RowID, maxRowID: this.listMes[0].RowID });
                    this.flag = true;
                } else {
                    // Những lần sau load list
                    if (res.data.ChatGroup != null) {
                        if (res.data.ChatGroup[0].RowID > this.state.maxRowID) {
                            for (let i = res.data.ChatGroup.length - 1; i >= 0; i--) {
                                if (res.data.ChatGroup[i].RowID > this.state.maxRowID) {
                                    this.listMes.unshift(res.data.ChatGroup[i]);
                                }
                            }
                            this.setState({ dataSource: this._formatDate(this.listMes), maxRowID: res.data.ChatGroup[0].RowID }); // Có dữ liệu mơi ghép đầu list
                        }
                    }

                }
            } else {
                //Load những thằng phía sau id của flag
                if (res.data.ChatGroup) {
                    this.listMes = this.listMes.concat(res.data.ChatGroup);
                    let minn = res.data.ChatGroup.length - 1;
                    let min = res.data.ChatGroup[minn].RowID;
                    // debugger;
                    this.setState({ dataSource: this._formatDate(this.listMes), minRowID: min });
                }
            }
        }
    };
    sendmes = async () => {
        if (!this.state.msgtext.trim().length == 0) {
            let mess = this.state.msgtext.trim();
            this.setState({ msgtext: "" });
            if (this.flagNotify == true) {
                if (this.dataNotify.LoaiChat == '3') {
                    let res = await TaoTinNhanGroup(mess, this.dataNotify.IdNhom, 2);
                } else {
                    let res = await TaoTinNhanGroup(mess, this.dataNotify.IdNhom, 1);
                }
            } else {
                if (this.dataParam.IdLop == 0) {
                    let res = await TaoTinNhanGroup(mess, this.dataParam.IdChatGroup, 2);
                } else {
                    let res = await TaoTinNhanGroup(mess, this.IdLop, 1);
                }
            }

        };
    };
    _renderItemChat = ({ item, index }) => {
        return (
            <View>
                {item.flag == true ? (
                    <Text style={[styles.ntext, styles.ntextDay]}>
                        {Moment(item.CreatedDate, 'MM/DD/YYYY h:m:s A').format("DD/MM/YYYY")}
                    </Text>
                ) : null}
                {item.Isclient === false ? (
                    <View style={styles.nmsgRep}>
                        <View style={styles.nboxRep}>
                            <Text style={[styles.ntext1, styles.ntextmsgRep1]}>
                                {item.NoiDung}
                            </Text>
                            {item.CreatedDate !== "" ? (
                                <Text
                                    style={[
                                        styles.ntext1,
                                        styles.ntextmsgRep1,
                                        styles.ntexttime
                                    ]}
                                >
                                    {Moment(item.CreatedDate, 'MM/DD/YYYY h:m:s A').format("HH:mm")}
                                </Text>
                            ) : null}
                        </View>
                    </View>
                ) : (
                        <View style={nstyles.nrow}>
                            <Image source={Images.imgProfile}
                                resizeMode='contain'
                                style={[nstyles.nIcon38, { borderRadius: 19 }]} />
                            <View style={{ flexDirection: 'column' }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ marginHorizontal: 5, marginVertical: 5 }}>{item.TenNguoiGui} </Text>
                                </View>
                                <View style={styles.nmsgSend}>
                                    <View style={styles.nboxSend}>
                                        <Text style={[styles.ntext, styles.ntextmsgSend]}>
                                            {item.NoiDung}
                                        </Text>
                                        {item.CreatedDate !== "" ? (
                                            <Text style={[styles.ntext, styles.ntextmsgRep, styles.ntexttime]}  >
                                                {Moment(item.CreatedDate, 'MM/DD/YYYY h:m:s A').format("HH:mm")}
                                            </Text>
                                        ) : null}
                                    </View>
                                </View>
                            </View>

                            <View style={styles.nspace} />
                        </View>
                    )}
            </View>
        );
    }
    back = () => {
        this.reloadData1()
        Utils.goback(this)
    }
    render() {
        Moment.locale("en");
        return (
            <KeyboardAvoidingView
                style={styles.ncontain}
                behavior={Platform.OS === "ios" ? "padding" : null}
            >
                <View style={{ flex: 1, flexDirection: "column", paddingBottom: paddingBotX }}>
                    <HeaderCom
                        nthis={this}
                        titleText={this.flagNotify == true ? this.dataNotify.TenNhomChat : this.dataParam.IdLop == 0 ? this.dataParam.TenChatGroup : this.dataParam.TenLop}
                        // onPressLeft={() => { }}
                        onPressLeft={this.back}

                        customStyleIconRight={colors.brownGreyThree} />
                    <View style={styles.nbody} onLayout={this.setScroll}>
                        <FlatList
                            style={[styles.ncontenchat]}
                            ref={listView => {
                                this.listView = listView;
                            }}
                            keyboardShouldPersistTaps="handled"
                            keyboardDismissMode="interactive"
                            data={this.state.dataSource}
                            onEndReached={() => {
                                if (this.state.minRowID !== false) {
                                    this.loadMesInterval(this.state.minRowID);
                                }
                            }}
                            onEndReachedThreshold={0.25}
                            ListEmptyComponent={
                                <ListEmpty textempty="Bạn chưa có tin nhắn nào với người này." />
                            }
                            inverted
                            renderItem={this._renderItemChat}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>

                    <View style={[nstyles.ncol]}>
                        <View
                            style={{
                                height: this.state.sizeInput - 30,
                                borderColor: "#C0C0C0",
                                borderWidth: 0.5
                            }}
                        >
                            <View style={styles.nboxinput}>
                                <TextInput
                                    style={[
                                        styles.ntextinput,
                                        { flex: 1, textAlignVertical: "top" }
                                    ]}
                                    onChangeText={text => {
                                        this.state.msgtext = text;
                                        if (text.length < 5) {
                                            this.setState({});
                                        }
                                    }}
                                    placeholder="Tin nhắn..."
                                    autoCorrect={false}
                                    multiline={true}
                                    onContentSizeChange={event => {
                                        if (
                                            50 + event.nativeEvent.contentSize.height <
                                            nheight * 0.3
                                        )
                                            if (
                                                this.state.sizeInput !=
                                                50 + event.nativeEvent.contentSize.height
                                            ) {
                                                this.setState({
                                                    sizeInput: 50 + event.nativeEvent.contentSize.height
                                                });
                                            }
                                    }}
                                    underlineColorAndroid="rgba(0,0,0,0)"
                                >
                                    {this.state.msgtext}
                                </TextInput>

                                <TouchableOpacity
                                    onPress={() => this.sendmes()}
                                    disabled={this.state.issending}
                                >
                                    <Image
                                        style={[styles.nicon2, { marginRight: 15 }]}
                                        source={require("../../images/imgApp/icSendBig.png")}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        );
    }

}

const styles = StyleSheet.create({
    ncontain: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#FFFFFF"
    },
    nbody: {
        flex: 1,
        marginLeft: 6,
        marginRight: 6
    },
    ntext: {
        color: "#193B59",
        fontSize: 16
    },
    ntext1: {
        color: "#F1F0F0",
        fontSize: 16
    },
    nicon2: {
        resizeMode: "contain",
        height: 30,
        width: 30,
        marginLeft: 10
    },
    ncontenchat: {
        flex: 1
    },
    nmsgRep: {
        width: nwidth - 80,
        alignSelf: "flex-end",
        alignItems: "flex-end",
        padding: 3
    },
    nmsgSend: {
        width: nwidth - 60,
        alignSelf: "flex-start",
        alignItems: "flex-start",
        padding: 3
    },
    nboxRep: {
        padding: 8,
        minWidth: 60,
        backgroundColor: "#4080FF",
        borderRadius: 10,
        shadowColor: "#000000",
        shadowOpacity: 0.4,
        shadowRadius: 2,
        shadowOffset: {
            height: 2,
            width: 0
        }
    },
    nboxSend: {
        padding: 8,
        backgroundColor: "#F1F0F0",
        minWidth: 60,
        borderRadius: 10,
        shadowColor: "#000000",
        shadowOpacity: 0.2,
        shadowRadius: 2,
        shadowOffset: {
            height: 2,
            width: 0
        }
    },
    ntextmsgRep: {
        color: "#193B59",
        fontWeight: "600"
    },
    ntextmsgRep1: {
        color: "#F1F0F0",
        fontWeight: "600"
    },
    ntextmsgSend: {
    },
    ntexttime: {
        fontSize: 11,
        fontWeight: "400",
        marginTop: 5,
        marginLeft: 5
    },
    nspace: {
        padding: 5
    },
    nboxinput: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    ntextinput: {
        color: "black",
        fontSize: 17,
        paddingVertical: 4,
        paddingHorizontal: 10
    },
    ntextDay: {
        alignSelf: "center",
        fontSize: 13,
        fontWeight: "bold",
        color: "#C0C0C0",
        margin: 8
    },
});

export default DetailsChatGroup;
