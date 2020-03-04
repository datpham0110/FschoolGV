import Utils from '../app/Utils';
import { nGlobalKeys } from '../app/keys/globalKey';

const PREFIX = 'api/chitiethocphi/';

async function getchiethocphi(thang1, nam1, thang2, nam2, IDKhachHang) {
    let res = await Utils.get_apiTokenHeader(PREFIX + 'chitiethocphi?thang1=' + thang1 + '&nam1=' + nam1 + '&thang2=' + thang2 +
        '&nam2=' + nam2 + '&IDKhachHang=' + IDKhachHang, false, false);
    return res;
}
export { getchiethocphi }