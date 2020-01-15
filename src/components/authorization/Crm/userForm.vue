<template>
  <div>
      <el-dialog 
        v-dialogDrag
        :title="this.formData.id ? '编辑':'新增'" 
        :visible.sync="dialogFormVisible"
      >
        <el-form ref="form" :model="formData" :rules="rules"><!-- validate="rules" -->
            <el-form-item label="昵称" :label-width="formLabelWidth">
                <el-input v-model="formData.nick" auto-complete="off" size="medium "></el-input>
            </el-form-item>
            <el-form-item label="账号" prop="uname" :label-width="formLabelWidth">
                <el-input v-model="formData.uname" auto-complete="off" size="medium "></el-input>
            </el-form-item>
            <el-form-item v-if="!formData.id" label="密码" prop="pwd" :label-width="formLabelWidth">
                <el-input v-model="formData.pwd" prop="pwd" auto-complete="off" size="medium "></el-input>
            </el-form-item>
            <el-form-item label="角色" :label-width="formLabelWidth">
                <el-select v-model="formData.roleId" placeholder="请选择" size="medium ">
                    <el-option v-for="item in roleData" :key="item.id" :label="item.rname" :value="item.id"></el-option>
                </el-select>
            </el-form-item>    
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="onSubmit('form')">确 定</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import { eventBus } from '@/components/common/eventBus'

export default {
    name: "userForm",
    inject: ['getMenuId'],
    data(){
        const validatorEname = (rule, value, callback) => {
            if(this.editCurUname == this.formData.uname){
                callback()
            }else {
                this.$store.dispatch('axios_check_user', {uname: value}).then(res=>{
                    if(res.data.data.isExisted){
                        callback(new Error('已存在'))
                    }else {
                        callback()
                    }
                })
            }
        }
        return {
            menuId: this.getMenuId(),
            dialogFormVisible: false,
            editCurUname: "",
            formData: {
                nick: "",
                uname: "",
                pwd: "",
                roleId: "",
                id: ""
            },
            formLabelWidth: "120px",     // 表单条目宽度
            rules: {
                uname: [
                    {required: true, message: "非空", trigger: 'blur'},
                    {validator: validatorEname, trigger: 'blur'}
                ],
                pwd: [
                    {required: true, message: "非空", trigger: 'blur'}
                ]
            },
            roleData: [{ id: "", rname: "" }]
        }
    },
    created() {
        this.getRole()
        eventBus.$on('addUser', ()=> {
   
            this.addUser()
        })
        eventBus.$on('editUser', (data)=> {
       
            this.editUser(data)
        })
    },
    methods: {
        getRole() {
            this.$store.dispatch("axios_get_role", {menuId: this.menuId}).then(res => {
                this.roleData = res.data.data.list.records;
            });
        },
        addUser(){
            this.formData.id = ''
            this.formData.nick = ''
            this.formData.uname = ''
            this.formData.pwd = ''
            this.formData.roleId = ''
            this.dialogFormVisible = true
        },
        editUser(v){
            this.dialogFormVisible = true
            this.formData.id = v.id
            this.formData.nick = v.nick
            this.formData.uname = v.uname
            this.formData.pwd = v.pwd
            this.formData.roleId = v.roleId
            this.editCurUname = v.uname
        },
        onSubmit(formName) {
            this.$refs[formName].validate((valid)=>{
                if(valid){
                    let url;
                    this.formData.id ? (url = "axios_edit_user") : (url = "axios_add_user")
                    this.$store.dispatch(url,{
                        id: this.formData.id || undefined,
                        nick: this.formData.nick,
                        uname: this.formData.uname,
                        pwd: this.formData.pwd || undefined,
                        roleId: this.formData.roleId
                    }).then((res)=>{
                        if(res.data.errorCode == '1000'){
                            this.$message.success(this.$t("operation.success"))
                            eventBus.$emit("refreshUser")
                        }else {
                            this.$message.error(this.$t("operation.fail"))
                        }
                    })
                    this.dialogFormVisible = false;
                }else {
                    return false
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.el-input {
  width: 80%;
}
.dialog-footer {
    text-align: center;
}
</style>