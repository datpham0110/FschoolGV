import Utils from '../app/Utils';
import { nkey } from '../app/keys/keyStore';
import { nGlobalKeys } from '../app/keys/globalKey';

const PREFIX = 'api/user/';

async function LayMenuChucNang() {
    let res = await Utils.post_apiTokenHeader(PREFIX + 'LayMenuChucNang', 1, false, true);
    return res;
}
export { LayMenuChucNang };
