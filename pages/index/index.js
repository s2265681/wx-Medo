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
    date: util.formatTime(new Date,'d'),
    textareaShow: false,
    doingList: [],
    doneList: [],
    textareaValue: '',
    today: util.formatTime(new Date, 'd'),
    startPageX: 0,
    startLeft: 0,
    startnowindex: 0
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
  evelistmove(e){
    this.setData({
      startnowindex: e.currentTarget.dataset.nowindex
    })
    if (Math.abs(this.data.startLeft) < 180) {
      if (e.touches[0].pageX - this.data.startPageX < 0) {
        if (Math.abs(e.touches[0].pageX - this.data.startPageX) < 100) {
          this.setData({
            startLeft: e.touches[0].pageX - this.data.startPageX
          })
        } else {
          this.setData({
            startLeft: -180
          })
        }
      } else {
        this.setData({
          startLeft: 0
        })
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
      }
    })
  }

})
