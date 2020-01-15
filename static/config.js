(function(){
    window.configs = {
        axios_TIMEOUT: 1000*10,
        //180服务器
        static_IMAGES_BASEURL: 'http://180.96.20.178:28080/',
        axios_BASEURL: 'http://180.96.20.178:8097/iptv-admin-api/',
        //下载节目集模板
        downloadSeriesUrl: 'http://180.96.20.178:8097/mediaTemplate/节目集模版.xlsx',
        downloadProgramUrl: 'http://180.96.20.178:8097/mediaTemplate/节目子集模板.xls',

        //下载进度
        downloadProgressUrl: 'ws://180.96.20.178:8097/iptv-admin-api/admin/operation/websocket/mediaImport'
    }
})()