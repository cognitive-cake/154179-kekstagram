'use strict';

window.tools = (function () {
  var parameters = {
    debounceInterval: 500,
    timeoutForMessage: 5000
  };

  var lastTimeout;

  // Генерация случайного числа в промежутке [min, max)
  function getRandomNumber(min, max) {
    return (Math.random() * (max - min) + min);
  }

  // Генерация случайного числа, округленного до ближайшего целого
  function getRandomRoundNumber(min, max) {
    return Math.round(getRandomNumber(min, max));
  }

  // Нахождение наибольшего значения в массиве
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

  // Возвращает случайный элемент массива
  function getRandomValueOfArray(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Определение, попадает ли число в диапазон от 11 до 19
  function isSecondTen(number) {
    var string = number.toString();
    return string.charAt(string.length - 2) === '1';
  }

  // Проверка, что все элементы в массиве уникальны
  function isUniqElementsInArray(rawArray) {
    var isUniq = true;
    var array = [];
    for (var i = 0; i < rawArray.length; i++) {
      array.push(rawArray[i].toLowerCase());
    }
    for (i = 0; i < array.length; i++) {
      if (array.indexOf(array[i], i + 1) !== -1) {
        isUniq = false;
        break;
      }
    }
    return isUniq;
  }

  // Назначение класса .invalid
  function setInvalidClass(element) {
    element.classList.add('invalid');
  }

  // Снятие класса .invalid
  function unsetInvalidClass(element) {
    element.classList.remove('invalid');
  }

  // Проверка, присутствует ли класс .invalid у элемента
  function checkInvalidClass(element) {
    return element.classList.contains('invalid');
  }

  // Отображение сообщения
  function displayErrorMessage(message) {
    var node = document.createElement('div');
    node.classList.add('error-message');
    node.style.zIndex = 100;
    node.style.margin = '0 auto';
    node.style.textAlign = 'center';
    node.style.backgroundColor = '#e22f2f';
    node.style.color = 'white';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';
    node.style.fontFamily = '"Open Sans", Arial, sans-serif';

    node.textContent = message;
    document.body.insertAdjacentElement('afterbegin', node);

    setTimeout(function () {
      removeErrorMessage();
    }, parameters.timeoutForMessage);
  }

  // Скрытие сообщения
  function removeErrorMessage() {
    var node = document.querySelector('.error-message');
    node.remove();
  }

  // Функция для задержки отрисовки элементов
  function debounce(callback) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(callback, parameters.debounceInterval);
  }

  // Экспорт
  return {
    getRandomNumber: getRandomNumber,
    getRandomRoundNumber: getRandomRoundNumber,
    getMaxValue: getMaxValue,
    getRandomValueOfArray: getRandomValueOfArray,
    isSecondTen: isSecondTen,
    isUniqElementsInArray: isUniqElementsInArray,
    setInvalidClass: setInvalidClass,
    unsetInvalidClass: unsetInvalidClass,
    checkInvalidClass: checkInvalidClass,
    displayErrorMessage: displayErrorMessage,
    debounce: debounce
  };
})();
