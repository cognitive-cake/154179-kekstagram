'use strict';

window.initializeScale = (function () {
  // Клик в области кнопок масштабирования
  function onControlElementClick(event) {
    var clickTarget = event.target;
    if (isChangeButton(clickTarget)) {
      var currentValue = getCurrentScaleValue();
      if (isIncButton(clickTarget)) {
        increaseValue(currentValue);
        return;
      } else if (isDecButton(clickTarget)) {
        decreaseValue(currentValue);
        return;
      }
    }
  }
  // Нахождение текущего значения масштаба
  function getCurrentScaleValue() {
    return parseInt(resizeValue.getAttribute('value'), taskParameters.radixForChangeValue);
  }
  // Выяснение, является ли цель клика нужной кнопкой
  function isChangeButton() {
    return clickTarget.classList.contains(taskParameters.mainElementClass);
  }
  // Если клик на кнопке "+"
  function isIncButton() {
    return clickTarget.classList.contains(taskParameters.incBtnClass);
  }
  // Если клик на кнопке "-"
  function isDecButton() {
    return clickTarget.classList.contains(taskParameters.decBtnClass);
  }
  // Увеличение значения
  function increaseValue() {
    if (currentValue === taskParameters.maxValue) {
      return;
    }
    var newValue = currentValue + taskParameters.changeStep;
    adjustValueFunc(newValue);
  }
  // Уменьшение значения
  function decreaseValue() {
    if (currentValue === taskParameters.minValue) {
      return;
    }
    var newValue = currentValue - taskParameters.changeStep;
    adjustValueFunc(newValue);
  }

  function initializeScale(target, callback) {
    target.addEventListener('click', );
  }

  // Выполнение скрипта

})();
