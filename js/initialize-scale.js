'use strict';

window.initializeScale = (function () {
  var TASK_PARAMETERS = {
    minValue: 25,
    maxValue: 100,
    changeStep: 25,
    radixForChangeValue: 10,
    changeUnits: '%',
    incBtnClass: 'upload-resize-controls-button-inc',
    decBtnClass: 'upload-resize-controls-button-dec',
    scaleValueClass: 'upload-resize-controls-value'
  };

  var resizeInput = document.querySelector('.' + TASK_PARAMETERS.scaleValueClass);

  // Клик в области кнопок масштабирования
  function onControlElementClick(event, currentValue, callback) {
    var clickTarget = event.target;
    if (isIncButton(clickTarget) && currentValue !== TASK_PARAMETERS.maxValue) {
      currentValue += TASK_PARAMETERS.changeStep;
    } else if (isDecButton(clickTarget) && currentValue !== TASK_PARAMETERS.minValue) {
      currentValue -= TASK_PARAMETERS.changeStep;
    }
    setScaleInputValue(currentValue);
    callback(currentValue);
  }

  // Установка значения для инпута
  function setScaleInputValue(value) {
    resizeInput.setAttribute('value', value + TASK_PARAMETERS.changeUnits);
  }

  // Если клик на кнопке "+"
  function isIncButton(clickTarget) {
    return clickTarget.classList.contains(TASK_PARAMETERS.incBtnClass);
  }

  // Если клик на кнопке "-"
  function isDecButton(clickTarget) {
    return clickTarget.classList.contains(TASK_PARAMETERS.decBtnClass);
  }

  return {
    init: function (target, callback) {
      target.addEventListener('click', function (event) {
        var currentValue = parseInt(resizeInput.getAttribute('value'), TASK_PARAMETERS.radixForChangeValue);
        onControlElementClick(event, currentValue, callback);
      });
    },
    setScaleInputValue: setScaleInputValue
  };
})();
