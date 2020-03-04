import Utils from "../app/Utils";
import { nGlobalKeys } from "../app/keys/globalKey";
import { ROOTGlobal } from "../app/data/dataGlobal";

const PREFIX = "api/account/";
const PREFIX1 = "api/hosonguoidung/";



async function Version() {
  let res = await Utils.get_apiTokenHeader(PREFIX1 + `Version`, false, false);
  Utils.nlog('apilVersionogin', res)
  return res;
}

async function apiLogin(PhoneNumber, Password) {
  let strBody = JSON.stringify({
    PhoneNumber: PhoneNumber,
    Password: Password
  });
  let res = await Utils.post_api(PREFIX + `login`, strBody, false, false);
  Utils.nlog('apilogin', res)
  return res;
}

async function onCheckLogin(UserName, Password, nthis = null) {
  if (UserName == null && Password == null) {
    return false;
  } else {
    let strBody = JSON.stringify({
      UserName: UserName,
      Password: Password
    });
    let res = await Utils.post_api('api/user/Login', strBody, false, false);
    Utils.nlog('login:', res)
    if (res < 0 || !res)
      return false;
    if (res.status == 1) {
      Utils.setGlobal(nGlobalKeys.loginToken, res.data.Token);
      ROOTGlobal.dataUser = { ...ROOTGlobal.dataUser, ...res.data };
      ROOTGlobal.dataUser.IdUser = res.data.Id;
      ROOTGlobal.IdCN = res.data.IDChiNhanh;
      return true;
    } else {
      if (nthis != null)
        Utils.showMsgBoxOK(nthis, "Thông báo", 'Tên đăng nhập hoặc mật khẩu không đúng', "Đóng");

      // Utils.showMsgBoxOK(nthis, "Thông báo", res.error.message, "Đóng");
      //Tài khoản hoặc tên đăng nhập không đúng
    };
    return false;
  };
}



export {
  apiLogin,
  onCheckLogin,
  Version
};
