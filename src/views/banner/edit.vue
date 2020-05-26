<template>
    <div>
        <el-dialog title="提示" :visible.sync="dialogFlag" width="30%" :before-close="closeAddDialog">
            <el-form label-width="80px" :model="bannerData" :rules="rules" ref="ruleForm">
                <el-form-item label="标题名称" prop="banner_title">
                    <el-input v-model="bannerData.banner_title"></el-input>
                </el-form-item>
                <el-form-item label="链接地址" prop="banner_url">
                    <el-input v-model="bannerData.banner_url"></el-input>
                </el-form-item>
                <el-form-item label="图片地址" prop="banner_image">
                    <el-input v-model="bannerData.banner_image"></el-input>
                </el-form-item>
                <el-form-item label="是否显示" prop="banner_state">
                    <el-tooltip
                        :content="`${bannerData.banner_state==true?'显示':'不显示'}`"
                        placement="top"
                    >
                        <el-switch
                            v-model="bannerData.banner_state"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                        ></el-switch>
                    </el-tooltip>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeAddDialog">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')" :loading="loadflag">修改</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import { apiUrl } from "../../api";
@Component
export default class AddBanner extends Vue {
    @Prop({ type: Boolean, default: false })
    dialogFlag: boolean;
    @Emit("closeAddDialog")
    closeAddDialog() {}
    private loadflag = false;
    @Prop({ type: Object, required: true })
    bannerData: any;
    private rules = {
        banner_url: {
            required: true,
            message: "请输入轮播图地址",
            trigger: "blur"
        },
        banner_title: {
            required: true,
            message: "请输入标题",
            trigger: "blur"
        },
        banner_image: {
            required: true,
            message: "图片地址",
            trigger: "blur"
        }
    };

    submitForm(formName: string) {
        (this.$refs[formName] as any).validate(valid => {
            if (valid) {
                this.loadflag = true;
                (this as any).$axios
                    .post(`${apiUrl.bannerUpdate}`, this.bannerData)
                    .then((res: any) => {
                        if (res.data.code === 0) {
                            this.$message.success("修改成功");
                            this.loadflag = false;
                            this.closeAddDialog();
                            (this.$parent as any).getBannerList();
                        }
                    });
            } else {
                console.log("error submit!!");
                return false;
            }
        });
    }
}
</script>

<style>
</style>