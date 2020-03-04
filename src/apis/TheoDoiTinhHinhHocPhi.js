import Utils from "../app/Utils";
import { nkey } from "../app/keys/keyStore";
import { nGlobalKeys } from "../app/keys/globalKey";

const PREFIX = "api/theodoitinhhinhhocphi/";

async function KhoanThu_List(pageNumber, IDChiNhanh, IDLopHoc, TenHocSinh) {
    let body = {
        "more": true,
        "filter": {
            "IDChiNhanh": IDChiNhanh,
            "IDLopHoc": IDLopHoc,
            "TenHocSinh": TenHocSinh
        }
    }
    let strBody = JSON.stringify(body);
    Utils.nlog(PREFIX + 'KhoanThu_List')
    Utils.nlog('body', strBody)
    let res = await Utils.post_apiTokenHeader(PREFIX + 'KhoanThu_List', strBody, false, false)
    return res;
}
async function Phi_Detail_v0(id, thangtruoc, IDChiNhanh) {
    Utils.nlog(PREFIX + 'Phi_Detail_v0?id=' + id + '&thangtruoc=' + thangtruoc + '&IDChiNhanh=' + IDChiNhanh);
    let res = await Utils.post_apiTokenHeader(PREFIX + 'Phi_Detail_v0?id=' + id + '&thangtruoc=' + thangtruoc + '&IDChiNhanh=' + IDChiNhanh, null, false, false)
    return res;
}

export {
    KhoanThu_List, Phi_Detail_v0
};