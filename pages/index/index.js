//index.js
//获取应用实例

Page({
  data:{
     hasLocation:false,
     location:"",
     hasAddress:false,
     address:"",
     weather:"",
     temperature:""
  },
  formatLocation: function (x, y) {
    var str1 = x.toString();
    var str2 = y.toString();
    return str1 + "," + str2
  },
  onLoad : function(){
    //初始化部分
    var that = this;
    //获取到本地的地理位置经纬度放在location中
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          hasLocation: true,
          location: that.formatLocation(res.latitude,res.longitude)
        });
        console.log("this.data.location: " + that.data.location);
        //调用腾讯地图服务，发送地理位置解析的请求，将location中的经纬度字符串解析成城市地址，放在了address中
        wx.request({
          url: "https://apis.map.qq.com/ws/geocoder/v1",
          data: {
            key: "KPMBZ-B5TW3-7FR3R-YIYJT-UMWOQ-BRFXG",
            location: that.data.location
          },
          success: function (result) {
            console.log(result);
            that.setData({
              hasAddress: true,
              address: result.data.result.address.substring(3,5)
            });
            //获取到当前城市“苏州”
            console.log(that.data.address);
            wx.request({
              url: "https://api.seniverse.com/v3/weather/now.json",
              data: {
                key: "b7azrpqe6zvki5cc",
                location: that.data.address
              },
              success: function (result) {
                console.log(result);
                that.setData({
                  hasWeaTemp: true,
                  weather: result.data.results[0].now.text,
                  temperature: result.data.results[0].now.temperature
                });
                console.log(that.data.weather + " " + that.data.temperature);
              },
              fail: function ({ errMsg }) {
                console.log(errMsg);
              }
            });
          },
          fail: function ({ errMsg }) {
            console.log(errMsg);
          }
        });
      },
      fail: function ({ errMsg }){
        console.log(errMsg);
      }
    });  
  },
  reloadData:function(){
    var that = this;
    var app = getApp();
    if (app.globalData.currentCity!=""){
      this.setData({ address: app.globalData.currentCity});
      wx.request({
        url: "https://api.seniverse.com/v3/weather/now.json",
        data: {
          key: "b7azrpqe6zvki5cc",
          location: that.data.address
        },
        success: function (result) {
          console.log(result);
          that.setData({
            hasWeaTemp: true,
            weather: result.data.results[0].now.text,
            temperature: result.data.results[0].now.temperature
          });
          console.log(that.data.weather + " " + that.data.temperature);
        },
        fail: function ({ errMsg }) {
          console.log(errMsg);
        }
      });
    }
  },
  onShow: function(option){
    this.reloadData();
  }
})
