<template>
    <div class="system">
        <el-row>
            <el-col :span="10" :offset="5">
                <el-form
                    label-position="left"
                    label-width="200px"
                    :model="ruleForm"
                    status-icon
                    :rules="rules"
                    ref="ruleForm"
                    class="demo-ruleForm"
                >
                    <el-form-item label="站点名称名称:" prop="sitename">
                        <el-input v-model="ruleForm.sitename"></el-input>
                    </el-form-item>
                    <el-form-item label="管理员名称:" prop="adminname">
                        <el-input v-model="ruleForm.adminname"></el-input>
                    </el-form-item>
                    <el-form-item label="站点logo:">
                        <el-popover placement="top-start" width="200" trigger="hover">
                            <el-image
                                style="width: 100px; height: 100px"
                                :src="ruleForm.logourl"
                                fit="cover"
                            ></el-image>
                            <el-input slot="reference" v-model="ruleForm.logourl"></el-input>
                        </el-popover>

                        <UploadImg
                            @recaiveUrl="changeUrl"
                            @removeUrl="removeUrl"
                            :imgurl.sync="ruleForm.logourl"
                        ></UploadImg>
                    </el-form-item>
                    <el-form-item label="网站备案号:">
                        <el-input v-model="ruleForm.record"></el-input>
                    </el-form-item>
                    <el-form-item label="统计代码:">
                        <el-input type="textarea" v-model="ruleForm.code"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts">
import UploadImg from "@/components/uploads/upload.vue";
import { Component, Vue } from "vue-property-decorator";

import { apiUrl } from "../../api";
@Component({
    name: "system",
    components: {
        UploadImg
    }
})
export default class System extends Vue {
    private ruleForm = {
        id: "",
        sitename: "",
        record: "",
        code: "",
        logourl: "",
        adminname: ""
    };
    private rules: any = {
        sitename: [
            { required: true, message: "请输入站点名称", trigger: "blur" },
            {
                min: 2,
                max: 15,
                message: "长度在 2 到 15 个字符",
                trigger: "blur"
            }
        ],
        adminname: [
            { required: true, message: "请输入管理员名称", trigger: "blur" },
            {
                min: 2,
                max: 15,
                message: "长度在 2 到 15 个字符",
                trigger: "blur"
            }
        ]
    };

    created() {
        this.getInfo();
    }
    private getInfo() {
        (this as any).$axios.get(`${apiUrl.getSystem}`).then((res: any) => {
            if (res.data.code == 0) {
                this.ruleForm = res.data.message[0];
            }
        });
    }
    private submitForm(formName: string) {
        (this.$refs[formName] as any).validate((valid: boolean) => {
            if (valid) {
                (this as any).$axios
                    .post(`${apiUrl.addSystem}`, this.ruleForm)
                    .then((res: any) => {
                        console.log(res);
                        if (res.data.code == 0) {
                            this.$message.success("添加成功");
                        }
                    });
            } else {
                console.log("error submit!!");
                return false;
            }
        });
    }
    private resetForm(formName: string) {
        (this.$refs[formName] as any).resetFields();
    }
    changeUrl(img: string) {
        this.ruleForm.logourl = img;
    }
    removeUrl() {
        this.ruleForm.logourl = "";
    }
}
</script>

<style lang="scss">
.system {
    background: #fff;
    margin-top: 20px;
    padding: 50px 0;
}

.el-textarea > .el-textarea__inner {
    resize: none !important;
    height: 150px;
}
</style>
