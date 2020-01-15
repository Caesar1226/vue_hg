<template>
  <div class="aside-container">
      <el-scrollbar>
        <div class="aside-container_body">
          <el-menu 
            class="el-menu-vertical-demo"
            :collapse = "isCollapse" 
            background-color="#E9F2FF"
            text-color="#000000"
            active-text-color="#409EFF">
            <el-submenu :key="v.id" :index="v.id+''"  v-for="v in menuData"> 
              <template slot="title">
                <i :class="v.icon"></i>
                <span>{{v.menuName}}</span>
              </template>
              <el-menu-item :key="d.id" :index="d.id+''"  v-for="d in v.children" @click="addTab(d)">
                {{d.menuName}}
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
      </el-scrollbar>
  </div>
</template>

<script>
import {eventBus} from '../common/eventBus'

export default {
  data(){
    return {
      isCollapse: false,
      menuData: []
    }
  },
  created(){
    this.initNav()
  },
  methods: {
    initNav(){
      this.$store.dispatch("axios_load_navbar").then(res => {
        this.menuData = this.filterMenu(res.data.data.menus)
        sessionStorage.setItem("permissions",res.data.data.perms.join());
      }).catch(err => {
        
      })
    },
    addTab(menuItem){
      let actionName = menuItem.url.split("/");
      //console.log(actionName, 23333)
      eventBus.$emit("addTab", {
        title: menuItem.menuName,
        menuId: menuItem.id,
        content: actionName[actionName.length - 1]
      })
    },
    filterMenu(fdata){
      return fdata.filter(item=>item.visible==0).map(item=>{
        if(item.children){
          this.filterMenu(item.children)
        }
        return item
      })
    }
  }
}
</script>

<style scoped lang="scss">
.aside-container {
  height: 85vh;
}
.aside-container_body {
  height: 85vh;
  background-color: #E9F2FF;
}
.el-menu-vertical-demo {
  width: 210px;
}
/deep/ .el-menu {
  border: none
}
</style>