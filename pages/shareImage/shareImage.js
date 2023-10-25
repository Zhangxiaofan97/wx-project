// pages/shareImage/shareImage.js
Page({
  data: {
    // 图片的地址
    imageSrc:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      imageSrc:decodeURIComponent(options.url)
    })

  },
  // 分享小程序
  onShareAppMessage() {
    return{
      title:'潮之岛元宇宙',
      path:'/pages/index/index'
    }
  },


  //分享与保存图片的功能
  shareImageFunction(){

    wx.downloadFile({
      url: this.data.imageSrc,
      success: (res) => {
        wx.showShareImageMenu({
          path: res.tempFilePath
        })
      }
    })
    
  },

  

})