'use strict';

window.tools = (function () {
  function getRandomNumber(min, max) {
    return (Math.random() * (max - min) + min);
  }
  function getRandomRoundNumber(min, max) {
    return Math.round(getRandomNumber(min, max));
  }
  function getMaxValue(array) {
    var maxValue = -1;
    for (var i = 0; i < array.length; i++) {
      var currValue = array[i];
      if (currValue > maxValue) {
        maxValue = currValue;
      }
    }
    return maxValue;
  }
  function getRandomValueOfArray(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  var obj = {
    getRandomNumber: getRandomNumber,
    getRandomRoundNumber: getRandomRoundNumber,
    getMaxValue: getMaxValue,
    getRandomValueOfArray: getRandomValueOfArray
  };

  return obj;
})();
