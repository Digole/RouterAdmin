<template>
  <section>

    <div class="line_02"><span>终端监控</span></div>
    <!--工具条-->
    <el-col :span="24">
      <el-form
        :model="request"
        :rules="judge()"
        ref="form"
        :inline="true" >
        <el-form-item prop="data">
          <el-input
            v-model="request.data"
            placeholder="搜索IP/MAC"/>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="inquery">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <el-table
      :data="terminalForm"
      title="终端监控"
      :header-cell-style="headerStyle">
      <el-table-column
        prop="ip"
        label="IP"
        min-width="120"/>
      <el-table-column
        prop="mac"
        label="Mac"
        min-width="140"/>
      <el-table-column
        prop="send_rate"
        label="上行速率"
        min-width="120"/>
      <el-table-column
        prop="recv_rate"
        label="下行速率"
        min-width="120"/>
      <el-table-column
        prop="send_total_length"
        label="累计上行"
        min-width="120"/>
      <el-table-column
        prop="recv_total_length"
        label="累计下行"
        min-width="120"/>
      <el-table-column
        prop="duration"
        label="在线时长"
        min-width="120"/>
      <el-table-column>
        <template
          slot-scope="scope"
          :label="$t('operation.operation')">
          <el-button
            @click="forbidLink(scope.row)"
            type="text"
            size="small">禁止联网</el-button>
          <el-button
            @click="limitLink(scope.row)"
            type="text"
            size="small">限速</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="10"
      layout="total, prev, pager, next, jumper"
      :total="this.total"/>

    <el-dialog
      title="限速"
      :visible.sync="isLimitVisible">
      <el-form
        :model="addForm"
        ref="addForm">
        <el-form-item
          prop="fc_uprate"
          label="上行速率"
          required>
          <el-input
            v-model="addForm.fc_uprate"
            type="number"/>
        </el-form-item>
        <el-form-item
          prop="fc_downrate"
          label="下行速率"
          required>
          <el-input
            v-model="addForm.fc_downrate"
            type="number"/>
        </el-form-item>
        <el-form-item
          prop="fc_bufsize"
          label="缓冲区大小(KB)">
          <el-input
            v-model="addForm.fc_bufsize"
            type="number"/>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button
          type="primary"
          @click="limitSubmit">{{ $t('operation.operation') }}</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { getMonitorInfo, handleFC } from '../../api/api.js'
