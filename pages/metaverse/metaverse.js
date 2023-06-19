// pages/game1.js
Page({
  data: {
    //src:'https://comicomi.cloud:9937/queue/start.html'
    src:'http://192.168.41.2:8080/Desktop/static/queue/comi.html'
     //src:'http://192.168.41.2:8080/Desktop/%E5%89%8D%E7%AB%AF/testHtml.html',
  },


  onLoad(options) {},
  onReady() {
    // 在这里获得图片的地址
    // let imgUrl="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F4a7a677d-1fdd-47c6-863b-aa65c8fe209d%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1688536930&t=0e20629246c7b83222c17350bcd9e6dd"
    // let imgUrl="https://res.wx.qq.com/wxdoc/dist/assets/img/demo.ef5c5bef.jpg"

    // console.log(imgUrl,'这是url')

    // wx.downloadFile({
    //   url: 'https://www.comicomi.world/images/default/%E5%95%86%E5%8A%A1%20%E5%90%88%E4%BD%9C@2x.png',
    //   success: (res) => {
    //     wx.showShareImageMenu({
    //       path: res.tempFilePath
    //     })
    //     console.log('分享成功')
    //   },
    //   fail:(err)=>{
    //     console.log("分享失败：", err);
    //     wx.showToast({
    //         title: "分享失败",
    //         duration: 2000
    //     })
    //   }


    // })


  
  },


 
  handleGetMessage: function(e) {
    console.log("DDDDDDDDDD")
    console.log(e.detail.data)
  },
  


  /*用户点击右上角分享*/
  onShareAppMessage() {},

})