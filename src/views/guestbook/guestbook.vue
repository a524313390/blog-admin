<template>
    <div class="gutsbook">
        <el-row v-if="editFlag">
            <!-- <el-button type="primary">主要按钮</el-button>
            <el-button type="success">成功按钮</el-button>
            <el-button type="info">信息按钮</el-button>-->
            <el-button type="warning" @click="tong">批量通过</el-button>
            <el-button type="danger" @click="removeAll">批量删除</el-button>
        </el-row>
        <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            border
            @selection-change="handleSelectionChange"
        >
            <el-table-column align="center" type="selection" width="55"></el-table-column>
            <el-table-column align="center" prop="id" label="ID" width="55"></el-table-column>
            <el-table-column align="center" prop="avatar_name" label="发布人" width="100"></el-table-column>
            <el-table-column align="center" label="邮箱" width="150" prop="email'">
                <template slot-scope="scope">{{ scope.row.email ?scope.row.email:'无'}}</template>
            </el-table-column>
            <el-table-column align="center" label="网址" width="150">
                <template slot-scope="scope">{{ scope.row.url?scope.row.url:'无'}}</template>
            </el-table-column>
            <el-table-column align="center" prop="message_content" label="评论内容" width="200"></el-table-column>
            <el-table-column align="center" prop="article_content.title" label="原文标题" width="200"></el-table-column>
            <el-table-column align="center" label="日期" width="200">
                <template
                    slot-scope="scope"
                >{{ scope.row.updatedAt |dateformat('YYYY-MM-DD HH:MM:ss') }}</template>
            </el-table-column>
            <el-table-column align="center" prop="state" label="状态" width="120">
                <template slot-scope="scope">
                    <el-button type="success" size="mini" disabled v-if="scope.row.state" plain>通过审核</el-button>
                    <el-button
                        type="warning"
                        size="mini"
                        v-else
                        plain
                        @click="changeState( scope.row.id)"
                    >未通过审核</el-button>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="reply" label="管理员回复内容" width="120">
                <template slot-scope="scope">{{ scope.row.reply?scope.row.reply:'无'}}</template>
            </el-table-column>
            <el-table-column align="center" label="操作" v-if="editFlag">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">回复</el-button>
                    <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)"
                    >删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <Pagination
                :count="count"
                :page="page"
                :pageSize="pageSize"
                @setPage="setPage"
                @setPageSize="setPageSize"
            ></Pagination>
        </div>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="100px"
                class="demo-ruleForm"
            >
                <el-form-item label="回复内容" prop="reply">
                    <el-input type="textarea" v-model="ruleForm.reply"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import Pagination from "../../components/pagination/pagination.vue";
import { apiUrl } from "../../api";
import { EditAuth } from "../../mixins";
@Component({
    name: "gutsbook",
    components: {
        Pagination
    }
})
export default class TimeLine extends EditAuth {
    private page = 1;
    private pageSize = 15;
    private count = 1;
    private tableData = [];
    private multipleSelection = [];
    private diaFlag = false;
    private dialogVisible = false;
    private ruleForm = {
        reply: "",
        id: ""
    };
    private rules = {
        reply: [
            { required: true, message: "请输入回复内容", trigger: "blur" },
            {
                min: 3,
                max: 200,
                message: "长度在 3 到 200 个字符",
                trigger: "blur"
            }
        ]
    };
    private handleSelectionChange(val: any) {
        this.multipleSelection = val;
    }
    created() {
        this.getData();
    }
    handleClose() {
        this.dialogVisible = false;
    }
    private getData() {
        (this as any).$axios
            .get(
                `${apiUrl.gutsbppkGet}?page=${this.page}&pageSize=${this.pageSize}`
            )
            .then((res: any) => {
                console.log(res);
                let datas = res.data;
                if (datas.code == 0) {
                    this.tableData = datas.message.rows;
                    this.count = datas.message.count;
                }
            });
    }
    private handleEdit(index: number, row: any) {
        this.dialogVisible = true;
        this.ruleForm.id = row.id;
        this.ruleForm.reply = row.reply;
    }
    private handleDelete(index: number, row: any) {
        this.$confirm("是否删除此条数据？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        }).then(() => {
            this.diaFlag = true;
            this.deleteItem(row.id);
            this.getData();
        });
    }
    private deleteItem(id: number) {
        (this as any).$axios
            .get(`${apiUrl.gutsbppkDelete}?id=${id}`)
            .then((res: any) => {
                if (res.data.code == 0) {
                    if (this.diaFlag) {
                        this.$message.success("删除成功");
                        this.diaFlag = false;
                    }
                }
            });
    }
    setPage(page: number) {
        this.page = page;
        this.getData();
    }
    setPageSize(pageSize: number) {
        this.pageSize = pageSize;
        this.getData();
    }
    changeState(id: number) {
        if (!this.editFlag) {
            this.$message.warning("权限不足,请联系管理员");
            return false;
        }
        this.diaFlag = true;
        this.adopt(id);
    }
    private adopt(id: number) {
        (this as any).$axios
            .get(`${apiUrl.gustbookState}?id=${id}`)
            .then((res: any) => {
                if (res.data.code == 0 && this.diaFlag) {
                    this.$message.success(res.data.message);
                    this.diaFlag = false;
                    this.getData();
                }
            });
    }
    private removeAll() {
        let arr = this.multipleSelection;
        if (arr.length <= 0) {
            this.$message.warning("请选择数据");
            return false;
        }
        this.$confirm("是否批量删除数据？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        }).then(() => {
            arr.forEach((item: any, index: number) => {
                if (index >= arr.length - 1) {
                    this.diaFlag = true;
                }
                this.deleteItem(item.id);
            });
        });
    }
    private tong() {
        let arr = this.multipleSelection;
        if (arr.length <= 0) {
            this.$message.warning("请选择数据");
            return false;
        }

        arr.forEach((item: any, index: number) => {
            if (index >= arr.length - 1) {
                this.diaFlag = true;
            }
            if (!item.state) {
                this.adopt(item.id);
            }
        });
    }
    private submitForm(formName: string) {
        (this.$refs[formName] as any).validate((valid: boolean) => {
            if (valid) {
                this.relyadd();
            } else {
                console.log("error submit!!");
                return false;
            }
        });
    }
    relyadd() {
        (this as any).$axios
            .post(`${apiUrl.gustbookReply}`, this.ruleForm)
            .then((res: any) => {
                if (res.data.code === 0) {
                    this.$message.success("回复成功");
                    this.dialogVisible = false;
                    this.ruleForm = { reply: "", id: "" };
                    this.getData();
                }
            });
    }
}
</script>

<style scoped>
.gutsbook {
    background: #fff;
    padding: 50px;
    margin-top: 20px;
}
.el-row {
    margin-bottom: 25px;
}
</style>