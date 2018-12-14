<template>
  <section>
    <div class="line_02">
      <span />
    </div>
    <div id="top">
      <el-row :gutter="10">
        <!--第一行左边-->
        <el-col
          :md="10"
          :lg="10"
          :xl="10">
          <div class="top_left">
            <div
              :class="[ (MonitorInfo.status === 'failed') ? notInUse : inUse ]"
              class="main_title">

              <p class="name_title">OpenRT</p><br>

              <p>
                {{ $t('systemStatus.top.subtitle') }}
                <span v-if="MonitorInfo.status !== 'failed'">
                  已连接
                </span>
                <span v-else>
                  未连接
                </span>
              </p>
              <br>

              <p class="info_title">
                {{ $t('systemStatus.top.subtitle2') }}:{{ MonitorInfo.time[0] }}
                {{ $t('systemStatus.top.day') }}{{ MonitorInfo.time[1] }}
                {{ $t('systemStatus.top.hour') }}{{ MonitorInfo.time[2] }}
                {{ $t('systemStatus.top.min') }}{{ MonitorInfo.time[3] }}
                {{ $t('systemStatus.top.sec') }}
              </p>
            </div>
            <div class="top_left_text">
              <p>{{ $t('systemStatus.top.rate') }}</p>
              <div class="rate">
                <p>{{ $t('systemStatus.top.upstream') }}:{{ data.up }}</p>
                <p style="font-size: 18px;" />

              </div>
              <div class="rate">
                <p>{{ $t('systemStatus.top.downstream') }}:{{ data.down }}</p>
                <p style="font-size: 18px;" />

              </div>
            </div>
          </div>
        </el-col>
        <!--第一行右边-->
        <el-col
          :md="14"
          :lg="14"
          :xl="14">
          <div class="top_right">
            <p>{{ $t('systemStatus.top.status') }}</p>
            <div class="top_right_bottom">
              <div class="top_right_bottom_text">
                <p style="font-size: 36px;">{{ terminalNum }}</p>
                <p>{{ $t('systemStatus.top.terminal') }}</p>
              </div>

            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--第二行左边上面-->
    <div id="middle">
      <el-row :gutter="10">
        <el-col
          :md="14"
          :lg="14"
          :xl="14">
          <div class="middle_left">
            <div class="middle_left_top">
              <div>
                <p>{{ $t('systemStatus.middle.status') }}</p>
              </div>
              <div class="middle_left_top_text">

                <div class="middle_left_top_text_child">
                  <p style="font-size: 36px">{{ wanNumber }}</p>
                  <p>{{ $t('systemStatus.middle.WAN') }}</p>
                </div>
                <div class="middle_left_top_text_child">
                  <p style="font-size: 36px">{{ lanNumber }}</p>
                  <p>{{ $t('systemStatus.middle.LAN') }}</p>
                </div>

              </div>
            </div>
            <!--第二行左边下面-->
            <div class="middleBottom">
              <div class="router">
                <div
                  v-for="(item, index) in ports"
                  :key="index"
                  class="port"
                  @click="pushToINEX">
                  <div>
                    <el-tooltip
                      class="item"
                      effect="light">
                      <img
                        :src="selectUrl(item.linkstatus)"
                        style="width: 3rem; height: 3rem; border-radius: .3rem;">
                      <div
                        slot="content"
                        class="tooltip-content">
                        <p>{{ item.webname }}</p>
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
                          size="small">
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
                            <use :xlink:href="selectIcon(item.function)" />
                          </svg>
                        </span>
                        {{ item.webname }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <!--第二行右边-->
        <el-col
          :md="10"
          :lg="10"
          :xl="10">
          <div class="middle_right">
            <!-- <div style="height: 20%;">
              <p style="float: left;">{{ $t('systemStatus.middle.average') }}</p>
            </div>
            <div>
              <span style="font-size: 36px; margin-left: 20px;">0</span>
              <span>%</span>
            </div> -->

          </div>
        </el-col>

      </el-row>
    </div>
    <!--第三行-->
    <div id="bottom">
      <el-row :gutter="10">
        <el-col
          :md="8"
          :lg="8"
          :xl="8">
          <pie-chart class="bottom_left" />
        </el-col>
        <el-col
          :md="16"
          :lg="16"
          :xl="16">
          <div class="bottom_right">
            <!-- <div
              id="chartLine1"
              style="width:100%; height:160px; margin-top: 10px"/>
            <div
              id="chartLine2"
              style="width:100%; height:160px; margin-top: 10px"/> -->
            <line-chart />
          </div>
        </el-col>
      </el-row>
    </div>
  </section>
</template>

<script>
// import systemStatus from 'echarts'
/**
 * @getPorts 参数: 无 作用: 获取端口信息
 * @getMonitorInfo 参数：{type: Number， page: Number} 获取终端数量和其他所有信息(type: 1) 获取上下行速率（type: 5) 获取CPU/内存数据（type: 6) 共计3种请求
 * @getExtranetStatus 参数: 无 作用: 获取外网信息
 */
import { getPorts, getMonitorInfo, getExtranetStatus } from '../../api/api'
import { pieChart, lineChart } from './components'
import { conversion } from '../../utils/rateUnitExchange.js'
require('echarts/theme/walden')

let option = {}
let myPieChart
let myChart1
let option1 = {}
let myChart2
let option2 = {}

export default {
  name: 'SystemStatus',

  components: {
    pieChart,
    lineChart
  },
  data () {
    return {
      // n: 0,
      title: '',
      MonitorInfo: {
        // 外网连接状态
        status: '',
        time: ''
      },

      terminalNum: '', // 连接终端数量
      data: {
        // 上下行速率以及相关信息
        up: '',
        down: '',
        upStorage: '',
        downStorage: '',
        cpu: '',
        memory: '',
        userNum: ''
      },
      ports: [
        {
          id: '0',
          category: '',
          imgUrl: 'static/port3.png'
        }
      ],
      options: [
        {
          value: '选项1',
          label: '近30分钟'
        },
        {
          value: '选项2',
          label: '近1小时'
        },
        {
          value: '选项3',
          label: '近1天'
        }
      ],
      value: '',
      tooltipLabelWidth: '5rem',

      // css有关变量
      inUse: 'net_in_use',
      notInUse: 'net_not_in_use'
    }
  },

  computed: {
    lanNumber: function () {
      let i = 0
      let j = 0
      for (i; i < this.ports.length; i++) {
        if (this.ports[i].function === 'lan') {
          j++
        }
      }
      return j
    },
    wanNumber: function () {
      let i = 0
      let j = 0
      for (i; i < this.ports.length; i++) {
        if (this.ports[i].function === 'wan') {
          j++
        }
      }
      return j
    },
    'item.linkstatus': function (para) {
      if (para === 'off') {
        return 'static/port2.png'
      } else {
        return 'static/port3.png'
      }
    }
  },

  watch: {
    '$store.state.app.language': function () {
      console.log(this.$store.state.app.language)
      this.translate()
    }
  },

  mounted: function () {
    // 允许递归
    this.$store.dispatch('setTimer', true)
    this.getData()
  },

  methods: {
    getData () {
      // 定时器1 获取外网连接信息
      this.getNetInfo()
      // 定时器2 获取终端数量
      this.getTerminalInfo()
      // 定时器3 获取上下行速率
      this.getInfo()
      this.getPortsInfo()

      this.$store.state.app.timers.intervalOfInterface = setInterval(() => {
        this.getNetInfo()
        this.getTerminalInfo()
        this.getInfo()
        this.getPortsInfo()
      }, 5000)
    },

    // 获取外网连接信息
    getNetInfo () {
      getExtranetStatus().then(res => {
        if (res.data.code === 200) {
          this.MonitorInfo.status = res.data.status
          this.MonitorInfo.time = res.data.time.split(':')

          // let obj = document.getElementById('statusColor')

          // if (this.MonitorInfo.status === 'failed') {
          //   obj.className = 'net_not_in_use'
          //   if (this.$store.state.app.language === 'en') {
          //     this.title = 'Not Configured'
          //   } else {
          //     this.title = '未配置'
          //   }
          // } else {
          //   obj.className = 'net_in_use'
          //   if (this.$store.state.app.language === 'en') {
          //     this.title = 'Configured'
          //   } else {
          //     this.title = '已配置'
          //   }
          // }
        }
      })
    },

    // 获取终端数量
    getTerminalInfo () {
      let para = Object.assign({}, this.form)
      para.type = 1
      para.page = this.currentPage
      getMonitorInfo(para)
        .then(res => {
          if (res.data.code === 200) {
            if (res.data.data.length !== 0) {
              this.terminalNum = res.data.total
              console.log(this.terminalNum)
            }
          }
        })
        .catch(error => {
          console.log(error)
        })
    },

    // 获取上下行速率
    getInfo () {
      this.update()
    },

    async update () {
      let para = {}
      para.page = 1
      para.type = 5
      await getMonitorInfo(para)
        .then(res => {
          if (res.data.code === 200) {
            this.data.upStorage = res.data.data[0].recv_rate
            this.data.downStorage = res.data.data[0].send_rate
            this.data.up = conversion(res.data.data[0].recv_rate)
            this.data.down = conversion(res.data.data[0].send_rate)
            this.$store.dispatch('pushSystemData', this.data)
          }
        })
        .catch(error => {
          console.log(error)
        })
      let para1 = {}
      para1.type = 6
      await getMonitorInfo(para1)
        .then(res => {
          if (res.data.code === 200) {
            this.data.cpu = res.data.cpu_usage.toFixed(0)
            this.data.memory = res.data.memory_usage.toFixed(0)
            this.data.userNum = res.data.online_users
          }
        })
        .catch(error => {
          console.log(error)
        })
      this.$store.dispatch('pushSystemData', this.data)
    },

    // 选择LAN,WAN口对应图标
    selectUrl (para) {
      if (para === 'off') {
        return 'static/port2.png'
      } else {
        return 'static/port3.png'
      }
    },

    selectIcon (para) {
      if (para === 'wan') {
        return '#icon-wan'
      } else if (para === 'lan') {
        return '#icon-pc'
      } else {
        return '#'
      }
    },

    getPortsInfo: function () {
      getPorts().then(res => {
        let checked = res.data.code
        if (checked !== 200) {
          this.$store.dispatch('setAdaptive', checked)
          this.$router.push('ports')
        }

        this.ports = res.data.interfaces
      })
    },

    pushToINEX () {
      this.$router.push({ path: '../INEX_network' })
    },

    translate () {
      if (this.$store.state.app.language === 'en') {
        if (this.MonitorInfo.status === 'failed') {
          this.title = 'Not Configured'
        } else {
          this.title = 'Configured'
        }
        option.legend.data = [
          'HTTP',
          'Vedio',
          'Game',
          'Download',
          'Transmission'
        ]
        option.series[0].name = 'Protocol traffic distribution'
        option.series[0].data = [
          { value: 335, name: 'HTTP' },
          { value: 310, name: 'Vedio' },
          { value: 234, name: 'Game' },
          { value: 135, name: 'Download' },
          { value: 1548, name: 'Transmission' }
        ]

        option1.title.text = 'Up/Downlink Rate'
        option1.title.subtext = 'Uplink Rate'

        option2.title.subtext = 'Downlink Rate'
      }
      if (this.$store.state.app.language === 'zh') {
        if (this.MonitorInfo.status === 'failed') {
          this.title = '未配置'
        } else {
          this.title = '已配置'
        }
        option.legend.data = [
          'HTTP协议',
          '网络视频',
          '网络游戏',
          '网络下载',
          '文件传输'
        ]
        option.series[0].name = '流量协议分布'
        option.series[0].data = [
          { value: 335, name: 'HTTP协议' },
          { value: 310, name: '网络视频' },
          { value: 234, name: '网络游戏' },
          { value: 135, name: '网络下载' },
          { value: 1548, name: '文件传输' }
        ]

        option1.title.text = '上下行速率'
        option1.title.subtext = '上行速率'

        option2.title.subtext = '下行速率'
      }
      myPieChart.setOption(option)
      myChart1.setOption(option1)
      myChart2.setOption(option2)
    }
  }
}
</script>

<style scoped lang="scss">
p {
  color: grey;
}
.top_left {
  height: 150px;
  display: flex;
  margin-top: 1rem;
  border: 1px solid lightgrey;
  .net_not_in_use {
    width: 60%;
    background-color: lightgrey;
    p {
      margin: auto 20px;
      color: white;
    }
  }
  .net_in_use {
    width: 60%;
    background-color: rgb(9, 211, 100);
    p {
      margin: auto 20px;
      color: white;
    }
  }
  .main_title {
    .name_title {
      height: 3rem;
      line-height: 3rem;
      font-size: 1.5rem;
    }
    .info_title {
      margin-top: 1rem;
    }
  }

  .top_left_text {
    padding-left: 1rem;
    width: 40%;
    .rate {
      p {
        margin: 1rem auto;
        display: inline-block;
      }
    }
  }
}

.top_right {
  height: 150px;
  border: 1px solid lightgrey;
  padding-left: 1rem;
  margin-top: 1rem;
  font-family: Roboto-Thin;
  .top_right_bottom {
    display: flex;
    .top_right_bottom_text {
      width: 25%;
      p {
        margin: 1rem auto;
      }
    }
  }
}

.middle_left {
  margin-top: 1rem;
  height: 15rem;
  border: 1px solid lightgrey;
  font-family: Roboto-Thin;
  .middle_left_top {
    height: 100px;
    padding-left: 20px;
    .middle_left_top_text {
      display: flex;
      .middle_left_top_text_child {
        width: 25%;
        p {
          margin: 0 auto;
        }
      }
    }
  }
}
.middle_right {
  margin-top: 1rem;
  height: 240px;
  border: 1px solid lightgrey;
  font-family: Roboto-Thin;
  p {
    margin-left: 20px;
  }
  span {
    margin-left: 0;
    color: grey;
  }
}

#bottom {
  .bottom_left {
    margin-top: 1rem;
    height: 350px;
    width: 100%;
    border: 1px solid lightgrey;
  }
  .bottom_right {
    margin-top: 1rem;

    border: 1px solid lightgrey;
    height: 350px;
  }
}

.router {
  height: 4.2rem;
  width: 92%;
  // overflow: hidden;
  margin: 0.6rem 1.2rem;
  display: inline-flex;
  justify-content: space-around;
  background-color: lightgoldenrodyellow;
  text-align: center;
  border: 1px solid lightgrey;
  border-radius: 0.6rem;
  .port {
    width: 3rem;
    height: 3rem;
    border-radius: 0.3rem;
    background-color: grey;
    text-align: center;
    margin: 0.6rem 0.2rem 0.2rem 0;
    img:hover {
      cursor: pointer;
    }
  }
}

.text-area p {
  display: flex;
  // margin: 0;
}

.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

@font-face {
  font-family: Roboto-Thin;
  src: url("../../assets/font/Roboto-Thin.ttf");
}
</style>
