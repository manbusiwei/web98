

var coinShortName = getRequestByName("shortName")||'bch';
var coinId = getRequestByName("id")||COIN[coinShortName][1];
var currentCoinRate=null;//取出当前币种的所有汇率值
localStorage.setItem('coinType',getRequestByName('coinType')||1);
//	var params=location.search.split('?')[1];
//	var pArr=params.split('&');
//	var paramsObj={};
//	for(var i=0;i<pArr.length;i++){
//		var o=pArr[i].split('=')[0];
//		paramsObj[o]=pArr[i].split('=')[1];
//	}
//	var coinId=paramsObj['id'];
//	var coinShortName=paramsObj['shortName'];
$("input[name='symbol']").each(function(){
	$(this).attr("value", coinId);
});
function btvs(){ return Math.random(); }
//大于1，保留两位小数，小于1保留8位小数
function getPointNum(num) {
    if(!num)return;
    if(num>=1){
        return num.toFixed(2);
    }else{
        return num.toFixed(8);
    }
}
//历史成交记录
function history() {
    $.ajax({
        type:'GET',
        url:WebHelper.QueryHistory,
        data:'id='+coinId+'&t='+btvs(),
        async:false,
        success: function (result) {
            if(result.status=='-2001'){
                alert(result.msg)
                location.href='/';
                return;
            }
            historyAddHtml(result,'api');
        }
    })
    // historyWs();
}
//委托信息查询
function trades() {
    var trades = {sell: {html: '', sn: 1000}, buy: {html: '', sum: 0, sn: 1000}};
    $.getJSON(WebHelper.QueryTrades+"?id="+coinId+"&t="+btvs(), function (result) {
    	var d = result.data;

		if (typeof BP == 'undefined'){
            if(d.sell.length > 0)$('#buy-price').val(to_num(d.sell[0].fprize));
            if(d.buy.length > 0)$('#sell-price').val(to_num(d.buy[0].fprize));
            BP=1;
		}
        $('#sell-price-index,#buy-price-well').html(d.sell.length > 0?d.sell[0].fprize:0);

        $('#buy-price-index,#sell-price-well').html(d.buy.length > 0?d.buy[0].fprize:0);
        var sort = [], vol = 0;
        var sell_num = 0;
        for (var i = 0; i < trades.sell.sn; i++) {
            if (typeof d.sell[i] != 'undefined') {
                sort[i] = vol += d.sell[i].fleftCount;
                sell_num += parseFloat(d.sell[i].fleftCount);
            }
        }
        for (var i = trades.sell.sn - 1; i >= 0; i--) {
            if (typeof d.sell[i] == 'undefined') continue;
            var pt = ((d.sell[i].fleftCount / sell_num).toFixed(2)) * 100;
            trades.sell.html += '<dd  onclick="autotrust(this,\'sell\')"> <div  class="sidebar_bg_red" style="width: '
            					+ pt + '%"></div> <div class="w_33t red">' + lang('卖') + (i + 1) + '</div> <div class="w_33p is_num"  >'
            					+ d.sell[i].fprize + '</div> <div class="w_33p is_num" data-point="'+pointData(coinShortName,'numberPre')+'">' + d.sell[i].fleftCount + '</div></div> <div style="display: none;" class="w_80">'
            					+ formatfloat(d.sell[i].fleftCount*d.sell[i].fprize, 4, 0) + '</div> </dd>';
        }
        var Buy_num = 0;
        $('#orderbook-sell').html(trades.sell.html);
        for (var i = 0; i < trades.buy.sn; i++) {
            if (typeof d.buy[i] == 'undefined') continue;
            Buy_num += parseFloat(d.buy[i].fleftCount);
        }
        $("#orderbook-sell").scrollTop($('#orderbook-sell')[0].scrollHeight);
        vol = 0;
        for (var i = 0; i < trades.buy.sn; i++) {
            if (typeof d.buy[i] == 'undefined') continue;
            trades.buy.sum = FF.add(trades.buy.sum, d.buy[i].fleftCount);
            vol += d.buy[i].fleftCount;
            var pt = ((d.buy[i].fleftCount / Buy_num).toFixed(2)) * 100;
            trades.buy.html += '<dd onclick="autotrust(this,\'buy\')"> <div class="sidebar_bg_green" style="width: '
            					+ pt + '%"></div><div class="w_33t green">' + lang('买') + (i + 1) + '</div> <div class="w_33p is_num"  >'
            					+ d.buy[i].fprize + '</div> <div class="w_33p is_num" data-point="'+pointData(coinShortName,'numberPre')+'">' + d.buy[i].fleftCount + '</div></div> <div class="w_80" style="display: none;">'
            					+ formatfloat(d.buy[i].fleftCount*d.buy[i].fprize, 4, 0) + '</div> </dd>';
        }
        //委托信息
        // $('#orderbook-buy').html(trades.buy.html=trades.buy.html==''?'<p class="no-records">'+lang('暂无记录')+'</p>':trades.buy.html);
        $('#orderbook-buy').html(trades.buy.html);
        maxbuy();
        goods_num();
        setTimeout('trades()', 5000);
    });
}
function myorders() {
	TMPL.list(1, {url: WebHelper.QueryOrders, data: {'symbol':coinId, 'flag':1}, name: 'orders'});
    // if($.cookie('USER')){
    //     var url=WsApi.list+coinId+'/'+$.cookie('USER').split(',')[0];
    //     var ws=new WebSocket(url);
    //     ws.onmessage=function(res){
    //         var d=JSON.parse(res.data);
    //         if ('' == d.data || null == d.data) {
    //             $('#grid-orders').html('<p class="no-records">'+lang('暂无记录')+'</p>');
    //         } else {
    //             $('#tmpl-orders').tmpl(d.data).htm('#grid-orders');
    //         }
    //         goods_num();
    //     }
    // }
}
function order_cancel(id){
	// var status = confirm(lang("确认要撤销？"));
	if(true){
		$.get(WebHelper.CancelTrade,{'id':id,'token':$.cookie('token')},function(d){
			if(d.status === 1){
                alert(lang('撤销成功'));
				// location.reload();
                useToRefresh();
            }else{
                alert(lang(d.msg));
            }

        })
	}
}
//买卖币种
function tradeadd(type){
    if(!USER){
        if(confirm(lang('请登录后再操作'))){
            location.href='/user/login.html';
        }
        return;
    }
	var url = '';
	var info=$('#'+type+'-price').val()&&$('#'+type+'-number').val();
	if(type == 'buy'){
		url = WebHelper.BuyTrade;
	}else{
		url = WebHelper.SellTrade;
	}
	if(!info){
		$('#tm-' + type).find('span').html(lang('请输入价格和数量'));
		$('#tm-' + type).show().delay(2000).fadeOut();
		return;
	}
	if($('.pwdtrade').css('display')!='none'){
		if($('#'+type+'-pwtrade').val()==''){
			$('#tm-' + type).find('span').html(lang('密码不能为空'));
			$('#tm-' + type).show().delay(2000).fadeOut();
			return;
		}
	}
    if(xian(type,'isStop')&&!confirm(lang('价格与市场价偏差过大，确认提交？')))return;
    $.post(url, $('#form-tradeadd-' + type).serialize()+'&token='+$.cookie('token'), function (d) {
       	if(d.status == -9){
			alert(lang('请登录后再操作'));
			clearCookie();
            location.href='/user/login.html';
			return false;
		}
        if (!ltcb(d))return;
        if(d.status == 1){
            alert(lang('操作成功'));
            /*$('#form-tradeadd-'+type)[0].reset();*/
            $('.pwdtrade').hide();
            useToRefresh()
            // location.reload();
        } else{
            $('#tm-' + type).find('span').html(lang(d.msg));
            $('#tm-' + type).show().delay(2000).fadeOut();
            if (d.data == 'pwtrade') {
                location.href = '/security/upadteTradePw.html';
            }
        }
    }, 'json');
}
function useToRefresh(){
    myorders();
    FINANCE=0;
    balance();
    maxbuy();
}
function balance_cb() {
    $('#btc_balance').html(formatfloat(FINANCE.data['btc_balance'], 6));
    $('#btc_lock').html(formatfloat(FINANCE.data['btc_lock'], 6));
    $('#' + coinShortName + '_balance').html(FINANCE.data[coinShortName + '_balance']);
    $('#' + coinShortName + '_lock').html(FINANCE.data[coinShortName + '_lock']);
}
function buytotal(){
    var _buy_number=Number($('#buy-number').val());
    if(isNaN(_buy_number)){
        _buy_number=0;
    }
    $('#buy-total').html(to_num($('#buy-price').val() * _buy_number));
    $('#sell-total').html(to_num($('#sell-price').val() * Number($('#sell-number').val())));
    var str='≈ ';
    var allStr='';
    var strnum='';
    var sellstrnum=Number($('#sell-total').html());
    var buystrnum=Number($('#buy-total').html());
    if(currentCoinRate!=null){
        sellstrnum=str+(sellstrnum*currentCoinRate[getLang_rate()+'Para']).toFixed(2)+' '+getLang_rate();
        buystrnum=str+(buystrnum*currentCoinRate[getLang_rate()+'Para']).toFixed(2)+' '+getLang_rate();
    }
	$('#sell_usd').html('（'+sellstrnum+')');
	$('#buy_usd').html('（'+buystrnum+')');
}
function setTab2(name,cursel,n){
    for(i=1;i<=n;i++){
        var menu=document.getElementById(name+i);
        var con=document.getElementById("con_"+name+"_"+i);
        menu.className=i==cursel?"hover":"";
        con.style.display=i==cursel?"block":"none";
    }
}
function autotrust(_this,type){
    // if(type == 'sell'){
        var _num='';
        if(_this==''){
            _num=to_num(type);
        }else{
            _num=$(_this).children().eq(1).html();
        }
        $('#buy-price').val(_num).css({
            'color':'#222',
            'font-size':'14px'
        });
    // }
    // if(type == 'buy'){
        $('#sell-price').val(_num).css({
            'color':'#222',
            'fontSize':'14px'
        });
    // }
        $('.dollarOrRmb_buy').html(getCurrencySymbol()+to_num(currentCoinRate[getLang_rate()+'Para']*Number(_num)))
        $('.dollarOrRmb_sell').html(getCurrencySymbol()+to_num(currentCoinRate[getLang_rate()+'Para']*Number(_num)))
}

