<template>
  <div class="crm">
    <div class="btn">
      <el-button 
        type="primary" 
        plain
        v-if="isAuth('system:user:insert')"
        @click="handleCreate()"
        >新增</el-button>
    </div>
    <div class="table">
      <el-table
        :data="userData"
        :max-height="460"
      >
        <el-table-column type="selection" width="66"></el-table-column>
        <el-table-column prop="nick" label="用户名"></el-table-column>
        <el-table-column prop="uname" label="账号"></el-table-column>
        <el-table-column prop="roleName" label="角色"></el-table-column>
        <el-table-column label="账号状态">
          <template v-slot="scope">{{showVlaue[scope.row.status]}}</template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column align="center" label="操作" width="160">
          <template v-slot="scope">
            <el-button
              plain
              size="mini"
              type="warning"
              @click="handleEdit(scope.$index, userData, scope)"
            >编辑</el-button>
            <el-button
              plain
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, userData)"
            >删除</el-button>
          </template>
        </el-table-column>
        </el-table>
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
      >
      </el-pagination>
    </div>
    <userForm/>
  </div>
</template>

<script>

import { eventBus } from "@/components/common/eventBus" 
import userForm from './userForm'

export default {
  name: 'userList',
  components: {
    userForm
  },
  inject: ["getMenuId"],
  data () {
    return {
      showVlaue: { "0": "禁用", "1": "启用" },
      userData: [],
      menuId: this.getMenuId(),
      currentPage: 1,                // 分页当前页码
      pageSizes: [5, 10, 30, 40],    // 分页个数选择器
      pageSize: 5,                   // 每页显示
      total: 0,                      // 总条数
      hidePage: false                // 分页隐藏
    }
  },
  created(){
    this.getUserList()
    eventBus.$on("refreshUser",()=>{
      this.getUserList()
    })
  },
  methods: {
    getUserList: function(){
      this.$store.dispatch('axios_get_user', {
        menuId: this.menuId,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }).then(res=>{
        this.userData = res.data.data.list.records;
        this.total = res.data.data.list.total;
      })
    },
    handleSizeChange: function(val){
      if(val != this.pageSize){
        this.pageSize = val;
        this.getUserList();
      }
    },
    handleCurrentChange: function(val){
      this.currentPage = val;
      this.getUserList();
    },
    handleCreate: function(){
      eventBus.$emit('addUser')
    },
    handleEdit: function(index, rows, scope){
      console.log(scope)
      eventBus.$emit("editUser", rows[index])
    },
    handleDelete: function(index, rows){
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.$store.dispatch('axios_del_user',{ids: rows[index].id}).then(res=>{
          if(res.data.errorCode == '1000'){
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getUserList()
          }
        }).catch(()=>{
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        })
        
      }).catch(()=>{
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.crm {
  display: flex;
  flex-direction: column;
  .btn {
    flex: 1;
    text-align: right;
  }
  .page {
    margin-top: 10px;
    flex: 1;
    text-align: right;
  }
}
</style>