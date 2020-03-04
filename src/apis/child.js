import Utils from '../app/Utils';
const PREFIX = 'api/hocsinh/';

async function listchild(IdPhuHuynh) {
	var res = await Utils.get_apiTokenHeader(PREFIX + `all?IdTaiKhoanPhuHuynh=` + IdPhuHuynh, true, true);
	return res;
}
export { listchild };
