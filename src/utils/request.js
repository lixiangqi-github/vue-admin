import axios from "axios";
import { ElMessage } from "element-plus";
import { getToken, getUserName } from "@/utils/app";


// 创建axios，赋给变量service
// 手把手撸码前端API，地址 http://www.web-jshtml.cn/productApi
const BASE_URL = process.env.NODE_ENV === 'production' ? '' : '/api';

const service = axios.create({
    baseURL: '/api',
    timeout: 15000,
});
// const service = axios.create();

/**
 * 请求接口前，做一些数据处理（请求拦截器）
 */
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // 后台需要前端这边传相关的参数（在请求头添加参数）
    // Tokey
    // userId
    // sui
    // 业务需求
    // 最终目地不是在请求头添加参数
    config.headers['Token'] = getToken()
    config.headers['UserName'] = getUserName()
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});


/**
 * 请求接口后，返回数据进行拦截（响应拦截器）
 */
service.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    let data = response.data
    // 业务需求
    if (data.resCode !== 0) {
        ElMessage.error(data.message);
        return Promise.reject(data);
    } else {
        // return response;
        return Promise.resolve(data);
    }
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default service;

/**
 * 使用export default时，但不能同时存在多个default。
 * 文件 import 不需要花括号，
 */