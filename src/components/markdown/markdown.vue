<template>
    <div class="markdown">
        <mavon-editor v-model="value" ref="md" :toolbars="markdownOption" @change="changValue" />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop, Watch } from "vue-property-decorator";

@Component
export default class Markdowns extends Vue {
    private value = "";
    @Prop({ type: String, default: "" })
    datavalue: string;

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
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true // 预览
    };
    @Emit("setValue")
    setValue(value: string) {
        return value;
    }
    @Emit("steMark")
    steMark(value: string) {
        return value;
    }
    private changValue(value, render) {
        this.setValue(value);
        this.steMark(render);
    }
    private emptyValue() {
        this.value = "";
    }
}
</script>

<style scoped>
.markdown {
    min-width: 800px;
}
</style>
