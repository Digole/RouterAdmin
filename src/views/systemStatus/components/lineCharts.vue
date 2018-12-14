<template>
  <div>
    <div
      id="chartLine1"
      style="width:100%; height:160px; margin-top: 10px"/>
    <div
      id="chartLine2"
      style="width:100%; height:160px; margin-top: 10px"/>
  </div>
</template>

<script>

import lineCharts from 'echarts'

let option = {}
let myChart1
let option1 = {}
let myChart2
let option2 = {}

export default {
  name: 'LineCharts',
  data () {
    return {
      option: {
        title: {
          text: '上行速率',
          // subtext: '上行速率',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 14
          }
        },
        title1: {
          text: '下行速率',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            params = params[0]

            const k = 1000
            const t = 1024
            let i = params.value[1]
            if (i >= k * t * t) {
              i = (i / (t * t * t)).toFixed(0) + 'GB/s'
            } else if (i >= t * k) {
              i = (i / (t * t)).toFixed(0) + 'MB/s'
            } else if (i >= k) {
              i = (i / t).toFixed(0) + 'KB/s'
            } else {
              i = i.toFixed(0) + 'B/s'
            }

            let date = new Date(params.name)
            return (
              date.getHours() +
              ':' +
              date.getMinutes() +
              ' : ' +
              i
            )
          },
          axisPointer: {
            animation: false
          }
        },
        grid: {
          left: '6%',
          right: '3%',
          bottom: '12%',
          containLabel: false
        },
        xAxis: {
          type: 'time',
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#CD0000'
            }
          }
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '0%'],
          splitLine: {
            show: false
          },
          splitNumber: 3, // 分割 端数
          axisLabel: {
            formatter: function (value, index) {
              const k = 1000
              const t = 1024
              let i = value
              if (i >= k * t * t) {
                return (i / (t * t * t)).toFixed(0) + 'GB/s'
              } else if (i >= t * k) {
                return (i / (t * t)).toFixed(0) + 'MB/s'
              } else if (i >= k) {
                return (i / t).toFixed(0) + 'KB/s'
              } else {
                return i.toFixed(0) + 'B/s'
              }
            }
          }
        },
        series: [
          {
            name: '下行速率',
            type: 'line',
            lineStyle: {
              width: 0.5,
              type: 'dotted'
            },
            showSymbol: false,
            hoverAnimation: false,
            data: []
          }
        ]
      }
    }
  },
  methods: {
    drawLineChart1: function () {
      myChart1 = lineCharts.init(
        document.getElementById('chartLine1'),
        'walden'
      )
      let para = this.$store.state.app.systemData
      let data = []
      let now = new Date()

      for (let i = 0; i < 300; i++) {
        data.push(newData(0))
      }

      // function randomData() {
      //   now = new Date(+now + 1000)
      //   // console.log("now "+now+"and "+now.toTimeString());
      //   value = Math.random() * 100 / 10 + 50
      //   return {
      //     name: now.toString(),
      //     value: [
      //       // [now.getHours(), now.getMinutes(), now.getSeconds()].join(':'),
      //       now,
      //       Math.round(value)
      //     ]
      //   }
      // }

      // for (let i = 0; i < 300; i++) {
      //   data.push(randomData())
      // }

      option1 = {
        title: this.option.title,
        tooltip: this.option.tooltip,
        grid: this.option.grid,
        xAxis: this.option.xAxis,
        yAxis: this.option.yAxis,
        series: [
          {
            name: '上行速率',
            type: 'line',
            lineStyle: {
              width: 0.5,
              type: 'dotted'
            },
            showSymbol: false,
            hoverAnimation: false,
            data: data
          }
        ]
      }

      function newData (val) {
        now = new Date(+now + 1000)
        return {
          name: now.toString(),
          value: [
            now,
            val
          ]
        }
      }

      // data.shift()
      // data.push(randomData())
      myChart1.setOption(option1)

      let mychart1 = setInterval(function () {
        data.shift()
        data.push(newData(para.up))
        myChart1.setOption(option1)
      }, 2000)
      this.$store.state.app.timers.mychart1 = mychart1

      window.addEventListener('resize', function () {
        myChart1.resize()
      })
    },

    drawLineChart2: function () {
      myChart2 = lineCharts.init(
        document.getElementById('chartLine2'),
        'walden'
      )
      let para = this.$store.state.app.systemData
      let data = []
      let now = new Date()

      for (let i = 0; i < 300; i++) {
        data.push(newData(0))
      }

      function newData (val) {
        now = new Date(+now + 1000)
        return {
          name: now.toString(),
          value: [
            now,
            val
          ]
        }
      }

      option2 = {
        title: this.option.title1,
        tooltip: this.option.tooltip,
        grid: this.option.grid,
        xAxis: this.option.xAxis,
        yAxis: this.option.yAxis,
        series: [
          {
            name: '下行速率',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: data
          }
        ]
      }

      myChart2.setOption(option2)

      let linecharts2 = setInterval(function () {
        data.shift()
        data.push(newData(para.down))
        myChart2.setOption(option2)
      }, 2000)
      this.$store.state.app.timers.linecharts2 = linecharts2
      window.addEventListener('resize', function () {
        myChart2.resize()
      })
    },

    translate () {
      if (this.$store.state.app.language === 'en') {
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

        option1.title.text = '上行速率'
        option2.title.text = '下行速率'

        option1.title.subtext = '上行速率'

        option2.title.subtext = '下行速率'
      }
      // myPieChart.setOption(option)
      myChart1.setOption(option1)
      myChart2.setOption(option2)
    }
  },
  mounted () {
    this.drawLineChart1()
    this.drawLineChart2()
  }
}
</script>
