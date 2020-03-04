import Utils from "../app/Utils";
import { nGlobalKeys } from "../app/keys/globalKey";
import { ROOTGlobal } from "../app/data/dataGlobal";

const PREFIX = "api/thongbaophuhuynh/";
const PREFIX1 = "api/chatgiaovien/";

async function getNotifycation(IDHocSinh, LoaiThongBao) {
  let IdCN = Utils.getGlobal(nGlobalKeys.IdCN, 0);
  let IDKHDPS = ROOTGlobal.dataUser.IDKHDPS;
  let res = await Utils.get_apiTokenHeader(
    PREFIX +
    `get_apiToken?IDKHDPS=` +
    IDKHDPS +
    "&IDChiNhanh=" +
    IdCN +
    "&IDHocSinh=" +
    IDHocSinh +
    "&LoaiThongBao=LoaiThongBao",
    false,
    false
  );
  return res;
}
async function ThongBaoInsertUpdate(DevicesToken, IdUser, DevicesInfo, Status = '1', IdApp = 'mn_nt_m') {
  let strBody = JSON.stringify({
    DevicesToken: DevicesToken,
    DevicesInfo: DevicesInfo,
    IdUser: IdUser,
    Status: Status,
    IdApp: IdApp
  });

  res = await Utils.post_api(
    PREFIX1 + "ThongBao_Insert_Update",
    strBody,
    false,
    false
  );
  return res;
}

export { getNotifycation, ThongBaoInsertUpdate };
