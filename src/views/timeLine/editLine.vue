<template>
    <div>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
            <mavon-editor
                v-model="editData.say_content_mark"
                ref="md"
                :toolbars="markdownOption"
                @change="changValue"
            />
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="finshHandle">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import Markdowns from "../../components/markdown/markdown.vue";
import { apiUrl } from "../../api";
@Component({
    components: {
        Markdowns
    }
})
export default class EditLine extends Vue {
    @Prop({ type: Boolean, default: false })
    dialogVisible: any;
    private rulefrom = {};
    @Prop()
    editData: any;
    @Emit("closeEdit")
    closeEdit() {}
    private handleClose(done: any) {
        this.closeEdit();
    }
    private markdownOption = {
        bold: false, // 粗体
        italic: false, // 斜体
        header: true, // 标题
        underline: false, // 下划线
        strikethrough: false, // 中划线
        mark: true, // 标记
        superscript: false, // 上角标
        subscript: false, // 下角标
        quote: false, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: false, // 图片链接
        code: false, // code
        table: false, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: false, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: false, // 帮助
        /* 1.3.5 */
        undo: false, // 上一步
        redo: false, // 下一步
        trash: false, // 清空
        save: false, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: false, // 导航目录
        /* 2.1.8 */
        alignleft: false, // 左对齐
        aligncenter: false, // 居中
        alignright: false, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true // 预览
    };
    private changValue(val: string, render: string) {
        this.rulefrom = {
            id: this.editData.id,
            say_content_mark: val,
            say_content: render
        };

        console.log(this.rulefrom);
    }
    @Emit("renderData")
    renderData() {}
    finshHandle() {
        (this as any).$axios
            .post(`${apiUrl.sayUpdate}`, this.rulefrom)
            .then((res: any) => {
                if (res.data.code == 0) {
                    this.$message.success("修改成功");
                    this.closeEdit();
                    this.renderData();
                }
            });
    }
}
</script>

<style>
</style>