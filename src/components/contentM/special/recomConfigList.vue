<template>
  <div>
    <el-card class="box-card">
      <!-- 头部 -->
      <div slot="header" class="header">
        <span>推荐列表</span>
        <el-button
          style="float:right;padding: 11px;border-left:1px solid #eee"
          class = "btn"
          type="text"
          @click="onSubmit()"
        >提交</el-button>
        <el-button style="float: right;padding: 11px" type="text" @click="resetForm()">新增</el-button>
      </div>
      <!-- 内容 -->
      <el-form :model="form" >
        <div class="recom_item" v-for="(recoms,index) in recommendList" :key="'a'+index">
          <el-form-item class="el_title recom_title" label="归属类型:">
            <span class="recom_title">{{recoms.typeId.label}}</span>
            <el-button
                style="float: right;padding: 11px"
                type="text"
                @click="editRecomList(recoms,index)"
              >编辑</el-button>
          </el-form-item>
          <div :key="'b'+i" v-for="(recom,i) in recoms.recomList">
            <el-form-item class="el_title" label="推荐图片">
              <el-checkbox
                v-model="recom.checked"
                :checked="isActionType"
                :label="beautySub(recom.name,8)"
                @change="(value)=>changeLabel(value,recom)"
              ></el-checkbox>
              <el-button
                style="float: right;padding: 11px"
                type="text"
                @click="deleteEl(index,i,false,recom)"
              >刪除</el-button>
            </el-form-item>
            <el-form-item label="X" label-width="30px" style="float:left">
              <el-input-number
                v-model="recom.xValue"
                @change="x=>handleChangeX(x,recom)"
                :min="0"
                :max="1280"
                controls-position="right"
                :disabled="!recom.checked"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="Y" label-width="30px" style="float:left">
              <el-input-number
                v-model="recom.yValue"
                @change="y=>handleChangeY(y,recom)"
                controls-position="right"
                :min="0"
                :max="720"
                :disabled="!recom.checked"
              ></el-input-number>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { eventBus } from '../../common/eventBus';
export default {
  data(){
    return {
      form: {},                             // 提交的信息
      recommendList: [],                    // 推荐位信息
      submitList: [],
      isActionType:true
    }
  },
  props: ["actionType"],
  inject: ['getDetailAction'],
  created(){
    console.log(this.getDetailAction(), 'getDetailAction>>>>', this.actionType, 'actionType')
    if(this.actionType=="edit" ){
      if(this.getDetailAction()=='add'){
        this.isActionType=false;  
      }else{
        this.isActionType=true;
      }
    }else{
      this.isActionType=false;
    }
    this.recommendList = this.$store.state.recommendList;                                        // 获取推荐详情列表
    console.log(this.recommendList)
  },
  methods: {
    // 新增
    resetForm(){
      eventBus.$emit("createNew");
    },
    // 编辑
    editRecomList(recom,index){
      this.setDetailAction('edit');
      eventBus.$emit("editRecomList",recom,index);
    },
    // 推荐图片名
    beautySub(str, len){
      if(typeof str == 'string'){
        let reg = /[\u4e00-\u9fa5]/g,
            slice = str.substring(0, len),
            chineseCharNum = ~~(slice.match(reg) && slice.match(reg).length),
            realen = slice.length * 2 - chineseCharNum;
            return str.substr(0, realen) + (realen < str.length ? "..." : "");
      }
    },
    /**
     * @description 是否在窗口展示推荐图片
     * @param {Boolean} v 是否在窗口展示图片
     * @param {Obj} d 该图片数据  
     */
    changeLabel(v, d) {
      if (v) {
        d.checked = true;
        eventBus.$emit("setRecom", d);
      } else {
        d.checked = false;
        eventBus.$emit("removeRecom", d);
      }
    },
    /**
     * @description 删除图片数据
     * @param {Num} index 归属类型索引
     * @param {Num} i 该类型图片索引
     * @param {Boolean} v 是否在窗口展示图片
     * @param {Obj} r 该图片数据  
     */
    deleteEl(index, i, v, r) {
      this.recommendList[index].recomList.splice(i, 1);
      if (!this.checkRecomList(index)) {
        this.recommendList.splice(index, 1);
      }
      this.changeLabel(v, r);
    },
    // 查看推荐图片
    checkRecomList(index) {
      if (this.recommendList[index].recomList.length > 0) {
        return true;
      } else if (this.recommendList[index].labelList.length > 0) {
        return true;
      }else  if (this.recommendList[index].showList.length > 0) {
        return true;
      }else{
        return false;
      }
    },
    /**
     * @param value 图片的坐标x
     * @param item 图片的数据
     */
    handleChangeX(value, item) {
      eventBus.$emit("updatePositionX", item.id, value);
    },
    handleChangeY(value, item) {
      eventBus.$emit("updatePositionY", item.id, value);
    },
    /**
     * @description 提交
     */
    onSubmit() {
      var sublist = [];
      this.recommendList.forEach((item, index) => {
        let p = {
          typeId: "",
          name: "",
          id:'',
          details: []
        };
        p.typeId = item.typeId.value;
        p.name = item.typeId.label;
        if(item.typeId.id){
          p.id=item.typeId.id;
        }

        let recomitem = {
          id:'',
          recommendDisplayType: "",
          recommendDisplayName: "",
          recommendDisplayValue: "",
          recommendTrackName:'',
          recommendPicInfo: []
        }
        if(item.id){
          recomitem.id=item.id;
        }
        recomitem.recommendDisplayType = item.recommendDisplayType;
        recomitem.recommendDisplayName = item.recommendDisplayName;
        recomitem.recommendDisplayValue = item.recommendDisplayValue;
        recomitem.recommendTrackName = item.recommendTrackName;

        let recommendPicInfoT = item.recomList.concat(
          item.showList,
          item.hideList,
          item.labelList
        );
        let tempRecomList = [];
        recommendPicInfoT.forEach((f, x) => {
          if (f.checked == undefined || f.checked == false) {
            recommendPicInfoT.splice(x, 1);
          } else {
            let elementPic = {};
            elementPic= f;
            tempRecomList.push(elementPic);
          }
        });
        if (tempRecomList.length > 0) {
          recomitem.recommendPicInfo = tempRecomList;
          p.details.push(recomitem);
          sublist.push(p);
        }
      });
      eventBus.$emit("submitRecomeList", sublist);
    },
  }
}
</script>

<style scoped lang="scss">
.removeItem {
  color: #409eff;
  font-weight: lighter;
  box-sizing: border-box;
}
.recom_title {
  font-size: 25px;
}
.el-input-number {
  width: 130px;
}
.el_title {
  clear: both;
}
.recom_item {
  width: 100%;
}
.el-input {
  width: 80px;
}

.box-card {
  padding: 10px;
}
.el-form-item {
  margin-bottom: 5px;
}
</style>