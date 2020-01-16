<template>
  <div class="templateParent">
    <div class='btn'>
      <el-button
        v-if="isAuth('system:special:insert')"
        type="primary"
        plain
        size="mini"
        @click="handleCreate()"
      >新增</el-button>
    </div>
    <div class="table">
      <el-table 
        v-if="isAuth('system:special:list')"
        v-loading="loading"
        ref="multipleTable"
        :max-height="460"
        @selection-change="handleSelectionChange"
        :data="tempData"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="ID" width="65"></el-table-column>
        <el-table-column prop="commPageCname" label="中文名"></el-table-column>
        <el-table-column prop="commPageEname" label="英文名"></el-table-column>
        <el-table-column prop="pageTrackName" label="埋点名称"></el-table-column>
        <el-table-column prop="commSpecialEname" label="专项链接"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column align="center" label="操作" width="160">
        <template v-slot="scope">
          <el-button
            v-if="isAuth('system:special:update')"
            plain
            size="mini"
            type="warning"
            @click="handleEdit(scope.$index, tempData)"
          >编 辑</el-button>
        </template>
      </el-table-column>
      </el-table>
      <div v-if="!isAuth('system:special:list')" class="msg">
        暂无权限
      </div>
    </div>
    <div class="page">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        v-show="total > 5"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :current-page.sync="currentPage"
      ></el-pagination>
    </div>
  </div>
</template>


<script>
import { eventBus } from '../common/eventBus'
export default {
  name: 'templateList',
  inject: ["getMenuId"],
  data () {
    return {
      menuId: this.getMenuId(),
      currentPage: 1, //分页当前页码
      pageSize: 5,
      pageSizes: [5, 10, 30, 40],    // 分页个数选择器
      total: 1,
      tempData: [],
      search: "",
      tableHeight: undefined,
      loading: true
    }
  },
  created(){
    this.getTemplate();
    
  },
  methods: {
    getTemplate() {
      this.$store
        .dispatch("axios_get_template", {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          levelId: 4
        })
        .then(rs => {
          this.tempData = rs.data.data.records;
          this.total = rs.data.data.total;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    handleCreate() {
      eventBus.$emit("createFrame");
    },
    handleSelectionChange(val) {
      console.log(val,123)
    },
    handleEdit(index, rows) {
      eventBus.$emit("editFrame", rows[index].id);
    },
    handleSizeChange(val){
      if(val != this.pageSize){
        this.pageSize = val;
        this.getTemplate();
      }
    },
    handleCurrentChange(val){
      this.currentPage = val;
      this.getTemplate();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>
.templateParent {
  display: $display;
  flex-direction: $direction;
  .page {
    margin-top: 10px;
    flex: 1;
    text-align: right;
  }
}
.btn {
  flex: 1;
  text-align: right;
}
</style>