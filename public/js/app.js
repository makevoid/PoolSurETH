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
  $.get("/")

}

var bindBtnConfigure = () => {
  $(".btn-configure").on("click", configureContract)
}


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
g.bytecode = "6060604052620f4240600055341561001657600080fd5b5b33600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060005460026000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b5b610bf5806100d16000396000f300606060405236156100a2576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306fdde03146100a7578063095ea7b31461013657806318160ddd1461019057806323b872dd146101b9578063313ce5671461023257806370a08231146102615780638da5cb5b146102ae57806395d89b4114610303578063a9059cbb14610392578063dd62ed3e146103ec575b600080fd5b34156100b257600080fd5b6100ba610458565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156100fb5780820151818401525b6020810190506100df565b50505050905090810190601f1680156101285780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561014157600080fd5b610176600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610491565b604051808215151515815260200191505060405180910390f35b341561019b57600080fd5b6101a3610584565b6040518082815260200191505060405180910390f35b34156101c457600080fd5b610218600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190505061058e565b604051808215151515815260200191505060405180910390f35b341561023d57600080fd5b61024561089a565b604051808260ff1660ff16815260200191505060405180910390f35b341561026c57600080fd5b610298600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061089f565b6040518082815260200191505060405180910390f35b34156102b957600080fd5b6102c16108e9565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561030e57600080fd5b61031661090f565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156103575780820151818401525b60208101905061033b565b50505050905090810190601f1680156103845780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561039d57600080fd5b6103d2600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610948565b604051808215151515815260200191505060405180910390f35b34156103f757600080fd5b610442600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610b41565b6040518082815260200191505060405180910390f35b6040805190810160405280601081526020017f46696e746563685765656b546f6b656e0000000000000000000000000000000081525081565b600081600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a3600190505b92915050565b6000805490505b90565b600081600260008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541015801561065b575081600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410155b80156106675750600082115b80156106f25750600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205482600260008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205401115b156108895781600260008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555081600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555081600260008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a360019050610893565b60009050610893565b5b9392505050565b601281565b6000600260008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490505b919050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6040805190810160405280600381526020017f465754000000000000000000000000000000000000000000000000000000000081525081565b600081600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054101580156109995750600082115b8015610a245750600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205482600260008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205401115b15610b315781600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555081600260008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a360019050610b3b565b60009050610b3b565b5b92915050565b6000600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490505b929150505600a165627a7a72305820eed3d631954f23f20e2916786b19e4fb964dae7d61131312d6cc8f52faa6592d0029"
// contract abi
g.abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_amount","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"totalSupply","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]



$(function(){

  var btc_gbp = get_rates()

  $("input[name=insure_amount]").on("mousemove", update_insured_totals)

  dom.on("rates_updated", update_insured_totals)

  // $(".button.insure"      ).on("click", do_insure)
  // $(".button.deposit-done").on("click", deposit_triggered)

  bindBtnConfigure();

})