// 最大可卖
function sell_max(){
	if(typeof(FINANCE.data)=="undefined"){
		return false;
	}
		$('#sell-max').html(formatfloat(FINANCE.data[coinShortName+'_balance'], 3));
        // $('#max-sell-input').html(formatfloat(FINANCE.data[coin+'_balance'], 3));
		$('#max-sell-input').html(to_num(FINANCE.data[coinShortName+'_balance']));
}
// 最大可买
function maxbuy(){
    if(!FINANCE || FINANCE == 1 || !parseFloat($('#buy-price').val()))return;
	if(typeof(FINANCE.data)=="undefined"){
		return false;
	}
    // var max = formatfloat(FINANCE.data['btc_balance']/parseFloat($('#buy-price').val()), 8, 0);
	var max = FINANCE.data[allMarkets[localStorage.getItem('coinType')]+'_balance']/(parseFloat($('#buy-price').val()));
	$('#buy-max').html(max);
	$('#buy-max-input').html(to_num(max,pointData(coinShortName,'numberPre')));
}
function slider(){
    var type = ['sell','buy'];
    for(var i in type){
        $("#slider_"+type[i]).slider({
            value: 0,min: 0, max: 100,step: 10,range: "min",slide: function(a, t) {
                var type = $(t.handle).attr('data_slide');
                var e = parseFloat($("#"+type+'-max').text());
                if(isNaN(e)) e=0;
                $("#"+type+' .ui-slider-handle').addClass('ui-state-focus ui-state-active');
                $("#"+type+"-number").val(Math.floor((e / 100 * t.value)*1000)/1000);
                $("#ratio_num_"+type).text(t.value + "%");
            }
        })
    }
}
$(function(){
    $('.finddeal_currency .coin-name').append('<span class="blod_span">'+coinShortName.toLocaleUpperCase()+'</span>/'+allMarkets[localStorage.getItem('coinType')].toUpperCase());//更新页面中币种简称
	$('.chart-buy-all .coin-name').append('<span class="blod_span">'+coinShortName.toLocaleUpperCase()+'</span>');//更新页面中币种简称
	$('.coin_40').addClass('coin_'+coinShortName+'_40');//更新币种的小图标
    $('.jy-email,#userinfo').hover(
        function(){$('.jy-email').addClass('selected');$('#userinfo').addClass('selected').css('z-index',100);$('.header').css('z-index',-100);$('.hdslide').css('z-index',-100);$('.page').css('z-index',-100);},
        function(){$('.header').css('z-index',19);$('.email').removeClass('selected');$('#userinfo').removeClass('selected');$('.hdslide').css('z-index',0);$('.page').css('z-index','auto');}
    );
    // allcoin()//
    history();//历史成交记录
    //增量推送
    historyWs();
    // trades();//委托信息
    tradesWs();
    myorders();//当前委托（我的订单）
    slider();//
    setInterval('buytotal()',500)
    setTimeout(function () {
        maxbuy();
        sell_max();
    }, 500);
    delayDepthRander();
    $('#chart-control .btn').click(function(){
        var _this=$(this);
        if(_this.hasClass('forbidBtn'))return;
        _this.addClass('btn_active').siblings().removeClass("btn_active");
        k_line(_this.html(),coinShortName.toUpperCase());
    })
    k_line('30m',coinShortName.toUpperCase());
});
var chart = {
        // symbol: COIN + "_CNY",
        // symbol_view: COIN + "/CNY",
        ask: 0,
        data: {
            "5m": [],
            "15m": [],
            "30m": [],
            "1h": [],
            "8h": [],
            "1d": []
        }
    };
