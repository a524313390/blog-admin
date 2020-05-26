<template>
  <el-container>
    <el-aside :width="menuWidth">
      <SilderLeft />
    </el-aside>
    <el-container>
      <el-header>
        <TopBar />
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Getter } from "vuex-class";
import TopBar from "./topBar/topBar.vue";
import SilderLeft from "./silderLeft/silderLeft.vue";

@Component({
  components: {
    TopBar,
    SilderLeft
  }
})
export default class Home extends Vue {
  @Getter menuFlag: any;
  get menuWidth() {
    return this.menuFlag ? "64px" : "200px";
  }
}
</script>
<style lang="scss" scoped>
.el-container {
  height: 100vh;
}
.el-header,
.el-footer {
  background-color: #fff;
}

.el-main {
  background-color: #f0f2f5;
}
.el-header {
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  line-height: 60px;
}
.el-aside {
  transition: width ease-in-out 0.5s;
}
</style>
