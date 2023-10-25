// pages/login/login.js

// 默认头像照片
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

// 默认2张背景
const defaultBackground1='https://qingdao714-1301174277.cos.ap-beijing.myqcloud.com/web/background1.jpg'
const defaultBackground2='https://qingdao714-1301174277.cos.ap-beijing.myqcloud.com/web/background2.jpg'

Page({
  data: {
    buttonChecked:true,
    showName:false,

    // 这是图片地址
    background1:defaultBackground2,

    // 这里是用户的数据
    userInfo:{
      name:'',                  //昵称
      head:defaultAvatarUrl,    //头像地址
      telephone:"", //电话号码
    },

    imageUrl:'',
    date:'',
    generateId:'0'

  },

  onLoad(options) {
    let qrInform=wx.getStorageSync('qrInform')
    if(qrInform){
      if(qrInform.type==0){
        this.setData({
          background1:defaultBackground1
        })
      }else{
        this.setData({
          background1:defaultBackground2
        })
      }
    }else{
      this.setData({
        background1:defaultBackground2
      })
    }

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
        let loginData={
          telephone:res.data.data.telephone
        }

        wx.request({
          url:"https://comicomi.cloud/api/user/login",
          data:loginData,
          method:"GET",
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: res => {
            // login接口请求成功，根据返回data里面的状态码status，判断是否注册过了
            if(res.data.status==400){
              // 如果是400，没注册过，显示昵称，头像页面
              that_.setData({
                showName:true
              })
            }else if(res.data.status==200){
              let head="userInfo.head"
              let name="userInfo.name"
              that_.setData({
                [head]:res.data.data.head,
                [name]:res.data.data.name,
              })
          
              wx.request({
                url: 'https://comicomi.cloud/api/user/getImageUrl?telephone='+that_.data.userInfo.telephone,
                method:'GET',
                header: {
                  'content-type': 'application/json'
                },
                success: res=>{
        
                  if(res.data.status==200){
                    // 这是生成过形象的，先进入原先有的形象，即携带参数跳转
                    that_.setData({
                      imageUrl:res.data.data.imgUrl,
                      date:res.data.data.date,
                      generateId:res.data.data.generateId
                    })

                      if(that_.data.imageUrl=="no"){
                        wx.navigateTo({
                          url: '../offlineLargeScreen/offlineLargeScreen'
                        }) 
                      }else{
                        // 携带参数到形象生成页面
                      
                      wx.navigateTo({
                        url: '../offlineLargeScreen/offlineLargeScreen?imageUrl='+ that_.data.imageUrl+'&date='+ that_.data.date+"&generateId="+ that_.data.generateId+"&name="+ that_.data.userInfo.name
                      }) 
                      }

                    


                  }else if(res.data.status==400){
                    // 这是没有生成过形象，进入生成形象页面
                    that_.setData({
                      imageUrl:'no'
                    })
                    wx.navigateTo({
                      url: '../offlineLargeScreen/offlineLargeScreen'
                    })

                  };
        
                 
        
                },
                fail: error =>{
                  console.log(error)
                }
              })




              wx.setStorageSync('comiComiUser',that_.data.userInfo)  // 将用户信息加入缓存

              
             
            }
          },
          fail: err => {
            console.log("接口请求不成功",err);
          }
        })

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
              wx.navigateTo({
               url: '../offlineLargeScreen/offlineLargeScreen'
             }) 
          },
          fail: err => {
            console.log("请求接口成功",err);
          }
        })

     
    }

   

  }
 

})