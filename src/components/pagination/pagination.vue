<template>
    <div class="pagination">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="arrPage"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="count"
        ></el-pagination>
    </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
@Component
export default class Pagination extends Vue {
    @Prop({ type: Number, default: 1 })
    page: number;
    @Prop({ type: Number, default: 15 })
    pageSize: number;
    @Prop({ type: Number, required: true })
    count: number;
    @Prop({
        type: Array,
        default: () => {
            return [15, 30, 40];
        }
    })
    arrPage: [];
    @Emit("setPage")
    setPage(page) {
        return page;
    }
    @Emit("setPageSize")
    setPageSize(pageSize) {
        return pageSize;
    }
    handleSizeChange(val) {
        this.setPageSize(val);
    }
    handleCurrentChange(val) {
        this.setPage(val);
    }
}
</script>

<style scoped>
.pagination {
    background: #fff;
    margin-top: 30px;
    text-align: center;
}
</style>