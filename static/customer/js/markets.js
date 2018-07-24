//all coins prices
// var trends = [];
// var allMarkets={
//     '1':'btc',
//     '3':'eth'
// };
var priceTmp = {
    btc:[],
    eth:[],
    favorite:[]
};
var isAllFavoriteData=0;
var favoriteHtml='';//未登录状态自选区数据
function get_data(){
    $.each(allMarkets,function(k,v){
        getMarketData(k)
    })
    if(USER){
        $.get(WebHelper.queryOptionalRealTime,function(d){
            if(d.status==1){
                priceTmp['favorite']=d.data;
                renderPage(priceTmp['favorite'],'favorite')
            }else{
                favoriteHtml='';
                priceTmp['favorite']=[];
                isAllFavoriteData=0;
            }
        })
    }
}
function getMarketData(coinType) {
    $.get(WebHelper.queryRealTime+'?coinType='+coinType+'&t='+Math.random(), function (result) {
        if(result.status==1){
            priceTmp[allMarkets[coinType]] = result.data;
            renderPage(priceTmp[allMarkets[coinType]],coinType);
        }else{
            console.log('交易页列表操作失败,类型:'+coinType)
        }
    });
}

//render page
function renderPage(ary,coinType) {
    isAllFavoriteData+=1;
    var html = '';
    var favorites=JSON.parse(localStorage.getItem('favorite')||"{}");
    if(!favorites[allMarkets[coinType]]){
        favorites[allMarkets[coinType]]={};
        localStorage.setItem('favorite',JSON.stringify(favorites));
    }
    for (var i=0;i<ary.length;i++) {
        var _coinType=ary[i]['C']||coinType;
        var _coinTypeName=allMarkets[_coinType];
        var name=ary[i]['N'].toLowerCase();
        // if(name=='bitcny')continue;
        var id=ary[i]['ID'];
    	var colorclass =parseFloat(ary[i]['I'])==0?'':parseFloat(ary[i]['I']) < 0 ? 'red' : 'green';
        var ups = parseFloat(ary[i]['I']) > 0 ? '+' : '';
        var i_active=(ary[i]['O']==1?'active':((!USER&&favorites[allMarkets[_coinType]][name]==id)?'active':''));
        html += '<li data-favoritecoin="'+id+'">'
                +'<i data-coinType="'+_coinType+'" class="isFavorite '+i_active+'" data-coinId="'+id+'" data-coinName="'+name+'"></i>'
                +'<dl style="zoom:1" class="autobox clear">'
                +'<a data-coinType="'+_coinType+'" href="/trade/coinTrade.html?id='+id+'&shortName=' + name+ '&coinType='+_coinType+'">'
                +'<dt style="width:115px"><em class="coin coin_19 coin_'+ name + '_19"></em><p>'+ name.toUpperCase() + '/'+_coinTypeName.toUpperCase()+'</p></dt>'
                +'<dd class="is_num '+colorclass+'" data-point="'+ary[i]['DD']+'">' + ary[i].LDP +'</dd>'
                +'<dd style="width:60px;text-align:right" class="' + colorclass + '">'+ups + ary[i].I+'%'+'</dd>'
                +'<div class="clear"></div></a></dl></li>';
        if(!USER){
            if(favorites[allMarkets[_coinType]][name]==id){
                priceTmp['favorite'].push(ary[i]);
                favoriteHtml += '<li data-favoritecoin="'+id+'">'
                +'<i data-coinType="'+_coinType+'" class="isFavorite '+i_active+'" data-coinId="'+id+'" data-coinName="'+name+'"></i>'
                +'<dl style="zoom:1" class="autobox clear">'
                +'<a data-coinType="'+_coinType+'" href="/trade/coinTrade.html?id='+id+'&shortName=' + name+ '&coinType='+_coinType+'">'
                +'<dt style="width:115px"><em class="coin coin_19 coin_'+ name + '_19"></em><p>'+ name.toUpperCase() + '/'+_coinTypeName.toUpperCase()+'</p></dt>'
                +'<dd class="is_num '+colorclass+'" data-point="'+ary[i]['DD']+'">' + ary[i].LatestDealPrize +'</dd>'
                +'<dd style="width:60px;text-align:right" class="' + colorclass + '">'+ups + ary[i].I+'%'+'</dd>'
                +'<div class="clear"></div></a></dl></li>';
            }
        }
    }
    if(coinType=='favorite'){
        $('.show_favorite_data').html(html)
    }else{
        $('.show_'+(allMarkets[coinType]?allMarkets[coinType]:coinType).toUpperCase()+'_data').html(html);
    }
    if(!USER){
        if(isAllFavoriteData>=Object.getOwnPropertyNames(favorites).length){
            $('.show_favorite_data').html(favoriteHtml)
        }
    }
    goods_num();
}
//首页曲线

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
},100000);
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
            for(var k in priceTmp){
                var type='';
                for(var key in allMarkets){
                    if(allMarkets[key]==k)
                        type=key;
                }
                priceTmp[k].sort(sortcoinList(sort_hTol,sortBy))
                // renderPage(priceTmp[k],type);
            }
        })
    });
});


