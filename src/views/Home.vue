<template>
  <el-row class="container">

    <el-col
      :span="24"
      class="header">

      <el-col
        :span="5"
        :class="collapsed?'logo-collapse-width':'logo-width'"
        class="logo">
        {{ collapsed?'':version }}
      </el-col>

      <el-col :span="1">
        <!-- <div class="tools" @click.prevent="collapse" v-model="isCollapse"> -->
        <div
          class="tools"
          @click.prevent="collapse">
          <i class="fa fa-align-justify"/>
        </div>
      </el-col>

      <el-col :span="13">
        <div>
          <span
            :class="{selected: lang === 'zh'}"
            class="lang"
            @click="chooseLang('zh')">中文</span>
          <span>/</span>
          <span
            :class="{selected: lang === 'en'}"
            class="lang"
            @click="chooseLang('en')">EN</span>
        </div>
      </el-col>

      <el-col
        :span="2"
        class="usercategory">

        <el-dropdown trigger="hover">
          <span>{{ $t('home.professional') }}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="linkSceneMode">
              简易模式
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

      </el-col>

      <el-col
        :span="3"
        class="userinfo">
        <el-dropdown trigger="hover">
          <span class="el-dropdown-link userinfo-inner"><img :src="sysUserAvatar" > {{ sysUserName }}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="logout">{{ $t('home.logout') }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-col>

    <el-col
      :span="24"
      class="main">
      <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
        <el-menu
          :default-active="$route.path"
          :collapse="isCollapse"
          :collapse-transition="false"
          class="el-menu-vertical-demo"
          background-color="#222d32"
          text-color="#aabba1"
          unique-opened>
          <template
            v-for="(item,index) in $router.options.routes"
            v-if="!item.hidden">
            <el-submenu
              v-if="!item.leaf"
              :index="index+''"
              :key="index">
              <template slot="title">
                <i :class="item.iconCls"/>
                <span style="color:#aabba1;">{{ generateTitle(item.meta.title) }}</span>
              </template>
              <el-menu-item
                v-for="child in item.children"
                v-if="!child.hidden"
                :index="child.path"
                :key="child.path"
                @click="$router.push(child.path)">
                {{ generateTitle(child.meta.title) }}
              </el-menu-item>
            </el-submenu>
            <el-menu-item
              v-if="item.leaf&&item.children.length>0"
              :index="item.children[0].path"
              :key="index"
              @click="$router.push(item.children[0].path)">
              <i :class="item.iconCls"/>
              <span style="color:#aabba1;">{{ generateTitle(item.children[0].meta.title) }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </aside>

      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <el-col
            :span="6"
            class="breadcrumb-container">
            <el-breadcrumb
              separator="/"
              class="breadcrumb-inner">
              <el-breadcrumb-item
                v-for="item in $route.matched"
                :key="item.path">
                {{ item.name }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>

          <div class="monitor">
            <div class="inner-right">
              <svg class="icon">
                <use xlink:href="#icon-CPU"/>
              </svg>CPU:{{ data.cpu }}%
            </div>

            <div class="inner-right">
              <svg class="icon">
                <use xlink:href="#icon-shuju"/>
              </svg>{{ $t('home.ram') }}:{{ data.memory }}%
            </div>
            <div class="inner-right long">
              <svg class="icon">
                <use xlink:href="#icon-shangchuan1"/>
              </svg>{{ $t('home.up') }}:{{ data.up }}
            </div>
            <div class="inner-right long">
              <svg class="icon">
                <use xlink:href="#icon-xiazai1"/>
              </svg>{{ $t('home.down') }}:{{ data.down }}
            </div>
          </div>

          <el-col
            :span="24"
            class="content-wrapper">
            <transition
              name="fade"
              mode="out-in">
              <router-view/>
            </transition>
          </el-col>
        </div>
      </section>

    </el-col>
  </el-row>
</template>

<script>
import { generateTitle } from '@/utils/i18n'
import { getMonitorInfo, logout, getVersion } from '../api/api.js'
import { conversion } from '../utils/rateUnitExchange.js'

export default {
  name: 'Home',
  data () {
    return {
      collapsed: false,
      isCollapse: false,
      sysUserName: '',
      sysUserAvatar: '',
      version: '',
      system: [{ CPURate: '0', RAMRate: '0' }],
      data: {
        up: '',
        down: '',
        upStorage: '',
        downStorage: '',
        cpu: '',
        memory: '',
        userNum: ''
      }
    }
  },
  computed: {
    lang: {
      get () {
        // console.log('get')
        return this.$store.state.app.language
      },
      set (lang) {
        // console.log('set')
        this.$i18n.locale = lang
        this.$store.dispatch('setLanguage', lang)
      }
    }
  },

  mounted () {
    console.log(this.$router.options.routes)
    let user = sessionStorage.getItem('user')

    if (user) {
      user = JSON.parse(user)
      this.sysUserName = user.userName || ''
      this.sysUserAvatar = 'static/acoinfo.png' || ''
    }

    // user = JSON.parse(user);
    // this.sysUserName = user.userName;
    // this.sysUserAvatar = "static/acoinfo.png";

    this.getInfo()
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    },
    back: function () {
      this.$router.push('/ModeChoose')
    },

    // 退出登录
    logout: function () {
      let _this = this
      this.$confirm('确认退出吗?', '提示', {
        // type: 'warning'
      })
        .then(() => {
          let para = sessionStorage.getItem('user')
          logout(para).then(res => {
            if (res.data.code === 200) {
              sessionStorage.removeItem('user')
              _this.$router.push('/login')
            }
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 跳转至简易模式
    linkSceneMode () {
      this.$router.push('./sceneMode')
    },
    // 折叠导航栏
    collapse: function () {
      let user = sessionStorage.getItem('user')
      user = JSON.parse(user)
      console.log(user.userName)
      this.collapsed = !this.collapsed
      this.isCollapse = !this.isCollapse
    },

    showMenu (i, status) {
      this.$refs.menuCollapsed.getElementsByClassName(
        'submenu-hook-' + i
      )[0].style.display = status ? 'block' : 'none'
    },

    chooseLang (val) {
      this.lang = val
    },

    generateTitle,

    getInfo () {
      // 18.09.17 pky
      // 注销请求，太烦了，生产环境恢复

      // 10.30 pky 添加获取版本号
      getVersion()
        .then(res => {
          if (res.data.code === 200) {
            this.version = 'OpenRT v' + res.data.version
          }
        })

      this.update()
      setInterval(() => {
        this.update()
        this.$store.dispatch('pushSystemData', this.data)
      }, 5000)
    },

    async update () {
      let para = {}
      para.page = 1
      para.type = 5
      await getMonitorInfo(para)
        .then(res => {
          if (res.data.code === 200) {
            this.data.upStorage = res.data.data[0].recv_rate
            this.data.downStorage = res.data.data[0].send_rate
            this.data.up = conversion(res.data.data[0].recv_rate)
            this.data.down = conversion(res.data.data[0].send_rate)
            // console.log(this.data.up)
            this.$store.dispatch('pushSystemData', this.data)
          }
        })
        .catch(error => {
          console.log(error)
        })
      let para1 = {}
      para1.type = 6
      await getMonitorInfo(para1)
        .then(res => {
          if (res.data.code === 200) {
            this.data.cpu = res.data.cpu_usage.toFixed(0)
            this.data.memory = res.data.memory_usage.toFixed(0)
            this.data.userNum = res.data.online_users
          }
        })
        .catch(error => {
          console.log(error)
        })
      this.$store.dispatch('pushSystemData', this.data)
    }
  }
}
</script>

<style scoped lang="scss">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-dropdown {
  color: white;
  cursor: pointer;
}
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.container {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  .header {
    height: 60px;
    line-height: 60px;
    background: #3c8dbc;
    color: #fff;
    .usercategory {
      color: #fff;
    }
    .userinfo {
      text-align: right;
      padding-right: 35px;
      float: right;
      .userinfo-inner {
        cursor: pointer;
        color: #fff;
        img {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          margin: 10px 0 10px 10px;
          float: right;
        }
      }
    }
    .situationMode {
      right: 100px;
      padding-right: 35px;
    }
    .logo {
      //width:230px;
      height: 60px;
      font-size: 22px;
      padding-left: 20px;
      padding-right: 20px;
      border-color: rgba(238, 241, 146, 0.3);
      border-right-width: 1px;
      border-right-style: solid;
      img {
        width: 40px;
        float: left;
        margin: 10px 10px 10px 18px;
      }
      .txt {
        color: #fff;
      }
    }
    .logo-width {
      width: 200px;
    }
    .logo-collapse-width {
      width: 65px;
    }
    .tools {
      padding: 0 23px;
      width: 14px;
      height: 60px;
      line-height: 60px;
      cursor: pointer;
    }
    .lang {
      cursor: pointer;
      color: white;
    }
    .selected {
      color: goldenrod;
    }
  }
  .main {
    display: flex;
    // background: #324057;
    position: absolute;
    top: 60px;
    bottom: 0;
    overflow: hidden;
    aside {
      flex: 0 0 200px;
      width: 200px;
      // position: absolute;
      // top: 0px;
      // bottom: 0px;
      .el-menu {
        height: 100%;
      }
      .collapsed {
        width: 65px;
        .item {
          position: relative;
        }
        .submenu {
          position: absolute;
          top: 0;
          left: 65px;
          z-index: 99999;
          height: auto;
          display: none;
        }
      }
    }
    .menu-collapsed {
      flex: 0 0 60px;
      width: 60px;
    }
    .menu-expanded {
      flex: 0 0 200px;
      width: 200px;
    }
    .content-container {
      flex: 1;
      overflow-y: scroll;
      padding: 20px;
      .breadcrumb-container {
        //margin-bottom: 15px;
        .title {
          width: 200px;
          float: left;
          color: #475669;
        }
        .breadcrumb-inner {
          float: left;
        }
        .breadcrumb-inner-right {
          float: right;
          margin-right: 30px;
        }
      }
      .monitor {
        float: right;
        .inner-right {
          display: inline-block;
          width: 6rem;
        }
        .long {
          display: inline-block;
          width: 11rem;
        }
      }
      .content-wrapper {
        background-color: #fff;
        box-sizing: border-box;
      }
    }
  }
}
.el-radio-button__inner {
  background: blue;
}
</style>
