import service from "@/utils/request";
/**
 * 获取验证码
 */
export function getSms(data) {
    return service.request({
        method: 'post',
        url: "/getSms",
        // data: data
        data
    })
}
