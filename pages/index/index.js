// index.js
// 获取应用实例
const app = getApp();
Page({
  data: {
  },

  onLoad(options) {

    // 检查缓存是否有登录信息
    let comiComiUser=wx.getStorageSync("comiComiUser")
    if(comiComiUser){
      console.log("开机画面有登录信息")
    }else {
      wx.redirectTo({
        url: '../commonLogin/commonLogin',
      })
    }
    
  },

  // 分享功能
  onShareAppMessage(){
    return{
      title:'潮之岛元宇宙',
      path:'/pages/index/index'
    }
  },

  onShow() {
    wx.hideHomeButton()
  },

 


  skipdongHua(){

    wx.redirectTo({
      url: '../pinchFace/pinchFace'
    })

    //  wx.redirectTo({
    //   url: '../shareImage/shareImage'
    // })  

    // wx.redirectTo({
    //   url: '../myInformation/myInformation'
    // }) 

    // wx.redirectTo({
    //   url: '../offlineLargeScreen/offlineLargeScreen'
    // }) 

    // wx.redirectTo({
    //   url: '../skybridge/skybridge'
    // }) 

    // wx.redirectTo({
    //   url: '../mechanicalScreen/mechanicalScreen'
    // }) 

    //  wx.redirectTo({
    //   url: '../liveVideo/liveVideo'
    // }) 

  },

  

})
