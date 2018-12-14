<template>
  <div class="backgroundDiv">
    <div class="pic">
      <img src="../../static/logo.png" >
    </div>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules2"
      label-position="left"
      label-width="0"
      class="demo-ruleForm login-container">
      <p class="title">OpenRT</p>
      <el-form-item prop="account">
        <el-input
          v-model="ruleForm.account"
          style="color: #ffffff"
          type="text"
          auto-complete="off"
          placeholder="账号"/>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input
          v-model="ruleForm.checkPass"
          type="password"
          auto-complete="off"
          placeholder="密码"/>
      </el-form-item>
      <div style="display: inline;">
        <el-tooltip
          placement="bottom"
          effect="light">
          <div
            slot="content"
            style="text-align: right;">请在控制台<br>更改密码</div>
          <el-button
            type="text"
            style="text-align: right;">忘记密码？</el-button>
        </el-tooltip>
      </div>
      <el-form-item style="width:100%;">
        <el-button
          :loading="logining"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleSubmit2">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { requestLogin } from '../api/api'
// import NProgress from 'nprogress'
import md5 from 'js-md5'
export default {
  data () {
    return {
      logining: false,
      ruleForm: {
        account: 'admin',
        checkPass: 'admin'
      },
      rules2: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
          // { validator: validaePass }
        ],
        checkPass: [
          { required: true, message: '请输入密码', trigger: 'blur' }
          // { validator: validaePass2 }
        ]
      },
      checked: true
    }
  },
  methods: {
    handleSubmit2 () {
      let para = {}
      para.username = this.ruleForm.account
      para.passwd = md5(this.ruleForm.checkPass)

      requestLogin(para)
        .then(res => {
          if (res.data.code === 200) {
            console.log(JSON.stringify(res.data))
            let user = {}
            user.id = res.data.id
            user.userName = res.data.username
            sessionStorage.setItem('user', JSON.stringify(user))
            this.$router.push('/ModeChoose')
          } else if (res.data.code === 1000) {
            // alert('ready to jump to createword')
            this.$router.push('/CreatePasswd')
          } else {
            this.$message({
              message: '错误',
              type: 'error'
            })
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.backgroundDiv {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background: url(../../static/bg.jpg);
  background-size: 100% 100%;
}

.pic {
  opacity: 0.7;
  text-align: center;
  margin-top: 180px;
}

.login-container {
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 20px auto;
  width: 320px;
  padding: 35px 35px 15px 35px;
  //background: #fff;
  background: grey;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  opacity: 0.7;
  color: white;
  .title {
    margin: 20px auto;
    text-align: center;
    //color: #505458;
    color: white;
    font-size: 20px;
    font-weight: bold;
  }
  .remember {
    margin: 0 0 35px 0;
    width: 75%;
    color: white;
  }
  input:-ms-input-placeholder {
    color: white;
  }
  input::-webkit-input-placeholder {
    color: white;
  }
}
</style>
