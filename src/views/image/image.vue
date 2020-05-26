<template>
    <div class="image">
        <el-row>
            <el-button type="danger" v-if="editFlag">批量删除</el-button>
        </el-row>
        <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            border
        >
            <el-table-column align="center" type="selection" width="200"></el-table-column>
            <el-table-column align="center" label="ID" prop="id" width="200"></el-table-column>
            <el-table-column align="center" label="日期" width="200">
                <template
                    slot-scope="scope"
                >{{ scope.row.updatedAt | dateformat('YYYY-MM-DD HH:MM:SS') }}</template>
            </el-table-column>
            <el-table-column align="center" label="姓名" width="300">
                <template slot-scope="scope">
                    <el-image
                        style="width: 100px; height: 100px"
                        :src="`http://localhost:5000${scope.row.url}`"
                        fit="fit"
                    ></el-image>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" v-if="editFlag">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)"
                    >删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <Pagination
            :page="page"
            :pageSize="pageSize"
            :count="count"
            @setPageSize="setPageSize"
            @setPage="setPage"
        ></Pagination>
    </div>
</template>

<script lang='ts'>
import { Component, Vue, Mixins } from "vue-property-decorator";
import { apiUrl } from "../../api";
import Pagination from "../../components/pagination/pagination.vue";
import { EditAuth } from "../../mixins";
@Component({
    name: "images",
    components: {
        Pagination
    }
})
export default class Images extends EditAuth {
    private page = 1;
    private pageSize = 15;
    private count = 1;
    private tableData = [];
    private multipleSelection = [];
    private rulefrom = {
        id: "",
        url: ""
    };
    private handleSelectionChange(val: any) {
        this.multipleSelection = val;
    }
    created() {
        this.getImgList();
    }
    private setPage(page: number) {
        this.page = page;
        this.getImgList();
    }
    private setPageSize(pageSize: number) {
        this.pageSize = pageSize;
        this.getImgList();
    }
    private getImgList() {
        (this as any).$axios
            .get(
                `${apiUrl.imageGet}?page=${this.page}&pageSize=${this.pageSize}`
            )
            .then((res: any) => {
                let datas = res.data;
                console.log(res);
                if (datas.code === 0) {
                    this.tableData = datas.message.rows;
                    this.count = datas.message.count;
                }
            });
    }
    private handleDelete(index: number, row: any) {
        console.log(index, row);
        this.rulefrom.id = row.id;
        this.rulefrom.url = row.url;
        this.deleteImage();
    }
    private deleteImage() {
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
            .then(() => {
                (this as any).$axios
                    .post(`${apiUrl.imgDelete}`, this.rulefrom)
                    .then((res: any) => {
                        if (res.data.code === 0) {
                            this.$message.success(res.data.message);
                            this.getImgList();
                            this.rulefrom = { id: "", url: "" };
                        }
                    });
            })
            .catch(() => {});
    }
}
</script>

<style scoped>
.image {
    margin-top: 20px;
    padding: 50px;
    background: #fff;
}
.el-row {
    margin-bottom: 20px;
}
</style>
