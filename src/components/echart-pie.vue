<template>
  <ve-ring
    :data="chartData"
    :extend="chartExtend"
    height="90%"
    width="100%;" />
</template>

<script>
import { getMonitorInfo } from '@/api/api.js'
export default {
  name: 'PieChart',
  props: {
    dataType: {type: String, default: 'default'}
  },
  data () {
    this.chartExtend = {
      legend: {
        show: true,
        orient: 'vertical',
        right: '10%'
        // x: 'right'
      },
      series: {
        name: '协议流量分布',
        type: 'pie',
        radius: ['60%', '70%'],
        center: ['40%', '50%'],
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
        }
      }
    }

    return {
      flow: 0,
      rows: [],

      chartData: {
        columns: ['category', 'flow'],
        // rows: this.rows
        rows: [
          {category: 'HTTP协议', flow: 1000},
          {category: '邮件服务', flow: 1000},
          {category: '网络聊天', flow: 1000},
          {category: '文件传输', flow: 1000},
          {category: '其他', flow: 1000}
        ]
      }
    }
  },
  methods: {
    getInfo () {
      let para = {}
      para.type = 4
      para.page = 1
      /**
       * 当TMT_LINE_APP时，返回Protocol值取:
       * app_type_http = 1,
       * app_type_mail = 2,
       * app_type_chat = 3,
       * app_type_transfer = 4,
       * app_type_others = 5,
       */
      if (this.dataType !== 'default') {
        getMonitorInfo(para)
          .then((res) => {
            if (res.data.code === 200) {
              let data = res.data.data
              this.fillData(data)
              console.log(this.rows)
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    },

    fillData (data) {
      for (let i; i < data.length; i++) {
        switch (data[i].protocol) {
          case 1:
            this.rows[i].category = 'HTTP协议'
            break
          case 2:
            this.rows[i].category = '邮件服务'
            break
          case 3:
            this.rows[i].category = '网络聊天'
            break
          case 4:
            this.rows[i].category = '文件传输'
            break
          case 5:
            this.rows[i].category = '其他'
            break
        }
        if (this.dataType === 'recv') {
          this.rows[i].flow = data.recv_total_length
        } else if (this.dataType === 'send') {
          this.rows[i].flow = data.send_total_length
        }
      }
    }
  },
  mounted () {
    this.getInfo()
  }
}
</script>
