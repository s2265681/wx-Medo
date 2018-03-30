//index.js
//获取应用实例
const app = getApp();
const util = require('../../utils/util');

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    date: util.formatTime(new Date,false)
  },
  
  bindViewTap: function() {
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  bindDateChange(e){
    this.setData({
      date: e.detail.value
    })
  },

  today(){
    this.setData({
      date: util.formatTime(new Date, false)
    })
  },

  gettime(type){
    let time = type === 'n' ? new Date(this.data.date).getTime() + 24 * 60 * 60 * 1000 : new Date(this.data.date).getTime() - 24 * 60 * 60 * 1000;
    this.setData({
      date: util.formatTime(new Date(time), false)
    })
  },

  next(){
    this.gettime('n');
  },

  prev(){
    this.gettime('p');
  }
})
