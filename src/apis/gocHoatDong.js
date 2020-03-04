import Utils from "../app/Utils";
import Moment from "moment";
import { ROOTGlobal } from '../app/data/dataGlobal';


// ROOTGlobal.IdCN 
const PREFIX = "api/gochoatdong/";
async function HoatDong_Create(IDNhomKH, TenNhomKH, TenNguoiDang, TieuDe, NoiDung, ListHinhAnh) {
    let body = {
        "IDNhomKH": IDNhomKH,
        "TenNhomKH": TenNhomKH,
        "TenNguoiDang": TenNguoiDang,
        "TieuDe": TieuDe,
        "NoiDung": NoiDung,
        "ListHinhAnh": ListHinhAnh
    }
    let strBody = JSON.stringify(body);
    Utils.nlog('strROOTGlobal.IdCNBody', ROOTGlobal.IdCN)
    Utils.nlog('strBody', strBody)
    let res = await Utils.post_apiTokenHeader(PREFIX + "HoatDong_Create", strBody, false, false);
    return res;
}

async function HoatDong_List(more = false, pageNumber, pageSize = 10, sortOrder = 'desc', sortField = 'Tim', classSelect) {
    let body = {
        "more": more,
        "pageNumber": pageNumber,
        "pageSize": pageSize,
        "sortOrder": sortOrder,
        "sortField": sortField,
        "filter": {
            "IDLopHoc": classSelect
        }
    }
    let strBody = JSON.stringify(body);
    Utils.nlog('strBody', strBody)
    let res = await Utils.post_apiTokenHeader(PREFIX + "HoatDong_List", strBody, false, false);
    return res;
}

async function HoatDong_Comment(IDRowHoatDong, NoiDung, TenNguoiBL, IDNguoiBL) {
    let body = {
        "IDRowHoatDong": IDRowHoatDong,
        "NoiDung": NoiDung,
        "TenNguoiBL": TenNguoiBL,
        "IDNguoiBL": IDNguoiBL
    }
    let strBody = JSON.stringify(body);
    let res = await Utils.post_apiTokenHeader(PREFIX + "HoatDong_Comment", strBody, false, false);
    return res;
}
async function HoatDong_TuongTac(TuongTac, IDRow) {
    Utils.nlog(PREFIX + "HoatDong_TuongTac?TuongTac=" + TuongTac + '&IDRow=' + IDRow)
    let res = await Utils.post_apiTokenHeader(PREFIX + "HoatDong_TuongTac?TuongTac=" + TuongTac + '&IDRow=' + IDRow, 'body', false, false);
    return res;
}

async function HoatDong_Detail(IDRow, pageNumber = 0, pageSize = 10, more = false) {
    let body = {
        "more": more,
        "pageNumber": pageNumber,
        "pageSize": pageSize,
        "sortOrder": "",
        "sortField": "",
        "filter": {
            "IDRow": IDRow
        }
    }
    let strBody = JSON.stringify(body);
    let res = await Utils.post_apiTokenHeader(PREFIX + "HoatDong_Detail", strBody, false, false);
    return res;
}
async function HoatDongCommentList(IDRow, pageNumber = 0, pageSize = 10, more = false) {
    let body = {
        "more": more,
        "pageNumber": pageNumber,
        "pageSize": pageSize,
        "sortOrder": "",
        "sortField": "",
        "filter": {
            "IDRow": IDRow
        }
    }
    let strBody = JSON.stringify(body);
    let res = await Utils.post_apiTokenHeader(PREFIX + "HoatDong_Comment_List", strBody, false, false);
    return res;
}
export { HoatDong_Create, HoatDong_List, HoatDong_Detail, HoatDongCommentList, HoatDong_Comment, HoatDong_TuongTac };
