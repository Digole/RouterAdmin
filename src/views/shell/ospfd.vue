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
  name: 'Ospf',
  data () {
    return {
      type: 'ospf',
      code: 2604
    }
  },
  components: {
    shell
  }
}
</script>
