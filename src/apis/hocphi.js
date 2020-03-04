import Utils from "../app/Utils";

const PREFIX = "api/hocphi/";
async function findfindstufindstuden(tenHocSinh, NamSinh, MaTruong) {
  let strBody = JSON.stringify({
    TenHocSinh: tenHocSinh,
    NamSinh: NamSinh,
    MaTruong: MaTruong
  });
  let res = await Utils.post_apiTokenHeader(
    PREFIX + "/findstudent",
    strBody,
    false,
    false
  );
  return res;
}

export { findfindstufindstuden };
