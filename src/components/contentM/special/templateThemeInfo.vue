<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>新建主题模板</span>
                <el-button type="primary" plain @click="onSubmit('form')">提 交</el-button>
            </div>
            <el-form ref="form" :model="form" :rules="rules">
                <el-form-item label="专题中文名" prop="commPageCname" :label-width="formLabelWidth">
                    <el-input v-model="form.commPageCname" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="专题英文名" prop="commPageEname" :label-width="formLabelWidth">
                    <el-input v-model="form.commPageEname" :disabled="eidtTrue" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="埋点名称" prop="pageTrackName" :label-width="formLabelWidth">
                    <el-input v-model="form.pageTrackName"  autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="背景图片" prop="backgroundImage" :label-width="formLabelWidth">
                    <el-popover placement="left" width="535" trigger="click">
                        <el-input v-model="form.backgroundImage" :style="{display:'none'}" autocomplete="off"></el-input>
                        <img class="flagImage" slot="reference" :src="curBgImg" />
                        <image-choice @getSelectImage="img=>setImg(img)"></image-choice>
                    </el-popover>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import defaultFocus from '@/assets/imgs/zhuanti.jpg';
import imageChoice from '../../widget/ImageChoiceWidget';
import {eventBus} from '../../common/eventBus';
export default {
    inject: [
        "setTemplateData",
        "getTemplateData",
        "getContentId",
        "setTemplateActionType",
        "getTemplateActionType"
    ],
    data(){
        var validatorEname = (rule, value, callback)=>{
            if (this.getContentId().action == "edit") {
                callback();
            } else {
                this.$store.dispatch("axios_check_templatename", {
                    name: value
                }).then(res => {
                    if (res.data.data.isExisted) {
                    callback(new Error("已存在"));
                    } else {
                    callback();
                    }
                }).catch(err => {});
            }
        }
        //
        var validateBackground = (rule, value, callback)=>{
            if(value == ''){
                callback(new Error("请选择背景图片"))
            }else {
                callback();
            }
        }
        return {
            eidtTrue: false,
            form: {                                                                                    // 表单数据
                backgroundImage: "",
                commPageCname: "",
                commPageEname: "",
                levelId: "4",
                templateUrl: false,
                bgimg: {
                    id: "",
                    picPath: ""
                }
            },
            formLabelWidth: "120px",                                                                    // 表单label宽
            rules: {                                                                                    // 表单校验规则
                commPageCname: [
                    { required: true, message: "必填项", trigger: "blur" },
                    { min: 2, max: 18, message: "长度在2-18位字符", trigger: "blur" }
                ],
                commPageEname: [
                    { required: true, message: "必填项", trigger: "blur" },
                    { min: 5, max: 50, message: "长度在5-50位字符", trigger: "blur" },
                    { validator: validatorEname, trigger: "blur" }
                ],
                backgroundImage: [
                    { required: true, validator: validateBackground, trigger: "change" }
                ]
            },
            curBgImg: defaultFocus,                                                                      // 专题背景图
            imagesBaseUrl: window.configs.static_IMAGES_BASEURL,                                         // 图片base路径
        }
    },
    created(){
        if(this.getContentId().action == 'edit'){
            debugger
            this.eidtTrue = true;
            this.form.bgimg = item;
            this.form.backgroundImage = this.imagesBaseUrl + item.picPath;
        }
    },
    methods: {
        // 设置专题背景图
        setImg(item){  
            this.curBgImg = this.imagesBaseUrl + item.picPath;                         // 显示选中背景图  
            this.form.backgroundImage = this.imagesBaseUrl + item.picPath;             // 校验背景图
            this.form.bgimg = item;                                                    
        },
        // 提交数据 新建专题
        onSubmit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                eventBus.$emit("setBgImg", this.form);
                //this.setTemplateActionType("edit");
                } else {
                    this.$message.warning("信息未填写完整！");
                }
            });
        },
    },
    components: {
        imageChoice
    }
}
</script>

<style scoped lang="scss">
.el-input {
  width: 80%;
}
.box-card {
    .clearfix {
        display: flex;
        justify-content:  space-between;
    }
    .flagImage {
        width: 50px;
    }
}
</style>