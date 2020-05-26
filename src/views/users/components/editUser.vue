<template>
  <div>
    <el-dialog
      title="提示"
      :visible.sync="markFlag"
      width="30%"
      :before-close="closeFun"
    >
      <el-form
        :model="userData"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户id" prop="id">
          <el-input
            type="text"
            v-model="userData.id"
            disabled
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input
            type="text"
            v-model="userData.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户身份" prop="type">
          <el-select v-model="userData.type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="修改密码" prop="password">
          <el-input
            type="password"
            v-model="userData.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            type="password"
            v-model="userData.checkPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeFun">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from "vue-property-decorator";
import { apiUrl } from "../../../api/";

@Component({
  name: "editUser"
})
export default class EditUser extends Vue {
  @Prop({
    type: Object,
    required: true
  })
  userData: any;
  @Prop({
    type: Boolean,
    default: false,
    required: true
  })
  markFlag: any;

  @Emit("closeFun")
  closeFun() {
    (this.$refs["ruleForm"] as any).resetFields();
    return false;
  }
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
      if (this.userData.checkPass !== "") {
        (this.$refs.ruleForm as any).validateField("checkPass");
      }
      callback();
    }
  };
  private validatePass2 = (rule: any, value: string, callback: any) => {
    if (value === "") {
      callback(new Error("请再次输入密码"));
    } else if (value !== this.userData.password) {
      callback(new Error("两次输入密码不一致!"));
    } else {
      callback();
    }
  };

  private rules = {
    username: [
      { required: true, message: "请输入用户名", trigger: "blur" },
      {
        min: 3,
        max: 20,
        message: "长度在 3 到 20 个字符",
        trigger: "blur"
      }
    ],
    password: [{ validator: this.validatePass, trigger: "blur" }],
    checkPass: [{ validator: this.validatePass2, trigger: "blur" }]
  };
  get objName(): string {
    return JSON.parse(JSON.stringify(this.userData));
  }
  private submitForm(formName: string) {
    (this.$refs[formName] as any).validate((valid: boolean) => {
      if (valid) {
        (this as any).$axios
          .post(apiUrl.userChange, {
            username: this.userData.username,
            id: this.userData.id,
            type: this.userData.type
          })
          .then((res: any) => {
            if (res.data.code == 0) {
              this.$message.success("修改成功");
              this.closeFun();
              (this.$parent as any).getUserData();
            }
          });
        if (this.userData.password && this.userData.checkPass) {
          (this as any).$axios
            .post(apiUrl.userChange, this.userData)
            .then((res: any) => {
              if (res.data.code == 0) {
                this.$message.success("修改成功");
                this.closeFun();
                (this.$parent as any).getUserData();
              }
            });
        }
      } else {
        console.log("error submit!!");
        return false;
      }
    });
  }
}
</script>

<style scoped>
.el-select {
  width: 100%;
}
</style>
