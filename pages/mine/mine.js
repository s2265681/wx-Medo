// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  onReady: function () {
  
  },

  navigate(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  }
})