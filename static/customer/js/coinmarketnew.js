//all coins prices
// var trends = [];

var priceTmp = {
    btc:[],
    eth:[],
    favorite:[]
};
function get_data(){
    $.each(allMarkets,function(k,v){
        getMarketData(k)
    })
    if(USER){
        $.get(WebHelper.queryOptionalRealTimeMap,function(d){
            if(d.status==1){
                priceTmp['favorite']=d.data.data;

                if(sortBy)priceTmp['favorite'].sort(sortcoinList(sort_hTol,sortBy));
                renderPage(priceTmp['favorite'],'favorite')
            }
        })
    }
}
function getMarketData(coinType) {
    $.get(WebHelper.QueryRealTimeMap+'?coinType='+coinType+'&t='+Math.random(), function (result) {
        if(result.status==1){
            priceTmp[allMarkets[coinType]] = result.data.data;
            if(result.data.coin&&coinType==1)
            $('.btcPrice').html(result.data.coin[getLang_rate()+'Para'])

            if(sortBy)priceTmp[allMarkets[coinType]].sort(sortcoinList(sort_hTol,sortBy));
            renderPage(priceTmp[allMarkets[coinType]],coinType);
        }else{
            console.log('首页列表操作失败type='+coinType)
        }
    });
}
//render page
function renderPage(ary,coinType) {
    var html = '';
    var favorites=JSON.parse(localStorage.getItem('favorite')||"{}");
    // if(!favorites[allMarkets[coinType]]||$.isEmptyObject(favorites[allMarkets[coinType]])){
    //     isAllFavoriteData+=1;
    // }
    var favNum=0;
    $.each(favorites,function(k,v){
        favNum+=Object.getOwnPropertyNames(v).length;
    })
    for (var i=0;i<ary.length;i++) {
        var name=ary[i].name.toLowerCase();
        // if(name=='bitcny')continue;
        var _coinType=ary[i]['coinType']||coinType;
        var _coinTypeName=allMarkets[_coinType];
        var id=ary[i].id;
    	var colorclass =parseFloat(ary[i]['increase'])==0?'':parseFloat(ary[i]['increase']) < 0 ? 'red' : 'green';
        var ups = parseFloat(ary[i]['increase']) > 0 ? '+' : '';
        var i_active=(ary[i]['isOptional']==1?'active':((!USER&&favorites[_coinTypeName]&&favorites[_coinTypeName][name]==id)?'active':''));
        html += '<li data-favoritecoin="'+id+'" data-favoriteCoinName="'+name+'"><dl style="zoom:1" class="autobox clear">'
                +'<dt style="width:180px"><span class="'+(ary[i]['isNew']==1?'isNewCoin':'')+'"></span><i data-coinType="'+_coinType+'" class="isFavorite '+i_active+'" data-coinId="'+ary[i].id+'" data-coinName="'+name+'" data-trends="'+ary[i].trends.join('__')+'"></i><em class="coin coin_30 coin_'+ name + '_30"></em><p>'+ ary[i].name.toUpperCase() + '/'+_coinTypeName.toUpperCase()+'<br/><span class="coinName">'+ary[i]['name1']+'</span>'+'</p></dt>'
                +'<a data-coinType="'+_coinType+'" href="/trade/coinTrade.html?id='+ary[i].id+'&shortName=' + name+ '&coinType='+_coinType+'">'
                +'<dd class="is_num '+colorclass+'" data-point="'+ary[i]['decimalDigits']+'">' + ary[i].LatestDealPrize +'</dd>'
                +'<dd style="width:130px" class="is_num '+colorclass+'" data-point="'+ary[i]['decimalDigits']+'">'+((ary[i][getLang_rate()]>0&&ary[i][getLang_rate()]<1)?ary[i][getLang_rate()].toPrecision(2):ary[i][getLang_rate()].toFixed(2))+'</dd>'
                +'<dd style="width:135px" class="' + colorclass + '">'+ups + ary[i].increase+'%'+'</dd>'
                +'<dd class="is_num" data-point="'+ary[i]['decimalDigits']+'">' + ary[i].OneDayHighest + '</dd>'
                +'<dd class="is_num" data-point="'+ary[i]['decimalDigits']+'">' + ary[i].OneDayLowest + '</dd>'
                +'<dd style="width:130px" class="is_num" data-point="'+ary[i]['decimalNum']+'">' + parseFloat(ary[i].OneDayTotalNum) + '</dd>'
                +'<dd style="width:160px; height: 46px;position: relative;" class="'+ ary[i].name + '_plot_'+ary[i].id+'"> </dd><div class="clear"></div></dl></a></li>';
        if(!USER&&coinType!='favorite'){
            if(favorites[_coinTypeName]&&favorites[allMarkets[_coinType]][name]==id){
                var isPlus=true;
                $.each(priceTmp['favorite'],function(k,v){
                    if(v.id==id){
                        isPlus=false;
                        return false;
                    }
                })
                if(isPlus){
                    if(priceTmp['favorite'].length<favNum){
                        priceTmp['favorite'].push(ary[i]);
                    }
                    if(priceTmp['favorite'].length==favNum){
                        renderPage(priceTmp['favorite'],'favorite')
                    }
                }
            }
        }
    }
    if(coinType=='favorite'){
        $('.show_favorite_data').html(html)
    }else{
        $('.show_'+(allMarkets[coinType]?allMarkets[coinType]:coinType).toUpperCase()+'_data').html(html);
        if(coinType==1){
            $('#docLoading').hide()
        }
    }
    goods_num();
    allcoin_callback(ary,coinType);
}
//首页曲线
function allcoin_callback(d) {
    for (var i in d) {
        // if(d[i]['name']=='BitCNY')continue;
        var _plot=$('.' + d[i]['name'] + '_plot_'+d[i]['id']);
        for(var j=0;j<_plot.length;j++){
            $.plot(_plot.eq(j), [{shadowSize: 0, data: d[i]['trends']}], {
                grid: {borderWidth: 0},
                xaxis: {mode: "time", ticks: false},
                yaxis: {tickDecimals: 0, ticks: false},
                colors: ['#ff5818']
            });
        }
    }
}
//收藏时单独渲染曲线
function favDrawPlot(data) {
    var name=data.coinname.toUpperCase();
    var d=[];
    var arr=data.trends.split('__');
    for(var i=0;i<arr.length;i++){
        d.push(arr[i].split(','));
    }
    $.plot($('.' +name + '_plot_'+data.coinid), [{shadowSize: 0, data: d}], {
        grid: {borderWidth: 0},
        xaxis: {mode: "time", ticks: false},
        yaxis: {tickDecimals: 0, ticks: false},
        colors: ['#ff5818']
    });
}
function sortcoinList(order, sortBy) {
    var ordAlpah = (order == 1) ? '>' : '<';
    var sortFun = new Function('a', 'b', 'return parseFloat(a["' + sortBy + '"])' + ordAlpah + 'parseFloat(b["' + sortBy + '"])? 1:-1');
    return sortFun;
}

//create random
function rd() {
    return Math.random()
}

//set trade timer,5 second
setInterval(function () {
    get_data();
},15000);
//初始排序参数，全局
 var sort_hTol=0;
 var sortBy='';
$(function () {
	get_data();
    $('.price_today_ull > .click-sort').each(function () {
        $(this).click(function () {
            if($(this).find('.active').length==0){
                $(this).find('.cagret-up').addClass('active');
            }else{
                $(this).find('.cagret').toggleClass('active');
            }
            sort_hTol=sort_hTol==0?1:0;
            sortBy=$(this).data('sort');
            if(!sortBy)return;
            sortCoinHtml();
        })
    });
});
//排序
function sortCoinHtml(){
    for(var k in priceTmp){
        var type='';
        if(k=='favorite'){
            type=k;
        }else{
            for(var key in allMarkets){
                if(allMarkets[key]==k)
                    type=key;
            }
        }
        priceTmp[k].sort(sortcoinList(sort_hTol,sortBy));
        renderPage(priceTmp[k],type);
    }
}

