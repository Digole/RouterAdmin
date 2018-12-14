<template>
  <section>
    <div class="line_02">
      <span>流量监控</span>
    </div>
    <div id="echartsUp"/>
    <div id="echartsDown"/>
  </section>
</template>

<script>
import { getMonitorInfo } from '../../api/api.js'
import flowMonitor from 'echarts'
require('echarts/theme/walden')

export default {
  name: 'FlowMonitor',
  data () {
    return {
      legend: {
        orient: 'vertical',
        x: 'right',
        data: ['HTTP协议', '邮件服务', '网络聊天', '文件传输', '其他']
      },
      dataUp: [
        { value: 0, name: 'HTTP协议' },
        { value: 0, name: '邮件服务' },
        { value: 0, name: '网络聊天' },
        { value: 0, name: '文件传输' },
        { value: 0, name: '其他' }
      ],
      dataDown: [
        { value: 0, name: 'HTTP协议' },
        { value: 0, name: '邮件服务' },
        { value: 0, name: '网络聊天' },
        { value: 0, name: '文件传输' },
        { value: 0, name: '其他' }
      ],

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
    drawChartsUp () {
      let myChart = flowMonitor.init(
        document.getElementById('echartsUp'),
        'walden'
      )

      let option = {
        title: {
          text: '上行流量信息'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: this.legend,
        series: [
          {
            name: '协议流量分布',
            type: 'pie',
            radius: ['80%', '90%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '20',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.dataUp
          }
        ]
      }

      myChart.setOption(option)

      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    drawChartsDown () {
      let myChart = flowMonitor.init(
        document.getElementById('echartsDown'),
        'walden'
      )

      let option = {
        title: {
          text: '下行流量信息'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: this.legend,
        series: [
          {
            name: '协议流量分布',
            type: 'pie',
            radius: ['80%', '90%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '20',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.dataDown
          }
        ]
      }

      myChart.setOption(option)

      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    getFlowInfo () {
      let para = Object.assign({}, this.form)
      para.type = 4
      para.page = 1
      getMonitorInfo(para)
        .then(res => {
          if (res.data.code === 200) {
            this.original = res.data.data
          }
          puthToData(this.original, this.dataUp, this.dataDown)
        })
        .then(() => {
          this.drawChartsUp()
          this.drawChartsDown()
        })
        .catch(error => {
          console.log(error)
        })

      /**
       * 当TMT_LINE_APP时，返回Protocol值取:
       * app_type_http = 1,
       * app_type_mail = 2,
       * app_type_chat = 3,
       * app_type_transfer = 4,
       * app_type_others = 5,
       * 总流量 = 6
       */
      function puthToData (val, up, down) {
        for (let i = 0; i < val.length; i++) {
          // if (val[i].protocol !== 6) {
          let index = val[i].protocol - 1
          up[index].value = val[i].recv_total_length
          down[index].value = val[i].send_total_length
          // }
        }
      }
    }
  },
  mounted () {
    this.getFlowInfo()
  }
}
</script>

<style scoped lang="scss">
#echartsUp,
#echartsDown {
  height: 300px;
  width: 49%;
  border: 1px solid #ddd;
}
#echartsUp {
  float: left;
}
#echartsDown {
  float: right;
}
</style>
