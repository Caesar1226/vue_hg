<template>
  <div class="login">
    <el-form ref="form" label-width="100px" :model="loginForm" :rules="rules">
      <el-form-item label="英雄名" prop="username">
        <el-input v-model="loginForm.username" class="header-search-select" type="input" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="loginForm.password" class="header-search-select" type="password" autocomplete="off" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button style="width: 100%" @click="submit('form')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from '../utils/axios'
import { Message } from 'element-ui'

export default {
  name: 'loginPage',
  data () {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          {required: true, message: '不能为空', trigger: "blur"},
          {min: 5, max: 18, message: '长度在5-18位字符', trigger: "blur"}
        ],
        password: [
          {required: true, message: '不能为空'},
          {min: 5, max: 18, message: '长度在5-18位字符', trigger: "blur"}
        ]
      }
    }
  },
  methods: {
    submit: function(name){
      var self = this;
      this.$refs[name].validate((valid)=>{
        if(valid){
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            fullscreen: true,
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          axios.post("login", {
            uname: this.loginForm.username,
            pwd: this.loginForm.password
          }).then(res => {
            localStorage.setItem('token', res.data.data.token);
            if(res.data.errorCode == '1000'){
              loading.close();
              this.$router.push({path: '/homePage'})
            }
            Message({
              message: this.$t('login.success') + res.data.errorMsg,
              type: "success"
            })
          })
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.login { 
  height: 100%;
  background: url(../assets/imgs/bg.jpg) no-repeat fixed; 
  background-size: cover;
  box-shadow: 10px 10px 5px #fff;
}
/deep/ .el-form-item {
  margin: 32px;     
}
.el-form {
  position: absolute;
  top: 32%;
  left: 5%;
  padding: 40px 20px;
  height: 370px;
  width: 480px;
  color: #ffffff;
  border: #ffffff solid 1px;
  box-shadow: 10px 10px 5px #fff;
}
/deep/ .el-form-item__label {
  color: #ffffff;
  font-family:Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
}

</style>
