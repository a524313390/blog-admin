<template>
    <div class="list">
        <el-row :gutter="20">
            <el-col>
                <el-form :inline="true" :model="search" class="demo-form-inline">
                    <el-form-item label="标题名称">
                        <el-input v-model="search.title" placeholder="请输入标题"></el-input>
                    </el-form-item>
                    <el-form-item label="发布人">
                        <el-input v-model="search.article_author" placeholder="请输入发布人"></el-input>
                    </el-form-item>
                    <el-form-item label="栏目名称">
                        <el-select v-model="search.category_id" placeholder="请选择栏目">
                            <el-option
                                :label="category.tag_name"
                                v-for="category in categoryList"
                                :key="category.tag_name"
                                :value="category.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="searchHandle">查询</el-button>
                    </el-form-item>
                    <el-form-item v-if="editFlag">
                        <el-button type="danger" @click="removeAll">批量删除</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <el-table
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column align="center" type="selection" width="55"></el-table-column>
                    <el-table-column align="center" prop="id" label="ID" width="120"></el-table-column>

                    <el-table-column align="center" prop="title" label="文章标题" width="300"></el-table-column>
                    <el-table-column
                        align="center"
                        prop="tag_category.tag_name"
                        label="内容分类"
                        show-overflow-tooltip
                    ></el-table-column>

                    <el-table-column align="center" prop="count" label="点击量" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="发布人" prop="article_author" width="180">
                        <template slot-scope="scope">
                            <el-tag size="medium">
                                {{
                                scope.row.article_author == ""
                                ? "暂无"
                                : scope.row.article_author
                                }}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="更新日期" width="200">
                        <template slot-scope="scope">
                            {{
                            scope.row.updatedAt | dateformat("YYYY-MM-DD HH:mm:ss")
                            }}
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
            </el-col>
        </el-row>
        <div class="page">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="[15, 30, 40]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="count"
            ></el-pagination>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";
import { apiUrl } from "@/api";
import { EditAuth } from "../../mixins";
@Component
export default class ArticleList extends EditAuth {
    private categoryList = [];
    private currentPage4 = 4;
    private page = 1;
    private pageSize = 15;
    private count = 1;
    private tableData = [];
    private multipleSelection = [];
    private diaFlag = false;
    private search = {
        category_id: "",
        title: "",
        article_author: ""
    };
    private searchHandle() {
        let searchObj = this.search;
        if (
            searchObj.category_id !== "" ||
            searchObj.title !== "" ||
            searchObj.article_author !== ""
        ) {
            (this as any).$axios
                .get(
                    `${apiUrl.articleSearch}?category_id=${searchObj.category_id}&title=${searchObj.title}&article_author=${searchObj.article_author}`
                )
                .then((res: any) => {
                    let datas = res.data;
                    console.log(datas.code);
                    if (datas.code == 0) {
                        this.tableData = datas.message.rows;
                        this.count = datas.message.count;
                    }
                });
        } else {
            this.$message.warning("请输入搜索内容");
        }
    }
    created() {
        this.getArticleList();
        this.getTags();
    }

    //请求数据
    private getArticleList() {
        (this as any).$axios
            .get(
                `${apiUrl.articleList}?page=${this.page}&pageSize=${this.pageSize}`
            )
            .then((res: any) => {
                let data = res.data;
                console.log(res);
                if (data.code == 0) {
                    this.count = data.message.count;
                    this.tableData = data.message.rows;
                }
            });
    }
    private handleSelectionChange(val) {
        this.multipleSelection = val;
    }
    private handleSizeChange(val) {
        this.pageSize = val;
        this.getArticleList();
    }
    private handleCurrentChange(val) {
        this.page = val;
        console.log(val);

        this.getArticleList();
    }
    private handleEdit(index, row) {
        console.log(index, row);
        this.$router.push({
            name: "articleEdit",
            params: { articleData: row }
        });
    }
    private handleDelete(index, row) {
        this.$confirm("是否删除此条文章?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        }).then(() => {
            this.diaFlag = true;
            this.deleteArticle(row.id);
        });
    }
    private deleteArticle(id: number) {
        (this as any).$axios
            .get(`${apiUrl.articleDelete}?id=${id}`)
            .then((res: any) => {
                if (res.data.code == 0) {
                    if (this.diaFlag) {
                        this.$message.success("删除成功");
                        this.getArticleList();
                    }
                }
            });
    }
    private removeAll() {
        let articleArr = this.multipleSelection;
        if (articleArr.length <= 0) {
            this.$message.warning("请选择文章");
            return false;
        }
        articleArr.forEach((item: any, index: number) => {
            if (index >= articleArr.length) {
                this.diaFlag = true;
            }
            this.deleteArticle(item.id);
            this.getArticleList();
        });
    }
    private getTags() {
        (this as any).$axios.get(`${apiUrl.tagList}`).then((res: any) => {
            if (res.data.code === 0) {
                this.categoryList = res.data.message;
            }
        });
    }
}
</script>

<style scoped>
.list {
    background: #fff;
    margin-top: 20px;
    padding: 50px;
}
.page {
    text-align: center;
}
.el-pagination {
    margin-top: 30px;
}
</style>
