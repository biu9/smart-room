const link = require('../../utils/link/link.js');

Page({
    data:{
        light:"100",
    },
    onLoad:function() {
        console.log("start link...");
        link.linkFunc();
        var returnLight= link.checkLight();
        this.setData({
            "light":returnLight,
        })
    },
    onClickOpen() {
        console.log("点击开灯...");
        link.turnOffLight();
    },
    onClickClose() {
        console.log("点击关灯...");
        link.turnOnLight();
    }
})