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
      <el-form :model="form">
        <div class="recom_item" v-for="(recoms,index) in recommendList" :key="'a'+index">
          
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
    }
  },
  methods: {
    // 提交
    onSubmit(){

    },
    // 新增
    resetForm(){
      eventBus.$emit("createNew");
    }
  }
}
</script>

<style scoped lang="scss">
.header {
  font-size: 18px;
  .box-card {
    padding: 10px;
  }
}

</style>