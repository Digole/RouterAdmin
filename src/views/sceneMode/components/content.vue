<template>
  <div class="router_container">
    <div class="header">
      <div class="tip">{{ $t('sceneRouter.cpu') + ': ' }}{{ CPU | percent }}</div>
      <div class="tip">{{ $t('sceneRouter.ram') + ': ' }}{{ RAM | percent }}</div>
    </div>

    <div class="content">
      <div class="square">
        <div class="square_title">{{ $t('sceneRouter.status') }}</div>
        <div class="square_body">
          <up-rate />
        </div>
      </div>

      <div class="square">
        <!-- <div class="square_title">{{ $t('sceneRouter.kidvpn') }}</div> -->
        <div class="square_title">KidVPN</div>
        <div
          class="square_body kidvpn-box"
          v-if="isShown">
          <el-tooltip :disabled="!isKidvpnClientInuse">
            <div
              slot="content"
              class="tip">
              <p class="label">服务器IP: {{ kidvpndata.public_ip }}</p>
              <p class="label">KidVPN IP: {{ kidvpndata.vnd_ip }}</p>
              <p class="label">密码: {{ kidvpndata.passwd }}</p>
              <p class="label">AES密钥: {{ kidvpndata.aeskey }}</p>
            </div>
            <div
              class="kidvpn client"
              :class="{ inuse: isKidvpnClientInuse }">
              <div class="text">KidVPN 客户端</div>
              <div class="text">{{ statusClient }}</div>
            </div>
          </el-tooltip>
          <el-tooltip :disabled="!isKidvpnServerInuse">
            <div
              slot="content"
              class="tip">
              <p class="label">服务器IP: {{ kidvpndata.public_ip }}</p>
              <p class="label">KidVPN IP: {{ kidvpndata.vnd_ip }}</p>
              <p class="label">密码: {{ kidvpndata.passwd }}</p>
              <p class="label">AES密钥: {{ kidvpndata.aeskey }}</p>
            </div>
            <div
              class="kidvpn client"
              :class="{ inuse: isKidvpnServerInuse }">
              <div class="text">KidVPN 服务器</div>
              <div class="text">{{ statusServer }}</div>
            </div>

          </el-tooltip>
        </div>
      </div>

      <div class="square">
        <div class="square_title">{{ $t('sceneRouter.upFlow') }}</div>
        <div class="square_body">
          <!-- send -->
          <flow data-type="default" />
        </div>
      </div>

      <div class="square">
        <div class="square_title">{{ $t('sceneRouter.downFlow') }}</div>
        <div class="square_body">
          <!-- recv -->
          <flow data-type="default" />
        </div>
      </div>

      <div class="square">
        <div class="square_title">{{ $t('sceneRouter.arp') }}</div>
        <div class="square_body">
          <arp/>
        </div>

      </div>

      <div class="square not_inuse">
        <div class="not_inuse_tip">{{ $t('sceneRouter.notInuse') }}</div>
      </div>
    </div>

  </div>

</template>

<script>
import upRate from '@/components/echart-line-rate.vue'
import flow from '@/components/echart-pie.vue'
import arp from './arp.vue'
export default {
  name: 'RouterContent',
  components: {
    upRate,
    flow,
    arp
  },
  props: {
    websocketdata: {
      type: Object,
      default: function () {
        return { websocketdata: [] }
      }
    },
    kidvpndata: {
      type: Object,
      default: function () {
        return { kidvpndata: [] }
      }
    }
  },
  filters: {
    percent: function (val) {
      if (!val) {
        return ''
      }
      val = Number(val).toFixed(1) + '%'
      return val
    }
  },
  data () {
    return {
      CPU: this.$store.state.app.systemData.cpu,
      RAM: this.$store.state.app.systemData.memory,

      isKidvpnClientInuse: false,
      isKidvpnServerInuse: false,

      statusClient: '',
      statusServer: '',

      getData: false
    }
  },
  computed: {
    isShown: function () {
      console.log('wawa')
      console.log(this.websocketdata)
      this.handleData()
      if (this.websocketdata) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    handleData () {
      console.log('wang' + JSON.stringify(this.websocketdata))

      console.log('in preparation')
      if (this.websocketdata) {
        if (this.websocketdata.kidvpn_client === 1) {
          this.isKidvpnClientInuse = true
          this.statusClient = '已启用'
        } else {
          this.isKidvpnClientInuse = false
          this.statusClient = '未启用'
        }
        if (this.websocketdata.kidvpn_server === 1) {
          this.isKidvpnServerInuse = true
          this.statusServer = '已启用'
        } else {
          this.isKidvpnServerInuse = false
          this.statusServer = '未启用'
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.router_container {
  border: 1px solid ghostwhite;
  border-radius: 1rem;
  background: #fff;
  color: rgb(70, 114, 196);
  border: 1px solid grey;

  .header {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
    .tip {
      width: 10rem;
      height: 1rem;
      line-height: 1rem;
    }
  }
  .content {
    display: flex;
    justify-content: space-around;
    flex-flow: row wrap;
    padding-bottom: 1rem;
    .square {
      width: 45%;
      height: 18rem;
      margin: 1rem auto;
      border-radius: 1rem;
      border: 1px solid grey;

      // background: rgb(156, 195, 229);
      .square_title {
        margin-left: 2rem;
        margin-top: 1rem;
        line-height: 2rem;
        font-weight: bold;
      }
      .square_body {
        height: 15rem;
      }
      .kidvpn-box {
        overflow: hidden;
        display: flex;
        flex-flow: row wrap;
        align-content: center;
        .kidvpn {
          flex: 1 1 auto;
          display: flex;
          justify-content: space-between;
          height: 2rem;
          min-width: 60%;
          line-height: 2rem;
          margin: 1rem 3rem;
          padding: .5rem 0;
          border-radius: .5rem;
          background-color: lightgray;
          .text {
            margin: 0 1rem;
          }
        }
        .inuse {
          background: lightgreen;
        }
      }
    }
    .not_inuse {
      text-align: center;
      line-height: 15rem;
      font-size: 200%;
      font-weight: bold;
      color: rgb(70, 114, 196);
      background: rgb(200, 200, 200);
    }
  }
}
.el-tooltip {
  height: 5rem;
  width: 5rem;
  padding: .5rem;
}
</style>
