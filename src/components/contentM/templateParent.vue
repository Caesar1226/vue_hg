<template>
  <div>
    <transition name="fade-transform" mode="out-in">
      <component :is="currentTabComponent"></component>
    </transition>
  </div>
</template>

<script>
import templateList from './templateList'
import createFrame from "./createFrame"
import {eventBus} from '../common/eventBus'
export default {
  name: 'templateParent',
  inject: ["getMenuId"],
  components: {
    templateList,
    createFrame
  },
  data(){
    return {
      loading: true,
      currentTabComponent: "templateList",
      actionType: {
        contentId: "",
        action: ""
      },
      curimg:
        "https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/home/img/qrcode/zbios_efde696.png",
      imgData: [],
      tabView: "",
      currentTabComponent: "templateList",
      editableTabsValue: "0",
      editableTabs: [],
      tabIndex: 0,
      already: false,
      menuId: this.getMenuId(),
      testD: "1"
    }
  },
  created(){
    eventBus.$on('createFrame',()=>{
      this.actionType.action = "new";
      this.currentTabComponent = "createFrame";
    })
    eventBus.$on('templateList',()=>{
      this.currentTabComponent = "templateList"
    })
    eventBus.$on('editFrame', v=>{
      this.actionType.action = "edit";
      this.actionType.contentId = v;
      this.currentTabComponent = "createFrame";
    })
  },
  provide(){
    return {
      getContentId: () => {
        return this.actionType;
      }
    }
  },
  methods: {
    createFrame(){

    }
  }
}
</script>

<style>

</style>