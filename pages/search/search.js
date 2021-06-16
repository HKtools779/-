// pages/search/search.js
import request from "../../utils/request";

let inCool = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeHolderContent:'',
    hotList: [] ,
    searchContent:'',
    searchList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getInitData()

  },

  //获取初始化的数据
  async getInitData(){
    let placeHolderData = await request('/search/default')
    let hotListData = await request('/search/hot/detail')
    this.setData({
      placeHolderContent: placeHolderData.data.showKeyword,
      hotList: hotListData.data
    })
  },


  //表单内容改变回调
  handleInputChange(e){

    this.setData({
      searchContent:e.detail.value.trim()
    })
    //节流

    if(!this.data.searchContent){
      this.setData({
        searchList: []
      })
    }

    if(!inCool){ //没在冷却
    //  发请求
      if(this.data.searchContent){
        this.getSearchListData()
        inCool = true
        setTimeout(()=>{
          inCool = false
        },300)
      }
    }
  },


  async getSearchListData(){
    let searchListData = await request('/search',{keywords: this.data.searchContent, limit:10})
    if(searchListData.code === 200){
      this.setData({
        searchList:searchListData.result.songs
      })
    }
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
