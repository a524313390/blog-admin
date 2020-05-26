<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      :auto-upload="false"
      :on-change="changeUpload"
      :limit="1"
      ref="upload"
      @on-exceed="exceed"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{ file }">
        <img
          class="el-upload-list__item-thumbnail"
          :src="uploadData.dialogImageUrl"
          alt
        />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
            v-if="!uploadData.disabled"
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <i class="el-icon-download"></i>
          </span>
          <span
            v-if="!uploadData.disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>

    <el-dialog :visible.sync="uploadData.dialogVisible">
      <el-row :gutter="20">
        <el-col :span="16">
          <div class="cropper-content">
            <div class="cropper" style="text-align:center">
              <vue-cropper
                ref="cropper"
                :img="option.img"
                :outputSize="option.size"
                :outputType="option.outputType"
                :info="true"
                :full="option.full"
                :canMove="option.canMove"
                :canMoveBox="option.canMoveBox"
                :original="option.original"
                :autoCrop="option.autoCrop"
                :fixed="option.fixed"
                :fixedNumber="option.fixedNumber"
                :centerBox="option.centerBox"
                :infoTrue="option.infoTrue"
                :fixedBox="option.fixedBox"
              >
              </vue-cropper>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="suerHandle">确定</el-button>
          <el-button type="info" @click="cancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop, Watch } from "vue-property-decorator";
import { apiUrl } from "@/api";
@Component
export default class UploadImg extends Vue {
  //配置剪裁的信息
  private option: any = {
    img: "", // 裁剪图片的地址
    info: true, // 裁剪框的大小信息
    outputSize: 0.8, // 裁剪生成图片的质量
    outputType: "jpeg", // 裁剪生成图片的格式
    canScale: false, // 图片是否允许滚轮缩放
    autoCrop: true, // 是否默认生成截图框
    autoCropWidth: 500, // 默认生成截图框宽度
    autoCropHeight: 500, // 默认生成截图框高度
    fixedBox: false, // 固定截图框大小 不允许改变
    fixed: true, // 是否开启截图框宽高固定比例
    fixedNumber: [1, 1], // 截图框的宽高比例
    full: true, // 是否输出原图比例的截图
    canMoveBox: true, // 截图框能否拖动
    original: false, // 上传图片按照原始比例渲染
    centerBox: false, // 截图框是否被限制在图片里面
    infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
  };

  private uploadData = {
    dialogImageUrl: "",
    dialogVisible: false,
    disabled: false
  };
  @Emit("removeUrl")
  removeUrl() {}
  private handleRemove(file: any) {
    (this.$refs["upload"] as any).clearFiles();

    this.removeUrl();
  }
  private handlePictureCardPreview(file: any) {
    this.uploadData.dialogVisible = true;
  }
  private handleDownload(file: any) {}
  private changeUpload(file: any) {
    this.$nextTick(() => {
      this.option.img = file.url;
      this.uploadData.dialogVisible = true;
    });
  }
  private dataURLtoFile = (dataurl: string, filename: string) => {
    //将base64转换为文件
    var arr: any = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };
  @Emit("recaiveUrl")
  sendUrl(urls: string) {
    return urls;
  }
  //点击确定触发截图
  private suerHandle() {
    (this.$refs.cropper as any).getCropData((data: any) => {
      var file = this.dataURLtoFile(data, "jpg");
      let config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      var formDate = new FormData();
      formDate.append("file", file);
      (this as any).$axios
        .post(`${apiUrl.uploadImg}`, formDate, config)
        .then((res: any) => {
          if (res.data.code == 0) {
            this.sendUrl(res.data.message);
          }
        });
      this.uploadData.dialogImageUrl = data;
      this.uploadData.dialogVisible = false;
    });
  }

  //超出上传
  private exceed() {
    this.$message.error("超出上传");
  }
  //取消按钮
  private cancel() {
    (this.$refs["upload"] as any).clearFiles();
    this.uploadData.dialogVisible = false;
  }
}
</script>

<style soped lang="scss">
.cropper-content {
  .cropper {
    width: auto;
    height: 300px;
  }
}
</style>
