<template>
  <div>
      <el-dialog 
        width="35vw"
        v-dialogDrag
        ref="dialog__wrapper"
        :visible.sync="dialogFormVisible"
        :title="this.form.id?'编辑':'新增'"
      >
        <el-form ref="form" :model="form" :rules="rules">
            <el-form-item label="角色名" prop="rname" :label-width="formLabelWidth">
                <el-input v-model="form.rname" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色权限" :label-width="formLabelWidth">
                <el-input v-model="form.rval" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="描述" :label-width="formLabelWidth">
                <el-input v-model="form.rdesc" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="菜单权限" :label-width="formLabelWidth">
                <el-tree
                    :data="menuData"
                    :props="defaultProps"
                    accordion
                    show-checkbox
                    ref="tree"
                    node-key="id"
                    
                >
                </el-tree>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="onSubmit('form')">确 定</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import {eventBus} from '../../common/eventBus'

export default {
    data(){
        const validatorRname = (rule, value, callback)=>{
             // 编辑状态，不校验
             if(this.form.id && this.editCurRname == this.form.rname){
                callback()
             }else {
                 this.$store.dispatch('axios_check_rolename', {
                     rname: value
                 }).then(res=>{
                     if(res.data.data.isExisted){
                         callback(new Error('已存在'))
                     }else {
                         callback()
                     }
                 })
             }
        };
        return {
            dialogFormVisible: false,
            formLabelWidth: "120px",
            form: {
                //初始化表单数据
                id: "",
                rname: "",
                rdesc: "",
                rval: "",
                menuIds: []
            },
            rules: {
                rname: [
                    {required: true, message: "非空", trigger: 'blur'},
                    {validator: validatorRname, trigger: 'blur'}
                ]
            },
            menuData: [],
            defaultProps: {
                children: 'children',
                label: 'menuName'
            },
            editCurRname: ''
        }
    },
    created:function(){
        this.getMenuId()
        eventBus.$on("addRole", () => {
            this.addRole();
        });
        eventBus.$on("editRole", role => {
            this.editRole(role)
        });
    },
    //  销毁EventBug事件中转
    beforeDestroy() {
        eventBus.$off(["editRole", "addRole"]);
    },
    methods: {
        onSubmit: function(name){
            this.$refs[name].validate((valid)=>{
                if(valid){
                    let checkey = this.$refs['tree'].getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
                    let actionUrl;
                    this.form.id ? (actionUrl = "axios_edit_role") : (actionUrl = "axios_add_role");    
                    this.$store.dispatch(actionUrl, {
                        id: this.form.id || undefined,
                        rname: this.form.rname,
                        rdesc: this.form.rdesc,
                        rval: this.form.rval,
                        menuIds: checkey
                    }).then(res=>{
                        if(res.data.errorCode == "1000"){
                            this.$message.success("操作成功");
                            eventBus.$emit("refreshRole")
                        }else {
                            this.$message.error('操作失败')
                        }
                    }).catch(err=>{
                        this.$message.error('操作失败')
                    })
                    this.dialogFormVisible = false;
                }else {
                    return false;
                }
            })
        },
        getMenuId: function(){
            this.$store.dispatch('axios_get_menu').then(res=>{
                this.menuData = res.data.data.list
            }).catch(err=>{

            })
        },
        addRole: function(){
            var _this = this
            this.form.id = "";
            this.form.rname = "";
            this.form.rdesc = "";
            this.form.rval = "";
            this.editCurRname = "";
            this.dialogFormVisible = true;
            this.$nextTick(()=>{
                this.$refs.tree.setCheckedKeys([]);
            })
        },
        editRole: function(v){
            var _this = this
            this.form.id = v.id;
            this.form.rname = v.rname;
            this.form.rdesc = v.rdesc;
            this.form.rval = v.rval;
            this.editCurRname = v.rname;
            this.dialogFormVisible = true;
            this.$nextTick(function (){
                _this.$refs.tree.setCheckedKeys(v.menuIds)
            })
        }
    }
}
</script>

<style scoped>
.el-input {
  width: 80%;
}
</style>