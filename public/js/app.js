`use strict`
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

const configureContract = () => {
  args = {}
  args.type   = $("select[name=type]").val()
  args.api    = $("select[name=api]").val()
  args.oracle = $("select[name=oracle]").val()
  args.policy = $("select[name=policy]").val()
  $.get("/render_template", args, renderTemplate)
}

var bindBtnConfigure = () => {
  $(".btn-configure").on("click", configureContract)
}

var renderTemplate = (resp) => {
  $(".contract_source").val(resp)
}

var bindBtnCompile = () => {
  $(".btn_contract_compile").on("click", contractCompile)
}

var contractCompile = (resp) => {
  contract = $(".tmp_script").html()
  $.get("/contract_compile", { contract: contract }, renderTemplate)
}

var contractRender = (resp) => {
  c.log("RENDER:", resp)
  $(".contract_abi").val(resp.abi)
  $(".contract_bytecode").val(resp.bytecode)
}



$(function(){

  var btc_gbp = get_rates()

  $("input[name=insure_amount]").on("mousemove", update_insured_totals)

  dom.on("rates_updated", update_insured_totals)

  // $(".button.insure"      ).on("click", do_insure)
  // $(".button.deposit-done").on("click", deposit_triggered)

  bindBtnConfigure();
  bindBtnCompile();
})


//// ----------

// the following code is based on ftw_2017 code

var d = document
var c = console
var g = window // global scope shortcut
g.bytecode = null
g.abi = null
g.contractAddress = null
g.insuranceContract = null

var main = async function() {
  // setup web3
  if (typeof web3 !== 'undefined') {
    // connect to metamask (preferred)
    g.web3 = new Web3(web3.currentProvider)
  } else {
    // connect to your local geth or parity node instead
    g.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
  }
  g.eth = g.web3.eth
  // setup functions to be called via await (simpler than using callbacks)
  var getCoinbase = Promise.promisify(g.eth.getCoinbase)
  g.getBalance    = Promise.promisify(g.eth.getBalance)
  // get your first ethereum address (coinbase address)
  g.coinbase = await getCoinbase()
  // token contract class
  var InsuranceContract = g.eth.contract(g.abi)
  g.InsuranceContract   = InsuranceContract
  // token contract instance
  if (localStorage.pse_token_address) {
    g.insuranceContract = InsuranceContract.at(localStorage.pse_token_address)
  }
  // all actions
  bindDeployContract()
  loadAddress()
  updateBalance()
}
// calls eth.getBalance (gets balance in weis - "micro" ethers)
var updateBalance = async function() {
  d.querySelector(".metamask_address").innerHTML = g.coinbase

  var balance = await g.getBalance(g.coinbase)
  d.querySelector(".balance").innerHTML = balance
}
var loadAddress = function () {
  // loads address from local storage if you have already deployed a token contract address with this browser "user/account"
  var address = localStorage.pse_token_address
  if (address) {
    g.contractAddress = address
    var addressElem = d.querySelector(".contract_address")
    addressElem.innerHTML = address
    g.insuranceContract = g.InsuranceContract.at(localStorage.pse_token_address)
  }
}
// triggers the creation of a token contract
var deployContract = function() {
  g.InsuranceContract.new([], {
    data: g.bytecode,
    from: g.coinbase,
    gas:  1000000
  }, contractDeploymentCallback)
}
// this function will be called twice so it wasn't possible to promisify-it
// the second time you get this callback your token contract will be likely to be deployed already and you will get the address of it
var contractDeploymentCallback = function(err, resp) {
  if (err) c.error(err)
  var address = resp.address
  var addressElem = d.querySelector(".contract_address")
  addressElem.innerHTML = "Waiting for the transaction to be confirmed.... (can take up to a minute)"
  if (address) {
    addressElem.innerHTML = address
    // we save the address in the local storage so we can point to the same contract after a browser refresh
    localStorage.pse_token_address = address
    g.contractAddress = address
  }
}
// this is the first time we actually do a sendTransaction call (a standard ethereum transaction)
// here we call the token contract method `transfer`
var sendTokens = async function() {
  var recipientElem = d.querySelector(".recipient_address")
  var recipient = recipientElem.value
  var transfer = Promise.promisify(g.insuranceContract.transfer)
  var tokenTransferAmount = 100 // FIXME™  hardcoded amount, in a real app you probably want to specify the amount transfered
  var result = await transfer(recipient, tokenTransferAmount)
  c.log(result)
}

var bindDeployContract = function() {
  var deployBtn = d.querySelector(".deploy_contract_btn")
  deployBtn.addEventListener("click", deployContract)
}
window.addEventListener('load', main)
// long (but important) variables are defined here (contract bytecode and contract ABI):
// bytecode is the contrect compiled in binary format, needed to "deploy" (publish) the contract to the ethereum network
// abi is the application binary interface, it tells your web3.js library which are the function names and its arguments to be able to call them.
// contract bytecode
g.bytecode = ""
// contract abi
g.abi = []
