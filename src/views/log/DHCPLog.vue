<template>
  <section>

    <div class="line_02">
      <span>{{ $t('DHCPLog.DHCPLog') }}</span>
    </div>

    <textarea
      :value="log"
      readonly />

  </section>
</template>

<script>
export default {
  name: 'DHCPLog',
  data () {
    return {
      tip: '',
      log: ''
    }
  },
  methods: {
    generateTip () {
      this.tip = '读取中'
      this.log = this.tip
    },
    getLog () {
      // this.$axios.get('/action/dhcpdlog')
      this.$axios
        .get('/dhcpdlog')
        .then(res => {
          this.log = res.data
        })
        .catch(err => {
          console.log(err)
          this.log = '未能获取文件'
        })
    }
  },
  mounted () {
    this.generateTip()
    this.getLog()
  }
}
</script>

<style scoped>
textarea {
  width: 100%;
  height: 70vh;
  resize: none;
}
</style>
