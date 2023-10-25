// pages/ar/matchingPage/matchingPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userData: {},
    hipster: [],
    activateBoxType: false,
    activateTextTop: '0',
    date: '请输入您的生日',
    showType: false,
    sea_wave: "top: 100vh",
    sea_wave_top: 100,
    hipsterPreview: {},
    screenHeight: '',
    screenWidth: '',
    matchingBoxType: false,
    becomeAttachedTo: true,
    hipsterList: {
      hipsterNumber: 0,
      hipsterType: '0',
      hipsterName: "巨鲸兽",
      hipsterImage: "https://qingdao714-1301174277.cos.ap-beijing.myqcloud.com/chaoshou_icon/%E9%B2%B8%E9%B1%BC.png"
    },
    popUpPindowsBoxType: true,
    number: 1,
    hipsteSiteTop: [[321,188,135,'https://qingdao714-1301174277.cos.ap-beijing.myqcloud.com/ar_image/Pedestrian_Street.png'], [321,195,329,'https://qingdao714-1301174277.cos.ap-beijing.myqcloud.com/ar_image/Big_Bow_Island.png'], [321,202,569,'https://qingdao714-1301174277.cos.ap-beijing.myqcloud.com/ar_image/Beer_Street.png']],   //width  height  top
    hipsterboxStyle:[[58,82,135,48],[49,64,116,127],[40,63,131,183],[64,77,122,256],[62,81,377,203],[53,76,325,40],[61,51,309,151],[57,68,346,283],[61,71,599,46],[59,79,599,177],[63,80,541,274],[60,64,533,137]],    // width hight top left
    backButtonLocationtop:50
  },

  onLoad(e) {
    console.log(e);
    let userData = wx.getStorageSync('ArUserData')
    console.log(userData);
    this.setData({
      userData: userData,
    })

    // 获取潮兽
    wx.request({
      url: "https://comicomi.cloud/api/beast/getAllBeast?roleId=" + userData.uuid,
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        let island = [] //大鲍岛
        let pedestrian_street = [] //台东步行街
        let beer = [] // 啤酒街

        res.data.data.map(i => {
          if (i.address.indexOf("大鲍岛") !== -1) {
            island.push(i)
          }
          if (i.address.indexOf("步行街") !== -1) {
            pedestrian_street.push(i)
          }
          if (i.address.indexOf("啤酒街") !== -1) {
            beer.push(i)
          }
        })
        let hipsterLisdt = [...pedestrian_street,...island,...beer]
        console.log(hipsterLisdt);
        this.setData({
          hipster: hipsterLisdt
        })
      },
      fail: err => {
        console.log("请求失败", err);
      }
    })

    this.calculate()

    // 判断是否匹配过潮兽 (0-未匹配，1-匹配过)
    if (e.isMate === "0") {
      this.setData({
        activateBoxType: true
      })
      let height = 0;
      this.isMateTime = setInterval(() => {
        height += 29.6;
        this.setData({
          activateTextTop: 'height:' + height + 'rpx'
        })
        if (height > 356) {
          this.setData({
            showType: true
          })
          clearInterval(this.isMateTime)
        }
      }, 100);
    }

    // 判断是否是从结缘后回来的
    if (e.hipsterString) {
      let hipsterList = JSON.parse(e.hipsterString)
      console.log(hipsterList);
      this.setData({
        hipsterList: hipsterList,
        becomeAttachedTo: true,
        popUpPindowsBoxType: true,
        activateBoxType: false,
        matchingBoxType: false,
      })
    }

  },

  onShow() {
    console.log("dsadsad");
    const hipsterString = wx.getStorageSync('hipsterString')
    console.log(hipsterString);
    if (hipsterString) {
      let hipsterList = JSON.parse(hipsterString)
      console.log(hipsterList);
      this.setData({
        hipsterList: hipsterList,
        becomeAttachedTo: true,
        popUpPindowsBoxType: true,
        activateBoxType: false,
        matchingBoxType: false,
      })
    }
  },

   // 页面关闭
   onUnload() {
    console.log("页面关闭");
    wx.removeStorageSync('hipsterString')
  },

  backPage() {
    wx.navigateBack()
  },

  goHomePage() {
    wx.navigateBack({
      delta: 8
    });
  },

  async clickHipster(event) {

    console.log("开始");
    console.log(event.currentTarget.dataset.item);
    this.setData({
      hipsterPreview: event.currentTarget.dataset.item,
      matchingBoxType: true
    })
  },

  goMap() {
    console.log(this.data.hipsterPreview);
    const hipsterPreviewString = JSON.stringify(this.data.hipsterPreview);
    this.setData({
      number: 0
    })
    wx.navigateTo({
      url: '../hipsterMapPage/hipsterMapPage?hipsterPreviewString=' + hipsterPreviewString
    });
  },

  blckButton() {
    this.setData({
      matchingBoxType: false,
      becomeAttachedTo: false
    })
  },

  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },

  onTouchStart(e) {
    if (this.data.date == "请输入您的生日") {
      return wx.showToast({
        title: '请输入您的生日',
        icon: "error",
        duration: 2000
      });
    }
    clearInterval(this.timerId)
    this.timerId = setInterval(() => {
      this.setData({
        sea_wave_top: this.data.sea_wave_top - 0.6666666666,
        sea_wave: "top:" + this.data.sea_wave_top + "vh"
      })
      if (this.data.sea_wave_top < 0) {
        clearInterval(this.timerId)
        console.log("完成");
        this.setData({
          activateBoxType: false,
          sea_wave: "top: 100vh",
        })
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        console.log(this.data.date);
        wx.request({
          url: "https://comicomi.cloud/api/beast/getBeastByUser?roleId=" + this.data.userData.uuid + "&birthday=" + this.data.date,
          method: "GET",
          header: {
            'content-type': 'application/json'
          },
          success: res => {
            wx.hideLoading()
            // let aaaa = {
            //   "uuid": 0,
            //   "id": 8,
            //   "modelUrl": "1",
            //   "url": "https://qingdao714-1301174277.cos.ap-beijing.myqcloud.com/chaoshou_icon_bg/%E9%A3%9E%E9%B1%BC.png",
            //   "latitude": "1",
            //   "longitude": "1",
            //   "capacity": "能让你飞起来。",
            //   "name": "飞鱼潮兽",
            //   "address": "啤酒街（波普风）\r\n",
            //   "big_url": "https://qingdao714-1301174277.cos.ap-beijing.myqcloud.com/chaoshou_icon/%E9%A3%9E%E9%B1%BC.png",
            //   "character": "较为外向，好奇心强，喜欢结交朋友",
            //   "symbolize": "热情\r\n",
            //   "parameter": null,
            //   "type": null,
            //   "meet": null
            // }
            console.log(res.data.data.id);
            console.log(this.data.hipster);
            let hipsterIndex = this.data.hipster.findIndex(item => item.id === res.data.data.id);
            console.log(hipsterIndex);
            let hipsterList = this.data.hipster
            hipsterList[hipsterIndex].type = 1
            this.setData({
              hipster: hipsterList,
              matchingBoxType: true,
              hipsterPreview: hipsterList[hipsterIndex]
            })
          },
          fail: err => {
            wx.hideLoading()
            console.log("请求失败", err);
          }
        })


      }
    }, 10);
  },

  onTouchEnd(e) {
    clearInterval(this.timerId)
    this.timerId = setInterval(() => {
      this.setData({
        sea_wave_top: this.data.sea_wave_top + 0.6666666666,
        sea_wave: "top:" + this.data.sea_wave_top + "vh"
      })
      if (this.data.sea_wave_top > 100) {
        clearInterval(this.timerId)
        console.log("结束");
      }
    }, 10);
  },

  calculate() {
    const sysInfo = wx.getSystemInfoSync();
    let screenHeight = sysInfo.screenHeight;
    let screenWidth = sysInfo.screenWidth
    // 潮兽位置

    let hipsterboxStyle = this.data.hipsterboxStyle
    for (let i = 0; i < hipsterboxStyle.length; i++) {
      hipsterboxStyle[i][0] = (screenWidth / (375 / hipsterboxStyle[i][0])).toFixed(1)   //width
      hipsterboxStyle[i][1] = (screenHeight / (813 / hipsterboxStyle[i][1])).toFixed(1)    //heigth
      hipsterboxStyle[i][2] = (screenHeight / (813 / hipsterboxStyle[i][2])).toFixed(1)  //top
      hipsterboxStyle[i][3] = (screenWidth / (375 / hipsterboxStyle[i][3])).toFixed(1)   //left
    }

    // 地址位置
    let hipsteSiteTop = this.data.hipsteSiteTop
    console.log(screenWidth,screenHeight);
    for (let a = 0; a < hipsteSiteTop.length; a++) {
      hipsteSiteTop[a][2] = (screenHeight / (813 / hipsteSiteTop[a][2])).toFixed(1)
      hipsteSiteTop[a][1] = (screenHeight / (813 / hipsteSiteTop[a][1])).toFixed(1)
      hipsteSiteTop[a][0] = (screenWidth / (375 / hipsteSiteTop[a][0])).toFixed(1)
    }

    const rect = wx.getMenuButtonBoundingClientRect();
    this.setData({
      screenHeight: screenHeight,
      screenWidth: screenWidth,
      hipsterboxStyle:hipsterboxStyle,
      hipsteSiteTop:hipsteSiteTop,
      backButtonLocationtop:rect.top
    })
  },

  onShareAppMessage() {

  },

  backPopUpPindowsButtom() {
    this.setData({
      popUpPindowsBoxType: false
    })
  },

  clickWhy() {
    let hipsterList = this.data.hipsterList
    hipsterList.hipsterType = '2'
    this.setData({
      hipsterList: hipsterList,
      popUpPindowsBoxType: true
    })
  },

  goyyz(){
    wx.reLaunch({
      url: '/pages/pinchFace/pinchFace'
    })
  }
})