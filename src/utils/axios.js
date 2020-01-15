import axios from 'axios';
import router from '../router/index'

axios.defaults.timeout = window.configs.axios_TIMEOUT;
axios.defaults.baseURL = window.configs.axios_BASEURL;

// 请求拦截器
axios.interceptors.request.use(config => {
    // Do something before request is sent
    config.headers['x-a-t'] = localStorage.getItem('token')
    return config;
},error => {
    // Do something with request error
    return Promise.reject(error);
});

// 响应拦截器
axios.interceptors.response.use(response => {
    // Do something before response is sent
    if (response.data.errorCode == '1008') {
        localStorage.removeItem('token');
        router.push('/login');
        // Message({ message: '用户token失效,请重新登录', type: "warning" })
    }
    return response;
},error => {
    // Do something with response error
    return Promise.reject(error);
});

export default axios