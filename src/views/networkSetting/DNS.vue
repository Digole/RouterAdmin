<template>
  <div>
    <div class="line_02">
      <span>DNS</span>
    </div>

    <el-form
      :model="addForm"
      ref="addForm"
      label-width="5rem"
      :rules="rules">

      <el-form-item
        prop="primary"
        :label="$t('DNS.dns1')">
        <el-input v-model="addForm.primary"/>
      </el-form-item>

      <el-form-item
        prop="second"
        :label="$t('DNS.dns2')">
        <el-input v-model="addForm.second"/>
      </el-form-item>
    </el-form>

    <el-button
      type="primary"
      @click="handle" >{{ $t('operation.submit') }}</el-button>
  </div>
</template>

<script>
import { getDNS, setDNS } from '@/api/api.js'
import validate from '@/utils/rules.js'
export default {
  name: 'DNS',
  data () {
    return {
      buttonValue: '',

      addForm: {
        primary: '',
        second: ''
      },

      rules: {
        primary: [
          {
            validator: validate('ip', '请输入正确IP地址', 'IP地址不能为空'), trigger: 'blur'
          }
        ],
        second: [
          {
            validator: validate('ip', '请输入正确IP地址', 'IP地址不能为空'), trigger: 'blur'
          }
        ]
      }

    }
  },
  methods: {
    changeValue: function () {
      let value = ''
      console.log(this.$store.state.routePush)
      if (this.$store.state.routePush) {
        value = '保存并返回'
      } else {
        value = '保存'
      }
      console.log('value is: ' + value)
      return value
    },

    handle () {
      let para = Object.assign({}, this.addForm)
      if (this.buttonValue === '保存') {
        this.$refs['addForm'].validate(valid => {
          if (valid) {
            console.log(this.buttonValue)
            setDNS(para)
              .then(res => {
                if (res.data.code === 200) {
                  this.$message({
                    message: '保存成功',
                    type: 'success'
                  })
                  this.getDNSInfo()
                }
              })
          }
        })
      } else {
        console.log(this.buttonValue)
        this.$router.push({ path: '../INEX_network' })
      }
    },
    getDNSInfo () {
      getDNS()
        .then(res => {
          if (res.data.code === 200) {
            this.addForm.primary = res.data.primary
            this.addForm.second = res.data.second
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },

  mounted () {
    this.buttonValue = this.changeValue()
    this.getDNSInfo()
  }
}
</script>

<style scoped>
.line_02 {
  margin-bottom: 20px;
  margin-top: 30px;
  height: 1px;
  border-top: 1px solid #ddd;
  text-align: left;
  color: #909399;
}
.line_02 span {
  position: relative;
  top: -10px;
  background: #fff;
  padding: 0 30px 0 0;
  font-weight: bold;
}
.el-form {
  width: 80%;
  min-width: 20rem;
}
.el-button {
  margin-left: 5rem;
}
</style>
