Page({
  data: {
    deviceId:''
  },

  /* 生命周期函数--监听页面加载*/
  onLoad(options) {

    //  先判断是否是回调函数过来的页面
    if(options.ptype=="enter_menxing"){
      this.sendAvatar()
    }else{

      // 检查缓存是否有用户信息    
      wx.setStorageSync('deviceId',decodeURIComponent(options.q).split('?id=')[1])
      let comiComiUser=wx.getStorageSync("comiComiUser")
      if(comiComiUser){
        this.setData({
          deviceId: decodeURIComponent(options.q).split('?id=')[1]
        })
        this.getDeviceId()
        this.sendAvatar()
      }else {
        wx.navigateTo({
          url: '../commonLogin/commonLogin?pageSource=offlineLargeScreen',
        })
      }

    }

  },

  onShow(options) {
  },

 
  // 调用接口
  getDeviceId(){
    let comiComiUser=wx.getStorageSync("comiComiUser")
    let getDeviceIdData={
      telephone:comiComiUser.telephone,
      deviceId2:this.data.deviceId
    }

    wx.request({
      url: 'https://comicomi.cloud/api/user/getDeviceId',
      data: getDeviceIdData,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res)
      },
    })
  },

  // 点击进入元宇宙
  unlockTakePhoto(){
     wx.redirectTo({
      url: '../pinchFace/pinchFace'
     }) 
  },


  // 点击确认形象之后调用这条接口,现在一定用
  sendAvatar(){
    let comiComiUser=wx.getStorageSync("comiComiUser")
    let deviceIdStorage=wx.getStorageSync("deviceId") 
    let sendAvatarData={
      telephone:comiComiUser.telephone,
      deviceId2:deviceIdStorage
    }

    wx.request({
      url: 'https://comicomi.cloud/api/user/sendAvatar',
      data: sendAvatarData,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res,'这是sendAvatar')
      },
    })
  }
  

})