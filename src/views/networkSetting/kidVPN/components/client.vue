<template>
  <section>
    <div class="line_02">
      <span>{{ $t('kidVPN.client.title') }}</span>
    </div>

    <el-col
      :span="24"
      style="padding: 0">
      <el-form inline>
        <el-form-item>
          <el-button
            type="primary"
            @click="addClient">{{ $t('kidVPN.client.button1') }}</el-button>
        </el-form-item>
        <!-- 10.29 pky 要求去掉批量删除功能 -->
        <!-- <el-form-item>
          <el-button
            type="danger"
            @click="batchDeletion">{{ $t('kidVPN.client.button2') }}</el-button>
        </el-form-item> -->
      </el-form>
    </el-col>

    <el-table
      :data="addedClientList"
      style="width: 100%"
      @selection-change="selChange"
      :header-cell-style="headerStyle">
      <el-table-column
        type="selection"
        min-width="30"/>
      <el-table-column
        prop="vndid"
        :label="$t('kidVPN.client.vndid')"
        min-width="120"/>
      <el-table-column
        prop="serip"
        :label="$t('kidVPN.client.serip')"
        min-width="120"/>
      <el-table-column
        prop="locip"
        :label="$t('kidVPN.client.locip')"
        min-width="120"/>
      <el-table-column
        prop="netmask"
        :label="$t('kidVPN.client.netmask')"
        min-width="120"/>
      <el-table-column
        prop="gateway"
        :label="$t('kidVPN.client.gateway')"
        min-width="120"/>
      <el-table-column
        prop="mtu"
        :label="$t('kidVPN.client.mtu')"
        min-width="60"/>
      <el-table-column
        prop="position"
        :label="$t('kidVPN.client.serverLoc')"
        min-width="120"/>
      <el-table-column
        prop="status"
        :label="$t('kidVPN.client.status')"
        min-width="120"/>
      <el-table-column
        :label="$t('operation.operation')"
        min-width="60">
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="deleteClient(scope.$index, scope.row)">{{ $t('operation.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="5"
      layout="total, prev, pager, next, jumper"
      :total="total"/>

    <el-dialog
      :title="$t('kidVPN.client.title1')"
      :visible.sync="isAddingClient">
      <el-form
        :model="VNDForm"
        :rules="rules"
        :label-width="labelWidth"
        label-position="left">
        <el-form-item
          prop="ipaddr"
          :label="$t('kidVPN.client.ipaddr')">
          <el-input v-model="VNDForm.ipaddr"/>
        </el-form-item>
        <el-form-item
          prop="netmask"
          :label="$t('kidVPN.client.netmask')">
          <el-input v-model="VNDForm.netmask"/>
        </el-form-item>
        <el-form-item
          prop="gateway"
          :label="$t('kidVPN.client.gateway')">
          <el-input v-model="VNDForm.gateway"/>
        </el-form-item>
        <el-form-item
          prop="mac"
          :label="$t('kidVPN.client.mac')">
          <el-input v-model="VNDForm.mac"/>
        </el-form-item>
        <el-form-item
          prop="mtu"
          :label="$t('kidVPN.client.mtu')">
          <el-input v-model="VNDForm.mtu"/>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button
          type="danger"
          @click="triggerAddKidVPNClient">{{ $t('operation.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="kidVPNNextStep">{{ $t('kidVPN.client.button3') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="$t('kidVPN.client.title2')"
      :visible.sync="isLinkingClient"
      class="key">
      <el-form
        :model="kidVPNForm"
        :label-width="labelWidth">
        <el-form-item
          prop="ipaddr"
          :label="$t('kidVPN.client.ipaddr1')">
          <el-input v-model="kidVPNForm.ipaddr"/>
        </el-form-item>
        <el-form-item
          prop="port"
          label="服务器端口">
          <el-input
            type="number"
            v-model="kidVPNForm.port"/>
        </el-form-item>
        <el-form-item
          prop="passwd"
          label='密码'>
          <el-input
            v-model="kidVPNForm.passwd"/>
        </el-form-item>
        <el-form-item
          prop="aeskey"
          :label="$t('kidVPN.client.aeskey')">
          <textarea
            v-model="kidVPNForm.aeskey"
            class="aeskey"/>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button
          type="danger"
          @click="triggerLinkKidVPNClient">{{ $t('operation.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="linkKidVPN">{{ $t('operation.determine') }}</el-button>
      </div>
    </el-dialog>
  </section>
</template>

/**
 * 该页面代码已合
 */
<script>
import {
  addVND,
  addKidVPN,
  delKidVPN,
  getKidVPNInfo
} from '@/api/api.js'
import validate from '@/utils/rules.js'
let timer
export default {
  name: 'Client',
  data () {
    return {
      isAddingClient: false,
      isLinkingClient: false,
      currentPage: 1,
      total: 0,
      addedClientList: [],
      VNDForm: {
        ipaddr: '',
        netmask: '',
        gateway: '',
        mtu: '',
        mac: ''
      },
      kidVPNForm: {
        vndid: Number, // 虚拟网卡IP
        ipaddr: '', // IP地址
        port: '',
        aeskey: '', // AES KEY
        mtu: '', // MTU
        passwd: '',
        handle: ''
      },
      vndid: '',
      chosenItems: [],
      labelWidth: '8rem',

      rules: {
        ipaddr: [
          {
            validator: validate('ip', '请输入正确IP', 'IP不能为空！'),
            trigger: 'blur'
          }
        ],
        netmask: [
          {
            validator: validate(
              'ip',
              '请输入正确子网掩码',
              '子网掩码不能为空！'
            ),
            trigger: 'blur'
          }
        ],
        gateway: [
          {
            validator: validate(
              'ip',
              '请输入正确网关地址',
              '网关地址不能为空！'
            ),
            trigger: 'blur'
          }
        ],
        mac: [
          {
            validator: validate(
              'mac',
              '请输入正确MAC地址',
              'MAC地址不能为空！'
            ),
            trigger: 'blur'
          }
        ],
        mtu: [
          {
            validator: validate('number', '请输入数字', '不能为空！'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    headerStyle () {
      return this.header()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getInfo()
    },
    triggerAddKidVPNClient () {
      this.isAddingClient = !this.isAddingClient
    },
    triggerLinkKidVPNClient () {
      this.isLinkingClient = !this.isLinkingClient
    },
    addClient () {
      this.triggerAddKidVPNClient()
    },
    kidVPNNextStep () {
      let para = Object.assign({}, this.VNDForm)

      addVND(para)
        .then(res => {
          if (res.data.code === 200) {
            this.vndid = res.data.vndid
          }
          this.triggerAddKidVPNClient()
          this.triggerLinkKidVPNClient()
        })
        .catch(error => {
          console.log(error)
        })
    },

    linkKidVPN () {
      let para = Object.assign({}, this.kidVPNForm)
      para.port = Number(para.port)
      para.vndid = this.vndid
      para.mtu = this.VNDForm.mtu
      para.handle = 'addClient'

      addKidVPN(para)
        .then(res => {
          if (res.data.code === 200) {
            this.getInfo()
          } else if (res.data.code === 100) {
            this.$message({
              message: '参数错误',
              type: 'error'
            })
          } else if (res.data.code === 500) {
            this.$message({
              message: '操作失败',
              type: 'error'
            })
          }
          this.triggerLinkKidVPNClient()
        })
        .catch(error => {
          console.log(error)
        })
    },

    deleteClient (index, val) {
      let para = {}
      para.vndid = val.vndid

      delKidVPN(para)
        .then(res => {
          if (res.data.code === 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
      this.getInfo()
    },
    selChange (sels) {
      this.chosenItems = sels
    },
    async batchDeletion () {
      let i
      for (i = 0; i < this.chosenItems.length; i++) {
        await this.deleteClient(i, this.chosenItems[i])
      }
    },
    getInfo () {
      // let result
      let para = {}
      para.page = this.currentPage
      getKidVPNInfo(para)
        .then(res => {
          if (res.data.code === 200) {
            if (this.currentPage === res.data.page) {
              if (res.data.data.length !== 0) {
                console.log('infor ' + res.data.data.length)

                let param = res.data.data
                this.total = res.data.total

                for (let i = 0; i < param.length; i++) {
                  if (param[i].type === 'servervpn') {
                    console.log('in clinet getInfo' + JSON.stringify(param[i]))
                    param.splice(i, 1)
                    i -= 1
                    this.total -= 1
                  }
                }
                console.log(param)
                if (param.status === 'OFF') {
                  param.status = '连接成功'
                } else {
                  param.status = '连接失败'
                }
                this.addedClientList = param
                console.log(this.addedClientList)
              } else if (res.data.page > 1) {
                this.currentPage -= 1
                this.getInfo()
              } else {
                this.addedClientList = res.data.data
              }
            }
          }
        })
        .catch(error => {
          console.log(error)
        })
    },

    // 处理兄弟组件的bus事件
    liseterUpdate () {
      this.bus.$on('update', this.getInfo())
    }
  },
  mounted () {
    this.getInfo()
    timer = setInterval(this.getInfo, 2000)
  },
  destroyed () {
    clearInterval(timer)
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
textarea {
  resize: none;
  width: 80%;
  height: 100%;
  padding: 0;
  margin-top: .5rem;
}
</style>
