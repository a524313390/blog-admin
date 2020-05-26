<template>
    <div>
        <mavon-editor v-model="value" ref="md" :ishljs="true" @imgAdd="imgAdd" @change="changVal" />
    </div>
</template>

<script lang="ts">
import { config } from "@/config";
import { Component, Vue, Emit, Watch, Prop } from "vue-property-decorator";
import { apiUrl } from "../../../api";
console.log(config.serverPath);
@Component({
    name: "markdown"
})
export default class MarkDown extends Vue {
    @Prop({
        type: String,
        default: ""
    })
    markData: string;
    created() {
        if (this.markData !== "") {
            this.value = this.markData;
        }
    }
    private value = "";
    @Emit("changValue")
    changValue(text: string) {
        return text;
    }
    @Emit("changMark")
    changMark(text: string) {
        return text;
    }
    private imgAdd(pos, $file) {
        var formdata = new FormData();
        formdata.append("file", $file);
        let configs = {
            headers: { "Content-Type": "multipart/form-data" }
        };
        (this as any).$axios
            .post(`${apiUrl.uploadImg}`, formdata, configs)
            .then((res: any) => {
                console.log(res);
                if (res.data.code == 0) {
                    console.log(config.serverPath);
                    let url = config.serverPath + res.data.message;
                    console.log(url);
                    (this.$refs.md as any).$img2Url(pos, url);
                } else {
                    this.$message.error("服务器出错，请稍后再试");
                }
            });
    }

    private changVal(val, render) {
        this.changValue(render);
        this.changMark(val);
    }
}
</script>

<style></style>
