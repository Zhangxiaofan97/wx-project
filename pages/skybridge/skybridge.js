// pages/skybridge/skybridge.js

Page({

  /**
   * Page initial data
   */
  data: {
    chapterId : 0,
    chapterItem : null,
    userInfo : {},
    imageBaseURL : "https://qingdao714-1301174277.cos.ap-beijing.myqcloud.com/bridge_ui/",
    reqURL : "https://comicomi.cloud/api/mapping/bridge",
    chapterDatas : [
      {
        id : 2,
        name : "冲浪宣言",
        declare : "您的冲浪宣言将在一小时内亮相台东天桥！",
        items : [
          {
            id : 1,
            name : "我在青岛喝酒没空想你"
          },
          {
            id : 2,
            name : "干杯CHEERS青岛！"
          },
          {
            id : 3,
            name : "全宇宙最能喝的驾到，通通闪开！"
          },
          {
            id : 4,
            name : "我见过最美的花，是啤酒花"
          },
          {
            id : 5,
            name : "青岛啤酒YYDS"
          },
          {
            id : 6,
            name : "哈啤酒吃嘎啦"
          }
        ]
      },
      {
        id : 3,
        name : "新潮岛民",
        declare : "您的新岛民形象将在一小时内登陆台东天桥！",
        items : [
          {
            id : 1,
            name : "北京"
          },
          {
            id : 2,
            name : "天津"
          },
          {
            id : 3,
            name : "上海"
          },
          {
            id : 4,
            name : "重庆"
          },
          {
            id : 5,
            name : "香港"
          },
          {
            id : 6,
            name : "澳门"
          },
          {
            id : 7,
            name : "内蒙古"
          },
          {
            id : 8,
            name : "广西"
          },
          {
            id : 9,
            name : "西藏"
          },
          {
            id : 10,
            name : "宁夏"
          },
          {
            id : 11,
            name : "新疆"
          },
          {
            id : 12,
            name : "河北"
          },
          {
            id : 13,
            name : "山西"
          },
          {
            id : 14,
            name : "辽宁"
          },
          {
            id : 15,
            name : "吉林"
          },
          {
            id : 16,
            name : "黑龙江"
          },
          {
            id : 17,
            name : "江苏"
          },
          {
            id : 18,
            name : "浙江"
          },
          {
            id : 19,
            name : "安徽"
          },
          {
            id : 20,
            name : "福建"
          },
          {
            id : 21,
            name : "江西"
          },
          {
            id : 22,
            name : "山东"
          },
          {
            id : 23,
            name : "河南"
          },
          {
            id : 24,
            name : "湖北"
          },
          {
            id : 25,
            name : "湖南"
          },
          {
            id : 26,
            name : "广东"
          },
          {
            id : 27,
            name : "海南"
          },
          {
            id : 28,
            name : "四川"
          },
          {
            id : 29,
            name : "贵州"
          },
          {
            id : 30,
            name : "云南"
          },
          {
            id : 31,
            name : "山西"
          },
          {
            id : 32,
            name : "甘肃"
          },
          {
            id : 33,
            name : "青海"
          },
          {
            id : 34,
            name : "台湾"
          },
        ]
      },
      {
        id : 4,
        name : "召唤潮兽",
        declare : "您召唤的潮兽将在一小时内闪现台东天桥！",
        items : [
          {
            id : 1,
            name : "巨鲸兽"
          },
          {
            id : 2,
            name : "飞鱼仙"
          },
          {
            id : 3,
            name : "龟神"
          },
          {
            id : 4,
            name : "巨鲨神"
          },
          {
            id : 5,
            name : "星神"
          },
          {
            id : 6,
            name : "海马神兽"
          },
          {
            id : 7,
            name : "海豹灵兽"
          },
          {
            id : 8,
            name : "章鱼仙兽"
          },
          {
            id : 9,
            name : "水母仙兽"
          },
          {
            id : 10,
            name : "海豚灵"
          },
          {
            id : 11,
            name : "小丑鱼仙"
          },
          {
            id : 12,
            name : "鳐神"
          }
        ]
      },
      {
        id : 5,
        name : "心愿烟花",
        declare : "您的心愿烟花将在一小时内绽放台东天桥！",
        items : [
          {
            id : 1,
            name : "祝我暴富"
          },
          {
            id : 2,
            name : "爱笑的人运气不会太差"
          },
          {
            id : 3,
            name : "你配得上一切美好"
          },
          {
            id : 4,
            name : "我爱青岛"
          }
        ]
      }
    ]
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    let that = this;
    this.setData({
      chapterId : 0
    });
    let comiComiUser=wx.getStorageSync("comiComiUser")
    console.log(comiComiUser);
    if (comiComiUser) {
      that.data.userInfo = comiComiUser;
    }
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  },

  onChapterChoose(e) {
    this.setData({
      chapterId : e.currentTarget.dataset.id,
      chapterItem : this.data.chapterDatas[e.currentTarget.dataset.index]
    })
  },

  onItemChoose(e) {
    console.log(e.currentTarget.dataset.id + " " + e.currentTarget.dataset.index);
    var that = this;
    wx.request({
      url: this.data.reqURL,
      data:{
        telephone : this.data.userInfo.telephone,
        UserName : this.data.userInfo.name,
        chapterId : this.data.chapterId,
        chapterName : this.data.chapterItem.name,
        comment : this.data.chapterItem.items[e.currentTarget.dataset.index].name
      },
      method:'POST',
      header: {
        'content-type': 'application/json'
      },
      success:(res)=>{
        if (res.data.returnCode == 0) {
          wx.showModal({
            title: '发送成功',
            content: that.data.chapterItem.declare,
            showCancel : false,
            complete: (res) => {
              if (res.cancel) {
                
              }
          
              if (res.confirm) {
                
              }
              that.setData({
                chapterId : 0,
                chapterItem : null
              });
            }
          });
        } else {
           wx.showToast({
             title: res.data.message,
             duration : 2000,
             icon : "error",
             mask : true
           })
        }
        console.log(res.data.returnCode, res,"成功了，这是上传成功的回调函数")
      },
      fail:(res)=>{
        console.log("失败了")
      }
    })
  }
})