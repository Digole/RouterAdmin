<template>
  <div id="map"/>
</template>

<script>
import kidVPN from 'echarts'
import axios from 'axios'
import { getCityInfo } from '@/api/api.js'
// import chinaJson from '../../static/china.json';

export default {
  name: 'KidVPN',

  data () {
    return {
      testData: {}
    }
  },

  methods: {
    getTestData: async function () {
      let local
      let purposeList = []

      let purposeJsonList = []
      let localJson = {}

      let reg = new RegExp('"', 'g')

      /**
       * 此处需要的数据为VPN地址的列表，
       * IP解析是否由后台进行
       */
      await getCityInfo()
        .then(res => {
          if (res.data.code === 200) {
            if (res.data.data !== undefined) {
              res.data.data.forEach(item => {
                console.log(item)
                let para = item.cli_pos.split(',', 3)
                para[2] = para[2].replace(reg, '').replace(/\s+/g, '') // 去除双引号
                console.log(para[2])

                // 临时措施
                if (para[2] === '') {
                  para[2] = '北京'
                }

                purposeList.push(para[2])
                console.log('purposeList ' + purposeList)
                let server = item.ser_pos.split(',', 3)
                console.log('server is ' + server)
                // 去除括号，然后还会有左空格号，再去掉空格号
                // local = server[2].replace(reg, '').replace(/\s+/g, '')
                console.log(local)
              })

              // purposeList = ['北京']
              // purposeList.push("上海","北京","广州");
              // local = '南京'

              localJson.name = local
              for (let i = 0; i < purposeList.length; i++) {
                let purposeJson = {}
                purposeJson.name = purposeList[i]

                purposeJsonList.push([localJson, purposeJson])
              // console.log(i + "   " + JSON.stringify(purposeJsonList));
              }
              this.testData = purposeJsonList
              console.log('purposrJsonList is ' + purposeJsonList)
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
      this.drawMap()
    },

    drawMap: function () {
      console.log('in drawmap')
      let IPMap = kidVPN.init(document.getElementById('map'))

      let chinaJson

      let testData

      axios.get('../../static/china.json').then(res => {
        chinaJson = res.data
        // console.log(chinaJson);
        setMap(chinaJson)
      })

      testData = this.testData
      console.log('getcha! ' + testData)

      function setMap () {
        kidVPN.registerMap('china', chinaJson) // 注册地图

        let geoCoordMap = {
          上海: [121.4648, 31.2891],
          东莞: [113.8953, 22.901],
          东营: [118.7073, 37.5513],
          中山: [113.4229, 22.478],
          临汾: [111.4783, 36.1615],
          临沂: [118.3118, 35.2936],
          丹东: [124.541, 40.4242],
          丽水: [119.5642, 28.1854],
          乌鲁木齐: [87.9236, 43.5883],
          佛山: [112.8955, 23.1097],
          保定: [115.0488, 39.0948],
          兰州: [103.5901, 36.3043],
          包头: [110.3467, 41.4899],
          北京: [116.4551, 40.2539],
          北海: [109.314, 21.6211],
          南京: [118.8062, 31.9208],
          南宁: [108.479, 23.1152],
          南昌: [116.0046, 28.6633],
          南通: [121.1023, 32.1625],
          厦门: [118.1689, 24.6478],
          台州: [121.1353, 28.6688],
          合肥: [117.29, 32.0581],
          呼和浩特: [111.4124, 40.4901],
          咸阳: [108.4131, 34.8706],
          哈尔滨: [127.9688, 45.368],
          唐山: [118.4766, 39.6826],
          嘉兴: [120.9155, 30.6354],
          大同: [113.7854, 39.8035],
          大连: [122.2229, 39.4409],
          天津: [117.4219, 39.4189],
          太原: [112.3352, 37.9413],
          威海: [121.9482, 37.1393],
          宁波: [121.5967, 29.6466],
          宝鸡: [107.1826, 34.3433],
          宿迁: [118.5535, 33.7775],
          常州: [119.4543, 31.5582],
          广州: [113.5107, 23.2196],
          廊坊: [116.521, 39.0509],
          延安: [109.1052, 36.4252],
          张家口: [115.1477, 40.8527],
          徐州: [117.5208, 34.3268],
          德州: [116.6858, 37.2107],
          惠州: [114.6204, 23.1647],
          成都: [103.9526, 30.7617],
          扬州: [119.4653, 32.8162],
          承德: [117.5757, 41.4075],
          拉萨: [91.1865, 30.1465],
          无锡: [120.3442, 31.5527],
          日照: [119.2786, 35.5023],
          昆明: [102.9199, 25.4663],
          杭州: [119.5313, 29.8773],
          枣庄: [117.323, 34.8926],
          柳州: [109.3799, 24.9774],
          株洲: [113.5327, 27.0319],
          武汉: [114.3896, 30.6628],
          汕头: [117.1692, 23.3405],
          江门: [112.6318, 22.1484],
          沈阳: [123.1238, 42.1216],
          沧州: [116.8286, 38.2104],
          河源: [114.917, 23.9722],
          泉州: [118.3228, 25.1147],
          泰安: [117.0264, 36.0516],
          泰州: [120.0586, 32.5525],
          济南: [117.1582, 36.8701],
          济宁: [116.8286, 35.3375],
          海口: [110.3893, 19.8516],
          淄博: [118.0371, 36.6064],
          淮安: [118.927, 33.4039],
          深圳: [114.5435, 22.5439],
          清远: [112.9175, 24.3292],
          温州: [120.498, 27.8119],
          渭南: [109.7864, 35.0299],
          湖州: [119.8608, 30.7782],
          湘潭: [112.5439, 27.7075],
          滨州: [117.8174, 37.4963],
          潍坊: [119.0918, 36.524],
          烟台: [120.7397, 37.5128],
          玉溪: [101.9312, 23.8898],
          珠海: [113.7305, 22.1155],
          盐城: [120.2234, 33.5577],
          盘锦: [121.9482, 41.0449],
          石家庄: [114.4995, 38.1006],
          福州: [119.4543, 25.9222],
          秦皇岛: [119.2126, 40.0232],
          绍兴: [120.564, 29.7565],
          聊城: [115.9167, 36.4032],
          肇庆: [112.1265, 23.5822],
          舟山: [122.2559, 30.2234],
          苏州: [120.6519, 31.3989],
          莱芜: [117.6526, 36.2714],
          菏泽: [115.6201, 35.2057],
          营口: [122.4316, 40.4297],
          葫芦岛: [120.1575, 40.578],
          衡水: [115.8838, 37.7161],
          衢州: [118.6853, 28.8666],
          西宁: [101.4038, 36.8207],
          西安: [109.1162, 34.2004],
          贵阳: [106.6992, 26.7682],
          连云港: [119.1248, 34.552],
          邢台: [114.8071, 37.2821],
          邯郸: [114.4775, 36.535],
          郑州: [113.4668, 34.6234],
          鄂尔多斯: [108.9734, 39.2487],
          重庆: [107.7539, 30.1904],
          金华: [120.0037, 29.1028],
          铜川: [109.0393, 35.1947],
          银川: [106.3586, 38.1775],
          镇江: [119.4763, 31.9702],
          长春: [125.8154, 44.2584],
          长沙: [113.0823, 28.2568],
          长治: [112.8625, 36.4746],
          阳泉: [113.4778, 38.0951],
          青岛: [120.4651, 36.3373],
          韶关: [113.7964, 24.7028]
        }

        // let SHData = [
        //   [{name:'上海'},{name:'广州',value:50}], 数据示例
        //   [{name:'上海'},{name:'成都',value:30}] 数据示例
        // ]

        let convertData = function (data) {
          let res = []
          for (let i = 0; i < data.length; i++) {
            let dataItem = data[i]
            console.log(i)
            console.log('dataItem is ' + JSON.stringify(dataItem))
            let fromCoord = geoCoordMap[dataItem[0].name]
            console.log('formCoord is ' + fromCoord)
            let toCoord = geoCoordMap[dataItem[1].name]
            if (fromCoord && toCoord) {
              res.push(
                // [
                {
                  name: dataItem[0].name, // 用于显示源城市名称
                  fromName: dataItem[0].name,
                  toName: dataItem[1].name,
                  // coord: fromCoord
                  coords: [fromCoord, toCoord]
                }
                //   {
                //     fromName: dataItem[0].name,
                //     toName: dataItem[1].name,
                //     coord: toCoord
                //   }
                // ]
              )
            }
          }
          // console.log("res is: "+JSON.stringify(res));
          if (res) {
            return res
          } else {
            return false
          }
        }

        let color = ['#a6c84c', '#ffa022', '#46bee9']
        let series = []

        if (Object.keys(testData).length !== 0) {
          [['南京', testData]].forEach(function (item) {
            console.log(JSON.stringify(item) + '   ')
            series.push(
            // 这是最低图层1，渲染了数据流动的动态效果
              {
                name: item[0],
                type: 'lines',
                zlevel: 1, // zlevel用于 Canvas 分层， zlevel 大的 Canvas 会放在 zlevel 小的 Canvas 的上面。
                effect: {
                  show: true,
                  period: 3,
                  constantSpeed: 50,
                  trailLength: 0.3,
                  color: '#fff',
                  symbolSize: 3
                },
                // 显示源城市名称
                label: {
                  normal: {
                    show: true,
                    position: 'right',
                    formatter: '{b}'
                  }
                },
                lineStyle: {
                  normal: {
                    color: color[2],
                    width: 0,
                    curveness: 0.2
                  }
                },
                data: convertData(item[1])
              },

              // 这是图层2，是点与点之间的连线
              {
                name: item[0],
                type: 'lines',
                zlevel: 2,
                effect: {
                  show: true,
                  period: 6,
                  trailLength: 0,
                  symbol: 'none',
                  symbolSize: 15 // 标记的大小，因为这里symbol为none，所以该属性无效
                },
                label: {
                  normal: {
                    show: true,
                    position: 'right',
                    formatter: '{b}'
                  }
                },
                lineStyle: {
                  normal: {
                    color: color[2],
                    width: 1,
                    opacity: 0.4,
                    curveness: 0.2 // 连线的弧度
                  }
                },
                data: convertData(item[1])
              },

              // 这是图层3，渲染了城市的标志和文字
              {
                name: item[0], // 这里的name是目的城市名的tooltip里的name
                type: 'effectScatter', // 带有涟漪特效动画的散点（气泡）图。利用动画特效可以将某些想要突出的数据进行视觉突出。
                coordinateSystem: 'geo', // 坐标系
                zlevel: 2,
                rippleEffect: {
                  brushType: 'stroke' // 波纹的绘制方式，可选 'stroke' 和 'fill'。
                },
                label: {
                // 目的城市名称显示选项
                  normal: {
                    show: true,
                    position: 'right',
                    formatter: '{b}' // 标签内容格式器，支持字符串模板和回调函数两种形式
                  }
                },
                // symbolSize: function (val) {
                //   return val[2] / 8;
                // },
                symbolSize: 5,
                itemStyle: {
                  normal: {
                    color: color[2]
                  }
                },

                data: item[1].map(function (dataItem) {
                  return {
                    name: dataItem[1].name,
                    // value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                    value: geoCoordMap[dataItem[1].name]
                  }
                })
              }
            )
            console.log(JSON.stringify(series[2].data))
          })
        }

        let option = {
          backgroundColor: '#404a59',
          title: {
            text: 'VPN连接',
            left: 'center',
            textStyle: {
              color: '#fff'
            }
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            top: 'bottom',
            left: 'right',
            data: ['南京'],
            textStyle: {
              color: '#fff'
            },
            selectedMode: 'single'
          },
          geo: {
            // 地理坐标系组件
            map: 'china',
            zoom: 1.2, // 地图缩放大小
            label: {
              // 图形上的文本标签，可用于说明图形的一些数据信息
              emphasis: {
                show: false
              }
            },
            roam: true,
            itemStyle: {
              normal: {
                areaColor: '#323c48', // 地图区域的颜色
                borderColor: '#404a59' // 图形的描边颜色。支持的颜色格式同 color，不支持回调函数
              },
              emphasis: {
                // 高亮状态下的多边形和标签样式。
                areaColor: '#2a333d' // 省份高亮颜色
              }
            }
          },
          series: series
        }
        IPMap.setOption(option)
      }
    }
  },

  mounted () {
    this.getTestData()
    // this.drawMap()
  }
}
</script>

<style scoped>
#map {
  height: 500px;
  width: 100%;
  margin-top: 20px;
}
</style>
