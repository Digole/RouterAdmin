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
  name: 'Isis',
  data () {
    return {
      type: 'isis',
      code: 2608
    }
  },
  components: {
    shell
  }
}
</script>
