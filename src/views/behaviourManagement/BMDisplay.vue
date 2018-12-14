<template>
  <section>

    <div class="line_02"><span>{{ $t('BMDisplay.web') }}</span></div>

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
        <el-form-item prop="clientIp">
          <el-input
            placeholder="客户端IP过滤"
            v-model="request.clientIp">
            <i
              slot="prefix"
              class="el-input__icon el-icon-search"/>>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="search">{{ $t('BMDisplay.search') }}</el-button>
        </el-form-item>
        <el-form-item class="clear">
          <el-button @click="empty">{{ $t('BMDisplay.clear') }}</el-button>
        </el-form-item>
        <el-form-item>
          <span
            class="tip"
            v-if="request.time === ''">{{ $t('BMDisplay.provide') }}</span>
        </el-form-item>
      </el-form>
    </el-col>

    <el-table
      :data="form"
      style="width: 100%"
      :header-cell-style="headerStyle">
      <el-table-column
        prop="time"
        :label="$t('BMDisplay.time')"/>
      <el-table-column
        prop="username"
        :label="$t('BMDisplay.name')"/>
      <el-table-column
        prop="clientIp"
        :label="$t('BMDisplay.ip')"/>
      <el-table-column
        prop="result"
        :label="$t('BMDisplay.result')"/>
      <el-table-column
        prop="type"
        :label="$t('BMDisplay.type')"/>
    </el-table>

    <el-pagination
      layout="prev, pager, next"
      :total="total"
      :page-size="10"
      @current-change="handleChange"/>

  </section>
</template>

<script>
import { getWebInfo } from '@/api/api.js'
import validate from '@/utils/rules.js'
export default {
  name: 'BMDisplay',
  data () {
    return {
      currentPage: 1,
      pagecount: 10,
      total: 0,
      form: [],
      hardwareInfo: [],
      request: {
        time: '',
        clientIp: ''
      },
      dialForm: {
        starttime: '',
        endtime: '',
        page: '',
        pagecount: ''
      },

      rules: {
        clientIp: [
          {
            validator: validate('ip', '请输入IP', '请输入正确IP'), trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    headerStyle () {
      return this.header()
    },
    empty () {
      this.$refs['request'].resetFields()
      this.getinfo()
    },
    getTime () {
      this.dialForm.starttime = this.transform(this.request.time[0])
      this.dialForm.endtime = this.transform(this.request.time[1])
      this.currentPage = 1
      this.getLogInfo()
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
    search () {
      this.$refs.request.validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.dialForm)
          para = Object.assign(para, this.request)
          para.page = this.currentPage
          para.pagecount = this.pagecount
          getWebInfo(para)
            .then(res => {
              if (res.data.code === 200) {
                if (res.data.total !== 0) {
                  if (res.data.data.length !== 0) {
                    res.data.data.forEach((item) => {
                      if (item.result === 0) {
                        item.result = '成功'
                      } else {
                        item.result = '失败'
                      }
                      if (item.type === 1) {
                        item.type = '登陆'
                      } else {
                        item.type = '登出'
                      }
                    })
                    this.form = res.data.data
                    this.total = res.data.total
                  } else {
                    this.currentPage -= 1
                    this.handleChange()
                  }
                } else if (res.data.total === 0) {
                  this.form = res.data.data
                  this.total = res.data.total
                }
              }
            })
        }
      })
    },
    handleChange (val) {
      this.currentPage = val
      let para = Object.assign({}, this.dialForm, this.request)
      para.page = this.currentPage
      para.pagecount = this.pagecount
      this.getInfo(para)
    },
    getFirstInfo () {
      let para = Object.assign({}, this.dialForm, this.request)
      para.page = this.currentPage
      para.pagecount = this.pagecount
      this.getInfo(para)
    },
    getInfo (para) {
      getWebInfo(para)
        .then(res => {
          if (res.data.code === 200) {
            if (res.data.total !== 0) {
              if (res.data.data.length !== 0) {
                res.data.data.forEach((item) => {
                  if (item.result === 0) {
                    item.result = '成功'
                  } else {
                    item.result = '失败'
                  }
                  if (item.type === 1) {
                    item.type = '登陆'
                  } else {
                    item.type = '登出'
                  }
                })
                this.form = res.data.data
                this.total = res.data.total
              } else {
                // this.currentPage -= 1
                this.handleChange()
              }
            } else if (res.data.tatal === 0) {
              this.form = res.data.data
            }
          }
        })
    }
  },
  mounted () {
    this.getFirstInfo()
  }
}
</script>

<style scoped>

</style>
