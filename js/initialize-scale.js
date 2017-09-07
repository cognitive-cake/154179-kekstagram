'use strict';

window.initializeScale = (function () {
  var taskParameters = {
    minValue: 25,
    maxValue: 100,
    changeStep: 25,
    changeUnits: '%',
    radixForChangeValue: 10,
    mainElementClass: 'upload-resize-controls-button',
    incBtnClass: 'upload-resize-controls-button-inc',
    decBtnClass: 'upload-resize-controls-button-dec',
    scaleValueClass: 'upload-resize-controls-value'
  };
  // Клик в области кнопок масштабирования
  function onControlElementClick(event, callback) {
    var clickTarget = event.target;
    if (isChangeButton(clickTarget)) {
      var currentValue = getCurrentScaleValue();
      if (isIncButton(clickTarget)) {
        increaseValue(currentValue, callback);
        return;
      } else if (isDecButton(clickTarget)) {
        decreaseValue(currentValue, callback);
        return;
      }
    }
  }
  // Нахождение текущего значения масштаба
  function getCurrentScaleValue() {
    var resizeValue = document.querySelector('.' + taskParameters.scaleValueClass);
    return parseInt(resizeValue.getAttribute('value'), taskParameters.radixForChangeValue);
  }
  // Выяснение, является ли цель клика нужной кнопкой
  function isChangeButton(clickTarget) {
    return clickTarget.classList.contains(taskParameters.mainElementClass);
  }
  // Если клик на кнопке "+"
  function isIncButton(clickTarget) {
    return clickTarget.classList.contains(taskParameters.incBtnClass);
  }
  // Если клик на кнопке "-"
  function isDecButton(clickTarget) {
    return clickTarget.classList.contains(taskParameters.decBtnClass);
  }
  // Увеличение значения
  function increaseValue(currentValue, callback) {
    if (currentValue === taskParameters.maxValue) {
      return;
    }
    var newValue = currentValue + taskParameters.changeStep;
    callback(newValue);
  }
  // Уменьшение значения
  function decreaseValue(currentValue, callback) {
    if (currentValue === taskParameters.minValue) {
      return;
    }
    var newValue = currentValue - taskParameters.changeStep;
    callback(newValue);
  }

  return function initializeScale(target, callback) {
    target.addEventListener('click', function (event) {
      onControlElementClick(event, callback, taskParameters);
    });
  };

})();