import validate from '../../utils/rules.js'
import { conversion, conversionUnit, time } from '../../utils/rateUnitExchange.js'
export default {
  name: 'TerminalMonitor',
  data () {
    return {
      addFormVisible: false,
      isLimitVisible: false,

      request: {
        data: ''
      }, // 存储用户请求信息
      form: {
        type: Number,
        enable: '',
        protocol: '',
        port: '',
        ip: '',
        mac: '',
        alias: '',
        ifname: '',
        duration: Number,
        send_rate: Number,
        recv_rate: Number,
        send_total_length: Number,
        recv_total_length: Number,
        send_total_packets: Number,
        recv_total_packets: Number
      },
      addForm: {
        fc_type: '', // 1:ip flowtl   2: net interface flowtl
        fc_enable: '', // 是否启用流控
        fc_proto: 'all', // 流控协议
        fc_start: '', // 流控起始地址
        fc_end: '', // 流控结束地址
        fc_sport: '', // 流控起始端口
        fc_eport: '', // 流控结束端口
        fc_ifname: '', // LAN interface name
        fc_uprate: '', // LAN up stream bits rate
        fc_downrate: '', // LAN down stream bits rate
        fc_bufsize: '', // buffer size (16K~ 128M Bytes)
        ip_family: '', // 地址类型  IPv4/IPv6
        oper_type: ''
      },

      terminalForm: [],
      currentPage: 1,
      total: 0,

      rules: {
        data: [
          { validator: validate('ip', '请输入正确IP或MAC'), trigger: 'blur' }
        ]
      },
      rules2: {
        data: [
          { validator: validate('mac', '请输入正确IP或MAC'), trigger: 'blur' }
        ]
      },
      rule: 'ip',

      timer: 0
    }
  },
  methods: {
    headerStyle () {
      return this.header()
    },
    confirmLink () {
      this.$confirm('此操作将跳转至流控页面，时候继续？', '提示', {
        confirmButtonText: '确定',
        cnacelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push('/flowControl')
      }).catch(error => {
        console.log(error)
      })
    },
    forbidLInk () {
      // 功能暂时不需要
      // this.confirmLink()
    },
    limitLink (val) {
      this.confirmLink()
      // this.isLimitVisible = true
      this.addForm.fc_ifname = val.ifname
      this.addForm.fc_start = val.ip
      this.addForm.fc_end = val.ip
      this.addForm.fc_type = 1
    },
    limitSubmit () {
      let para = Object.assign({}, this.addForm)
      para.oper_type = 'add'
      para.page = 1
      para.fc_uprate = Number(para.fc_uprate)
      para.fc_downrate = Number(para.fc_downrate)
      para.fc_bufsize = Number(para.fc_bufsize)
      console.log(para)
      handleFC(para)
        .then((res) => {
          if (res.data.code === 200) {
            this.isLimitVisible = false
          }
          this.$refs['addForm'].resetFields()
        })
        .catch(error => {
          console.log(error)
        })
    },
    judge () {
      console.log(this.request.data)
      if (this.request.data.indexOf(':') > 0) {
        this.rule = 'mac'
        return this.rules2
      } else if (this.request.data.indexOf('.') > 0) {
        this.rule = 'ip'
        return this.rules
      } else {
        return this.rules
      }
    },
    inquery () {
      let para

      let interval = function () {
        getMonitorInfo(para)
          .then((res) => {
            if (res.data.data.length !== 0) {
              this.terminalForm = res.data.data
              this.total = res.data.total
              for (let i = 0; i < res.data.data.length; i++) {
                this.terminalForm[i].send_rate = conversion(this.terminalForm[i].send_rate)
                this.terminalForm[i].recv_rate = conversion(this.terminalForm[i].recv_rate)
                this.terminalForm[i].send_total_length = conversionUnit(this.terminalForm[i].send_total_length)
                this.terminalForm[i].recv_total_length = conversionUnit(this.terminalForm[i].recv_total_length)
                this.terminalForm[i].duration = time(this.terminalForm[i].duration)
              }
            } else {
              if (res.data.total === 0) {
                this.terminalForm = res.data.data
                this.total = res.data.total
              } else {
                this.currentPage -= 1
                this.getTerminalInfo()
              }
            }
          })
          .catch(error => {
            console.log(error)
          })
      }.bind(this)

      this.$refs['form'].validate((valid) => {
        if (valid) {
          // 清除现在正在使用的定时器
          clearInterval(this.timer)

          para = Object.assign({}, this.form)
          para.type = 1
          para.page = this.currentPage
          para[this.rule] = this.request.data

          interval()
          this.timer = setInterval(interval, 2000)
        }
      })
    },

    handleCurrentChange (val) {
      let para = Object.assign({}, this.form)
      para.type = 1
      para.page = this.currentPage
      getMonitorInfo(para)
        .then((res) => {
          if (res.data.code === 200) {
            this.terminalForm = res.data.data
            this.total = res.data.total
            for (let i = 0; i < res.data.data.length; i++) {
              this.terminalForm[i].send_rate = conversion(this.terminalForm[i].send_rate)
              this.terminalForm[i].recv_rate = conversion(this.terminalForm[i].recv_rate)
              this.terminalForm[i].send_total_length = conversionUnit(this.terminalForm[i].send_total_length)
              this.terminalForm[i].recv_total_length = conversionUnit(this.terminalForm[i].recv_total_length)
              this.terminalForm[i].duration = time(this.terminalForm[i].duration)
            }
          }
          this.currentPage = val
        })
        .catch(error => {
          console.log(error)
        })
    },
    getTerminalInfo () {
      let para = Object.assign({}, this.form)
      para.type = 1
      para.page = this.currentPage
      getMonitorInfo(para)
        .then((res) => {
          if (res.data.code === 200) {
            if (res.data.data.length !== 0) {
              this.terminalForm = res.data.data
              this.total = res.data.total
              for (let i = 0; i < res.data.data.length; i++) {
                this.terminalForm[i].send_rate = conversion(this.terminalForm[i].send_rate)
                this.terminalForm[i].recv_rate = conversion(this.terminalForm[i].recv_rate)
                this.terminalForm[i].send_total_length = conversionUnit(this.terminalForm[i].send_total_length)
                this.terminalForm[i].recv_total_length = conversionUnit(this.terminalForm[i].recv_total_length)
                this.terminalForm[i].duration = time(this.terminalForm[i].duration)
              }
            } else {
              if (res.data.total === 0) {
                this.terminalForm = res.data.data
                this.total = res.data.total
              } else {
                this.currentPage -= 1
                this.getTerminalInfo()
              }
            }
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  mounted () {
    this.getTerminalInfo()
    this.timer = setInterval(() => {
      this.getTerminalInfo()
    }, 2000)
  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>

<style scoped>
  .line_02{
    margin-bottom: 20px;
    margin-top: 30px;
    height: 1px;
    border-top: 1px solid #ddd;
    text-align: left;
    color: #909399
  }
  .line_02 span{
    position: relative;
    top: -10px;
    background: #fff;
    padding: 0 30px 0 0;
    font-weight: bold
  }
</style>
