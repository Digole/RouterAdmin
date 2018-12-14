<template>
  <div class="table">
    <el-col
      :span="24"
      class="toolbar"
      style="padding-bottom: 0;">
      <el-form :inline="true">
        <el-form-item>
          <el-button
            type="primary"
            @click="addAliasHandle">{{ $t('operation.add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="danger"
            @click="delAliasHandle"
            :disabled="this.aliasSelections.length===0">{{ $t('operation.delete') }}</el-button>
        </el-form-item>
        <el-pagination
          layout="prev, pager, next"
          @current-change="aliasHandleCurrentChange"
          :page-size="5"
          :total=aliasTotal
          style="float:right;" />
      </el-form>
    </el-col>
    <!--新增网络别名-->
    <el-dialog
      :title="$t('NAT.alias.add')"
      :visible.sync="aliasFormVisible"
      width="50%">
      <el-form
        ref="aliasForm"
        :rules="rules"
        :model="aliasForm"
        label-width="6rem"
        size="small">
        <el-form-item
          prop="aliasip"
          :label="$t('NAT.alias.aliasAddress')">
          <el-input v-model="aliasForm.aliasip" />
        </el-form-item>
        <el-form-item
          prop="lanstart"
          :label="$t('NAT.alias.initialAddress')">
          <el-input v-model="aliasForm.lanstart" />
        </el-form-item>
        <el-form-item
          prop="lanend"
          :label="$t('NAT.alias.endAddress')">
          <el-input v-model="aliasForm.lanend" />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button
          type="danger"
          @click="aliasCancel">{{ $t('operation.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="addAliasSubmit">{{ $t('operation.submit') }}</el-button>
      </div>
    </el-dialog>

    <!--编辑网络别名-->
    <!-- <el-dialog title="编辑网络别名" :visible.sync="aliasEditFormVisible" width="50%">
      <el-form :model="aliasForm" label-position="left" ref="aliasForm" size="small">
        <el-form-item prop="aliasip" :label="$t('NAT.alias.aliasAddress')" :label-width="formLabelWidth">
          <el-input v-model="aliasForm.aliasip"></el-input>
        </el-form-item>
        <el-form-item  prop="lanstart" :label="$t('NAT.alias.initialAddress')" :label-width="formLabelWidth">
          <el-input v-model="aliasForm.lanstart"></el-input>
        </el-form-item>
        <el-form-item prop="lanend" :label="$t('NAT.alias.endAddress')" :label-width="formLabelWidth">
          <el-input v-model="aliasForm.lanend"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="aliasCancel">{{$t('operation.cancel')}}</el-button>
        <el-button type="primary" @click.native="editAliasSubmit">{{$t('operation.submit')}}</el-button>
      </div>
    </el-dialog> -->

    <!--网络别名表格-->
    <el-table
      :data="alias"
      ref="alias"
      v-focus
      @selection-change="aliasSelChange"
      style="width: 100%"
      :header-cell-style="headerStyle">
      <el-table-column
        type="selection"
        min-width="30" />
      <el-table-column
        type="index"
        width="60" />
      <el-table-column
        prop="aliasip"
        :label="$t('NAT.alias.aliasAddress')"
        min-width="120" />
      <el-table-column
        prop="lanstart"
        :label="$t('NAT.alias.initialAddress')"
        min-width="120" />
      <el-table-column
        prop="lanend"
        :label="$t('NAT.alias.endAddress')"
        min-width="120" />
      <el-table-column
        :label="$t('operation.operation')"
        min-width="120">
        <template slot-scope="scope">
          <!--<el-button size="small" @click="handleAliasEdit(scope.$index, scope.row)">编辑</el-button>-->
          <el-button
            size="small"
            @click="signalDelAliasHandle(scope.$index, scope.row)">{{ $t('operation.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  getAlias,
  addAlias,
  delAlias,
  editAlias
} from '@/api/api'
import validate from '@/utils/rules'

export default {
  name: 'Alias',
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      }
    }
  },
  watch: {
    aliasFormVisible: {
      handler: function () {
        if (this.aliasFormVisible === false) {
          this.$refs['aliasForm'].resetFields()
        }
      }
    }
  },
  data () {
    return {
      aliasFormVisible: false, // 网络别名添加表格显示控制
      aliasEditFormVisible: false, // 网络别名编辑表格显示控制

      aliasPage: 1,
      aliasTotal: 0,

      aliasForm: {
        aliasip: '', // 别名地址
        lanstart: '', // 起始地址
        lanend: '' // 结束地址
      },

      alias: [],
      aliasSelections: [], // 网络别名批量删除列表选中列

      tooltipLabelWidth: '6rem',
      formLabelWidth: '6rem',

      rules: {
        aliasip: [
          {
            validator: validate('ip', '请输入正确IP', 'IP不能为空！'),
            trigger: 'blur'
          }
        ],
        lanstart: [
          {
            validator: validate('ip', '请输入正确IP', 'IP不能为空！'),
            trigger: 'blur'
          }
        ],
        lanend: [
          {
            validator: validate('ip', '请输入正确IP', 'IP不能为空！'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    headerStyle () {
      return this.header()
    },

    // 获得alias信息
    getAliasInfo: function () {
      let para = {
        page: this.aliasPage,
        count: 5
      }
      getAlias(para)
        .then(res => {
          if (this.aliasPage === res.data.page) {
            if (res.data.total !== 0) {
              if (res.data.data.length !== 0) {
                this.aliasTotal = res.data.total
                this.alias = res.data.data
              } else if (res.data.total > 5) {
                this.aliasPage -= 1
                this.getAliasInfo()
              }
            } else {
              this.alias = []
            }
          } else {
            this.getAliasInfo()
          }
          // let alias1 = JSON.stringify(res.data.alias);
          // console.log("alias is "+alias1);
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 别名表格编辑
    handleAliasEdit: function (index, row) {
      this.aliasEditFormVisible = true
      this.aliasForm = Object.assign({}, row)
    },
    // 别名表格编辑提交
    editAliasSubmit: function () {
      let para = Object.assign({}, this.aliasForm)
      // console.log("aliasForm is"+this.aliasForm);
      editAlias(para)
        .then(() => {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.$refs['aliasForm'].resetFields()
          this.aliasEditFormVisible = false
          this.getAliasInfo()
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 别名表 编辑取消
    aliasCancel () {
      this.aliasFormVisible = false
      this.aliasEditFormVisible = false
    },
    // 别名表格添加处理
    addAliasHandle: function () {
      this.aliasFormVisible = true
    },
    // 别名表格添加提交
    addAliasSubmit: function () {
      let para = Object.assign({}, this.aliasForm)
      para.handle = 0
      console.log('66666')
      console.log(para)
      addAlias(para)
        .then(() => {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.$refs['aliasForm'].resetFields()
          this.getAliasInfo()
        })
        .then(() => {
          this.aliasFormVisible = false
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 别名表格批量删除
    delAliasHandle () {
      this.$confirm('确认删除记录吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          for (let i = 0; i < this.aliasSelections.length; i++) {
            del(this.aliasSelections[i])
            console.log(this.aliasSelections)
          }
        })
      this.getAliasInfo()

      function del (item) {
        let para = Object.assign({}, item)
        para.handle = 1
        // para.assport = para.assport + ''
        delAlias(para)
          .then(() => {})
          .catch(error => {
            console.log(error)
          })
      }
    },
    // 单独删除一个网络别名
    signalDelAliasHandle: function (index, row) {
      let para = Object.assign({}, row)
      para.handle = 1

      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        delAlias(para)
          .then(() => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getAliasInfo()
          })
          .catch(error => {
            console.log(error)
          })
      })
    },
    // 别名表格 分页选择 跳到选中页面
    aliasHandleCurrentChange (val) {
      this.aliasPage = val
      this.getAliasInfo()
    },
    // 别名表格 多选 确定选中选项
    aliasSelChange: function (sels) {
      this.aliasSelections = sels
      console.log(this.aliasSelections)
    }
  },
  mounted () {
    this.getAliasInfo()
  }
}
</script>

<style scoped>
.table {
  width: 100%;
}
</style>
