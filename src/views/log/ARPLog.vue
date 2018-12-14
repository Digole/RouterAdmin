<template>
  <section>

    <div class="line_02">
      <span>{{ $t('ARPLog.ARPLog') }}</span>
    </div>
    <textarea
      :value="content"
      readonly />

  </section>
</template>

<script>
export default {
  name: 'ARPLog',
  data () {
    return {
      content: '获取中'
    }
  },
  methods: {
    generateTip () {
      this.tip = '读取中'
    },
    getLog () {
      // this.$axios.get('/action/dhcpdlog')
      this.$axios
        .get('/ArpSpoodDefenseLog')
        .then(res => {
          this.content = res.data
        })
        .catch(err => {
          console.log(err)
          this.content = '未能获取文件'
        })
    }
  },
  mounted () {
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