function k_line(m,c) {
    // if(chart.data[m].length>0)return randerChart(m,c,chart);
    $.get(WebHelper.kLine,{fviFid:coinId},function (d) {
        if(d.status==1){
            for(i in d.data){
                if(d.data[i].length==0){
                    $('#chart-control').find('span:contains('+i+')').addClass('forbidBtn');
                    continue;
                }
                chart.data[i]=d.data[i];
                clearInterval(chart[i+'_interval']);
            }
            randerChart(m,c,d);
        }
    })
}
function randerChart(m,c,d) {
    //图表设置
    Highcharts.setOptions({
        global:{
            useUTC:false
        },
        colors: ['#DD1111', '#FF0000', '#DDDF0D', '#7798BF', '#55BF3B', '#DF5353', '#aaeeee', '#ff0066', '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
        lang: {
            loading: 'Loading...',
            months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            // shortMonths: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            // weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            decimalPoint: '.',
            numericSymbols: ['k', 'M', 'G', 'T', 'P', 'E'],
            // resetZoom: 'Reset zoom',
            // resetZoomTitle: 'Reset zoom level 1:1',
            // thousandsSep: ','
        },
        credits: {
            enabled: false
        }
    });
    // if (typeof (chart) == 'undefined') {

    // }
    var datas = chart.data[m]
      , rates = []
      , vols = [];
    if (datas.length < 1) {
        $('.kline_loading').html(lang('暂无内容'));
        // $('.kline_depth').html(llan);
        return;
    }
    for (i = 0; i < datas.length; i++) {
        rates.push([
            datas[i][0],        //时间
            Number(datas[i][1]),//开盘价
            Number(datas[i][3]),//最高价
            Number(datas[i][4]),//最低价
            Number(datas[i][2]),//收盘价
        ]);
        vols.push([
            datas[i][0],
            Number(datas[i][5])//成交量
        ]);
    }
    // if(rates.length>96){//取96条
    //     rates=rates.slice(-96)
    //     vols=vols.slice(-96)
    // }
    var groupingUnits = [['week', [1]], ['month', [1, 2, 3, 4, 6]]];

    Highcharts.StockChart({
        chart: {
            renderTo: 'kline_canvasBox',
            height: 375,
            // backgroundColor:'#47475C',
            zoomType: 'x',
            events : {
                load : function () {
                    // set up the updating of the chart each second
                    clearInterval(chart[m+'_interval'])
                    var series = this.series;
                    chart[m+'_interval']=setInterval(function () {
                        // var x = (new Date()).getTime();
                        // current timey = Math.round(Math.random() * 100);
                        var ws=new WebSocket(WsApi.kLine+coinId);
                        $.get(WebHelper.realTimeData+'?t='+Math.random(),{fviFid:coinId},function (d) {
                        // ws.onmessage=function(res){
                        //     var d={};
                        //     d.data=JSON.parse(res.data);
                            if(d.data[m].length>0){
                                var dataLength=datas.length;
                                var new_data=d.data[m][0];
                                if(new_data[0]!=datas[dataLength-1][0]){
                                    // datas.push(new_data);
                                    series[0].addPoint([
                                        new_data[0],
                                        Number(new_data[1]),
                                        Number(new_data[3]),
                                        Number(new_data[4]),
                                        Number(new_data[2])], true, true);
                                    series[1].addPoint([
                                        new_data[0],
                                        Number(new_data[5])], true, true);
                                }
                                for(var i in d.data){
                                    if(d.data[i].length>0){
                                        var oldDatalength=chart.data[i].length;
                                        if(d.data[i][0][0]!=chart.data[i][oldDatalength-1][0])
                                        chart.data[i].push(d.data[i][0]);
                                    }
                                    if(i!=m)clearInterval(chart[i+'_interval'])
                                }
                            }
                        })
                        // }
                    }, 60*1000);
                }
            }
        },
        navigator: {
            margin: 5
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                millisecond: '%H:%M:%S.%L',
                second: '%H:%M:%S',
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%m-%d',
                week: '%m-%d',
                month: '%y-%m',
                year: '%Y'
            }
        },
        plotOptions: {
            candlestick: {
                lineColor: "#333",
                color: '#e55600',
                upColor: '#690'
            }
        },
        tooltip: {
            split: false,
            // pointFormat:'{point.y:,.8f}',
            shared: true,
            xDateFormat: '%Y-%m-%d %H:%M %A',
            color: '#f0f',
            // changeDecimals: 12,
            borderColor: '#058dc7',
            // valueDecimals:pointData(coinShortName,'pricePre')>9?9:pointData(coinShortName,'pricePre')
        },
        rangeSelector: {
            buttons: [{
                type: 'minute',
                count: 60,
                text: '1h'
            }, {
                type: 'minute',
                count: 120,
                text: '2h'
            }, {
                type: 'minute',
                count: 360,
                text: '6h'
            }, {
                type: 'minute',
                count: 720,
                text: '12h'
            }, {
                type: 'day',
                count: 1,
                text: '1d'
            }, {
                type: 'week',
                count: 1,
                text: '1w'
            }, {
                type: 'all',
                text: 'ALL'
            }],
            // selected: getSubMenuGap(m),
            selected:6,
            inputEnabled: false
        },
        exporting: {
            enabled: false,
            buttons: {
                exportButton: {
                    enabled: false
                },
                printButton: {
                    enabled: true
                }
            }
        },
        yAxis: [{
            crosshair: true,
            labels: {
                style: {
                    color: '#7CB5EC'
                },
                formatter:function(){
                    return to_num(this.value)
                }
            },
            title: {
                text: lang('价格')+'['+c+']',
                style: {
                    color: '#7CB5EC'
                },
            },
            height: '70%',
            lineWidth: 2,
            gridLineDashStyle: 'Dash'
        }, {
            labels: {
                style: {
                    color: '#4572A7'
                },
                formatter:function(){
                    return to_num(this.value,pointData(coinShortName,'numberPre'))
                }
            },
            title: {
                text: lang('成交量')+'[' + c + ']',
                style: {
                    color: '#4572A7'
                }
            },
            offset: 0,
            top: '75%',
            height: '25%',
            lineWidth: 2,
            gridLineDashStyle: 'Dash',
            showLastLabel: true,
            // valueDecimals:pointData(coinShortName,'pricePre')>9?9:pointData(coinShortName,'pricePre')
        }],
        series: [{
            animation: true,
            name: lang('价格')+'['+c+']',
            type: 'candlestick',
            color: '#ff6767',
            lineColor: '#ff6767',
            upColor: '#1bc676',
            upLineColor:'#1bc676',
            tooltip:{
                // changeDecimals:12
                pointFormatter:function(){
                    return '\x3cspan style\x3d"color:'+this.color+';font-weight:100"\x3e\u25cf\x3c/span\x3e \x3cb\x3e '+this.series.name+'</span><br>'
                            +'<span>'+lang('开盘')+':'+to_num(this.open)+'</span><br>'
                            +'<span>'+lang('最高')+':'+to_num(this.high)+'</span><br>'
                            +'<span>'+lang('最低')+':'+to_num(this.low)+'</span><br>'
                            +'<span>'+lang('收盘')+':'+to_num(this.close)+'</span><br>'
                }

            },
            dataGrouping: {
                units: groupingUnits,
                enabled: false
            },
            data: rates
        },{
            animation: true,
            name: lang('成交量')+'['+c+']',
            type: 'column',
            color: '#7CB5EC',
            tooltip:{
                pointFormatter:function(){
                    return '\x3cspan style\x3d"color:'+this.color+';font-weight:100"\x3e\u25cf\x3c/span\x3e \x3cb\x3e '+this.series.name+'</span>:'+to_num(this.y);
                }
            },
            dataGrouping: {
                units: groupingUnits,
                enabled: false
            },
            yAxis: 1,
            data: vols
        }]
    });
}

