<template>
  <div>
      <el-dialog
        width="50vw"
        v-dialogDrag
        ref="dialog__wrapper"
        :visible.sync="dialogFormVisible"
        :title="this.form.id?'编辑':'新增'"
      >
        <el-form ref='form' :data="form">
            <el-form-item 
                v-if="form.menuType!==1"
                label="上级菜单"
                :label-width="formLabelWidth"
                :style="{'text-align':'center','width':'60%'}">
                <div class="block">
                    <el-cascader
                        :options="datas"
                        :props="defaultProps"
                        v-model="form.parentId"
                        :show-all-levels="false"
                        clearable
                    ></el-cascader>
                </div>
            </el-form-item> 
            <el-form-item label="菜单类型" :label-width="formLabelWidth">
                <el-radio-group v-model="form.menuType">
                    <el-radio :label="1">目录</el-radio>
                    <el-radio :label="2">菜单</el-radio>
                    <el-radio :label="3">按钮</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="菜单名称" :label-width="formLabelWidth">
                <el-input v-model="form.menuName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="请求地址" :label-width="formLabelWidth" v-if="form.menuType==2">
                <el-input v-model="form.url" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item v-if="form.menuType!==1" label="权限标识" :label-width="formLabelWidth">
                <el-input v-model="form.perms" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="显示排序" :label-width="formLabelWidth">
                <el-input v-model="form.orderNum" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item v-if="form.menuType==1" label="图标" :label-width="formLabelWidth">
                <el-popover placement="right" width="350" trigger="hover"> 
                    <el-button 
                        :icon="form.icon"
                        size="medium"
                        slot="reference"
                        type="info"
                        circle
                    ></el-button>
                    <transition name="fade-transform" mode="out-in">
                        <icon-choice></icon-choice>
                    </transition>
                </el-popover>
            </el-form-item>
        </el-form>
      </el-dialog>
  </div>
</template>

<script>
import { eventBus } from '../../common/eventBus'
import iconChoice from '../../widget/IconChoiceWidget'
export default {
    components: {
        iconChoice
    },
    data(){
        return {
            dialogFormVisible: false,
            formLabelWidth: "120px",
            form: {
                menuId: "",
                menuName: "",
                parentId: "",
                url: "",
                menuType: 1,
                orderNum: "",
                visible: false,
                perms: "",
                icon: "el-icon-circle-plus-outline",
                remark: ""
            },
            datas: [],
            defaultProps: {
                children: "children",
                label: "menuName",
                value: "id",
                checkStrictly: true,
                expandTrigger: "hover",
                emitPath: false
            }
        }
    },
    created(){
        eventBus.$on('addMenu', ()=>{
            this.addMenu()
        })
        eventBus.$on("selIcon", v => {
            this.form.icon = v;
        });
    },
    methods: {
        selIcon(){

        },
        //获取上级菜单
        parseJson() {
            this.$store.dispatch("axios_load_navbar").then(res => {
                this.datas = res.data.data.menus;
            });
        },
        addMenu: function(){
            this.form.menuId ="";
            this.form.menuName = "";
            this.form.parentId = "";
            this.form.orderNum = "";
            this.form.url = "";
            this.form.menuType = 1;
            this.form.visible = false;
            this.form.perms = "";
            this.form.icon = "el-icon-circle-plus-outline";
            this.form.remark = "";
            this.dialogFormVisible = true;
        }
    }
}
</script>

<style scoped lang="scss">
.el-input {
  width: 80%;
}
</style>