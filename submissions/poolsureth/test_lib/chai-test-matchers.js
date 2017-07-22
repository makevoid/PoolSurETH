const chai      = require('chai')
const chaiUtils = require('chai/lib/chai/utils')

chaiUtils.addChainableMethod(chai.Assertion.prototype, 'numEqual', function(number) {
  const num = chaiUtils.flag(this, 'object')
  new chai.Assertion(Number(num)).to.be.equal(number)
})
