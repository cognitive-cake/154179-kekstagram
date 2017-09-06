'use strict';

window.initializeScale = function (clickTarget, currentValue, taskParameters, adjustValue) {
  // Выяснение, является ли цель клика нужной кнопкой
  function isChangeButton() {
    return clickTarget.classList.contains(taskParameters.resizeControlsClass);
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
    if (currentValue === taskParameters.maxScale) {
      return;
    }
    var newValue = currentValue + taskParameters.scaleStep;
    adjustValue(newValue);
  }
  // Уменьшение значения
  function decreaseValue() {
    if (currentValue === taskParameters.minScale) {
      return;
    }
    var newValue = currentValue - taskParameters.scaleStep;
    adjustValue(newValue);
  }

  // Выполнение скрипта
  if (isChangeButton(clickTarget)) {
    if (isIncButton(clickTarget)) {
      increaseValue(currentValue);
      return;
    } else if (isDecButton(clickTarget)) {
      decreaseValue(currentValue);
      return;
    }
  }
};
