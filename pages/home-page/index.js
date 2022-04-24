const app = getApp()
const link = require('../../utils/link/link.js');

Page({
    data: {
        "water_remain":0,
        "tips":"目前不需要订水",
      },
    
      onLoad: function () {
        //link.linkFunc();
      },
      login() {
          link.linkFunc();
          link.loginFunc();
          console.log("logging...");
      },
      setVal() {
        console.log("重定向...");
        wx.navigateTo({
          url: '/pages/setting-page/set',
        })
      }
})

