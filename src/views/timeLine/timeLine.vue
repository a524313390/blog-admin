<template>
    <div class="block">
        <el-row>
            <el-button type="primary" v-if="editFlag" @click="addHandle">添加数据</el-button>
        </el-row>
        <el-timeline>
            <el-timeline-item
                v-for="(item, index) in sayList"
                :key="index"
                :color="index % 2 == 0 ? '#0bbd87' : '#F56C6C'"
                :timestamp="formatTimes(item.updatedAt)"
                placement="top"
            >
                <el-card>
                    <h4>{{ getArticleName }}</h4>
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="双击编辑"
                        v-if="showIndex != index"
                        placement="top-start"
                    >
                        <p
                            @dblclick="
                dbHandle(
                  index,
                  item.say_content_mark,
                  item.say_content,
                  item.id
                )
              "
                            v-html="item.say_content"
                        ></p>
                    </el-tooltip>

                    <el-form v-else class="demo-form-inline">
                        <el-form-item>
                            <el-input
                                ref="inputs"
                                type="textarea"
                                @blur="blurHandle"
                                v-model="changVal"
                                placeholder="编辑内容"
                            ></el-input>
                        </el-form-item>
                    </el-form>
                    <el-row v-if="editFlag">
                        <el-col :span="3" :offset="21">
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                                <el-button
                                    @click="
                    dbHandle(
                      index,
                      item.say_content_mark,
                      item.say_content,
                      item.id
                    )
                  "
                                    type="warning"
                                    size="mini"
                                    icon="el-icon-edit"
                                    circle
                                ></el-button>
                            </el-tooltip>
                            <el-tooltip
                                class="item"
                                v-if="editFlag"
                                effect="dark"
                                content="删除"
                                placement="top"
                            >
                                <el-button
                                    type="danger"
                                    @click="removeHandle(item.id)"
                                    size="mini"
                                    icon="el-icon-delete"
                                    circle
                                ></el-button>
                            </el-tooltip>
                        </el-col>
                    </el-row>
                </el-card>
            </el-timeline-item>
        </el-timeline>
        <div class="pagination">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="[15, 30, 40]"
                :page-size="100"
                layout="total, sizes, prev, pager, next, jumper"
                :total="count"
            ></el-pagination>
        </div>
        <Dialog :dialogVisible="dialogVisible" @closeDiaLog="closeDiaLog" @getSayList="getSayList"></Dialog>
        <EditLine
            :dialogVisible="dialogEdit"
            :editData="editData"
            @renderData="getSayList"
            @closeEdit="closeEdit"
        ></EditLine>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";
import { apiUrl } from "../../api";
import { Getter } from "vuex-class";
import moment from "moment";
import Dialog from "./addTime.vue";
import { EditAuth } from "../../mixins";
import EditLine from "./editLine.vue";

@Component({
    name: "timeline",
    components: {
        Dialog,
        EditLine
    }
})
export default class TimeLine extends EditAuth {
    private sayList = [];
    private page = 1;
    private pageSize = 15;
    private count = 1;
    private showIndex = -1;
    private changVal = "";
    private dialogVisible = false;
    private dialogEdit = false;
    private editData = {};
    @Getter getArticleName: any;
    created() {
        this.getSayList();
    }

    private getSayList() {
        (this as any).$axios
            .get(`${apiUrl.sayGet}?page=${this.page}&pageSize=${this.pageSize}`)
            .then((res: any) => {
                let datas = res.data;
                console.log(datas);
                if (datas.code == 0) {
                    this.sayList = datas.message.rows;
                    console.log(this.sayList);
                    this.count = datas.message.count;
                }
            });
    }
    handleSizeChange(val: number) {
        this.pageSize = val;
        this.getSayList();
    }
    handleCurrentChange(val: number) {
        this.page = val;
        this.getSayList();
    }
    private formatTimes(time: string) {
        return moment(time).format("YYYY-MM-DD");
    }
    private dbHandle(
        index: number,
        val: string,
        say_content: string,
        id: number
    ) {
        this.dialogEdit = true;
        this.editData = {
            id,
            say_content_mark: val,
            say_content
        };
        console.log(this.editData);
        // this.changVal = val;
        // this.showIndex = index;
        // this.$nextTick(() => {
        //     this.$refs.inputs[0].$refs.textarea.focus();
        // });
    }
    blurHandle() {
        let newVal = this.changVal;
        let oldVal = (this.sayList[this.showIndex] as any).say_content;
        let id = (this.sayList[this.showIndex] as any).id;

        if (newVal == oldVal) {
            this.showIndex = -1;
            this.changVal = "";
        } else {
            this.$confirm("是否保存修改后的数据？", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    (this as any).$axios
                        .post(`${apiUrl.sayUpdate}`, {
                            id,
                            say_content: newVal
                        })
                        .then((res: any) => {
                            if (res.data.code == 0) {
                                this.$message.success("修改成功");
                                this.showIndex = -1;
                                this.changVal = "";
                                this.getSayList();
                            }
                        });
                })
                .catch(() => {
                    this.showIndex = -1;
                    this.changVal = "";
                });
        }
    }
    private removeHandle(id: number) {
        console.log(id);
        this.$confirm("是否删除此条数据？", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        }).then(() => {
            this.deleteItem(id);
        });
    }
    private deleteItem(id: number) {
        (this as any).$axios
            .get(`${apiUrl.sayDelete}?id=${id}`)
            .then((res: any) => {
                if (res.data.code == 0) {
                    this.getSayList();
                    this.$message({
                        type: "success",
                        message: "删除成功!"
                    });
                }
            });
    }
    private addHandle() {
        this.dialogVisible = true;
    }
    closeDiaLog() {
        this.dialogVisible = false;
    }
    private closeEdit() {
        this.dialogEdit = false;
    }
}
</script>

<style scoped>
.block {
    background: #fff;
    margin-top: 20px;
    padding: 50px;
}
.pagination {
    margin-top: 20px;
    text-align: center;
}
.el-row {
    margin-bottom: 35px;
}
</style>
