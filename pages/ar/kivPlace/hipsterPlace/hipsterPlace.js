import {
  errorHandler,
  showAuthModal,
  requestFile
} from "../../../../utils/utilAr";

function throttle(fn, delay = 500) {
  let timer = null;
  return function () {
    if (timer) return;
    timer = setTimeout(() => {
      fn.apply(this, arguments);
      timer = null;
    }, delay);
  };
}

Page({
  data: {
    version: "v1",
    hipsterBoxList: [],
    downloadHipster: {},
    license: "ad51dc82b4846b28943338eeaac37f56321cb7aecb87927cde2da142605bc45c3a2a565de67e30ed8329f8990bdde742ac120961f01b51df8b9d1ea88134e903",
    hipsterBoxHeight: 440,
    uploadBoxType: false,
    backButtonLocationtop:50
  },

  onLoad(e) {
    wx.showLoading({
      title: "初始化中...",
      mask: true
    });
    let userData = wx.getStorageSync('ArUserData')

    const rect = wx.getMenuButtonBoundingClientRect();
    this.setData({
      backButtonLocationtop: rect.top
    })

    // 获取潮兽
    wx.request({
      url: "https://comicomi.cloud/api/beast/getAllBeast?roleId=" + userData.uuid,
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        console.log(res.data.data);
        let island = [] //大鲍岛
        let pedestrian_street = [] //台东步行街
        let beer = [] // 啤酒街

        res.data.data.map(i => {
          if (i.address.indexOf("大鲍岛") === 0) {
            island.push(i)
          }
          if (i.address.indexOf("台东步行街") === 0) {
            pedestrian_street.push(i)
          }
          if (i.address.indexOf("啤酒街") === 0) {
            beer.push(i)
          }
        })
        let hipsterLisdt = [...island, ...pedestrian_street, ...beer]
        this.setData({
          hipsterBoxList: hipsterLisdt
        })

      },
      fail: err => {
        console.log("请求失败", err);
      }
    })

    this.downloadAsset = Promise.all([
      requestFile("https://qingdao714-1301174277.cos.ap-beijing.myqcloud.com/ar_model/reticle.glb"),
    ]);
  },

  async ready({
    detail: slam
  }) {
    try { 
      const [reticleArrayBuffer] = await this.downloadAsset;
      const [reticle] = await Promise.all([
        slam.createGltfModel(reticleArrayBuffer),
      ]);

      this.reticle = reticle

      this.slam = slam;
      // slam组件是否是v2
      this.isV2 = slam.isSlamV2();
      const invokeCheck = throttle(this.checkCameraAngle, 600);
      slam.addPlaneIndicator(reticle, {
        size: 0.4,
        // camera画面中心对准的位置有可用平面，指示器初次放置到该平面的时候调用
        onPlaneShow: () => {
          console.log("onPlaneShow");
          if (this.isV2) {
            clearTimeout(this.timer);
            wx.hideToast();
          }

        },
        onPlaneHide: () => {
          console.log("onPlaneHide");
          if (this.isV2) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
              wx.showToast({
                title: "请对准平面，点击屏幕放置",
                icon: "none",
                duration: 20000,
              });
            }, 400);
          }
        },
        onPlaneShowing: () => {
          if (!this.isV2) {
            invokeCheck();
          }
        },
      });
      // 开启slam平面追踪
      await slam.start();
      console.log("dsadsadsad");
      wx.hideLoading();
    } catch (e) {
      console.log("dsadsadsa1d2");
      wx.hideLoading();
    }
  },

  checkCameraAngle() {
    const camera = this.slam.defaultCamera;
    const pos = camera.position.clone();
    const sky = pos.set(0, 1, 0);
    const cameraUp = camera.getWorldDirection();
    const {
      x,
      y,
      z
    } = cameraUp;
    if (x === 0 && y === -1 && z === 0) {
      this.slam.removePlaneIndicator();
      return wx.showModal({
        title: "提示",
        content: "slam v1模式下, 初始化的时候请尽量让手机相机倾斜向下",
        showCancel: false,
        success() {
          wx.navigateBack();
        },
      });
    }
    const angleToSky = cameraUp.angleTo(sky);
    if (angleToSky < Math.PI / 2) {} else {
      wx.hideToast();
    }
  },

  // 页面关闭
  onUnload() {
    console.log("页面关闭");
    if (this.slam) {
      this.slam.clear();
    }
  },

  async clickHipster(event) {
    const item = event.target.dataset.item;
    const index = event.currentTarget.dataset.index;
    console.log(item);
    console.log(index);

    if (item.modelUrl.length < 2) {
      return wx.showToast({
        title: '暂不开放',
        icon: 'error',
        duration: 2000
      })
    }
    this.setData({
      uploadBoxType: true
    })

    const {
      slam
    } = this;
    const {
      windowWidth,
      windowHeight
    } = wx.getSystemInfoSync();


    let downloadHipsterData
    let flag
    // 是当前显示的潮兽
    if (this.data.downloadHipster.id == item.id) {
      downloadHipsterData = this.data.downloadHipster.hipster
    } else {
      this.clickResetHipster()
      const model = await requestFile(item.modelUrl);
      const model3d = await slam.createGltfModel(model)
      this.setData({
        downloadHipster: {
          id: item.id,
          hipster: model3d
        }
      })
      downloadHipsterData = model3d
      downloadHipsterData.visible = false;
      await slam.add(downloadHipsterData, 0.5);

    }
    flag = await slam.standOnThePlane(downloadHipsterData, Math.round(windowWidth / 2), Math.round(windowHeight / 2), true);
    const defaultOptions = {
      click: false, // 开启点击屏幕放置模型
      drag: false, // 开启模型拖拽
      singleFinger: true, // 开启单指选转模型
      doubleFinger: true, // 开启双指缩小和放大模型
      scaleMax: 1000, // 设置模型最大放大值
      scaleMin: 0, // 设置模型最小缩放值
    }
    slam.setGesture(downloadHipsterData, defaultOptions);
    downloadHipsterData.position.y = 1
    let animationName = "IDLE"
    downloadHipsterData.playAnimation({
      animationName,
      loop: true,
      animationSpeed: 1
    });
    this.setData({
      uploadBoxType: false
    })
    if (flag) {
      if (!downloadHipsterData.visible) {
        downloadHipsterData.visible = true;
      }
    }
  },

  clickTriangle() {
    console.log("ss");
    let that = this
    this.hipsterBoxTime = setInterval(() => {
      let hipsterBoxHeight = this.data.hipsterBoxHeight - 44
      that.setData({
        hipsterBoxHeight: hipsterBoxHeight
      })
      if (hipsterBoxHeight <= 0) {
        clearInterval(this.hipsterBoxTime)
        that.setData({
          hipsterBoxHeight: 0
        })
      }
    }, 10);
  },

  clickMoreHipster() {
    let that = this
    this.hipsterBoxTime2 = setInterval(() => {
      let hipsterBoxHeight = this.data.hipsterBoxHeight + 44
      that.setData({
        hipsterBoxHeight: hipsterBoxHeight
      })
      if (hipsterBoxHeight >= 440) {
        clearInterval(this.hipsterBoxTime2)
        that.setData({
          hipsterBoxHeight: 440
        })
      }
    }, 10);
  },

  async onTakePhoto() {
    try {
      wx.showLoading({
        title: "拍照中...",
        mask: true
      });
      const photoPath = await this.slam.takePhoto();
      console.log(photoPath);
      wx.hideLoading();
      wx.navigateTo({
        url: `../view/viewPhoto?photo=${encodeURIComponent(photoPath)}`
      });
    } catch (e) {
      console.log(e);
      wx.hideLoading();
      errorHandler(e);
    }
  },

  clickUpward() {
    // 弧度
    this.data.downloadHipster.hipster.rotation.x = this.data.downloadHipster.hipster.rotation.x - 30 * (Math.PI / 180)
  },

  clickCownward() {
    // 弧度
    this.data.downloadHipster.hipster.rotation.x = this.data.downloadHipster.hipster.rotation.x + 30 * (Math.PI / 180)
  },

  clickResetHipster() {
    if (this.data.downloadHipster.hipster) {
      console.log("00");
      this.slam.remove(this.data.downloadHipster.hipster);
      this.slam.destroyObject(this.data.downloadHipster.hipster);
      this.setData({
        downloadHipster: {}
      })
    }

  },

  backPage() {
    wx.navigateBack();
  },

  goHomePage() {
    wx.navigateBack({
      delta: 8
    });
  },

  error({
    detail
  }) {
    console.log("dsadsadsadasd2222222");
    wx.hideLoading();
    // 判定是否camera权限问题，是则向用户申请权限。
    if (detail?.isCameraAuthDenied) {
      showAuthModal(this);
    } else {
      errorHandler(detail);
    }
  },
});