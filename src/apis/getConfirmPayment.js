import Utils from '../app/Utils';
const PREFIX = 'Payment/CustomerConfirmPayment';
let res = '';
async function getConfirmPayment(locator) {
    res = await Utils.get_api(PREFIX + '?locator=' + locator, false, false);
    res = Utils.handleResponse(res);
    return res;
}
export { getConfirmPayment };
//api khi KH bấm submit tôi đã thanh toán thành công gửi thông báo lên backend để check đã chuyển khoản hya chưa.