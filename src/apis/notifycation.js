import Utils from "../app/Utils";
import { nGlobalKeys } from "../app/keys/globalKey";

const PREFIX = "api/hocphi/";
const PREFIX2 = "api/thongbaophuhuynh/";
const PREFIX3 = "api/quanlyhocsinh/";

async function notification(IDKhachHang) {
  let strBody = JSON.stringify({ IDKhachHang: IDKhachHang });
  var res = await Utils.post_apiTokenHeader(PREFIX + `findbill`, strBody, true, true);
  return res;
}

async function chiTietHocPhi(ThangNam, IDKhachHang) {
  let strBody = JSON.stringify({ IDKhachHang: IDKhachHang, ThangNam: ThangNam });
  var res = await Utils.post_apiTokenHeader(
    PREFIX + `findbilldetail`,
    strBody,
    true,
    true
  );
  return res;
}

async function LichSuBaiKiemTra_GV_Detail(IDThongBao = '', IDBaiKT = '') {
  let res = await Utils.get_apiTokenHeader(PREFIX3 + 'LichSuBaiKiemTra_GV_Detail?IDThongBao=' + IDThongBao + '&IDBaiKT=' + IDBaiKT)
  Utils.nlog('Res send noti', res);
  return res;
}

async function ThongBao_Detail_V3(IDThongBao = '') {
  let res = await Utils.get_apiTokenHeader(PREFIX3 + 'ThongBao_Detail_V3?IDThongBao=' + IDThongBao)
  Utils.nlog(PREFIX3 + 'ThongBao_Detail_V3?IDThongBao=' + IDThongBao);
  return res;
}

async function ChiTiet_ThongBao_BaoBai(IDThongBao = '', LoaiTB = '', IDBaiKiemTra = '', IDLop = '', pageNumber = 0, pageSize = 100, sortOrder = "asc") {
  let body = {
    "data": {
      "DenNgay": "",
      "TuNgay": "",
      "IDLoai": -1,
      "IDChiNhanh": -1
    },
    "query": {
      "more": false,
      "pageNumber": pageNumber,
      "pageSize": pageSize,
      "sortOrder": sortOrder,
      "sortField": "ASD",
      "filter": {
        "IDThongBao": IDThongBao,
        "LoaiTB": LoaiTB,
        "IDBaiKiemTra": IDBaiKiemTra,
        "IDLop": IDLop
      }
    }
  }
  let strBody = JSON.stringify(body);
  Utils.nlog(PREFIX3 + '`ChiTiet_ThongBao_BaoBai-----------------------body', strBody)
  var res = await Utils.post_apiTokenHeader(
    PREFIX3 + `ChiTiet_ThongBao_BaoBai`,
    strBody,
    true,
    true
  );
  return res;
}


async function LichSuBaiKiemTra_GV() {
  let body = {
    "query": {
      "filter": {
      },
      "more": false,
      "pageNumber": 0,
      "pageSize": 100,
      "sortOrder": "desc",
      "sortField": ""
    }
  }
  let strBody = JSON.stringify(body);
  var res = await Utils.post_apiTokenHeader(
    PREFIX3 + `LichSuBaiKiemTra_GV`,
    strBody,
    true,
    true
  );
  return res;
}

async function ThongBao_ListAll_App_V2(IDLoai, IDLopHoc, pageNow) {
  let body = {
    "data": {
      "DenNgay": "",
      "TuNgay": "",
      "IDLoai": 0,
      "IDChiNhanh": -1
    },
    "query": {
      "filter": {
        "LoaiThongBao": IDLoai,
        "IDLopHoc": IDLopHoc
      },
      "more": false,
      "pageNumber": pageNow,
      "pageSize": 10,
      "sortOrder": "asc",
      "sortField": "ASD"
    }
  }
  let strBody = JSON.stringify(body);
  // Utils.nlog(PREFIX3 + 'ThongBao_ListAll_App_V2', strBody)
  var res = await Utils.post_apiTokenHeader(
    PREFIX3 + `ThongBao_ListAll_App_V2`,
    strBody,
    true,
    true
  );
  Utils.nlog(PREFIX3 + `ThongBao_ListAll_App_V2`)
  Utils.nlog('--------------------------------------- strBody', strBody)

  return res;
}

async function chiTietThongBao(IdHocSinh, IDKHDPS, IdCN, loai) {
  var res = await Utils.get_apiTokenHeader(
    PREFIX2 +
    `ThongBao?IDKHDPS=` +
    IDKHDPS +
    "&IDChiNhanh=" +
    IdCN +
    "&IDHocSinh=" +
    IdHocSinh +
    "&LoaiThongBao=" +
    loai,
    true,
    true
  );
  return res;
}
async function NotifySend(IDThongBao) {
  Utils.nlog('Body send noti', PREFIX3 + 'ThongBao_Send?IDThongBao=' + IDThongBao);
  let res = await Utils.post_apiTokenHeader(PREFIX3 + 'ThongBao_Send?IDThongBao=' + IDThongBao, 2)
  Utils.nlog('Res send noti', res);
  return res;
}
async function ThongBaoCreate(TenThongBao, TieuDe, MonHoc, NoiDung, IDLoai, IDChiNhanh, HieuLucDen, listLinkImage) {
  let body = {
    TenThongBao,
    TieuDe,
    MonHoc,
    NoiDung,
    HieuLucDen,
    IDLoai,
    IDChiNhanh,
    listLinkImage
  }
  let strBody = JSON.stringify(body);
  let res = await Utils.post_apiTokenHeader(PREFIX3 + 'ThongBao_Create', strBody)
  return res;
}

export { notification, chiTietHocPhi, chiTietThongBao, ThongBaoCreate, NotifySend, LichSuBaiKiemTra_GV, LichSuBaiKiemTra_GV_Detail, ThongBao_ListAll_App_V2, ThongBao_Detail_V3, ChiTiet_ThongBao_BaoBai };
