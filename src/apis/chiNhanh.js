import Utils from '../app/Utils';

const PREFIX = 'api/chinhanh';
async function getListChiNhanh() {
    let res = await Utils.get_api(PREFIX, false, false);
    return res;
}

export {
    getListChiNhanh
};
