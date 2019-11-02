<template>

  <div>

    <el-row>
      <el-col :span="12">
        <div id="divPlugin" class="plugin"></div>
        <br/>
        <div>
          <el-form :inline="true" :model="hkvInfo" class="demo-form-inline">
            <el-row>
              <el-col>
                <el-form-item label="ip">
                  <el-input v-model="hkvInfo.ip" placeholder="ip"></el-input>
                </el-form-item>
                <el-form-item label="port">
                  <el-input v-model="hkvInfo.port" placeholder="port"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <div>
                  <el-form-item label="username">
                    <el-input v-model="hkvInfo.username" placeholder="username"></el-input>
                  </el-form-item>
                  <el-form-item label="password">
                    <el-input v-model="hkvInfo.password" placeholder="password"></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item>
                  <el-button type="primary" :loading="loginLoading" @click="onLogin">登录</el-button>
                  <el-button type="primary" :loading="startPlayLoading" @click="clickStartRealPlay">开始预览</el-button>
                  <el-button type="primary" @click="clickStopRealPlay">停止预览</el-button>
                  <el-button type="primary" @click="onLogout">退出</el-button>
                </el-form-item>

              </el-col>
            </el-row>
          </el-form>


        </div>
      </el-col>
      <el-col :span="12">

      </el-col>
    </el-row>


  </div>
</template>


