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
    TextInput
} from "react-native";
import { nstyles, nheight, paddingBotX } from "../../styles/styles";
import { nkey } from "../../app/keys/keyStore";
import { nGlobalKeys } from "../../app/keys/globalKey";
import { sizes } from "../../styles/size";
import { colors } from "../../styles/color";
import HeaderCom from "../../components/HeaderCom";
import { Images } from "../../images";
import { loadmes, sendmes } from "../../apis/chat";
import ListEmpty from "../../components/ListEmpty";
import Moment from "moment";
import { ROOTGlobal } from "../../app/data/dataGlobal";

// const { height } = Dimensions.get('window');
var loadingMore = false;

class Chatgroup extends Component {
    constructor(props) {
        super(props);
        nthisApp = this;
        this.item = Utils.ngetParam(this, 'item');
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
        Utils.nlog('item', this.item)
    }

    componentDidMount() {
        this.loadMesInterval(-1);
        var intervalId = setInterval(this.timer, 3000);
        this.setState({ intervalId: intervalId });
    }
    componentWillUnmount() {
        this._reloadListChat(true)
        try {
            clearInterval(this.state.intervalId);
        } catch (error) { }
    }
    scrollToEnd = () => {
        if (this.state.dataSource.length != 0)
            this.listView.scrollToIndex({ index: 0, animated: true });
    };
    _renderItemChat = ({ item, index }) => {
        Utils.nlog('item', item)
        return (
            <View>
                {item.flag == true ? (
                    <Text style={[styles.ntext, styles.ntextDay]}>
                        {Moment(item.CreatedDate, 'YYYY/MM/DD h:m:s A').format("DD/MM/YYYY")}
                    </Text>
                ) : null}
                {item.Isclient === false ? (
                    <View style={styles.nmsgRep}>
                        <View style={styles.nboxRep}>
                            <Text style={[styles.ntext, styles.ntextmsgRep]}>
                                {item.NoiDung}
                            </Text>

                            {item.CreatedDate !== "" ? (
                                <Text
                                    style={[
                                        styles.ntext,
                                        styles.ntextmsgRep,
                                        styles.ntexttime
                                    ]}
                                >
                                    {Moment(item.CreatedDate, 'YYYY/MM/DD h:m:s A').format("HH:mm")}
                                </Text>
                            ) : null}
                        </View>
                    </View>
                ) : (
                        <View style={styles.nmsgSend, nstyles.nrow}>
                            <Image source={Images.icAvataTest} resizeMode='contain' style={[nstyles.nIcon38, { borderRadius: 19 }]} />
                            <View style={{ width: 9 }} />
                            <View style={styles.nboxSend}>
                                <Text style={[styles.ntext, styles.ntextmsgSend]}>
                                    {item.NoiDung}
                                </Text>
                                {item.CreatedDate !== "" ? (
                                    <Text
                                        style={[
                                            styles.ntext,
                                            styles.ntextmsgSend,
                                            styles.ntexttime
                                        ]}
                                    >
                                        {Moment(item.CreatedDate, 'YYYY/MM/DD h:m:s A').format("HH:mm")}
                                    </Text>
                                ) : null}
                            </View>
                            <View style={styles.nspace} />
                        </View>
                    )}
            </View>
        );
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
                        titleText={this.state.FullName}
                        onPressLeft={() => Utils.goback(this)}
                        customStyleIconRight={colors.brownGreyThree}
                    />
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
        let res = await loadmes(
            this.item.IDKhachHang,
            this.item.IDTaiKhoan,
            flag
        );
        Utils.nlog('loadmes', res)
        if (res.status == 1) {
            //Có dữ liệu trả về
            if (flag == -1) {
                if (this.flag == false) {
                    // Lần đầu load list
                    this.listMes = res.data.GhiChuData ? res.data.GhiChuData : [];
                    if (this.listMes.length == 0) {
                        this.flag = true;
                        return;
                    }
                    let max = this.listMes.length - 1;
                    this.setState({ dataSource: this._formatDate(this.listMes), minRowID: this.listMes[max].RowID, maxRowID: this.listMes[0].RowID });
                    this.flag = true;
                } else {
                    // if (res.data.GhiChuData == null)
                    //   return;
                    // Những lần sau load list
                    if (res.data.GhiChuData[0].RowID > this.state.maxRowID) {
                        for (let i = res.data.GhiChuData.length - 1; i >= 0; i--) {
                            if (res.data.GhiChuData[i].RowID > this.state.maxRowID) {
                                Utils.nlog('errro', i, res.data.GhiChuData[i].RowID)
                                this.listMes.unshift(res.data.GhiChuData[i]);
                            }
                        }
                        // debugger;
                        this.setState({ dataSource: this._formatDate(this.listMes), maxRowID: res.data.GhiChuData[0].RowID }); // Có dữ liệu mơi ghép đầu list
                    }
                }
            } else {
                // debugger;
                //Load những thằng phía sau id của flag
                // this.listMes = [ ...this.listMes, res.data.GhiChuData ];
                if (res.data.GhiChuData) {
                    this.listMes = this.listMes.concat(res.data.GhiChuData);
                    let minn = res.data.GhiChuData.length - 1;
                    let min = res.data.GhiChuData[minn].RowID;
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
            let res = await sendmes(this.IDGiaoVien, mess, this.item);
            Utils.nlog('send mé-----------', res)
        };
    };
}

const styles = StyleSheet.create({
    ncontain: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#FFFFFF"
    },
    ntitle: {
        color: "#31D5A6",
        fontSize: 17
    },
    nheader: {
        height: 50,
        backgroundColor: "#FFFFFF",
        shadowColor: "#000000",
        shadowOpacity: 0.1,
        shadowRadius: 2,
        shadowOffset: {
            height: 2,
            width: 0
        },
        elevation: 3
    },
    nbody: {
        flex: 1,
        marginLeft: 6,
        marginRight: 6
    },
    nfooter: {
        height: 40
    },
    ntext: {
        color: "#193B59",
        fontSize: 16
    },
    ntextbtn: {
        fontSize: 18,
        fontWeight: "500"
    },
    nicontop: {
        resizeMode: "contain",
        height: 28,
        width: 28
    },
    nicon1: {
        marginLeft: 10,
        resizeMode: "contain",
        height: 24,
        width: 24
    },
    nicon2: {
        resizeMode: "contain",
        height: 30,
        width: 30,
        marginLeft: 10
    },
    nHcontent: {
        flex: 1,
        paddingTop: 5,
        flexDirection: "row",
        alignItems: "center"
    },
    nHleft: {
        width: 50,
        alignItems: "center",
        paddingRight: 2
    },
    nHmid: {
        flex: 1,
        alignItems: "center"
    },
    nHright: {
        width: 50,
        alignItems: "center",
        paddingLeft: 2
    },
    ncontenchat: {
        flex: 1
    },
    nmsgRep: {
        width: "88%",
        alignSelf: "flex-end",
        alignItems: "flex-end",
        padding: 3
    },
    nmsgSend: {
        width: "88%",
        alignSelf: "flex-start",
        alignItems: "flex-start",
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
        marginVertical: 8,
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
        color: "#FCFDFF",
        fontWeight: "600"
    },
    ntextmsgSend: {},
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
    nAvata: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderColor: "#D0D0CE",
        borderWidth: 1,
        resizeMode: "cover"
    }
});

export default Chatgroup;
