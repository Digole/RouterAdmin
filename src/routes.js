// 页面路由表
// import situationMode from './views/situationMode.vue'             // wyk914情景模式

import Login from './views/Login.vue'
import CreatePasswd from './views/CreatePasswd.vue'
import ModeChoose from './views/ModeChoose.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'

/**
*systemStatus
*/
import systemStatus from './views/systemStatus/systemStatus.vue'

/**
*status_monitor
*/

import lineMonitor from './views/statusMonitor/lineMonitor.vue'
import flowMonitor from './views/statusMonitor/flowMonitor.vue'
import rateMonitor from './views/statusMonitor/rateMonitor.vue'
import terminalMonitor from './views/statusMonitor/terminalMonitor.vue'
import performanceMonitor from './views/statusMonitor/performanceMonitor.vue'

/**
*networkSetting
*/
import DHCP from './views/networkSetting/DHCP.vue'
import DNS from './views/networkSetting/DNS.vue'
import INEXnetwork from './views/networkSetting/INEX_network/index.vue'
import kidVPN from './views/networkSetting/kidVPN'
import NAT from './views/networkSetting/nat/'
import VLAN from './views/networkSetting/VLAN.vue'
import staticRouter from './views/networkSetting/staticRouter/staticRouter.vue'
import Qos from './views/networkSetting/Qos/index.vue'

/**
*systemSetting
*/
import accountSetting from './views/systemSetting/accountSetting.vue'
import basicSetting from './views/systemSetting/basicSetting.vue'
import hardwareInfo from './views/systemSetting/hardwareInfo.vue'
import restartShutdown from './views/systemSetting/restartShutdown.vue'
import update from './views/systemSetting/update.vue'
// import powerSetting from './views/systemSetting/powerSetting'          // wyk914权限管理
import ports from './views/systemSetting/ports.vue'

/**
*flowControl
*/
import flowControl from './views/flowControl/flowControl.vue'

/**
*behaviourManagement
*/
// import BMControl from './views/behaviourManagement/BMControl.vue'
import BMDisplay from './views/behaviourManagement/BMDisplay.vue'

/**
*securitySetting
*/
import ARP from './views/securitySetting/ARP.vue'
import ARPDefence from './views/securitySetting/ARPDefence.vue'
import firewall from './views/securitySetting/firewall.vue'
// import remoteManagement from './views/securitySetting/remoteManagement.vue'

/**
*tools
*/
import ping from './views/tools/ping.vue'
import speed from './views/tools/speed.vue'

/**
*log
*/
import log from './views/log/log.vue'
import operaLog from './views/log/operationLog.vue'
import vpnLog from './views/log/vpnLog.vue'
import ARPLog from './views/log/ARPLog.vue'
import DHCPLog from './views/log/DHCPLog.vue'

/**
*shell
*/
import ripd from './views/shell/ripd.vue'
import ripngd from './views/shell/ripngd.vue'
import ospfd from './views/shell/ospfd.vue'
import isisd from './views/shell/isisd.vue'
import bgpd from './views/shell/bgpd.vue'
import pimd from './views/shell/pimd.vue'

/**
 * sceneMode
 */
import sceneRouter from './views/sceneMode/router'

