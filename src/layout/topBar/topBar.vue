<template>
  <div class="top">
    <el-row>
      <el-col :span="1">
        <span class="menu">
          <i :class="menuStyle" @click="menuHandle"></i>
        </span>
      </el-col>
      <el-col :span="15">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>

          <el-breadcrumb-item
            v-for="routers in routesArr"
            :to="routers.path"
            :key="routers.path"
            >{{ routers.meta.title }}</el-breadcrumb-item
          >
        </el-breadcrumb>
      </el-col>
      <el-col class="avatar" :span="8">
        <div class="grid-content bg-purple">
          <el-dropdown split-button @command="logoutHandle">
            用户名:{{ user.username }}
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout">退出登陆</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
@Component
export default class Topbar extends Vue {
  @Getter user: any;
  @Getter menuFlag: any;
  @Action setMenu: any;
  private routesArr: Array<any> = [];
  get menuStyle(): string {
    return this.menuFlag ? "el-icon-s-unfold" : "el-icon-s-fold";
  }
  @Watch("$route", { immediate: true, deep: true })
  routeWatch() {
    let routes = this.$route.matched.filter((item: any) => {
      return item.path !== "";
    });
    this.routesArr = routes;
    console.log(this.routesArr);
  }

  private dropFlag: boolean = false;
  logoutHandle(command: string): void {
    if (command === "logout") {
      this.$confirm("是否退出登陆", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        localStorage.removeItem("user_token");
        localStorage.removeItem("token");
        this.$router.push("/login");
      });
    }
  }

  menuHandle(): void {
    if (this.menuFlag) {
      this.setMenu(false);
    } else {
      this.setMenu(true);
    }

    // this.setMenu(flag)
  }
}
</script>

<style scoped lang="scss">
.el-icon-s-fold,
.el-icon-s-unfold {
  font-size: 20px;
}
.el-breadcrumb {
  display: inline-block;
}
.avatar {
  text-align: right;
}
.menu {
  cursor: pointer;
}
</style>
