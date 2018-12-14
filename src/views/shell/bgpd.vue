<template>
  <div>
    <shell
      :code="code"
      :type="type"/>
  </div>
</template>

<script>
import shell from '@/utils/newshell.vue'
export default {
  name: 'Bgpd',
  data () {
    return {
      type: 'bgp',
      code: 2605
    }
  },
  components: {
    shell
  }
}
</script>
