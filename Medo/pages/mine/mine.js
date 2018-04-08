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
    if (e.currentTarget.dataset.url){
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      });
    }else{
      wx.showModal({
        content: '敬请期待！',
        showCancel: false
      })
    }
    
  }
})