// pages/ar/hipsterMapPage/hipsterMapPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hipsterData: {},
    latitude: 0,
    longitude: 0,
    addressName: "",
    userData: "",
    backButtonLocationtop:50
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {

    let userData = wx.getStorageSync('ArUserData')
    console.log(userData);
    this.setData({
      userData: userData
    })

    const obj = JSON.parse(e.hipsterPreviewString);
    console.log("”dsdsdsds", obj);

    const rect = wx.getMenuButtonBoundingClientRect();
    this.setData({
      hipsterData: obj,
      // latitude: parseFloat(obj.latitude),
      // longitude: parseFloat(obj.longitude),
      latitude: 36.082134,
      longitude: 120.356836,
      addressName: obj.address,
      backButtonLocationtop: rect.top
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  backPage() {
    wx.navigateBack();
  },
  goHomePage() {
    wx.navigateBack({
      delta: 8
    });
  },
  markerTap(e) {
    console.log(e);
    wx.openLocation({
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      name: this.data.addressName,
      address: '青岛市',
      scale: 18,
      type: 0,
      fail: function (e) {
        console.log(e);
      }
    });
  },
  scanQRcodes() {
    if (this.data.hipsterData.modelUrl.length < 1) {
      return wx.showToast({
        title: '暂无法体验',
        icon: "error",
        duration: 2000
      })
    }
    let that = this
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        wx.showLoading({
          title: '加载中',
          mask:true
        })
        console.log(res)
        let hipsterId = res.result.split("?")[1].split("&")[1].split("=")[1]
        console.log(hipsterId);
        console.log(that.data.userData.uuid);
        wx.request({
          url: 'https://comicomi.cloud/api/beast/getBeastById?id=' + hipsterId + "&roleId=" + that.data.userData.uuid,
          method: "GET",
          header: {
            'content-type': 'application/json'
          },
          success: res => {
            wx.hideLoading()
            console.log(res.data.data);
            wx.redirectTo({
              url:'../kivPlace/hipster/hipster?glb=' + res.data.data.modelUrl + "&&type=" + res.data.data.type + "&&big_url=" + res.data.data.big_url + "&&name=" + res.data.data.name + "&&parameter=" + res.data.data.parameter + "&&id=" + res.data.data.id + "&&skipType=1"
            });
            // wx.redirectTo({
            //   url: '../kivPlace/hipster/hipster?glb=' + 'https://como.tuidianguan.com/arData/hipster/glb/feiyu.glb' + "&&type=" + '0' + "&&big_url=" + res.data.data.big_url + "&&name=" + res.data.data.name + "&&parameter=" + '40;0;200;-505;0;80;-155;6000;0;85' + "&&id=" + res.data.data.id + "&&skipType=1"
            // });
          },
          fail: res => {
            wx.showToast({
              title: '调用失败',
              icon: 'error',
              duration: 2000
            })
          },
          complete: res => {
            wx.hideLoading()
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})