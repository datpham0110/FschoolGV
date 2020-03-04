import Utils from '../app/Utils';
import { ROOTGlobal } from '../app/data/dataGlobal';
const PREFIX = 'api/hosonguoidung/';

async function NguoiDungContact() {
    var res = await Utils.get_apiTokenHeader(PREFIX + `NguoiDung_Contact`, false, false);
    return res;
}
async function updateNguoiDung(Id, UserName, LastName, FirstName, PhoneNumber, Email, DiaChi) {
    let body = {
        "Id": Id,
        "UserName": UserName,
        "LastName": LastName,
        "FirstName": FirstName,
        "PhoneNumber": PhoneNumber,
        "Email": Email,
        "DiaChi": DiaChi,
    }
    let strBody = JSON.stringify(body);
    let res = await Utils.post_apiTokenHeader(PREFIX + 'NguoiDung_Update', strBody, false, false)
    return res;
}

async function postChangePassword(OldPassword, NewPassword, ConfirmPassword) {
    let strBody = JSON.stringify({
        OldPassword: OldPassword,
        NewPassword: NewPassword,
        RePassword: ConfirmPassword,
        Id: ROOTGlobal.dataUser.IdUser,
        Logout: false
    });
    let res = await Utils.post_apiTokenHeader(PREFIX + 'NguoiDung_Password', strBody);
    return res;
}

async function NguoiDung_UpdateImage(strBase64: String, filename: String, IdUser: Number) {
    let strBody = JSON.stringify({
        strBase64,
        filename,
        extension: 'png',
        IdUser
    });
    Utils.nlog()
    let res = await Utils.post_apiTokenHeader(PREFIX + 'NguoiDung_UpdateImage', strBody);
    return res;
}



export { NguoiDungContact, postChangePassword, updateNguoiDung, NguoiDung_UpdateImage };
