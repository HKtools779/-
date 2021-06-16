// pages/video/video.js
import request from "../../utils/request";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList:[],  //导航标签数据
    navId: '', //导航标识
    videoList: [], // 视频列表数据
    videoId: '', //视频id
    isTriggered: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGroupListData();
  },

  //获取导航数据
  async getVideoGroupListData(format, data){
    let videoGroupListData = await request('/video/group/list')
    this.setData({
      videoGroupList: videoGroupListData.data.slice(0, 14),
      navId: videoGroupListData.data[0].id
    }, data)
    //获取视频列表数据
    await this.getVideoList(this.data.navId)
  },

  //获取视频列表数据
  async getVideoList(navId){
    await request('/video/group',{id:navId}).then((res)=>{  // console.log('视频数据表',res)
      let index = 0
      let videoList = res.datas.map(item =>{
        item.id = index++
        return item
      })
      this.setData({
        videoList,
        isTriggered:false,
      })
    })
  },

  //点击切换导航的回调
  changeNav(event){
    if(event.target.id){
      //如果点击的是子元素，包含id属性的 navContent
      let navId = event.target.id
      this.setData({
        navId:navId*1,
        videoList:[]
      })

    //  显式正在加载
      wx.showLoading({
        title:'正在加载'
      })
    //  动态获取当前导航对应的视频数据
      this.getVideoList(this.data.navId).finally(()=>{
        wx.hideLoading()
      })
    }
  },

  //点击播放的回调
  handlePlay(e){
    let vid = e.currentTarget.id
    // this.vid!==vid && this.videoContext && this.videoContext.stop()
    // this.vid = vid
    //  更新data中videoId的状态
    this.setData({
      videoId:vid
    })
    this.videoContext = wx.createVideoContext(vid)
    this.videoContext.play()
  },

  //下拉刷新
  handleRefresher(){
    console.log('sdfd')
    this.getVideoList(this.data.navId)
  },

  toSearch(){
    wx.navigateTo({
      url:"/pages/search/search",
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
    return{
      title:'kankan',
      page:'/pages/video/video',
      imageUrl: '/static/images/mao.jpg'
    }
  }
})
