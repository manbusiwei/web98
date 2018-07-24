$(function () {
    $('input').keyup(function () {
        if($('.yes_zh').size() == '0'){
            $(this).val($(this).val().replace(/[\u4e00-\u9fa5]/g,''));
        }
    })
})