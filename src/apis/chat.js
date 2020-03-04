import Utils from "../app/Utils";
import { nGlobalKeys } from "../app/keys/globalKey";
import moment from "moment";
import { ROOTGlobal } from "../app/data/dataGlobal";

const PREFIX = "api/chatgiaovien/";
const PREFIX1 = "api/chat/";


//ROOTGlobal.dataUser.IdUser
// API get list lớp có count notify
async function ListChatLop() {
  var res = await Utils.get_apiTokenHeader(
    PREFIX + `ListChatLop?IDTeacher=` + ROOTGlobal.dataUser.IdUser,
    true,
    true
  );
  Utils.nlog(PREFIX + `ListChatLop?IDTeacher=` + ROOTGlobal.dataUser.IdUser)
  Utils.nlog(`ListChatLop?IDTeacher=`, res)
  return res;
}

// API create group chat
async function TaoGroupChat(TenGroupChat, IdGiaoVien, IDKHDPS, IDChiNhanh, ListUser, IDLopHoc) {
  strBody = JSON.stringify({
    IDKHDPS: IDKHDPS,
    IDChiNhanh: IDChiNhanh,
    TenGroupChat: TenGroupChat,
    IdGiaoVien: IdGiaoVien,
    ListUser: ListUser,
    IDLop: IDLopHoc
  });
  var res = await Utils.post_apiTokenHeader(
    PREFIX + `TaoGroupChat`,
    strBody,
    true,
    true
  );
  return res;
}
// API Chi tiết nội dung chat
async function ChatGroupSingle(IDKHDPS, IdTeacher, IdNhom, IdGhichu, flag) {
  let header1 = {
    IdTeacher: IdTeacher,
    IDKHDPS: IDKHDPS,
    LoaiChat: 1
  };
  let header2 = {
    IdTeacher: IdTeacher,
    IDKHDPS: IDKHDPS,
    LoaiChat: 2
  };
  let header;
  if (flag == true) {
    header = header1;
  } else {
    header = header2;
  }

  var res = await Utils.get_apiTokenHeader(
    PREFIX + `ChatGroupSingle?IdNhom=` + IdNhom + '&IdGhichu=' + IdGhichu,
    header,
    true,
    true
  );
  return res;
}

async function TaoTinNhanGroup(NoiDung, IdNhom, flag) {
  const _iDKHDPS = ROOTGlobal.dataUser.IDKHDPS;
  const _idUser = ROOTGlobal.dataUser.IdUser;
  const _idChiNhanh = ROOTGlobal.dataUser.IDChiNhanh;
  strBody = JSON.stringify({
    IDChiNhanh: _idChiNhanh,
    IDKHDPS: _iDKHDPS,
    TieuDe: 'Tieu de',
    NoiDung: NoiDung,
    Isclient: 'false',
    Creator: _idUser,
    IDTeacher: _idUser,
    IdNhom: IdNhom
  });
  let header = {
    IdTeacher: _idUser,
    LoaiChat: flag
  };
  var res;
  if (flag == 1) {
    res = await Utils.post_apiTokenHeader(
      PREFIX + `TaoTinNhanGroup`,
      strBody,
      header,
      true,
      true
    );
  } else {
    res = await Utils.post_apiTokenHeader(
      PREFIX + `TaoTinNhanChatGVPHGroup`,
      strBody,
      header,
      true,
      true
    );
  }
  return res;
}
async function ContactHocSinh(IDKHDPS, IdNhom, IdTeacher) {
  var res = await Utils.get_apiTokenHeader(
    PREFIX + `ContactHocSinh?IDKHDPS=` + IDKHDPS + '&IdNhom=' + IdNhom + '&IdTeacher=' + IdTeacher,
    true,
    true
  );
  Utils.nlog(PREFIX + `ContactHocSinh?IDKHDPS=` + IDKHDPS + '&IdNhom=' + IdNhom + '&IdTeacher=' + IdTeacher)
  Utils.nlog(`ContactHocSinh?IDKHDPS=`, res)

  return res;
}
async function Allcontactedit(IDKHDPS, checkQuyen, IdNhom, IdUser, IDKhachHang) {
  let header = {
    IdNhom: IdNhom,
    IdUser: IdUser,
    IdHocSinh: IDKhachHang
  };
  Utils.nlog('header', header)
  Utils.nlog(PREFIX + `allcontactedit?IDKHDPS=${IDKHDPS}&abc=11&checkQuyen=${checkQuyen}`)
  var res = await Utils.get_apiTokenHeader(
    PREFIX + `allcontactedit?IDKHDPS=${IDKHDPS}&abc=11&checkQuyen=${checkQuyen}`,
    header,
    false,
    true
  );
  Utils.nlog('allcontactedit', res)

  return res;
}

// API Danh sách group
async function ChatGroupGVPH(IDKHDPS, IdUser) {
  var res = await Utils.get_apiTokenHeader(
    PREFIX + `ChatGroupGVPH?IDKHDPS=${IDKHDPS}&IDGiaoVien=${IdUser}`,
    false,
    true
  );
  // Utils.nlog(PREFIX + `ChatGroupGVPH?IDKHDPS=${IDKHDPS}&IDGiaoVien=${IdUser}`)
  return res;
}

async function loadmes(IDHocSinh, IDPhuHuynh, IdGhichu = -1) {
  const IDKHDPS = ROOTGlobal.dataUser.IDKHDPS;
  Utils.nlog(PREFIX + `singleperson?IDPhuHuynh=${IDPhuHuynh}&IDHocSinh=${IDHocSinh}&IDKHDPS=${IDKHDPS}&IdGhichu=${IdGhichu}`);
  const res = await Utils.get_apiTokenHeader(PREFIX + `singleperson?IDPhuHuynh=${IDPhuHuynh}&IDHocSinh=${IDHocSinh}&IDKHDPS=${IDKHDPS}&IdGhichu=${IdGhichu}`, { IdUser: ROOTGlobal.dataUser.IdUser });
  Utils.nlog('------------ res', res);

  return res;
}
async function listHSchat(IDTeacher = ROOTGlobal.dataUser.IdUser) {
  let res = await Utils.get_apiTokenHeader(PREFIX + 'ListLopHoc?IDTeacher=' + IDTeacher)
  return res;
}
async function sendmes(IdGiaoVien, smsg, IDKhachHang, IDChiNhanh, IDTaiKhoan) {
  const IDKHDPS = ROOTGlobal.dataUser.IDKHDPS;
  strBody = JSON.stringify({
    IDKhachHang: IDKhachHang,
    IDChiNhanh: IDChiNhanh,
    IDKHDPS: IDKHDPS,
    TieuDe: "Ghi chu",
    NoiDung: smsg,
    Isclient: false,
    IdTeacher: IdGiaoVien,
    IDTaiKhoan: IDTaiKhoan
  });
  let header = {
    IdUser: IdGiaoVien
  };
  var res = await Utils.post_apiTokenHeader(
    PREFIX + `createsingleperson`,
    strBody,
    header,
    true,
    true
  );
  return res;
}

export { loadmes, sendmes, listHSchat, ContactHocSinh, Allcontactedit, ChatGroupGVPH, ChatGroupSingle, TaoTinNhanGroup, TaoGroupChat, ListChatLop };
