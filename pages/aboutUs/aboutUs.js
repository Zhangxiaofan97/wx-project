// pages/aboutUs.js
Page({
  data: {
    userInfo:null,
  },

  /*生命周期函数--监听页面加载*/
  onLoad() {
    let user= wx.getStorageSync("user")
    // console.log(user,'user')
      this.setData({
        userInfo:user,
      })    
  },

  onShow(){
   this.onLoad()
  },

  /* 生命周期函数--监听页面初次渲染完成*/
  onReady() {
  },
  
  // 退出登录
  loginOut(e){
    this.setData({
      userInfo:null,
  })
    wx.setStorageSync('user', null)  // 退出登录的时候需要把缓存清空
  },

  // 去登录注册
  login(){
    wx.navigateTo({
      url: '../login/login'
    }) 
  }






 




 

 
})