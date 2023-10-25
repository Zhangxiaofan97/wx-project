import {
  errorHandler,
  showAuthModal,
  requestFile
} from "../../../../utils/utilAr";
import {
  Vector3
} from "../../../../utils/Vector3"
import {
  Quaternion
} from "../../../../utils/Quaternion"
import TWEEN from "../../../../utils/tween.umd";

Page({
  data: {
    hipsterId:0,
    isRender: true,
    license: "ad51dc82b4846b28943338eeaac37f56321cb7aecb87927cde2da142605bc45c3a2a565de67e30ed8329f8990bdde742ac120961f01b51df8b9d1ea88134e903",
    shadeHeight: 116,
    text: "潮兽出现了快点寻找",
    textSize: 34,
    shellType: true,
    textBoxType: false,
    knotType: false,
    knotSize: 0,
    countDownType: false,
    countDown: 5,
    shellNumber: 0,
    type: null,
    hipsterGLB: "",
    hipsterName: "",
    hipsterImage: "",
    popUpWindowsType: false,
    becomeAttachedToType: 0,
    parameter: [],
    userData:{},
    skipType:0,
    kivw:'100vw',
    kivh:'100vh',
    backButtonLocationtop:50
  },

  //点击贝壳
  clickShell() {
    if (this.data.shadeHeight < 0) {
      return
    } else {
      this.setData({
        textBoxType: false,
      })
    }
    let shadeHeight = this.data.shadeHeight - 23.2
    this.setData({
      shadeHeight: shadeHeight,
    })
    if (this.data.shadeHeight < 0) {
      this.setData({
        text: "潮兽向你点了点头，\n连续点击下方按钮,尝试与它结缘吧!",
        shellType: false
      })
      let textSize = 0
      this.textSizeTime = setInterval(() => {
        textSize = textSize + 1.4705882352941178
        this.setData({
          textBoxType: true,
          textSize: textSize
        })
        if (textSize > 34) {
          clearInterval(this.textSizeTime)
        }
      }, 10);

      setTimeout(() => {
        console.log("sssss");
        let knotSize = 0
        this.knotSizeTime = setInterval(() => {
          knotSize = knotSize + 3.04
          this.setData({
            knotSize: knotSize
          })
          if (knotSize > 152) {
            clearInterval(this.knotSizeTime)
          }
        }, 10);
      }, 2000);
    }
  },

  //倒计时
  countDownMethod() {
    let that = this
    this.countDownNumber = setInterval(() => {
      console.log("1");
      this.setData({
        countDown: this.data.countDown - 1,
      })
      if (this.data.countDown == 0) {
        clearInterval(this.countDownNumber)
        wx.showModal({
          title: '',
          content: '获得潮力值：' + that.data.shellNumber * 10,
          showCancel: false,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              let hipsterList = {
                hipsterNumber: that.data.shellNumber * 10,
                hipsterType: that.data.type,
                hipsterName: that.data.hipsterName,
                hipsterImage: that.data.hipsterImage,
              }
              console.log(hipsterList);
              wx.setStorageSync('hipsterString', JSON.stringify(hipsterList))
              wx.navigateBack()
            }
          }
        })
      }
    }, 1000);
  },

  // 点击结缘
  becomeAttachedTo() {
    if (this.data.becomeAttachedToType === 0) {

      this.rabbitModel.stopAnimation("FLY");
      let animationName = "IDLE"
      this.rabbitModel.playAnimation({
        animationName,
        loop: true,
        animationSpeed: 1.5
      });

      this.exercise()
      this.setData({
        becomeAttachedToType: 1
      })
      setTimeout(() => {
        console.log("sssss");
        console.log(this.data.type);
        // 1 匹配的潮兽  0不匹配的潮兽
        if (this.data.type === '0') {
          this.setData({
            popUpWindowsType: true,
            knotSize: 0,
            textBoxType: false,
          })
        } else {
          let that = this
          wx.request({
            url: "https://comicomi.cloud/api/beast/beastFancy",
            method: "POST",
            header: {
              'content-type': 'application/json'
            },
            data: {
              "roleId": that.data.userData.uuid,
              "id": that.data.hipsterId
            },
            success: res => {
              console.log(res);
              let experience = 0
              if (res.data.data !== null) {
                experience = res.data.data.experience
              }
              let hipsterList = {
                hipsterNumber: experience,
                hipsterType: that.data.type,
                hipsterName: that.data.hipsterName,
                hipsterImage: that.data.hipsterImage,
              }
              if (this.data.skipType === '0') {
                wx.redirectTo({
                  url: "../../matchingPage/matchingPage?hipsterString=" + JSON.stringify(hipsterList)
                })
              }else{
                wx.setStorageSync('hipsterString', JSON.stringify(hipsterList))
                wx.navigateBack()
              }
            },
            fail: err => {
              console.log("请求失败", err);
            }
          })
        }
      }, 8000);
    }
  },

  // 点击开始抢贝壳
  clickPopUpWindowsButton() {
    console.log("开始抢贝壳");
    this.setData({
      popUpWindowsType: false,
    })

    //获取页面所有模型
    const list = this.slam.getAllObject();
    console.log(list);
    list.forEach(obj => {
      obj.visible = true
    });
    this.rabbitModel.visible = false

    //触发倒计时
    this.setData({
      countDownType: true
    })
    this.countDownMethod()
  },

  //页面加载
  onLoad(e) {
    console.log("dsadsadsadsadsa", e);
    let userData = wx.getStorageSync('ArUserData')
    this.setData({
      hipsterId:e.id,
      userData:userData,
      type: e.type,
      hipsterGLB: e.glb,
      hipsterName: e.name,
      hipsterImage: e.big_url,
      parameter: e.parameter.split(";").map(Number),
      skipType:e.skipType
    })
    wx.showLoading({
      title: "初始化中....",
      mask:true
    });

    const sysInfo = wx.getSystemInfoSync();
    let screenHeight = sysInfo.screenHeight;
    let screenWidth = sysInfo.screenWidth

    console.log(screenHeight,screenWidth);

    const rect = wx.getMenuButtonBoundingClientRect();

    this.setData({
      kivw:screenWidth+'px',
      kivh:screenHeight+'px',
      backButtonLocationtop: rect.top
    })

    if (this.data.type === "1") {
      this.downloadAsset = Promise.all([
        requestFile(
          this.data.hipsterGLB
        ),
        requestFile(
          "https://qingdao714-1301174277.cos.ap-beijing.myqcloud.com/ar_model/default.hdr"
        ),
        requestFile(
          "https://qingdao714-1301174277.cos.ap-beijing.myqcloud.com/ar_model/xingkong.png"
        )
      ]);
    } else {
      this.downloadAsset = Promise.all([
        requestFile(
          this.data.hipsterGLB
        ),
        requestFile(
          "https://qingdao714-1301174277.cos.ap-beijing.myqcloud.com/ar_model/default.hdr"
        ),
        requestFile(
          "https://qingdao714-1301174277.cos.ap-beijing.myqcloud.com/ar_model/xingkong.png"
        ),
        requestFile(
          "https://qingdao714-1301174277.cos.ap-beijing.myqcloud.com/ar_model/red_shell.glb"
        ),
        requestFile(
          "https://qingdao714-1301174277.cos.ap-beijing.myqcloud.com/ar_model/purple_shell.glb"
        )
      ]);
    }


  },

  // 页面关闭
  onUnload() {
    console.log("页面关闭");
    clearInterval(this.interval)
    TWEEN.removeAll();
    if (this.slam) {
      this.slam.clear();
    }
  },

  // 模型加载完成方法
  async ready({
    detail: slam
  }) {
    try {

      const [rabbitArrayBuffer, envMapArrayBuffer, panoArrayBuffer, shellArrayBuffer, noshellArrayBuffer] = await this.downloadAsset;
      const [rabbitModel, envMap, panorama] = await Promise.all([
        slam.createGltfModel(rabbitArrayBuffer),
        slam.createEnvMapByHDR(envMapArrayBuffer),
        slam.createPanorama(panoArrayBuffer)
      ]);

      rabbitModel.useEnvMap(envMap);

      this.slam = slam


      if (this.data.type === "0") {
        console.log("加载贝壳");
        //  下贝壳雨 start
        let timeList = [5000, 4500, 7200, 7500, 7000, 6000]
        let modelX = -2
        for (let index = 1; index < 16; index++) {
          let shellModel
          let hellType
          if (index % 3 == 0) {
            shellModel = await slam.createGltfModel(noshellArrayBuffer)
            hellType = 1
          } else {
            shellModel = await slam.createGltfModel(shellArrayBuffer)
            hellType = 0
          }
          shellModel.useEnvMap(envMap);
          slam.add(shellModel, 0.8);
          shellModel.position.x = modelX;
          shellModel.visible = false;
          let X = modelX
          let Y = 5
          let Z = -5
          if (index > 4) {
            X = X - 5
            Y = Y + 2
            Z = -6
          }
          shellModel.position.z = -5;
          this.startAnimate(shellModel, X, Y, Z, X, -2, Z, timeList[Math.floor(Math.random() * timeList.length)], 1)
          this.setModelFaceToCamera(shellModel)
          modelX = modelX + 1
          shellModel.addEventListener("click", () => {
            console.log("点击" + index + "pppp" + hellType);
            if (hellType == 0) {
              this.setData({
                shellNumber: this.data.shellNumber + 1
              })
            }
          });
        }
        //  end
      }

      // 显示
      const animationNames = rabbitModel.getAnimationNames();
      this.setData({
        nameList: animationNames.map((name) => ({
          name,
          value: name
        })),
        name: 0,
      });

      console.log(animationNames);

      let parameter = this.data.parameter

      slam.add(rabbitModel, parameter[0]);

      slam.add(panorama, 900);
      panorama.visible = false

      let isV2 = slam.isSlamV2();
      console.log(isV2);

      // 开启slam平面追踪
      await slam.start();

      //判断是否是v2
      if (!isV2) {
        const {
          windowWidth,
          windowHeight
        } = wx.getSystemInfoSync();
        slam.standOnThePlane(
          rabbitModel,
          Math.round(windowWidth / 2),
          Math.round(windowHeight / 2),
          true
        );
        slam.standOnThePlane(
          panorama,
          Math.round(windowWidth / 2),
          Math.round(windowHeight / 2),
          true,
        );
      }
      this.rabbitModel = rabbitModel
      this.play()
      this.setData({
        shellType: true,
        textBoxType: true,
      })
      setTimeout(() => {
        panorama.visible = true
      }, 2500);
      this.startAnimate(rabbitModel, parameter[1], parameter[2], parameter[3], parameter[4], parameter[5], parameter[6], parameter[7], parameter[8])

      wx.hideLoading();
    } catch (e) {
      wx.hideLoading();
      errorHandler(e);
    }
  },

  // 获取动画名称
  getAnimationName() {
    return this.data.nameList[this.data.name].value;
  },

  // 让模型放在相机正前方水平位置
  setModelFaceToCamera(model) {
    const camera = this.slam.defaultCamera;
    const direction = camera.getWorldDirection().clone();
    const cameraPosition = camera.position.clone();
    model.position.copy(direction.add(cameraPosition));
    // 朝向相机
    model.lookAt(cameraPosition.x, cameraPosition.y, cameraPosition.z);
  },

  // 开始执行动画
  play() {
    let animationName = this.getAnimationName();
    console.log(animationName);
    if (this.currentAnimationName !== animationName) {
      this.rabbitModel.stopAnimation(this.currentAnimationName);
      this.currentAnimationName = animationName;
    }
    animationName = "FLY"
    this.rabbitModel.playAnimation({
      animationName,
      loop: true,
      animationSpeed: 1
    });
  },

  // 模型做旋转运动
  exercise() {
    this.modelPos = new Vector3(0, 30, 0);
    this.modelForward = new Vector3(0, 0, 1);
    this.angle = 4.5;
    this.radius = this.data.parameter[9];

    this.interval = setInterval(() => {
      // 计算当前位置
      this.modelPos.x = this.radius * Math.cos(this.angle);
      this.modelPos.y = 5;
      this.modelPos.z = this.radius * Math.sin(this.angle);

      // 计算切线方向
      const tangent = new Vector3();
      tangent.x = -Math.sin(this.angle);
      tangent.y = 0;
      tangent.z = Math.cos(this.angle);

      tangent.normalize();

      // 构造旋转四元数
      const qRotation = new Quaternion();
      qRotation.setFromUnitVectors(this.modelForward, tangent);

      // 设置模型的位置与旋转
      this.rabbitModel.position.copy(this.modelPos);
      this.rabbitModel.quaternion.copy(qRotation);
      // 更新角度
      this.angle += 0.002;
    }, 10)
  },

  // 设置运动轨迹（threejs）
  startAnimate(model, startX, startY, startZ, endX, endY, endZ, duration, circulation) {
    model.onBeforeRender = () => {
      TWEEN.update();
    };
    const startTransform = {
      px: startX,
      py: startY,
      pz: startZ,
    };
    const endTransform = {
      px: endX,
      py: endY,
      pz: endZ,
    };
    if (circulation == 1) {
      new TWEEN.Tween(startTransform)
        .to(endTransform, duration)
        .onUpdate(({
          px,
          py,
          pz
        }) => {
          model.position.set(px, py, pz);
        })
        .repeat(Infinity)
        .start();
    } else {
      new TWEEN.Tween(startTransform)
        .to(endTransform, duration)
        .onUpdate(({
          px,
          py,
          pz
        }) => {
          model.position.set(px, py, pz);
        })
        .start();
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

  // 错误
  error({
    detail
  }) {
    console.log(detail);
    wx.hideLoading();
    // 判定是否camera权限问题，是则向用户申请权限。
    if (detail?.isCameraAuthDenied) {
      showAuthModal(this);
    } else {
      errorHandler(detail);
    }
  },
});