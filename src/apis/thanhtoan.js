import Utils from "../app/Utils";
import { nkey } from "../app/keys/keyStore";
import { nGlobalKeys } from "../app/keys/globalKey";

const PREFIX = "api/quanlyhocsinh/";

async function hocSinh_CreateOrders(MaHocSinh, sotien) {
  let res = await Utils.post_apiTokenThanhToan(
    PREFIX +
    `HocSinh_CreateOrders?MaHocSinh=` +
    MaHocSinh +
    "&sotien=" +
    sotien,
    "congit",
    false,
    false
  );
  return res;
}

async function SoDoLop_Update(IDLopHoc, ViTri, LoaiLop, IdMonHoc) {
  let body = {
    ViTri: ViTri,
    IDLopHoc: IDLopHoc,
    LoaiLop: LoaiLop,
    IdMonHoc: IdMonHoc
  }
  let strBody = JSON.stringify(body);
  Utils.nlog('strBody', strBody)
  let res = await Utils.post_apiTokenHeader(PREFIX + 'SoDoLop_Update', strBody, false, false)
  return res;
}
async function DiemDanhList(flag, IDChiNhanh, IDLopHoc, ThangNam, idMonHoc) {
  let body = {
    "data": {
      "IDChiNhanh": IDChiNhanh,
      "IDLopHoc": IDLopHoc,
      "ThangNam": ThangNam,
      "IdMonHoc": idMonHoc,
      // "ThoiHoc": ThoiHoc,
      "LoaiLop": flag
    }
    ,
    "query": {
      "more": true,
      "pageNumber": 0
    }
  }
  let strBody = JSON.stringify(body);
  Utils.nlog('DiemDanhList', strBody)
  let res = await Utils.post_apiTokenHeader(PREFIX + 'LopMonHoc/DiemDanh_List_App', strBody, false, false)
  Utils.nlog('DiemDanhList', res)
  return res;
}

async function DiemDanh_Update(Data, LoaiLop, IDMonHoc) {
  let body = {
    "Chot": Data.Chot,
    "TongNgayHoc": Data.TongNgayHoc,
    "ChiTiet": Data.ChiTiet,
    "IDLopHoc": Data.IDLopHoc,
    "LoaiLop": LoaiLop,
    "IDMonHoc": IDMonHoc,
    "NgayChot": Data.NgayChot
  }
  Utils.nlog('Body DiemDanh_Update gui', body);
  let strBody = JSON.stringify(body);
  Utils.nlog('Body DiemDanh_Update gui', body);
  let res = await Utils.post_apiTokenHeader(PREFIX + 'LopMonHoc/DiemDanh_Update_App', strBody, false, false)
  Utils.nlog('Body DiemDanh_Update lay ve', res);
  return res;
}

async function ListTruong() {
  let body = {}
  let strBody = JSON.stringify(body);
  let res = await Utils.post_apiTokenHeader(PREFIX + 'ListTruong', strBody)
  return res;
}

async function ListLop(IDChiNhanh) {
  let body = {
  }
  let strBody = JSON.stringify(body);
  let res = await Utils.post_apiTokenHeader(PREFIX + 'ListLopHoc?IDChiNhanh=' + IDChiNhanh, strBody)
  return res;
}

async function ListAllLop(IDChiNhanh) {
  let body = {
  }
  Utils.nlog(PREFIX + 'LopHoc_ListAll_App?IDChiNhanh=' + IDChiNhanh)
  let strBody = JSON.stringify(body);
  let res = await Utils.post_apiTokenHeader(PREFIX + 'LopHoc_ListAll_App?IDChiNhanh=' + IDChiNhanh, strBody)
  return res;
}

async function LopHoc_List_App(IDChiNhanh) {
  let body = {
  }
  let strBody = JSON.stringify(body);
  let res = await Utils.post_apiTokenHeader(PREFIX + 'LopMonHoc/LopHoc_List_App?IDChiNhanh=' + IDChiNhanh, strBody)
  return res;
}
async function HocSinhList(IDChiNhanh, IDLopHoc, IDTrangThai = 1) {
  let body = {
    "filter": {
      "IDChiNhanh": IDChiNhanh,
      "IDLopHoc": IDLopHoc,
      "IDTrangThai": IDTrangThai,
      "searchTenHocSinh": "",
      "GioiTinh": "",
      "DaThuPNH": -1,
      "HoTenCha": "",
      "HoTenMe": ""
    },
    "pageNumber": 0,
    "more": true
  }
  let strBody = JSON.stringify(body);
  Utils.nlog('-------------------------HocSinh_List', strBody)
  let res = await Utils.post_apiTokenHeader(PREFIX + 'HocSinh_List', strBody, false, false)
  return res;
}
async function ThongBaoPhuHuynhList(IDChiNhanh, TuNgay, DenNgay, IDLoai = 2) {
  let body = {
    "data": {
      "DenNgay": DenNgay,
      "TuNgay": TuNgay,
      "IDLoai": IDLoai,
      "IDChiNhanh": IDChiNhanh
    },
    "query": {
      "pageNumber": 0
    }
  }
  let strBody = JSON.stringify(body);
  let res = await Utils.post_apiTokenHeader(PREFIX + 'ThongBaoPhuHuynh_List', strBody)
  return res;
}


async function BaoBai_Send_App_V2(ListBaoBai = [], IDHocSinhBaoBai = [], TenLopHoc = '') {
  let body = {
    ListBaoBai,
    IDHocSinhBaoBai,
    TenLopHoc: TenLopHoc
  };
  body = JSON.stringify(body);
  Utils.nlog('IDHocSinhBaoBai----------------------', body)
  Utils.nlog(PREFIX + 'BaoBai_Send_App_V2')
  let res = await Utils.post_apiTokenHeader(PREFIX + 'BaoBai_Send_App_V2', body)
  return res;
}

async function BaoBaiSend(ListBaoBai = [], IDHocSinhBaoBai = [], TenLopHoc = '') {
  let body = {
    ListBaoBai,
    IDHocSinhBaoBai,
    TenLopHoc: TenLopHoc
  };
  body = JSON.stringify(body);
  Utils.nlog(PREFIX + 'BaoBai_Send_App', body)
  let res = await Utils.post_apiTokenHeader(PREFIX + 'BaoBai_Send_App', body)
  return res;
}

async function ThongBaoCreate(TenThongBao, TieuDe, NoiDung, IDLoai, IDChiNhanh, HieuLucDen) {
  let body = {
    "TenThongBao": TenThongBao,
    "TieuDe": TieuDe,
    "NoiDung": NoiDung,
    "HieuLucDen": HieuLucDen,
    "IDLoai": IDLoai,
    "IDChiNhanh": IDChiNhanh
  }
  let strBody = JSON.stringify(body);
  Utils.nlog(PREFIX + 'ThongBao_Create')
  Utils.nlog('-----------------ThongBao_Create', body)
  let res = await Utils.post_apiTokenHeader(PREFIX + 'ThongBao_Create', strBody)
  return res;
}


export {
  hocSinh_CreateOrders, DiemDanhList, ListTruong, ListLop, HocSinhList,
  ThongBaoPhuHuynhList, DiemDanh_Update, BaoBaiSend, ThongBaoCreate, SoDoLop_Update, LopHoc_List_App, ListAllLop, BaoBai_Send_App_V2
};
