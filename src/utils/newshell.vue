<template>
  <div>
    <div class="line_02">
      <span>动态路由</span>
    </div>

    <el-col>
      <el-form :inline="true">
        <el-form-item>
          <span style="width:200px;">协议状态: {{ status }} </span>
        </el-form-item>

        <!-- 11.14 该按钮废除 -->
        <!-- <el-form-item>
          <el-button
            v-if="proStatus && status !== '启用中'+' '"
            :disabled="btnStatus"
            type="primary"
            @click="link">{{ $t('newshell.connect') }}</el-button>
          <el-button
            v-else
            :disabled="status === '停止运行' || ('启用中'+' ')"
            type="primary"
            @click="unlink">{{ $t('newshell.disconnect') }}</el-button>
          10.29 pky 将按钮改为开关
          <el-switch
            v-model = "switchStatus"
            :disabled="btnStatus || status !== '停止运行'"
            @change = "switchChange"
            active-text="启用中"
            inactive-text="未启用"> />
          </el-switch>
        </el-form-item> -->

        <el-form-item>
          <el-button
            v-if="shellStatus"
            :disabled="btnStatus || status === '停止运行'"
            type="primary"
            @click="startWebSocket">启动动态路由配置</el-button>
          <el-button
            v-else
            type="danger"
            @click="stopWebSocket">关闭配置</el-button>
        </el-form-item>

        <el-form-item class="right">
          <el-button
            :disabled="btnStatus"
            type="danger"
            @click="stopAllWebSocket">关闭所有配置shell</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <div
      v-if="!shellStatus"
      class="container">
      <div
        id="content-container"
        class="shell_container">

        <div
          v-for="(item, index) in interactList"
          :key="index"
          class="line">
          <vue-typer
            v-if="index !== (interactList.length - 1)"
            :text="item"
            :repeat="0"
            :type-delay="0" />
        </div>
        <div class="line">
          <!-- <input v-model="interactList[interactList.length - 1]"> -->
          <vue-typer
            :text="interactList[interactList.length -1]"
            :repeat="0"
            :type-delay="0" />
          <vue-typer
            v-for="(item, index) in lastLine"
            :key="index"
            :text="item"
            :repeat="0"
            :type-delay="0" />
        </div>

      </div>
    </div>
  </div>

</template>

