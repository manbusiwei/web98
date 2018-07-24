var WebHelper = {
	//login
	LoginUrl : '/api/usercentre/login.do',
	//quit
	LoginOut : '/api/usercentre/logout.do',
	//register
	RegistUser : '/api/user/userRegister.do',
	//ReSendActiveMail
	ReSendActiveMail : '/api/user/reSendActiveMail.do',
	//ForgetPw
	ForgetPw : '/api/user/forgetpw.do',
	//ToResetPassword
	ToResetPassword : '/api/user/toResetPassword.do',
	//ResetPassword
	ResetPassword : '/api/user/resetPassword.do',
	//baseinfo
	QueryBaseInfo : '/api/index/base.do',
	//allCoins
	QueryCoinTypes : '/api/coin/querycointypes.do',
	//首页币种列表
	QueryRealTimeMap : '/api/index/queryrealtimemap.do',
	//首页收藏
	queryOptionalRealTimeMap:'/api/optional/queryOptionalRealTimeMap.do',
	//交易页币种列表 最新成交价-LDP；日涨跌-I；币种价格精度-DD；是否收藏-O；交易区币种id-C；币种id-ID；币种缩写-N
	queryRealTime:'/api/index/queryrealtime',
	//交易页收藏
	queryOptionalRealTime:'/api/optional/queryOptionalRealTime',
	//当前币种行情
	QueryOneCoinRealTimeMap : '/api/index/findonerealtimemap.do',
	//check email (or phone?)
	CheckEmail : '/api/user/checkregname.do',
	BuyTrade : '/api/trade/buy.do',
	SellTrade : '/api/trade/sell.do',
	CancelTrade : '/api/trade/canceltrade.do',
	//查看用户钱包余额
	QueryUserWallet : "/api/coin/userwallet.do",
	//所有币种行情及用户钱包
	QueryAllCoinWallet : "/api/coin/allcoinwallet.do",
	//查看当前所有币种
	QueryAllCoin : "/api/coin/allcoin.do",
	//查看当前充值记录
	QueryDepositRecords : "/api/account/queryrecharges.do",
	QueryWithdraw : "/api/account/querywithdraws.do",
	//查看当前币种钱包地址
	QueryCoinWallet : "/api/finance/walletaddress.do",
	//买卖委托信息
	QueryTrades : "/api/index/trades.do",
	//历史成交信息
	QueryHistory : "/api/index/history.do",
	//当前登录人委托信息
	QueryOrders : "/api/trade/queryorders.do",
	//个人成交记录
	QueryAllDeals : "/api/trade/queryalldeals.do",
	//检测登录
	CheckLogin:"/api/usercentre/checklogin.do",
	//修改密码
	UpdatePw : "/api/security/modifypwd.do",
	//是否身份验证
	Authentication : "/api/security/authentication.do",
	//谷歌验证二维码
	GooleAuth:'/api/security/googleAuth.do',
	//是否开启谷歌验证
	CancelGoogleAuth : "/api/security/cancelGoogleAuth.do",
	//登录框失焦检测是否开启验证
	checkOpenLoginGoogleValidate:'/api/security/checkOpenLoginGoogleValidate.do',
	//切换语言使用接口 参数lang
	updatelanguage:'/api/index/updatelanguage.do',
	//官方通告
	notice:'/api/aboutus/queryallannouncement.do',
	//通告详情
	noticeDetail:'/api/aboutus/findannouncement.do',
	//首页轮播图
	indexBanner:'/api/aboutus/queryallcarouselfigure.do',
	//检测app状态
	sysSwitch:'/api/index/sysSwitch.do',
	//注册时检测账户有效性
	checkMailOrPhoneExists:'/api/user/checkMailOrPhoneExists',
	//给客服提问
	saveQuestion:'/api/question/saveQuestion',
	//历史问题及回复
	queryQuestion:'/api/question/queryQuestion',
	//交易页k线图
	kLine:'/api/index/findKLineByFviFid.do',
	//k线实时刷新接口
	realTimeData:'/api/index/findRealTimeDataByFviFid.do',
	//邀请
	'invitingAwards':'/api/trade/invitingAwards',
	//深度数据
	findDepthDataByFviFid:'/api/index/findDepthDataByFviFid.do',
	//分叉币活动
	fareactivityAll:'/api/welfareactivity/findwelfareactivityAll',
	//超级返利排名
	findSortBrokerage:'/api/brokerage/findSortBrokerage',
	//用户邀请统计
	countBrokerageByuserId:'/api/brokerage/findCountBrokerageByuserId',
	//推荐的朋友数据
	referrerIdUser:'/api/user/findReferrerIdUser',
	//返佣记录
	brokerageByuser:'/api/brokerage/findBrokerageByuserId',
	//首页币种收藏
	createOptional:'/api/optional/createOptional.do',
	//首页币种取消收藏
	deleteOptional:'/api/optional/deleteOptional.do',
	//用户提现地址列表
	withdrawAddrs:'/api/userWithdrawAddr/findWithdrawAddrs',
	//删除提现地址
	delWithdrawAddrs:'/api/userWithdrawAddr/delWithdrawAddrs',
	//添加提现地址
	saveWithdrawAddrs:'/api/userWithdrawAddr/saveWithdrawAddrs',
	//获取交易区
	getOpenTrading:'/api/index/getOpenTrading',
	//币种介绍
	coinDetail:'/api/introduction/findById',
	//充值和提现单独币种处理
	dealallcoin:'/api/coin/dealallcoin',
	//友情链接
	friendLink:'/api/index/friendLink',

	//of活动
	//of分发记录
	fwelfareActivitySnapAll:'/api/welfareactivity/FwelfareActivitySnapAll',
	//交易量排名
	findactivityTradeSort:'/api/activityTradeSort/findactivityTradeSort',

	//9coin部分
	//首页众筹列表
	crowdList:'/api/ico/index',
	//轮播图
	queryBanner:'/api/ico/queryBanner',
	//众筹详情
	details:'/api/ico/details',
	//钱包资产
	welfare:'/api/ico/welfare',
	//认购
	subscription:'/api/ico/subscription',
	//众筹记录
	findRecord:'/api/ico/findRecord',
	//api创建
	createUserApi:'/api/userApi/createUserApi',
	//查询用户api
	findUserApiList:'/api/userApi/findUserApiList',
	//编辑用户api
	updateUserApi:'/api/userApi/updateUserApi',
	//删除用户api
	deleteUserApi:'/api/userApi/deleteUserApi',
	//删除用户全部api
	deleteUserApiList:'/api/userApi/deleteUserApiList',
};

/*
*WebSocket部分接口
*/
// var isTestUrl='ws://47.94.194.143';
var isTestUrl='wss://www.btc98.vip';
var WsApi={
	//交易页买卖（委托信息)买单：B；卖单：S
	wsTradesApi:isTestUrl+'/websocket/tradesApi/',
	//成交记录
	wsTransaction:isTestUrl+'/websocket/Transaction/',
	//挂单观察
	designatesApi:isTestUrl+'/websocket/designatesApi/view/',
	//k线
	kLine:isTestUrl+'/websocket/kLine/',
	//当前委托
	list:isTestUrl+'/websocket/realentrust/list/'
}
