<template>
  <div>
    <el-dialog
      v-dialogDrag
      ref="dialog__wrapper"
      title="图片上传"
      width="500px"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form" :rules="rules" ref="arg">
        <el-form-item
          label="图片分类"
          prop="arg.levelId"
          :label-width="formLabelWidth"
        >
          <el-select v-model="form.arg.levelId" placeholder="请选择">
            <el-option
              v-for="item in Imagestypes"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="图片名称"
          prop="arg.picCname"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.arg.picCname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="选择图片"
          prop="fileList"
          :label-width="formLabelWidth"
        >
          <el-upload
            :auto-upload="false"
            action
            :on-change="addPic"
            :file-list="form.fileList"
            list-type="picture"
            ref="upload"
            show-file-list
            multiple
          >
            <el-button plain icon="el-icon-upload" size="small" type="primary"
              >点击上传</el-button
            >
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          :loading="saveing"
          icon="el-icon-upload2"
          @click="submitUpload('arg')"
          >Save</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { eventBus } from "@/components/common/eventBus";
export default {
  data() {
    return {
      curLength: 0,
      multiple: true,
      formDate: "",
      dialogFormVisible: false,
      formLabelWidth: "120px",
      dis: false,
      imagesBaseUrl: window.configs.axios_BASEURL,
      head: {
        "x-a-t": localStorage.getItem("token")
      },
      saveing: false,
      form: {
        arg: {
          levelId: "",
          picCname: ""
        },
        fileList: []
      },
      Imagestypes: [
        {
          id: "1",
          title: "首页"
        },
        {
          id: "2",
          title: "分类"
        },
        {
          id: "3",
          title: "详情"
        },
        {
          id: "4",
          title: "活动"
        },
        {
          id: "5",
          title: "专题"
        },
        {
          id: "6",
          title: "其他"
        }
      ],
      rules: {
        levelId: [
          { required: true, message: "请选择图片分类", trigger: "change" }
        ],
        fileList: [{ required: true, message: "请选择图片", trigger: "change" }]
      },
      value: ""
    };
  },
  methods: {
    submitUpload(formName) {
      //校验表单
      this.$refs[formName].validate(valid => {
        if (valid) {
          let config = {
            headers: {
              "Content-Type": "multipart/form-data",
              ...this.head
            }
          };
          let formData = new FormData();
          this.form.fileList.forEach(function(value, i) {
            //[file]为后台接口定义中的文件字段，根据后台接口自行
            //ready表示选择了还未上传的图片
            if ("ready" == value.status) {
              formData.append("file", value.raw);
            }
          });
          //补充额外参数
          for (let key in this.form.arg) {
            formData.append(key, this.form.arg[key]);
          }
          this.saveing = true;
          //发起请求
          console.log(formData, 'formData')
          this.axios
            .post(
              this.imagesBaseUrl + "/sysadmin/content/image/add",
              formData,
              config
            )
            .then(response => {
              console.log("图片上传" + response.data.errorCode);
              this.saveing = false;
              if (response.data.errorCode == "1000") {
                this.$message.success("上传成功！");
                eventBus.$emit("refreshImageList", this.form.arg.levelId);
                this.dialogFormVisible = false;
              } else if (response.data.errorCode == "1019") {
                this.$message.warning("资源已存在！");
              } else {
                this.$message.error("上传失败！");
              }
            })
            .catch(error => {
              this.saveing = false;
              console.log(error);
            });
        } else {
          return false;
        }
      });
    },
    addPic(file, fileList) {
      this.dis = true;
      this.curLength = fileList.length;
      this.form.fileList = fileList;
    },
    showUpLoad() {
      this.dialogFormVisible = true;
      this.dis = false;
      this.form = {
        arg: {
          levelId: "",
          picCname: ""
        },
        fileList: []
      };
    }
  },
  mounted() {
    eventBus.$on("showUpLoad", () => {
      this.showUpLoad();
    });
  },
  beforeDestroy() {
    eventBus.$off("showUpLoad");
  }
};
</script>

<style></style>
