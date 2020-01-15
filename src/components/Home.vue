<template>
  <div class="home">
    <el-container>
      <el-header :style="{'height': '60px', 'background': '#3960A5'}">
        <hearderBar/>
      </el-header>
      <el-container>
        <el-aside :style="{'width': 'auto'}">
          <navBar/>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import hearderBar from './home/headerBar'
import navBar from './home/navBar'

export default {
  name: 'home',
  components: {
    hearderBar,
    navBar
  },
  data () {
    return {
      msg: 'Home Page'
    }
  },
  created(){
    this.$router.push('/masterPage')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>