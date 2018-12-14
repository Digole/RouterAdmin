<template>
  <section>

    <!--power button-->
    <div class="power">
      <div class="power-button">
        <img
          :src="powerButton"
          style="width: 60px; height: 50px; border-radius: 5px;" >
        <div class="text-area">
          <p class="text">调试</p>
        </div>
      </div>
    </div>

    <div class="router">
      <div
        v-for="(item, index) in ports"
        :key="index"
        class="port"
        @click="dialog(index)">
        <div>
          <el-tooltip
            class="item"
            effect="light">
            <img
              :src="selectUrl(item.linkstatus)"
              style="width: 60px; height: 50px; border-radius: 5px;" >
            <div
              slot="content"
              class="tooltip-content">
              <h3/>
              <el-form
                label-position="left"
                size="mini">
                <el-form-item
                  :label-width="tooltipLabelWidth"
                  label="连接状态:"
                  style="margin: 0;">
                  {{ ports[index].linkstatus }}
                </el-form-item>
                <el-form-item
                  :label-width="tooltipLabelWidth"
                  label="LAN IP:"
                  style="margin: 0;">
                  {{ ports[index].ip }}
                </el-form-item>
                <el-form-item
                  :label-width="tooltipLabelWidth"
                  label="子网掩码:">
                  {{ ports[index].netmask }}
                </el-form-item>
              </el-form>
              <el-form
                label-position="left"
                size="mini">
                <el-form-item
                  :label-width="tooltipLabelWidth"
                  label="设备名称:"
                  style="margin: 0;">
                  {{ ports[index].devname }}
                </el-form-item>
                <el-form-item
                  :label-width="tooltipLabelWidth"
                  label="MAC地址:"
                  style="margin: 0;">
                  {{ ports[index].mac }}
                </el-form-item>
                <el-form-item
                  :label-width="tooltipLabelWidth"
                  label="网卡速率:"
                  style="margin: 0;">
                  {{ ports[index].speed }}
                </el-form-item>
              </el-form>
            </div>
          </el-tooltip>
          <div class="text-area">
            <p class="text">
              <span v-show="item.function !== 'normal'">
                <svg class="icon">
                  <use :xlink:href="selectIcon(item.function)"/>
                </svg>
              </span>
              {{ ports[index].webname }}</p>
          </div>
        </div>
      </div>

      <div
        v-if="checked !== 200"
        class="mask">
        <!-- <div v-if="false" class="mask"> -->
        <!--<div class="mask">-->
        <el-button
          class="button"
          type="primary"
          @click="sortingHandle">{{ $t('NAT.adaptive.maskTip') }}</el-button>
      </div>

    </div>

    <el-dialog
      :visible.sync="sortingVisible"
      title="网口定位"
      width="50%">

      <div>
        <div class="whole-router-in-dialog">
          <!--power button-->
          <div class="power">
            <div class="power-button">
              <img
                :src="powerButton"
                style="width: 60px; height: 50px; border-radius: 5px;" >
              <div class="text-area">
                <p class="text">{{ $t('NAT.adaptive.text') }}</p>
              </div>
            </div>
          </div>

          <div class="router">
            <div
              v-for="(item, index) in ports"
              :key="index"
              class="port">
              <img
                style="width: 60px; height: 50px; border-radius: 5px;"
                src="../../static/port2.png" >
              <div :class="{ 'triangular': index === portsName.index }"/>
              <div class="text-area">
                <p
                  v-if="index < portsName.index"
                  class="text">
                  {{ localName[index] }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--outer dialog-->
      <div style="margin: 10px 0;">
        <span>{{ tip1 }}</span>
        <span style="font-size: 200%; color: red;">{{ portsName.index + 1 }}</span>
        <span>{{ tip2 }}</span>
      </div>

      <div
        v-loading="sortLoading"
        style="display: flex; align-items: center;">
        <el-form
          ref="portsName"
          :model="portsName"
          label-position="left"
          size="small">
          <el-form-item
            :label="$t('NAT.adaptive.portsNameTip')"
            :label-width="tooltipLabelWidth"
            style="margin: 0 20px 0 0">
            <el-input
              v-model="portsName.name"
              :placeholder="name()"/>
          </el-form-item>
        </el-form>
        <div>{{ $t('NAT.adaptive.tipText') }}</div>
      </div>
      <div
        slot="footer"
        class="dialog-footer">
        <!-- <el-button type="danger" @click="sortingCancel">{{$t('operation.cancel')}}</el-button> -->
        <el-button
          v-if="portsName.index < ports.length-1"
          :disabled="sortLoading"
          type="primary"
          @click="sortingNextStep">{{ $t('operation.next') }}</el-button>
        <el-button
          v-else
          :disabled="sortLoading"
          type="primary"
          @click="sortingFinish">{{ $t('operation.complete') }}</el-button>
      </div>
    </el-dialog>

    <!--WAN,LAN outer dialogue-->
    <el-dialog
      :visible.sync="dialogFormVisible"
      title="LAN/WAN口设置"
      width="30%">
      <el-form
        :model="WANForm"
        label-position="left"
        size="small">
        <el-form-item
          v-loading="WANLANLoading"
          :label-width="formLabelWidth"
          label="选择功能">
          <el-select
            v-model="WANForm.use"
            placeholder="请选择内外网">
            <el-option
              :disabled="isInuseLAN"
              label="LAN（内网）"
              value="lan"/>
            <el-option
              :disabled="isInuseWAN"
              label="WAN（外网）"
              value="wan"/>
          </el-select>
        </el-form-item>
      </el-form>
      <p
        v-if="lanLimit <= lanCount && !WANLANLoading"
        style="color: red;">LAN口数量到达上限</p>
      <p
        v-if="wanLimit <= wanCount && !WANLANLoading"
        style="color: red;">WAN口数量到达上限</p>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button
          :disabled="unbindEnable"
          type="danger"
          @click="unbind">{{ $t('operation.unbind') }}</el-button>
        <el-button
          :disabled="WANForm.use === ''"
          type="primary"
          @click="WANLANSubmit">{{ $t('operation.submit') }}</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import {
  getPorts,
  sendSorting,
  sendWANLAN,
  sortingCancel
} from '@/api/api.js'

let stopSignal1, stopSignal3, stopSignal4
export default {
  name: 'Adaptive',
  data () {
    return {
      dialogFormVisible: false, // LAN,WAN设置
      sortingVisible: false, // 端口自适应排序显示控制

      form: {
        number: '', // 端口编号，唯一，通过index确认端口
        use: '', // 选择功能LAN/WAN
        IP: '',
        mask: '', // 子网掩码
        gateway: '', // 网关
        mode: '1', // 工作模式
        rate: '1', // 网卡速率 lan
        control: '', // lan互访控制
        accessMethod: '1', // 接入方式
        primaryDNS: '', // 首选DNS
        secondaryDNS: '', // 备选DNS
        status: '未连接' // 连接状态，ASDL使用该属性
      },
      sendForm: {
        webnetif: '', // 端口编号，唯一，通过index确认端口
        use: '', // 选择功能LAN/WAN
        handle: '' // 添加为1，解绑为0
      },
      WANForm: {
        index: '', // 端口编号，唯一，通过index确认端口
        use: '', // 选择功能LAN/WAN
        handle: '' // 添加为1，解绑为0
      },

      portsName: {
        index: '',
        name: '',
        flag: ''
      },

      localName: [],

      ports: [],
      checked: '', // 检查是否已自适应端口排序

      powerButton: 'static/port3.png',
      tips: [
        '请只接通第',
        '个网口，并为其设置网口名',
        '请只接通第',
        '个网口',
        '请插入网线，连通当前网口'
      ],
      tip1: '请只接通第',
      tip2: '个网口，并为其设置网口名',

      wanLimit: '',
      lanLimit: '',
      wanCount: 0,
      lanCount: 0,
      unbindEnable: false, // 绑定LAN/WAN口时，判断当前端口是否已被占用。是否可以解绑
      isInuseLAN: false, // 绑定LAN/WAN口时，判断当前端口是否已被占用。加上LAN上限是否超过
      isInuseWAN: false, // 绑定LAN/WAN口时，判断当前端口是否已被占用。加上LAN上限是否超过

      WANLANLoading: false,
      sortLoading: false,

      tooltipLabelWidth: '100px',
      formLabelWidth: '130px'
    }
  },
  watch: {
    checked: function () {
      if (this.checked !== 200) {
        this.$confirm('此操作将删除当前端口排序, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '开始重新定位!'
          })
          this.sortingHandle()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    }
  },
  mounted () {
    this.getPortsInfoBegin()
    // this.interval();
  },
  beforeDestroy () {
    clearInterval(stopSignal1)
    clearInterval(stopSignal3)
    clearInterval(stopSignal4)
  },
  methods: {
    modifyChecked () {
      this.checked = 0
    },

    interval () {
      stopSignal1 = setInterval(this.getPortsInfo, 5000)
    },

    // 获取ports信息
    getPortsInfo: function () {
      getPorts()
        .then(res => {
          if (res.data.code === 200) {
            this.wanLimit = res.data.wancount
            this.lanLimit = res.data.lancount
            let lanCount = 0
            let wanCount = 0
            for (let i = 0; i < res.data.interfaces.length; i++) {
              if (res.data.interfaces[i].function.toLowerCase() === 'wan') {
                wanCount++
                console.log('wanCount is ' + wanCount)
              }
              if (res.data.interfaces[i].function.toLowerCase() === 'lan') {
                lanCount++
                console.log('lanCount is ' + lanCount)
              }
            }
            this.lanCount = lanCount
            this.wanCount = wanCount

            res.data.interfaces.sort(sortNumber)

            // console.log("get feedback, res.data.interfaces is: "+res.data.interfaces);
            this.checked = JSON.parse(JSON.stringify(res.data.code))
            this.$store.dispatch('setAdaptive', this.checked)
            console.log('commit adaptive ' + this.checked)
            this.ports = JSON.parse(JSON.stringify(res.data.interfaces))
            console.log(
              'after parse, the port[] is: ' + JSON.stringify(res.data.interfaces)
            )
          }
        })
        .catch(error => {
          console.log(error)
        })
      // 根据webindex排序，确保端口顺序正确
      function sortNumber (a, b) {
        return a.webindex - b.webindex
      }
    },
    getPortsInfoBegin: function () {
      getPorts()
        .then(res => {
          this.wanLimit = res.data.wancount
          this.lanLimit = res.data.lancount
          let lanCount = 0
          let wanCount = 0
          for (let i = 0; i < res.data.interfaces.length; i++) {
            if (res.data.interfaces[i].function.toLowerCase() === 'wan') {
              wanCount++
              console.log('wanCount is ' + wanCount)
            }
            if (res.data.interfaces[i].function.toLowerCase() === 'lan') {
              lanCount++
              console.log('lanCount is ' + lanCount)
            }
          }
          this.lanCount = lanCount
          this.wanCount = wanCount

          // console.log("get feedback, res.data.interfaces is: "+res.data.interfaces);
          this.checked = JSON.parse(JSON.stringify(res.data.code))
          // console.log("code is "+JSON.stringify(res.data.code));
          this.ports = JSON.parse(JSON.stringify(res.data.interfaces))
          console.log(
            'after parse, the port[] is: ' + JSON.stringify(res.data.interfaces)
          )
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 显示选择功能的dialog
    dialog: function (para) {
      console.log(para)
      this.WANForm.index = para
      this.WANForm.use = ''
      this.dialogFormVisible = true
      this.unbindEnable = this.ports[para].function === 'normal'
      this.isInuseLAN = this.lanLimit <= this.lanCount || !this.unbindEnable
      this.isInuseWAN = this.wanLimit <= this.wanCount || !this.unbindEnable
    },
    // 选择LAN,WAN口对应图标
    selectUrl (para) {
      // if(para === "空闲")
      if (para === 'off') {
        return 'static/port2.png'
      } else {
        return 'static/port3.png'
      }
    },
    // 选择router页面里的图标
    selectIcon (para) {
      if (para === 'wan') {
        return '#icon-wan'
      } else if (para === 'lan') {
        return '#icon-pc'
      } else {
        return false
      }
    },
    // 选择端口对应名称
    name: function () {
      return 'eth' + this.portsName.index
    },
    // WANLAN绑定
    WANLANSubmit: function () {
      this.WANForm.handle = 1
      let bara = Object.assign({}, this.WANForm)
      console.log(bara)
      this.WANLANLoading = true
      // console.log(typeof(para.index));
      let para = {}
      if (bara.index === 0) {
        para.webnetif = 'ETH0'
      } else if (bara.index === 1) {
        para.webnetif = 'ETH1'
      } else if (bara.index === 2) {
        para.webnetif = 'ETH2'
      } else if (bara.index === 3) {
        para.webnetif = 'ETH3'
      } else if (bara.index === 4) {
        para.webnetif = 'ETH4'
      } else if (bara.index === 5) {
        para.webnetif = 'ETH5'
      }
      para.use = bara.use
      para.handle = bara.handle
      console.log(para)
      sendWANLAN(para)
        .then(res => {
          if (res.data.code === 200) {
            this.$message({
              message: '发送成功',
              type: 'success'
            })
          } else {
            this.WANLANLoading = true
          }
        })
        .then(this.getPortsInfo())
        .then(() => {
          this.dialogFormVisible = false
          this.WANLANLoading = false
        })
        .catch(error => {
          console.log(error)
        })
    },
    // WAN,LAN口解绑功能
    unbind: function () {
      let index = this.WANForm.index
      if (this.WANForm.index === 0) {
        this.sendForm.webnetif = 'ETH0'
      } else if (this.WANForm.index === 1) {
        this.sendForm.webnetif = 'ETH1'
      } else if (this.WANForm.index === 2) {
        this.sendForm.webnetif = 'ETH2'
      } else if (this.WANForm.index === 3) {
        this.sendForm.webnetif = 'ETH3'
      } else if (this.WANForm.index === 4) {
        this.sendForm.webnetif = 'ETH4'
      } else if (this.WANForm.index === 5) {
        this.sendForm.webnetif = 'ETH5'
      }
      this.sendForm.use = this.ports[index].function
      this.sendForm.handle = 0
      this.WANLANLoading = true
      let para = Object.assign({}, this.sendForm)
      console.log('hhh1')
      console.log(para)
      sendWANLAN(para)
        .then(res => {
          if (res.data.code === 200) {
            this.$message({
              message: '发送成功',
              type: 'success'
            })
          }
        })
        .then(this.getPortsInfo())
        .then(() => {
          this.dialogFormVisible = false
          this.WANLANLoading = false
        })
        .catch(error => {
          console.log(error)
        })
    },

    // 显示端口自适应排序页面
    sortingHandle: function () {
      this.sortingVisible = true

      this.portsName.index = 0
      this.portsName.name = ''
      this.portsName.flag = ''
    },
    // 网口自适应功能 “下一步”按钮调用函数
    sortingNextStep: function () {
      // form validate
      if (this.portsName.name.length > 10) {
        this.$message({
          message: '名称长度请控制在10个字以内',
          type: 'error'
        })
        return
      } else if (this.portsName.name.length === 0) {
        this.$message({
          message: '请输入名称',
          type: 'error'
        })
        return
      }

      this.sortLoading = true
      this.tip = this.tips[5]

      if (this.portsName.flag !== 'middle') {
        this.portsName.flag = 'first'
      }
      let para = Object.assign({}, this.portsName)
      console.log('name is: ' + JSON.stringify(this.portsName))

      stopSignal3 = setInterval(() => {
        sendSorting(para)
          .then(res => {
            if (this.portsName.index === res.data.index) {
              if (res.data.code === 200) {
                clearInterval(stopSignal3)
                console.log('interval stop: ' + stopSignal3)

                this.localName[res.data.index] = this.portsName.name

                this.sortLoading = false
                this.portsName.index = res.data.index + 1
                // this.portsName.index++;
                this.portsName.flag = 'middle'
                this.tip1 = this.tips[0]
                this.tip2 = this.tips[1]

                console.log(
                  'in sorting interval: http status is ' +
                  res.status +
                  ' and the index is ' +
                  this.portsName.index
                )
                console.log(res)
              } else if (res.data.code === 500) {
                this.tip1 = this.tips[2]
                this.tip2 = this.tips[3]
                console.log(
                  'in sorting interval: http status is ' +
                  res.status +
                  ' and the index is ' +
                  this.portsName.index
                )
                console.log(res)
              }
            }
          })
          .catch(error => {
            console.log(error)
          })
      }, 1000)
    },
    // 网口自适应功能 “完成”按钮调用函数
    sortingFinish: function () {
      this.sortLoading = true
      this.portsName.flag = 'last'

      let para = Object.assign({}, this.portsName)

      stopSignal4 = setInterval(() => {
        sendSorting(para)
          .then(res => {
            if (res.data.index === this.portsName.index) {
              if (res.data.code === 200) {
                this.sortLoading = false
                this.portsName.name = ''
                this.portsName.flag = ''
                this.portsName.index = 0
                clearInterval(stopSignal4)
                console.log('in cancel interval: ' + res.status)
                console.log(res)
                this.sortingVisible = false

                this.tip1 = this.tips[0]
                this.tip2 = this.tips[1]

                this.getPortsInfo()

                setTimeout(() => {
                  this.getPortsInfo()
                }, 1000)
              } else if (res.data.code === 500) {
                this.tip1 = this.tips[2]
                this.tip2 = this.tips[3]
                console.log(
                  'in sorting interval: http status is ' +
                  res.status +
                  ' and the index is ' +
                  this.portsName.index
                )
                console.log(res)
              }
            }
          })
          .catch(error => {
            console.log(error)
          })
      }, 1000)
      this.$emit('finishSorting', 'finish')
    },
    // 网口自适应功能 “取消”按钮调用函数
    sortingCancel: function () {
      if (stopSignal3 != null) {
        clearInterval(stopSignal3)
      } else {
        clearInterval(stopSignal4)
      }
      this.sortingVisible = false
      sortingCancel().then(res => {
        if (res.status === 200) {
          return true
        }
      })
      this.sortLoading = false
      this.portsName.index = 0
      this.portsName.name = ''
      this.portsName.flag = ''

      this.tip1 = this.tips[0]
      this.tip2 = this.tips[1]

      this.$emit('finishSorting', 'cancel')
    }
  }
}
</script>

<style scoped>
.whole-router .router .port img:hover {
  cursor: pointer;
}
.whole-router {
  display: flex;
  position: relative;
  border: 1px solid lightgrey;
  background-color: ghostwhite;
  color: #909399;
}
.whole-router .router .port {
  width: 60px;
  height: 50px;
  margin: 25px auto;
  flex-grow: 1;
  border-radius: 5px;
}
.power {
  border: 1px solid lightgrey;
  border-radius: 10px;
  text-align: center;
  margin: auto;
  background-color: dodgerblue;
}
.router {
  width: 75%;
  border: 1px solid lightgrey;
  border-radius: 10px;
  margin: 10px 20px;
  background-color: lightgoldenrodyellow;
  display: flex;
  flex-wrap: wrap;
  text-align: center;
}
.whole-router-in-dialog {
  width: 100%;
  border: 1px solid lightgrey;
  background-color: ghostwhite;
  color: #909399;
  display: flex;
  margin-bottom: 30px;
  position: relative;
}

.whole-router-in-dialog .power {
  border: 1px solid lightgrey;
  border-radius: 10px;
  text-align: center;
  margin: 10px 0 10px 20px;
  background-color: dodgerblue;
}

.whole-router-in-dialog .power .power-button {
  width: 60px;
  height: 50px;
  margin: 25px 20px;
}

.whole-router-in-dialog .router {
  width: 75%;
  border: 1px solid lightgrey;
  border-radius: 10px;
  margin: 10px 20px;
  background-color: lightgoldenrodyellow;
  display: flex;
  flex-wrap: wrap;
  text-align: center;
}

.whole-router-in-dialog .router .port {
  width: 60px;
  height: 50px;
  margin: 25px auto;
  flex-grow: 1;
  border-radius: 5px;
}

.mask {
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(70, 70, 70, 0.5);
  width: 100%;
  height: 100%;
}

.mask .button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.power-button {
  width: 60px;
  height: 50px;
  margin: 25px 20px;
}
.text {
  font-weight: bold;
}
.text-area p {
  margin: 0;
}

.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.triangular {
  border: 10px solid lightgoldenrodyellow;
  border-bottom-color: #f00;
  width: 0;
  height: 0;
  margin: auto;
}
</style>
