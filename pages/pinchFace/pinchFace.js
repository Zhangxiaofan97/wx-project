// 获取应用实例
const app = getApp();
Page({
  data: {
    // 源地址
    webViewSrcOrigin:'https://kp.h5.kuaipantech.com/chenhaihudong/index.html?transdata=',
     
    // 跳转到unity中需要参数
    webViewSrcParameter:{
      "c":"100062",
      "p":"com.bht.vrexpo",
      "t":"1693205731875",
      "d":{
        "action":"sdk_trans_msg", 
        "code":1, 
        "msg":"",
        "param":{
          "deviceId":"",
          "type":"mainui",
          "tel":"",
          "token":"",
          "uuid":"",
          "new_user":false,
          "from":''
        }
      }
    },

    // 这是最终版的地址
    webViewSrc:''
  },

  // 分享功能
  onShareAppMessage(){
    return{
      title:'潮之岛元宇宙',
      path:'/pages/index/index'
    }
  },

  onLoad(options) {

    // 如果其他页面来的话就加入这个页面的来源
    let from="webViewSrcParameter.d.param.from"
    if(options.from=="mechanicalScreen"){
      this.setData({
            [from]:"jixie",
      })
    }else if(options.from=="offlineLargeScreen"){
       // 专门为了门形屏做的
      let deviceIdStorage=wx.getStorageSync("deviceId")
      let deviceId="webViewSrcParameter.d.param.deviceId"
      if(deviceIdStorage){
        this.setData({
          [from]:"menxing",
          [deviceId]:deviceIdStorage
        })
      }
    }else{
      this.setData({
        [from]:"",
      })
    }

    // 检查缓存是否有登录信息
    let comiComiUser=wx.getStorageSync("comiComiUser")
    if(comiComiUser){
      this.getTokenAndUuid()
    }else {
      wx.navigateTo({
        url: '../commonLogin/commonLogin',
      })
    }
  },

  onShow() {
    wx.hideHomeButton()
  },


  // 通过接口拿到token与uuid
  getTokenAndUuid(){
    var that_=this
    let comiComiUser=wx.getStorageSync("comiComiUser")

    let tel="webViewSrcParameter.d.param.tel"
    that_.setData({
      [tel]:comiComiUser.telephone,
    })
    let getTokenData={
      telephone:comiComiUser.telephone
    }
    wx.request({
      url: 'https://comicomi.cloud/api/user/getToken',
      data: getTokenData,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        let token="webViewSrcParameter.d.param.token"
        let uuid="webViewSrcParameter.d.param.uuid"
        that_.setData({
          [token]:res.data.data.token,
          [uuid]:res.data.data.uuid 
        })
        
        // 调用接口，判断用户是否扭过脸
        let newUserData={
          telephone:comiComiUser.telephone
        }
        wx.request({
          url: 'https://comicomi.cloud/api/user/isNewUser',
          data: newUserData,
          method: 'GET',
          header: {
            'content-type': 'application/json'
          },
          success:function(res){

            // 200-捏过脸，504-未注册，505-未捏脸
            let type="webViewSrcParameter.d.param.type"
            let new_user="webViewSrcParameter.d.param.new_user"
            if(res.data.status==200){
              that_.setData({
                [type]:'mainui',
                [new_user]:false 
              })
            }else if(res.data.status==505){
              that_.setData({
                [type]:'avatar',
                [new_user]:true 
              })
            }

            // 拼接这个webViewSrc
            that_.setData({
              webViewSrc:that_.data.webViewSrcOrigin+JSON.stringify(that_.data.webViewSrcParameter)
            })


          }
        })


      },
    })
  },

})
