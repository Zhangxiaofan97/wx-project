import * as echarts from "../../components/echarts/echarts.min.js";
var chart;
Page({
  data: {
    userInfo:null,
    menuTapCurrent:0,

    // 个人中心中的接口数据=我的潮力值
    medalImage:'',         // 勋章图片
    level:'0',            // 当前等级
    percent:'10',          // 超越了%的人
    tidalValue:'0',        // 潮力值
    integral:'0',          // 积分
    processPercent:'0',   // 进度条的百分比
    echartsData:[],        // echarts图表 

    // 个人中心中的接口数据=我的任务
    tidalPercent:'0',         // 每日潮力值的百分比
    tidalDayMaxValue:'200',   // 每日潮力值上线
    myTaskList:[]             // 任务列表

  },


  // 分享功能
  onShareAppMessage(){
    return{
      title:'潮之岛元宇宙',
      path:'/pages/index/index'
    }
  },

  
  onLoad(options) {
    // 检查缓存是否有登录信息
    let comiComiUser=wx.getStorageSync("comiComiUser")
    if(comiComiUser){
      this.getPersonData()
      this.getTask()
      //this.getChaoDaily()
    }else {
      wx.navigateTo({
        url: '../commonLogin/commonLogin',
      })
    }

    // 画图echarts图表
    this.setData({
      ec: {
        onInit: this.initChart
      }
    });

    // 从unity跳到这个页面会有参数
    console.log(options,'从unity跳到个人中心')

    // let deviceAndUuid={
    //   deviceid:options.deviceid,
    //   uuid:options.uuid
    // }
    // wx.setStorageSync('deviceAndUuid',deviceAndUuid)


  },
  onReady() {},

  // 切换选项卡
  menuTap:function(e){
    var current=e.currentTarget.dataset.current;//获取到绑定的数据
    //改变menuTapCurrent的值为当前选中的menu所绑定的数据
    this.setData({
     menuTapCurrent:current
    });

  },

  // echarts图表
  initChart: function(canvas, width, height, dpr) {
    const chart = echarts.init(canvas, null, {
      width: 130,
      height: 140,
      devicePixelRatio: dpr
    });
    canvas.setChart(chart);

    var option = {
      radar: [
        {
          indicator: [
            { text: '商业', max: 65 },
            { text: '社交', max: 75 },
            { text: '艺术', max: 132 },
            { text: '游戏', max: 36 }
          ],
          center: ['50%', '50%'],
          radius: 50
        },
      ],

      series:[
        {
          type: 'radar',
          tooltip: {
            trigger: 'item'
          },
          areaStyle: {},
          data: [
            {
              value: [20, 30, 85, 30],
              name: 'A Software'
            }
          ]
        },
      ]
    };
    chart.setOption(option);
    return chart;
  },


  // 获取我的潮力值
  getPersonData(){
    var that_=this 
    let comiComiUser=wx.getStorageSync("comiComiUser")
    let getPersonData={
      telephone:comiComiUser.telephone
    }

    wx.request({
      url: 'https://comicomi.cloud/api/user/getChaoValue',
      data: getPersonData,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success:function(res){
        console.log(res.data.data,'获取潮力值的res')
        // 将res数据赋值到我的潮力值中
        if(res.data.data.medal!=null){
          that_.setData({
            medalImage:res.data.data.medal
          })
        }else{
          that_.setData({
            medalImage:'https://qingdao714-1301174277.cos.ap-beijing.myqcloud.com/web/task/noMedal.png'
          })
        }


        that_.setData({
          tidalValue:res.data.data.chao,      // 赋值潮力值
          percent:Math.round((res.data.data.achieve*100))  //超越了多少人 
        })
        
        
      }


    })
  },

  // 获取任务
  getTask(){
    var that_=this
    let comiComiUser=wx.getStorageSync("comiComiUser")
    let getTaskData={
      telephone:comiComiUser.telephone
    }

    wx.request({
      url: 'https://comicomi.cloud/api/user/getTask',
      data: getTaskData,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success:function(res){
        //console.log(res,'用户的 task的res')
        that_.setData({
          myTaskList:res.data.data
        })
      }


    })


  },

  // 每日获取潮力值
   getChaoDaily(){
    var that_=this 
    let comiComiUser=wx.getStorageSync("comiComiUser")
    let getPersonData={
      telephone:comiComiUser.telephone
    }

    wx.request({
      url: 'https://comicomi.cloud/api/user/getChaoDaily',
      data: getPersonData,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success:function(res){
        //console.log(res,'每日潮力值的res')
        if(res.data.data){
          that_.setData({
            tidalPercent: Math.round((res.data.data/308)*100),
            tidalDayMaxValue:res.data.data
           });
        }else{
          that_.setData({
            tidalPercent:'0',
            tidalDayMaxValue:'0'
           });
        }
      }


    })
   },


  // 跳转到其他页面
  goToOtherPage(e){
    console.log(e.target.id)
    // 0-商城 1-云游戏 2-小游戏
    // if(e.target.id==0){
    //   wx.navigateTo({
    //     url:'../shoppingMall/shoppingMall' 
    //   })
    // }else if(e.target.id==1){
    //   wx.navigateBack({
    //     delta:1 
    //   })
    // }else if(e.target.id==2){
    //   console.log("需要跳转到小游戏页面")
    // }
    

  }




})