<template>
  <div class="header-container">
    <img class="header-logo" src="../../assets/imgs/logo.jpg"/>
    <div class="right-menu">
      <div class="userName">{{'当前登录: ' + userName}}</div>
      <el-dropdown class="avatar-container" trigger="click">
        <span class="el-dropdown-link" :style="{'outline': 'none'}">
          <img class="user-avatar" src="../../assets/imgs/avatar.png"/>
          <i class="el-icon-caret-bottom" />
        </span>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>主 页</el-dropdown-item>
          </router-link>
          <el-dropdown-item>
            <span>修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span>注 销</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import store from '../../store/index'
export default {
  data(){
    return {
      nickName: "",
      userName: ""
    }
  },
  created(){
    this.getUserInfo();
  },
  methods: {
    getUserInfo(){
      this.$store.dispatch('axios_get_userInfo').then(res=>{
        this.nickName = res.data.data.uname;
        this.userName = res.data.data.nick;
      }).catch(err=>{
        console.log(err,222)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-header {
  height: 50px;
}
.header-container {
  display: flex;
  justify-content: space-between;
  width: auto;
  height: 50px;
  font-size: 24px;
  color: #fff;
}
.header-logo {
  height: 50px;
  margin: 5px 0 0 5px;
}
.user-avatar {
  height: 50px;
  width: 50px;
}
.right-menu {
  display: flex;
  margin: 5px 5px 0 0;
  height: 100%;
  font-size: 12px;
}
.userName {
  height: 50px;
  line-height: 88px;
  margin-right: 5px;
}
</style>