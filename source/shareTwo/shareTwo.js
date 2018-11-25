/*  share 页面分享  */

var window_width;
var window_height;
var avatar_width;
var avatar_url;
var nickname;
/* 预定义 绘图颜色 */
const BLACK = "#000000";
const WHITE = "#FFFFFF";
const THEME_COLOR = "#FF555C";
const GRAY_COLOR = "#333333";
const TINT_COLOR = "#747474";
/* 预定义 绘图比例 */
const TEMP = 0.01;
/* 图片长宽比 */
const SCALE = 1.78;
/* 背景图高度 */
const BG_SCALE = 0.5;
/* 头像, 宽比例 */
const AVATAR_WIDTH_SCALE = 0.368;
const AVATAR_HEIGHT_SCALE = 0.117;
/* 头像白色圆型背景 */
const AVATAR_BG_WIDTH_SCALE = 0.38;
const AVATAR_STROKE_WIDTH = 4;
/* 昵称高度比 */
const NICKNAME_HEIGHT_SCALE = 0.34 + 5 * TEMP;
/* 第一行文字高度 */
const TOP_TEXT_SCALE = 0.515 + 3 * TEMP;
/* 分享内容 */
const CONTENT_SCALE = 0.585 + 3 * TEMP;
const CONTENT_SCALE2 = 0.620 + 3 * TEMP;
/* QRCODE直径 */
const QRCODE_WIDTH_SCALE = 0.341;
/* QRCODE高度 */
const QRCODE_HEIGHT_SCALE = 0.69;
/* 文字高度 */
const TEXT_SCALE = 0.91 + TEMP * 2;
/* 识别文字 */
const DECODE_SCALE = 0.935 + TEMP * 2;
/* 背景图 */
const QRCODE_PATH = "/image/bg.png";

