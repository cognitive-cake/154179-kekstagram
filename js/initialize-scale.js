'use strict';

window.initializeScale = function (clickTarget, currentValue, taskParameters, adjustValue) {
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
    adjustValue(newValue);
  }
  // Уменьшение значения
  function decreaseValue() {
    if (currentValue === taskParameters.minValue) {
      return;
    }
    var newValue = currentValue - taskParameters.changeStep;
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
