import Utils from '../app/Utils';
import { nkey } from '../app/keys/keyStore';
import { nGlobalKeys } from '../app/keys/globalKey';

const PREFIX = 'api/phuhuynh/';

async function infoPhuhuyenh() {
	let id = Utils.getGlobal(nGlobalKeys.rowId, '');
	let res = await Utils.get_apiTokenHeader(PREFIX + `TaiKhoan/info?id=` + id, false, false);
	// if (res.success == true) {
	// 	Utils.setGlobal(nGlobalKeys.ThongTinPhuHuynh, res);
	// }
	return res;
}
export { infoPhuhuyenh };
