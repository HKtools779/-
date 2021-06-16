// pages/recommendSong/recommendSong.js

import PubSub from 'pubsub-js'

import request from "../../utils/request";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recommendList:[],
    index:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function (options) {
  //  是否登录
    let userInfo = wx.getStorageSync('userInfo')
    if(!userInfo){
      wx.showToast({
        title: '请先登录',
        icon:'none',
        success:()=>{
        //  跳转到登录
          wx.reLaunch({
            url:  "/pages/login/login"
          })
        }
      })
    }
  //  获取每日推荐数据
    this.getRecommendList()

  //  订阅来自songDetail的消息
    PubSub.subscribe('switchType',(msg,type)=>{
      let {recommendList,index} = this.data
      if(type === 'pre'){
        ( index===0 ) && (index=recommendList.length)
        index--
      }else {
        ( index===recommendList.length-1 ) && (index=-1)
        index++
      }
      //更新下标
      this.setData({
        index
      })

      let musicId = recommendList[index].id
    //  将id回传
      PubSub.publish('musicId', musicId)

    })


  },

  //获取用户推荐歌曲
  async getRecommendList(){
    let recommendListData = await request('/recommend/songs')
    this.setData({
      recommendList: recommendListData.recommend
    })
  },

  //跳转至播放页面
  toSongDetail(event){
    let {song, index} = event.target.dataset;
    this.setData({
      index
    })

    //路由跳转传参数
    wx.navigateTo({
      url:'/pages/songDetail/songDetail?musicId=' + song.id
    })
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
