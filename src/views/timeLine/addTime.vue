<template>
    <div>
        <el-dialog
            title="添加数据"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="closeDiaLog"
        >
            <el-form :rules="rules" ref="ruleForm" label-width="80px" :model="ruleForm">
                <el-form-item label="内容" prop="say_content">
                    <Markdowns @setValue="setValue" ref="marks" @steMark="steMark"></Markdowns>
                    <el-input type="textarea" v-model="ruleForm.say_content"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDiaLog">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import { apiUrl } from "../../api";
import Markdowns from "../../components/markdown/markdown.vue";
@Component({
    name: "addTime",
    components: {
        Markdowns
    }
})
export default class AddTime extends Vue {
    @Prop({
        type: Boolean,
        default: false
    })
    dialogVisible: any;
    @Emit("closeDiaLog")
    closeDiaLog() {}
    @Emit("getSayList")
    getSayList() {}
    private ruleForm = {
        say_content: "",
        say_content_mark: ""
    };
    private setValue(value: string) {
        this.ruleForm.say_content_mark = value;
    }
    private steMark(render: string) {
        this.ruleForm.say_content = render;
    }
    private rules = {
        say_content: [
            { required: true, message: "请输入内容", trigger: "blur" },
            {
                min: 3,
                max: 200,
                message: "长度在 3到 200 个字符",
                trigger: "blur"
            }
        ]
    };

    private submitForm(formName: string) {
        console.log();
        (this.$refs[formName] as any).validate((valid: boolean) => {
            if (valid) {
                (this as any).$axios
                    .post(`${apiUrl.sayAdd}`, this.ruleForm)
                    .then((res: any) => {
                        if (res.data.code === 0) {
                            this.$message.success("添加成功");
                            (this.$refs.marks as any).emptyValue();
                            this.closeDiaLog();
                            this.getSayList();
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