// pages/login/login.js
Page({
  data: {
    buttonChecked:true,
  },

  onLoad(options) { 
  },
  onReady() {
  },
  onShow() {
  },
  onHide() {
  },
  onUnload() {
  },
  onPullDownRefresh() {
  },
  onReachBottom() {
  },
  onShareAppMessage() {
  },

   // 登录的选中 
   checkHandler(e){
    if(!this.data.buttonChecked){
      this.setData({
        buttonChecked:true
      })
    }else{
      this.setData({
        buttonChecked:false
      })
    }
   },

   // 授权登录,获取昵称与头像
  getUserProfile(e) {  
    wx.getUserProfile({
      desc: '完善用户信息', // 必填
      success: (res) => {
        let user=res.userInfo
        wx.setStorageSync('user', user)   // 加入缓存
        this.setData({
          userInfo:user,
        })
        
        // 弹出隐私的提示框
        wx.showModal({
          title: '提示',
          content: '需要同意《隐私协议》',
          success: function (res) {
            if (res.confirm) {
              console.log("这是确定")
              // this.test()
            } else {

            }
          }
        
        })


        // wx.navigateBack({
        //   delta: 1
        // })
        // let data={}
        // data.telephone="15251800728"
        // data.head=this.data.userInfo.avatarUrl
        // data.name=this.data.userInfo.name
        // data.sex=this.data.userInfo.gender

        // wx.request({
        //   url:"https://49.233.100.29:9938/user/register",
        //   data:data,
        //   method:"POST",
        //   header: {
        //     'content-type': 'application/json' // 默认值
        //   },
        //   success: res => {
        //     console.log("请求成功",res);
        //   },
        //   fail: err => {
        //     console.log("请求失败",err);
        //   }
        // })
      },
      fail:(res)=>{
        console.log("授权失败",res)
      }
    })
  },

  // 授权登录，获取手机号码
  getPhoneNumber (e) {
    console.log(e)
  },

  test(){
    console.log("返回")
  }


})