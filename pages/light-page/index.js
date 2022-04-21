const link = require('../../utils/link/link.js');

Page({
    data:{
        light:"100",
    },
    onLoad:function() {
        console.log("start link...");
        link.linkFunc();
    },
    onClickOpen() {
        console.log("点击开灯...");
    },
    onClickClose() {
        console.log("点击关灯...");
    }
})