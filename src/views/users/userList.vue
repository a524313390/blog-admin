<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="3">
                <el-input v-model="username" placeholder="请输入用户名搜索"></el-input>
            </el-col>
            <el-col :span="4">
                <el-select v-model="typeValue" clearable placeholder="请选择">
                    <el-option
                        v-for="item in typeArr"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" icon="el-icon-search" @click="searchHandle">搜索</el-button>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" icon="el-icon-refresh" @click="clearHandle">刷新</el-button>
            </el-col>
            <el-col :span="2" v-if="editFlag">
                <el-button type="danger" icon="el-icon-delete" @click="allRemove">批量删除</el-button>
            </el-col>
            <el-col :span="3">
                <el-button type="primary" icon="el-icon-download">导出</el-button>
            </el-col>
        </el-row>
        <div class="table">
            <el-row>
                <el-table
                    border
                    :data="tableData"
                    style="width: 100%"
                    header-align="center"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column align="center" prop="id" label="用户id" width="180"></el-table-column>
                    <el-table-column align="center" label="创建日期" width="200">
                        <template slot-scope="scope">
                            <i class="el-icon-time"></i>
                            <span
                                style="margin-left: 10px"
                            >{{ scope.row.date | dateformat("YYYY-MM-DD ") }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="username" label="用户姓名" width="180"></el-table-column>
                    <el-table-column align="center" label="用户权限" width="180">
                        <template slot-scope="scope">
                            <el-tag
                                size="medium"
                                :type="scope.row.type == 'admin' ? 'danger' : 'success'"
                            >{{ scope.row.type == "admin" ? "管理员" : "普通用户" }}</el-tag>
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
                    background
                    layout="prev, pager, next"
                    :page-size="pageSize"
                    @current-change="handleCurrentChange"
                    :total="count"
                ></el-pagination>
            </el-row>
            <EditUser :markFlag="markFlag" @closeFun="closeMark" :userData="userData"></EditUser>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { apiUrl } from "../../api";
import { EditAuth } from "../../mixins";
import EditUser from "./components/editUser.vue";
@Component({
    name: "userList",
    components: {
        EditUser
    }
})
export default class UserList extends EditAuth {
    private username: string = "";
    private typeValue: string = "";
    private count: number = 0;
    private page: number = 1;
    private pageSize: number = 16;
    private markFlag: boolean = false;
    private userData = {};
    private multipleSelection = [];
    private diaFlag = false;
    created() {
        this.getUserData();
    }
    private typeArr: Array<any> = [
        {
            value: "admin",
            label: "管理员"
        },
        {
            value: "user",
            label: "普通用户"
        }
    ];
    private tableData: Array<any> = [];
    getUserData(): void {
        (this as any).$axios
            .get(`${apiUrl.user}?page=${this.page}&pageSize=${this.pageSize}`)
            .then((res: any) => {
                if (res.data.code == 0) {
                    this.tableData = res.data.massage.rows;
                    this.count = res.data.massage.count;
                }
            });
    }
    handleEdit(index: number, row: any) {
        this.markFlag = true;
        this.userData = { ...row };
    }
    handleDelete(index: number, row: any) {
        this.$confirm("是否删除此条数据？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        }).then(() => {
            this.deleteItem(row.id);
            this.getUserData();
        });
    }
    deleteItem(id: number) {
        (this as any).$axios
            .get(`${apiUrl.userDelete}?id=${id}`)
            .then((res: any) => {
                if (res.data.code === 0) {
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
    handleCurrentChange(index: number): void {
        this.page = index;
        this.getUserData();
    }
    //搜索
    searchHandle() {
        if (this.username == "" && this.typeValue == "") {
            return false;
        }
        (this as any).$axios
            .get(
                `${apiUrl.userSearch}?username=${this.username}&type=${this.typeValue}`
            )
            .then((res: any) => {
                console.log(res);
                if (res.data.code == 0) {
                    this.tableData = res.data.massage.rows;
                    this.count = res.data.massage.count;
                }
            });
    }
    clearHandle() {
        this.username = "";
        this.typeValue = "";
        this.getUserData();
    }
    //关闭弹窗
    closeMark(flag: boolean) {
        this.markFlag = flag;
    }
    handleSelectionChange(val: any) {
        this.multipleSelection = val;
    }
    allRemove() {
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
        this.getUserData();
    }
}
</script>

<style scoped lang="scss">
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