//根据选定间隔，返回间隔秒数
function getKlineSeconds(str) {
    switch (str){
        case '1m': return 60*1000;
        case '5m': return 5*60*1000;
        case '15m':return 15*60*1000;
        case '30m':return 30*60*1000;
        case '1h': return 60*60*1000;
        // case '8h': return 8*60*60*1000;
        case '8h': return 2000;
        case '1d': return 24*60*60*1000;

    }
}
//根据选定间隔，返回子间隔
function getSubMenuGap(str){
    switch (str){
        // case '1m': return 60*1000;
        case '5m': return 2;
        case '15m':return 3;
        case '30m':return 4;
        case '1h': return 4;
        case '8h': return 5;
        case '1d': return 6;
    }
}

var depth_chart =new Highcharts.Chart({
    chart: {
        type: "area",
        renderTo: "depth_canvas",
        // margin:[0,0,0,0]
        // zoomType: 'x'
    },
    title: {
        text: ''
    },
    subtitle: {
    },
    credits: {
        enabled: false
    },
    xAxis: {
        title:{
            text:lang('价格')+'['+coinShortName.toUpperCase()+']'
        },
        // data:xsetData,
        // allowDecimals: false,
        labels: {
            formatter: function () {
                return to_num(this.value);
            }
        },
        // floor:0,
        // ceiling:0.15
    },
    yAxis: {
        title: {
            text: lang('数量')+'['+coinShortName.toUpperCase()+']'
        }
    },
    tooltip: {
        formatter:function(){
            return lang('价格')+':'+to_num(this.x)+'<br>'+lang('数量')+':'+to_num(this.y)
        }
    },
    plotOptions: {
        area: {
            fillOpacity: 0.5,
            marker: {
                enabled: false,
                symbol: 'circle',
                radius: 2,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            }
        }
    },
    series: [{
        name: lang('买'),
        color:'#81DAA6'
    }, {
        name: lang('卖'),
        color:'#FFBAB8'
    }]
});
//深度图延时调用+可见调用
function delayDepthRander(){
    setTimeout(function(){
        if($('.depthBox:visible').length==1){
            depthRander();
        }
        delayDepthRander();
    },5000)
}
//深度图部分
function depthRander() {
    $.get(WebHelper.findDepthDataByFviFid,{fviFid:coinId},function (d) {
        if(d.data){
            var bids=d.data['buy'].sort(function(t,a){
                return a[0]-t[0];
            })
            var asks=d.data['sell'].sort(function(t,a){
               return t[0] - a[0]
            });
            var sellData=[];
            var buyData=[]
            // var useXData=bids.concat(asks);
            for(var i=0;i<bids.length;i++){
                if(i==0){
                    buyData.push([
                        Number(bids[i][0]),
                        Number(bids[i][1])
                    ]);
                    continue;
                }
                //取成交价格50%以内的数据
                if(bids[i][0]<bids[0][0]*0.5)continue;
                buyData.push([
                    Number(bids[i][0]),
                    accAdd(Number(bids[i][1]),buyData[i-1][1])]);
            }
            for(var j=0;j<asks.length;j++){
                if(j==0){
                    sellData.push([
                        Number(asks[j][0]),
                        Number(asks[j][1])]);
                    continue;
                }
                //取成交价格50%以内的数据
                if(asks[j][0]>asks[0][0]*1.5)continue;
                sellData.push([
                    Number(asks[j][0]),
                    accAdd(Number(asks[j][1]),sellData[j-1][1])]);
            }
            depth_chart.series[0].setData(buyData)
            depth_chart.series[1].setData(sellData)
        }
    })
};
//解决浮点数运算丢失精度问题(适用于15位以下)
function accAdd(arg1, arg2) {
    var r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
}
//获取币种详情
function getCoinDetail(){
    $.get(WebHelper.coinDetail,{coinShortName:coinShortName},function(res){
        if(res.status==1&&res.data){
            $('#coinDetail_cont .kline_loading').hide();
            $('#coinDetail_cont .coinDetail').show();
            var d=res.data;
            $('#coinDetail_cont .coin_name').html(d.fvirtualcointype.fname);
            $('#coinDetail_cont .coin_enName').html(d.fvirtualcointype.englishName);
            $('#coinDetail_cont .coin_shortName').html(d.fvirtualcointype.fShortName);
            $('#coinDetail_cont .releaseDate').html(jsonDateFormat(d.releaseTime,'yyyy-MM-dd'));
            $('#coinDetail_cont .cont').html(d.introduction);
            $('#coinDetail_cont .cont a').attr('target','_blank');
            // if(d.links.length==0){
            //     $('#coinDetail_cont .links').hide()
            // }else{
            //     $('#linksBox_tmpl').tmpl(d.links).htm('#coinDetail_cont .linksBox');
            // }
            // if(d.introductionParameters.length==0){
            //     $('#coinDetail_cont .paramsTab').hide()
            // }else{
            //     $('#paramsBox_tmpl').tmpl(d.introductionParameters).htm('#coinDetail_cont .paramsBox');
            // }
        }
    })
}

