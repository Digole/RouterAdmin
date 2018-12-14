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
  name: 'Ripng',
  data () {
    return {
      code: 2603,
      type: 'ripng'
    }
  },
  components: {
    shell
  }
}
</script>
