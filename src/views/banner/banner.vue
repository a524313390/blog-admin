<template>
    <div class="banner">
        <el-row v-if="editFlag">
            <el-button type="primary" @click="addBanner">添加轮播图</el-button>

            <el-button type="danger" @click="removeAll">批量删除</el-button>
        </el-row>
        <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            border
        >
            <el-table-column align="center" type="selection" width="55"></el-table-column>
            <el-table-column align="center" label="ID" prop="id" width="100"></el-table-column>
            <el-table-column align="center" label="标题" prop="banner_title" width="500"></el-table-column>
            <el-table-column align="center" label="图片" width="260">
                <template slot-scope="scope">
                    <el-image :src="scope.row.banner_image"></el-image>
                </template>
            </el-table-column>
            <el-table-column align="center" label="日期" width="200">
                <template slot-scope="scope">{{ scope.row.createdAt|dateformat('YYYY-MM-DD') }}</template>
            </el-table-column>
            <el-table-column align="center" label="是否显示" width="200">
                <template slot-scope="scope">
                    <el-tooltip
                        :content="`${scope.row.banner_state==true?'显示':'不显示'}`"
                        placement="top"
                    >
                        <el-switch
                            @change="changState(scope.row.id,scope.row.banner_state)"
                            v-model="scope.row.banner_state"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                        ></el-switch>
                    </el-tooltip>
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
        <AddBanner :dialogFlag="dialogFlag" @closeAddDialog="closeAddDialog"></AddBanner>
        <Pagination :count="count" @setPage="setPage" @setPageSize="setPageSize"></Pagination>
        <EditBanner
            :bannerData="editData"
            :dialogFlag="editDialogFlag"
            @closeAddDialog="editDialogClose"
        ></EditBanner>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { EditAuth } from "../../mixins";
import AddBanner from "./add.vue";
import EditBanner from "./edit.vue";
import { apiUrl } from "../../api";
import Pagination from "../../components/pagination/pagination.vue";
@Component({
    name: "banner",
    components: {
        AddBanner,
        Pagination,
        EditBanner
    }
})
export default class Banner extends EditAuth {
    private dialogFlag = false;
    public page = 1;
    public pageSize = 15;
    public count = 1;
    private tableData = [];
    private multipleSelection = [];
    private editDialogFlag = false;
    private editData = {};
    private showInfo = false;
    private handleSelectionChange(val) {
        this.multipleSelection = val;
    }
    private handleEdit(index, row) {
        console.log(index, row);
        this.editDialogFlag = true;
        this.editData = { ...row };
    }
    editDialogClose() {
        this.editDialogFlag = false;
        this.editData = {};
    }
    private handleDelete(index: number, row: any) {
        console.log(index, row);
        this.$confirm("是否删除此条数据?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
            .then(() => {
                this.showInfo = true;
                this.deleteItem(row.id);
            })
            .catch(() => {});
    }
    private deleteItem(id: number) {
        (this as any).$axios
            .get(`${apiUrl.bannerDelete}?id=${id}`)
            .then((res: any) => {
                if (res.data.code === 0) {
                    if (this.showInfo) {
                        this.$message.success("删除成功");
                        this.showInfo = false;
                    }
                }
            });
    }
    created() {
        this.getBannerList();
    }
    addBanner() {
        this.dialogFlag = true;
    }
    closeAddDialog() {
        this.dialogFlag = false;
    }
    getBannerList() {
        (this as any).$axios
            .get(
                `${apiUrl.bannerGet}?page=${this.page}&pageSize=${this.pageSize}`
            )
            .then((res: any) => {
                let datas = res.data;
                if (datas.code == 0) {
                    this.tableData = datas.message.rows;
                    this.count = datas.message.count;
                }
            });
    }
    setPage(page: number) {
        this.page = page;
        this.getBannerList();
    }
    setPageSize(pageSize: number) {
        this.pageSize = pageSize;
        this.getBannerList();
    }
    private changState(id: number, state: boolean) {
        (this as any)
            .$axios(`${apiUrl.bannerState}?id=${id}&banner_state=${state}`)
            .then((res: any) => {
                let datas = res.data;
                if (datas.code === 0) {
                    this.$message.success("修改成功");
                    this.getBannerList();
                }
            });
    }
    private removeAll() {
        this.$confirm("是否批量删除数据?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
            .then(() => {
                let arr = this.multipleSelection;
                if (arr.length <= 0) {
                    this.$message.warning("请选择数据");
                    return false;
                }
                arr.forEach((item: any, index: number) => {
                    if (index >= arr.length - 1) {
                        this.showInfo = true;
                    }
                    this.deleteItem(item.id);
                    this.getBannerList();
                });
            })
            .catch(() => {});
    }
}
</script>

<style scoped>
.banner {
    background: #fff;
    padding: 50px;
    margin-top: 20px;
}
.el-row {
    margin-bottom: 25px;
}
</style>