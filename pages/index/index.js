//index.js
//获取应用实例
const app = getApp();
const util = require('../../utils/util');

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    date: util.formatTime(new Date,'d'),
    textareaShow: false,
    doingList: [],
    doneList: [],
    textareaValue: '',
    today: util.formatTime(new Date, 'd'),
    startPageX: 0,
    startLeft: 0,
    startnowindex: 0,
    backimg: ''
  },
  
  bindViewTap: function() {
    wx.navigateTo({
      url: '../mine/mine'
    })
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else {
      app.userInfoReadyCallback=(res) => {
        app.globalData.userInfo = res.userInfo;
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
      if (!this.data.hasUserInfo){
        this.getUserInfo();
      }
    };
    wx.getStorage({
      key: 'wallpaper',
      success: (res) => {
        res.data.forEach(v => {
          if(v.active){
            this.setData({
              backimg: v.url
            })
          }
        })
      }
    });
    this.getstorageList();
  },

  getstorageList() {
    wx.getStorage({
      key: 'todoList',
      success: (res) => {
        let data = res.data;
        let flag = true;
        data.forEach(v => {
          if (v.date === this.data.date) {
            flag = false;
            this.setData({
              doingList: v.list.filter(m => m.state === 'doing'),
              doneList: v.list.filter(m => m.state === 'done')
            })
          }
        });
        if(flag){
          this.setData({
            doingList: [],
            doneList: []
          })
        }
      }
    })
  },

  getUserInfo(){
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    });
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
      date: util.formatTime(new Date(time), 'd')
    })
  },

  next(){
    this.gettime('n');
    this.getstorageList();
  },

  prev(){
    this.gettime('p');
    this.getstorageList();
  },

  settextareaShow(){
    this.setData({
      textareaShow: !this.data.textareaShow
    })
  },

  settextareaValue(e){
    this.setData({
      textareaValue: e.detail.value
    })
  },

  submit() {
    if (!this.data.textareaValue){
      wx.showToast({
        title: '内容不能为空',
      });
      return;
    }
    let time = util.formatTime(new Date(), 't');
    let o = {
      time: time,
      text: this.data.textareaValue,
      state: 'doing'
    };
    let doingList = this.data.doingList;
    doingList.push(o);
    this.setData({
      doingList: doingList
    });
    
    if(!wx.getStorageSync('todoList')){
      wx.setStorage({
        key: 'todoList',
        data: [{
          date:this.data.date,
          list:[o]
        }],
      })
    }else{
      wx.getStorage({
        key: 'todoList',
        success: (res) => {
          let data = res.data;
          let flag = false;
          data.forEach(v => {
            if (v.date === this.data.date) {
              v.list.push(o);
              flag = true;
            }
          })
          if(!flag){
            data.push({
              date: this.data.date,
              list:[o]
            })
          }
          wx.setStorage({
            key: 'todoList',
            data: data,
          })
        }
      })
    };
    this.setData({
      textareaShow: !this.data.textareaShow,
      textareaValue: ''
    })
  },
  cancel(){
    this.setData({
      textareaShow: !this.data.textareaShow,
      textareaValue: ''
    })
  },
  evelistmove(e){
    this.setData({
      startnowindex: e.currentTarget.dataset.nowindex
    })
    if (Math.abs(this.data.startLeft) < 60) {
      if (e.touches[0].pageX - this.data.startPageX < 0){
        if (e.touches[0].pageX - this.data.startPageX > -60) {
          this.setData({
            startLeft: e.touches[0].pageX - this.data.startPageX
          })
        } else {
          this.setData({
            startLeft: -160
          })
        }
      }
    } else {
      if (e.touches[0].pageX - this.data.startPageX < 0) {
        return;
      } else {
        this.setData({
          startLeft: 0
        })
      }
    }
  },
  evelistend(){
    if (Math.abs(this.data.startLeft) < 60){
      this.setData({
        startLeft: 0
      })
    }
  },
  eveliststart(e){
    this.setData({
      startPageX: e.touches[0].pageX
    })
  },
  setdone(e){
    let time = e.currentTarget.dataset.time;
    wx.getStorage({
      key: 'todoList',
      success: (res) => {
        let data = res.data;
        data.forEach(v => {
          if (v.date === this.data.date) {
            v.list.forEach(m => {
              if(m.time === time){
                if(m.state === 'doing'){
                  m.state = 'done';
                }else{
                  m.state = 'doing';
                }
              }
            })
          }
        });
        
        wx.setStorage({
          key: 'todoList',
          data: data,
        })

        this.getstorageList();
        this.setData({
          startLeft: 0
        })
      }
    })
  },
  deldo(e){
    wx.showModal({
      title:'提示',
      content:'确认删除？',
      success:(res) => {
        if(res.confirm){
          let time = e.currentTarget.dataset.time;
          wx.getStorage({
            key: 'todoList',
            success: (res) => {
              let data = res.data;
              data.forEach(v => {
                if (v.date === this.data.date) {
                  v.list = v.list.filter(m => 
                    m.time !== time
                  )
                }
              });

              wx.setStorage({
                key: 'todoList',
                data: data,
              })
              this.getstorageList();
            }
          })
        }else if(res.cancel){
          this.setData({
            startLeft: 0
          })
        }
      }
    })
  }

})
