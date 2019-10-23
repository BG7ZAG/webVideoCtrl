<template>
    <div>
      <div id="divPlugin" class="plugin">dd</div>
    </div>
</template>


<script>
    import { WebVideoCtrl } from '../../static/webVideoCtrl.js'
    export default {

        data() {
            return {
                g_iWndIndex: 0,//当前选中的窗口
                g_bPTZAuto: false,
                iWidth: 500,
                iHeight: 300,
                iProtocol: 1,
                szIP: "1.1.1.1", //海康威视摄像头/硬盘录像机的ip地址
                szPort: "80",///海康威视摄像头/硬盘录像机的端口
                szUsername: "admin",///海康威视摄像头/硬盘录像机的用户名
                szPassword: "admin12345",///海康威视摄像头/硬盘录像机的密码
                iStreamType: 1,
                bZeroChannel: false,
                iRtspPort:0
            }
        },
        created: function() {
        },
        mounted: function () {
            this.videoInitPlugin();
        },
        destroyed: function() {
           debugger
            WebVideoCtrl.I_Stop({iWndIndex: 0});
            var iRet = WebVideoCtrl.I_Logout(this.szIP);

            if (iRet !== 0) {
                console.log("WebVideoCtrl I_Logout failed");
            } else {
                console.log("WebVideoCtrl I_Logout success");
            }
        },
        methods: {
           
            videoInitPlugin: function () {
                var iRet = WebVideoCtrl.I_CheckPluginInstall();
                if (iRet === -1) {
                    alert("您还未安装过插件，双击开发包目录里的WebComponentsKit.exe安装！");
                    return;
                }
                
                this.initPlugin()
            },
            initPlugin: function(){
                var that = this;

                WebVideoCtrl.I_InitPlugin(this.iWidth, this.iHeight, {
                    bWndFull: true,//是否支持单窗口双击全屏，默I_CheckPluginInstall
                    iWndowType: 2,
                    cbSelWnd: function (xmlDoc) {
                         console.log("xmlDoc1", xmlDoc);
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
                        console.log(that.szIP,that.iProtocol, that.szPort,that.szUsername,that.szPassword )
                        // 登录设备

                        WebVideoCtrl.I_Login(that.szIP, that.iProtocol, that.szPort, that.szUsername, that.szPassword, {
                            async: false,
                            success: function (xmlDoc) {
                                console.log('xmlDoc2',xmlDoc);//不能删除
                                // 开始预览
                               
                                var szDeviceIdentify = that.szIP + "_" + that.szPort;
                                that.getDevicePort(szDeviceIdentify);
                                setTimeout(that.startRealPlay(szDeviceIdentify, 1, 1), 500); // 这里需要修改成你自己的摄像头 or 硬盘录像机的通道
                            },
                            error: function () {
                                console.log("login error");
                            }
                        });
                    }
                });
            },
            getDevicePort: function (szDeviceIdentify) {
                var oPort = WebVideoCtrl.I_GetDevicePort(szDeviceIdentify);
                this.iRtspPort = oPort.iRtspPort;
            },
            startRealPlay: function (szDeviceIdentify,iWndIndex, iChannelID) {
                var that = this;
                console.log("startRealPlay: ", szDeviceIdentify,that.iRtspPort, iWndIndex, iChannelID);

                WebVideoCtrl.I_StartRealPlay(szDeviceIdentify, {
                    iRtspPort: that.iRtspPort,
                    iWndIndex: iWndIndex,
                    iStreamType: 1,
                    iChannelID: iChannelID,
                    bZeroChannel: false,
                    success: function () {
                        console.log("开始预览成功 " );
                    },
                    error: function (status, xmlDoc2) {
                        console.log(xmlDoc2)//不能删除
                        if (status ===403) {
                            console.log("szInfo 设备不支持Websocket取流！");
                        } else {
                            console.log("开始预览失败 ",status,xmlDoc2);
                        }
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
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
