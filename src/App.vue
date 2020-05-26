<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Action } from "vuex-class";
import { apiUrl } from "./api";
@Component({
    components: {}
})
export default class App extends Vue {
    @Action setUser: any;
    created() {
        var user_token: any = localStorage.getItem("user_token");

        var tokens: {} = JSON.parse(user_token);

        if (tokens) {
            this.setUser(tokens);
            this.getArticleName();
        } else {
            this.$router.push("/login");
        }
    }
    @Action setName: any;
    getArticleName() {
        (this as any).$axios.get(`${apiUrl.getSystem}`).then((res: any) => {
            if (res.data.code == 0) {
                this.setName(res.data.message[0].adminname);
            }
        });
    }
}
</script>

<style lang="scss">
html,
body {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>
