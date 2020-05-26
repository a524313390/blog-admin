<template>
    <div class="silder">
        <el-row class="tac">
            <el-col :span="24">
                <el-menu
                    default-active="2"
                    class="el-menu-vertical-demo"
                    background-color="#304156"
                    text-color="rgb(191, 203, 217)"
                    active-text-color="rgb(64, 158, 255)"
                    router
                    unique-opened
                    mode="vertical"
                    :collapse="menuFlag"
                    :default-active="activeIndex"
                    @select="selectedHandle"
                >
                    <template v-for="(item) in routes" v-if="!item.hidden">
                        <el-submenu
                            :index="item.path"
                            v-if="item.children&&item.children.length>1"
                            :key="item.name"
                        >
                            <template slot="title">
                                <i :class="item.meta.icon"></i>
                                <span>{{item.meta.title}}</span>
                            </template>

                            <el-menu-item
                                v-for="children in item.children"
                                :index="children.path"
                                :key="children.name"
                                v-if="!children.hidden"
                            >{{children.meta.title}}</el-menu-item>
                        </el-submenu>
                        <el-menu-item :index="item.path" v-else :key="item.name">
                            <i :class="item.meta.icon"></i>
                            <span slot="title">{{item.meta.title}}</span>
                        </el-menu-item>
                    </template>
                </el-menu>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Getter } from "vuex-class";
@Component
export default class SilderLeft extends Vue {
    @Getter routes: any;
    @Getter menuFlag: any;
    private isCollapse: boolean = true;
    private activeIndex = "";
    created() {
        this.activeIndex = this.$router.currentRoute.path;
    }
    private selectedHandle(index: any) {
        this.activeIndex = index;
    }
    @Watch("$route")
    changRoute(val, oldval) {
        this.selectedHandle(val.path);
    }
}
</script>

<style scoped lang="scss">
.silder {
    background: #304156;
    width: 100%;
    height: 100%;
    color: rgb(191, 203, 217);
}
.tac,
.el-menu {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.el-col {
    height: 100%;
}
.el-submenu .el-menu-item {
    background-color: #1f2d3d !important;
}
.el-submenu .el-menu-item:hover {
    background-color: #001528 !important;
}
</style>
