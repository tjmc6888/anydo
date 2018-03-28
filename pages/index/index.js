//index.js
const yf = require('../../utils/yf.js')
//获取应用实例
const app = getApp()

Page({
  data: {
    modalFlag:false,
    task:"",
    dateType:0,
    inputFocus:true,
    typeList: [],
    tasks: [
      {
        task: [
          { content: '111', type: '个人事务', time: '2017-07-02' },
          { content: '222', type: '个人事务', time: '19:58' },
          { content: '333', type: '个人事务', time: '19:58' },
          { content: '444', type: '个人事务', time: '19:58' }
        ],
        cancelTask: [
          { content: '444', type: '个人事务', time: '19:58' }
        ],
        type: 0,
        label: '今日',
        detailFlag: false
      },
      {
        task: [
          { content: '123', type: '个人事务', time: '19:58' },
          { content: '222', type: '个人事务', time: '19:58' },
          { content: '333', type: '个人事务', time: '19:58' },
          { content: '444', type: '个人事务', time: '19:58' }
        ],
        type: 1,
        label: '明日',
        detailFlag: false
      },
      {
        task: [
          { content: '123', type: '个人事务', time: '19:58' },
          { content: '222', type: '个人事务', time: '19:58' },
          { content: '333', type: '个人事务', time: '19:58' },
          { content: '444', type: '个人事务', time: '19:58' }
        ],
        type: 2,
        label: '已过期',
        detailFlag: false
      }
    ]
  },
  onLoad: function (options) {
    console.log('inittype')
    this.initType() //初始化任务类型
  },
  //事件处理函数
  showModalHandle: function(event) {
    this.showModal()
  },
  hideModalHandle: function () {
    this.setData({
      modalFlag: false,
      dateType: 0,
      task: ''
    })
  },
  chooseTypeHandle: function() {
    let self = this
    console.log('chooseTypeHandle', self.data.typeList)
    wx.showActionSheet({
      itemList: self.data.typeList,
      success: function (res) {
        console.log(res.tapIndex)
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  chooseDateHandle: function() {
    wx.showActionSheet({
      itemList: ['推迟一天', '推迟两天', '推迟一周'],
      success: function (res) {
        console.log(res.tapIndex)
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  doneTaskHandle: function() {
    wx.showModal({
      title: '提示',
      content: '确认该项任务已完成？',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  removeTaskHandle: function() {
    console.log('remove')
  },
  deleteTaskHandle: function() {
    console.log('delete')
  },
  revertTaskHandle: function() {
    console.log('revert')
  },
  //初始化任务类型
  initType: function() {
    console.log('inittypes')
    yf.request({
      url: '/v1/types',
      method: 'GET',
      success: (data)=>{
        console.log('data', data.data)
        this.setData({
          typeList: data.data
        })
      }
    })
  },
  showModal: function (dateType) {
    this.setData({
      modalFlag: true,
      dateType: dateType || 0
    })
  },
  addHandle: function(event) {
    this.showModal(event.target.dataset.type)
  },
  addTag: function(event) {
    let tag = event.currentTarget.dataset.tag;
    if (tag) {
      this.setData({
        task: tag + " ",
        inputFocus: true
      })
    }
  },
  //任务编辑
  editTaskHandle: function (event){
    let content = event.currentTarget.dataset.content;
    this.setData({
      task: content
    })
    this.showModal()
  },
  //点击时间分类
  toggleDate: function(event) {
    let type = event.currentTarget.dataset.type || 0
    let key = `tasks[${type}].detailFlag`
    this.setData({
      [key]: !this.data.tasks[type].detailFlag
    })
  },
  //点击任务详情
  toggleTask: function(event) {
    let index = event.currentTarget.dataset.index || 0
    let type = event.currentTarget.dataset.type || 0
    console.log(index, type)
    let key = `tasks[${type}].task`
    this.data.tasks[type].task.forEach((item, i)=>{
      if (i === index) {
        item.detailFlag = !item.detailFlag;
      } else {
        item.detailFlag = false;
      }  
    })
    this.setData({
      [key]: this.data.tasks[type].task
    })
    
  },
  saveTaskHandle: function() {
    this.saveTask(this.data.task, this.data.dateType)
    this.hideModalHandle();
  },
  taskChange: function(e) {
    let value = e.detail.value;
    this.setData({
      task: value
    });
  },
  saveTask: function(content, dateType) {
    wx.showLoading({
      title: '加载中',
    })
    yf.request({
      url: '/v1/task',
      method: 'POST',
      data:{
        dateType,
        content
      },
      success: data=>{
        console.log(data)
      },
      fail: data=>{
        wx.showToast({
          title: '保存失败',
          icon: 'none',
          duration: 2000
        })
      },
      complete: data=>{
        wx.hideLoading()
      }      

    })
  }
})
