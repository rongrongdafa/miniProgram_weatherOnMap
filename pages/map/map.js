//map.js

//导入loc.js中的全国省会城市的地理信息，转化成数组markers


// var markers_= convert(require("./loc.js"));

const markers = require('./loc.js')

Page({
  data:{
    markers: markers, 
    latitude: parseFloat(markers[0].lnglat.split(",")[1]),
    longitude: parseFloat(markers[0].lnglat.split(",")[0]),
  },
  convert: function (markers) {
    for (var i = 0; i < markers.length; i++) {
      let loc = markers[i].lnglat.split(",");
      markers[i].latitude = parseFloat(loc[1]);
      markers[i].longitude = parseFloat(loc[0]);
      markers[i].iconPath = "/images/icon.png";
      markers[i].width = 50;
      markers[i].height = 50;
      delete markers[i].lnglat;
    }
    return markers
  },

  onLoad:function(){
    var convMarkers = this.convert(this.data.markers);
    this.setData({ markers: convMarkers});
    console.log(this.data.markers);
  },

  //当用户点击了地图上的maker，则用该方法导航到天气详情页
  markertap:function(e){
    console.log(e);
    console.log(e.markerId);
    var app = getApp();
    //全局变量的当前的城市——>地图上marker的Id:e.makerId
    app.globalData.currentCity = this.data.markers[e.markerId].title;
    console.log(app.globalData.currentCity);
    wx.switchTab({
      url:"/pages/index/index"
    });
  }
})