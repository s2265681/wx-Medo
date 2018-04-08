// pages/mine/wallpaper.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imagelist: [],
    showdel: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'wallpaper',
      success: (res) => {
        this.setData({
          imagelist: res.data
        });
      }
    });
  },

  upload(){
    if (this.data.imagelist.length>=9){
      wx.showModal({
        title: '提示',
        content: '用户最多可以上传6张图片！',
        showCancel: false
      })
      return;
    }
    wx.chooseImage({
      count: 1, 
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'],
      success: (res) => {
        var tempFilePaths = res.tempFilePaths;
        let size = res.tempFiles[0].size;
        if(size > 1024*1024){
          wx.showModal({
            title: '提示',
            content: '单张图片大小不能超过1M',
            showCancel: false
          });
          return;
        };
        wx.saveFile({
          tempFilePath: tempFilePaths[0],
          success: (re) => {
            var savedFilePath = re.savedFilePath;
            let arr = this.data.imagelist;
            arr.forEach(v => {
              v.active = false;
            });
            arr.unshift({
              url: savedFilePath,
              active: true,
              key:'user'
            });
            this.setData({
              imagelist:arr
            });
            wx.setStorage({
              key: 'wallpaper',
              data: arr,
            })
          }
        });
      }
    })
  },

  setcurrback(e){
    let url = e.currentTarget.dataset.url;
    let arr = this.data.imagelist;
    arr.forEach(v => {
      if(v.url === url){
        v.active = true;
      }else{
        v.active = false;
      }
    });
    this.setData({
      imagelist:arr
    })
    wx.setStorage({
      key: 'wallpaper',
      data: arr,
    });
  },

  manageimg(){
    this.setData({
      showdel: !this.data.showdel
    })
  },

  delimg(e){
    wx.showModal({
      title: '提示',
      content: '确认删除该壁纸？',
      success: (res) => {
        if (res.confirm) {
          let url = e.currentTarget.dataset.url;
          if (e.currentTarget.dataset.key === 'user') {
            wx.removeSavedFile({
              filePath: url,
              complete: function (res) {
                console.log(res);
              }
            });
          };

          let arr = this.data.imagelist;
          arr = arr.filter(v => v.url !== url);
          this.setData({
            imagelist: arr
          })
          wx.setStorage({
            key: 'wallpaper',
            data: arr,
          });
        };
      }
    });
  }
})