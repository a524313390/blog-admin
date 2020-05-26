<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="3">
                <el-input v-model="tagname" placeholder="请输入标签名搜索"></el-input>
            </el-col>

            <el-col :span="2">
                <el-button type="primary" icon="el-icon-search" @click="searchHandle">搜索</el-button>
            </el-col>

            <el-col :span="2">
                <el-button type="primary" icon="el-icon-refresh" @click="clearHandle">刷新</el-button>
            </el-col>

            <el-col :span="2" v-if="editFlag">
                <el-button
                    type="danger"
                    icon="el-icon-delete"
                    v-if="editFlag"
                    @click="allRemove"
                >批量删除</el-button>
            </el-col>
            <el-col :span="3">
                <el-button type="primary" icon="el-icon-download">导出</el-button>
            </el-col>
        </el-row>
        <div class="table">
            <el-table
                :data="tableData"
                border
                align="center"
                style="width: 100%"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="id" label="标签ID" width="180"></el-table-column>
                <el-table-column align="center" label="日期" width="180">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">
                            {{
                            scope.row.createdAt | dateformat("YYYY-MM-DD ")
                            }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="标签名称" width="180">
                    <template slot-scope="scope">
                        <el-tag size="medium">{{ scope.row.tag_name }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" v-if="editFlag">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                :hide-on-single-page="true"
                background
                layout="prev, pager, next"
                :page-size="pageSize"
                @current-change="handleCurrentChange"
                :total="count"
            ></el-pagination>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            @current-change="handleCurrentChange"
            :before-close="handleClose"
        >
            <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="100px"
                class="demo-ruleForm"
            >
                <el-form-item label="标签名称" prop="tagname">
                    <el-input v-model="ruleForm.tag_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";
import { Getter } from "vuex-class";
import { apiUrl } from "../../api";
import { EditAuth } from "../../mixins";
@Component
export default class TagsList extends EditAuth {
    private tagname = "";
    private tableData: Array<any> = [];
    private page = 1;
    private pageSize = 15;
    private count = 0;
    private dialogVisible = false;
    private multipleSelection = [];
    private ruleForm = {
        id: ""
    };
    private upTags = "";
    private rules = {
        tag_name: [
            { required: true, message: "请输入标签名称", trigger: "blur" },
            {
                min: 1,
                max: 20,
                message: "长度在 1 到 20 个字符",
                trigger: "blur"
            }
        ]
    };
    private diaFlag = false;
    created() {
        this.getTagList();
    }
    private searchHandle() {
        if (this.tagname !== "") {
            (this as any).$axios
                .get(
                    `${apiUrl.tagSearch}?tag_name=${this.tagname}&page=${this.page}&pageSize=${this.pageSize}`
                )
                .then((res: any) => {
                    if (res.data.code === 0) {
                        this.count = res.data.message.count;
                        this.tableData = res.data.message.rows;
                    }
                    console.log(res);
                });
        }
    }
    private clearHandle() {
        this.tagname = "";
        this.getTagList();
    }
    private handleEdit(index: number, row: any) {
        this.dialogVisible = true;
        this.ruleForm = { ...row };
        console.log(index, row);
    }
    private handleDelete(index: number, row: any) {
        this.$confirm("是否删除此条数据？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        }).then(() => {
            this.deleteItem(row.id);
            this.getTagList();
        });
    }
    private deleteItem(id: number) {
        (this as any).$axios
            .get(`${apiUrl.tagDelete}?id=${id}`)
            .then((res: any) => {
                if (res.data.code == 0) {
                    if (this.diaFlag) {
                        this.$message({
                            type: "success",
                            message: "删除成功!"
                        });
                        this.diaFlag = false;
                    }
                }
            });
    }
    private handleClose() {
        this.dialogVisible = false;
        (this.$refs["ruleForm"] as any).resetFields();
        (this as any).ruleForm = {};
    }
    private getTagList() {
        (this as any).$axios
            .get(`${apiUrl.tag}?page=${this.page}&pageSize=${this.pageSize}`)
            .then((res: any) => {
                console.log(res);
                if (res.data.code === 0) {
                    this.count = res.data.message.count;
                    this.tableData = res.data.message.rows;
                }
                console.log(res);
            });
    }
    private submitForm(formName: any) {
        (this.$refs[formName] as any).validate((valid: boolean) => {
            if (valid) {
                (this as any).$axios
                    .post(apiUrl.tagUpdate, this.ruleForm)
                    .then((res: any) => {
                        if (res.data.code === 0) {
                            this.dialogVisible = false;
                            this.$message.success("修改成功");
                            this.getTagList();
                            (this as any).ruleForm = {};
                        }
                    });
            } else {
                console.log("error submit!!");
                return false;
            }
        });
    }
    private handleCurrentChange(index: number) {
        console.log(index);
        this.page = index;
        this.getTagList();
    }
    private handleSelectionChange(val: any) {
        this.multipleSelection = val;
    }
    private allRemove() {
        if (this.multipleSelection.length <= 0) {
            this.$message.warning("请选择信息");
            return false;
        }
        this.multipleSelection.forEach((item: any, index: number) => {
            if (index >= this.multipleSelection.length - 1) {
                this.diaFlag = true;
            }
            this.deleteItem(item.id);
        });
        this.getTagList();
    }
}
</script>

<style scoped>
.table {
    margin-top: 20px;
    padding: 50px;
    text-align: center;
    background: #fff;
}
.el-pagination {
    margin-top: 30px;
}
</style>
