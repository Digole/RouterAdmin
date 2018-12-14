<template>
  <section>
    <el-col
      :span="24"
      class="title">
      <el-form inline>
        <el-form-item>
          <el-button
            type="primary"
            @click="addServer"
            v-if="isEmpty">{{ $t('kidVPN.server.button5') }}</el-button>
            <!-- <el-button type="danger" size="mini" @click="delServer">{{$t('kidVPN.server.button1')}}</el-button> -->
        </el-form-item>
      </el-form>
    </el-col>

    <el-table
      :data="addedClientList"
      :header-cell-style="headerStyle">
      <el-table-column
        prop="vndid"
        :label="$t('kidVPN.server.vndid')"
        min-width="120" />
      <el-table-column
        prop="serip"
        :label="$t('kidVPN.server.serip')"
        min-width="150" />
      <el-table-column
        prop="locip"
        :label="$t('kidVPN.server.locip')"
        min-width="120" />
      <el-table-column
        prop="netmask"
        :label="$t('kidVPN.server.netmask')"
        min-width="120" />
      <el-table-column
        prop="gateway"
        :label="$t('kidVPN.server.gateway')"
        min-width="120" />
      <el-table-column
        prop="mac"
        :label="$t('kidVPN.server.mac')"
        min-width="120" />
      <el-table-column
        prop="mtu"
        type="number"
        :label="$t('kidVPN.server.mtu')"
        min-width="120" />
      <el-table-column
        :label="$t('operation.operation')"
        min-width="120">
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="delServer(scope.index, scope.row)">{{ $t('operation.delete') }}</el-button>
          <el-button
            size="small"
            @click="getAESKeyInfo(scope.row)">显示AES Key</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      @current-change="handleChange" />

    <el-dialog
      :title="$t('kidVPN.server.title2')"
      :visible.sync="isAddingServer">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="120px">
        <el-form-item
          prop="ipaddr"
          :label="$t('kidVPN.server.ipaddr')">
          <el-input v-model="form.ipaddr" />
        </el-form-item>
        <el-form-item
          prop="netmask"
          :label="$t('kidVPN.server.netmask')">
          <el-input v-model="form.netmask" />
        </el-form-item>
        <el-form-item
          prop="gateway"
          :label="$t('kidVPN.server.gateway')">
          <el-input v-model="form.gateway" />
        </el-form-item>
        <el-form-item
          prop="mac"
          :label="$t('kidVPN.server.mac')">
          <el-input v-model="form.mac" />
        </el-form-item>
        <el-form-item
          prop="mtu"
          type="number"
          :label="$t('kidVPN.server.mtu')">
          <el-input v-model="form.mtu" />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button
          type="danger"
          @click="triggerAddingServer">{{ $t('operation.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="KidVPNServerNextStop">{{ $t('kidVPN.server.button3') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="$t('kidVPN.server.title3')"
      :visible.sync="isInitingKey"
      @close="triggerCanCreateServer"
      class="key">
      <el-form
        :model="initAESKeyForm"
        :rules="rules"
        label-width="150px">
        <el-form-item
          prop="ipaddr"
          :label="$t('kidVPN.server.ipaddr1')">
          <el-input v-model="initAESKeyForm.ipaddr" />
        </el-form-item>
        <el-form-item
          prop="port"
          label="服务器端口">
          <el-input
            type="number"
            v-model="initAESKeyForm.port" />
        </el-form-item>
        <el-form-item
          prop="bit"
          :label="$t('kidVPN.server.bit')">
          <el-select v-model="initAESKeyForm.bit">
            <el-option
              v-for="(item, index) in bitList"
              :key="index"
              :label="item"
              :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item
          prop="passwd"
          label="密码">
          <el-input v-model="initAESKeyForm.passwd" />
        </el-form-item>
        <el-form-item
          prop="aeskey"
          :label="$t('kidVPN.server.aeskey')">
          <textarea
            v-model="initAESKeyForm.aeskey"
            disabled />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button
          type="danger"
          @click="initAESKey">{{ $t('kidVPN.server.button4') }}</el-button>
        <el-button
          type="primary"
          :disabled="!canCreateServer"
          @click="saveKey">{{ $t('kidVPN.server.button5') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="$t('kidVPN.server.title3')"
      :visible.sync="isGettingKey"
      class="key">
      <el-form
        :model="getAESKeyForm"
        label-width="8rem">
        <el-form-item
          prop="aeskey"
          :label="$t('kidVPN.server.aeskey')">
          <textarea v-model="getAESKeyForm.aeskey"/>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button
          type="danger"
          @click="closeGettingKey">{{ $t('kidVPN.server.button6') }}</el-button>
      </div>
    </el-dialog>

  </section>
</template>

<script>
import {
  addVND,
  addKidVPN,
  generateAESKey,
  getAESKey,
  getKidVPNInfo,
  delKidVPN
} from '@/api/api.js'
import validate from '@/utils/rules.js'

export default {
  name: 'Server',
  data () {
    let mtu = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入MTU'))
      } else if (value > 1472 || value < 1280) {
        callback(new Error('请输入1280~1472之间的数字'))
      }
      callback()
    }
    return {
      isAddingServer: false,
      isInitingKey: false,
      isGettingKey: false,
      isEmpty: true,
      canCreateServer: false, //  创建VPN服务器 按钮是否可用
      addedForm: [],
      addedClientList: [],
      form: {
        serip: '',
        netmask: '',
        gateway: '',
        mtu: '',
        mac: '',
        vndid: ''
      },
      initAESKeyForm: {
        vndid: '',
        ipaddr: '',
        port: '',
        bit: '',
        aeskey: '',
        passwd: ''
      },
      getAESKeyForm: {
        ipaddr: '',
        aeskey: ''
      },
      bitList: ['128', '192', '256'],
      AESKey: '',
      vndid: '',

      total: 0,
      currentPage: 1,
      pageSize: 5,

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
            validator: mtu,
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
    addServer () {
      this.triggerAddingServer()
    },
    triggerAddingServer () {
      this.isAddingServer = !this.isAddingServer
    },
    triggerInitingKey () {
      this.isInitingKey = !this.isInitingKey
    },
    triggerGettingKey () {
      this.isGettingKey = !this.isGettingKey
    },
    triggerCanCreateServer () {
      this.canCreateServer = !this.canCreateServer
    },
    closeGettingKey () {
      this.triggerGettingKey()
    },
    handleChange (val) {
      this.currentPage = val
      this.getInfo()
    },
    KidVPNServerNextStop () {
      console.log('hello')
      this.$refs['form'].validate(valid => {
        console.log(valid)
        if (valid) {
          let para = Object.assign({}, this.form)
          // para.handle = 'addServer'
          addVND(para).then(res => {
            if (res.data.code === 200) {
              this.vndid = res.data.vndid
            }
          })
          this.triggerAddingServer()
          this.triggerInitingKey()
          this.getInfo()
          // this.$refs["forms"].resetFields()
        }
      })
    },
    initAESKey () {
      let para = {}
      para.bit = this.initAESKeyForm.bit
      generateAESKey(para)
        .then(res => {
          if (res.data.code === 200) {
            this.initAESKeyForm.aeskey = res.data.aeskey
            // this.triggerGettingKey()
            this.canCreateServer = true
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    saveKey () {
      let para = Object.assign({}, this.initAESKeyForm)
      para.port = Number(para.port)
      para.handle = 'addServer'
      para.vndid = this.vndid
      para.mtu = this.form.mtu
      addKidVPN(para)
        .then(res => {
          if (res.data.code === 200) {
            this.$message({
              message: '发送成功',
              type: 'success'
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
      this.triggerInitingKey()
      // this.addedClientList = Object.assign( {}, this.form )
      this.getServerInfo()
    },
    delServer (index, val) {
      let para = {}
      para.vndid = val.vndid
      delKidVPN(para).then(res => {
        if (res.data.code === 200) {
          this.getServerInfo()
          // this.$refs['addedClientList'].resetFields()
          this.bus.$emit('update')
        }
      })
    },
    getAESKeyInfo (val) {
      console.log('val is ' + val)
      let para = {
        vndid: val.vndid
      }
      getAESKey(para)
        .then(res => {
          this.getAESKeyForm.aeskey = res.data.aeskey
          this.triggerGettingKey()
        })
        .catch(err => {
          console.log(err)
        })
    },
    iconToGetAESKeyInfo () {
      let para = {}
      para.vndid = this.addedClientList.vndid
      getAESKey(para).then(res => {
        this.getAESKeyForm.aeskey = res.data.aeskey
      })
      // this.triggerGettingKey()
    },
    getInfo () {
      let para = {}
      para.page = this.currentPage
      this.addedClientList = []
      getKidVPNInfo(para)
        .then(res => {
          if (res.data.code === 200) {
            if (this.currentPage === res.data.page) {
              // if (res.data.total !== 0) {
              //   for (let i = 0; i < res.data.data.length; i++) {
              //     if (res.data.data[i].type === 'servervpn') {
              //       // this.addedClientList = res.data.data[i]
              //       this.addedClientList.push(res.data.data[i])
              //       this.total += 1
              //     }
              //   }
              // }
              if (res.data.data.length !== 0) {
                console.log('infor ' + res.data.data.length)

                let param = res.data.data
                this.total = res.data.total

                for (let i = 0; i < param.length; i++) {
                  if (param[i].type === 'clientvpn') {
                    console.log('in sever getInfo' + JSON.stringify(param[i]))
                    param.splice(i, 1)
                    this.total -= 1
                  }
                }
              } else if (res.data.page > 1) {
                this.currentPage -= 1
                this.getInfo()
              }
            }
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    getServerInfo () {
      let para = {}
      para.page = this.currentPage
      // this.addedClientList = []
      getKidVPNInfo(para).then(res => {
        if (res.data.code === 200) {
          if (this.currentPage === res.data.page) {
            if (res.data.data.length !== 0) {
              console.log('infor ' + res.data.data.length)

              let param = res.data.data
              this.total = res.data.total

              for (let i = 0; i < param.length; i++) {
                if (param[i].type === 'clientvpn') {
                  console.log('in clinet getInfo' + JSON.stringify(param[i]))
                  param.splice(i, 1)
                  i -= 1 // splice会改变原数组
                  this.total -= 1
                }
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
    }
  },
  mounted () {
    // this.getInfo()
    this.getServerInfo()
  }
}
</script>

<style scoped>
.title {
  text-align: left;
  vertical-align: baseline;
}
.form {
  overflow: hidden;
  margin-top: 1rem;
  background: #bbbbbb;
}
.form > .el-form {
  margin: 15px;
}
img {
  width: 20px;
  height: 20px;
}
textarea {
  height: 90px;
  line-height: 30px;
  resize: none;
  background-color: #bbbbbb;
}
.key .el-input,
.el-select,
textarea {
  width: 80%;
}
</style>