//ws委托信息查询
function tradesWs() {
    var wsTrades=new WebSocket(WsApi.wsTradesApi+coinId);
    wsTrades.onmessage=function(result){
        var trades = {sell: {html: '', sn: 1000}, buy: {html: '', sum: 0, sn: 1000}};
        var _obj =JSON.parse(result.data);
        var d=_obj.data;
        if (typeof BP == 'undefined'){
            if(d['S'].length > 0){
                $('#buy-price').val(to_num(d['S'][0][0]));
                $(".dollarOrRmb_buy").html(getCurrencySymbol() + to_num(currentCoinRate[getLang_rate() + "Para"] * Number(d['S'][0][0])))
            }
            if(d['B'].length > 0){
                $('#sell-price').val(to_num(d['B'][0][0]));
                $(".dollarOrRmb_sell").html(getCurrencySymbol() + to_num(currentCoinRate[getLang_rate() + "Para"] * Number(d['B'][0][0])))
            }
            BP=1;
        }
        $('#sell-price-index,#buy-price-well').html(d['S'].length > 0?d['S'][0][0]:0);

        $('#buy-price-index,#sell-price-well').html(d['B'].length > 0?d['B'][0][0]:0);
        var sort = [], vol = 0;
        var sell_num = 0;
        for (var i = 0; i < trades.sell.sn; i++) {
            if (typeof d['S'][i] != 'undefined') {
                sort[i] = vol += d['S'][i][1];
                sell_num += parseFloat(d['S'][i][1]);
            }
        }
        for (var i = trades.sell.sn - 1; i >= 0; i--) {
            if (typeof d['S'][i] == 'undefined') continue;
            var pt = ((d['S'][i][1] / sell_num).toFixed(2)) * 100;
            trades.sell.html += '<dd  onclick="autotrust(this,\'sell\')"> <div  class="sidebar_bg_red" style="width: '
                                + pt + '%"></div> <div class="is_num red">'+ d['S'][i][0] + '</div> <div class="is_num" data-point="'+pointData(coinShortName,'numberPre')+'">' + d['S'][i][1] + '</div><div class="is_num" data-point="'+pointData(coinShortName,'pricePre')+'">'
                                + d['S'][i][1]*d['S'][i][0]+ '</div> </dd>';
        }
        var Buy_num = 0;
        $('#orderbook-sell').html(trades.sell.html);
        for (var i = 0; i < trades.buy.sn; i++) {
            if (typeof d['B'][i] == 'undefined') continue;
            Buy_num += parseFloat(d['B'][i][1]);
        }
        $("#orderbook-sell").scrollTop($('#orderbook-sell')[0].scrollHeight);
        vol = 0;
        for (var i = 0; i < trades.buy.sn; i++) {
            if (typeof d['B'][i] == 'undefined') continue;
            trades.buy.sum = FF.add(trades.buy.sum, d['B'][i][1]);
            vol += d['B'][i][1];
            var pt = ((d['B'][i][1] / Buy_num).toFixed(2)) * 100;
            trades.buy.html += '<dd onclick="autotrust(this,\'buy\')"> <div class="sidebar_bg_green" style="width: '
                                + pt + '%"></div><div class="is_num green"  >'+ d['B'][i][0] + '</div> <div class="is_num" data-point="'+pointData(coinShortName,'numberPre')+'">' + d['B'][i][1] + '</div><div class="is_num" data-point="'+pointData(coinShortName,'pricePre')+'">'
                                + d['B'][i][1]*d['B'][i][0]+ '</div> </dd>';
        }
        //委托信息
        // $('#orderbook-buy').html(trades.buy.html=trades.buy.html==''?'<p class="no-records">'+lang('暂无记录')+'</p>':trades.buy.html);
        $('#orderbook-buy').html(trades.buy.html);
        maxbuy();
        goods_num();
        $('#docLoading').hide();
    };
}

