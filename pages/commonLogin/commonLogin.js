// 默认背景
const defaultBackground1='https://qingdao714-1301174277.cos.ap-beijing.myqcloud.com/web/loginBac.png'
Page({
  data: {
    buttonChecked:true,
    showName:false,

    // 这是图片地址
    background1:defaultBackground1,

    // 这里是用户的数据
    userInfo:{
      name:'',                  //昵称
      telephone:"",             //电话号码
    },

    // 这是从哪个跳转来的
    pageSource:''
  },

  onLoad(options){
    this.setData({
      pageSource:options.pageSource
    })
  },
  onShow() {
      wx.hideHomeButton()
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

  // 授权登录，获取手机号码
  getPhoneNumber (e) {
    // 点了允许手机授权，拿到手机号码
    if(e.detail.code){
      var that_=this
      var data={
        code:e.detail.code
      }

      wx.request({
        url: 'https://comicomi.cloud/api/user/getPhoneNumber',
        data: data,
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          // 拿到手机号码，去查询接口
          let telephone="userInfo.telephone"
          that_.setData({
            [telephone]:res.data.data.telephone,
          })

          let IsNewUserData={
            telephone:res.data.data.telephone,
          }
          wx.request({
            url: 'https://comicomi.cloud/api/user/isNewUser',
            data: IsNewUserData,
            method: 'GET',
            header: {
              'content-type': 'application/json'
            },
            success:function(res){

              // 200-捏过脸，504-未注册，505-未捏脸
              if(res.data.status==504){
                that_.setData({
                  showName:true
                })
                that_.getDeviceIdNew()
              }else if(res.data.status==200){

                // 先将用户信息存入缓存
                let name="userInfo.name"
                that_.setData({
                  [name]: res.data.data
                })
                wx.setStorageSync('comiComiUser', that_.data.userInfo)

                // 如果是从天桥，机械屏，门型屏跳转过来的话则返回之前页面，没有则返回元宇宙页面
                  if(that_.data.pageSource=="offlineLargeScreen"){
                    wx.redirectTo({
                      url: '../offlineLargeScreen/offlineLargeScreen',
                    })
                  }else if(that_.data.pageSource=="mechanicalScreen"){
                    wx.redirectTo({
                      url: '../mechanicalScreen/mechanicalScreen',
                    })
                  }else{
                    wx.redirectTo({
                      url: '../pinchFace/pinchFace',
                    })
                  }
              }else if(res.data.status==505){
                wx.setStorageSync('comiComiUser', that_.data.userInfo)
                that_.getDeviceIdNew()
                wx.redirectTo({
                  url: '../pinchFace/pinchFace',
                })
              }

            }
          })






          // wx.request({
          //   url:"https://comicomi.cloud/api/user/login",
          //   data:telData,
          //   method:"GET",
          //   header: {
          //     'content-type': 'application/json' // 默认值
          //   },
          //   success: res => {
          //     // login接口请求成功，根据返回data里面的状态码status，判断是否注册过了
          //     if(res.data.status==400){
          //       // 如果是400，没注册过，显示昵称
          //       that_.setData({
          //         showName:true
          //       })
          //       that_.getDeviceIdNew()
          //     }else if(res.data.status==200){
          //       let name="userInfo.name"
          //       that_.setData({
          //         [name]:res.data.data.name
          //       })
          //       wx.setStorageSync('comiComiUser',that_.data.userInfo)  // 将用户信息加入缓存 

          //        // 用户虽然注册过了，但是不知道有没有捏过脸
          //       let comiComiUser=wx.getStorageSync("comiComiUser")
          //       let IsNewUserData={
          //         telephone:comiComiUser.telephone
          //       }
          //       wx.request({
          //         url: 'https://comicomi.cloud/api/user/isNewUser',
          //         data: IsNewUserData,
          //         method: 'GET',
          //         header: {
          //           'content-type': 'application/json'
          //         },
          //         success:function(res){

          //           // 200-捏过脸，504-未注册，505-未捏脸
          //           if(res.data.status==200){
          //             // 如果是从天桥，机械屏，门型屏跳转过来的话则返回之前页面，没有则返回元宇宙页面
          //               if(that_.data.pageSource=="offlineLargeScreen"){
          //                 wx.redirectTo({
          //                   url: '../offlineLargeScreen/offlineLargeScreen',
          //                 })
          //               }else if(that_.data.pageSource=="mechanicalScreen"){
          //                 wx.redirectTo({
          //                   url: '../mechanicalScreen/mechanicalScreen',
          //                 })
          //               }else{
          //                 wx.redirectTo({
          //                   url: '../pinchFace/pinchFace',
          //                 })
          //               }
          //           }else if(res.data.status==505){
          //             that_.getDeviceIdNew()
          //             wx.redirectTo({
          //               url: '../pinchFace/pinchFace',
          //             })
          //           }

          //         }
          //       })
                 

          //     }
          //   },
          //   fail: err => {
          //     console.log("接口请求不成功",err);
          //   }
          // })

        },
      })

    }
  },

 

  // 改变昵称数据 
  bindKeyInput(e){
    let name="userInfo.name"
    this.setData({
      [name]: e.detail.value
    })
  },

  // 跳转线下大屏页面
  GoToOfflineLargeScreen(){
    var that_=this
    // 先将用户数据发送到注册接口
    if(this.data.userInfo.name!=''){
      let registerData=this.data.userInfo
       wx.request({
          url:"https://comicomi.cloud/api/user/register",
          data:registerData,
          method:"POST",
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: res => {
            wx.setStorageSync('comiComiUser', this.data.userInfo)   // 将用户数据写进缓存中
            
            wx.redirectTo({
              url: '../pinchFace/pinchFace?from='+that_.data.pageSource,
            })
            
          },
          fail: err => {
            console.log("请求注册接口不成功",err);
          }
        })
    }
  },

  // 门形屏，可能要改逻辑
  getDeviceIdNew(){
    let getDeviceIdNewData={
      deviceId2:wx.getStorageSync("deviceId")
    }
    wx.request({
      url: 'https://comicomi.cloud/api/user/getDeviceIdNew',
      data:getDeviceIdNewData,
      method:"GET",
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res)
      },
    })
   
  },

 












  // 注册时候获取定位
  // rigsiterGetLocation(){
  //   wx.getLocation({
  //     type:'wsg84',
  //     altitude:"true",
  //     success:(res)=>{
  //       if(res&&res.longitude&&res.latitude){
  //         wx.request({
  //           url: 'https://api.map.baidu.com/geocoder/v2/?ak=sO3bXXPfYH813UGNjHjEZ798XM9mEU2j&location='+res.latitude
  //           +','+res.longitude+'&output=json',
  //           method: 'GET',
  //           success:(res)=>{
  //             console.log(res)
  //           }


  //         })
  //       }
  //     }
  //   })
  // }
 

})