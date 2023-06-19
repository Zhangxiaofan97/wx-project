// index.js
// 获取应用实例
const app = getApp();
Page({
  data: {
    // 导航栏高度
     navHeight: app.globalData.navHeight,
    // 导航栏距离顶部距离
     navTop: app.globalData.navTop,
    // 胶囊的高度
     navObj: app.globalData.navObj,

    // 胶囊宽度+距右距离
     navObjWid: app.globalData.navObjWid,
     text:'扫码',

    //  这里是登录
     buttonChecked:true,
     userInfo:null,


  },

  // 左上角的扫码功能
  scanCode(){
    wx.scanCode({success: (res) => {
      console.log(res)
      console.log(app,'这是app')
    }
  })
  },

  // 进入元宇宙
  enterFirst(e){
    let user= wx.getStorageSync("user")
    if(user){
      console.log(user.nickName,'这是user')
      wx.navigateTo({
        url: '../metaverse/metaverse'
      })    
    }else{
      wx.navigateTo({
        url: '../login/login'
      })                                       
    }


    
  }


 
 

  
})
