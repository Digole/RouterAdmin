<template>
  <div id="echarts"/>
</template>

<script>
import { getMonitorInfo } from '@/api/api.js'
import flowMonitor from 'echarts'
require('echarts/theme/walden')

export default {
  name: 'PieCharts',
  data () {
    return {
      legend: {
        orient: 'vertical',
        x: 'right',
        data: ['HTTP协议', '邮件服务', '网络聊天', '文件传输', '其他']
      },
      data: [
        {value: 0, name: 'HTTP协议'},
        {value: 0, name: '邮件服务'},
        {value: 0, name: '网络聊天'},
        {value: 0, name: '文件传输'},
        {value: 0, name: '其他'}
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
    drawCharts () {
      let myChart = flowMonitor.init(document.getElementById('echarts'), 'walden')

      let option = {
        title: {
          text: '流量信息'
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
            radius: ['50%', '60%'],
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
            data: this.data
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
        .then((res) => {
          if (res.data.code === 200) {
            this.original = res.data.data
          }
          puthToData(this.original, this.data)
        })
        .then(() => {
          this.drawCharts()
        })
        .catch(err => {
          console.log(err)
        })

      /**
       * 当TMT_LINE_APP时，返回Protocol值取:
       * app_type_http = 1,
       * app_type_mail = 2,
       * app_type_chat = 3,
       * app_type_transfer = 4,
       * app_type_others = 5,
       */
      function puthToData (val, data) {
        for (let i = 0; i < val.length; i++) {
          // if(val[i].protocol !== 6) {
          let index = val[i].protocol - 1
          data[index].value = val[i].recv_total_length
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
</style>
