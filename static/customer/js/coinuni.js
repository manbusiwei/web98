//公共js部分
//<!--Start of Zendesk Chat Script-->
//<script type="text/javascript">
window.$zopim||(function(d,s){var z=$zopim=function(c){z._.push(c)},$=z.s=
d.createElement(s),e=d.getElementsByTagName(s)[0];z.set=function(o){z.set.
_.push(o)};z._=[];z.set._=[];$.async=!0;$.setAttribute("charset","utf-8");
$.src="https://v2.zopim.com/?5G0romtay4axDdKuWktY8EfAInfEybgE";z.t=+new Date;$.
type="text/javascript";e.parentNode.insertBefore($,e)})(document,"script");
//</script>
//<!--End of Zendesk Chat Script-->

(function(e){typeof define=="function"&&define.amd?define(["jquery"],e):e(jQuery)})(function(e){function n(e){return u.raw?e:encodeURIComponent(e)}function r(e){return u.raw?e:decodeURIComponent(e)}function i(e){return n(u.json?JSON.stringify(e):String(e))}function s(e){e.indexOf('"')===0&&(e=e.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\"));try{return e=decodeURIComponent(e.replace(t," ")),u.json?JSON.parse(e):e}catch(n){}}function o(t,n){var r=u.raw?t:s(t);return e.isFunction(n)?n(r):r}var t=/\+/g,u=e.cookie=function(t,s,a){if(s!==undefined&&!e.isFunction(s)){a=e.extend({},u.defaults,a);if(typeof a.expires=="number"){var f=a.expires,l=a.expires=new Date;l.setTime(+l+f*864e5)}return document.cookie=[n(t),"=",i(s),a.expires?"; expires="+a.expires.toUTCString():"",a.path?"; path="+a.path:"",a.domain?"; domain="+a.domain:"",a.secure?"; secure":""].join("")}var c=t?undefined:{},h=document.cookie?document.cookie.split("; "):[];for(var p=0,d=h.length;p<d;p++){var v=h[p].split("="),m=r(v.shift()),g=v.join("=");if(t&&t===m){c=o(g,s);break}!t&&(g=o(g))!==undefined&&(c[m]=g)}return c};u.defaults={},e.removeCookie=function(t,n){return e.cookie(t)===undefined?!1:(e.cookie(t,"",e.extend({},n,{expires:-1})),!e.cookie(t))}});
var allMarkets={};
var allMarkets_arr=[];//用于改变顺序
//检测系统状态
;(function(){
    $.ajax({
        url:WebHelper.sysSwitch,
        async:false,
        success:function(d){
            if(d.status==0&&location.href.indexOf('error')==-1){
                location.href='/other/error.html';
            }
        }
    });
    $.ajax({
        url:WebHelper.getOpenTrading,
        async:false,
        success:function(res){
            if(res.status==1){
                var d=res.data;
                for(var i=0;i<d.length;i++){
					allMarkets[d[i]['fviFid']]=d[i]['coinName'].toLowerCase();
                    allMarkets_arr.push([d[i]['fviFid'],d[i]['coinName'].toLowerCase()]);
                }
            }else{
                console.log(d.msg)
            }
        }
    })
})()


COIN = {bacc:[lang('商业链'),58],wtbs:[lang('文通宝'),51],wint:[lang('赢链'),55],bpp:[lang('比特之光'),53],snlc:[lang('SNLC'),52],of:[lang('福币'),48],ofd:[lang('福豆'),46],sdc:[lang('六度云贝'),45],pft:[lang('pft'),44],bitcny:[lang('BitCNY'),43],btm:[lang('比原链'),39],eos:[lang('EOS'),40],btc:[lang('比特币'),36],bts:[lang('比特股'),33],supy:[lang('速比'),30],poi:[lang('poi'),25],wtb:[lang('文通链'),8],act:[lang('Achain'),20],tv:[lang('钛值'),19],brs:[lang('赛车链'),18],qtum:[lang('量子币'),17],doge:[lang('狗狗币'),16],can:[lang('CAN'),15],wac:[lang('全民链'),14],bte:[lang('比特兑'),13],gcs:[lang('游戏链'),10],sss:[lang('共享链'),9],ccs:[lang('爱游宝')],gec:[lang('游娱宝'),11],neo:[lang('小蚁币'),4], kac:[lang('开拍币'),12],ltc: [lang('莱特币'),2],eth:[lang('以太坊'),3],etc:[lang('以太坊经典'),5], hkc: [lang('红壳币'),8], bch: ['BCH',6]};
FINANCE = 0;
TRANSFER = [lang('未确认'),lang('等待'),lang('确认中'),lang('已取消'),lang('失败'),lang('已补转'),lang('成功')];
STATUS_CLASS = ['orage','orage','orage','red','red','green','green'];
FENTRUSTTYPE = [lang('买入'),lang('卖出')];
WITHDRAWSTATUS = [lang('已提交'),lang('等待提现'),lang('正在处理'),lang('提现成功'),lang('用户取消')];

//币种精度:价格精度、数量精度
// var COINPRECISION;
function lang(str, re){
    var _isnotIndex=isnotIndexFn();
    if(_isnotIndex){
    	if($.cookie('lang')=='zh_CN'){
            return str;
        }
    }else if($.cookie('lang')=='en_US'){
        return str;
    }
    if(typeof langs == 'undefined') langs = false;
    if(langs && typeof langs[str] != 'undefined'){
        str = langs[str];
    }
    if(re) for(var r in re){
        str = str.replace(r, re[r]);
    }
    return str;
}
function isnotIndexFn(){
    var _isnotIndex=location.href.indexOf('index.html')==-1&&location.pathname!='/';
    return _isnotIndex;
}
//captcha
function show_captcha(id) {
    if (typeof id == 'undefined') id = 'captcha';
    $('#img-' + id).attr('src', '/servlet/ValidateImageServlet/?' + Math.random());
}
// status
function fncTrade(s) {
    var status = [lang('状态'), lang('未成交'), lang('部分成交'), lang('完全成交'), lang('撤销')];
    return s ? status[s] : status;
}
// figure
FF={
    add: function(a,b){return (Math.round(a*1000000)+Math.round(b*1000000))/1000000},
    mul: function(a,b){return (Math.round(a*1000000)*Math.round(b*1000000))/1000000/1000000}
};
// timestamp
function fncDT(d, nt) {
    if (!d) return lang('刚刚');
    var time = new Date((parseInt(d) + 28800 + 3600) * 1000);
    var ymd = time.getUTCFullYear() + "/" + (time.getUTCMonth() + 1) + "/" + time.getUTCDate() + ' ';
    if (nt) return ymd;
    return ymd + time.getUTCHours() + ":" + (time.getUTCMinutes() < 10 ? '0' : '') + time.getUTCMinutes();
}
function dateformat(ns){
	var datatime = 0;
	if((ns + '').length > 10){
		datatime = parseInt(ns);
	}else{
		datatime = parseInt(ns) * 1000;
	}
	return new Date(datatime).toLocaleString().substr(0,17);
}
//登录
function login(i) {
	if(!$('#login-email-i').val()||!$('#pw').val()) return alert(lang("请输入账号和密码"))
	$.post(WebHelper.LoginUrl, $('#login-form').serialize(), function (d) {
		if (d.status != 1) {
            if(d.status==-1){
                alert(lang(d.msg));
//                location.reload();
                return;
            }
            if (d.status == '-1015') return dialog_login_yz();//邮箱没有验证
			if (d.status == -3011){
                $('#ga-i').show()
            }
			if (d.data == 'ga') gashow('-i', 1);
			if (d.data == 'captcha'){
				alert(lang(d.msg));
				return show_error_captcha(1);
			}
            if (d.data == 'forgetpw'){
                more_login();
                return false;
            }
            $('#email-error').show().html(d.msg);
            return;
		} else {
//            var exTime=new Date();
//            exTime.setTime(exTime.getTime()+30*60*1000);
            $.cookie('token',d.data[3],{expires:7,path:'/'});
		    $.cookie('userName', d.data[2], { expires: 7, path: '/' });
		    $.cookie('USER', d.data, { expires: 7, path: '/' });
            if(d.data[4]=='1'){
                location.href='/sys_auth/coinOffer.html';
                return;
            }else if(d.data[4]=='2'){
                location.href='/sys_auth/businessmenCoin.html';
                return;
            }
			if(i==='i'){
				//隐藏、显示登录
				$('#index_well').hide();
				$('#index_well2').show();
				location.href='/index.html';
			}else{
				location.href = '/finance/finance.html';
			}
		}
	}, 'json');
}
function user(){
	if(USER = $.cookie('USER')){
		USER = USER.split(',');
		$('#index_well').hide();
		$('#index_well2').show();
        // $('.index_banner .well').css('top','52px');
        // $('#user_name').html(USER[2] == '' ? '-' : USER[2]);
        // $('.user_name').show().html(USER[2]);
        $('.user-email').html(encryptUserName(USER[2]));
        $('.top-user-email').show().html(encryptUserName(USER[2]));
		$('.user-id').html(USER[0]);
        $('#userinfo .userinfo-top p span').css('color','#fff').html(USER[0]);
        $('#recommendId').html(USER[0]);
		$('.anquan .id:eq(0) .red').html(USER[0]);
		$('.anquan .id:eq(1) .red').html(encryptUserName(USER[1]));
		if (typeof FINANCE != 'object') return balance();
        // goods_num();
	}else{
		$('.top-login .login').css('display','inline-block')
	}
}
//判断是否登录
function ltcb(d) {
    return true;//暂无超时判断
    if (typeof(d) == 'string') {
        try {
            d = eval('(' + d + ')');
        } catch (e) {
        }
    }
    var href = location.href;
    if (-9 == d.status && (href.indexOf('coinTrade')<0)) {
        USER = '';
        FINANCE = 0;
        alert(lang('登录超时，请重新登录'));
        if(true){
        	redirectLoginPage();
        }
        return loginpop(lang('登录超时，请重新登录'));
    }
    return 1;
}

function loginpop(msg) {
}

//检测邮箱
function checkemail(obj){
    // if($(obj).val() == ''){
    //     return lang('邮箱不能为空');
    // }
	/*if($(obj).val() == ''){
		$(obj).css('border','solid 1px #f70a0a');
		$(obj).focus();
		$(obj).append('<p id="email-error" class="err">邮箱不可为空</p>');
		return false;
	}*/
//	validElement(obj);
    var patrn_email=/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
    if(!patrn_email.exec($(obj).val())){
        return lang('邮箱格式不正确');
    }
}

//查看用户所有币种的余额
function umenu(){
    var _allM={};
    for(var i in allMarkets){
        _allM[allMarkets[i]]=allMarkets[i];
    }
    //用户中心取btc交易区
    var _type=1;
    if (typeof FINANCE != 'object') return balance();
    var ListStr='';
  //   for(var i in allMarkets){
  //       if(allMarkets[i]=='usdt')continue;
  //       ListStr += '<a onclick="doLogin(\'withdraw\',\'\',\'?id='+i+'&shortName='+allMarkets[i]+'\')"><li><div class="userinfo-Coin">'
  //           + '<span class="coin coin_25 coin_'+allMarkets[i]+'_25"></span>'+(allMarkets[i]=='bitcny'?'BitCNY':allMarkets[i].toUpperCase())+'</div> <div class="userinfo-available is_num" data-point="10" title="'+to_num(FINANCE.data[allMarkets[i]+'_balance'],10)+'">'+ FINANCE.data[allMarkets[i]+'_balance']
  //           + '</div> <div class="userinfo-frozen is_num" data-point="10" title="'+to_num(FINANCE.data[allMarkets[i]+'_lock'],10)+'">' + FINANCE.data[allMarkets[i]+'btc_lock'] + '</div> </li></a>'
  //   }
  //   var cC = $.cookie('allCoin1');
	 // if(!cC){
		//  initAllCoin(1);
	 // }
    var btc_balance='';
    var btc_lock='';
    var coin_balance='';
    var coin_lock='';
	 var cArray = FINANCE['data']['UW'];
	 for( var m=0;m<cArray.length;m++){
        var temp = cArray[m];
        var _name=temp[0].toLowerCase();
        if(_name=='btc'){
            btc_balance=temp[4];
            btc_lock=temp[3];
        }
        if((typeof coinName!='undefined')&&coinName.toLowerCase()==_name){
            coin_balance=temp[4];
            coin_lock=temp[3];
        }
        if((typeof coinShortName!='undefined')&&coinShortName.toLowerCase()==_name){
            FINANCE.data[coinShortName.toLowerCase()+'_balance']=temp[4];
            $('.coinType_finance_sell').html(to_num(temp[4]));
        }
        if(_allM[_name]){
            FINANCE['data'][_name+'_balance']=temp[4];
            FINANCE['data'][_name+'_lock']=temp[3];
            ListStr+='<a onclick="doLogin(\'withdraw\',\'\',\'?id='+temp[1]+'&shortName='+temp[0]+'\')">'
        }else{
            ListStr+='<a href="/trade/coinTrade.html?id='+ temp[1] +'&shortName='+ temp[0] +'">';
        }
        // ListStr += '<a onclick="doLogin(\'withdraw\',\'\',\'?id='+ temp[1] +'&shortName='+ temp[0] +'\')"><li> <div class="userinfo-Coin"><span class="coin coin_25 coin_'
        ListStr += '<li> <div class="userinfo-Coin"><span class="coin coin_25 coin_'
        			+ _name+ '_25"></span>' + temp[0].toUpperCase() + '</div> <div class="userinfo-available is_num" title="'+to_num(temp[4])+'">'
        			+ temp[4]+ '</div> <div class="userinfo-frozen is_num" title="'+to_num(temp[3])+'">'
        			+ temp[3]+ '</div> </li></a>'
    }
    var menu = '<div class="listscoll" id="userinfo-list"> ' + ListStr + '</div>';
    $('#user-balance').html(menu);
    $('#balance_total').html(to_num(FINANCE.data['btc_count']));
    $('.user-finance').html(to_num(FINANCE.data['btc_count']));
    $('#btc_balance').html(btc_balance);
    $('#btc_lock').html(btc_lock);
    $('#coin_balance').html(coin_balance);
    $('#coin_lock').html(coin_lock);
    if(getRequestByName('coinType')){
        var _type=getRequestByName('coinType')
        $('.coinType_finance').html(to_num(FINANCE.data[allMarkets[_type] + "_balance"]));
    }
    goods_num();
}

//判断是否正确的邮箱 和谷歌验证
function loginga(ns){
    ns = ns || '';
    $.post(WebHelper.CheckEmail, {email: $('#login-email-i').val()}, function (d) {
        if(d.status === 1){
            // email hide
            $('#email-error').html('').hide();

            // captcha
            //if (2 & d.data)
            /*if (0 === d.data.ret)
            	show_error_captcha(1);
            else {
                //show_error_captcha(0);
            }*/
            // GA
            //if (4 & d.data) gashow(ns, 1); else {
            if (1 === d.data.ret) gashow(ns, 1); else {
                $('#ga' + ns).hide();
            }
        } else {
            // alert msg
            $('#email-error').html(lang(d.msg)).show();
        }
    }, 'json');
}

//显示或隐藏客户信息
function gashow (ns, show){
    if(show) $('#ga'+ns).show();
    else $('#ga'+ns).hide();
}

function balance_cb(){}

//查询余额
function balance(){
	if (typeof FINANCE == 'object') {
        balance_cb();
        umenu();
    } else {
        FINANCE = 1;
        $.getJSON(WebHelper.QueryUserWallet, function (d) {
    		if(d.status==-9) return;
            if (!ltcb(d))return;
            FINANCE = d;
            umenu();
            balance_cb();
			// user();
        });
    }
}
//科学计数法转化为数字point精度
function to_num(num,point) {
    point=point?point:'';
	if(num==='undefined'||num===undefined||num===''||num==null){
		num=0;
		return num;
	}
    num == '-' ? num = 0 : '';
    var _point=point||pointData(getRequestByName("shortName"),'pricePre')||8
    // try {
        // if(typeof num=='number')num=num.toString()
        // if(num.indexOf('e')==-1){
        // 	var bit_str = num.split('.')[1];
        // }else{
            var bit_str='';
            var int_str='';
            //(12577.19).toFixed(12)="12577.190000000001"当末尾数是1、2、3、4、9时，
            //toFixed()保留12位以上时不可控
            // if(location.href.indexOf('coinTrade')>-1){
                // var str=Number(num).toFixed(point||pointData(getRequestByName("shortName"),'pricePre')||8)
                var str=num.toString();
                if(/e/i.test(str)){
                    str=Number(num).toFixed(_point+1)
                }
                if(str.indexOf('.')>-1){
                    int_str=str.split('.')[0];
                    bit_str=str.split('.')[1];
                }else{
                    return str;
                }
            // }else{
            //     bit_str=Number(num).toFixed(point).split('.')[1];
            // }
        	// var bit_str=Number(num).toFixed( 8).split('.')[1];
        // }
        if(bit_str==0){
            return str.split('.')[0]
        }

        if(num%1 == 0){
            return parseFloat(num);
            return false;
        }
        // for(var i=bit_str.length;i>=0;i--){
            //保留8位
        // if(bit_str.length>8)bit_str=bit_str.slice(0,8);
        for(var i=_point;i>=0;i--){
            var n = bit_str.substr(i-1, 1);
            if(n != 0){
                // var m = Number(num);
                // return m.toFixed(i+1);
                return int_str+(bit_str.substr(0,i)?'.'+bit_str.substr(0,i):'');
            }
        }
    // }catch(e){}
}
//重写toFixed函数，未全面测试
// Number.prototype.toFixed=function (d) {
//     var s=this+"";
//     if(!d)d=0;
//     if(s.indexOf(".")==-1)s+=".";
//     s+=new Array(d+1).join("0");
//     if(new RegExp("^(-|\\+)?(\\d+(\\.\\d{0,"+(d+1)+"})?)\\d*$").test(s)){
//         var s="0"+RegExp.$2,pm=RegExp.$1,a=RegExp.$3.length,b=true;
//         if(a==d+2){
//             a=s.match(/\d/g);
//             if(parseInt(a[a.length-1])>4){
//                 for(var i=a.length-2;i>=0;i--){
//                     a[i]=parseInt(a[i])+1;
//                     if(a[i]==10){
//                         a[i]=0;
//                         b=i!=1;
//                     }else break;
//                 }
//             }
//             s=a.join("").replace(new RegExp("(\\d+)(\\d{"+d+"})\\d$"),"$1.$2");

//         }if(b)s=s.substr(1);
//         return (pm+s).replace(/\.$/,"");
//     }
//     return this+"";
// };
//判断该币种是否需要特殊处理小数位type:价格精度或数量精度
function pointData(_coin ,type,coinType){
    var _coinType=coinType||localStorage.getItem('coinType')||1
    if(!_coin)return '';
    _coin=_coin.toLowerCase();
    COINPRECISION=JSON.parse(localStorage.getItem('COINPRECISION'+_coinType));
    if(!COINPRECISION)location.href='/';
    try{
        if(COINPRECISION[_coin][type]){
            return Number(COINPRECISION[_coin][type]);
        }else{
            return '';
        }
    }catch(e){
        console.log(e)
    }
}
function goods_num() {
    $('.is_num').each(function () {
        $(this).html(to_num($(this).html())==undefined?0:to_num($(this).html(),Number($(this).data('point'))));
    })
}

//获取所有币种
function initAllCoin(type){
    type=type||localStorage.getItem('coinType')||1;
    $.ajax({
        url:WebHelper.QueryAllCoin+'?coinType='+type,
        type:'GET',
        async:false,
        success:function (result) {
            var d = result.data;
            var coins = [];
            COINPRECISION={};
            for(var i=0;i<d.length;i++){
                COINPRECISION[d[i][0]]={
                    pricePre:d[i][7]||8,
                    numberPre:d[i][8]
                }
                //hkc放最后
                // if(d[i][0]=='hkc')d.push(d.splice(i,1)[0]);

                coins.push(d[i][0]+'__'+d[i][1]+'__'+to_num(d[i][2])+'__'+d[i][3]+'__'+d[i][4]+'__'+to_num(d[i][5])+'__'+to_num(d[i][6])+'__'+d[i][7]+'__'+d[i][8]+'__'+d[i][9]);
            }
            $.cookie('allCoin'+type, coins, { expires: 7, path: '/' });
            localStorage.setItem('COINPRECISION'+type,JSON.stringify(COINPRECISION));
        }
    });
}
TMPL = {};

/*TMPL.list = function (p, config, code) {
    $.post(config.url + '?p=' + p, config.data, function (d) {
        if (!ltcb(d))return;
        if (!d.status) return alert(d.msg);
        if ('' == d.data.datas) {
            $('#grid-' + config.name).html('<p class="no-records">'+lang('暂无记录')+'</p>');
        } else {
            $('#tmpl-' + config.name).tmpl(d.data.datas).htm('#grid-' + config.name);
        }
        TMPL.pages(d.data.page, config.name);
        TMPL.listcb(d);
        if (typeof code != 'undefined')eval(code);
        goods_num();
    }, 'json');
};*/

TMPL.list = function (p, config, code) {
    $.ajax({
        type: 'POST',
        url: config.url,
        contentType : 'application/json',
        data : JSON.stringify(config.data),
        dataType: 'json',
        success: function (d) {
        	if (!ltcb(d))return;
            if (!d.status) return alert(lang(d.msg));
            if ('' == d.data || null == d.data) {
                $('#grid-' + config.name).html('<p class="no-records">'+lang('暂无记录')+'</p>');
            } else {
                $('#tmpl-' + config.name).tmpl(d.data).htm('#grid-' + config.name);
                if(config.name=='orders'){
                    $('.entrust_option .active').click();
                }
            }
            TMPL.pages(d.page, config.name);
            TMPL.listcb(d);
            if (typeof code != 'undefined')eval(code);
            goods_num();
        }
    })
};

TMPL.listcb = function (d) {
};

TMPL.pages = function (d, id, p) {
    var o = document.getElementById('page-' + id);
    if (!o) return;
    o.innerHTML = '';
    if(!d)return;
    this.page = parseInt(d['pageNum']);//当前页
    this.pagemax = parseInt(d['totalPage']);//总页数
    var endPage = this.pagemax > this.page + 2 ? this.page + 2 : this.pagemax;
    if (this.pagemax == 0) {
        o.innerHTML = '';
        return;
    }
    this.id = id;
    var prevPage = this.page - 1, nextPage = this.page + 1;
    if (prevPage < 1) {
        var strHtml = '<li class="active disabled not-allow"><a> <i class="icon-angle-left"></i></a> </li>';
    } else {
        var strHtml = '<li> <a onclick="' + id + '(' + prevPage + ');"> <i class="icon-angle-left"></i> </a> </li>';
    }
    if (this.page != 1) strHtml += '<li> <a onclick="' + id + '(1);">1</a> </li>';
    if (this.page >= 5) strHtml += '<li><a onclick="javascript:void(0)">...</a></li>';
    for (var i = this.page - 2; i <= endPage; i++)if (i > 0) {
        if (i == this.page) {
        //if (p == i) {
            strHtml += '<li class="active disabled"> <a>' + i + '</a> </li>';
        } else if (i != 1 && i != this.pagemax) {
        //} else if (i != this.pagemax){
            strHtml += '<li> <a onclick="' + id + '(' + i + ');">' + i + '</a> </li>';
        }
    }
    if (this.page + 3 < this.pagemax) strHtml += '<li><a onclick="javascript:void(0)">...</a></li>';
    if (this.page != this.pagemax) strHtml += '<li> <a onclick="' + id + '(' + this.pagemax + ');"> ' + this.pagemax + ' </a> </li>';
    if (nextPage > this.pagemax) {
        strHtml += '<li class="active disabled not-allow"> <a> <i class="icon-angle-right"></i> </a> </li>';
    } else {
        strHtml += '<li> <a onclick="' + id + '(' + nextPage + ');"> <i class="icon-angle-right"></i> </a> </li>';
    }
    o.innerHTML = strHtml;
};

function Dom(o) {
    return document.getElementById(o);
}

//弹出层
function showDialog(id, maskclick) {
    // 遮罩
    console.log("遮罩")
    $('#' + id).removeClass('modal-out').addClass('styled-pane');
    var dialog = Dom(id);
    dialog.style.display = 'block';
    if (Dom('mask') == null) {
        $('html').prepend('<div class="ui-mask" id="mask" onselectstart="return false"></div>');
        if (!maskclick)
            $('#mask').bind('click', function () {
                //hideDialog(id)
            })
    }
    var mask = Dom('mask');
    mask.style.display = 'inline-block';
    mask.style.width = document.body.offsetWidth + 'px';
    mask.style.height = document.documentElement.clientHeight + 'px';
    //居中
    var bodyW = document.documentElement.clientWidth;
    var bodyH = document.documentElement.clientHeight;
    var elW = dialog.offsetWidth;
    var elH = dialog.offsetHeight;
    dialog.style.left = (bodyW - elW) / 2 + 'px';
    dialog.style.top = (bodyH - elH) / 2 + 'px';
    dialog.style.position = 'fixed';
}
// 关闭弹出框
function hideDialog(id, fn) {
    $('#' + id).removeClass('styled-pane').addClass('modal-out');
    $('#mask').addClass('out');
    setTimeout(function () {
        $('#' + id).hide();
        $('#mask').remove();
    }, 300);
    if (typeof fn == 'function') fn();
}
function inputFB(){
    $("input").each(function(){
        var t = $(this);
        if(t.attr('type')=='text') {
            if($(this).val()==''){
                $(this).val($(this).attr('placeholder'));
            }
        }
    });
    $('input').focus(function(){
        var t = $(this);
        t.addClass('cur');
        if(t.val() == t.attr('placeholder')) t.val('');
        if(t.attr('type')=='text'||t.attr('type')=='password')t.css({'box-shadow':'0px 0px 3px #1688d0','border':'1px solid #1688d0','color':'#222'});
    });
    $('input').blur(function(){
        var t = $(this);
        t.removeClass('cur');
        if(t.attr('type')=='text'||t.attr('type')=='password')t.css({'box-shadow':'none','border':'1px solid #e1e1e1','color':'#a0a0ab'});
        if(t.attr('type')!='password' && !t.val()) t.val(t.attr('placeholder'));
    });
}
function inputjy() {
    $('.chart-buy input').focus(function () {
        var t = $(this);
        if (t.attr('type') == 'text' || t.attr('type') == 'password')t.css({'border': '1px solid #fff;', 'color': '#222'});
        if (t.val() == t.attr('placeholder')) t.val('');
    });
    $('.chart-buy input').blur(function () {
        var t = $(this);
        if (t.attr('type') == 'text' || t.attr('type') == 'password')t.css({'box-shadow': 'none', 'border': '1px solid #e4e5e9', 'color': '#222'});

    })
}
$(function(){
    if (os.is360se || os.is360se) inputFB();
    inputjy();
});

// var inputLen = 8;
//格式化小数
//@f float 传入小数: 123; 1.1234; 1.000001;
//@size int 保留位数
//@add bool 进位: 0舍 1进
function formatfloat(f, size, add){
    f = parseFloat(f);
    var conf = {2:[100, 0.01], 3:[1000, 0.001], 4:[10000, 0.0001], 5:[100000, 0.00001], 6:[1000000, 0.000001], 7:[10000000, 0.0000001], 8:[100000000, 0.00000001]};
    var conf = conf[size];
    var ff = Math.floor(f * conf[0]) / conf[0];
    if(add && f > ff) ff += conf[1];
    if(ff > 0) return ff;
    return 0;
}
function subMoneyKeyUp(obj,event){
    var str;
    //str为保留小数
    event = event ? event : window.event;
    if(typeof event !='undefined' && (event.keyCode == 37 || event.keyCode == 39)){
        return;
    }
    //输入时输入框的刷新开关
    // if(event.target.id=='buy-price'){
    //     BP=1;
    // }else if(event.target.id=='sell-price'){
    //     SP=1;
    // }
    var z;
    //根据币种控制精度
    if(event.target.id.indexOf('price')>-1){
        str=pointData(getRequestByName("shortName"),'pricePre')||8;
    }else{
        str=pointData(getRequestByName('shortName'),'numberPre')||4;
        if(event.target.id=='buy-number'&&obj.value>Number($('#buy-max-input').html())){
            obj.value=$('#buy-max-input').html();
        }
    }
    if(str == 2){
        z = /\d+(\.\d{0,2})?/;
    }else if(str == 3){
        z = /\d+(\.\d{0,3})?/;
    }else if(str == 4){
        z = /\d+(\.\d{0,4})?/;
    }else if(str == 5){
        z = /\d+(\.\d{0,5})?/;
    }else if(str == 6){
        z = /\d+(\.\d{0,6})?/;
    }else if(str == 7){
        z = /\d+(\.\d{0,7})?/;
    }else if(str == 8){
        z = /\d+(\.\d{0,8})?/;
    }else if(str == 9){
        z = /\d+(\.\d{0,9})?/;
    }else if(str == 10){
        z = /\d+(\.\d{0,10})?/;
    }else if(str == 11){
        z = /\d+(\.\d{0,11})?/;
    }else if(str == 12){
        z = /\d+(\.\d{0,12})?/;
    }
    if(str){
        obj.value=(obj.value.match(z)||[''])[0];
    }else {
        obj.value=obj.value.replace(/\D/g,'');
    }

    if(event.target.id.indexOf('price')>-1){
        var type=event.target.id.replace('-price','');
        $('.dollarOrRmb_'+type).html(getCurrencySymbol()+to_num(currentCoinRate[getLang_rate()+'Para']*Number(obj.value)))
    }
}
//坏数字
function badFloat(num, size){
    if(isNaN(num)) return true;
    num += '';
    if(-1 == num.indexOf('.')) return false;
    var f_arr = num.split('.');
    if(f_arr[1].length > size){
        return true;
    }
    return false;
}
//小数位数
function vNum(o, len){
    if (isNaN(o.value)) o.value = '';
    var value = len?formatfloat(o.value, len, 0):parseInt(o.value);
    if(badFloat(o.value, len)) o.value = value
}
//dialog_login
function dialog_login(){
    var html = '';
    html += '<div class="dialog_content styled-pane" id="dialog_login">' +
        '<a id="closeBtn" href="javascript:hideDialog(\'dialog_login\');" class="dialog_closed" title="关闭">×</a>' +
        '<div class="sign_box sign_box_bound">' +
        '<p class="t">Sign In</p>' +
        '<form id="login-form" action="">' +
        '<input type="text" id="email" name="email" placeholder="Email">' +
        '<input type="password" name="pw" placeholder="Password">' +
        '<input style="display: none;" type="text" name="ga" placeholder="GA Password">' +
        '<input type="button" class="btn" onclick="login()" value="登录">' +
        '</form>' +
        '<p class="has"><a href="/user/forgetpw" class="blue">Forgot password？</a> · <span>Don\'t have an account？</span> <a href="/user/register" class="blue">Sign Up</a></p></div>' +
        '</div>'
    $('body').prepend(html);
    showDialog('dialog_login');
}
function dialog_forgetpw(){
    var html = '';
    html += '<div class="dialog_content styled-pane" id="dialog_forgetpw">' +
        '<a id="closeBtn" href="javascript:hideDialog(\'dialog_forgetpw\');" class="dialog_closed" title="关闭">×</a>' +
    '<div class="forgetpw_box">' +
    '<h2>恭喜您申请找回密码成功!</h2>' +
    '<p>系统已发送一封密码重置邮件到您的注册邮箱，请登录邮箱重置。</p>' +
    '<a class="btn" onclick="hideDialog(\'dialog_forgetpw\')">确定</a>' +
    '</div>' +
    ' </div>';
    $('body').prepend(html);
    showDialog('dialog_forgetpw');
}
//转出弹出框
function dialog_withdraw(){
    var html = '';
    html += '<div class="dialog_content styled-pane" id="dialog_forgetpw">' +
        '<a id="closeBtn" href="javascript:hideDialog(\'dialog_forgetpw\');" class="dialog_closed" title="关闭">×</a>' +
        '<div class="forgetpw_box withdraw_box">' +
        '<p>请进入注册邮箱进行姓名及生日信息确认。<br>确认无误后，平台将审核转出申请</p>' +
        '<a class="btn" onclick="hideDialog(\'dialog_forgetpw\')">确定</a>' +
        '</div>' +
        ' </div>';
    $('body').prepend(html);
    showDialog('dialog_forgetpw');
}
//短信验证码弹窗
function dialog_code() {
    $('#dialog_code').remove();
    var html = '';
    html += '<div class="dialog_content" id="dialog_code">' +
        '<a id="closeBtn" href="javascript:hideDialog(\'dialog_code\');" class="dialog_closed" title="关闭">×</a>' +
        '<div class="code_box">' +
        '<p class="t">请输入验证码</p>' +
        '<p class="po_re"><input class="code_input" type="text" id="captcha"><img onclick="recode()" id="captchaimg" src="/servlet/ValidateImageServlet?0.21460079976371382"/></p>' +
        '<p><a class="blue" onclick="recode()">看不清，再换一张</a></p>' +
        '<a class="btn" data-adopt="0" id="adopt_btn" onclick="getmocode(); hideDialog(\'dialog_code\');">确定</a>' +
        '</div>' +
        ' </div>';
    $('body').prepend(html);
    showDialog('dialog_code');
}
function dialog_active(){
	var name = $('#name').val();
	var time  = $('#time').val();
    var html = '';
    if (name == lang('请输入您的姓名') || time == lang('请输入您的生日')) {
        alert(lang('请输入信息'));
        return false;
    }
    html += '<div class="dialog_content styled-pane" id="dialog_active">' +
        '<a id="closeBtn" href="javascript:hideDialog(\'dialog_active\');" class="dialog_closed" title="关闭">×</a>' +
        '<div class="forgetpw_box register_box">' +
        '<h2>' + lang('身份信息确认') + '</h2>' +
        '<p>' + lang('以下生日和姓名信息一旦登录不可更改，请确认并牢记！') + '</p>' +
        '<p style="font-size: 13px; color:#ff6767;">' + lang('该信息将用于修改支付密码或修改GA验证码') + '</p>' +
        '<p style="padding-left: 103px;text-align: left; margin-top: 20px;letter-spacing: 1px;">' + lang('姓名') + '：' + name + '</p>' +
        '<p style="padding-left: 103px;text-align: left; margin-top: 10px;letter-spacing: 1px;">' + lang('生日') + '：' + time + '</p>' +
        '<a class="btn left" href="javascript:void(0)"  onclick="active()"   style="width: 190px;">'+lang('确定')+'</a>' +
        '<a class="btn right"  href=""  style="width: 190px;">' + lang('重新输入') + '</a>' +
        '</div>' +
        ' </div>';
    $('body').prepend(html);
    showDialog('dialog_active');
}


function contact(p) {
    // TMPL.list(p, {url: requestUrl, name: 'contact'});
	TMPL.list(p, {url: WebHelper.QueryTrades, name: 'contact'});
}
function xian(type,_stop){
    bprice = $('#buy-price').val();
    bp = $('#buy-price-well').text();
    sprice = $('#sell-price').val();
    sp = $('#sell-price-well').text();
    type == 'buy'?  price = (bprice-bp)/bp*100:price = (sprice-sp)/sp*100;
    if(Math.abs(price) > 10){
        if(_stop=='isStop') return true;
        type == 'buy'? bprice !=''?$('#buy-price').prev().fadeIn(1000).delay(3000).fadeOut(400):'':sprice !=''?$('#sell-price').prev().fadeIn(1000).delay(3000).fadeOut(200): '';
        //价格偏差过大，阻止提交
        // if(type==1){
        //     $('#buy-price').val('');
        // }else{
        //     $('#sell-price').val('');
        // }
    }
}
function recode(){
    $('#captcha').val('').focus();
    $('#captchaimg').attr('src', '/servlet/ValidateImageServlet?'+Math.random());
}
//验证码弹窗
function code_popup() {
    $('#popup_code').remove();
    $('body').prepend('<div class="ui-dialog" id="popup_code"></div>');
    $('#popup_code').html($('#for_popup_code').html());
    showDialog('popup_code');
}
//多次登录弹窗
function more_login() {
    $('#more_login').remove();
    $('body').prepend('<div class="ui-dialog" id="more_login"></div>');
    $('#more_login').html($('#for_more_login').html());
    showDialog('more_login');
}
//判断密码强度
function CheckIntensity(pwd,_this){
    var Mcolor,Wcolor,Scolor,Color_Html,Word_Html;
    var m=0;
    var Modes=0;
    for(i=0; i<pwd.length; i++){
        var charType=0;
        var t=pwd.charCodeAt(i);
        if(t>=48 && t <=57){charType=1;}
        else if(t>=65 && t <=90){charType=2;}
        else if(t>=97 && t <=122){charType=4;}
        else{charType=4;}
        Modes |= charType;
    }
    for(i=0;i<5;i++){
        if(Modes & 1){m++;}
        Modes>>>=1;
    }
    if(pwd.length<=0){m=0;}
    if(/(?=.*\d)(?=.*[a-zA-Z]).{0,5}/.test(pwd)){m=1;}
    if(/(?=.*\d)(?=.*[a-zA-Z]).{6,10}/.test(pwd)){m=2}
    if(/(?=.*\d)(?=.*[a-zA-Z]).{11,}/.test(pwd)){m=3;}
    switch(m){
        case 1 :
            Wcolor="pwd pwd_Weak_c";
            Mcolor="pwd pwd_c";
            Scolor="pwd pwd_c";
            Word_Html=lang('弱');
            Color_Html="pwd pwd_Weak_Word_c";
            break;
        case 2 :
            Wcolor="pwd pwd_Medium_c";
            Mcolor="pwd pwd_Medium_c";
            Scolor="pwd pwd_c";
            Word_Html=lang('中');
            Color_Html="pwd pwd_Medium_Word_c";
            break;
        case 3 :
            Wcolor="pwd pwd_Strong_c";
            Mcolor="pwd pwd_Strong_c";
            Scolor="pwd pwd_Strong_c";
            Word_Html=lang('强');
            Color_Html="pwd pwd_Strong_Word_c";
            break;
        default :
            Wcolor="pwd pwd_c";
            Mcolor="pwd pwd_c";
            Scolor="pwd pwd_c";
            Word_Html=lang('无');
            Color_Html="pwd pwd_Word_c";
            break;
    }
    if(_this){
        $('.pwd_Weak').attr('class','pwd_Weak '+Wcolor);
        $('.pwd_Medium').attr('class','pwd_Medium '+Mcolor);
        $('.pwd_Strong').attr('class','pwd_Strong '+Scolor);
        $('.pwd_html').attr('class','pwd_html '+Color_Html);
        $('.pwd_html').html(Word_Html);
    }else{
        document.getElementById('pwd_Weak').className=Wcolor;
        document.getElementById('pwd_Medium').className=Mcolor;
        document.getElementById('pwd_Strong').className=Scolor;
        document.getElementById('pwd_html').className=Color_Html;
        document.getElementById('pwd_html').innerHTML=Word_Html;
    }
}
//验证密码强度不能为弱密码
function checkPassWordNoFeeble(str) {
    if(/(?=.*\d)(?=.*[a-zA-Z]).{5,}/.test(str)==false){
        return true;
    }else{
        return false;
    }
}
//发短信按钮
function getcodes(i){
    var msg =  i == 1?'短信验证码':'语音验证码';
    if(i) codetype = i;
    show_captcha();
}
codetype = 1;
//确认按钮
var wait=60;
function time() {
    var o=document.getElementById("btn-mobile-sms1_1")
    if (wait == -1) {
        $('.btn-mobile-sms1').show();
        $('#btn-mobile-sms1_1').hide();
        wait = 60;
    } else {
        o.innerHTML="(" + wait + ")"+(((typeof os != 'undefined') && (typeof os.isPc != 'undefined') && os.isPc) ? "秒后重新获取":"s");
        wait--;
        mobiletimer = setTimeout(function(){time()}, 1000)
    }
}
var wait2=60;
function time2() {
    var o=document.getElementById("btn-mobile-tel1_1")
    if (wait2 == -1) {
        $('.btn-mobile-tel1').show();
        $('#btn-mobile-tel1_1').hide();
        wait2 = 60;
    } else {
        o.innerHTML="(" + wait2 + ")"+(((typeof os != 'undefined') && (typeof os.isPc != 'undefined') && os.isPc) ? "秒后重新获取":"s");
        wait2--;
        mobiletimer2 = setTimeout(function() {time2()}, 1000)
    }
}
var wait3 = 60;
function time3() {
    var o=document.getElementById("btn-mobile-sms_1");
    if (wait3 == -1) {
        $('#send_email').show();
        $('#btn-mobile-sms_1').hide();
        wait3 = 60;
    } else {
        o.innerHTML="" + wait3 + "秒后重新获取";
        wait3--;
        mobiletimer3 = setTimeout(function() {time3()}, 1000)
    }
}