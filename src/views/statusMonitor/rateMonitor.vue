<template>
  <section class="chart-container">

    <div class="line_02"><span>速率监控</span></div>

    <div>
      <div id="chartLine1"/>
    </div>

    <div>
      <div id="chartLine2"/>
    </div>

  </section>
</template>

<script>
/**
 * @getMonitorInfo 参数：{type: Number， page: Number} 获取速率(type: 4) 共计1种请求
 */
import { getMonitorInfo } from '../../api/api.js'
import rateMonitor from 'echarts'
require('echarts/theme/walden')

let myChartUp, myChartDown
let optionUp, optionDown

export default {
  data () {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: 'blue'
          }
        }
      },
      grid: {
        left: '3%',
        right: '3%',
        bottom: '3%',
        containLabel: true
      },
      seriesUp: [
        {
          name: 'HTTP协议',
          type: 'line',
          smooth: true,
          data: []
        },
        {
          name: '邮件服务',
          type: 'line',
          smooth: true,
          data: []
        },
        {
          name: '网络聊天',
          type: 'line',
          smooth: true,
          data: []
        },
        {
          name: '文件传输',
          type: 'line',
          smooth: true,
          data: []
        },
        {
          name: '其他',
          type: 'line',
          smooth: true,
          data: []
        }
      ],
      seriesDown: [
        {
          name: 'HTTP协议',
          type: 'line',
          smooth: true,
          data: []
        },
        {
          name: '邮件服务',
          type: 'line',
          smooth: true,
          data: []
        },
        {
          name: '网络聊天',
          type: 'line',
          smooth: true,
          data: []
        },
        {
          name: '文件传输',
          type: 'line',
          smooth: true,
          data: []
        },
        {
          name: '其他',
          type: 'line',
          smooth: true,
          data: []
        }
      ],

      dataUp: [
        {value: 0, name: 'HTTP协议'},
        {value: 0, name: '邮件服务'},
        {value: 0, name: '网络聊天'},
        {value: 0, name: '文件传输'},
        {value: 0, name: '其他'}
      ],
      dataDown: [
        {value: 0, name: 'HTTP协议'},
        {value: 0, name: '邮件服务'},
        {value: 0, name: '网络聊天'},
        {value: 0, name: '文件传输'},
        {value: 0, name: '其他'}
      ],

      Axis: (function () {
        let now = new Date()
        let res = []
        let len = 12
        while (len--) {
          res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''))
          now = new Date(now - 2000)
        }
        return res
      })(),

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
      original: []
    }
  },

  methods: {
    drawLineChart1: function () {
      myChartUp = rateMonitor.init(document.getElementById('chartLine1'), 'walden')
      let option = {
        title: {
          text: '上行速率'
        },
        tooltip: this.tooltip,
        legend: {
          data: ['HTTP协议', '邮件服务', '网络聊天', '文件传输', '其他'],
          selected: {
            'HTTP协议': true,
            '邮件服务': false,
            '网络聊天': false,
            '文件传输': false,
            '其他': false
          }
        },
        grid: this.grid,
        toolbox: {
          show: true
          // feature: {
          // dataView: {readOnly: false},
          // restore: {},
          // saveAsImage: {}
          // }
        },
        dataZoom: {
          show: false,
          start: 0,
          end: 100
        },
        xAxis:
            {
              type: 'category',
              boundaryGap: true,
              data: this.Axis
            },
        yAxis: [
          {
            type: 'value',
            scale: true,
            // max: 1000,
            min: 0,
            boundaryGap: [0.2, 0.2]
          }
        ],
        series: this.series
      }

      myChartUp.setOption(option)

      window.addEventListener('resize', function () {
        myChartUp.resize()
      })
    },

    drawLineChart2: function () {
      myChartDown = rateMonitor.init(document.getElementById('chartLine2'), 'walden')
      let option = {
        title: {
          text: '上行速率'
        },
        tooltip: this.tooltip,
        legend: {
          data: ['HTTP协议', '邮件服务', '网络聊天', '文件传输', '其他'],
          selected: {
            'HTTP协议': true,
            '邮件服务': false,
            '网络聊天': false,
            '文件传输': false,
            '其他': false
          }
        },
        grid: this.grid,
        toolbox: {
          show: true
          // feature: {
          // dataView: {readOnly: false},
          // restore: {},
          // saveAsImage: {}
          // }
        },
        dataZoom: {
          show: false,
          start: 0,
          end: 100
        },
        xAxis:
            {
              type: 'category',
              boundaryGap: true,
              data: this.Axis
            },
        yAxis: [
          {
            type: 'value',
            scale: true,
            // max: 1000,
            min: 0,
            boundaryGap: [0.2, 0.2]
          }
        ],
        series: this.series
      }

      myChartDown.setOption(option)

      window.addEventListener('resize', function () {
        myChartDown.resize()
      })
    },

    async getRateInfo () {
      let para = Object.assign({}, this.form)
      para.type = 4
      para.page = 1
      await getMonitorInfo(para)
        .then((res) => {
          if (res.data.code === 200) {
            this.original = res.data.data
          }
          pushToData(this.original, this.dataUp, this.dataDown)
        })
        .catch(error => {
          console.log(error)
        })

      function pushToData (val, up, down) {
        for (let i = 0; i < val.length; i++) {
          let index = val[i].protocol - 1
          up[index].value = val[i].recv_rate
          down[index].value = val[i].send_rate
        }
      }
    },

    async update () {
      optionUp = {
        xAxis:
            {
              type: 'category',
              boundaryGap: true,
              data: this.Axis
            },
        series: this.seriesUp
      }
      optionDown = {
        xAxis:
            {
              type: 'category',
              boundaryGap: true,
              data: this.Axis
            },
        series: this.seriesDown
      }
      await this.getRateInfo()
      let axisData = (new Date()).toLocaleTimeString().replace(/^\D*/, '')
      optionUp.xAxis.data.shift()
      optionUp.xAxis.data.push(axisData)
      for (let i = 0; i < this.dataUp.length; i++) {
        if (optionUp.series[i].data.length > 11) {
          optionUp.series[i].data.shift()
          optionDown.series[i].data.shift()
        }
        optionUp.series[i].data.push(this.dataUp[i].value)
        optionDown.series[i].data.push(this.dataDown[i].value)
        // console.log(optionUp.series[i].data.length)
      }
      myChartUp.setOption(optionUp)
      myChartDown.setOption(optionDown)
    },

    startUpdate () {
      setInterval(this.update, 2000)
    },

    drawLineChart () {
      this.drawLineChart1()
      this.drawLineChart2()
      this.startUpdate()
    }
  },
  mounted () {
    this.drawLineChart()
  }
}
</script>

<style scoped>
#chartLine1, #chartLine2 {
  width: 100%;
  height: 300px;
  margin-top: 30px;
}
</style>
