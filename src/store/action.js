import axios from '../utils/axios'
import qs from 'qs'
import store from './index'

const http = {
    get: function (url, requestJson, config){
        return new Promise((resolve, reject)=>{
            axios.get(url, Object.assign({params: requestJson}, config)).then(res => {
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    post: function (url, requestJson, config){
        return new Promise((resolve, reject)=>{
            axios.post(url, qs.stringify(Object.assign(requestJson, config))).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },
    formRequest: function(url, requestJson, config){
        var instance = axios.create({
            baseURL: 'http://180.96.20.178:8097/iptv-admin-api/',
            timeout: 10000,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
        return new Promise((resolve, reject)=>{
            instance.post(url, requestJson).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }
}

export default {
    // 用户信息
    axios_get_userInfo({commit}, requestData = {}){
        return http.get("sysadmin/auth/info", requestData)
    },
    // 加载导航栏菜单权限
    axios_load_navbar({commit}, requestData = {}){
        return http.get("sysadmin/auth/pageIndex", requestData)
    },
    /** ************************** 用户****************************** */
    //用户增删改查
    axios_get_user({ commit }, requestData = {}) {
        return http.post('sysadmin/media/sysUser/userList', requestData)
    },
    //检查用户名唯一
    axios_check_user({ commit }, requestData = {}) {
        return http.post("sysadmin/media/sysUser/checkUnique", requestData)
    },
    //添加用户
    axios_add_user({ commit }, requestData = {}) {
        return http.post('sysadmin/media/sysUser/insert', requestData)
    },
    //删除用户
    axios_del_user({ commit }, requestData = {}) {
        return http.post('sysadmin/media/sysUser/delete', requestData)
    },
    //编辑用户
    axios_edit_user({ commit }, requestData = {}) {
        return http.post('sysadmin/media/sysUser/update', requestData)
    },
    /** ************************** 角色 ***************************** */
    //获取角色
    axios_get_role({ commit }, requestData = {}) {
        return http.post('sysadmin/media/sysRole/roleList', requestData)
    },
    //编辑角色
    axios_edit_role({ commit }, requestData = {}) {
        return http.post('sysadmin/media/sysRole/update', requestData)
    },
    //增加角色
    axios_add_role({ commit }, requestData = {}) {
        return http.post('sysadmin/media/sysRole/insert', requestData)
    },
    //删除角色
    axios_del_role({ commit }, requestData = {}) {
        return http.post('sysadmin/media/sysRole/delete', requestData)
    },
    //检查角色名唯一
    axios_check_rolename({ commit }, requestData = {}) {
        return http.post("sysadmin/media/sysRole/checkUnique", requestData)
    },
    /** ************************** 菜单****************************** */
    //菜单增删改查
    axios_get_menu({ commit }, requestData = {}) {
        return http.post('sysadmin/media/sysMenu/menuList', requestData)
    },
    //加载导航栏菜单权限
    axios_load_navbar({ commit }, requestData = {}) {
        return http.get('sysadmin/auth/pageIndex', requestData)
    },
    /** ****************************专题****************************** */
    //获取专题，推荐列表
    axios_get_template({ commit }, requestData = {}) {
        return http.get('sysadmin/content/special/list', requestData)
    },
    //获取图片列表
    axios_get_pic_resouce({ commit }, requestData = {}) {
        return http.get('sysadmin/content/image/list?dleteFlag=0', requestData)
    },
    //检查专题名唯一
    axios_check_templatename({ commit }, requestData = {}) {
        return http.post("sysadmin/content/special/checkUnique", requestData)
    },
    //专题编辑 根据专题ID获取专题
    axios_get_contentInfo({ commit }, requestData = {}) {
        return http.post('sysadmin/content/special/getContentInfoList', requestData)
    },
}