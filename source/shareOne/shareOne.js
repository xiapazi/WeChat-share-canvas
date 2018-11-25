// pages/shareOne/shareOne.js
var window_width;
var window_height;
var rand = 0;
Page({
  data: {
    "canvas_data": {
      "canvas_width": null,
      "canvas_height": null,
      "image_width": null,
      "image_height": null,
      "window_width": null,
      "window_height": null
    },
    "canvas_path": {
      "default": '',
      "image": null,
      "qrcode": "/image/qrcode.jpg",
      "bgimage": ["/image/bg_0.png",
        "/image/bg_1.png",
        "/image/bg_3.png",
        "/image/bg_4.png",
        "/image/bg_6.png"
      ]
    },
    "canvas_text": {
      "left_1": "自强不息",
      "left_2": "谦卑若愚, 好学若饥.",
      "right_1": "长按二维码识别关注",
    },
    "user_data": {
      "avatar": '/image/avatar.jpg',
      "nickname": 'A I R',
    }
  },

  /* 生命周期函数--监听页面加载 */
  onLoad: function() {
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
        setTimeout(function()
        {
          that.preview_image();
          console.log("onload_success: true");
        },500)        
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
  },

  /* 生成预览图片 */
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
        "user_data.avatar": wx.getStorageSync('avatarurl'),
      });
    }
    if (wx.getStorageSync("nickname")) {
      that.setData({
        "user_data.nickname": wx.getStorageSync('nickname'),
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
    ctx.drawImage(that.data.canvas_path.bgimage[rand], 0, 0, window_width, window_height * 0.8);
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
    ctx.drawImage(that.data.user_data.avatar, window_width * 0.043, window_height * 0.743, window_width * 0.18, window_width * 0.18);
    ctx.restore();
    ctx.beginPath();
    /* 内容左1 */
    ctx.setFillStyle("#ababab");
    ctx.setFontSize("13");
    ctx.setTextAlign('left');
    ctx.fillText(that.data.canvas_text.left_1, window_width * 0.067, window_height * 0.94);
    /* 内容左2 */
    ctx.setFillStyle("#ababab");
    ctx.setFontSize("13");
    ctx.setTextAlign('left');
    ctx.fillText(that.data.canvas_text.left_2, window_width * 0.067, window_height * 0.97);
    /* 内容右1 */
    ctx.setFillStyle("#ababab");
    ctx.setFontSize("11");
    ctx.setTextAlign('center');
    ctx.fillText(that.data.canvas_text.right_1, window_width * 0.844, window_height * 0.979);
    /* QRCode */
    ctx.drawImage(that.data.canvas_path.qrcode, window_width * 0.73, window_height * 0.815, window_width * 0.23, window_width * 0.23);
    /* 昵称 */
    // that.strong_nickname(ctx, "bold");
    ctx.setFillStyle("black");
    ctx.setFontSize(16);
    ctx.setTextAlign('left');
    ctx.fillText(that.data.user_data.nickname, window_width * 0.07, window_height * 0.881);
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
      rand = Math.floor(Math.random() * (that.data.canvas_path.bgimage.length - 1));
      if (rand == rands) {
        ++rand;
      }
      that.preview_image();
      console.log("handover: " + rand);
    }
  },

})