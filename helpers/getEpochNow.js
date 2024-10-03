/**
 * @type - Helper
 * @name - getEpoch
 * @param - optional (seconds)
 * @description - Returns current epoch time + optional (seconds)
 * @returns - epoch time
 */

let getEpoch = (seconds = 0) => {
  return Math.ceil(Date.now() / 1000) + seconds
}

module.exports = getEpoch