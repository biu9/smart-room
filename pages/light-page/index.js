const link = require('../../utils/link/link.js');

Page({
    data:{
        light:"100",
    },
    onLoad:function() {
        console.log("start link...");
        //link.linkFunc();
        link.checkLight();
    },
    onClickOpen() {
        console.log("点击开灯...");
        link.turnOnLight();
    },
    onClickClose() {
        console.log("点击关灯...");
        link.turnOffLight();
    }
})