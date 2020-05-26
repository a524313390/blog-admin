<template>
    <div class="artcleAdd">
        <el-row>
            <el-col :span="18" :offset="3">
                <el-form ref="ruleForm" :rules="rules" :model="ruleForm" label-width="80px">
                    <el-form-item label="文章标题" prop="title">
                        <el-input v-model="ruleForm.title"></el-input>
                    </el-form-item>
                    <el-form-item label="属性">
                        <el-checkbox-group v-model="ruleForm.top">
                            <el-checkbox label="是否置顶" name="top"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="选择栏目" prop="category_id">
                        <el-select v-model="ruleForm.category_id" placeholder="请选择栏目">
                            <el-option
                                :label="category.tag_name"
                                v-for="category in categoryList"
                                :key="category.tag_name"
                                :value="category.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="发表时间" prop="createdAt">
                        <el-col :span="11">
                            <el-date-picker
                                v-model="ruleForm.createdAt"
                                type="date"
                                placeholder="选择日期"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                            ></el-date-picker>
                            <!-- <el-date-picker
                                type="date"
                                placeholder="选择日期"
                                v-model="ruleForm.createdAt"
                                style="width: 100%;"
                            ></el-date-picker>-->
                        </el-col>
                        <el-col class="line" :span="2">-</el-col>
                    </el-form-item>

                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="点击量" prop="count">
                                <el-input v-model="ruleForm.count"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="作者昵称" prop="article_author">
                                <el-input v-model="ruleForm.article_author"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="缩略图" prop="thumb_url">
                        <el-popover placement="top-start" width="200" trigger="hover">
                            <el-image
                                style="width: 100px; height: 100px"
                                :src="ruleForm.thumb_url"
                                fit="cover"
                            ></el-image>
                            <el-input slot="reference" v-model="ruleForm.thumb_url"></el-input>
                        </el-popover>

                        <Uploads @recaiveUrl="changeUrl" @removeUrl="removeUrl"></Uploads>
                    </el-form-item>

                    <el-form-item label="关键词" prop="keyword">
                        <el-input v-model="ruleForm.keyword"></el-input>
                    </el-form-item>

                    <el-form-item label="内容摘要" prop="desc">
                        <el-input type="textarea" v-model="ruleForm.desc"></el-input>
                    </el-form-item>
                    <el-form-item label="内容" prop="content">
                        <MarkDown
                            @changValue="changValue"
                            @changMark="changMark"
                            :markData="ruleForm.content_mark"
                        ></MarkDown>
                        <el-input type="textarea" v-model="ruleForm.content"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import MarkDown from "./components/markDown.vue";
import { apiUrl } from "../../api";
import Uploads from "@/components/uploads/upload.vue";
@Component({
    name: "articleAdd",
    components: {
        MarkDown,
        Uploads
    }
})
export default class ArticleAdd extends Vue {
    private categoryList = [];
    created() {
        let articleData = this.$route.params.articleData;
        if (articleData) {
            (this as any).ruleForm = articleData;
        } else {
            this.$router.push("/article/list");
        }

        (this as any).$axios.get(`${apiUrl.tagList}`).then((res: any) => {
            if (res.data.code === 0) {
                this.categoryList = res.data.message;
                console.log(res);
            }
        });
    }
    private ruleForm = {
        title: "",
        top: "",
        category_id: "",
        keyword: "",
        thumb_url: "",
        type: [],
        content: "",
        desc: "",
        article_author: "",
        createdAt: "",
        count: 0,
        content_mark: ""
    };
    @Watch("ruleForm.content")
    changDesc(val) {
        console.log(val);
        this.ruleForm.desc = val
            .toString()
            .replace(/<.*?>/gi, "")
            .replace(/[\r\n]/g, "")
            .substring(0, 200);
    }
    private rules = {
        title: [
            { required: true, message: "请输入标题", trigger: "blur" },
            {
                min: 3,
                max: 50,
                message: "长度在 3 到 50 个字符",
                trigger: "blur"
            }
        ],
        count: [
            {
                type: "number",
                required: true,
                message: "请输入数字",
                trigger: "blur"
            }
        ],

        category_id: [
            {
                required: true,
                message: "请选择一个栏目",
                trigger: "change"
            }
        ],
        content: [{ required: true, message: "请输入内容", trigger: "change" }]
    };
    private changValue(text: string) {
        this.ruleForm.content = text;
    }
    private changMark(text: string) {
        this.ruleForm.content_mark = text;
    }
    private submitForm(formName: string) {
        var that = this;
        (this.$refs[formName] as any).validate((valid: boolean) => {
            if (valid) {
                console.log(this.ruleForm);
                (this as any).$axios
                    .post(`${apiUrl.articleUpdate}`, this.ruleForm)
                    .then((res: any) => {
                        if (res.data.code == 0) {
                            this.$message.success("更新成功");
                            (that.$router as any)
                                .push("/article/list")(this as any)
                                .resetForm();
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
    private changeUrl(img: string) {
        this.ruleForm.thumb_url = img;
    }
    private removeUrl() {
        this.ruleForm.thumb_url = "";
    }
}
</script>

<style scoped lang="scss">
.artcleAdd {
    background: #fff;
    margin-top: 20px;
    padding: 50px 0;
}
.el-select {
    width: 100%;
}
</style>
