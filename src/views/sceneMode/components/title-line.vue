<template>
  <div class="title_line">
    <el-row>
      <el-col
        :span="4"
        class="router">{{ routerName }}
      </el-col>

      <el-col
        :span="2"
        :offset="2">
        <span
          class="title cursor"
          :class="{ is_choosen: zh }"
          @click="chooseLang('zh')">中文</span>
        <span>/</span>
        <span
          class="title"
          :class="{ is_choosen: !zh }"
          @click="chooseLang('en')">EN</span>
      </el-col>

      <el-col
        :span="3"
        :offset="6">
        <span class="cursor">{{ $t('sceneRouter.reset') }}</span>
      </el-col>

      <el-col :span="3">
        <span
          @click="jumpToMode"
          class="cursor">{{ $t('sceneRouter.sceneMode') }}</span>
      </el-col>

      <el-col :span="4">
        <el-dropdown>
          <span class=" user_name cursor">{{ sysUserName }}</span>
          <img :src="sysUserAvatar">
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click="signout"> {{ $t('sceneRouter.logout') }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import { logout } from '@/api/api.js'
export default {
  data () {
    return {
      routerName: 'OpenRT',
      zh: true,

      sysUserName: 'default',
      sysUserAvatar: ''
    }
  },

  methods: {
    chooseLang (val) {
      if (this.$store.state.app.language !== val) {
        this.$i18n.locale = val
        this.$store.dispatch('setLanguage', val)
        if (val === 'zh') {
          this.zh = true
        } else {
          this.zh = false
        }
      }
    },

    jumpToMode () {
      this.$router.push('/modeChoose')
    },

    signout () {
      this.$confirm('$t("sceneRouter.signoutTip")')
        .then(() => {
          let para = sessionStorage.getItem('user')
          logout(para).then(res => {
            if (res.data.code === 200) {
              sessionStorage.removeItem('user')
              this.$router.push('/login')
            }
          })
        })
        .bind(this)
    }
  },

  mounted () {
    let user = sessionStorage.getItem('user')
    console.log('user is ' + user)

    if (user) {
      user = JSON.parse(user)
      console.log('user is ' + user)
      this.sysUserName = user.userName || ''
      this.sysUserAvatar = '../../../../static/logo.png' || ''
    } else {
      this.sysUserAvatar = '../../../../static/logo.png'
      console.log('No user!')
    }
  }
}
</script>

<style scoped lang="scss">
.title_line {
  margin-bottom: 1rem;
  background-color: rgb(60, 141, 188);
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  .router {
    padding-left: 3rem;
    font-size: 2rem;
  }
  .el-col {
    height: 4rem;
    line-height: 4rem;
  }
  .title {
    cursor: pointer;
  }
  .is_choosen {
    color: orange;
  }
  .user_name {
    color: #fff;
  }
  img {
    width: 2rem;
    height: 2rem;
    border-radius: 1.5rem;
    margin: 1rem 0.5rem;
    float: right;
  }
  .cursor {
    cursor: pointer;
  }
}
</style>
