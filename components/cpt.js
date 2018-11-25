// components/cpt.js
var window_width;
var window_height;
var rand = 0;
var avatar_width;
var avatar_url;
var nickname;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    share_style: {
      type: Number,
      value: null,
    },
    qrcode: {
      type: String,
      value: "/image/qrcode.jpg",
    },
    bgimage: {
      type: Array,
      value: ["/image/bg_0.png",
        "/image/bg_1.png",
        "/image/bg_3.png",
        "/image/bg_4.png",
        "/image/bg_6.png",
      ],
    },
    bgimage_two: {
      type: String,
      value: "/image/bg_0.png"
    },
    avatar: {
      type: String,
      value: '/image/avatar.jpg',
    },
    nickname: {
      type: String,
      value: 'A I R',
    },
    left_1: {
      type: String,
      value: "自强不息",
    },
    left_2: {
      type: String,
      value: "谦卑若愚, 好学若饥.",
    },
    left_3: {
      type: String,
      value: "☆☆☆☆",
    },
    left_4: {
      type: String,
      value: "☆☆☆☆",
    },
    left_5: {
      type: String,
      value: "☆☆☆☆☆",
    },
    right_1: {
      type: String,
      value: "长按二维码识别关注",
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    "canvas_data": {
      "window_width": null,
      "window_height": null,
      "canvas_width": null,
      "canvas_height": null,
      "image_width": null,
      "image_height": null,
      "share_show": false,
      "closs_share_X": "https://i.loli.net/2018/11/01/5bdaf28766acc.png",
    },
    "canvas_path": {
      "default": '',
      "image": null,
    }
  },

  /* 周期 */
  ready: function() {
    /* share_one */
    if (this.data.share_style == 1) {
      var that = this;
      wx.getSystemInfo({
        success: function(res) {
          if (res.windowWidth * 1.7 * 0.80 + 90 >= res.windowHeight) {
            window_width = (res.windowHeight - res.windowHeight * 0.16) / 1.7 / 0.8;
            window_height = window_width * 1.7;
          } else {
            window_width = res.windowWidth;
            window_height = res.windowWidth * 1.7;
          }
          that.setData({
            "canvas_data.canvas_width": window_width,
            "canvas_data.canvas_height": window_height,
            "canvas_data.image_width": window_width * 0.80,
            "canvas_data.image_height": window_height * 0.80,
            "canvas_data.window_width": res.windowWidth,
            "canvas_data.window_height": res.windowHeight,
          })
          setTimeout(function() {
            that.preview_image();
            console.log("onload_success: true");
          }, 500)
        },
        fail: function() {
          wx.showToast({
            title: '网络错误',
            image: '/image/error.png',
            mask: true,
            complete: function() {
              wx.navigateBack({
                delta: 1
              })
            }
          });
          console.log("onload_fail: true")
        }
      })
      console.log("share_one");
    }
    /* share_two */
    else if (this.data.share_style == 2) {
      var that = this;
      wx.getSystemInfo({
        success: function(res) {
          window_width = res.windowWidth;
          window_height = res.windowWidth * 1.78;
          that.setData({
            "canvas_data.canvas_height": window_height,
            "canvas_data.image_width": window_width * 0.7,
            "canvas_data.image_height": window_height * 0.7,
          });
          that.preview_image_two();
          console.log("onLoad.success: true");
        },
      })
      console.log("share_two");
    } else {
      wx.showModal({
        title: '参数错误',
        content: '请正确填写样式(1 or 2)',
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /* share_one */
    preview_image: function() {
      this.show_loading();
      this.get_userdata();
    },
    /* 显示加载中 */
    show_loading: function() {
      wx.showLoading({
        mask: true,
      })
    },
    /* 隐藏加载中 */
    hide_loading: function() {
      wx.hideLoading()
    },
    /* 获取用户数据 */
    get_userdata: function() {
      var that = this;
      if (wx.getStorageSync("avatarurl")) {
        that.setData({
          "avatar": wx.getStorageSync('avatarurl'),
        });
      }
      if (wx.getStorageSync("nickname")) {
        that.setData({
          "nickname": wx.getStorageSync('nickname'),
        });
      }
      that.draw_canvas();
      console.log("get_userdata: true");
    },
    /* 绘制图片 */
    draw_canvas: function() {
      var that = this;
      const ctx = wx.createCanvasContext('canvas', this);
      /* 背景 */
      ctx.setFillStyle("#ffffff");
      ctx.fillRect(0, 0, window_width, window_height);
      /* 背景图片 */
      ctx.drawImage(that.data.bgimage[rand], 0, 0, window_width, window_height * 0.8);
      /* 头像环绕 */
      ctx.beginPath();
      ctx.arc(window_width * 0.13, window_height * 0.8, window_width * 0.085, 0, 2 * Math.PI);
      ctx.setFillStyle("white");
      ctx.fill();
      /* 头像 */
      ctx.save();
      ctx.beginPath();
      ctx.arc(window_width * 0.13, window_height * 0.8, window_width * 0.08, 0, 2 * Math.PI);
      ctx.setStrokeStyle("white");
      ctx.stroke();
      ctx.clip();
      ctx.drawImage(that.data.avatar, window_width * 0.043, window_height * 0.743, window_width * 0.18, window_width * 0.18);
      ctx.restore();
      ctx.beginPath();
      /* 内容左1 */
      ctx.setFillStyle("#ababab");
      ctx.setFontSize("13");
      ctx.setTextAlign('left');
      ctx.fillText(that.data.left_1, window_width * 0.067, window_height * 0.94);
      /* 内容左2 */
      ctx.setFillStyle("#ababab");
      ctx.setFontSize("13");
      ctx.setTextAlign('left');
      ctx.fillText(that.data.left_2, window_width * 0.067, window_height * 0.97);
      /* 内容右1 */
      ctx.setFillStyle("#ababab");
      ctx.setFontSize("11");
      ctx.setTextAlign('center');
      ctx.fillText(that.data.right_1, window_width * 0.844, window_height * 0.979);
      /* QRCode */
      ctx.drawImage(that.data.qrcode, window_width * 0.73, window_height * 0.815, window_width * 0.23, window_width * 0.23);
      /* 昵称 */
      ctx.setFillStyle("black");
      ctx.setFontSize(16);
      ctx.setTextAlign('left');
      ctx.fillText(that.data.nickname, window_width * 0.07, window_height * 0.881);
      ctx.draw(false, function() {
        that.draw_image();
        console.log("draw_canvas: true");
      });
    },
    /* 字体加粗 */
    strong_nickname: function(ctx, font_weight) {
      if (wx.canIUse("canvasContext.font")) {
        ctx.font = 'normal ' + font_weight + ' ' + '14px' + ' sans-serif';
      }
    },
    /* canvas -> image */
    draw_image: function() {
      var that = this;
      wx.canvasToTempFilePath({
        canvasId: 'canvas',
        success: function(res) {
          that.setData({
            "canvas_path.image": res.tempFilePath,
            "canvas_data.share_show": true,
          });
          that.hide_loading();
          console.log("draw_image: success")
        },
        fail: function() {
          that.hide_loading();
          wx.showToast({
            title: '网络错误',
            image: '/image/error.png',
            mask: true,
          })
          console.log("draw_image: fail");
        }
      }, this)
    },
    /* 保存到相册(获取权限) */
    button_sava: function() {
      var that = this;
      that.show_loading();
      if (that.data.canvas_path.image) {
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.writePhotosAlbum']) {
              that.save_image();
            } else {
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success(res) {
                  that.save_image();
                }
              })
            };
            console.log("button_save: success");
          },
          fail() {
            wx.showModal({
              title: '提示',
              content: '你需要授权才能保存图片到相册',
              success: function(res) {
                if (res.confirm) {
                  wx.openSetting({
                    success: function(res) {
                      if (res.authSetting['scope.writePhotosAlbum']) {
                        that.save_image();
                      };
                    },
                    fail: function() {
                      console.log("button_sava: fail");
                    }
                  })
                }
              }
            })
            console.log("button_save: fail");
          }
        })
      }
    },
    /* 保存到相册 */
    save_image: function() {
      var that = this;
      that.hide_loading();
      wx.saveImageToPhotosAlbum({
        filePath: that.data.canvas_path.image,
        success: function() {
          wx.showToast({
            title: '保存成功',
            duration: 2000,
          })
          console.log("save_image: success");
        },
      })
    },
    /* handover */
    handover: function() {
      var that = this;
      if (that.data.canvas_path.image) {
        var rands = rand;
        rand = Math.floor(Math.random() * (that.data.bgimage.length - 1));
        if (rand == rands) {
          ++rand;
        }
        that.preview_image();
        console.log("handover: " + rand);
      }
    },

    /* share_two */
    preview_image_two: function() {
      var that = this;
      if (that.data.canvas_data.share_image_path) {
        that.setData({
          "canvas_data.share_show": true,
        })
      } else {
        that.show_loading();
        that.get_userdata();
        that.draw_canvas_two();
      }
    },

    /* 隐藏加载中 */
    hide_loading: function() {
      wx.hideLoading();
      console.log("hide_loading: true");
    },

    /* 网络加载失败 */
    show_error_model: function(content) {
      this.hide_loading();
      if (!content) {
        content = "网络错误"
      }
      wx.showLoading({
        title: '生成失败',
        content: content,
        success: function() {
          setTimeout(function() {
            wx.hideLoading();
          }, 2000)
        }
      })
      console.log("show_error_model: true");
    },
    /* 绘制分享图片 */
    draw_canvas_two: function() {
      var that = this;
      const ctx = wx.createCanvasContext('canvas', this);
      /* 绘制初始背景图 */
      ctx.setFillStyle("white");
      ctx.fillRect(0, 0, window_width, window_height);
      /* 绘制顶部背景图片 */
      ctx.drawImage(that.data.bgimage_two, 0, 0, window_width, window_height * 0.5);
      /* 头像白色环绕 */
      ctx.arc(window_width / 2, 0.368 / 2 * window_width + 0.117 * window_height, (0.368 / 2) * window_width + 4, 0, 2 * Math.PI);
      ctx.setFillStyle("white");
      ctx.fill();
      /* 绘制头像 */
      ctx.save();
      ctx.beginPath();
      ctx.arc(window_width / 2, 0.368 / 2 * window_width + 0.117 * window_height, (0.368 / 2) * window_width, 0, 2 * Math.PI);
      ctx.setStrokeStyle("white");
      ctx.stroke();
      ctx.clip();
      avatar_width = 0.368 * window_width;
      ctx.drawImage(that.data.avatar, window_width * (0.5 - 0.368 / 2), 0.117 * window_height, avatar_width, avatar_width);
      ctx.restore();
      /* 绘制内容2|3 */
      ctx.setFillStyle("#333333");
      ctx.setFontSize(18);
      ctx.setTextAlign("center");
      ctx.fillText(that.data.left_2, window_width / 2, (0.585 + 3 * 0.01) * window_height);
      ctx.setFillStyle("#333333");
      ctx.setFontSize(18);
      ctx.setTextAlign("center");
      ctx.fillText(that.data.left_3, window_width / 2, (0.620 + 3 * 0.01) * window_height);
      /* 绘制二维码 */
      ctx.drawImage(that.data.qrcode, window_width * (0.5 - 0.341 / 2), 0.69 * window_height, 0.341 * window_width, 0.341 * window_width);
      /* 绘制内容5 */
      ctx.setFillStyle("#747474");
      ctx.setFontSize(14);
      ctx.setTextAlign("center");
      ctx.fillText(that.data.left_5, window_width / 2, (0.935 + 0.01 * 2) * window_height);
      /* 绘制昵称 */
      ctx.setFillStyle("black");
      ctx.setFontSize(20);
      ctx.setTextAlign('center');
      ctx.fillText(that.data.nickname, window_width / 2, (0.34 + 5 * 0.01) * window_height);
      /* 绘制内容1 */
      ctx.setFillStyle("#FF555C");
      ctx.setFontSize(24);
      ctx.setTextAlign('center');
      ctx.fillText(that.data.left_1, window_width / 2, (0.515 + 3 * 0.01) * window_height);
      /* 绘制内容4 */
      ctx.setFillStyle("#747474");
      ctx.setFontSize(16);
      ctx.setTextAlign('center');
      ctx.fillText(that.data.left_4, window_width / 2, (0.91 + 0.01 * 2) * window_height);
      /* 绘制至canvas */
      ctx.draw(false, function() {
        that.draw_image();
        console.log("draw_image.draw: true")
      })
      console.log("draw_image: true");
    },
    /* 点击×关闭分享图片 */
    closs_share_model: function() {
      this.hide_share();
      console.log("closs_share_model: true");
    },
    /* 点击蒙版处关闭分享图片 */
    hide_share: function() {
      this.setData({
        "canvas_data.share_show": false,
      })
      console.log("hide_share: true");
    },
  }
})