import Utils from "../app/Utils";
import { nkey } from "../app/keys/keyStore";
import { nGlobalKeys } from "../app/keys/globalKey";

const PREFIX = "api/quanlyhocsinh/";

async function ListThoiKhoaBieu(IDLopHoc) {
    let body = {
        more: false,
        pageNumber: 0,
        pageSize: 10,
        sortOrder: '',
        sortField: '',
        filter: {
            "IDLopHoc": IDLopHoc,
        }
    }
    let strBody = JSON.stringify(body);
    let res = await Utils.post_apiTokenHeader(PREFIX + 'ThoiKhoaBieu_List_App', strBody, false, false)
    return res;
};

async function CreateThoiKhoaBieu(IDLopHoc, TieuDe, HinhAnh) {
    let body = {
        IDRow: '',
        IDLopHoc,
        TieuDe,
        GhiChu: '',
        HinhAnh,
    }
    let strBody = JSON.stringify(body);
    let res = await Utils.post_apiTokenHeader(PREFIX + 'ThoiKhoaBieu_Create_App', strBody, false, false)
    return res;
}

async function UpdateThoiKhoaBieu(IDRow, IDLopHoc, TieuDe, HinhAnh, ChangeHinh) {
    let body = {
        IDRow,
        IDLopHoc,
        TieuDe,
        GhiChu: '',
        HinhAnh,
        ChangeHinh
    }
    let strBody = JSON.stringify(body);
    let res = await Utils.post_apiTokenHeader(PREFIX + 'ThoiKhoaBieu_Update_App', strBody, false, false)
    return res;
}


async function LopMonHoc_Create_App(IDChiNhanh, TenLopHoc, IDMonHoc, IDHocSinh) {
    let body = {
        IDChiNhanh,
        TenLopHoc,
        IDMonHoc,
        IDHocSinh
    }
    let strBody = JSON.stringify(body);
    let res = await Utils.post_apiTokenHeader(PREFIX + '/LopMonHoc/LopMonHoc_Create_App', strBody, false, false)
    return res;
}
async function ThuMoiSuKien_Detail(IDThongBao) {
    let res = await Utils.post_apiTokenHeader(PREFIX + "ThuMoiSuKien_Detail?IDThongBao=" + IDThongBao, 'body', false, false);
    return res;
}
async function GV_Detail_HocSinh(IDThongBao, IDBaiKT, IDLoaiBaiKT, IDHocSinh) {
    let res = await Utils.get_apiTokenHeader(PREFIX + 'LichSuBaiKiemTra_GV_Detail_HocSinh?IDThongBao=' + IDThongBao + '&IDBaiKT=' + IDBaiKT + '&IDLoaiBaiKT=' + IDLoaiBaiKT + '&IDHocSinh=' + IDHocSinh, false, false)
    Utils.nlog(PREFIX + 'LichSuBaiKiemTra_GV_Detail_HocSinh?IDThongBao=' + IDThongBao + '&IDBaiKT=' + IDBaiKT + '&IDLoaiBaiKT=' + IDLoaiBaiKT + '&IDHocSinh=' + IDHocSinh)
    return res;
}



export {
    ListThoiKhoaBieu, CreateThoiKhoaBieu, UpdateThoiKhoaBieu, LopMonHoc_Create_App,
    ThuMoiSuKien_Detail, GV_Detail_HocSinh
};