/* component自定义组件 */
Component({
  /* 组件属性列表 */
  properties: {
    show_share_model: {
      type: Boolean,
      value: false,
      observer: 'change_property'
    }
  },

  /**
   * 页面的初始数据
   */
  data: {
    "canvas_show": {
      "share_show": false,
    },
    "canvas_data": {
      "canvas_height": 0,
      "share_image_width": 0,
      "share_image_height": 0,
      "share_image_path": null,
      "avatar_path": null,
      "qrcode_path": "/image/qrcode.jpg",
      "closs_share_X": "https://i.loli.net/2018/11/01/5bdaf28766acc.png",
      "content1": "☆☆☆☆",
      "content2": "☆☆☆☆",
      "content3": "☆☆☆☆☆☆",
      "content4": "小程序测试",
      "content5": "",
    },
    "canvas_accredit_data": {
      "nickname": "A I R",
      "avatar": "https://i.loli.net/2018/11/02/5bdbb8c3b8b5f.jpg",
    }
  },

  /**
   * 模块就绪函数
   * 获取屏幕可用高度赋值 canvas高, image高, image宽
   */
  ready: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        window_width = res.windowWidth;
        window_height = res.windowWidth * SCALE;
        that.setData({
          "canvas_data.canvas_height": window_height,
          "canvas_data.share_image_width": window_width * 0.7,
          "canvas_data.share_image_height": window_height * 0.7,
        })
        console.log("onLoad.success: true")
      },
    })
  },

  /* 组件方法列表 */
  methods: {
    /* 控件显示并且没有生成image时, 使用canvas生成图片 */
    change_property: function (newVal, oldVal) {
      console.log(newVal)
      if (newVal) {
        if (!this.data.canvas_data.share_image_path) {
          this.preview_image();
        } else {
          this.setData({
            "canvas_show.share_show": true,
          })
          console.log("change_property_else: true")
        }
      }
      console.log("change_property: true")
    },

    /* 
      点击生成预览图片事件
    */
    preview_image: function () {
      var that = this;
      if (that.data.canvas_data.share_image_path) {
        that.setData({
          // "canvas_show.share_show": true,
          show_share_model: true
        })
        console.log("preview_image: false");
      } else {
        that.show_loading();
        that.download_avatar();
        that.get_nickname();
        console.log("preview_image: true");
      }
    },

    /* 显示加载中 */
    show_loading: function () {
      wx.showLoading({
        title: '图片加载中',
        mask: true,
      })
      console.log("show_loading: true");
    },

    /* 隐藏加载中 */
    hide_loading: function () {
      wx.hideLoading();
      console.log("hide_loading: true");
    },

    /* 网络加载失败 */
    show_error_model: function (content) {
      this.hide_loading();
      if (!content) {
        content = "网络错误"
      }
      wx.showLoading({
        title: '生成失败',
        content: content,
        success: function () {
          setTimeout(function () {
            wx.hideLoading();
          }, 2000)
        }
      })
      this.setData({
        show_share_model: false,
      })
      console.log("show_error_model: true");
    },

    /*--------------- 获取用户头像信息 */
    download_avatar: function () {
      var avatar_url = wx.getStorageSync('avatarurl');
      if (avatar_url) {
        this.setData({
          "canvas_data.avatar_path": avatar_url,
        })
      } else {
        this.setData({
          "canvas_data.avatar_path": "/image/avatar.jpg",
        })
      }
      this.draw_image();
    },

    /* 获取用户昵称 */
    get_nickname: function () {
      var nickname = wx.getStorageSync('nickname');
      if (nickname) {
        this.setData({
          "canvas_accredit_data.nickname": nickname,
        })
      }
    },

    /* 绘制分享图片 */
    draw_image: function () {
      var that = this;
      const ctx = wx.createCanvasContext("canvas", this);
      /* 绘制初始背景图 */
      ctx.setFillStyle(WHITE);
      ctx.fillRect(0, 0, window_width, window_height);
      /* 绘制顶部背景图片 */
      ctx.drawImage(QRCODE_PATH, 0, 0, window_width, window_height * BG_SCALE);
      /* 头像白色环绕 */
      ctx.arc(window_width / 2, AVATAR_WIDTH_SCALE / 2 * window_width + AVATAR_HEIGHT_SCALE * window_height, (AVATAR_WIDTH_SCALE / 2) * window_width + AVATAR_STROKE_WIDTH, 0, 2 * Math.PI);
      ctx.setFillStyle(WHITE);
      ctx.fill();
      /* 绘制头像 */
      ctx.save();
      ctx.beginPath();
      ctx.arc(window_width / 2, AVATAR_WIDTH_SCALE / 2 * window_width + AVATAR_HEIGHT_SCALE * window_height, (AVATAR_WIDTH_SCALE / 2) * window_width, 0, 2 * Math.PI);
      ctx.setStrokeStyle(WHITE);
      ctx.stroke();
      ctx.clip();
      avatar_width = AVATAR_WIDTH_SCALE * window_width;
      ctx.drawImage(that.data.canvas_data.avatar_path, window_width * (0.5 - AVATAR_WIDTH_SCALE / 2), AVATAR_HEIGHT_SCALE * window_height, avatar_width, avatar_width);
      ctx.restore();
      /* 绘制内容2|3 */
      ctx.setFillStyle(GRAY_COLOR);
      ctx.setFontSize(18);
      ctx.setTextAlign("center");
      ctx.fillText(that.data.canvas_data.content2, window_width / 2, CONTENT_SCALE * window_height);
      ctx.setFillStyle(GRAY_COLOR);
      ctx.setFontSize(18);
      ctx.setTextAlign("center");
      ctx.fillText(that.data.canvas_data.content3, window_width / 2, CONTENT_SCALE2 * window_height);
      /* 绘制二维码 */
      ctx.drawImage(that.data.canvas_data.qrcode_path, window_width * (0.5 - QRCODE_WIDTH_SCALE / 2), QRCODE_HEIGHT_SCALE * window_height, QRCODE_WIDTH_SCALE * window_width, QRCODE_WIDTH_SCALE * window_width);
      /* 绘制内容5 */
      ctx.setFillStyle(TINT_COLOR);
      ctx.setFontSize(14);
      ctx.setTextAlign("center");
      ctx.fillText(that.data.canvas_data.content5, window_width / 2, DECODE_SCALE * window_height);
      /* 绘制昵称 */
      that.nickname_style(ctx, 'bold');
      ctx.setFillStyle(BLACK);
      ctx.setFontSize(20);
      ctx.setTextAlign('center');
      ctx.fillText(substringStr(that.data.canvas_accredit_data.nickname), window_width / 2, NICKNAME_HEIGHT_SCALE * window_height);
      /* 绘制内容1 */
      ctx.setFillStyle(THEME_COLOR);
      ctx.setFontSize(24);
      ctx.setTextAlign('center');
      ctx.fillText(that.data.canvas_data.content1, window_width / 2, TOP_TEXT_SCALE * window_height);
      /* 绘制内容4 */
      ctx.setFillStyle(TINT_COLOR);
      ctx.setFontSize(16);
      ctx.setTextAlign('center');
      ctx.fillText(that.data.canvas_data.content4, window_width / 2, TEXT_SCALE * window_height);
      /* 绘制至canvas */
      ctx.draw(false, function () {
        that.save_canvas_image();
        console.log("draw_image.draw: true")
      })

      console.log("draw_image: true");
    },

    /* 改变用户昵称样式 */
    nickname_style: function (ctx, font_weight) {
      if (wx.canIUse("canvasContext.font")) {
        ctx.font = 'normal ' + font_weight + ' ' + '14px' + ' sans-serif';
      }
      console.log("nickname_style: true");
    },

    /* canvas转换为image */
    save_canvas_image: function () {
      var that = this;
      wx.canvasToTempFilePath({
        canvasId: 'canvas',
        success: function (res) {
          that.setData({
            "canvas_data.share_image_path": res.tempFilePath,
            "canvas_show.share_show": true,
          })
          console.log("save_canvas_image.success: true");
        },
        complete: function () {
          that.hide_loading();
        }
      }, this)
    },

    /* 保存分享图片(请求权限) */
    share_image_save: function () {
      var that = this;
      /* 获取用户信息 */
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.writePhotosAlbum']) {
            that.save_image_tophotos_album();
          } else {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success(res) {
                that.save_image_tophotos_album();
              },
              fail() {
                wx.showModal({
                  title: '提示',
                  content: '您需要授权才能保存图片到相册',
                  success: function (res) {
                    if (res.confirm) {
                      wx.openSetting({
                        success: function (res) {
                          if (res.authSetting['scope.writePhotosAlbum']) {
                            that.save_image_tophotos_album();
                          } else {
                            console.log("share_image_save.success: false");
                          }
                        },
                        fail: function () {
                          console.log("share_image_save.fail: false");
                        }
                      })
                    }
                  }
                })
              }
            })
          }
        }
      })
      console.log("share_image_save: true");
    },

    /* 保存图片至用户相册 */
    save_image_tophotos_album: function () {
      var that = this;
      wx.saveImageToPhotosAlbum({
        filePath: that.data.canvas_data.share_image_path,
        success: function () {
          wx.showModal({
            title: '',
            content: '图片已保存到相册',
            showCancel: false,
          })
          that.hide_share();
          console.log("save_image_tophtos_album.success: true")
        }
      })
    },

    /* 点击×关闭分享图片 */
    closs_share_model: function () {
      this.hide_share();
      console.log("closs_share_model: true");
    },

    /* 点击蒙版处关闭分享图片 */
    hide_share: function () {
      this.setData({
        "canvas_show.share_show": false,
        show_share_model: false,
      })
      console.log("hide_share: true");
    },
  }
})

/* 处理用户昵称 */
function substringStr(target) {
  if (target && target.length > 12) {
    target = target.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
    if (!target) {
      return "匿名";
    } else {
      return target.slice(0, 12) + '...';
    }
  }
  return target;
}