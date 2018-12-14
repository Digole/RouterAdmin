<template>
  <section>
    <div class="wholeRouter">
      <!--power button-->
      <div class="power">
        <div class="powerButton">
          <img
            style="width: 60px; height: 50px; border-radius: 5px;"
            :src="powerButton" >
          <div class="text-area">
            <p class="text">调试</p>
          </div>
        </div>
      </div>

      <div class="router">
        <div
          v-for="(item, index) in ports"
          class="port"
          :key="index">
          <div>
            <el-tooltip
              class="item"
              effect="light">
              <img
                style="width: 60px; height: 50px; border-radius: 5px;"
                :src=selectUrl(item.linkstatus)
                @click="dialog(index, item)" >
              <div
                slot="content"
                class="tooltip-content">
                <h3>{{ ports[index].webname }}</h3>
                <el-form
                  label-position="left"
                  size="mini">
                  <el-form-item
                    label="连接状态:"
                    :label-width="tooltipLabelWidth"
                    style="margin: 0;">
                    {{ ports[index].linkstatus }}
                  </el-form-item>
                  <el-form-item
                    label="LAN IP:"
                    :label-width="tooltipLabelWidth"
                    style="margin: 0;">
                    {{ ports[index].ip }}
                  </el-form-item>
                  <el-form-item
                    label="子网掩码:"
                    :label-width="tooltipLabelWidth">
                    {{ ports[index].netmask }}
                  </el-form-item>
                </el-form>
                <el-form
                  label-position="left"
                  size="small">
                  <el-form-item
                    label="设备名称:"
                    :label-width="tooltipLabelWidth"
                    style="margin: 0;">
                    {{ ports[index].devname }}
                  </el-form-item>
                  <el-form-item
                    label="MAC地址:"
                    :label-width="tooltipLabelWidth"
                    style="margin: 0;">
                    {{ ports[index].mac }}
                  </el-form-item>
                  <el-form-item
                    label="网卡速率:"
                    :label-width="tooltipLabelWidth"
                    style="margin: 0;">
                    {{ ports[index].speed }}
                  </el-form-item>
                </el-form>
              </div>
            </el-tooltip>
            <div class="text-area">
              <span v-show="item.function !== 'normal'">
                <svg class="icon">
                  <use :xlink:href="selectIcon(item.function)"/>
                </svg>
              </span>
              <span>{{ ports[index].webname }}</span>
              <span v-show="item.type !== 'normal'">
                <svg class="icon">
                  <use :xlink:href="selectIcon2(item.type)"/>
                </svg>
              </span>
            </div>
          </div>
        </div>
        <!-- <div v-if="checked !== 200" class="mask"> -->
        <div
          v-if='false'
          class="mask">
          <el-button
            class="button"
            type="primary"
            @click="sortingHandle">{{ $t('NAT.adaptive.maskTip') }}</el-button>
        </div>
      </div>
    </div>

    <el-dialog
      title="配置网卡"
      :visible.sync="isSettingNetcardVisible"
      width="30%">

      <!--inner dialog LAN-->
      <el-dialog
        width="30%"
        height="100%"
        :title="$t('INEXNetwork.cardConfig.innerLANTitle')"
        :visible.sync="isLANInnerVisible"
        append-to-body>
        <el-form
          :model="lanForm"
          label-position="left"
          size="small"
          ref="lanForm"
          :rules="rules">
          <el-form-item
            prop="ip"
            :label="$t('INEXNetwork.cardConfig.IPAddress')"
            :label-width="formLabelWidth">
            <el-input
              v-model="lanForm.ip"
              auto-complete="off"/>
          </el-form-item>
          <el-form-item
            prop="netmask"
            :label="$t('INEXNetwork.cardConfig.mask')"
            :label-width="formLabelWidth">
            <el-input
              v-model="lanForm.netmask"
              auto-complete="off"
              placeholder="255.255.255.0"/>
          </el-form-item>
          <el-form-item
            prop="gateway"
            :label="$t('INEXNetwork.cardConfig.gateway')"
            :label-width="formLabelWidth">
            <el-input
              v-model="lanForm.gateway"
              auto-complete="off"
              placeholder=""/>
          </el-form-item>
          <!-- <el-form-item
            label="启用为 LAN口"
            :label-width="formLabelWidth">
            <el-checkbox
              v-model="isLANPort"
              @click.native="setPort('lan')"/>
            <el-checkbox v-model="isLANPort"/>
          </el-form-item> -->

          <!--components of collapse-->
          <el-collapse class="advancedSetting">
            <el-collapse-item
              :title="$t('INEXNetwork.cardConfig.collapseTitle')"
              name="1">
              <el-form
                :model="advancedLANForm"
                label-position="left"
                size="small"
                ref="advancedLANForm">

                <el-form-item
                  :label="$t('INEXNetwork.cardConfig.workingMode')"
                  prop="mode"
                  :label-width="formLabelWidth">
                  <el-select
                    v-model="advancedLANForm.mode"
                    placeholder="请选择"
                    value=""
                    style="width: 100%;">
                    <el-option
                      v-for="item in modeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"/>
                  </el-select>
                </el-form-item>

                <el-form-item
                  :label="$t('INEXNetwork.cardConfig.rate')"
                  prop="rate"
                  :label-width="formLabelWidth">
                  <el-select
                    v-model="advancedLANForm.rate"
                    placeholder="请选择"
                    value=""
                    style="width: 100%;">
                    <el-option
                      v-for="item in rateOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"/>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item :label="$t('INEXNetwork.cardConfig.LANControl')" prop="control" :label-width="formLabelWidth">
                  <el-checkbox v-model="advancedLANForm.control">{{$t('INEXNetwork.cardConfig.LANOptions')}}</el-checkbox>
                </el-form-item> -->
              </el-form>
            </el-collapse-item>
          </el-collapse>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer">
          <el-button
            type="danger"
            @click="LANFormCancel">{{ $t('operation.cancel') }}</el-button>
          <el-button
            type="danger"
            @click="LANFormPrevious">{{ $t('operation.previous') }}</el-button>
          <el-button
            type="primary"
            @click="LANFormSubmit">{{ $t('operation.determine') }}</el-button>
        </div>
      </el-dialog>

      <!--inner dialog WAN-->
      <el-dialog
        width="30%"
        height="100%"
        :title="$t('INEXNetwork.cardConfig.innerWANTitle')"
        :visible.sync="isWANInnerVisible"
        append-to-body>
        <el-form
          :rules="rules"
          :model="wanForm"
          label-position="left"
          size="small"
          ref="wanForm">
          <el-form-item
            :label="$t('INEXNetwork.cardConfig.linkType')"
            prop="accessMode"
            :label-width="formLabelWidth">
            <el-select
              v-model="wanForm.accessMode"
              placeholder="请选择"
              style="width: 100%;"
              @change="onSelect">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>

          <!-- ASDL连接所用的form,嵌入在inner dialog WAN中 -->
          <el-form
            :model="formDialUp"
            ref="formDialUp"
            v-if="isASDLVisible">
            <el-form-item
              :label="$t('INEXNetwork.cardConfig.account')"
              prop="account"
              :label-width="formLabelWidth">
              <el-input
                v-model="formDialUp.account"
                auto-complete="off"
                maxlength="19"
                :disabled="isGottonStatus"/>
            </el-form-item>
            <el-form-item
              :label="$t('INEXNetwork.cardConfig.passwd')"
              prop="passwd"
              :label-width="formLabelWidth">
              <el-input
                v-model="formDialUp.passwd"
                auto-complete="off"
                maxlength="19"
                :disabled="isGottonStatus"/>
            </el-form-item>
            <el-form-item
              :label="$t('INEXNetwork.cardConfig.status')"
              prop="status"
              v-model="formDialUp.status"
              :label-width="formLabelWidth"
              v-loading="isGottonStatus">
              {{ formDialUp.status }}
              <el-button
                type="primary"
                @click="dialLink"
                style="margin-left: 20px"
                v-loading="isLoading"
                :disabled="isInCancel"
                v-if="isConnectionShow">{{ $t('operation.connect') }}</el-button>
              <el-button
                type="danger"
                @click="dialCancel"
                style="margin-left: 20px"
                v-loading="isInCancel"
                v-if="!isConnectionShow && !isFinishConnection">{{ $t('operation.cancel') }}</el-button>
              <el-button
                type="danger"
                @click="unbind"
                style="margin-left: 20px"
                v-if="isFinishConnection">{{ $t('operation.disconnect') }}</el-button>
            </el-form-item>
          </el-form>

          <!-- DHCP所用的form,嵌入在inner dialog WAN中 -->
          <el-form v-if="isDHCP">
            <el-form-item
              :label="$t('INEXNetwork.cardConfig.status')"
              :label-width="formLabelWidth">
              {{ DHCPStatus }}
              <el-button
                type="primary"
                @click="DHCPLink"
                style="margin-left: 20px"
                v-if="!isDHCPConnected">
                {{ $t('operation.connect') }}
              </el-button>
              <el-button
                type="danger"
                @click="DHCPDisconnect"
                style="margin-left: 20px"
                v-else>
                {{ $t('operation.disconnect') }}
              </el-button>
            </el-form-item>
          </el-form>

          <el-form-item
            :label="$t('INEXNetwork.cardConfig.IPAddress')"
            prop="ip"
            :label-width="formLabelWidth">
            <el-input
              v-model="wanForm.ip"
              :disabled="isASDLVisible||isDHCP"
              auto-complete="off"/>
          </el-form-item>
          <el-form-item
            :label="$t('INEXNetwork.cardConfig.mask')"
            prop="netmask"
            :label-width="formLabelWidth">
            <el-input
              v-model="wanForm.netmask"
              :disabled="isASDLVisible||isDHCP"
              auto-complete="off"/>
          </el-form-item>
          <el-form-item
            :label="$t('INEXNetwork.cardConfig.gateway')"
            prop="gateway"
            :label-width="formLabelWidth">
            <el-input
              v-model="wanForm.gateway"
              :disabled="isASDLVisible||isDHCP"
              auto-complete="off"/>
          </el-form-item>
          <el-form-item
            label="启用为WAN口"
            :label-width="formLabelWidth">
            <!-- <el-checkbox v-model="isWANPort" @click.native="setPort('wan')"></el-checkbox> -->
            <el-checkbox v-model="isWANPort"/>
          </el-form-item>
          <!-- <el-form-item :label="$t('INEXNetwork.cardConfig.primaryDNS')" prop="primaryDNS" :label-width="formLabelWidth">
            <el-button type="primary" :disabled="isASDLVisible" @click="pushDNS">{{$t('operation.setting')}}</el-button>
          </el-form-item>
          <el-form-item :label="$t('INEXNetwork.cardConfig.optionalDNS')" prop="secondaryDNS" :label-width="formLabelWidth">
            <el-button type="primary" :disabled="isASDLVisible" @click="$router.push({ path: '../DNS' })">{{$t('operation.setting')}}</el-button>
          </el-form-item> -->
        </el-form>

        <!--components of collapse-->
        <el-collapse class="advancedSetting">
          <el-collapse-item
            :title="$t('INEXNetwork.cardConfig.collapseTitle')"
            name="1">
            <el-form
              :model="advancedWANForm"
              label-position="left"
              size="small"
              ref="advancedWANForm">
              <el-form-item
                :label="$t('INEXNetwork.cardConfig.workingMode')"
                prop="mode"
                :label-width="formLabelWidth">
                <el-select
                  v-model="advancedWANForm.mode"
                  placeholder="请选择"
                  style="width: 100%;"
                  value="">
                  <el-option
                    v-for="item in modeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"/>
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('INEXNetwork.cardConfig.rate')"
                prop="rate"
                :label-width="formLabelWidth">
                <el-select
                  v-model="advancedWANForm.rate"
                  placeholder="请选择"
                  style="width: 100%;"
                  value="">
                  <el-option
                    v-for="item in rateOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
        <div
          slot="footer"
          class="dialog-footer">
          <el-button
            type="danger"
            @click="WANFormCancel">{{ $t('operation.cancel') }}</el-button>
          <el-button
            type="danger"
            @click="WANFormPrevious"
            v-show="isButtonVisible">{{ $t('operation.previous') }}</el-button>
          <el-button
            type="primary"
            @click="WANFormSubmit">{{ $t('operation.determine') }}</el-button>
        </div>
      </el-dialog>

      <!--outer dialog-->
      <el-form
        :model="optionForm"
        label-position="left"
        size="small"
        ref="optionForm">
        <el-form-item
          :label="$t('INEXNetwork.cardConfig.chooseFunc')"
          prop="id"
          :label-width="formLabelWidth">
          <el-select
            v-model="optionForm.id"
            placeholder="请选择内外网"
            value="">
            <el-option
              :label="$t('INEXNetwork.cardConfig.LAN')"
              value="lan"
              :disabled="isLANPort"/>
            <el-option
              :label="$t('INEXNetwork.cardConfig.WAN')"
              value="wan"
              :disabled="isWANPort"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button
          type="danger"
          @click="unbindGeneral"
          :disabled="unbindEnable">{{ $t('operation.unbind') }}</el-button>
        <el-button
          type="primary"
          @click="nextStep">{{ $t('operation.next') }}</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import validate from '@/utils/rules.js'
