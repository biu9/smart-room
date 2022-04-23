import mqtt from '../mqtt.js';
const aliyunOpt = require('../aliyun/aliyun_connect.js');
let that = null;
let subCount = 0;
/*
关于运行逻辑的一些问题
1.订阅函数加在哪里？
目前有一种解决方法是把订阅函数绑定在水监控界面的按钮上；
但是这样子可能导致性能下降&我看这个代码是非常不舒服的；
如果加在连接函数的后面就需要考虑异步问题，目前有一种解决方法是promise
但是使用promise可能需要重写连接函数，因为连接函数中没有resolve与reject
也可以在link.js页面中加一个全局的count变量，count>1时就不执行subtopic函数
2.查询函数的具体查询方式？
目前我比较倾向于点击按钮查询数据，这样子可以减少刷新页面的频率
  - 水界面
    - 点击按钮查询
  - 灯界面
    - onload时查询，之后不再更新？
3.具体的查询方式是？
由于demo的代码貌似是实时监控下发的数据的，
或许可以通过查询函数去获取实时监控到的数据之后再进行更新，也就是说界面UI的更新不依赖于那个实时监听的函数
*/

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

/*
很奇怪的一点，linkFunc里面用this.data就会报data undefined的错
用data就不会报错，但是理论上this.data调用的就是linkFunc函数上层的data，理论上应该是有定义的
直接调this根据原型链的理论应该是要往上找一层才能找到data
但是还有一个问题是调用liknFunc的环境不是当前文件的环境，
也就是说，调用linkFunc函数的那个作用域附近应该是没有上层的data定义的
*/
function linkFunc() {
  console.log("=========linking to aliyun===========");
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
  data.client = mqtt.connect(host, data.options);

  data.client.on('connect', function (connack) {
    wx.showToast({
      title: '连接成功'
    });
    console.log("连接成功");
  });
  console.log("============linked==============")
}

/*
TODO
*/
function checkWater() {
  var waterRemain = "90%";
  console.log("checking water remain...");
  if(subCount == 0){
      this.subTopic();
      subCount++;
  }
  return waterRemain;
}

function turnOffLight() {
  console.log("turn off the light...");
  var sendData = {
    id: '12233443',
    version: '1.0',
    params:{
      colorGreen:  0,
      colorRed: 0,
      colorBlue: 0
    }
  };
  if (data.client && data.client.connected) {
    data.client.publish(data.aliyunInfo.pubTopic, JSON.stringify(sendData));
    console.log("************************")
    console.log(data.aliyunInfo.pubTopic)
    console.log(JSON.stringify(sendData))
  } else {
    wx.showToast({
      title: '请先连接服务器',
      icon: 'none',
      duration: 2000
    })
  }
}

function turnOnLight() {
  console.log("turn on the light...");
  console.log("turn off the light...");
  var sendData = {
    id: '12233443',
    version: '1.0',
    params:{
      colorGreen:  255,
      colorRed: 255,
      colorBlue: 255
    }
  };
  if (data.client && data.client.connected) {
    data.client.publish(data.aliyunInfo.pubTopic, JSON.stringify(sendData));
    console.log("************************")
    console.log(data.aliyunInfo.pubTopic)
    console.log(JSON.stringify(sendData))
  } else {
    wx.showToast({
      title: '请先连接服务器',
      icon: 'none',
      duration: 2000
    })
  }
}

/*
TODO
*/
function checkLight() {
  console.log("checking the light...");
}

function subTopic() {
  //此函数是订阅的函数，因为放在访问服务器的函数后面没法成功订阅topic，因此把他放在这个确保订阅topic的时候已成功连接服务器
  //订阅消息函数，订阅一次即可 如果云端没有订阅的话，需要取消注释，等待成功连接服务器之后，在随便点击（开灯）或（关灯）就可以订阅函数
  
  data.client.subscribe(data.aliyunInfo.subTopic, function (err) {
    if (!err) {
      console.log("订阅成功");
      //that.page.subTopic.disabled = "true";
    };
    wx.showModal({
      content: "订阅成功",
      showCancel: false,
    })
  })
  
 //console.log("sub topic...");
}

module.exports.linkFunc = linkFunc
module.exports.checkWater = checkWater
module.exports.turnOffLight = turnOffLight
module.exports.turnOnLight = turnOnLight
module.exports.checkLight = checkLight
module.exports.subTopic = subTopic
