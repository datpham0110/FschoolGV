import Utils from "../app/Utils";
import { nGlobalKeys } from "../app/keys/globalKey";
import { ROOTGlobal } from "../app/data/dataGlobal";

const PREFIX = "api/chatgiaovien/";


async function LogOut() {
    let Token = Utils.getGlobal(nGlobalKeys.deviceToken, '');
    let Id = ROOTGlobal.dataUser.IdUser;
    let res = await Utils.get_apiTokenHeader(PREFIX + `DeleteToken?Token=` + Token + '&Id=' + Id, false, false);
    return res;
}
export {
    LogOut
};
