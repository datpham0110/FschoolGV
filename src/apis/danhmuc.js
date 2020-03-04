import Utils from "../app/Utils";

const PREFIX = "api/danhmuc/";
async function MonHocList() {
    let body = {
        "filter": {
            "keyword": ""
        },
        "pageNumber": 0,
        "more": true
    }
    let strBody = JSON.stringify(body);
    let res = await Utils.post_apiTokenHeader(PREFIX + "MonHoc_List", strBody, false, false
    );
    return res;
}

export { MonHocList };
