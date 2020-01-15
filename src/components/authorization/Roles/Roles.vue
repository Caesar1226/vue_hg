<template>
  <div class="roles">
    <div class="btn">
      <el-button 
        type="primary"
        plain
        @click="handleCreate()"
        >新增</el-button>
    </div>
    <div class="table">
      <el-table 
        :max-height="460"
        :data = "roleData"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="角色名称" prop="rname"></el-table-column>
        <el-table-column label="权限" prop="rval"></el-table-column>
        <el-table-column label="角色描述" prop="rdesc"></el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
        <el-table-column align="center" label="操作" width="160">
          <template v-slot="scope">
            <el-button 
              type="warning"
              plain
              size="mini"
              @click="handleEdit(scope.$index, roleData)"
            >编辑</el-button>
            <el-button
              type="danger"
              plain
              size="mini"
              @click="handleDelete(scope.$index,roleData)"
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
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :current-page.sync="currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <roleForm></roleForm>
  </div>
</template>

<script>
import {eventBus} from '../../common/eventBus'
import roleForm from "./roleForm";
import { Message } from "element-ui";

export default {
  name: 'roleList',
  inject: ["getMenuId"],
  components: {
    roleForm
  },
  data () {
    return {
      menuId: this.getMenuId(),
      roleData: [],
      currentPage: 1,                //分页当前页码
      pageSizes: [5, 10, 30, 40],    // 分页个数选择器
      pageSize: 5,                   // 每页显示
      total: 0,
      loading: true,
      hidePage: false                // 分页隐藏
    }
  },
  created(){
    this.getRoleList()
    eventBus.$on("refreshRole", ()=>{
      this.getRoleList()
    })
  },
  methods: {
    getRoleList: function(){
      this.$store.dispatch("axios_get_role", {
        menuId: this.menuId,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }).then((res)=>{
        this.roleData = res.data.data.list.records;
        this.total = res.data.data.list.total;
        this.loading = false;
      })
    },
    handleSizeChange: function(val){
      if(val != this.pageSize){
        this.pageSize = val;
        this.getRoleList();
      }
    },
    handleCurrentChange: function(val){
      this.currentPage = val;
      this.getRoleList();
    },
    handleCreate: function(){
      eventBus.$emit("addRole");
    },
    handleEdit: function(index, rows){
      eventBus.$emit("editRole", rows[index]);
    },
    handleDelete: function(index, rows){
      console.log(rows)
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示",{
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res=>{
        this.$store.dispatch('axios_del_role',{
          roleIds: rows[index].id
        }).then((res)=>{
          if (res.data.errorCode == "1000") {
            Message({message: res.data.errorMsg, type: "success"})
            this.getRoleList();
          }else {
            Message({ message: res.data.errorMsg, type: "warning" });
          }
        }).catch(err=>{
          Message({ message: "删除失败，服务器暂无响应！", type: "error" });
        })
      }).catch(err=>{
        this.$message({
            type: "info",
            message: "已取消删除"
          });
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.roles {
  display: flex;
  flex-direction: column;
  .btn {
    flex: 1;
    text-align: right;
  }
}
</style>