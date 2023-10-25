
Page({

  data: {
    jixiedeviceId:''
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad(options) {
    // 先将码上的机器号放到缓存里
    wx.setStorageSync('jixiedeviceId',decodeURIComponent(options.q).split('?codeid=')[1])

    //  先判断是否是回调函数过来的页面
    if(options.ptype=="enter_jixie"){
      this.getJixieToken()
    }else{
      //wx.setStorageSync('jixiedeviceId',"10001")
      this.getjixieDeviceId()

      let comiComiUser = wx.getStorageSync('comiComiUser')
      if(comiComiUser){
        this.getJixieToken()
      }else {
        wx.redirectTo({
          url: '../commonLogin/commonLogin?pageSource=mechanicalScreen'
        }) 
      }
    }

  },

   // 第一步 扫码立即调用接口
   getjixieDeviceId(){
    let getjixieDeviceIdData={
      codeId:wx.getStorageSync('jixiedeviceId')
    }
    wx.request({
      url: 'https://comicomi.cloud/api/mechanical/getDeviceId',
      data: getjixieDeviceIdData,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        //console.log(res)
      },
    })
   },

   // 第二步 老用户调用token接口
   getJixieToken(){
     let comiComiUser = wx.getStorageSync('comiComiUser')
     let jixiedeviceId = wx.getStorageSync('jixiedeviceId')
     let tokenData={
      codeId:jixiedeviceId,
      telephone:comiComiUser.telephone
     }

      wx.request({
        url: 'https://comicomi.cloud/api/mechanical/sendToken',
        data: tokenData,
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          //console.log(res)
        },
      })
   },

  //  第三步 发送弹幕
  SendBarrage(e){
    // 保险起见，让缓存中有用户信息再点击生效
    let comiComiUser = wx.getStorageSync('comiComiUser')
    if(comiComiUser){
      let SendBarrageData={
        codeId:wx.getStorageSync('jixiedeviceId'),
        type:Number(e.target.id)
      }
      wx.request({
        url: 'https://comicomi.cloud/api//mechanical/sendBarrage',
        data: SendBarrageData,
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          console.log(res)
        },
      })




    }
  }


})