// this script uses zepto.js

// https://github.com/bertani/insurETH/blob/master/frontend/js/flyether.js

var dom = $(window)

var rates = {
  gbp_btc:  150
}

var get_rates = function() {
  $.getJSON("https://bitpay.com/api/rates/gbp", function(data){
    rates.gbp_btc = data.rate
    dom.trigger("rates_updated")
  })
  $.getJSON("https://shapeshift.io/marketinfo/btc_eth", function(data){
    rates.btc_eth = data.rate
    dom.trigger("rates_updated")
  })
}

var update_insured_totals = function(evt){
  var value = evt.target.value || 50
  var value_btc = value/rates.gbp_btc
  $(".insure_amount_gbp").html(value)
  $(".insure_amount_btc").html(value_btc.toFixed(2))
  $(".insure_amount_eth").html((value_btc*rates.btc_eth).toFixed(2))
}

$(function(){

  var btc_gbp = get_rates()

  $("input[name=insure_amount]").on("mousemove", update_insured_totals)

  dom.on("rates_updated", update_insured_totals)

  // $(".button.insure"      ).on("click", do_insure)
  // $(".button.deposit-done").on("click", deposit_triggered)

})
