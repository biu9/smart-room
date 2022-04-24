const link = require('../../utils/link/link.js');

Page({
    data:{
        light:"600",
        tips:""
    },
    onLoad:function() {
        console.log("start check light...");
        //link.linkFunc();
        var lightCheck = link.checkLight();
        console.log("=========lightCheck = ",lightCheck);
        this.setData({
            "light":1200-lightCheck
        })
        if(this.data.light > 600){
            this.setData({
                "tips":"记得关灯！"
            })
        }
    },
    onClickOpen() {
        console.log("点击开灯...");
        link.turnOnLight();
        this.setData({
            "light":"1100",
            "tips":"记得关灯！"
        })
    },
    onClickClose() {
        console.log("点击关灯...");
        link.turnOffLight();
        this.setData({
            "light":"0",
            "tips":""
        })
    },
    setLight() {
        console.log("设置亮度阈值...");
    },
    checkLight() {
        var loaclLight = link.checkLight();
        this.setData({
            "light":1200-loaclLight
        });
        if(this.data.light > 600){
            this.setData({
                "tips":"记得关灯！"
            })
        }
        else{
            this.setData({
                "tips":""
            })
        }
    }
})