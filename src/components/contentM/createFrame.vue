<template>
    <div class="theme_activ">
        <div class="theme">
            <div class="theme_el">
                <img
                v-if="imgurl"
                :src="imgurl"
                :style="{position:'relative',width:'640px', height:'360px'}"
                />
                <div
                    :key="'first'+item.id"
                    v-for="(item) in imgArray"
                    :id="item.id"
                    v-recomDrag="item.id"
                    :style="{position:'absolute' ,top:item.top+'px',left:item.left+'px',
                    display:'inline-block !important',display:'inline',width:(item.width), height:(item.height)}"
                >
                    <img
                        :src="item.imgurl"
                        class="recommends"
                        :style="{width:(item.width), height:(item.height)}"
                    />
                <div :id="item.id" class="img_cover"></div>
            </div>
       </div>
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
                <component :is="tabView" :actionType="actionType"></component>
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
import axios from '../../utils/axios'
export default {
    name: 'createFrame',
    components: {
        templateThemeInfo,
        recomConfigList,
        recomConfigDetail
    },
    directives: {
        recomDrag: {
            bind(el, binding){
                el.style.cursor = "move";
                el.onmousedown = e =>{
                    const disX = e.clientX - el.offsetLeft
                    const disY = e.clientY - el.offsetTop
                    document.onmousemove = function(e) {
                    const l = e.clientX - disX
                    const t = e.clientY - disY
                    el.style.left = `${l}px`
                    el.style.top = `${t}px`
                    eventBus.$emit("elmousemove", el.id, l, t)
                    };
                    document.onmouseup = function(e) {
                        document.onmousemove = null;
                        document.onmouseup = null;
                    }
                }
                
            }
        }
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
            },
            getDetailAction: () => {
                return this.detailAction;
            },
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

        if(at.action == "edit"){
            this.actionType = at.action;
            this.templateActionType = "edit";
            this.getTemplateById(at.contentId);
        }
        eventBus.$on("goRecomeList", d => {

            d ? (this.tabView = d.page) : (this.tabView = "");
        });
        // 接收推荐列表信息
        eventBus.$on("submitRecomeList", d => {
            this.editSubmitData.recommendInfo = d;
            this.endSubmitData.recommendInfo = d;
            this.tabView = "";
        });
    },
    mounted(){
        eventBus.$on("updatePositionX", (id, value) => {
      this.imgArray.forEach((item, index) => {
        if (item.id == id) {
          this.imgArray[index].left = value / 2;
        }
      });
    });
    eventBus.$on("updatePositionY", (id, value) => {
      this.imgArray.forEach((item, index) => {
        if (item.id == id) {
          this.imgArray[index].top = value / 2;
        }
      });
    });
        eventBus.$on("setBgImg", form=>{

            if(this.actionType == "new"){

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

        eventBus.$on("setRecom", imgData => {
            this.imgArray.push({
                id: imgData.id,
                imgurl: imgData.url,
                top: imgData.yValue / 2 || 0,
                left: imgData.xValue / 2 || 0,
                width: imgData.picW / 2 + "px",
                height: imgData.picH / 2 + "px"
            });
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
            this.deteleObject(() => {});
        },
        deteleObject(obj) {
            var uniques = [];
            var stringify = {};
            for (var i = 0; i < obj.length; i++) {
                var keys = Object.keys(obj[i]);
                keys.sort(function(a, b) {
                return Number(a) - Number(b);
                });
                var str = "";
                for (var j = 0; j < keys.length; j++) {
                str += JSON.stringify(keys[j]);
                str += JSON.stringify(obj[i][keys[j]]);
                }
                if (!stringify.hasOwnProperty(str)) {
                uniques.push(obj[i]);
                stringify[str] = true;
                }
            }
            uniques = uniques;
            return uniques;
        },
        // 创建专向链接
        checkTemplate(){

        },
        sortBy(field) {
            return function(a, b) {
                return a[field] - b[field];
            };
        },
        getTemplateById(id) {
            
            this.contentId = id;
            this.$store.dispatch("axios_get_view", {
                contentId: id
            }).then(req => {
                let d = req.data.data;
                this.templateData = d.pageInfo;
                this.activname = d.pageInfo.commPageCname;
                this.imgurl =
                    this.imagesBaseUrl + d.templateInfo.picLibraryTab.picPath;
                this.templateData.bgimg = d.templateInfo.picLibraryTab;
                this.endSubmitData.recommendInfo = d.recommendInfo;
                this.endSubmitData.recommendInfo.forEach(item=>{
                item.name=this.$store.state.typeIds.find( i => i.value === item.typeId).label
                })
                this.formateRecome(d.recommendInfo);
                this.editSubmitData = d;
                this.commPageEname = d.pageInfo.commPageEname;
            }).catch(err => {
            });
        // arr1.sort(this.sortBy("typeId"));
        },
        formateRecome(newList) {
      let formateDataList = [];
      newList.forEach(item => {
        item.details.forEach(detail => {
          let formateData = {
            typeId: {
              value: "",
              label: "",
              id: ""
            },
            id: "",
            recommendDisplayType: "",
            recommendDisplayName: "",
            recommendDisplayValue: 2,
            recommendTrackName:'',
            recomList: [],
            labelList: [],
            showList: [],
            hideList: []
          };
          formateData["typeId"].value = item.typeId;
          // formateData.typeId.label = this.typeReg[item.typeId];
          formateData.typeId.label= this.$store.state.typeIds.find( i => i.value === item.typeId).label
          formateData.typeId.id = item.id;
          formateData.id = detail.id;
          formateData.recommendDisplayType = detail.recommendDisplayType;
          formateData.recommendDisplayName = detail.recommendDisplayName;
          formateData.recommendDisplayValue = detail.recommendDisplayValue;
          formateData.recommendTrackName = detail.recommendTrackName;
          detail.recommendPicInfo.forEach(pic => {
            let type = pic.picType;
            pic.url = this.imagesBaseUrl + pic.picPath;
            if (type == 0) {
              formateData.recomList.push(pic);
            } else if (type == 1) {
              formateData.labelList.push(pic);
            } else if (type == 2) {
              formateData.showList.push(pic);
            } else if (type == 3) {
              formateData.hideList.push(pic);
            }
            eventBus.$emit("setRecom", pic);
          });
          formateDataList.push(formateData);
        });
      });
      this.$store.commit("recommendList_setter", formateDataList);
      this.$store.state.recommendList = formateDataList;
    },
        // 保存
        publishTemplate() {
            if (this.actionType == "new") {
                this.endSubmitData.recommendInfo.sort(this.sortBy("typeId"));
                this.axios
                .post("sysadmin/content/special/add", this.endSubmitData)
                .then(rs => {
                    if (rs.data.errorCode == "1000") {
                    this.contentId = rs.contentId;
                    this.$message.success(
                        "添加成功  " + JSON.stringify(rs.data.errorMsg)
                    );
                    } else {
                    this.$message.error(
                        "添加失败  " + JSON.stringify(rs.data.errorMsg)
                    );
                    }
                })
                .catch(er => {
                    this.$message.error("添加失敗 ");
                });
            } else {
                this.editSubmitData.recommendInfo.sort(this.sortBy("typeId"));
                axios.post("sysadmin/content/special/update", this.editSubmitData)
                    .then(rs => {
                        if (rs.data.errorCode == "1000") {
                            this.$message.success(
                                "编辑成功" + JSON.stringify(rs.data.errorMsg)
                            );
                            } else {
                            this.$message.error(
                                "编辑失败" + JSON.stringify(rs.data.errorMsg)
                            );
                        }
                    }).catch(er => {
                        this.$message.error("编辑失敗 ");
                    });
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
img {
  -moz-user-select: none;
  -khtml-user-select: none;
  user-select: none;
}
.img_cover {
  filter: alpha(Opacity=80);
  -moz-opacity: 0.5;
  opacity: 0;
  z-index: 100;
  background-color: #ffffff;
  position: relative;
  height: 100%;
}
.background_img {
  position: relative;
  width: 640px;
  height: 360px;
  z-index: 21111;
}
.recommends {
  position: absolute;
}
.dialog-footer {
  margin-top: 20px;
  margin-left: 20px;
}

.theme_activ {
  display: flex;
}
.theme {
  margin-top: 2%;
  width: 640px;
  min-width: 640px;
  -moz-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  float: left;
}
.theme_el {
  width: 640px;
  height: 360px;
  float: left;
  position: absolute;
  overflow: hidden;
  border-style: groove;
}
.theme_info {
  width: 300px;
  float: left;
  padding-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
  border-left: 2px dashed #eee;
  border-right: 2px dashed #eee;
}
.theme_config {
  width: 400px;
  float: left;
  padding-top: 10px;
}
.add_btn {
  margin: 10px 0 0 10px;
  float: left;
}

.el-input--mini .el-input__inner {
  width: 100px;
}
</style>