<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12" :offset="6">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="80px"
        >
          <el-form-item label="标签名称" prop="tagname">
            <el-input v-model="ruleForm.tagname"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')"
              >确定</el-button
            >
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { apiUrl } from "../../api";
@Component
export default class Tags extends Vue {
  private ruleForm = {
    tagname: ""
  };
  private rules = {
    tagname: [
      { required: true, message: "请输入标签名称", trigger: "blur" },
      {
        min: 1,
        max: 20,
        message: "长度在 1 到 20 个字符",
        trigger: "blur"
      }
    ]
  };
  private submitForm(formName: string) {
    (this.$refs[formName] as any).validate((valid: boolean) => {
      if (valid) {
        (this as any).$axios
          .post(apiUrl.tagAdd, this.ruleForm)
          .then((res: any) => {
            if (res.data.code == 0) {
              this.$message.success("添加成功");
              (this.$refs[formName] as any).resetFields();
            }
          });
      } else {
        console.log("error submit!!");
        return false;
      }
    });
  }
  private resetForm(formName: string) {
    (this.$refs[formName] as any).resetFields();
  }
}
</script>

<style></style>
