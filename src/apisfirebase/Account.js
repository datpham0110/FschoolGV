
// Config file
import * as firebase from "firebase";
import { appConfig, db } from '../../app/Config';
export const dbFB = db.database();

const _PREFIX = '/Tbl_Account';

function _GetListAccount(){
    dbFB.ref(_PREFIX).on('value', (snapshot) => {
        let data = snapshot.val();
        let keys = Object.keys(data);
        let items = Object.values(data);
        return items;
        // let items2 = data[keys[0]];
        // Utils.showMsgBoxOK(
        //   this,
        //   "Thông báo",
        //   JSON.stringify(items2),
        //   "Đóng"
        // );
        // console.log(JSON.stringify(data));
    });
}

function _Create_Account(p){
    dbFB.ref(_PREFIX).push({
        Username: p["Username"],
        Password: p["Password"],
        IsActive: p["IsActive"]
      });
}

function _Update_Account(pKey,p){
    dbFB.ref(`${_PREFIX}/${pKey}`).update({
        IsActive: p["IsActive"],
        Username: p["Username"],
        Password: p["Password"]
      });
}

function _Delete_Account(pKey){
    //Xóa
    dbFB.ref(`${_PREFIX}/${pKey}`).remove().then(r => {
        return true;
      })
      .catch(p => {
        return false
      });
}

export {
    _GetListAccount,
    _Create_Account,
    _Update_Account,
    _Delete_Account
};
