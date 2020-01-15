<template>
  <div class="MenuM">
    <div class='btn'>
      <el-button type="primary" plain @click="handleCreate()">新增</el-button>
    </div>
    <div class='table'>
      <el-table
        :max-height="460"
        v-loading="loading"
        :data="menuData"
        ref="multipleTable"
        row-key="id"
        tooltip-effect="dark"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column fixed prop="menuName" label="菜单名称"  width="300"></el-table-column>
        <el-table-column prop="menuType" label="菜单类型" width="180"></el-table-column>
        <el-table-column prop="url" label="URL地址" width="300"></el-table-column>
        <el-table-column label="是否隐藏">
          <template v-slot="scope">{{showVlaue[scope.row.visible]}}</template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              plain
              size="mini"
              type="warning"
              @click="handleEdit(scope.$index, formatData)"
            >编 辑</el-button>
            <el-button
              plain
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, formatData)"
            >删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class='page'>
      <el-pagination></el-pagination>
    </div>
    <MenuForm></MenuForm>
  </div>
</template>

<script>
import MenuForm from './menuForm'
import { eventBus } from '../../common/eventBus'
export default {
  name:'menuList',
  inject: ["getMenuId"],
  components: {
    MenuForm
  },
  data () {
    return {
      loading: true,
      menuData: [],
      showVlaue: { "0": "否", "1": "是" },
      menuId: this.getMenuId()
    }
  },
  mounted(){
    this.getMenuList()
  },
  methods: {
    getMenuList: function(){
      this.$store.dispatch('axios_get_menu',{
        menuId: this.menuId
      }).then(res=>{
        this.menuData = res.data.data.list;
        this.loading = false;
      }).catch(err=>{
        this.loading = false;
      })
    },
    handleCreate: function(){
      eventBus.$emit("addMenu")
    },
    handleDelete: function(){

    },
    handleEdit: function(){

    },
    handleSizeChange: function(val){
      if(val != this.pageSize){
        this.pageSize = val;
        this.getMenuList();
      }
    },
    handleCurrentChange: function(val){
      this.currentPage = val;
      this.getMenuList();
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>
.MenuM {
  display: flex;
  flex-direction: column;
  .btn {
    flex: 1;
    text-align: right;
  }
}
</style>