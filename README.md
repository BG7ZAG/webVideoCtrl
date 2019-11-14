# webVideoCtrl 海康威视web开发 vue + elementUI demo

### 介绍
-  **CH_WEB3.0控件开发包V1.1.0_Win32.rar**   是海康威视官方提供的web开发包, 也适用于64位操作系统
-  **hkvVideoVue** 是自己实现的vue代码，使用vue + elementUI实现，里面引用的海康的webVideoCtrl.js文件，我修改了部分源码


### 使用方法
- 先解压CH_WEB3.0控件开发包V1.1.0_Win32.rar
- 安装压缩包中的   **CH_WEB3.0控件开发包V1.1.0_Win32/demo/codebase/WebComponentsKit.exe**   插件
- 使用   **<font color=#DC143C size=6>IE11</font>**   浏览器打开   **CH_WEB3.0控件开发包V1.1.0_Win32/demo/index.html**，   输入ip地址，端口，用户名，密码，查看是否可与登录预览
- 如果上面的步骤没有问题，可以在本地运行 vue 的 demo代码（hkvVideoVue文件内的工程），运行命令
```
npm install
npm run dev
```
- 同时也可以参考文档：https://blog.csdn.net/yushi6310/article/details/88549363


### 实现功能
- 目前实现了登录，预览，停止预览，退出，获取数字通道，云台控制等功能，其他功能后续更新。。。



### 下一步开发计划
- 双击显示全屏时，控制按钮浮在视频最上面

### 海康提供的插件存在问题（炒鸡蛋筒）
- 浏览器兼容性很差
- 运行时，浏览器消耗资源比较多，有时会卡顿
- 云台控制点击反应比较慢，有延时

### 效果预览
![海康摄像功能预览](https://img-blog.csdnimg.cn/20191114100625435.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3l1c2hpNjMxMA==,size_16,color_FFFFFF,t_70)


##### 有疑问请留言，也可以添加本人微信：18795954756，加微信就点个星吧