<script>
import { VueTyper } from 'vue-typer'
import {
  setQuagga,
  getQuaggaInfo,
  setShell,
  getBtnInfo,
  stopAllQuagga
} from '@/api/api.js'
export default {
  name: 'Sehll',
  components: {
    VueTyper
  },
  props: {
    code: { type: Number, default: 100 },
    type: { type: String, default: 'hello' }
  },
  data () {
    return {
      // content: '',
      interactList: [],
      lastLine: [],
      height: 0,

      socketUrl: '', // websocket服务器地址

      switchStatus: false,

      status: '', // 协议状态

      username: '',

      btnStatus: false, // 3个按钮是否可用，防止多用户操作 false为可以操作
      proStatus: true, // 用来判断协议按钮显示连接还是断开 true表示已连接或配置中
      shellStatus: true // 用来判断动态路由按钮显示连接还是断开 true表示已连接或配置中
    }
  },
  watch: {
    // 'this.$store.state.app.webSocket.count': function() {
    //   if (this.$store.state.app.webSocket.count > 1) {
    //     this.initListener()
    //   } else if (this.$store.state.app.webSocket.count === 1) {
    //     console.log('in init socket')
    //     this.initWebSocket()
    //     this.initListener()
    //   } else if (this.$store.state.app.webSocket.count === 0) {
    //     this.closeWebSocket()
    //     this.removeListener()
    //   }
    // },
    height: function () {
      let container = this.$el.querySelector('#content-container')
      container.scrollTop = container.scrollHeight
    },
    status: function () {
      if (this.status === '停止运行') {
        this.proStatus = false
        this.switchStatus = false
      } else {
        this.switchStatus = true

        if (this.btnStatus === true) {
          this.proStatus = true
        }
      }
    }
  },

  mounted () {
    let name = sessionStorage.getItem('user')
    name = JSON.parse(name)
    this.username = name.userName

    this.getQuagga()

    window.addEventListener('keyup', this.onClick)
    window.addEventListener('keydown', this.specifyKey)
  },
  destroyed () {
    this.closeWebSocket()
    window.removeEventListener('keyup', this.onClick)
    window.removeEventListener('keydown', this.specifyKey(event))
    // this.$store.state.app.webSocket.socket.removeEventListener('message', this.onmessage)
  },
  methods: {
    initWebSocket () {
      this.$store.state.app.webSocket.socket = new WebSocket(
        'ws://' + this.socketUrl + ':8000'
      )
      console.log('in init websocket')
      // this.$store.state.app.webSocket.socket = new WebSocket('ws://10.9.0.18:8000')
    },

    closeWebSocket () {
      this.$store.state.app.webSocket.socket.close()
      console.log('close websocket')
    },

    initListener () {
      this.$store.state.app.webSocket.socket.addEventListener(
        'message',
        this.onMessage
      )
    },

    removeListener () {
      this.$store.state.app.webSocket.socket.removeEventListener(
        'message',
        this.onMessage
      )
    },

    onMessage (evt) {
      console.log('get response')
      console.log('evt is ' + evt.data)
      console.log('type is ' + typeof evt.data)
      if (typeof evt.data === 'string') {
        /*
        result = evt.data.split('\r\n')

        if (result.length === 1) {
          // 处理键盘输入回显
          // if (result[0].length === 5 && result[0].charAt(4).charCodeAt() !== 8) {
          if (result[0].length === 5) {
            let letter = result[0].charAt(4)
            // this.interactList[this.interactList.length - 1] += letter
            this.lastLine.push(letter)
          } else if (
            result[0].length === 7 &&
            result[0].charAt(4).charCodeAt() === 8
          ) {
            // 处理backspace,后端返回的值为code + '08 20 08' （ascii码）
            this.lastLine = this.lastLine.slice(0, this.lastLine.length - 1)
          } else if (
            result[0].length > 5 &&
            result[0].charAt(4).charCodeAt() !== 8
          ) {
            // 处理上键的返回值
            this.lastLine = result[0].slice(4, result[0].length)
          } else if (
            result[0].length > 7 &&
            result[0].charAt(4).charCodeAt() === 8
          ) {
            // 处理两次及以上上键的返回值
            for (let i = 4; i < result[0].length; i++) {
              if (result[0].charAt(i).charCodeAt() !== 8) {
                // 因为后端传回的有 /b * n + 空格 * n + /b * n，所以需要去掉3*(i-4)的内容
                this.lastLine = result[0].slice(
                  4 + (i - 4) * 3,
                  result[0].length
                )
                return true
              }
            }
          }
        } else {
          // 处理非键盘回显
          result.forEach((element, index) => {
            if (index !== 0) {
              this.interactList.push(element)
              this.$store.state.app.webSocket.contentList.push(
                this.code + element
              )
              console.log('have pushed! ')
            }
            this.lastLine = []
            // 让屏幕保持在底部
            setTimeout(() => {
              this.height++
            }, 100)
          })
        }
        */

        // 第一步，去掉头
        let resultContent = evt.data.substring(4, evt.data.length)

        // 第二步，区别单行还是多行
        let result = resultContent.split('\r\n')

        // 第三步，处理单行
        if (result.length === 1) {
          // 处理单字节
          if (result[0].length === 1) {
            this.lastLine.push(result[0])
          } else if (result[0].length > 1) {
            // 处理backspace,后端返回的值为code + '08 20 08' （ascii码）
            // 处理多字节
            let val = result[0].split(' ')
            handleBackSpace(val)

            console.log('attention! after handle backspace! ' + val)
          }
        }

        // 第四步，处理多行
        if (result.length > 1) {
          result.forEach((element, index) => {
            if (index !== 0) {
              this.interactList.push(element)
              this.$store.state.app.webSocket.contentList.push(
                this.code + element
              )
              console.log('have pushed! ')
            }
            this.lastLine = []
            // 让屏幕保持在底部
            setTimeout(() => {
              this.height++
            }, 100)
          })
        }
      }

      function handleBackSpace (val) {
        val.forEach((element, index, array) => {
          if (element.charAt(0).charCodeAt() > 31 && element.charAt(0).charCodeAt() < 127) {
            this.lastLine.push(element)
          } else if (element.charAt(0).charCodeAt() === 8) {
            // 得到当前连续backspace最后一个所在位置
            let indexOfEndBackspace = checkBackSpace(array)
            // 得到backspace连续长度
            let numberOfBackSpace = indexOfEndBackspace - index + 1
            // 删除之后的连续backspace，因为是 08 20 08，所以要*3
            array.slice(index, numberOfBackSpace * 3)
            if (numberOfBackSpace >= index) {
              // 如果backspace长度大于之前有效数据长度，之前数据全部删除
              array.slice(0, index + 1)
            } else {
              // 如果小于，删除backspace数量的之前有效数据
              array.slice(index + 1 - numberOfBackSpace, numberOfBackSpace)
              console.log(
                'attention! number < index, the left string are ' + array
              )
            }
            // 删除完成后退出，重新从头开始循环
            handleBackSpace(val)
          }
          // 退出，数据处理完成
          return true
        })
      }

      // 检查是否有连续的backspace
      function checkBackSpace (array, index = 0) {
        if (array.charAt(index).charCodeAt() === 8) {
          index++
          checkBackSpace(array, index)
        } else return index
      }
    },

    getHistory () {
      this.$store.state.app.webSocket.contentList.forEach(element => {
        console.log('history is ' + element)
        if (element.slice(0, 3) === this.code) {
          this.interactList.push(element.slice(3))
        }
      })
    },

    socketStatus (val) {
      if (val) {
        // count已停用
        //   this.$store.state.app.webSocket.count++
        //   console.log('count++ ' + this.$store.state.app.webSocket.count)
        //   if (this.$store.state.app.webSocket.count === 1) {
        this.initWebSocket()
        this.initListener()
        //   }
        //   if (this.$store.state.app.webSocket.count > 1) {
        //     this.initListener()
        //     this.getHistory()
        //   }
      } else {
        //   this.$store.state.app.webSocket.count--
        //   this.$store.state.app.webSocket.socket.removeEventListener(
        //     'message',
        //     this.onmessage
        //   )
        //   if (this.$store.state.app.webSocket.count === 0) {
        this.closeWebSocket()
        // }
      }
    },

    onClick (val) {
      console.log(val.key)
      if (this.$store.state.app.webSocket.socket) {
        this.$store.state.app.webSocket.socket.send(this.code + val.key)
      }
    },

    specifyKey (e) {
      console.log('aaaaaaaaaaaaaaa')
      console.log(e)
    },

    // 启动动态路由协议
    link () {
      let para = {
        name: this.type,
        handle: 'start'
      }
      setQuagga(para)
        .then(res => {
          if (res.data.code === 200) {
            this.proStatus = false
            this.getQuagga()
          }
          if (res.data.code === 100) {
            this.$message({
              message: '其他用户正在配置中，请稍后再试',
              type: 'warning'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    unlink () {
      let para = {
        name: this.type,
        handle: 'stop'
      }
      setQuagga(para)
        .then(res => {
          if (res.data.code === 200) {
            this.proStatus = true
            this.getQuagga()
          }
          if (res.data.code === 100) {
            this.$message({
              message: '其他用户正在配置中，请稍后再试',
              type: 'warning'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 开启动态路由配置
    startWebSocket () {
      this.socketStatus(1)
      setTimeout(() => {
        this.setShellInfo()
      }, 1000)
    },

    setShellInfo () {
      let para = {
        name: this.type,
        usrname: this.username,
        handle: 'start'
      }

      setShell(para)
        .then(res => {
          if (res.data.code === 200) {
            // 启动按钮不显示
            this.shellStatus = false
            this.getQuagga()
          }
          if (res.data.code === 100) {
            this.$message({
              message: '其他用户正在配置中，请稍后再试',
              type: 'warning'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    stopWebSocket () {
      let para = {
        name: this.type,
        usrname: this.username,
        handle: 'stop'
      }
      setShell(para)
        .then(res => {
          if (res.data.code === 200) {
            this.shellStatus = true

            // 启动按钮不显示
            this.getQuagga()

            // 处理websocket是否需要被清空
            this.socketStatus(0)
          }
          if (res.data.code === 100) {
            this.$message({
              message: '其他用户正在配置中，请稍后再试',
              type: 'warning'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })

      this.interactList = []
    },

    stopAllWebSocket () {
      stopAllQuagga()
        .then(res => {
          if (res.data.code === 200) {
            this.$store.state.app.webSocket.count = 0
            this.shellStatus = true
            this.proStatus = true
            this.getQuagga()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 获取当前页面状态信息
    getQuagga (resolve, reject) {
      let para = {
        name: this.type
      }
      getQuaggaInfo(para)
        .then(res => {
          if (res.data.code === 200) {
            if (res.data.status === 0) {
              this.status = '停止运行'
            }
            if (res.data.status === 1) {
              this.status = '启用中 ' // 加空格保证右边按钮位置不变
            }
            if (res.data.status === 2) {
              this.status = '配置中 '
            }
          }
        })
        .catch(err => {
          console.log(err)
        })

      let para2 = {
        usrname: this.username
      }
      console.log('before get btn info ' + para2.usrname)
      getBtnInfo(para2)
        .then(res => {
          if (res.data.code === 200) {
            this.btnStatus = false
          } else if (res.data.code === 500) {
            this.btnStatus = true
          }
          this.socketUrl = res.data.websockip
        })
        .then(res => {
          if (this.socketUrl !== '') {
            this.startWebSocket()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 该函数用来处理开关的操作 10.29 pky
    switchChange (val) {
      if (val) {
        this.link()
      } else {
        this.unlink()
      }
      this.switchStatus = !this.switchStatus
    }
  }
}
</script>

<style>
.right {
  float: right;
}
</style>
