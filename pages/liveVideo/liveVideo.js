// pages/liveVideo/liveVideo.js
Page({

  data: {
      // 这是直播用到的参数
      finderUserName:'',      // 视频号 id
      feedId:'',              // 直播 feedId，通过 getChannelsLiveInfo 接口获取
  },

  onLoad(options) {},
  
  // 跳转直播,测试用的
  jumpToLive(){
    // 先根据wx.getChannelsLiveInfo拿到信息
    wx.getChannelsLiveInfo({
      finderUserName: 'sphQiFl5lxFCQfk',
      success: res => {
        console.log(res,'这是直播的res')

        if(res.status==2){
           // 再根据wx.openChannelsActivity跳转链接
          wx.openChannelsActivity({
            feedId: res.feedId,//视频id
            finderUserName: 'sphQiFl5lxFCQfk',//视频号id
            fail(error){
                console.log(error)
            }
          })
        }

      
      },
      fail: res => {
          console.error(res);
      }
    });

  }

})