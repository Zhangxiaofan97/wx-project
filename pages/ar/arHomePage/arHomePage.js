// pages/ar/arHomePage/arHomePage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userData: {},
    swiperList: [],
    current: 0,
    courseState: 0,
    userStater: 0,
    target: "",
    hipsterId: 0,
    arStater: 0,
    backButtonLocationtop:50
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    console.log(e);
    let hipsterId = ''
    let target = ''
    if (e.q && e.q != "undefined") {
      const qrUrl = decodeURIComponent(e.q)
      console.log(qrUrl);
      let jsonUrl = this.GetwxUrlParam(qrUrl);
      //比如我要得到id的值，直接取值即可
      hipsterId = jsonUrl.hipsterId;
      target = jsonUrl.target;
      console.log("hipsterId" + hipsterId);
      console.log("target" + target);
    }
    let userData = wx.getStorageSync('comiComiUser')
    console.log(userData);
    wx.request({
      url: "https://comicomi.cloud/api/beast/getLunbo",
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        console.log(res.data.data);
        this.setData({
          swiperList: res.data.data,
          hipsterId: hipsterId,
          target: target
        })
      },
      fail: err => {
        console.log("请求失败", err);
      }
    })

    if (!userData) {
      wx.navigateTo({
        url: '../../commonLogin/commonLogin',
      })
    }

    if (!wx.getStorageSync('firstTime')) {
      this.setData({
        courseState: 1
      })
      wx.setStorageSync('firstTime', 1)
    }
  },

  GetwxUrlParam(url) {
    let theRequest = {};
    if (url.indexOf("#") != -1) {
      const str = url.split("#")[1];
      const strs = str.split("&");
      for (let i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
      }
    } else if (url.indexOf("?") != -1) {
      const str = url.split("?")[1];
      const strs = str.split("&");
      for (let i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
      }
    }
    return theRequest;
  },

  onHide() {
    console.log("0000");
    this.setData({
      userStater: 1,
      arStater: 1
    })
  },

  onShow() {

    const rect = wx.getMenuButtonBoundingClientRect();
    console.log(rect);
    this.setData({
      backButtonLocationtop: rect.top
    })


    let userData = wx.getStorageSync('comiComiUser')
    if (this.data.userStater == 1 || userData) {
      console.log(userData.telephone);
      let that = this
      wx.request({
        url: "https://comicomi.cloud/api/user/getOwner?telephone=" + userData.telephone,
        method: "GET",
        header: {
          'content-type': 'application/json'
        },
        success: res => {
          console.log(res.data.data);
          that.setData({
            userData: res.data.data
          })
          wx.setStorageSync('ArUserData', res.data.data)
          if (res.data.data.isMate == 0) {
            wx.navigateTo({
              url: '../matchingPage/matchingPage?isMate=' + res.data.data.isMate,
            })
          }
          //判断是否是扫码进入
          console.log(that.data.target);
          if (that.data.target == "ar" && that.data.arStater === 0) {
            wx.request({
              url: 'https://comicomi.cloud/api/beast/getBeastById?id=' + that.data.hipsterId + "&roleId=" + that.data.userData.uuid,
              method: "GET",
              header: {
                'content-type': 'application/json'
              },
              success: res => {
                console.log(res.data.data);
                wx.navigateTo({
                  url: '../kivPlace/hipster/hipster?glb=' + res.data.data.modelUrl + "&&type=" + res.data.data.type + "&&big_url=" + res.data.data.big_url + "&&name=" + res.data.data.name + "&&parameter=" + res.data.data.parameter + "&&id=" + res.data.data.id + "&&skipType=0"
                });

                // wx.navigateTo({
                //   url: '../kivPlace/hipster/hipster?glb=' + 'https://como.tuidianguan.com/arData/hipster/glb/feiyu.glb' + "&&type=" + '0' + "&&big_url=" + res.data.data.big_url + "&&name=" + res.data.data.name + "&&parameter=" + '40;0;200;-505;0;80;-155;6000;0;85' + "&&id=" + res.data.data.id + "&&skipType=0"
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

          //判断是否是结缘拿完红包雨回来
          const hipsterString = wx.getStorageSync('hipsterString')
          console.log(hipsterString);
          if (hipsterString) {
            wx.navigateTo({
              url: '../matchingPage/matchingPage',
            })
          }


        },
        fail: err => {
          console.log("请求失败", err);
        }
      })

    }
  },

  changeIndicatorDots(e) {
    this.setData({
      current: e.detail.current
    })
  },

  backPage() {
    wx.navigateBack()
  },

  goHomePage() {
    wx.navigateBack({
      delta: 8
    });
  },

  goHipsterMap() {
    wx.navigateTo({
      url: '../matchingPage/matchingPage'
    });
  },

  goBecomeAttachedToPage() {
    let that = this
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        console.log(res.result);
        let hipsterId = res.result.split("?")[1].split("&")[1].split("=")[1]
        wx.request({
          url: 'https://comicomi.cloud/api/beast/getBeastById?id=' + hipsterId + "&roleId=" + that.data.userData.uuid,
          method: "GET",
          header: {
            'content-type': 'application/json'
          },
          success: res => {
            wx.hideLoading()
            console.log(res.data.data);
            wx.navigateTo({
              url: '../kivPlace/hipster/hipster?glb=' + res.data.data.modelUrl + "&&type=" + res.data.data.type + "&&big_url=" + res.data.data.big_url + "&&name=" + res.data.data.name + "&&parameter=" + res.data.data.parameter + "&&id=" + res.data.data.id + "&&skipType=0"
            });
            // wx.navigateTo({
            //   url: '../kivPlace/hipster/hipster?glb=' + 'https://como.tuidianguan.com/arData/hipster/glb/feiyu.glb' + "&&type=" + '0' + "&&big_url=" + res.data.data.big_url + "&&name=" + res.data.data.name + "&&parameter=" + '40;0;200;-505;0;80;-155;6000;0;85' + "&&id=" + res.data.data.id + "&&skipType=0"
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

  goHipsterPlace() {
    wx.navigateTo({
      url: "../kivPlace/hipsterPlace/hipsterPlace"
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})