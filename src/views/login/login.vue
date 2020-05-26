<template>
  <div class="login">
    <vue-particles
      color="#fff"
      :particleOpacity="0.7"
      :particlesNumber="60"
      shapeType="circle"
      :particleSize="4"
      linesColor="#fff"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="2"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
      class="lizi"
    ></vue-particles>
    <div class="login_content">
      <!--SIGN UP-->
      <h1></h1>
      <div class="login-form">
        <div class="close"></div>
        <div class="head-info">
          <p style="font-size:18px;display:inline-block;margin-left:80px">
            后台管理系统
          </p>

          <label class="lbl-1"></label>
          <label class="lbl-2"></label>
          <label class="lbl-3"></label>
        </div>
        <div class="clear"></div>
        <div class="avtar">
          <img src="../../assets/images/avtar.png" />
        </div>

        <input
          type="text"
          v-model="userdata.username"
          class="text"
          placeholder="username"
        />
        <div class="key">
          <input
            type="password"
            v-model="userdata.password"
            placeholder="password"
            @keyup.enter="submitHandle"
          />
        </div>

        <div class="signin">
          <el-button type="primary" @click="submitHandle">主要按钮</el-button>
        </div>
      </div>
      <div class="copy-rights">
        <p>
          Copyright &copy; 2015.Company name All rights reserved.More Templates
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { Action } from "vuex-class";

import { apiUrl } from "../../api";
@Component
export default class Login extends Vue {
  private userdata: { username: string; password: string } = {
    username: "",
    password: ""
  };
  @Action setUser: any;
  submitHandle(): void {
    if (
      (this as any).userdata.username === "" ||
      (this as any).userdata.password === ""
    ) {
      this.$message.error("用户名或者密码不能为空");
    } else {
      (this as any).$axios
        .post(`${apiUrl.userLogin}`, {
          ...(this as any).userdata
        })
        .then(async (res: any) => {
          let token = res.data.message;
          console.log(res.data.code);
          if (res.data.code === 0) {
            // let user_token: any = jwt_decode(token);
            let user_token = await (this as any).$axios.get(
              `${apiUrl.verifySecret}?token=${token}`
            );
            let tokens = user_token.data.message;
            if (tokens.username) {
              this.setUser(tokens);
              localStorage.setItem("token", token);
              localStorage.setItem("user_token", JSON.stringify(tokens));
              this.$router.push("/");
            } else {
              this.$message.error("token解析错误");
            }
          } else {
            this.$message.error("账户或者密码错误");
          }
        });
    }
  }
}
</script>

<style scoped>
/*--close--*/
.login {
  background: #409eff;
  font-family: "Open Sans", sans-serif;
  background-size: cover;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  min-height: 1050px;
}
.close {
  background: url("../../assets/images/close.png") no-repeat 0px 0px;
  cursor: pointer;
  width: 20px;
  height: 20px;
  position: absolute;
  left: 20px;
  top: 20px;
  -webkit-transition: color 0.2s ease-in-out;
  -moz-transition: color 0.2s ease-in-out;
  -o-transition: color 0.2s ease-in-out;
  transition: color 0.2s ease-in-out;
}
/*--/close--*/
h1 {
  font-family: "Exo 2", sans-serif;
  text-align: center;
  padding-top: 4em;
  font-weight: 400;
  color: #2b2b36;
  font-size: 2em;
}
.login-form {
  background: #2b2b36;
  position: relative;

  margin: 3% auto 0 auto;
  text-align: center;
  border-radius: 15px;
  -webkit-border-radius: 15px;
  -moz-border-radius: 15px;
  -o-border-radius: 15px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.04);
}
.head img {
  width: 100%;
}
.avtar img {
  margin: 2em 0 0;
}
.head-info {
  padding: 5px 0;
  text-align: center;
  font-weight: 600;
  font-size: 2em;
  color: #fff;
  background: #23232e;
  height: 50px;
  border-top-left-radius: 10px;
  -webkit-border-top-left-radius: 10px;
  -moz-border-top-left-radius: 10px;
  -o-border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  -webkit-border-top-right-radius: 10px;
  -moz-border-top-right-radius: 10px;
  -o-border-top-right-radius: 10p;
}
input[type="text"] {
  width: 70%;
  padding: 1em 2em 1em 3em;
  color: #9199aa;
  font-size: 18px;
  outline: none;
  background: url("../../assets/images/adm.png") no-repeat 10px 15px;
  border: none;
  font-weight: 100;
  border-bottom: 1px solid#484856;
  margin-top: 2em;
}
input[type="password"] {
  width: 70%;
  padding: 1em 2em 1em 3em;
  color: #dd3e3e;
  font-size: 18px;
  outline: none;
  background: url("../../assets/images/key.png") no-repeat 10px 23px;
  border: none;
  font-weight: 100;
  border-bottom: 1px solid#484856;
  margin-bottom: 3em;
}

input[type="submit"] {
  font-size: 30px;
  color: #fff;
  outline: none;
  border: none;
  background: #3ea751;
  width: 100%;
  padding: 18px 0;
  border-bottom-left-radius: 15px;
  -webkit-border-bottom-left-radius: 15px;
  -moz-border-bottom-left-radius: 15px;
  -o-border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  -webkit-border-bottom-right-radius: 15px;
  -moz-border-bottom-right-radius: 15px;
  -o-border-bottom-right-radius: 15px;
  cursor: pointer;
}
input[type="submit"]:hover {
  background: #ff2775;
  border-bottom-left-radius: 15px;
  -webkit-border-bottom-left-radius: 15px;
  -moz-border-bottom-left-radius: 15px;
  -o-border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  -webkit-border-bottom-right-radius: 15px;
  -moz-border-bottom-right-radius: 15px;
  -o-border-bottom-right-radius: 15px;
  transition: 1s all;
  -webkit-transition: 1s all;
  -moz-transition: 1s all;
  -o-transition: 1s all;
}
label.lbl-1 {
  background: #6756ea;
  width: 20px;
  height: 20px;
  display: block;
  float: right;
  border-radius: 50%;
  margin: 16px 10px 0px 0px;
}
label.lbl-2 {
  background: #ea569a;
  width: 20px;
  height: 20px;
  display: block;
  float: right;
  border-radius: 50%;
  margin: 16px 10px 0px 0px;
}
label.lbl-3 {
  background: #f1c85f;
  width: 20px;
  height: 20px;
  display: block;
  float: right;
  border-radius: 50%;
  margin: 16px 10px 0px 0px;
}
/*--copyrights--*/
.copy-rights {
  text-align: center;
  margin-top: 8em;
}
.copy-rights p {
  color: #fff;
  font-size: 1em;
  line-height: 1.8em;
}
.copy-rights p a {
  color: #ff2a75;
  -webkit-transition: all 0.3s ease-out;
  -moz-transition: all 0.3s ease-out;
  -ms-transition: all 0.3s ease-out;
  -o-transition: all 0.3s ease-out;
  transition: all 0.3s ease-out;
  text-decoration: none;
}
.copy-rights p a:hover {
  color: #3faa53;
  text-decoration: none;
  transition: 0.1s all;
  -webkit-transition: 0.1s all;
  -moz-transition: 0.1s all;
  -o-transition: 0.1s all;
}

.el-button {
  width: 80%;
  line-height: 30px;
  font-size: 20px;

  margin: 20px;
  margin-top: 0;
}
.login_content {
  width: 600px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  margin: auto;
}
</style>