<script>
  import {WebVideoCtrl} from '../../static/webVideoCtrl.js'

  export default {

    data() {
      return {
        hkvInfo: {
          ip: '1.1.1.1',//海康威视摄像头/硬盘录像机的ip地址
          port: '81',//海康威视摄像头/硬盘录像机的端口
          username: 'admin',//海康威视摄像头/硬盘录像机的用户名
          password: 'admin12345',//海康威视摄像头/硬盘录像机的密码
          channels: [1, 2],//海康威视摄像头/硬盘录像机的通道
        },
        g_iWndIndex: 0,//当前选中的窗口
        g_bPTZAuto: false,
        iProtocol: 1,
        loginLoading: false,
        startPlayLoading: false,
        iStreamType: 1,
        bZeroChannel: false,
        iRtspPort: 0
      }
    },
    created: function () {
    },
    mounted: function () {
      this.videoInitPlugin(); // 初始化video界面
    },

    destroyed: function () {
      this.clickStopRealPlay();
      this.onLogout();
    },
    methods: {
      onLogin() {
        var that = this;
        that.loginLoading = true;

        // 登录设备
        WebVideoCtrl.I_Login(that.hkvInfo.ip, that.iProtocol, that.hkvInfo.port, that.hkvInfo.username, that.hkvInfo.password, {
          async: false,
          success: function (xmlDoc) {
            // console.log('xmlDoc2', xmlDoc);//不能删除
            //TODO 获取通道信息
            that.getDevicePort(that.hkvInfo.ip + "_" + that.hkvInfo.port);
            that.loginLoading = false;

            that.$message({
              showClose: true,
              message: '登录成功',
              type: 'success'
            });
          },
          error: function () {
            that.loginLoading = false;
            that.$message({
              showClose: true,
              message: '登录失败',
              type: 'error'
            });
          }
        });
      },
      onLogout() {
        var szDeviceIdentify = this.hkvInfo.ip + "_" + this.hkvInfo.port;
        var iRet = WebVideoCtrl.I_Logout(szDeviceIdentify);
        if (0 == iRet) {
          this.$message({
            showClose: true,
            message: '退出成功',
            type: 'success'
          });
        } else {
          this.$message({
            showClose: true,
            message: '退出失败',
            type: 'error'
          });
        }
      },
      clickStartRealPlay() {

        // 开始预览
        var that = this;
        that.startPlayLoading = true;
        var szDeviceIdentify = that.hkvInfo.ip + "_" + that.hkvInfo.port;

        var j = that.hkvInfo.channels.length > 4 ? 4 : that.hkvInfo.channels.length;
        for (var i = 0; i < j; i++) {
          setTimeout(that.startRealPlay(szDeviceIdentify, i, that.hkvInfo.channels[i]), 500);
        }
        that.startPlayLoading = false;
      },
      videoInitPlugin: function () {
        var iRet = WebVideoCtrl.I_CheckPluginInstall();
        if (iRet === -1) {
          alert('您还未安装过插件，双击开发包目录里的WebComponentsKit.exe安装');
          return;
        }

        this.initPlugin()
      },
      initPlugin: function () {
        var that = this;

        WebVideoCtrl.I_InitPlugin(500, 300, {
          bWndFull: true,//是否支持单窗口双击全屏，默I_CheckPluginInstall
          iWndowType: 2,
          cbSelWnd: function (xmlDoc) {
            var giWndIndex = parseInt($(xmlDoc).find("SelectWnd").eq(0).text(), 10);
            var szInfo = "当前选择的窗口编号：" + giWndIndex;

            console.log("szInfo", szInfo);
          },
          cbInitPluginComplete: function () {
            WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");
            // 检查插件是否最新
            if (WebVideoCtrl.I_CheckPluginVersion() === -1) {
              alert("检测到新的插件版本，双击开发包目录里的WebComponentsKit.exe升级！");
              return;
            }
          }
        });
      },
      getDevicePort: function (szDeviceIdentify) {
        var oPort = WebVideoCtrl.I_GetDevicePort(szDeviceIdentify);
        this.iRtspPort = oPort.iRtspPort;
      },
      startRealPlay: function (szDeviceIdentify, iWndIndex, iChannelID) {
        var that = this;
        WebVideoCtrl.I_StartRealPlay(szDeviceIdentify, {
          iRtspPort: that.iRtspPort,
          iWndIndex: iWndIndex,
          iStreamType: 1,
          iChannelID: iChannelID,
          bZeroChannel: that.bZeroChannel,
          success: function () {
            that.$notify({
              title: '成功',
              message: '开始预览通道' + iChannelID + '成功',
              type: 'success'
            });
          },
          error: function (status, xmlDoc2) {
            console.log(xmlDoc2)//不能删除
            that.$notify({
              title: '失败',
              message: '开始预览通道' + iChannelID + '失败',
              type: 'error'
            });
            if (status === 403) {
              console.log("szInfo 设备不支持Websocket取流！");
            } else {
              console.log("开始预览失败 ", status, xmlDoc2);
            }
          }
        });
      },
      clickStopRealPlay: function () {
        var j = this.hkvInfo.channels.length > 4 ? 4 : this.hkvInfo.channels.length;
        for (var i = 0; i < j; i++) {
          setTimeout(this.stopRealPlay(i), 1000);
        }
      },
      stopRealPlay: function (iWndIndex) {
        var that = this;
        WebVideoCtrl.I_Stop({
          iWndIndex: iWndIndex,
          success: function () {
            that.$notify({
              title: '成功',
              message: '停止预览窗口' + iWndIndex + '成功',
              type: 'success'
            });
          },
          error: function () {
            that.$notify({
              title: '失败',
              message: '停止预览窗口' + iWndIndex + '失败',
              type: 'error'
            });
          }
        });

      },
      mouseDownPTZControl: function (iPTZIndex) {
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(0);

        if (oWndInfo !== null) {
          if (iPTZIndex === 9 && this.g_bPTZAuto) {
            iPTZSpeed = 0;
          } else {
            this.g_bPTZAuto = false;
          }

          WebVideoCtrl.I_PTZControl(iPTZIndex, false, {
            iPTZSpeed: 4,
            success: function (xmlDoc) {
              console.log(xmlDoc);
              if (iPTZIndex === 9 && this.g_bPTZAuto) {
                console.log(oWndInfo.szDeviceIdentify + " 停止云台成功！");
              } else {
                console.log(oWndInfo.szDeviceIdentify + " 开启云台成功！");
              }
              if (iPTZIndex === 9) {
                this.g_bPTZAuto = !this.g_bPTZAuto;
              }
            },
            error: function (status, xmlDoc) {
              console.log(oWndInfo.szDeviceIdentify + " 开启云台失败！", status, xmlDoc);
            }
          });
        }
      },
      mouseUpPTZControl: function () {
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex);

        if (oWndInfo !== null) {
          WebVideoCtrl.I_PTZControl(1, true, {
            success: function (xmlDoc) {
              console.log(oWndInfo.szDeviceIdentify + " 停止云台成功！", xmlDoc)
            },
            error: function (status, xmlDoc) {
              console.log(oWndInfo.szDeviceIdentify + " 停止云台失败！", status, xmlDoc);
            }
          });
        }
      }
    }
  }
</script>

<style scoped>
  .plugin {
    width: 500px;
    height: 300px;
  }
</style>
