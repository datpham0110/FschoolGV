import Utils from "../app/Utils";
import Moment from "moment";
import { ROOTGlobal } from '../app/data/dataGlobal';


// ROOTGlobal.IdCN 
const PREFIX = "api/gochoctap/";
async function GocHocTap_Create(IDNhomKH, TenNhomKH, IDMonHoc, NoiDung, Ngay, ThoiGian, ListHinhAnh, ListHocSinh, TenMon) {
    Utils.nlog('------------', TenMon)
    let hours = Moment(new Date(), 'MM/DD/YYYY h:m:s').format("hh:mm:ss");
    let body = {
        "IDNhomKH": IDNhomKH,
        "TenNhomKH": TenNhomKH,
        "IDMonHoc": IDMonHoc,
        "NoiDung": NoiDung,
        "Ngay": Ngay,
        "ThoiGian": hours,
        "ListHinhAnh": ListHinhAnh,
        "ListHocSinh": ListHocSinh,
        "IDChiNhanh": ROOTGlobal.IdCN,
        "TenMonHoc": TenMon
    }
    let strBody = JSON.stringify(body);
    Utils.nlog('strBody', strBody)
    let res = await Utils.post_apiTokenHeader(PREFIX + "GocHocTap_Create", strBody, false, false);
    return res;
}

export { GocHocTap_Create };
