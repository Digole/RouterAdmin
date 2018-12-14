
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
  name: 'Pim',
  data () {
    return {
      type: 'pim',
      code: 2611
    }
  },
  components: {
    shell
  }
}
</script>
