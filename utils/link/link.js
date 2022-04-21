import mqtt from '../mqtt.js';
const aliyunOpt = require('../aliyun/aliyun_connect.js');
let that = null;


function linkFunc() {

  let data = {
    "cilentID": "1234",
    client: null,//记录重连次数
    aliyunInfo: {
      productKey: 'gw77ejrjVII', //阿里云连接的三元组 ，请自己替代为自己的产品信息!!
      deviceName: 'wx-demo-device', //阿里云连接的三元组 ，请自己替代为自己的产品信息!!
      deviceSecret: '8839f0625aa69f6b091870d287d8ee7f', //阿里云连接的三元组 ，请自己替代为自己的产品信息!!
      regionId: 'cn-shanghai', //阿里云连接的三元组 ，请自己替代为自己的产品信息!!
      pubTopic: '/gw77ejrjVII/wx-demo-device/user/wxControl', //发布消息的主题
      subTopic: '//gw77ejrjVII/${deviceName}/user/get', //订阅消息的主题
    },
    options: {
      protocolVersion: 4, //MQTT连接协议版本
      clean: false,
      reconnectPeriod: 1000, //1000毫秒，两次重新连接之间的间隔
      connectTimeout: 30 * 1000, //1000毫秒，两次重新连接之间的间隔
      resubscribe: true, //如果连接断开并重新连接，则会再次自动订阅已订阅的主题（默认true）
      clientId: 'gw77ejrjVII.wx-demo-device|securemode=2,signmethod=hmacsha256,timestamp=1650286689669|',
      password: 'f4aff0cdc8f5f5c8d99e31577cc4dcc224bf5275b7cd61e965cab103e1e230a6',
      username: 'wx-demo-device&gw77ejrjVII',
    },
  }
  console.log("=========linking to aliyun===========");

  that = this;
  let clientOpt = aliyunOpt.getAliyunIotMqttClient({
    productKey: data.aliyunInfo.productKey,
    deviceName: data.aliyunInfo.deviceName,
    deviceSecret: data.aliyunInfo.deviceSecret,
    regionId: data.aliyunInfo.regionId,
    port: data.aliyunInfo.port,
  });

  console.log("get data:" + JSON.stringify(clientOpt));
  let host = 'wxs://' + clientOpt.host;

  //连接服务器
  this.client = mqtt.connect(host, this.options);

  this.client.on('connect', function (connack) {
    wx.showToast({
      title: '连接成功'
    });
    console.log("连接成功");
  });
  console.log("============linked==============")
}

function checkWater() {
  console.log("checking water remain...");
}

module.exports.linkFunc = linkFunc
module.exports.checkWater = checkWater