const routes = [
  {
    path: '/login',
    component: Login,
    name: '',
    hidden: true
  },
  {
    path: '/CreatePasswd',
    component: CreatePasswd,
    name: '',
    hidden: true
  },
  {
    path: '/modeChoose',
    component: ModeChoose,
    name: '',
    hidden: true
  },
  {
    path: '/sceneMode',
    component: sceneRouter,
    name: '',
    hidden: true
  },
  {
    path: '/404',
    component: NotFound,
    name: '',
    hidden: true
  },
  //   {
  //     path: '/situationMode',
  //     component: situationMode,
  //     name: '',
  //     hidden: true
  //   },
  {
    path: '/',
    component: Home,
    name: '系统概况简介',
    iconCls: 'fa fa-bar-chart',
    leaf: true, // 只有一个节点
    meta: {
      title: 'systemStatus'
    },
    children: [
      {
        path: '/systemStatus', component: systemStatus, name: '系统概况', meta: { title: 'systemStatus' }
      }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '状态监控',
    meta: {
      title: 'statusMonitor'
    },
    iconCls: 'fa fa-television',
    children: [
      { path: '/lineMonitor', component: lineMonitor, name: '线路监控', meta: { title: 'lineMonitor' } },
      { path: '/terminalMonitor', component: terminalMonitor, name: '终端监控', meta: { title: 'terminalMonitor' } },
      { path: '/flowMonitor', component: flowMonitor, name: '流量监控', meta: { title: 'flowMonitor' } },
      { path: '/rateMonitor', component: rateMonitor, name: '速率监控', meta: { title: 'rateMonitor' } },
      { path: '/performanceMonitor', component: performanceMonitor, name: '性能监控', meta: { title: 'performanceMonitor' } }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '网络设置',
    iconCls: 'fa fa-sliders',
    meta: {
      title: 'netSetting'
    },
    children: [
      { path: '/INEX_network', component: INEXnetwork, name: '内外网设置', meta: { title: 'INEXNetworkSetting' } },
      { path: '/DHCP', component: DHCP, name: 'DHCP服务器设置', meta: { title: 'DHCPSetting' } },
      { path: '/DNS', component: DNS, name: 'DNS设置', meta: { title: 'DNSSetting' } },
      { path: '/staticRouter', component: staticRouter, name: '静态路由', meta: { title: 'staticRouter' } },
      // { path: '/currentRouter', component: currentRouter, name: '当前路由表' },
      { path: '/VLAN', component: VLAN, name: 'VLAN设置', meta: { title: 'VLANSetting' } },
      { path: '/kidVPN', component: kidVPN, name: 'KidVPN设置', meta: { title: 'KidVPNSetting' } },
      { path: '/NAT', component: NAT, name: 'NAT转发与端口映射', meta: { title: 'NAT' } },
      { path: '/Qos', component: Qos, name: 'Qos设置', meta: { title: 'Qos' } }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '系统设置',
    iconCls: 'fa fa-cog',
    meta: {
      title: 'systemSetting'
    },
    children: [
      { path: '/basicSetting', component: basicSetting, name: '基础设置', meta: { title: 'basicSetting' } },
      { path: '/accountSetting', component: accountSetting, name: '账号设置', meta: { title: 'accountSetting' } },
      { path: '/update', component: update, name: '版本升级', meta: { title: 'versionUpdate' } },
      { path: '/hardwareInfo', component: hardwareInfo, name: '硬件信息', meta: { title: 'hardwareInfo' } },
      { path: '/restartShutdown', component: restartShutdown, name: '重启关机', meta: { title: 'shutdownRestart' } },
      // { path: '/powerSetting', component: powerSetting, name: '权限管理', meta: { title: 'powerSetting' } },          // wyk914权限管理
      { path: '/ports', component: ports, name: '端口自适应', meta: { title: 'ports' } }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '流控分流按钮',
    iconCls: 'fa fa-list',
    leaf: true, // 只有一个节点
    meta: {
      title: 'flowControl'
    },
    children: [
      { path: '/flowControl', component: flowControl, name: '流控分流', meta: { title: 'flowControl' } }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '行为管理',
    iconCls: 'fa fa-exchange',
    meta: {
      title: 'behaviourManagement'
    },
    children: [
      // { path: '/BMControl', component: BMControl, name: '行为记录管理', meta: { title: 'recordManagement' } },
      { path: '/BMDisplay', component: BMDisplay, name: '行为记录显示', meta: { title: 'recordDisplay' } }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '安全设置',
    iconCls: 'fa fa-arrows-alt',
    meta: {
      title: 'securitySetting'
    },
    children: [
      { path: '/ARP', component: ARP, name: 'ARP绑定', meta: { title: 'ARPBinding' } },
      { path: '/ARPDefence', component: ARPDefence, name: 'ARP防御', meta: { title: 'ARPDefence' } },
      // { path: '/remoteManagement', component: remoteManagement, name: '远程登陆管理', meta: { title: 'remoteLoginManagement' } },
      { path: '/firewall', component: firewall, name: '规则防火墙', meta: { title: 'firewall' } }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '系统工具',
    iconCls: 'fa fa-bar-chart',
    meta: {
      title: 'tools'
    },
    children: [
      { path: '/ping', component: ping, name: 'Ping测试', meta: { title: 'ping' } },
      { path: '/speed', component: speed, name: 'Speed测试', meta: { title: 'speed' } }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '日志系统',
    iconCls: 'fa fa-bar-chart',
    meta: {
      title: 'log'
    },
    children: [
      { path: '/log', component: log, name: '日志', meta: { title: 'dialLog' } },
      { path: '/operationLog', component: operaLog, name: '操作日志', meta: { title: 'operaLog' } },
      { path: '/vpnLog', component: vpnLog, name: 'VPN日志', meta: { title: 'VPNLog' } },
      { path: '/ARPLog', component: ARPLog, name: 'ARP防御日志', meta: { title: 'ARPLog' } },
      { path: '/DHCPLog', component: DHCPLog, name: 'DHCP日志', meta: { title: 'DHCPLog' } }
    ]
  },
  {
    path: '/',
    component: Home,
    name: 'shell',
    iconCls: 'fa fa-list',
    meta: {
      title: 'shell'
    },
    children: [
      { path: '/ripd', component: ripd, name: 'ripd页面', meta: { title: 'ripd' } },
      { path: '/ripngd', component: ripngd, name: 'ripngd页面', meta: { title: 'ripngd' } },
      { path: '/ospfd', component: ospfd, name: 'ospfd页面', meta: { title: 'ospfd' } },
      { path: '/isisd', component: isisd, name: 'isisd页面', meta: { title: 'isisd' } },
      { path: '/bgpd', component: bgpd, name: 'bgpd页面', meta: { title: 'bgpd' } },
      { path: '/pimd', component: pimd, name: 'pimd页面', meta: { title: 'pimd' } }
    ]
  },
  {
    path: '*',
    hidden: true,
    redirect: { path: '/404' }
  }

]

export default routes
