import PubSub from 'pubsub-js'
import moment from "moment";

import request from "../../utils/request";

const appInstance = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, //是否播放
    song: {}, //歌曲
    musicId: '',
    currentTime:'00.00',
    durationTime:'00.00',
    currentWidth: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let musicId = options.musicId
    this.setData({
      musicId
    })
    //获取音乐详情函数
    this.getMusicInfo(musicId)

    //判断当前页面是否播放
    if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId){
    //  修改当前也变
      this.setData({
        isPlay: true
      })
    }

    // 创建并监听音频控制器
    this.backgroundAudioManager = wx.getBackgroundAudioManager()
    this.backgroundAudioManager.onPlay(()=>{
      this.changePlayState(true)
      appInstance.globalData.musicId = musicId

    })
    this.backgroundAudioManager.onPause(()=>{
      this.changePlayState(false)

    })
    this.backgroundAudioManager.onStop(()=>{
      this.changePlayState(false)

    })
    //音乐播放结束
    this.backgroundAudioManager.onended(()=>{
    //  切换下一首音乐
      PubSub.publish('switchType','next')
    //  还原进度条长度
      this.setData({
        currentTime:'00.00',
        currentWidth: 0,
      })
    //
    })

    this.backgroundAudioManager.onTimeUpdate(()=>{
      let currentTime = moment(this.backgroundAudioManager.currentTime*1000).format('mm:ss')
      let currentWidth = (this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration)*450
      this.setData({
        currentTime,
        currentWidth
      })
    })
  },

  changePlayState(isPlay){
    this.setData({
      isPlay
    })
    appInstance.globalData.isMusicPlay = isPlay
  },

  //获取音乐详情函数
  async getMusicInfo(musicId){
    let songData = await request('/song/detail',{ids: musicId})

    let durationTime = moment(songData.songs[0].dt).format('mm:ss')
    this.setData({
      song: songData.songs[0],
      musicId,
      durationTime
    })

  //  动态修改窗口标题
    wx.setNavigationBarTitle({
      title: this.data.song.name
    })
  },

  //处理播放
  handleMusic(){
    let isPlay =!this.data.isPlay
    // this.setData({
    //   isPlay
    // })

    let {musicId} = this.data
    this.musicControl(isPlay, musicId)
  },

  //控制音乐播放，暂停功能函数
  async musicControl(isPlay,musicId){

    if(isPlay){

      let musicLinkData = await request('/song/url',{id: musicId})

      this.backgroundAudioManager.src = musicLinkData.data[0].url
      this.backgroundAudioManager.title = this.data.song.name
    }else{
      this.backgroundAudioManager.pause()
    }
  },

  //点击切歌曲
  handleSwitch(e){
    let type = e.target.id
    //关闭当前音乐
    this.backgroundAudioManager.pause()
    //订阅来自消息
    PubSub.subscribe('musicId',(msg,musicId)=>{
      this.getMusicInfo(musicId)
      this.musicControl(true,musicId)
      PubSub.unsubscribe('musicId')
    })
    PubSub.publish('switchType',type)

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
