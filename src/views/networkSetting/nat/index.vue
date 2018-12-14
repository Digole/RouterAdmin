<template>
  <section>
    <!--1-->
    <!-- <div>
      <div class="line_02">
        <span>{{ $t('NAT.dividingLine.title1') }}</span>
      </div>
    </div>
    <div class="top">
      <adaptive class="whole-router"/>
      <fragment class="tips"/>
    </div> -->

    <!--2-->
    <div>
      <div class="line_02">
        <span>{{ $t('NAT.dividingLine.title2') }}</span>
      </div>
    </div>
    <echarts/>

    <!--3-->
    <div>
      <div class="line_02">
        <span>{{ $t('NAT.dividingLine.title3') }}</span>
      </div>
    </div>
    <alias/>

    <!--4-->
    <div>
      <div class="line_02">
        <span>{{ $t('NAT.dividingLine.title4') }}</span>
      </div>
    </div>
    <mapping/>
  </section>
</template>

<script>
import { adaptive, fragment, echarts, alias, mapping } from './components'

export default {
  name: 'Index',
  components: {
    adaptive,
    fragment,
    echarts,
    alias,
    mapping
  },
  data () {
    return {
      tooltipLabelWidth: '100px',
      formLabelWidth: '130px'
    }
  },
  methods: {
    headerStyle () {
      return this.header()
    }
  }
}
</script>

<style scoped>
p {
  margin: 0;
}

.top {
  width: 100%;
  display: flex;
}

.whole-router {
  width: 65%;
}
.text {
  font-weight: bold;
}

.tips {
  flex-grow: 1;
  margin-left: 50px;
  border: 1px solid lightgrey;
}

.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.triangular {
  border: 10px solid lightgoldenrodyellow;
  border-bottom-color: #f00;
  width: 0;
  height: 0;
  margin: auto;
}
</style>
