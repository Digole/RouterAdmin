
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
  name: 'Rip',
  data () {
    return {
      type: 'rip',
      code: 2602
    }
  },
  components: {
    shell
  }
}
</script>
