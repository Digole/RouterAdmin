<template>
  <section>
    <div class="line_02">
      <span>{{ $t('systemSetting.hardwareInfo') }}</span>
    </div>
    <el-table
      :data="hardwareInfo"
      style="width: 100%"
      header-cell-style="padding: 0">
      <el-table-column
        prop="name"
        width="180"/>
      <el-table-column
        prop="hardware"
        min-width="360"/>
    </el-table>
  </section>
</template>

<script>
import { getHardware, getPorts } from '../../api/api'
export default {
  name: 'HardwareInfo',

  data () {
    return {
      hardwareInfo: [
        {
          name: 'CPU',
          hardware: ''
        },
        {
          name: '存储',
          hardware: ''
        },
        {
          name: '内存',
          hardware: ''
        },
        {
          name: '网卡',
          hardware: ''
        }
      ],
      ports: [],
      deviceName: []
    }
  },
  methods: {
    getInfo () {
      getHardware()
        .then(res => {
          if (res.data.code === 200) {
            this.hardwareInfo[0].hardware = res.data.cpu
            this.hardwareInfo[1].hardware = res.data.sto
            this.hardwareInfo[2].hardware = res.data.mem
          }
        })
    },
    getPortsInfo () {
      this.deviceName = []
      getPorts()
        .then(res => {
          if (res.data.code === 200) {
            this.ports = res.data.interfaces
            this.ports.forEach(item => {
              this.deviceName.push(item.devname)
              console.log(this.deviceName)
            })
          }
          this.hardwareInfo[3].hardware = this.deviceName.join(', ')
        })
    }
  },
  mounted () {
    this.getInfo()
    this.getPortsInfo()
  }
}
</script>

<style scoped>
</style>
