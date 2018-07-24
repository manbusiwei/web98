var queryCoinTypes = function (){
	var param={};
	$.ajax({
	    type: 'POST',
	    url: WebHelper.QueryCoinTypes,
	    data: param,
	    beforeSend:function(){
	    	console.log("queryCoinTypes...before");
	    },
	    complete:function(){
	    },
	    success: function(result){
	    	var html=template("renderCoinTypes",result.data);
			$("#price_today_ul").html(html);
	    },
	    error:function() {

	    }
	});
}