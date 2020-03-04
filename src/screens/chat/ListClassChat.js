import React, { Component } from "react"
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
    ListEmpty
} from "react-native"
import { nstyles } from '../../styles/styles';
import HeaderCom from '../../components/HeaderCom';
import { Images } from '../../images';
import Utils from '../../app/Utils';
const { width, height } = Dimensions.get("window");
import { colors, sizes } from "../../styles";
import { ScrollView } from "react-native-gesture-handler";
import { ListChatLop } from "../../apis/chat";

class ListClassChat extends Component {
    constructor(props) {
        super(props);
        nthisApp = this;
        this.state = {
            refreshing: false,
        }
    }
    _renderItemChild = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => Utils.goscreen(this, 'sc_ListTeacher', { dataClass: item, isNotify: false, reload: this.handleRefresh })}
                style={{
                    flexDirection: "row",
                    paddingVertical: 8,
                    backgroundColor: index % 2 == 0 ? colors.colorGreenThere1 : colors.colorGreenTwo1, alignItems: 'center',
                    marginHorizontal: 20,
                    marginVertical: 5,
                    borderRadius: 10,
                    height: 50
                }} >
                <View style={{ flexDirection: "column", marginLeft: 10, justifyContent: "center", flex: 1 }}>
                    < Text style={{ color: "white", fontSize: sizes.sizes.nImgSize18, fontWeight: '700', marginLeft: 10 }}>{item.TenLop}</Text>
                </View>
                {item.IsRead > 0 ?
                    <View style={styles.vIconNotifyBig}>
                        <Text style={{ color: 'white', fontWeight: '800', fontSize: sizes.sText18 }}>{item.IsRead}</Text>
                    </View> : null}
            </TouchableOpacity>
        );
    };


    _loadListClassChatRedux = async () => {
        let res = await ListChatLop();
        if (res.status == 1) {
            this.props.setListClassChat(res.data)
        } else {
            this.props.setListClassChat([])
        }
        this.setState({ refreshing: false });
    }

    handleRefresh = () => {
        this.setState({ refreshing: true }, () => {
            this._loadListClassChatRedux();
        })
    }

    render() {
        return (
            <View style={[nstyles.ncontainerX, { backgroundColor: colors.white }]}>
                <HeaderCom
                    nthis={this}
                    titleText={'Danh sách lớp'}
                />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <FlatList
                        renderItem={this._renderItemChild}
                        data={this.props.listClassChat}
                        refreshing={this.state.refreshing}
                        keyExtractor={(item, index) => index.toString()}
                        onRefresh={this.handleRefresh}
                    // scrollEnabled={false} 
                    />
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    vIconNotifyBig: {
        width: width * 0.08,
        height: width * 0.08,
        borderRadius: width * 0.1,
        backgroundColor: '#f27972',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20
    },
})

const mapStateToProps = state => ({
    listClassChat: state.listClassChat
});

export default Utils.connectRedux(ListClassChat, mapStateToProps, true);