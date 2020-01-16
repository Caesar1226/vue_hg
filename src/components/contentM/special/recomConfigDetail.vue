<template>
    <div>
        <el-card class="box-card" :style="{'overflow-y':'auto'}">
            <!-- 头部 -->
            <div slot="header" class="clearfix">
                <span>新建推荐详情</span>
                <el-button
                    style="float:right; padding: 11px;border-left:1px solid #eee"
                    type="text"
                    @click="onSubmit()"
                >提 交</el-button>
            </div>
            <!-- 表单 -->
            <el-form :model="form">
                <el-form-item label="归属推荐类型" :label-width="formLabelWidth">
                    <el-select v-model="curType" @change="selectType" placeholder="请选择">
                        <el-option
                            v-for="item in typeIds"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="跳转地址类型" :label-width="formLabelWidth">
                    <el-select
                        v-model="form.recommendDisplayType"
                        @change="selectRecomType"
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in recommendDisplayTypes"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="'跳转'+recommendName+'名称'" :label-width="formLabelWidth">
                    <el-select
                        v-if=" form.recommendDisplayType != 8 && form.recommendDisplayType!=3"
                        v-model="form.recommendDisplayValue"
                        placeholder="请选择"
                        filterable
                    >
                        <el-option
                        v-for="(item,index) in recommendDisplayNames"
                        :key="index"
                        :label="item.recommendDisplayName"
                        :value="item.recommendDisplayValue"
                        ></el-option>
                    </el-select>
                    <el-input
                        v-if=" form.recommendDisplayType==3 || form.recommendDisplayType==8"
                        v-model="form.recommendDisplayValue"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="埋点名称" :label-width="formLabelWidth">
                    <el-input v-model="form.recommendTrackName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="推荐图片" :label-width="formLabelWidth">
                    <el-upload
                        action
                        :file-list="form.recomList"
                        list-type="picture"
                        :on-remove="removeRecome"
                    >
                        <el-popover
                            slot='tip'
                            placement="left"
                            trigger="click"
                            width="535"
                        >
                            <el-button slot="reference" size="small" type="primary" plain>添 加</el-button>
                            <transition name="fade-transform" mode="out-in">
                                <imageChoice @getSelectImage="recomUploadSuccess"></imageChoice>
                            </transition>
                        </el-popover>
                    </el-upload>
                </el-form-item>
                <el-form-item label="标签图片" :label-width="formLabelWidth">
                    <el-upload
                        class="upload-demo"
                        action
                        :file-list="form.labelList"
                        :on-remove="removeLabel"
                        list-type="picture"
                    >
                        <el-popover
                        slot="tip"
                        placement="right"
                        width="535"
                        trigger="hover"
                        v-model="dialogFormVisible2"
                        >
                        <el-button slot="reference" size="small" type="primary" plain>添 加</el-button>
                        <transition name="fade-transform" mode="out-in">
                            <div class="balnce">
                            <imageChoice @getSelectImage="img => labelUploadSuccess(img)"></imageChoice>
                            </div>
                        </transition>
                        </el-popover>
                    </el-upload>
                </el-form-item>
                <el-form-item label="显示图片" :label-width="formLabelWidth">
                    <el-upload
                        class="upload-demo"
                        action
                        :on-remove="removeShow"
                        :file-list="form.showList"
                        list-type="picture"
                    >
                        <el-popover
                        slot="tip"
                        placement="right"
                        width="535"
                        trigger="hover"
                        v-model="dialogFormVisible3"
                        >
                        <el-button slot="reference" size="small" type="primary" plain>添 加</el-button>
                        <transition name="fade-transform" mode="out-in">
                            <div class="balnce">
                            <imageChoice @getSelectImage="img => showUploadSuccess(img)"></imageChoice>
                            </div>
                        </transition>
                        </el-popover>
                    </el-upload>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import imageChoice from "@/components/widget/ImageChoiceWidget";
