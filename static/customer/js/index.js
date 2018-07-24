    var activation = getRequestByName('flag');
    if (activation == 1) {
        alert(lang('激活成功'));
    }
    var str='<li data-marketType="favorite"><i></i><span>'+lang('Favorites')+'</span></li>';
    var show_data='<ul class="price_today_ul show_favorite_data"></ul>';
    for(var i=0 ;i<allMarkets_arr.length;i++){
        var _active=allMarkets_arr[i][1]=='btc'?'active':'';
        var _show=allMarkets_arr[i][1]=='btc'?'isShow':'';
        str+='<li class="'+_active+'" data-marketType="'+allMarkets_arr[i][1].toUpperCase()+'">'+(allMarkets_arr[i][1]=='bitcny'?'BitCNY':allMarkets_arr[i][1].toUpperCase())+' '+lang('Trades')+'</li>';
        show_data+='<ul class="'+_show+' price_today_ul show_'+allMarkets_arr[i][1].toUpperCase()+'_data"></ul>'
    }
    $('.market-type').html(str);
    $('.show_content').html(show_data);
    $('.market-type').delegate('li','click',function(){
        $(this).addClass('active').siblings().removeClass('active');
        // console.log($(this).data('markettype'))
        $('.show_content .price_today_ul').removeClass('isShow');
        $('.show_content').find('.show_'+$(this).data('markettype')+'_data').addClass('isShow');
    });
    $('.foot-con4_all').hover(function() { $('.foot-connectus').show() }, function() { $('.foot-connectus').hide() });
    $('.lang,.lanague').hover(
        function() {
            $('.lang').addClass('selected');
            $('.lanague').addClass('selected');
            $('.header').css('z-index', -120);
        },
        function() {
            $('.header').css('z-index', 19);
            $('.lanague').removeClass('selected');
            $('.lang').removeClass('selected');
        }
    );
    $('.total-con').hover(function() { $('.total-con-list').show() }, function() { $('.total-con-list').hide() });
    $('.jy-email,#userinfo').hover(
        function() {
            $('.jy-email').addClass('isHover');
            $('#userinfo').addClass('selected');
            // $('.header').css('z-index', -100);
            $('.hdslide').css('z-index', -100);
            $('.page').css('z-index', -100);
        },
        function() {
            $('.header').css('z-index', 19);
            $('.jy-email').removeClass('isHover');
            $('.email').removeClass('selected');
            $('#userinfo').removeClass('selected');
            $('.hdslide').css('z-index', 0);
            $('.page').css('z-index', 'auto');
        }
    );
    $('#off_shelf').html($('#for_off_shelf').html());
    if (location.search == '?v=killcoin') {
        showDialog('dialog_shelf');
    }
    var login_ed = "";
    var login_type = "mobile";
    if (login_ed == 'location' && login_type == 'email') {
        code_popup();
        $('.tel_s_h').hide();
        $('.email_s_h').show();
        $('#code').prop('placeholder', lang('请输入邮箱验证码'));
    }
    if (login_ed == 'location' && login_type == 'mobile') {
        code_popup();
        $('.tel_s_h').show();
        $('.email_s_h').hide();
        $('#code').prop('placeholder', lang('请输入手机验证码'));
    }
    $(document).on('click', '.close_popup_code', function() {
        location.href = webHelper.LoginOut;
    })
    $(document).on('click', '#email_code', function() {
        $.post('/user/sendmail/act/auth', function(d) {
            if (d.status == '1') {
                alert(lang(d.msg));
            }
            if (d.status == '0') {
                alert(lang(d.msg));
            }
        }, 'json')
    })
    $(document).on('click', '#sure_popup_code', function() {
        var code = $('#code').val();
        $.post('/user/auth', { code: code }, function(d) {
            if (d.status == '1') {
                location.href = d.data;
            }
            if (d.status == '0') {
                alert(lang(d.msg));
            }
        }, 'json')
    })
    var login_more = "";
    if (login_more == 'password') {
        more_login();
    }
    $(function() {
        $(document).on('click', '.btn-mobile-tel1,.btn-mobile-sms1', function() {
            var data = { mobile: $('#login-email-i').val(), captcha: $('#captcha').val(), type: codetype };
            var type = 'sms';
            if (codetype == 2) type = 'voice';
            $.post('/user/sendsms/act/auth/type/' + type, data, function(d) {
                if (d.status == '1') {
                    $('.btn-mobile-sms1').hide();
                    $('.btn-mobile-tel1').hide();
                    $('#btn-mobile-sms1_1').show();
                    $('#btn-mobile-tel1_1').show();
                    time();
                    time2();
                    return alert(lang("验证码已经发送到您的手机，请注意查收"));
                }
                alert(lang(d.msg));
                recode();
                return false;
            }, 'json');
        });

        //获取公告
        $.get(WebHelper.notice + '?type=2&language=' + getLang_notice() + '&t=' + new Date().getTime(), function(d) {
            //$.post('http://192.168.8.46:8081/api/aboutus/queryallannouncement.do','{type:2}',function(d){
            if (d.data && d.data.length > 0) {
                $('.xt_top_notice').show().find('.center').html(d.data[0]['ftitle']);
                $('#noticeId').attr('href', '/other/noticeDetail.html?groupId=' + d.data[0]['groupId']+'&lang='+$.cookie('lang'))
            }
        })
        //轮播图
        $.get(WebHelper.indexBanner,'',function(result){
            if(result.status==1){
                var d=result.data;
                var str='';
                var strDot='';
                for(var i=0;i<d.length;i++){
                    var eleA='';
                    if(d[i]['fhref']){
                        eleA='<a href="'+d[i]['fhref']+'" target="_blank"></a>'
                    }
                    str+='<div class="item" style="background-image: url('+d[i]['furl']+')">'+eleA+'</div>'
                    strDot+='<li data-slide-to="'+i+'"></li>'
                }
                $('#indexBannerBox').html(str).find('.item').eq(0).addClass('active').css('display','block');
                $('.my-carousel-indicators').html(strDot).find('li:eq(0)').addClass('active');
                startBanner();
                // $('.my-carousel-inner .item').show();
            }else{
                $('.my-carousel-inner .item').show();
            }
        })
    })
    //轮播图
    function startBanner() {
        var $allItems = $('.my-carousel .my-carousel-inner .item');
        var $allIndicators = $('.my-carousel .my-carousel-indicators li');
        var currentIndex = 0;
        var currentItem = null;
        var nextItem = null;
        var time;
        $(".my-carousel").hover(function() {
            time = clearInterval(time)
        },function() {
            if ($('.my-carousel-inner .item').size() == '1') {
                return false;
            }
            time = setInterval(function() {
                currentItem = $allItems.filter('.active');
                if (currentIndex + 1 === $allItems.length) {
                    nextItem = $allItems.eq(0);
                    currentIndex = 0;
                } else {
                    nextItem = $allItems.eq(currentIndex + 1);
                    currentIndex += 1;
                }
                nextItem.addClass('active').fadeIn(1000);
                $allIndicators.removeClass('active').eq(currentIndex).addClass('active');
                currentItem.removeClass('active').fadeOut(1000);
            }, 5000);
        }).trigger('mouseleave');
        $(".my-carousel-indicators li").click(function() {
            var nextIndex = parseInt($(this).attr('data-slide-to'));
            if (nextIndex == currentIndex) return false;
            currentIndex = nextIndex;
            currentItem = $allItems.filter('.active');
            currentItem.removeClass('active').fadeOut(1000);
            $allItems.eq(currentIndex).addClass('active').fadeIn(1000);
            $allIndicators.removeClass('active').eq(currentIndex).addClass('active');
        });

    }
    //$('#login-email-i').bind('blur',$(this).val(),function(){
    //  alert($(this).val())
    // })
    //顶部导航背景渐变
    $(document).scroll(function () {
        var _top=$(this).scrollTop()
        if(_top<350){
            $('.top-fixed-nav').css('background-color','rgba(33,48,65,0)')
        }else{
            $('.top-fixed-nav').css('background-color','rgba(33,48,65,1)')
        }
    })
    $(function(){
        //点击收藏
        $('.show_content').delegate('.isFavorite','click',function(e){
            e.stopPropagation();
            $(this).toggleClass('active');
            var coinType=$(this).data('cointype');//1,3,favorite
            var data={
                fvirtualcointype:{
                fid:$(this).data('coinid')
                }
            };
            if(USER){
                // localStorage.removeItem('favorite')
                if($(this).hasClass('active')){
                    $('.show_favorite_data').prepend($(this).parents('li').prop('outerHTML'));
                    favDrawPlot($(this).data())
                    data.coinType=coinType;
                    $.ajax({type:'POST', url:WebHelper.createOptional,data:JSON.stringify(data),contentType:'application/json'})
                }else{
                    $.ajax({type:'POST', url:WebHelper.deleteOptional,data:JSON.stringify(data),contentType:'application/json'})
                    $('.show_favorite_data li[data-favoritecoin="'+$(this).data('coinid')+'"]').remove()
                    $('.price_today_ul li[data-favoritecoin="'+$(this).data('coinid')+'"] .isFavorite').removeClass('active')
                }
            }else{
                // var l=JSON.parse(localStorage.getItem('favorite'));
                // var favorites={};
                // if(l&&l.btc&&l.eth){
                //     favorites=l;
                // }else{
                //     localStorage.removeItem('favorite');
                //     for(key in allMarkets){
                //         favorites[allMarkets[key]]={};
                //     }
                // }
                var favorites=JSON.parse(localStorage.getItem('favorite'))||{};
                if(!favorites[allMarkets[coinType]]){
                    favorites[allMarkets[coinType]]={};
                }
                if($(this).hasClass('active')){
                    favorites[allMarkets[coinType]][$(this).data('coinname')]=$(this).data('coinid');
                    $('.show_favorite_data').prepend($(this).parents('li').prop('outerHTML'));
                    favDrawPlot($(this).data())
                }else{
                    delete favorites[allMarkets[coinType]][$(this).data('coinname')];
                    $('.show_favorite_data li[data-favoritecoin="'+$(this).data('coinid')+'"]').remove()
                    $('.price_today_ul li[data-favoritecoin="'+$(this).data('coinid')+'"] .isFavorite').removeClass('active')
                }
                localStorage.setItem('favorite',JSON.stringify(favorites))
            }

        })
    })
    //搜索
    function searchCoin() {
        var txt = $.trim($('#searchCoinInp').val().toLowerCase());
        var _li = $('.show_content .isShow li');
        _li.each(function() {
            if ($(this).data('favoritecoinname').indexOf(txt) > -1) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }
    ;(function(){
        $('#down_qrcode').qrcode({
            text:'https://www.btc98.vip/other/transfersPage.html',
            // text:'http://47.104.102.195/other/transfersPage.html',
            render    : 'canvas',
            width:106,
            height:106,
            src:'/static/customer/images/01_2dcode.png'
        });
    }())