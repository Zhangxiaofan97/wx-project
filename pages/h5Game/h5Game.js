// pages/h5Game/h5Game.js
Page({
  data: {
    webViewSrc:''
  },

  onLoad(options) {
    this.setData({
      webViewSrc:decodeURIComponent(options.link)
    })
  },

  // 分享功能
  onShareAppMessage(){
    return{
      title:'潮之岛元宇宙',
      path:'/pages/index/index'
    }
  },

  
  onReady() {},

  
  onShow() {},

 
})