<template>
  <div class="master_tabs">
    <div class="tab_page">
      <el-tabs 
        closable
        @tab-click="tabChange"
        @tab-remove="removeTab"
        v-model="editableTabsValue">
        <el-tab-pane 
          v-for="item in editableTabs" 
          :key="item.name" 
          :label="item.title" 
          :name="item.name"
          :contented="item.content"
          :menuId="item.menuId"
          >
        </el-tab-pane>
      </el-tabs>
      <transition name="fade-transform" mode="out-in">
        
        <keep-alive :include="cachedViews" >
          <img src="../assets/imgs/bj.jpg" class="bgImg"  :style="{'margin': '0 0 50px 260px'}">
          <router-view></router-view>
          
        </keep-alive>
      </transition>
      
    </div>
  </div>
</template>

<script>
import {eventBus} from './common/eventBus'

export default {
  name: 'master',
  data () {
    return {
      msg: 'Master Page',
      editableTabs: [],              // Tabs标签数据
      already: false,                // 标签是否打开开关
      tabIndex: 0,                   // 唯一标识
      editableTabsValue: "",         // 当前页面name
      menuId: "menuId",                    // 当前页面对应menuId
      tabView: "",                   // 当前页面对应url
      indexObj: {},                  // 当前打开页面集合 路由: editableTabsValue(当前页面name)
      isShow: false
    }
  },
  mounted(){
    eventBus.$on('addTab', v => {
      this.addTab(v)
    })
  },
  destroyed(){
    eventBus.$off(['addTab'])
  },
  provide(){
    return {
      getMenuId: ()=>{
        return this.menuId
      }
    }
  },
  watch: {
    editableTabs: function(){
      if(this.editableTabs.length > 0){
        this.isShow = true
      }else {
        this.isShow = false
      }
    },
    '$route': function(){
      if (this.$route.meta.cache) {
        this.$store.commit("add_cached_view", this.$route.name)
      }
    }
  },
  computed: {
    cachedViews(){
      return this.$store.state.cachedViews
    }
  },
  methods: {
    addTab(menuItem){
      this.editableTabs.forEach(item => {
        if(item.menuId == menuItem.menuId){
          this.already = true
        }
      })
      if(!this.already){
        let newTabName = ++this.tabIndex + ""
        menuItem.name = newTabName
        this.editableTabs.push(menuItem)
        this.editableTabsValue = menuItem.name
        this.tabView = menuItem.content;
        this.menuId = menuItem.menuId;
        this.indexObj[menuItem.content] = newTabName;
      }else {
        this.editableTabsValue = this.indexObj[menuItem.content]
        this.tabView = menuItem.content;
        this.menuId = menuItem.menuId;
        this.already = false
      }
      this.$router.push(menuItem.content)
    },
    tabChange(tab){
      this.tabView = tab.$attrs.contented;
      //console.log(tab.$attrs,9897)
      this.menuId=tab.$attrs.menuId;
      this.$router.push(this.tabView);
    },
    removeTab(targetName){
      //console.log(targetName)
      let tabs = this.editableTabs;
      if (this.editableTabsValue === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              this.tabView = nextTab.content;
              this.menuId = nextTab.menuId;
              this.editableTabsValue = nextTab.name;
              this.editableTabs = this.editableTabs.filter(v=>v.name != targetName)
              console.log(this.tabView)
              this.$router.push(this.tabView)
            }else {
              this.tabView = "masterPage"
              this.$router.push(this.tabView)
            }
          }
        });
      }  
      
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.bgImg {
  height: 80vh;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>