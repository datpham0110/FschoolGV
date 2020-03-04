import Utils from "../app/Utils";
import Moment from "moment";
import { ROOTGlobal } from '../app/data/dataGlobal';


// ROOTGlobal.IdCN 
const PREFIX = "api/khaosat/";
async function KhaoSat_Create(IDLopHoc, NgayBatDau, NgayKetThuc, TieuDe, ChiTiet = []) {
    let body = {
        "IDLopHoc": IDLopHoc,
        "NgayBatDau": NgayBatDau,
        "NgayKetThuc": NgayKetThuc,
        "TieuDe": TieuDe,
        "ChiTiet": ChiTiet
    }
    let strBody = JSON.stringify(body);
    Utils.nlog(PREFIX + "KhaoSat_Create")

    Utils.nlog('-------------------------', strBody)
    let res = await Utils.post_apiTokenHeader(PREFIX + "KhaoSat_Create", strBody, false, false);
    Utils.nlog('------------------------- res', res)
    return res;
}
async function KhaoSat_Update(IDRowKS, NoiDung, type) {
    let body = {
        "IDRowKS": IDRowKS,
        "ChiTiet": [
            {
                "IDRowKS": IDRowKS,
                "Loai": type,
                "NoiDung": NoiDung
            },
        ]
    }
    let strBody = JSON.stringify(body);
    Utils.nlog('strBody', strBody)
    let res = await Utils.post_apiTokenHeader(PREFIX + "KhaoSat_Update", strBody, false, false);
    return res;
}

async function KhaoSat_List(more = false, pageNumber, pageSize = 10, sortOrder = '', sortField = '', classSelect, type) {
    let body = {
        "more": more,
        "pageNumber": pageNumber,
        "pageSize": pageSize,
        "sortOrder": sortOrder,
        "sortField": sortField,
        "filter": {
            "IDLopHoc": classSelect,
            "TrangThai": type
        }
    }
    let strBody = JSON.stringify(body);
    Utils.nlog('strBody', strBody)
    let res = await Utils.post_apiTokenHeader(PREFIX + "KhaoSat_List", strBody, false, false);
    return res;
}
async function KhaoSat_Detail(IDRow) {
    Utils.nlog(PREFIX + "HoatDong_Detail?IDRow=" + IDRow)
    let res = await Utils.post_apiTokenHeader(PREFIX + "KhaoSat_Detail?IDRow=" + IDRow, 'body', false, false);
    return res;
}
async function KhaoSat_User(IDRow, Loai) {
    let res = await Utils.post_apiTokenHeader(PREFIX + "KhaoSat_User?IDRow=" + IDRow + "&IDLoai=" + Loai, 'body', false, false);
    return res;
}

export { KhaoSat_List, KhaoSat_Create, KhaoSat_Detail, KhaoSat_Update, KhaoSat_User };