import { eventBus } from "../../common/eventBus"
export default {
    data(){
        return {
        preBtn: true,
        nextBtn: false,
        pageTotle: 0,
        currentPage: 1,
        curType: "",
        recomType: "",
        recomName: "",
        contentInfo: "",
        dialogFormVisible: false,
        dialogFormVisible2: false,
        dialogFormVisible3: false,
        dialogFormVisible4: false,
        imgData: [],
        imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
        head: {
            "x-a-t": localStorage.getItem("token")
        },
        typeIds: [
            { value: "1", label: "通用专题正文" },
            { value: "2", label: "退出专题" },
            { value: "3", label: "其他" }
        ],
        recommendDisplayNames: [],
        // 推荐详表显示的类型 0 游戏 ，1 卡通， 2视频 ，3 跳转指定地址 ，4 通用页面id ，5 活动id ，6专题 ，7分类内容 ，8卡通需要鉴权，88其它
        recommendDisplayTypes: [
            {
            value: "0",
            label: "游戏"
            },
            {
            value: "1",
            label: "卡通"
            },
            {
            value: "2",
            label: "视频"
            },
            {
            value: "3",
            label: "跳转指定地址"
            },
            {
            value: "4",
            label: "通用页面"
            },
            {
            value: "5",
            label: "活动"
            },
            {
            value: "6",
            label: "专题"
            },
            {
            value: "7",
            label: "分类内容"
            },
            {
            value: "8",
            label: "卡通需要鉴权"
            },
            {
            value: "88",
            label: "其他"
            }
        ],

        form: {
            typeId: {
                value: "",
                label: ""
            },
            rank: "",
            recommendDisplayType: "",
            recommendDisplayName: "",
            recommendDisplayValue: "",
            recommendTrackName :'',
            recomList: [],
            labelList: [],
            showList: [],
            hideList: []
        },
        formLabelWidth: "125px",
        action: "",
        recommendName: "",
        dialogImageUrl: "",
        dialogVisible: false
        };
    },
    methods: {
        /**
         * 提交
         */
        onSubmit() {
            if (this.actionType == "edit" && this.getDetailAction() == "edit") {
                this.setDetailAction("add");
                this.form.index = this.editIndex;
                this.$store.commit("recommendList_update", this.form);
                eventBus.$emit("goRecomeList", {
                page: "recomConfigList",
                data: this.form
                });
            } else {
                eventBus.$emit("goRecomeList", {
                page: "recomConfigList",
                data: this.form
                });
                this.$store.commit("recommendList_setter", this.form);
            }
        },
        /**
         * 选择推荐类型
         */
        selectType(val) {
            let obj = {};
            obj = this.typeIds.find(item => {
                return item.value === val;
            });
            this.form.typeId = obj;
        },   
        /**
         * 跳转地址类型选定会自动获取对应的跳转推荐名称
        */
        selectRecomType(val) {
            this.getContentInfo();
            this.recommendDisplayTypes.forEach((item, index) => {
                if (item.value == val) {
                if (val == 3) {
                    this.recommendName = "";
                } else {
                    this.recommendName = item.label;
                }
                }
            });
        },
        /**
         * 获取推荐内容
         */
        getContentInfo() {
            this.$store
            .dispatch("axios_get_contentInfo", {
            contentType: this.form.recommendDisplayType,
            pageSize: 10000
            })
            .then(rs => {
                this.recommendDisplayNames = rs.data.data.records;
                
            })
            .catch(err => {});
        },
        /**
         * 推荐图片
         */
        recomUploadSuccess(file) {
            file.name = file.picCname;
            file.url = this.imagesBaseUrl + file.picPath;
            file.picId = file.id;
            file.picType = "0";
            this.form.recomList.push(file);
            
        },
        /**
         * 显示选中图片
         */
        showUploadSuccess(file) {
            file.name = file.picCname;
            file.url = this.imagesBaseUrl + file.picPath;
            file.picId = file.id;
            file.picType = "2";
            this.form.showList.push(file);
        },
        labelUploadSuccess(file) {
            file.name = file.picCname;
            file.url = this.imagesBaseUrl + file.picPath;
            file.picId = file.id;
            file.picType = "1";
            this.form.labelList.push(file);
        },
        removeRecome(f, fl) {
            this.form.recomList.forEach((item, index) => {
                if (item.id == f.id) {
                    this.form.recomList.splice(index, 1);
                    eventBus.$emit("removeRecom", item);
                    // this.setDetailAction('add');
                    }
            });
        },
        removeLabel(f, fl) {
            this.form.labelList.forEach((item, index) => {
                if (item.id == f.id) {
                this.form.labelList.splice(index, 1);
                eventBus.$emit("removeRecom", item);
                // this.setDetailAction('add');
                }
            });
        },
        removeShow(f, fl) {
            this.form.showList.forEach((item, index) => {
                if (item.id == f.id) {
                this.form.showList.splice(index, 1);
                eventBus.$emit("removeRecom", item);
                // this.setDetailAction('add');
                }
            });
        },
    },
    components: {
        imageChoice
    }
}
</script>

<style>

</style>