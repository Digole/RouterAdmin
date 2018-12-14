<template>
  <section>

    <div class="line_02">
      <span>{{ $t('operaLog.log') }}</span>
    </div>

    <!--工具条-->
    <el-col :span="24">
      <el-form
        :model="request"
        :inline="true"
        :rules="rules"
        ref="request">
        <el-form-item prop="time">
          <el-date-picker
            v-model="request.time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getTime"/>
        </el-form-item>
        <el-form-item prop="module_name">
          <el-input
            placeholder="模块名过滤"
            v-model="request.module_name">
            <i
              slot="prefix"
              class="el-input__icon el-icon-search"/>>
          </el-input>
        </el-form-item>
        <el-form-item prop="oper_log">
          <el-input
            placeholder="操作日志过滤"
            v-model="request.oper_log">
            <i
              slot="prefix"
              class="el-input__icon el-icon-search"/>>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="search">{{ $t('operaLog.search') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="empty">{{ $t('operaLog.clear') }}</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <span class="tip" v-if="request.time === ''">默认提供最近24小时数据</span>
        </el-form-item> -->
      </el-form>
    </el-col>

    <el-table
      :data="form"
      style="width: 100%"
      :header-cell-style="headerStyle">
      <el-table-column
        prop="oper_time"
        :label="$t('operaLog.time')"/>
      <el-table-column
        prop="client_ip"
        :label="$t('operaLog.ip')"/>
      <el-table-column
        prop="operator"
        :label="$t('operaLog.operator')"/>
      <el-table-column
        prop="module_name"
        :label="$t('operaLog.module')"/>
      <el-table-column
        prop="result"
        :label="$t('operaLog.result')"/>
      <el-table-column
        prop="oper_log"
        :label="$t('operaLog.content')"/>
    </el-table>

    <el-pagination
      layout="prev, pager, next"
      :total="total"
      :page-size="10"
      @current-change="handleChange"
      style="float: right"/>

  </section>
</template>

<script>
import { getOperaLog } from '@/api/api.js'
export default {
  name: 'BMDisplay',
  data () {
    return {
      currentPage: 1,
      total: 0,
      form: [],
      hardwareInfo: [],

      request: {
        time: '',
        module_name: '',
        oper_log: ''
      },
      dialForm: {
        starttime: '',
        endtime: '',
        page: '',
        pagecount: ''
      },

      rules: {
        module_name: [
          {min: 0, max: 31, message: '最大字符不超过31字节', trigger: 'change'}
        ],
        oper_log: [
          {min: 0, max: 127, message: '最大字符不超过127字节', trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    headerStyle () {
      return this.header()
    },
    handleChange (val) {
      this.currentPage = val
      let para = Object.assign({}, this.dialForm, this.request)
      para.page = this.currentPage
      para.pagecount = 10
      para.page = this.currentPage
      getOperaLog(para)
        .then(res => {
          if (res.data.code === 200) {
            if (res.data.total !== 0) {
              if (res.data.data.length !== 0) {
                res.data.data.forEach((item) => {
                  if (item.reuslt === 1) {
                    item.result = '失败'
                  } else if (item.result === 0) {
                    item.result = '成功'
                  }
                })
                this.form = res.data.data
                this.total = res.code.total
              } else {
                this.currentPage -= 1
                this.handleChange()
              }
            } else if (res.data.tatal === 0) {
              this.form = res.data.data
            }
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    getTime () {
      this.dialForm.starttime = this.transform(this.request.time[0])
      this.dialForm.endtime = this.transform(this.request.time[1])
      this.currentPage = 1
      this.getInfo()
    },
    transform (val) {
      let time
      time =
        val.toDateString() +
        ' ' +
        val.getHours() +
        ':' +
        val.getMinutes() +
        ':' +
        val.getSeconds()
      return time
    },
    empty () {
      this.$refs['request'].resetFields()
    },
    search () {
      let para = Object.assign({}, this.dialForm, this.request)
      // if (this.request.time === '') {
      //   let now = new Date()
      //   this.dialForm.starttime = this.transform(
      //     new Date(now - 24 * 60 * 60 * 1000)
      //   )
      //   para.starttime = this.dialForm.starttime
      //   this.dialForm.endtime = this.transform(now)
      //   para.endtime = this.dialForm.endtime
      // }
      para.page = this.currentPage
      para.pagecount = 10
      getOperaLog(para).then(res => {
        if (res.data.code === 200) {
          if (res.data.total !== 0) {
            if (res.data.data.length !== 0) {
              res.data.data.forEach((item) => {
                if (item.reuslt === 1) {
                  item.result = '失败'
                } else if (item.result === 0) {
                  item.result = '成功'
                }
              })
              this.form = res.data.data
              this.total = res.data.total
            } else {
              this.currentPage -= 1
              this.getOperaLog()
            }
          } else if (res.data.total === 0) {
            this.form = []
            this.total = res.data.total
          }
        }
      })
    },
    getInfo () {
      let para = Object.assign({}, this.dialForm, this.request)
      // if (this.request.time === '') {
      //   let now = new Date()
      //   this.dialForm.starttime = this.transform(
      //     new Date(now - 24 * 60 * 60 * 1000)
      //   )
      //   para.starttime = this.dialForm.starttime
      //   this.dialForm.endtime = this.transform(now)
      //   para.endtime = this.dialForm.endtime
      // }
      para = Object.assign(para, this.request)
      para.page = this.currentPage
      para.pagecount = 10
      getOperaLog(para).then(res => {
        if (res.data.code === 200) {
          if (res.data.total !== 0) {
            if (res.data.data.length !== 0) {
              res.data.data.forEach((item) => {
                if (item.reuslt === 1) {
                  item.result = '失败'
                } else if (item.result === 0) {
                  item.result = '成功'
                }
              })
              this.form = res.data.data
              this.total = res.data.total
            } else {
              this.currentPage -= 1
              this.getOperaLog()
            }
          } else if (res.data.total === 0) {
            this.form = []
            this.total = res.data.total
          }
        }
      })
    }
  },
  mounted () {
    this.getInfo()
  }
}
</script>

<style scoped>
</style>
