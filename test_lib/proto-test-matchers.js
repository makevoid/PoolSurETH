const coinbase = require("./env-testrpc").coinbase
const BigNumber = require('bignumber.js')

String.prototype.shouldMatchCoinbase = function() {
  assert.equal(this, coinbase, "given address should match coinbase address")
}

String.prototype.shouldNotBeEmpty = function() {
  assert.notEqual(this, "", "string should not be empty")
}

// equality + ascii conversion
String.prototype.shouldEq = function(string) {
  const source = web3.toAscii(this)
  assert.equal(source, string, `string should be the same as '${string}'`)
}

// normal string equality check
String.prototype.shouldEql = function(string) {
  assert.equal(this, string, `string should be the same as '${string}'`)
}

String.prototype.shouldNotEq = function(string) {
  const source = web3.toAscii(this)
  assert.notEqual(source, string, `string should be different than '${string}'`)
}

String.prototype.shouldNotEql = function(string) {
  assert.notEqual(this, string, `string should be different than '${string}'`)
}

Number.prototype.shouldNotBeZero = function() {
  assert.notEqual(this, 0, "number should not be zero")
}

Number.prototype.shouldEql = function(number) {
  assert.equal(this, Number(number), `number should be the same as '${number}'`)
}


// Thanks javascript for being broken (web3 bignumber is not the same as bignumber.js)
BigNumber.prototype.shouldNotBeZero = function() {
  assert.notEqual(this, 0, "number should not be zero")
}

const numsShouldEq = (number1, number2) => {
  assert.equal(Number(number1), Number(number2), `number ('${number1}') should be the same as '${number2}'`)
}

const shouldNotBeZero = (number) => {
  assert.notEqual(Number(number), 0, "number should not be zero")
}

module.exports = {
  shouldNotBeZero:  shouldNotBeZero,
  numsShouldEq:     numsShouldEq,
}
