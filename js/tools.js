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
  // Определение, попадает ли число в диапазон от 11 до 19
  function isSecondTen(number) {
    var string = number.toString();
    return string.charAt(string.length - 2) === '1';
  }

  var obj = {
    getRandomNumber: getRandomNumber,
    getRandomRoundNumber: getRandomRoundNumber,
    getMaxValue: getMaxValue,
    getRandomValueOfArray: getRandomValueOfArray,
    isSecondTen: isSecondTen
  };

  return obj;
})();
