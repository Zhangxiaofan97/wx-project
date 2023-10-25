const envList = [];//全局变量
const channel = 'chenhaihudong';
const minipage = 'metaverse';//定义小程序中路径，用于返回小程序,根据客户实际路由修改
const pagehost = 'http://192.168.41.2:8080/Desktop/testH5/H5%E6%BA%90%E7%A0%81/miniprogram_chenhai.html';//H5地址
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId: '',
    webviewurl:"",
    deviceid:"",
    uuid:'',
    gameid:"",
    corpkey:"",
    channel:"",
    ak:"",
    ts:"",
    usersign:"",
    sign:"",
    transdata:"",

    // src:'http://192.168.41.2:8080/Desktop/static/queue/comi.html'
    src:'http://192.168.41.2:8080/Desktop/testH5/H5%E6%BA%90%E7%A0%81/miniprogram_chenhai.html'
  },

  getMessage(msg){
    console.log("get message");
    console.log(msg);

    envList.deviceid = msg.detail.data[0].deviceid;
    envList.uuid = msg.detail.data[0].uuid;
    envList.pkgname = msg.detail.data[0].pkgname;
    envList.gameid = msg.detail.data[0].gameid;
    envList.corpkey = msg.detail.data[0].corpkey;
    envList.channel = channel;
    envList.ak = msg.detail.data[0].ak;
    envList.sign = msg.detail.data[0].sign;
    envList.usersign = msg.detail.data[0].usersign;
    envList.ts = msg.detail.data[0].ts;
    envList.transdata = msg.detail.data[0].transdata;
    envList.stype = msg.detail.data[0].stype;

    if(envList.stype == 'pay'){//支付，已封装，无需修改
      var param = msg.detail.data[0].param;

      wx.requestPayment(
      {
        "timeStamp": param.timeStamp,
        "nonceStr": param.nonceStr,
        "package": param.package,
        "signType": param.signType,
        "paySign": param.sign,
        "success":function(res){
          wx.showToast({
            title: '支付成功',
          })
        },
        "fail":function(res){
          wx.showToast({
            title: '支付失败',
          })
        },
        "complete":function(res){
        }
      }
    )
    }
    if(envList.stype == 'upload'){//上传，客户可根据实际情况修改逻辑，上传完成按照消息格式重定向到游戏页面
      // wx.chooseImage({//处理上传逻辑
      //   success (res) {
      //     const tempFilePaths = res.tempFilePaths
      //     wx.uploadFile({
      //       url: 'https://49.233.100.29:9937/upload', //仅为示例，非真实的接口地址
      //       filePath: tempFilePaths[0],
      //       name: 'file',
      //       formData: {

      //         "uuid":"11111",
      //       },
      //       success (res){  
      //         //按照消息格式拼接数据，param中可透传客户自定义参数，客户修改
      //         var transdata = {"c":"100062","p":envList.pkgname,"t":new Date().getTime(),"d":{"action":"sdk_trans_msg", "code":1, "msg":"","param":{}}};
      //         //通过重定向传递参数到页面，无需修改
      //         wx.redirectTo({
      //           url: '../'+minipage+'/index?minipage='+minipage+'&pkgname='+envList.pkgname+'&gameid='+envList.gameid+'&oid='+envList.openId+'&corpkey='+envList.corpkey+'&channel='+channel+'&ak='+envList.ak+'&sign='+envList.sign+'&ts='+envList.ts+'&usersign='+envList.usersign+'&transdata='+JSON.stringify(transdata)+'&deviceid='+envList.deviceid+'&uuid='+envList.uuid
      //         });
      //       }
      //     })
      //   }
      // })
      
      console.log("这是上传")   // 这个打印不出来啊
      // 这里用一张在线图片测试
      let imgUrl="https://img1.baidu.com/it/u=1919509102,1927615551&fm=253&fmt=auto&app=120&f=JPEG?w=889&h=500"
      let imgUrl64=wx.getFileSystemManager().readFileSync(imgUrl, "base64")
      let sendData={
        "uuid":"11111",
        "result":imgUrl64          // 将图片转化为64位
      }
      wx.request({
        url: 'https://49.233.100.29:9937/upload',
        data:sendData,
        method:'POST',
        header: {
          'content-type': 'application/json'
        },
        success:(res)=>{
          console.log(res,"成功了，这是上传成功的回调函数")
        },
        fail:(res)=>{
          console.log("失败了")
        }
      })
    }
    if(envList.stype == 'share'){//分享，客户可根据实际情况修改逻辑，完成按照
      消息格式重定向到游戏页面
      //分享逻辑、
      
      //按照消息格式拼接数据，param中可透传客户自定义参数，客户修改
      // var transdata = {"c":"100062","p":envList.pkgname,"t":new Date().getTime(),"d":{"action":"sdk_trans_msg", "code":1, "msg":"","param":{}}};
      //通过重定向传递参数到页面，无需修改
      // wx.redirectTo({
      //   url: '../'+minipage+'/index?minipage='+minipage+'&pkgname='+envList.pkgname+'&gameid='+envList.gameid+'&oid='+envList.openId+'&corpkey='+envList.corpkey+'&channel='+channel+'&ak='+envList.ak+'&sign='+envList.sign+'&ts='+envList.ts+'&usersign='+envList.usersign+'&transdata='+JSON.stringify(transdata)+'&deviceid='+envList.deviceid+'&uuid='+envList.uuid
      // });
      
    }
  },

  onLoad(options) { 
    console.log("onload");
    console.log(options);

    envList.deviceid = options.deviceid == undefined ? "" : options.deviceid;
    envList.uuid = options.uuid == undefined ? "" : options.uuid;
    envList.pkgname = options.pkgname == undefined ? "" : options.pkgname;
    envList.gameid = options.gameid == undefined ? "" : options.gameid;
    envList.corpkey = options.corpkey == undefined ? "" : options.corpkey;
    envList.channel = channel;
    envList.ak = options.ak == undefined ? "" : options.ak;
    envList.sign = options.sign == undefined ? "" : options.sign;
    envList.usersign = options.usersign == undefined ? "" : options.usersign;
    envList.ts = options.ts == undefined ? "" : options.ts;
    envList.transdata = options.transdata == undefined ? "" : options.transdata;

    this.setData({webviewurl:pagehost+'?minipage='+minipage+'&pkgname='+envList.pkgname+'&gameid='+envList.gameid+'&oid=&corpkey='+envList.corpkey+'&channel='+channel+'&ak='+envList.ak+'&sign='+envList.sign+'&ts='+envList.ts+'&usersign='+envList.usersign+'&transdata='+envList.transdata+'&deviceid='+envList.deviceid+'&uuid='+envList.uuid});
    //获取code和openid
    // var that = this;
    // wx.login({
    //   success (res) {
    //     var code = res.code;
    //     //获取openid
    //     that.myOpenID(code);
    //   }
    // })
  },
  // myOpenID(code){
  //   var that = this;
  //   wx.request({
  //       //获取openid后台api
  //     'url':"https://xxx.xx.com/miniprogram_openid.php?code="+code,
  //     data:{
  //       //code:code
  //     },
  //     success:function(resp){
  //       var openid = JSON.parse(resp.data)['openid'];

  //       console.log(openid);
  //       envList.openid = openid;
        
  //       that.setData({webviewurl:pagehost+'?minipage='+minipage+'&pkgname='+envList.pkgname+'&gameid='+envList.gameid+'&oid='+openid+'&corpkey='+envList.corpkey+'&channel='+channel+'&ak='+envList.ak+'&sign='+envList.sign+'&ts='+envList.ts+'&usersign='+envList.usersign+'&transdata='+envList.transdata+'&deviceid='+envList.deviceid+'&uuid='+envList.uuid});
  //     }
  //   })
  // }
});
