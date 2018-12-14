<template>
  <section>

    <div class="line_02">
      <span>{{ $t('flowControl.flowControl') }}</span>
    </div>

    <el-col
      :span="24"
      class="toolbar"
      style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item>
          <el-button
            type="primary"
            @click="showChooseFCType">{{ $t('flowControl.addStrategy') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="danger"
            @click="batchDelete">{{ $t('flowControl.delete') }}</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <el-table
      :data="form"
      @selection-change="selsChange"
      class="table"
      :header-cell-style="headerStyle">
      <el-table-column
        type="selection"
        min-width="30"/>
      <el-table-column
        prop="fc_start"
        :label="$t('flowControl.start')"
        min-width="120"/>
      <el-table-column
        prop="fc_end"
        :label="$t('flowControl.end')"
        min-width="120"/>
      <el-table-column
        prop="fc_proto"
        :label="$t('flowControl.protocol')"
        min-width="120"/>
      <el-table-column
        prop="fc_ifname"
        :label="$t('flowControl.interface')"
        min-width="120"/>
      <el-table-column
        prop="fc_uprate"
        :label="$t('flowControl.upRate')"
        min-width="120"/>
      <el-table-column
        prop="fc_downrate"
        :label="$t('flowControl.downRate')"
        min-width="120"/>
      <el-table-column
        prop="fc_bufsize"
        :label="$t('flowControl.bufferSize')"
        min-width="120"/>
      <el-table-column
        :label="$t('operation.operation')"
        min-width="80">
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="deleteInfo(scope.$index, scope.row)">{{ $t('operation.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="5"
      layout="total, prev, pager, next, jumper"
      :total="total"/>

    <el-table
      :data="netForm"
      @selection-change="selsChange"
      class="table1"
      :header-cell-style="headerStyle">
      <el-table-column
        type="selection"
        min-width="30"/>
      <el-table-column
        prop="fc_uprate"
        :label="$t('flowControl.upRate')"
        min-width="120"/>
      <el-table-column
        prop="fc_downrate"
        :label="$t('flowControl.downRate')"
        min-width="120"/>
      <el-table-column
        prop="fc_bufsize"
        :label="$t('flowControl.bufferSize')"
        min-width="120"/>
      <el-table-column
        prop="fc_ifname"
        :label="$t('flowControl.interface')"
        min-width="120"/>
      <el-table-column
        :label="$t('operation.operation')"
        min-width="60">
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="deleteInfo(scope.$index, scope.row)">{{ $t('operation.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @current-change="handleNetCurrentChange"
      :current-page="netCurrentPage"
      :page-size="5"
      layout="total, prev, pager, next, jumper"
      :total="netTotal"/>

    <!-- 添加流控策略 -->
    <el-dialog
      title="添加流控策略"
      :visible.sync="isChooseFCTypeVisible">
      <el-form :model="addForm">
        <el-form-item
          prop="fc_type"
          label="流控策略">
          <el-select
            v-model="addForm.fc_type"
            placeholder="请选择">
            <el-option
              v-for="(item, index) in FCType"
              :key="index"
              :label="item.name"
              :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button @click="cancelFCTypeForm">取消</el-button>
        <el-button
          type="primary"
          @click="FCTypeNextStop()">下一步</el-button>
      </div>
    </el-dialog>

    <!-- 添加针对协议的页面 -->
    <el-dialog
      title="添加流控策略"
      :visible.sync="isProtoVisible">
      <el-form
        :model="addForm"
        ref="addForm"
        label-width="120px">
        <el-form-item
          prop="fc_type"
          label="协议类型"
          required>
          <el-select
            v-model="addForm.fc_proto"
            placeholder="请选择"
            @change="editForm">
            <el-option
              v-for="(item, index) in proto"
              :key="index"
              :label="item.name"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="fc_start"
          label="起始IP地址"
          required>
          <el-input v-model="addForm.fc_start"/>
        </el-form-item>
        <el-form-item
          prop="fc_end"
          label="结束IP地址"
          required>
          <el-input v-model="addForm.fc_end"/>
        </el-form-item>
        <!-- <el-form-item prop="fc_sport" label="起始端口" :required="isProto">
          <el-input v-model="addForm.fc_sport" :disabled="!isProto"></el-input>
        </el-form-item>
        <el-form-item prop="fc_eport" label="结束端口" :required="isProto">
          <el-input v-model="addForm.fc_eport" :disabled="!isProto"></el-input>
        </el-form-item> -->
        <el-form-item
          prop="rate"
          label="上行速率(KB/s)"
          required>
          <el-input
            type="number"
            v-model="addForm.fc_uprate"/>
        </el-form-item>
        <el-form-item
          prop="rate"
          label="下行速率(KB/s)"
          required>
          <el-input
            type="number"
            v-model="addForm.fc_downrate"/>
        </el-form-item>
        <el-form-item
          prop="fc_bufsize"
          label="缓冲区大小(KB)">
          <el-input
            type="number"
            v-model="addForm.fc_bufsize"/>
        </el-form-item>
        <el-form-item
          prop="data"
          label="网口"
          required>
          <el-select
            v-model="addForm.fc_ifname"
            placeholder="请选择">
            <el-option
              v-for="(item, index) in ports"
              :key="index"
              :label="item.webname"
              :value="item.enname"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button @click="cancelProtoForm">取消</el-button>
        <el-button
          type="primary"
          @click="addProto">确认</el-button>
      </div>
    </el-dialog>

    <!-- 针对网口策略 -->
    <el-dialog
      title="添加流控策略"
      :visible.sync="isNetVisible">
      <el-form
        :model="addForm"
        ref="addForm"
        label-width="120px">
        <el-form-item
          prop="fc_uprate"
          label="上行速率(KB/s)"
          required>
          <el-input
            type="number"
            v-model="addForm.fc_uprate"/>
        </el-form-item>
        <el-form-item
          prop="fc_downrate"
          label="下行速率(KB/s)"
          required>
          <el-input
            type="number"
            v-model="addForm.fc_downrate"/>
        </el-form-item>
        <el-form-item
          prop="fc_bufsize"
          label="缓冲区大小(KB)">
          <el-input
            type="number"
            v-model="addForm.fc_bufsize"/>
        </el-form-item>
        <el-form-item
          prop="data"
          label="网口"
          required>
          <el-select
            v-model="addForm.fc_ifname"
            placeholder="请选择">
            <el-option
              v-for="(item, index) in ports"
              :key="index"
              :label="item.webname"
              :value="item.enname"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button @click="cancelNetForm">取消</el-button>
        <el-button
          type="primary"
          @click="addNet">确认</el-button>
      </div>
    </el-dialog>

  </section>
</template>

<script>
import { getFC, handleFC, getPorts } from '@/api/api.js'
import { flowconversion, flowconversionUnit } from '@/utils/rateUnitExchange.js'
import validate from '@/utils/rules.js'

export default {
  name: 'FlowControl',
  data () {
    return {
      isChooseFCTypeVisible: false,
      isProtoVisible: false,
      isNetVisible: false,
      isProto: false,
      currentPage: 1,
      netCurrentPage: 1,
      total: 1,
      netTotal: 1,

      form: [],
      netForm: [],
      addForm: {
        fc_type: '', // 1:ip flowtl   2: net interface flowtl
        fc_enable: '', // 是否启用流控
        fc_proto: '', // 流控协议
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
      FCType: [
        {
          name: '针对网口进行流量控制',
          value: 2 // 'net interface flowctl'
        },
        {
          name: '针对具体协议进行流量控制',
          value: 1 // 'ip flowctl'
        }
      ],
      proto: [
        {
          name: 'TCP',
          value: 'tcp'
        },
        {
          name: 'UDP',
          value: 'udp'
        },
        // {
        //   name: 'ICMP',
        //   value: 1
        // },
        {
          name: '所有协议',
          value: 'all'
        }
      ],

      sels: [],
      ports: [],
      options: [],

      rules: {
        rate: [
          {
            validator: validate('ip', '请输入正确IP', '地址不能为空')
          }
        ],
        fc_bufsize: [
          {
            min: 0, max: 99999999, message: '范围为0~99999999', trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    headerStyle () {
      return this.header()
    },
    triggerChooseFCTypeVisible () {
      this.isChooseFCTypeVisible = !this.isChooseFCTypeVisible
    },
    triggerProtoVisible () {
      this.isProtoVisible = !this.isProtoVisible
    },
    triggerNetVisible () {
      this.isNetVisible = !this.isNetVisible
    },
    showChooseFCType () {
      this.triggerChooseFCTypeVisible()
    },
    showProto () {
      this.triggerProtoVisible()
    },
    showNet () {
      this.triggerNetVisible()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getFCInfo()
    },
    handleNetCurrentChange (val) {
      this.netCurrentPage = val
      this.getFCNetInfo()
    },
    selsChange: function (sels) {
      this.sels = sels
    },
    editForm: function () {
      if (this.addForm.fc_proto === 'all') {
        this.isProto = false
      } else {
        this.isProto = true
      }
      console.log(this.isProto)
    },
    FCTypeNextStop () {
      if (this.addForm.fc_type === 2) {
        this.showNet()
      }
      if (this.addForm.fc_type === 1) {
        this.showProto()
      }
    },
    cancelFCTypeForm () {
      this.triggerChooseFCTypeVisible()
    },
    addProto () {
      let para = Object.assign({}, this.addForm)
      para.oper_type = 'add'
      para.page = this.currentPage
      para.fc_sport = Number(para.fc_sport)
      para.fc_eport = Number(para.fc_eport)
      para.fc_uprate = Number(para.fc_uprate)
      para.fc_downrate = Number(para.fc_downrate)
      para.fc_bufsize = Number(para.fc_bufsize)
      handleFC(para)
        .then(res => {
          if (res.data.code === 200) {
            this.getFCInfo()
            this.triggerProtoVisible()
            this.triggerChooseFCTypeVisible()
            this.$refs['addForm'].resetFields()
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    addNet () {
      let para = Object.assign({}, this.addForm)
      para.oper_type = 'add'
      para.page = this.currentPage
      para.fc_uprate = Number(para.fc_uprate)
      para.fc_downrate = Number(para.fc_downrate)
      para.fc_bufsize = Number(para.fc_bufsize)
      handleFC(para)
        .then(res => {
          if (res.data.code === 200) {
            this.getFCNetInfo()
            this.triggerNetVisible()
            this.triggerChooseFCTypeVisible()
            this.$refs['addForm'].resetFields()
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    cancelProtoForm () {
      this.triggerProtoVisible()
      this.triggerChooseFCTypeVisible()
      this.$refs['addForm'].resetFields()
    },
    cancelNetForm () {
      this.triggerNetVisible()
      this.triggerChooseFCTypeVisible()
      this.$refs['addForm'].resetFields()
    },
    getFCInfo () {
      let para = Object.assign({}, this.addForm)
      para.oper_type = 'flowctl'
      para.fc_type = 1
      para.page = this.currentPage
      getFC(para)
        .then(res => {
          if (res.data.code === 200) {
            if (res.data.data.length !== 0) {
              this.total = res.data.total
              this.form = res.data.data
              if (this.form.length >= 1) {
                this.form.forEach(val => {
                  this.ports.forEach(item => {
                    if (val.fc_ifname === item.enname) {
                      val.fc_ifname = item.webname
                    }
                  })
                  val.fc_uprate = flowconversion(val.fc_uprate)
                  val.fc_downrate = flowconversion(val.fc_downrate)
                  val.fc_bufsize = flowconversionUnit(val.fc_bufsize)
                })
              }
            } else if (this.currentPage > 1) {
              this.currentPage -= 1
              this.getFCInfo()
            } else {
              this.form = res.data.data
            }
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    getFCNetInfo () {
      let para = Object.assign({}, this.addForm)
      para.oper_type = 'flowctl'
      para.fc_type = 2
      para.page = this.netCurrentPage
      getFC(para)
        .then(res => {
          if (res.data.code === 200) {
            if (res.data.data.length !== 0) {
              this.netTotal = res.data.total
              this.netForm = res.data.data
              if (this.netForm.length >= 1) {
                this.netForm.forEach(val => {
                  this.ports.forEach(item => {
                    if (val.fc_ifname === item.enname) {
                      val.fc_ifname = item.webname
                    }
                  })
                  val.fc_uprate = flowconversion(val.fc_uprate)
                  val.fc_downrate = flowconversion(val.fc_downrate)
                  val.fc_bufsize = flowconversionUnit(val.fc_bufsize)
                })
              }
            } else if (this.currentPage > 1) {
              this.this.netCurrentPage -= 1
              this.getFCNetInfo()
            } else {
              this.netForm = res.data.data
            }
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    deleteInfo (index, row) {
      let para = Object.assign({}, row)
      para.oper_type = 'del'
      getPorts() // wyk修改删除发送enname
        .then(res => {
          if (res.data.code === 200) {
            this.ports = res.data.interfaces
            console.log(this.ports)
          }
          // else if (res.data.code === 123) {

          // }
        })
      for (let i = 0; i < this.ports.length; i++) {
        if (this.ports[i].webname === para.fc_ifname) {
          para.fc_ifname = this.ports[i].enname
        }
      }
      handleFC(para)
        .then(res => {
          if (res.data.code === 200) {
            this.getFCInfo()
            this.getFCNetInfo()
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    async batchDelete () {
      for (let i = 0; i < this.sels.length; i++) {
        del(i, this.sels[i])
      }
      this.getFCInfo()
      this.getFCNetInfo()

      function del (index, row) {
        let para = Object.assign({}, row)
        para.oper_type = 'del'
        handleFC(para)
          .then(res => {
            if (res.data.code !== 200) {
              this.handleFC(para)
            }
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    getPortsInfo: function () {
      getPorts()
        .then(res => {
          if (res.data.code === 200) {
            this.ports = res.data.interfaces
            console.log(this.ports)
          }
          // else if (res.data.code === 123) {

          // }
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  mounted () {
    this.getPortsInfo()
    this.getFCNetInfo()
    this.getFCInfo()
  }
}
</script>

<style scoped>
.el-input {
  width: 80%;
}
.el-select {
  width: 80%;
}
.table1 {
  margin-top: 50px;
}
.el-pagination {
  float: right;
}
</style>
