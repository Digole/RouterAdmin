<template>
  <section>
    <div class="line_02"><span>{{ $t('systemSetting.restartShutdown') }}</span></div>
    <el-col :span="24">
      <el-form :inline="true">
        <el-form-item>
          <el-button
            type="danger"
            @click="restartNow" >{{ $t('systemSetting.restartNow') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="danger"
            @click="powerOffNow"
            right>{{ $t('systemSetting.powerOffNow') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="danger"
            @click="addTrigger"
            right>{{ $t('systemSetting.addTrigger') }}</el-button>
        </el-form-item>
        <!-- <el-form-item>
					<el-button type="danger" right>删除事件</el-button>
				</el-form-item> -->
      </el-form>
    </el-col>
    <el-table
      :data="form"
      style="width: 100%"
      :header-cell-style="headerStyle">
      <el-table-column
        prop="event"
        :label="$t('systemSetting.event')"/>
      <el-table-column
        prop="date"
        :label="$t('systemSetting.date')"/>
      <el-table-column
        prop="time"
        label="预设时间"/>
      <el-table-column
        prop="desc"
        label="事件描述"/>
      <el-table-column
        prop="oper_type"
        :label="$t('systemSetting.oper_type')">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status"
            size="small"
            @click="handleStop(scope.$index, scope.row)">{{ $t('systemSetting.handleStop') }}</el-button>
          <el-button
            v-else
            size="small"
            @click="handleStart(scope.$index, scope.row)">{{ $t('systemSetting.handleStart') }}</el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleDel(scope.$index, scope.row)">{{ $t('systemSetting.handleDel') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      layout="prev, pager, next"
      :total="total"
      :page-size="10"
      @current-change="handleChange"
      style="float: right"/>

    <el-dialog
      :title="$t('systemSetting.addTrigger')"
      :visible.sync="isAdd">
      <el-form
        ref="form"
        :model="powerEvent"
        label-width="6rem">
        <el-form-item
          prop="event"
          :label="$t('systemSetting.event')">
          <el-radio
            v-model="powerEvent.event"
            label="shutdown">{{ $t('systemSetting.shutdown') }}</el-radio>
          <el-radio
            v-model="powerEvent.event"
            label="restart">{{ $t('systemSetting.restart') }}</el-radio>
        </el-form-item>
        <el-form-item
          prop="date"
          :label="$t('systemSetting.date')">
          <!-- <el-input v-model="powerEvent.date" placeholder="示例: 20180808"></el-input> -->
          <el-date-picker
            v-model="powerEvent.date"
            type="date"
            value-format="yyyyMMdd"
            placeholder="选择日期"/>
        </el-form-item>
        <el-form-item
          prop="time"
          :label="$t('systemSetting.time')">
          <!-- <el-input v-model="powerEvent.time" placeholder="示例: 02:30"></el-input> -->
          <el-time-picker
            v-model="powerEvent.time"
            :picker-options="{selectableRange: '00:00:00 - 23:59:59'}"
            value-format="HHmm"
            placeholder="选择时间"/>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button
          size="small"
          @click="cancelAdd" >{{ $t('operation.cancel') }}</el-button>
        <el-button
          size="small"
          @click="submitAdd" >{{ $t('operation.submit') }}</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { powerOff, restart, getEvent, setEvent } from '../../api/api'

export default {
  name: 'RestartShutdown',

  data () {
    return {
      eventList: {
        event: '',
        time: '',
        handle: ''
      },
      powerEvent: {
        event_id: Number,
        event: 'shutdown',
        date: '',
        time: '',
        status: -1,
        oper_type: '',
        desc: ''
      },
      /*
        @number int 时间编号
        @event  int 事件: shutdowm/restart
        @date   string
        @time   string
        @status int
        @oper_type string
        @desc   string
        */
      form: [],

      isAdd: false,

      currentPage: 1,
      total: 0,
      event_id: 0

    }
  },

  methods: {
    headerStyle () {
      return this.header()
    },

    addTrigger () {
      this.isAdd = true
    },

    cancelAdd () {
      this.isAdd = !this.isAdd
    },

    submitAdd () {
      let para = Object.assign({}, this.powerEvent)
      para.oper_type = 'add'
      para.time = para.time.split('')
      para.time.splice(2, 0, ':')
      para.time = para.time.join('')
      this.setInfo(para)
      this.isAdd = !this.isAdd
    },

    handleDel (index, val) {
      let para = Object.assign(val)
      para.oper_type = 'delete'
      para.status = 0
      this.setInfo(para)
    },

    handleStart (index, val) {
      let para = Object.assign(val)
      para.oper_type = 'start'
      para.status = 1 // 状态改为启用
      console.log(val)
      this.setInfo(para)
    },

    handleStop (index, val) {
      let para = Object.assign(val)
      para.oper_type = 'stop'
      para.status = 0 // 状态改为禁用
      this.setInfo(para)
    },

    restartNow: function () {
      this.$confirm('确认立即重启吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          restart()
            .then(() => {
              this.$message({
                message: '发送成功',
                type: 'success'
              })
            })
        })
        .catch((error) => {
          console.log(error)
        })
    },

    powerOffNow () {
      this.$confirm('确认立即关机吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          powerOff()
            .then(() => {
              this.$message({
                message: '发送成功',
                type: 'success'
              })
            })
        })
        .catch((error) => {
          console.log(error)
        })
    },

    getInfo () {
      let para = {}
      para.page = this.currentPage

      getEvent(para)
        .then(res => {
          if (res.data.code === 200) {
            this.form = res.data.data
            this.total = res.data.total
            this.event_id = res.data.max_event_id
          }
        })
        .catch(error => {
          console.log(error)
        })
    },

    setInfo (para) {
      if (para === '' || para === null) {
        para = Object.assign({}, this.powerEvent)
      }
      if (para.oper_type === 'add') {
        para.event_id = this.event_id + 1
      }
      // para.time = para.time.split('')
      // console.log(para.time)
      // para.time.splice(2, 0, ':')
      // console.log(para.time)
      // para.time = para.time.join('')
      // console.log(para.time)
      if (para.status < 0) {
        para.status = 0
      }
      setEvent(para)
        .then(res => {
          if (res.data.code === 200) {
            this.getInfo()
          }
        })
    },

    handleChange (val) {
      this.currentPage = val
      this.getInfo()
    }
  },
  mounted () {
    this.getInfo()
  }
}
</script>

<style scoped>

</style>
