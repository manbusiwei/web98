
// var currentCoinRate=null;//取出当前币种的所有汇率值
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


//委托信息查询
function trades(coinId,coinShortName) {
    var trades = {sell: {html: '', sn: 1000}, buy: {html: '', sum: 0, sn: 1000}};
    $.getJSON(WebHelper.QueryTrades+"?id="+coinId+"&t="+btvs(), function (result) {
        var d = result.data;

        // if (typeof BP == 'undefined'){
        //     if(d.sell.length > 0)$('#buy-price').val(to_num(d.sell[0].fprize));
        //     if(d.buy.length > 0)$('#sell-price').val(to_num(d.buy[0].fprize));
        //     BP=1;
        // }
        // $('#sell-price-index,#buy-price-well').html(d.sell.length > 0?d.sell[0].fprize:0);

        // $('#buy-price-index,#sell-price-well').html(d.buy.length > 0?d.buy[0].fprize:0);
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
        goods_num();
        setTimeout('trades(3)', 5000);
    });
}
function setTab2(name,cursel,n){
    for(i=1;i<=n;i++){
        var menu=document.getElementById(name+i);
        var con=document.getElementById("con_"+name+"_"+i);
        menu.className=i==cursel?"hover":"";
        con.style.display=i==cursel?"block":"none";
    }
}


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
tradesWs();
function tradesWs() {
    var ws=new WebSocket(WsApi.designatesApi+$.cookie('USER').split(',')[0]);
    ws.onmessage=function(res){
        var data=JSON.parse(res.data);
        if(data.status==1){
            var d =data.data;
            for(var j=0;j<d.length;j++){
                renderMarketBox(d[j]);
            }
            goods_num();
        }
    }
}
//渲染交易区
function renderMarketBox(d){
    var str='';
    var _name=d['trade']['name'];
    var _tarde=d['trade'];
    var _ups=_tarde['increase']>0?'green':_tarde['increase']==0?'':'red';
    if($('#orderbook-sell'+_tarde['id']).length==0){
        str+='<div class="market_my_entrust clearBoth" id="market_my_entrust'+_tarde['id']+'">'
            +'<div class="coin_trade clearBoth">'
            +'<div class="finddeal_currency">'
            +'<i class="coin coin_40 coin_'+_name.toLowerCase()+'_40"></i><span><span class="coin-name">'+_name+'</span><span>/</span><span class="">'+_tarde['area']+'</span></span></div>'
            +'<div><p class="coinPrice is_num '+_ups+'">'+_tarde['LatestDealPrize']+'</p>'
            +'<p class="fabi"><span>≈</span><span class="coinPriceFabi">'+_tarde[getLang_rate()]+'</span><span class="fabiName">'+getLang_rate()+'</span></p></div></div>'
            +'<div class="book-sell"><dl class="sidebar-dl"><dt>'
            +'<div class="w_55"><span>'+lang('卖')+'</span></div><div class="w_95"><span>'+lang('价格')+'</span>(<span>'+_tarde['area']+'</span>)</div>'
            +'<div class="w_100"><span>'+lang('数量')+'</span></div><div class="w_100"><span>'+lang('总计')+'</span></div><div class="w_100"><span>'+lang('委托价格')+'</span></div><div class="w_100"><span>'+lang('委托数量')+'</span></div></dt>'
            +'<div class="listscoll" id="orderbook-sell'+_tarde['id']+'"></div></dl></div>'
            +'<div class="book-sell"><dl class="sidebar-dl"><dt>'
            +'<div class="w_55"><span>'+lang('买')+'</span></div><div class="w_95"><span>'+lang('价格')+'</span>(<span>'+_tarde['area']+'</span>)</div>'
            +'<div class="w_100"><span>'+lang('数量')+'</span></div><div class="w_100"><span>'+lang('总计')+'</span></div><div class="w_100"><span>'+lang('委托价格')+'</span></div><div class="w_100"><span>'+lang('委托数量')+'</span></div></dt>'
            +'<div class="listscoll book-buy sidebar-dl" id="orderbook-buy'+_tarde['id']+'"></div></dl></div></div>'
        $('#all_coin'+d['trade']['areaId']).append(str);
    }
    var coinData={
        name:_name.toLowerCase(),
        id:_tarde['id'],
        decimalDigits:_tarde['decimalDigits'],
        decimalNum:_tarde['decimalNum'],
        areaId:_tarde['areaId']
    }
    randerTrade(coinData,d['entrustInfo']);
}
//渲染币种挂单
function randerTrade(coin,d){

    var trades = {sell: {html: '', sn: 1000}, buy: {html: '', sum: 0, sn: 1000}};
    // var sort = [], vol = 0;
    var sell_num = 0;
    var _sellHistory=d.sellFentrustHistory;
    for (var i = 0; i < d.sell.length; i++) {
        if (typeof d.sell[i] != 'undefined') {
            // sort[i] = vol += d.sell[i][1];
            sell_num += parseFloat(d.sell[i][1]);
        }
        for(var j=0;j<_sellHistory.length;j++){
            if(d.sell[i][0]==_sellHistory[j][0]){
                d.sell[i]=d.sell[i].concat(_sellHistory[j]);
            }
        }
    }
    for (var i=0;i < trades.sell.sn;i++) {
        if (typeof d.sell[i] == 'undefined') continue;
        var sell_type_color=d.sell[i][2]==1?'bg_yellow':'bg_white';
        var pt = ((d.sell[i][1] / sell_num).toFixed(2)) * 100;
        trades.sell.html += '<dd class="'+sell_type_color+'"> <div  class="sidebar_bg_red" style="width: '
                            + pt + '%"></div> <div class="w_55 red">' + lang('卖') + (i + 1) + '</div> <div class="w_95 is_num" data-point="'+coin.decimalDigits+'">'
                            + d.sell[i][0] + '</div> <div class="w_100 is_num" data-point="'+coin.decimalNum+'">' + d.sell[i][1] + '</div> <div class="w_100 is_num" data-point="'+coin.decimalNum+'">'
                            + d.sell[i][3] + '</div> <div class="w_100 is_num" data-point="'+coin.decimalDigits+'">' + (d.sell[i][4]?d.sell[i][4]:'') + '</div><div class="w_100 is_num" data-point="'+coin.decimalNum+'">' + (d.sell[i][5]?d.sell[i][5]:'') + '</div></dd>';
    }
    $('#orderbook-sell'+coin.id).html(trades.sell.html);
    var Buy_num = 0;
    var _buyHistory=d.buyFentrustHistory;
    for (var i = 0; i < d.buy.length; i++) {
        if (typeof d.buy[i] == 'undefined') continue;
        Buy_num += parseFloat(d.buy[i][1]);
        for(var j=0;j<_buyHistory.length;j++){
            if(d.buy[i][0]==_buyHistory[j][0]){
                d.buy[i]=d.buy[i].concat(_buyHistory[j]);
            }
        }
    }
    vol = 0;
    for (var i = 0; i < trades.buy.sn; i++) {
        if (typeof d.buy[i] == 'undefined') continue;
        trades.buy.sum = FF.add(trades.buy.sum, d.buy[i][1]);
        vol += d.buy[i][1];
        var buy_type_color=d.buy[i][2]==1?'bg_yellow':'bg_white';
        var pt = ((d.buy[i][1] / Buy_num).toFixed(2)) * 100;
        trades.buy.html += '<dd class="'+buy_type_color+'"> <div class="sidebar_bg_green" style="width: '
                            + pt + '%"></div><div class="w_55 green">' + lang('买') + (i + 1) + '</div> <div class="w_95 is_num" data-point="'+coin.decimalDigits+'">'
                            + d.buy[i][0] + '</div> <div class="w_100 is_num" data-point="'+coin.decimalNum+'">' + d.buy[i][1] + '</div> <div class="w_100 is_num" data-point="'+coin.decimalNum+'">'
                            + d.buy[i][3]+ '</div> <div class="w_100 is_num" data-point="'+coin.decimalDigits+'">' + (d.buy[i][4]?d.buy[i][4]:'') + '</div><div class="w_100 is_num" data-point="'+coin.decimalNum+'">' + (d.buy[i][5]?d.buy[i][5]:'') + '</div></dd>';
    }
    $('#orderbook-buy'+coin.id).html(trades.buy.html);
}

