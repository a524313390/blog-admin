<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12" :offset="6">
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              type="text"
              v-model="ruleForm.username"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户身份" prop="type">
            <el-select v-model="ruleForm.type" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              v-model="ruleForm.password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input
              type="password"
              v-model="ruleForm.checkPass"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')"
              >添加</el-button
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
export default class User extends Vue {
  private ruleForm = {
    username: "",
    password: "",
    checkPass: "",
    type: ""
  };
  private options = [
    {
      value: "admin",
      label: "管理员"
    },
    {
      value: "user",
      label: "普通用户"
    }
  ];
  private validatePass = (rule: any, value: string, callback: any) => {
    if (value === "") {
      callback(new Error("请输入密码"));
    } else {
      if (this.ruleForm.checkPass !== "") {
        (this.$refs.ruleForm as any).validateField("checkPass");
      }
      callback();
    }
  };
  private validatePass2 = (rule: any, value: string, callback: any) => {
    if (value === "") {
      callback(new Error("请再次输入密码"));
    } else if (value !== this.ruleForm.password) {
      callback(new Error("两次输入密码不一致!"));
    } else {
      callback();
    }
  };
  private rules = {
    pass: [{ validator: this.validatePass, trigger: "blur" }],
    checkPass: [{ validator: this.validatePass2, trigger: "blur" }]
  };
  private submitForm(formName: string) {
    (this.$refs[formName] as any).validate((valid: boolean) => {
      if (valid) {
        (this as any).$axios
          .post(apiUrl.userAdd, this.ruleForm)
          .then((res: any) => {
            console.log(res);
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

<style scoped>
.el-select {
  width: 100%;
}
</style>
