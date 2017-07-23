const assertEvent =  (contract, eventName, filter) => {
  return new Promise((resolve, reject) => {
    var event = contract[eventName]()
    event.watch()
    event.get((error, logs) => {
      var log = logs.filter(filter)
      if (log) {
        resolve(log)
      } else {
        throw Error(`Failed to find filtered event for ${filter.event}`)
      }
    })
    event.stopWatching()
  })
}

module.exports = {
  assertEvent: assertEvent
}
