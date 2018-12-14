<template>
  <div
    id="chartLine1"
    style="width:100%; height:200px; margin-top: 10px"/>
</template>

<script>
import echarts from 'echarts'
import { getUsage } from '../../../../api/api'
require('echarts/theme/walden')

let stopSignal2
let maxData
let myChart
let option = {}

export default {
  name: 'Echarts',
  data () {
    return {}
  },
  watch: {
    '$store.state.app.language': function () {
      console.log(this.$store.state.app.language)
      this.translate()
    }
  },
  methods: {
    drawLineChart1: function () {
      myChart = echarts.init(document.getElementById('chartLine1'), 'walden')

      async function getPercentData () {
        now = new Date(+now + 5000)
        let percent
        await getUsage()
          .then(res => {
            return res.data.percent
          })
          .then(val => {
            percent = val
          })
          .catch(error => {
            console.log(error)
          })
        // console.log("reponse percent! the value is "+ percent);
        return {
          name: now.toString(),
          value: [now, percent]
        }
      }

      async function getUseNode () {
        let usage
        await getUsage()
          .then(res => {
            return [res.data.usenode, res.data.totalnode]
          })
          .then(val => {
            usage = val
          })
          .catch(error => {
            console.log(error)
          })
        console.log('reponse usenode! the value is ' + usage)
        return usage
      }

      function randomData () {
        now = new Date(+now + 5000)
        // console.log("now "+now+"and "+now.toTimeString());
        // value = Math.random()*100;
        value = 0
        return {
          name: now.toString(),
          value: [
            // [now.getHours(), now.getMinutes(), now.getSeconds()].join(':'),
            now,
            Math.round(value)
          ]
        }
      }

      let data = []
      let now = new Date()
      let value = 0
      for (let i = 0; i < 36; i++) {
        data.push(randomData())
      }

      option = {
        title: {
          text: '随机端口使用情况',
          subtext: '百分比',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'none',
          formatter: function (params) {
            params = params[0]
            let date = new Date(params.name)
            return (
              date.getHours() +
              ':' +
              date.getMinutes() +
              ' : ' +
              params.value[1]
            )
          },
          axisPointer: {
            animation: false
          }
        },
        legend: {
          data: ['占用百分比', '使用数量']
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '10%',
          containLabel: false
        },
        xAxis: [
          {
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
          {
            type: 'category',
            show: false,
            data: (function () {
              let res = []
              let len = 36
              while (len--) {
                res.push(36 - len - 1)
              }
              return res
            })()
          }
        ],
        yAxis: [
          {
            type: 'value',
            max: 100,
            min: 0,
            axisLabel: {
              formatter: '{value}%'
            },
            splitLine: {
              show: false
            }
          },
          {
            type: 'value',
            scale: true,
            splitLine: {
              show: false
            },
            name: '使用数量',
            min: 0,
            max: maxData,
            boundaryGap: [0.2, 0]
          }
        ],
        series: [
          {
            name: '占用百分比',
            type: 'line',
            lineStyle: {
              width: 0.5,
              type: 'dotted'
            },
            showSymbol: false,
            hoverAnimation: false,
            data: data
          },
          {
            name: '使用数量',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: (function () {
              let res = []
              let len = 36
              while (len--) {
                // res.push(Math.round(Math.random() * 1000));
                res.push(0)
              }
              return res
            })()
          }
        ]
      }

      myChart.setOption(option)

      async function update () {
        let resultData = await getPercentData()
        let result = await getUseNode()
        let resultUsage = result[0]
        option.yAxis[1].max = result[1]
        data.shift()
        data.push(resultData)
        let usage = option.series[1].data
        usage.shift()
        usage.push(resultUsage)
        myChart.setOption(option)
      }
      stopSignal2 = setInterval(update, 5000)

      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },

    translate () {
      if (this.$store.state.app.language === 'en') {
        option.title.text = 'Random port usage'
        option.title.subtext = 'Percent'
        option.legend = {
          data: ['Percent of Inuse', 'Number of Inuse']
        }
        option.yAxis[1].name = 'Number of Inuse'
      }
      if (this.$store.state.app.language === 'zh') {
        option.title.text = '随机端口使用情况'
        option.title.subtext = '百分比'
        option.legend = {
          data: ['占用百分比', '使用数量']
        }
        option.yAxis[1].name = '使用数量'
      }
      myChart.setOption(option)
    }
  },
  mounted () {
    this.drawLineChart1()
  },
  beforeDestroy () {
    clearInterval(stopSignal2)
  }
}
</script>

<style scoped>
</style>
