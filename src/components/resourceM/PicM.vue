<template>
  <div class="picM">
    <el-button
      type="primary"
      @click="upLoadImage"
      plain
      icon="el-icon-upload"
      size="small"
      :style="{'margin-left':'20px'}"
    >上传图片</el-button>
    <image-upLoad></image-upLoad>
  </div>
</template>

<script>
import { eventBus } from "@/components/common/eventBus";
import imageUpLoad from "./imageUpLoad";
export default {
  name: 'picM',
  components: {
    imageUpLoad
  },
  data () {
    return {
      msg: 'PicM Page'
    }
  },
  methods: {
    upLoadImage() {
      eventBus.$emit("showUpLoad");
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>