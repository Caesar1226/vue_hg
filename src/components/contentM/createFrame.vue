<template>
    <div class="theme_activ">
        <div class="theme">
            <img 
                v-if="imgurl"
                :src="imgurl"
                :style="{position: 'relative', width: '640px', height: '360px'}"
            />
        </div>
        <div class="theme_info">
            <el-form label-position="left">
                <el-button
                @click="goBack"
                type="text"
                icon="el-icon-arrow-left"
                :style="{color:'#409EFF'}"
                >
                    上一页 
                </el-button>
                <el-form-item label="专题信息" style="margin-top:20px;margin-left:20px;" :label-width="formLabelWidth" label->
                    <el-button
                    v-if="!activname"
                    type="primary"
                    plain
                    @click="resetForm('templateThemeInfo')"
                    >新建</el-button>
                </el-form-item>
                <el-form-item
                :label="activname"
                style="color:#409EFF;margin-top:20px;margin-left:20px;"
                :label-width="formLabelWidth"
                >
                    <el-button
                    v-if="activname"
                    type="success"
                    circle
                    size="small"
                    class="el-icon-check"
                    @click="resetForm('templateThemeInfo')"
                    ></el-button>
                </el-form-item>
                <el-form-item label="推荐详情列表" style="margin-top:20px;margin-left:20px;" :label-width="formLabelWidth">
                    <el-button type="primary" @click="resetForm('recomConfigList')" plain>编 辑</el-button>
                </el-form-item>
                <el-form-item
                style="margin-top:20px;margin-left:20px;"
                v-for="item in endSubmitData.recommendInfo"
                :key="'sec'+item.typeId"
                :label="item.name"
                :label-width="formLabelWidth"
                >
                    <el-button
                        type="success"
                        class="el-icon-check"
                        @click="resetForm('recomConfigList')"
                        size="small"
                        circle
                    ></el-button>
                </el-form-item>
            </el-form>
            <div class="dialog-footer">
                <el-button type="primary" plain @click="publishTemplate">保存</el-button>
            </div>
            <div class="dialog-footer">
                <el-button type="primary" plain @click="checkTemplate">创建专项链接</el-button>
            </div>
        </div>
        <div class="theme_config">
            <transition name="fade-transform" mode="out-in">
                <component :is="tabView"></component>
            </transition>
        </div>
  </div>
</template>

<script>
import {eventBus} from '../common/eventBus'
import bg from '@/assets/imgs/zhuanti.jpg'
import templateThemeInfo from "./special/templateThemeInfo";      // 新建
import recomConfigList from "./special/recomConfigList";          // 编辑
import recomConfigDetail from "./special/recomConfigDetail";      // 编辑新增
export default {
    name: 'createFrame',
    components: {
        templateThemeInfo,
        recomConfigList,
        recomConfigDetail
    },
    inject: ["getContentId"],
    provide(){
        return {
            setTemplateData: value => (this.templateData = value),
            getTemplateData: () => {
                return this.templateData;
            },
            getTemplateActionType: () => {
                return this.templateActionType;
            },
            setTemplateActionType: value => {
                this.templateActionType = value;
            }
        }
    },
    data(){
        return {
            editSubmitData: {},
            actionType: "new",
            commPageEname: "",
            imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
            activname: "",                                           // 专题名称
            imgurl: bg,
            tabView: "",
            formLabelWidth: "120px",
            templateData: {},                                                   
            imgArray: [],
            contentId: "",
            endSubmitData: {                                         // 需要保存的最终数据
                pageInfo: {
                    commPageCname: "",
                    commPageEname: "",
                    levelId:4
                },
                templateInfo: {
                    templatePicId: "",
                    templateUrl: "123"
                },
                recommendInfo: []
            },
            editRecom: { data: [], index: 0 },
            detailAction: "",
            templateActionType: ""
        }
    },
    created(){
        let at = this.getContentId();
        //console.log("getContentId", at);
        if(at.action == "edit"){
            this.actionType = at.action;
            this.templateActionType = "edit";
            this.getTemplateById(at.contentId);
        }
        eventBus.$on("goRecomeList", d => {
            console.log(d.page)
            d ? (this.tabView = d.page) : (this.tabView = "");
        });
    },
    mounted(){
        eventBus.$on("setBgImg", form=>{
            console.log('this1', this)
            if(this.actionType == "new"){
                console.log(form, 123456)
                // 新建专题数据
                this.templateData = form 
                // 需要保存的数据                                              
                this.endSubmitData.pageInfo.commPageCname = form.commPageCname;
                this.endSubmitData.pageInfo.commPageEname = form.commPageEname;
                this.endSubmitData.pageInfo.levelId = form.levelId;
                this.endSubmitData.templateInfo.templatePicId = form.bgimg.id;
                this.endSubmitData.pageInfo.pageTrackName = form.pageTrackName;
                // 背景图显示
                this.imgurl = this.imagesBaseUrl + form.bgimg.picPath;
                // 专题名称
                this.activname = form.commPageCname;
                //
                this.commPageEname = form.commPageEname;
                // 隐藏新建模块
                this.tabView = ''
            }
        })
        /**
         * 推荐详情列表编辑中新增
        */
        eventBus.$on("createNew", () => {
            this.detailAction = "add";                       // 新增推荐详情
            this.tabView = "recomConfigDetail";              // 动态组件显示为新增详情
        });
    },
    methods: {
        // 上一页
        goBack(){
            eventBus.$emit('templateList');
        },
        // 新建 编辑
        resetForm(page){
            this.tabView = page;
        },
        // 创建专向链接
        checkTemplate(){

        },
        publishTemplate(){

        },
        provide(){
            return {
                setTemplateData: value => (this.templateData = value),
                getTemplateData: () => {
                    return this.templateData;
                },
                getTemplateActionType: () => {
                    return this.templateActionType;
                },
                setTemplateActionType: value => {
                    this.templateActionType = value;
                }
            }
        }
    },
    beforeDestroy(){
        eventBus.$off([
            "setBgImg",
            "createNew"
        ])
    }
}
</script>

<style scoped lang="scss">
.theme_activ {
    display: flex;
    .theme {
        margin-top: 2%;
        width: 640px;
        min-width: 640px; 
        -moz-user-select: none;
        -khtml-user-select: none;
        user-select: none;
    }
    .theme_info {
        width: 300px;
        padding-top: 10px;
        margin-left: 10px;
        margin-right: 10px;
        border-left: 2px dashed #eee;
        border-right: 2px dashed #eee;
        .dialog-footer {
            margin-top: 20px;
            margin-left: 20px;
        }
    }
    .theme_config {
        width: 400px;
        padding-top: 10px;
    }
}
</style>