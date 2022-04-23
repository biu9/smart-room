const app = getApp()
const link = require('../../utils/link/link.js');

Page({
    data: {
        "water_remain":"100%",
        "tips":"目前不需要订水",
      },
    
      onLoad: function () {
        link.linkFunc();
      },
      checkWater() {
        var waterReamin = link.checkWater();
        this.setData({
          "water_remain":waterReamin
        });
      }
})

