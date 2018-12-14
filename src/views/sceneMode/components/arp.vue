<template>
  <div>
    <el-table
      :data="formDynamic"
      :header-cell-style="headerStyle">
      <el-table-column
        prop="ipaddr"
        :label="$t('ARP.IP')"
        min-width="120"/>
      <el-table-column
        prop="hwaddr"
        :label="$t('ARP.MAC')"
        min-width="140"/>
      <el-table-column
        prop="status"
        :label="$t('ARP.status')"
        min-width="100">
        <template slot-scope="scope">
          <span :class="{ warning: scope.row.status === 'invalid' }">{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('operation.operation')"
        min-width="60">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status==='configured'"
            type="text"
            @click="edit(scope.row)"
            size="small">
            {{ $t('operation.edit') }}
          </el-button>
          <el-button
            type="text"
            @click="deleteForm(scope.row)"
            size="small">
            {{ $t('operation.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @current-change="handleCurrentChangeDynamic"
      :current-page="currentPageDynamic"
      :page-size="5"
      layout="total, prev, pager, next, jumper"
      :total="this.totalDynamic"/>
  </div>
</template>

<script>
import { getDynamicARP } from '@/api/api.js'
import validate from '@/utils/rules.js'
export default {
  name: 'ARP',
  data () {
    return {

      totalDynamic: 0,
      currentPageDynamic: 1,

      formDynamic: [],

      labelWidth: '5rem',

      rules: {
        ipaddr: [
          {
            validator: validate('ip', '请输入正确IP', 'IP不能为空')
          }
        ],
        hwaddr: [
          {
            validator: validate('mac', '请输入正确MAC', 'MAC不能为空')
          }
        ]
      }
    }
  },
  methods: {
    headerStyle () {
      return this.header()
    },

    handleCurrentChangeDynamic (val) {
      let para = {}
      para.ipaddr = ''
      para.hwaddr = ''
      para.oper_type = 'arp'
      para.page = val
      getDynamicARP(para)
        .then(res => {
          if (res.data.code === 200) {
            this.formDynamic = res.data.data
          }
          this.currentPageDynamic = val
        })
        .catch(error => {
          console.log(error)
        })
    },

    getDynamicARPInfo () {
      let para = {}
      para.ipaddr = ''
      para.hwaddr = ''
      para.page = this.currentPageDynamic
      getDynamicARP(para)
        .then(res => {
          if (res.data.code === 200) {
            if (res.data.length !== 0) {
              this.formDynamic = res.data.data
            } else {
              if (this.totalDynamic === 0) {
                this.totalDynamic = res.data.total
                this.formDynamic = res.data.data
              } else {
                this.currentPageDynamic -= 1
                this.getDynamicARPInfo()
              }
            }
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  mounted () {
    this.getDynamicARPInfo()
  }
}
</script>

<style lang="scss" scoped>
.warning {
  color: red;
}
.el-pagination {
  float: right;
}
</style>
