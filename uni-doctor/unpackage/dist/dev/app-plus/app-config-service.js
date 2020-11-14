
var isReady=false;var onReadyCallbacks=[];
var isServiceReady=false;var onServiceReadyCallbacks=[];
var __uniConfig = {"pages":["pages/home/home","pages/studio/studio","pages/personal/personal","pages/login/login","pages/settings/settings","pages/case/case","pages/receipt/receipt","pages/qrcode/qrcode","pages/forget/forget","pages/material/material","pages/medical/medical","pages/assistant/assistant"],"window":{"navigationBarTextStyle":"white","navigationBarTitleText":"脑科专家","navigationBarBackgroundColor":"#0E92F8","backgroundColor":"#F8F8F8"},"tabBar":{"color":"#333333","selectedColor":"#0E92F8","backgroundColor":"#FFFFFF","borderStyle":"white","list":[{"pagePath":"pages/home/home","text":"首页","iconPath":"static/tabbar/home.png","selectedIconPath":"static/tabbar/home_selected.png"},{"pagePath":"pages/studio/studio","text":"工作室","iconPath":"static/tabbar/studio.png","selectedIconPath":"static/tabbar/studio_selected.png"},{"pagePath":"pages/personal/personal","text":"我的","iconPath":"static/tabbar/personal.png","selectedIconPath":"static/tabbar/personal_selected.png"}]},"nvueCompiler":"uni-app","renderer":"auto","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":false},"appname":"uni-doctor","compilerVersion":"2.9.7","entryPagePath":"pages/assistant/assistant","entryPageQuery":"","realEntryPagePath":"pages/home/home","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000}};
var __uniRoutes = [{"path":"/pages/home/home","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"脑科专家"}},{"path":"/pages/studio/studio","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"工作室"}},{"path":"/pages/personal/personal","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"我的"}},{"path":"/pages/login/login","meta":{},"window":{"navigationBarTitleText":"登录"}},{"path":"/pages/settings/settings","meta":{},"window":{"navigationBarTitleText":"我的设置"}},{"path":"/pages/case/case","meta":{},"window":{"navigationBarTitleText":"病历总库","enablePullDownRefresh":true}},{"path":"/pages/receipt/receipt","meta":{},"window":{"navigationBarTitleText":"咨询接单","enablePullDownRefresh":true,"titleNView":{"buttons":[{"width":"65px","float":"right","text":"接单记录","fontSize":"28upx","color":"#FFFFFF"}]}}},{"path":"/pages/qrcode/qrcode","meta":{},"window":{"navigationBarTitleText":"邀请二维码"}},{"path":"/pages/forget/forget","meta":{},"window":{"navigationBarTitleText":"忘记密码"}},{"path":"/pages/material/material","meta":{},"window":{"navigationBarTitleText":"个人资料"}},{"path":"/pages/medical/medical","meta":{},"window":{"navigationBarTitleText":"病历库"}},{"path":"/pages/assistant/assistant","meta":{},"window":{"navigationBarTitleText":"我的助手","bounce":"none","titleNView":{"buttons":[{"width":"65px","float":"right","text":"助手订单","fontSize":"28upx","color":"#FFFFFF"}]}}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
__uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:void 0,window:void 0,document:void 0,frames:void 0,self:void 0,location:void 0,navigator:void 0,localStorage:void 0,history:void 0,Caches:void 0,screen:void 0,alert:void 0,confirm:void 0,prompt:void 0,fetch:void 0,XMLHttpRequest:void 0,WebSocket:void 0,webkit:void 0,print:void 0}}}});
