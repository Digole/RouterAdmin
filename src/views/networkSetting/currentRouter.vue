<template>
  <section>
    <div class="line_02">
      <span>终端监控</span>
    </div>
    <el-table
      :data="users"
      @selection-change="selsChange"
      style="width: 100%;">
      <el-table-column
        prop="line"
        label="线路"
        min-width="120"/>
      <el-table-column
        prop="targetAddress"
        label="目的地址"
        min-width="180"/>
      <el-table-column
        prop="SubnetMask"
        label="子网掩码"
        min-width="120"/>
      <el-table-column
        prop="Gateway"
        label="网关"
        min-width="120"/>
      <el-table-column
        prop="metric"
        label="metric"
        min-width="120"/>
      <el-table-column
        prop="tip"
        label="备注"
        min-width="180"/>
    </el-table>
  </section>
</template>

<script>
export default {
  name: 'CurrentRouter'
}
</script>

<style scoped>
.line_02 {
  margin-bottom: 20px;
  margin-top: 30px;
  height: 1px;
  border-top: 1px solid #ddd;
  text-align: left;
  color: #909399;
}
.line_02 span {
  position: relative;
  top: -10px;
  background: #fff;
  padding: 0 30px 0 0;
  font-weight: bold;
}
</style>
