<template>
  <div class="ternimal_container">
    <div class="header">
      <div class="tip">{{ $t('sceneRouter.cpu') + ': ' }}</div>
      <div class="tip">{{ $t('sceneRouter.ram') + ': ' }}</div>
    </div>

    <div class="content">
      <p class="title">{{ info }}</p>
      <el-table
        :data="list"
        class="table"
        :header-row-style="headerStyle">
        <el-table-column
          prop="IP"
          :label="$t('terminal.ip')" />

        <el-table-column
          prop="MAC"
          :label="$t('terminal.mac')" />

        <el-table-column
          prop="duration"
          :label="$t('terminal.time')" />

        <el-table-column
          prop="upRate"
          :label="$t('terminal.upRate')" />

        <el-table-column
          prop="downRate"
          :label="$t('terminal.downRate')" />
      </el-table>

    </div>
    <el-pagination
      @current-change="handlePagination"
      :current-page="currentPage"
      layout="prev, pager, next"
      :total="total" />

  </div>
</template>

<script>
import { request } from '@/components/request'
import { pagination } from '@/components/pagination'
import { getMonitorInfo } from '@/api/api.js'
import { conversion, time } from '@/utils/rateUnitExchange.js'
export default {
  name: 'TerminalBox',
  data () {
    return {
      total: 0,
      currentPage: 1,

      info: '设备信息',
      headerStyle: {
        color: 'rgb(70, 114, 196)'
      },
      list: [
        {
          IP: '',
          MAC: '',
          duration: '',
          uprate: '',
          downrate: ''
        }
      ]
    }
  },

  methods: {
    getInfo () {
      let para = {}
      para.type = 1
      para.page = this.currentPage
      getMonitorInfo(para)
        .then((res) => {
          if (res.data.code === 200) {
            if (res.data.data.length !== 0) {
              this.list = res.data.data
              this.total = res.data.total
              for (let i = 0; i < res.data.data.length; i++) {
                this.list[i].IP = res.data.data[i].ip
                this.list[i].MAC = res.data.data[i].mac
                this.list[i].upRate = conversion(res.data.data[i].send_rate)
                this.list[i].downRate = conversion(res.data.data[i].recv_rate)
                this.list[i].duration = time(res.data.data[i].duration)
              }
            } else {
              if (res.data.total === 0) {
                this.list = res.data.data
                this.total = res.data.total
              } else {
                this.currentPage -= 1
                this.getTerminalInfo()
              }
            }
          }
        })
        .catch(error => {
          console.log(error)
        })
      let res = request('getMonitorInfo', para)
      this.list = this.translate(res.data)
    },

    handlePagination (val) {
      let para = {}
      para.type = 1
      para.page = this.currentPage
      let res = pagination('getMonitorInfo', para, val)
      this.currentPage = res.page
      this.list = this.translate(res.data)
    },

    translate (list) {
      for (let i = 0; i < this.list.length; i++) {
        this.list[i].upRate = conversion(this.list[i].send_rate)
        this.list[i].downRate = conversion(this.list[i].recv_rate)
        this.list[i].duration = time(this.list[i].duration)
      }
    }
  },

  mounted () {
    this.getInfo()
  }
}
</script>

<style scoped lang="scss">
.ternimal_container {
  height: 100%;
  border: 1px solid ghostwhite;
  border-radius: 1rem;
  background: #fff;
  color: rgb(70, 114, 196);
  border: 1px solid grey;
  .header {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
    .tip {
      width: 10rem;
      height: 1rem;
      line-height: 1rem;
    }
  }
  .content {
    width: 95%;
    padding-bottom: 1rem;
    .title {
      font-size: 150%;
      margin: 2rem auto auto 2rem;
    }
    .table {
      margin-left: 1rem;
    }
  }
  .el-pagination {
    float: right;
  }
}
</style>