//ws历史成交记录,添加心跳检测
function historyWs() {
    var wsUrl = WsApi.wsTransaction+coinId;
    createWebSocket(wsUrl);
}
function historyAddHtml(result,api){
    var d = result.data;
    var historyStr = '';
    currentCoinRate={
        CNYPara:d.CNY,
        HKDPara:d.HKD,
        JPYPara:d.JPY,
        KRWPara:d.KRW,
        RUBPara:d.RUB,
        USDPara:d.USD
    }
    var len = d.d ? d.d.length : 0;
    for (var i = 0; i < len; i++) {
        var record = d.d[i];
        var ups = 0 == record[0] ? 'green' : 'red';
        var type = 0 == record[0] ? lang("买入") : lang("卖出");
        historyStr += '<div>'//<span class="'+ ups +'">'+type+'</span><span class="is_num">'
                    // + record.fprize + '</span><span>'+getPointNum(currentCoinRate[getLang_rate()+'Para']*record.fprize)+'</span><span class="is_num">'+ record.fcount
                    +'<span class="is_num '+ups+'">'+ record[2] + '</span><span class="is_num" data-point="'+pointData(coinShortName,'numberPre')+'">'+ record[3]
                    +'</span><span>' + jsonDateFormat(record[1],'hh:mm:ss') + '</span><div class="clear"></div></div>';
    }
    var TR=d['TR'];
    var ups = TR['INC'] >= 0 ? '+' : '';
    var color = TR['INC'] >0 ? 'green' : TR['INC']==0?'':'red';
    if(len>0)$('#book-dl-list .no-records').remove();
    $('#book-dl-list').prepend(historyStr=historyStr==''?'<p class="no-records">'+lang('暂无记录')+'</p>':historyStr);//历史成交记录html
    var divMax=$('#book-dl-list>div');
    if(divMax.length>30){
        $('#book-dl-list>div:last').remove()
    }
    $('#ticker-high').html(TR['ODH']);//最高价
    $('#ticker-low').html(TR['ODL']);//最低价
    $('#market-volume').html(TR['ODT'] + ' '+(allMarkets[localStorage.getItem('coinType')]).toUpperCase());//成交额
    $('.showDollarOrRmb').html('≈'+getCurrencySymbol()+to_num(TR[getLang_rate()]));//该币种美元或人民币价格
    $('#ticker-vol').html(TR['ODTN'] + ' ' + coinShortName.toUpperCase());//成交量
    $('#ticker-last').html(TR['LDP']);//最新成交价
    $('#reShow_ticker').html('<div class="'+color+'" onclick="autotrustNowprice('+$('#ticker-last').html()+')">'+to_num($('#ticker-last').html())+'<span class="upOrDown '+(color=='green'?'marketUp':'marketDown')+'"></span></div><div class="small">'+$('.showDollarOrRmb').html()+'</div>');
    $('#ticker-chg').addClass(color).html(ups + TR['INC']+'%');
    $('.all_coin_info .po_re').addClass(color);
    if(api){
        $('.fee-span').html(TR['FFR']*100);
        // var url=WsApi.wsTransaction+coinId;
        // var wsData=createWebSocket(url);
        // historyAddHtml(wsData);
    }
    goods_num();
    buytotal();
}
function autotrustNowprice(price){
    autotrust('',price);
}
//ws添加心跳检测
function createWebSocket(url) {
    var ws;//websocket实例
    var lockReconnect = false;//避免重复连接
    //心跳检测
    var heartCheck = {
        timeout: 20000,//60秒
        timeoutObj: null,
        serverTimeoutObj: null,
        reset: function(){
            clearTimeout(this.timeoutObj);
            clearTimeout(this.serverTimeoutObj);
            return this;
        },
        start: function(){
            var self = this;
            this.timeoutObj = setTimeout(function(){
                //这里发送一个心跳，后端收到后，返回一个心跳消息，
                //onmessage拿到返回的心跳就说明连接正常
                ws.send("heart");
                self.serverTimeoutObj = setTimeout(function(){//如果超过一定时间还没重置，说明后端主动断开了
                    ws.close();//如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
                }, self.timeout)
            }, this.timeout)
        }
    }
    try {
        ws = new WebSocket(url);
        initEventHandle();
    } catch (e) {
        reconnect(url);
    }

    function initEventHandle() {
        // console.log('ws open')
        ws.onopen = function (res) {
            //心跳检测重置
            heartCheck.reset().start();
        };
        ws.onmessage = function (res) {
            //如果获取到消息，心跳检测重置
            //拿到任何消息都说明当前连接是正常的
            heartCheck.reset().start();
            if(res.data=='keep alive')return;
            var data=JSON.parse(res.data);
            historyAddHtml(data,'ws');
        }
        ws.onclose = function () {
            reconnect(url);
            console.log('ws closed')
        };
        ws.onerror = function () {
            reconnect(url);
            console.log('error')
        };
        if(ws.data){
            return ws.data;
        }
    }

    function reconnect(url) {
        if(lockReconnect) return;
        lockReconnect = true;
        //没连接上会一直重连，设置延迟避免请求过多
        setTimeout(function () {
            createWebSocket(url);
            lockReconnect = false;
        }, 2000);
    }
}