import { getPorts, dialUp, DHCP, staticIP, sendWANLAN } from '@/api/api'

let stopSignal1, stopSignal2, stopSignal

export default {
  name: 'INEXNetwork',
  data () {
    return {
      isSettingNetcardVisible: false, // 控制点击port之后的父级dialog
      isLANInnerVisible: false, // LAN的子级dialog
      isWANInnerVisible: false, // WAN的子级dialog
      isASDLVisible: false, // 控制ASDL选项是否显示
      isDHCP: false, // 控制选择DHCP后，表单部分项目disable
      isButtonVisible: true, // 控制上一步按钮是否显示
      isLoading: false, // 控制ASDL连接时的加载动画
      isInCancel: false, // 是否取消dial请求中
      isGottonStatus: false, // 是否正在获取dial状态
      isConnectionShow: true, // dial连接件是否显示
      isFinishConnection: false, // 连接是否完成,是否显示断开按钮
      checked: '',
      DHCPStatus: '未连接',
      isDHCPConnected: false,
      isWANPort: false, // 是否是WAN口
      isLANPort: false, // 是否是LAN口
      unbindEnable: false, // 绑定LAN/WAN口时，判断当前端口是否已被占用。是否可以解绑

      // form: {
      //   number: "", //端口编号，唯一，通过index确认端口
      //   use: "", //选择功能LAN/WAN
      //   IP: "",
      //   mask: "", //子网掩码
      //   gateway: "", //网关
      //   mode: "", //工作模式
      //   rate: "", //网卡速率 lan
      //   control: "", //lan互访控制
      //   accessMode: "", //接入方式
      //   primaryDNS: "", //首选DNS
      //   secondaryDNS: "", //备选DNS
      //   status: "" //连接状态，ASDL使用该属性
      // },
      options: [
        {
          value: '1',
          label: '静态IP(固定IP)'
        },
        {
          value: '2',
          label: 'DHCP(动态获取)'
        },
        {
          value: '3',
          label: 'ASDL/PPPoE拨号'
        }
      ],
      modeOptions: [
        {
          value: '1',
          label: '自动协商(默认)'
        },
        {
          value: '2',
          label: '全双工'
        },
        {
          value: '3',
          label: '半双工'
        }
      ],
      rateOptions: [
        {
          value: '1',
          label: '自动协商(默认)'
        },
        {
          value: '2',
          label: '10M'
        },
        {
          value: '3',
          label: '100M'
        },
        {
          value: '4',
          label: '1000M'
        }
      ],
      ports: [
        {
          ename: '',
          devname: '',
          linkstatus: '',
          function: '',
          ip: '',
          netmask: '',
          mac: '',
          speed: ''
        }
      ],

      lanForm: {
        ip: '',
        gateway: '',
        netmask: ''
      },
      advancedLANForm: {
        mode: '',
        rate: '',
        control: ''
      },
      wanForm: {
        accessMode: '',
        ip: '',
        netmask: '',
        gateway: '',
        primaryDNS: '',
        secondaryDNS: ''
      },
      advancedWANForm: {
        mode: '',
        rate: ''
      },
      formDialUp: {
        webindex: '',
        account: '',
        passwd: '',
        status: '',
        handle: 0 // 后台用,勿删
      },
      optionForm: {
        id: ''
      },

      formLabelWidth: '8rem',
      tooltipLabelWidth: '5rem',
      powerButton: 'static/port3.png',

      rules: {
        ip: [
          {
            validator: validate('ip', '请输入正确IP', '倾输入IP'), trigger: 'blur'
          }
        ],
        netmask: [
          {
            validator: validate('ip', '请输入正确子网掩码', '倾输入子网掩码'), trigger: 'blur'
          }
        ],
        gateway: [
          {
            validator: validate('ip', '请输入正确网关', '倾输入I网关'), trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    isSettingNetcardVisible: {
      handler: function () {
        if (this.isSettingNetcardVisible === false) {
          clearInterval(stopSignal1)
          clearInterval(stopSignal2)

          this.isASDLVisible = false
          this.isLoading = false
          this.isInCancel = false
          this.isButtonVisible = true
          this.$refs['optionForm'].resetFields()
          this.$refs['wanForm'].resetFields()
        }
      }
    },
    isWANInnerVisible: {
      handler: function () {
        if (this.isWANInnerVisible === false) {
          this.isAfterConnection = false
          this.isDHCP = false
          this.$refs['wanForm'].resetFields()
          this.$refs['advancedWANForm'].resetFields()
        }
      }
    }
  },
  methods: {
    triggerSettingNetcardVisible () {
      this.isSettingNetcardVisible = !this.isSettingNetcardVisible
    },
    triggerLANInnerVisible () {
      this.isLANInnerVisible = !this.isLANInnerVisible
    },
    triggerWANInnerVisible () {
      this.isWANInnerVisible = !this.isWANInnerVisible
    },
    triggerisASDLVisible () {
      this.isASDLVisible = !this.isASDLVisible
    },
    triggerButtonVisible () {
      this.isButtonVisible = !this.isButtonVisible
    },
    triggerLoading () {
      this.isLoading = !this.isLoading
    },
    triggerInCanel () {
      this.isInCancel = !this.isInCancel
    },
    triggerGottonStatus () {
      this.isGottonStatus = !this.isGottonStatus
    },
    triggerConnectionVisible () {
      this.isConnectionShow = !this.isConnectionShow
    },
    triggerASDLVisible () {
      this.isASDLVisible = !this.isASDLVisible
    },
    showDHCPItems () {
      this.isDHCP = true
    },

    // 选择LAN,WAN口对应图标
    selectUrl (para) {
      // if(para === "空闲")
      if (para === 'off') {
        return 'static/port2.png'
      } else {
        return 'static/port3.png'
      }
    },
    // 选择router页面里的图标
    selectIcon (para) {
      if (para === 'wan') {
        return '#icon-wan'
      } else if (para === 'lan') {
        return '#icon-pc'
      } else {
        return false
      }
    },
    selectIcon2 (para) {
      if (para === 'adsl') {
        return '#icon-phone'
      } else if (para === 'dhcp') {
        return '#icon-dynamic'
      } else if (para === 'static') {
        return '#icon-ip'
      }
    },

    // 弹出外部dialog
    dialog: function (para, obj) {
      // console.log(para);
      // 获得需要处理的端口的编号
      this.formDialUp.webindex = para

      // 获得对应端口的enname，DHCP要用
      this.formDialUp.enname = obj.enname

      // 待修改
      this.formDialUp.status = '未连接'

      // 获取DHCP连接状态
      if (obj.type === 'dhcp') {
        this.DHCPStatus = '已连接'
        this.isDHCPConnected = true
      }
      // 获取该端口是LAN还是WAN
      this.isLANPort = false
      this.isWANPort = false
      if (obj.function === 'lan') {
        this.isLANPort = true
      } else if (obj.function === 'wan') {
        this.isWANPort = true
      }
      this.unbindEnable = this.ports[para].function === 'normal'

      this.triggerSettingNetcardVisible()
    },
    // 点击外部dialog下一步触发的函数
    nextStep: function () {
      if (this.optionForm.id === 'lan') {
        this.triggerLANInnerVisible()
        this.lanForm = Object.assign({}, this.ports[this.formDialUp.webindex])
      } else if (this.optionForm.id === 'wan') {
        this.triggerWANInnerVisible()
      }
    },
    // 处理连接方式选择的函数,触发ASDL相关的操作
    onSelect: function () {
      if (this.wanForm.accessMode === '3') {
        this.isDHCP = false
        this.triggerASDLVisible()

        let para = Object.assign({}, this.formDialUp)
        // handle等于2时 代表获取状态
        para.handle = 2
        //
        // this.isGottonStatus = true;
        this.triggerGottonStatus()

        dialUp(para)
          .then(res => {
            if (res.data.code === 200) {
              this.translate(res.data.status)
              this.formDialUp.account = res.data.account
              this.formDialUp.passwd = res.data.passwd
              this.triggerGottonStatus()
            } else {
              this.formDialUp.status = '获取失败！'
              this.triggerGottonStatus()
              this.$refs['formDialUp'].resetFields()
            }
          })
          .catch(error => {
            console.log(error)
          })
      }
      if (this.wanForm.accessMode === '2') {
        this.isASDLVisible = false
        this.showDHCPItems()

        this.wanForm = Object.assign(
          this.wanForm,
          this.ports[this.formDialUp.webindex]
        )
      }
      if (this.wanForm.accessMode === '1') {
        this.isASDLVisible = false
        this.isDHCP = false

        this.wanForm = Object.assign(
          this.wanForm,
          this.ports[this.formDialUp.webindex]
        )
      }
    },
    sortingHandle: function () {
      this.$router.push('nat')
    },
    translate: function (val) {
      if (val === 'run') {
        this.formDialUp.status = '拨号成功'
        // buttonChange
        this.isLoading = false
        this.isAfterConnection = true
        clearInterval(stopSignal1)
      } else if (val === 'init') {
        this.formDialUp.status = '拨号初始化'
      } else if (val === 'auth') {
        this.formDialUp.status = '用户验证'
      } else if (val === 'disconnect') {
        this.formDialUp.status = '连接断开'
      } else if (val === 'dead') {
        this.formDialUp.status = '连接失败'
        this.isLoading = false
        this.isConnectionShow = true
        clearInterval(stopSignal1)
      }
    },
    dialLink: function () {
      // buttonChange "上一步"按钮不显示
      this.isButtonVisible = false
      this.isLoading = true

      this.isConnectionShow = false
      // handle = 1的意义是拨号连接
      this.formDialUp.handle = 1

      let para = Object.assign({}, this.formDialUp)

      dialUp(para)
        .then(res => {
          if (res.data.code === 200) {
            this.translate(res.data.status)
          } else {
            this.formDialUp.status = '拨号失败!'
          }
        })
        .catch(error => {
          console.log(error)
        })

      stopSignal1 = setInterval(() => {
        // handle = 2的意义是获取状态
        para.handle = 2
        dialUp(para)
          .then(res => {
            if (res.data.code === 200) {
              this.translate(res.data.status)
            }
            if (res.data.code === 300) {
              this.formDialUp.status = '拨号次数已达上限'
              this.isLoading = false
              clearInterval(stopSignal1)
            }
          })
          .catch(error => {
            console.log(error)
          })
      }, 1000)
      // keep dialog alive
      this.isWANInnerVisible = true
      this.isSettingNetcardVisible = true
      // this.$refs['formDialUp'].resetFields()
      this.getPortsInfo()
    },
    dialCancel () {
      this.isLoading = false
      // 导致问题: 点击取消后连接键无法使用
      // this.isInCancel = true;
      clearInterval(stopSignal2)
      let para = Object.assign({}, this.formDialUp)
      console.log(this.formDialUp)
      para.handle = 0
      stopSignal2 = setInterval(() => {
        dialUp(para)
          .then(res => {
            if (res.data.code === 200) {
              this.isInCancel = false
              this.stopAsking()
            }
            if (res.data.code === 500) {
              this.$message({
                message: '取消失败!',
                type: 'error'
              })
              this.stopAsking()
            }
          })
          .catch(error => {
            console.log(error)
          })
      }, 1000)
      this.isConnectionShow = true
      // 清空form是清空接如方式 这一栏
      this.$refs['formDialUp'].resetFields()
    },
    // 设置为WAN/LAN
    setPort (val) {
      let para
      this.wanForm.handle = 1
      if (val === 'wan') {
        para = Object.assign({}, this.wanForm)
      } else if (val === 'lan') {
        para = Object.assign({}, this.lanForm)
      }
      para.webnetif = String(para.webname)
      para.use = val
      para.handle = 1

      console.log(para)
      sendWANLAN(para)
        .then(res => {
          if (res.data.code === 200) {
            this.$message({
              message: '发送成功',
              type: 'success'
            })
            if (val === 'wan') {
              this.isWANPort = true
            } else if (val === 'lan') {
              this.isLANPort = true
            }
          } else {
            this.$message({
              message: '发送失败',
              type: 'warning'
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // WAN,LAN口解绑功能
    unbindGeneral: function (val) {
      // let index = this.WANForm.index
      // this.WANForm.use = this.ports[index].function
      // this.WANForm.handle = 0
      // this.WANLANLoading = true
      // let para = Object.assign({}, this.WANForm)

      let para = Object.assign({}, this.formDialUp)
      let enname = this.formDialUp.enname
      this.ports.forEach(element => {
        if (element.enname === enname) {
          para.use = element.function
          para.index = element.webindex
          para.webnetif = String(element.webname)
        }
      })
      para.handle = 0

      sendWANLAN(para)
        .then(res => {
          if (res.data.code === 200) {
            this.$message({
              message: '发送成功',
              type: 'success'
            })
          }
        })
        .then(() => {
          if (this.ports[para.index - 1].type === 'dhcp') {
            this.DHCPDisconnect()
          } else if (this.ports[para.index - 1].type === 'adsl') {
            this.unbind()
          }
          this.isSettingNetcardVisible = false
        })
        // .then(this.getPortsInfo())
        .catch(error => {
          console.log(error)
        })
    },
    // DHCP连接
    DHCPLink () {
      let para = {}
      para.netifname = this.formDialUp.enname
      para.handle = 'enable'

      this.DHCPStatus = '连接中'
      DHCP(para)
        .then(res => {
          if (res.data.code === 200) {
            this.DHCPStatus = '已连接'
          }
          if (res.data.code === 500) {
            this.DHCPStatus = '连接失败'
          }
        })
        .catch(error => {
          console.log(error)
        })
      this.isDHCPConnected = true
      this.getPortsInfo()
    },
    DHCPDisconnect () {
      let para = {}
      para.netifname = this.formDialUp.enname
      para.handle = 'disable'

      DHCP(para)
        .then(res => {
          if (res.data.code === 200) {
            this.DHCPStatus = '未连接'
          }
          if (res.data.code === 500) {
            this.DHCPStatus = '断开连接失败'
          }
        })
        .catch(error => {
          console.log(error)
        })
      this.isDHCPConnected = false
    },
    stopAsking () {
      clearInterval(stopSignal2)
    },
    // 内部WAN/LAN dialog 信息
    formCancel: function () {
      this.isASDLVisible = false
      clearInterval(stopSignal1)
      // dialogDisappear
      this.isSettingNetcardVisible = false
      this.isLANInnerVisible = false
      this.isWANInnerVisible = false
      // buttonChange
      this.isGottonStatus = false
      this.isButtonVisible = false
      this.isLoading = false

      this.$refs['formDialUp'].resetFields()
      this.$refs['form'].resetFields()
    },
    // 提交内部LAN dialog 信息
    LANFormSubmit () {
      this.$refs.lanForm.validate(valid => {
        if (valid) {
          this.LANFormSubmitNext()
        }
      })
    },
    LANFormSubmitNext () {
      this.triggerSettingNetcardVisible()
      this.triggerLANInnerVisible()

      // 检查是否起用为lan口
      // if (this.isLANPort) {
      //   this.setPort('lan')
      // }
      // 11.09 改为默认启用lan口
      this.setPort('lan')

      let para = {}
      para.enname = this.formDialUp.enname
      para.ipaddr = this.lanForm.ip
      para.netmask = this.lanForm.netmask
      para.gateway = this.lanForm.gateway

      staticIP(para)
        .then(res => {
          if (res.data.code === 200) {
            this.isSettingNetcardVisible = false
          }
        })
        .catch(error => {
          console.log(error)
        })

      this.$refs['advancedLANForm'].resetFields()
      this.$refs['lanForm'].resetFields()
      this.getPortsInfo()
    },
    // LAN dialog取消
    LANFormCancel: function () {
      this.triggerSettingNetcardVisible()
      this.triggerLANInnerVisible()

      this.$refs['advancedLANForm'].resetFields()
      this.$refs['lanForm'].resetFields()
    },
    LANFormPrevious: function () {
      this.triggerLANInnerVisible()
    },
    WANFormSubmit () {
      this.$refs.wanForm.validate(valid => {
        if (valid) {
          this.WANFormSubmitNext()
        }
      })
    },
    WANFormSubmitNext () {
      this.triggerSettingNetcardVisible()
      this.triggerWANInnerVisible()

      // 设定为WAN口的起功能
      if (this.isWANPort) {
        this.setPort('wan')
      }

      if (this.wanForm.accessMode === '1') {
        let para = {}
        para.enname = this.formDialUp.enname
        para.ipaddr = this.wanForm.ip
        para.netmask = this.wanForm.netmask
        para.gateway = this.wanForm.gateway

        staticIP(para)
          .then(res => {
            if (res.data.code === 200) {
              this.isSettingNetcardVisible = false
            }
          })
          .catch(error => {
            console.log(error)
          })
        this.getPortsInfo()
      }

      this.$refs['advancedWANForm'].resetFields()
      this.$refs['wanForm'].resetFields()
    },
    WANFormCancel: function () {
      this.triggerSettingNetcardVisible()
      this.triggerWANInnerVisible()
      // button

      this.$refs['advancedWANForm'].resetFields()
      this.$refs['wanForm'].resetFields()
    },
    WANFormPrevious: function () {
      this.triggerWANInnerVisible()
    },
    unbind: function () {
      clearInterval(stopSignal1)
      // dialogDisappear
      this.isSettingNetcardVisible = false
      this.isLANInnerVisible = false
      this.isWANInnerVisible = false
      // buttonChange
      this.isButtonVisible = true
      this.isLoading = false

      let para = Object.assign({}, this.formDialUp)
      para.handle = 0
      dialUp(para)
        .then(() => {
          this.$message({
            message: '解绑成功',
            type: 'success'
          })
          // dataBind
          let index = this.formDialUp.webindex
          this.ports[index].function = 'normal' // change icon status
          this.$refs['formDialUp'].resetFields()
        })
        .catch(error => {
          console.log(error)
        })
      this.isConnectionShow = false
      this.getPortsInfo()
    },
    getPortsInfo: function () {
      getPorts()
        .then(res => {
        // 根据webindex排序，确保端口顺序正确
          function sortNumber (a, b) {
            return a.webindex - b.webindex
          }
          res.data.interfaces.sort(sortNumber)

          this.checked = res.data.code
          // this.ports = JSON.parse(JSON.stringify(res.data.interfaces))
          this.ports = res.data.interfaces
          this.$emit('getPortsInfo', this.ports)
        })
        .catch(error => {
          console.log(error)
        })
    },
    pushDNS: function () {
      this.$store.commit('changeRoutePush', true)
      this.$router.push({ path: '../DNS' })
    }
  },
  mounted () {
    this.getPortsInfo()
    stopSignal = setInterval(this.getPortsInfo, 5000)
  },
  beforeDestroy () {
    clearInterval(stopSignal)
  }
}
</script>

<style scoped>
.wholeRouter {
  display: flex;
  position: relative;
  width: 100%;
}
.power {
  border: 1px solid lightgrey;
  border-radius: .6rem;
  text-align: center;
  margin: auto;
  background-color: dodgerblue;
}
.powerButton {
  width: 4rem;
  height: 3rem;
  margin: 1.5rem 1.2rem;
}
.router {
  width: 75%;
  border: 1px solid lightgrey;
  border-radius: .6rem;
  margin: .6rem 1.2rem;
  background-color: lightgoldenrodyellow;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.port {
  width: 3.6rem;
  height: 3rem;
  text-align: center;
  margin: 1.5rem auto;
  flex-grow: 1;
  border-radius: .4rem;
}
.port img:hover {
  cursor: pointer;
}
.advancedSetting {
  margin-bottom: 20px;
}
.tooltip-content {
  min-width: 150px;
  border: 0;
}
.tip {
  display: flex;
  width: 30%;
}
.tip1 {
  display: flex;
  width: 45%;
}
.icon-div {
  height: 20px;
  width: 20px;
  margin-right: 5px;
}
.text-area {
  font-weight: bold;
}
.text-area .text {
  margin: 0;
}
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.mask {
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(70, 70, 70, 0.5);
  width: 100%;
  height: 100%;
}
.mask .button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

h2 {
  font-family: Roboto-Thin, serif;
}
@font-face {
  font-family: Roboto-Thin;
  src: url("../../../../assets/font/Roboto-Thin.ttf");
}
</style>
