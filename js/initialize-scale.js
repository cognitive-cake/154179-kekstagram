'use strict';

window.initializeScale = (function () {
  var taskParameters = {
    minValue: 25,
    maxValue: 100,
    changeStep: 25,
    radixForChangeValue: 10,
    changeUnits: '%',
    incBtnClass: 'upload-resize-controls-button-inc',
    decBtnClass: 'upload-resize-controls-button-dec',
    scaleValueClass: 'upload-resize-controls-value'
  };

  var resizeInput = document.querySelector('.' + taskParameters.scaleValueClass);
  var currentValue = parseInt(resizeInput.getAttribute('value'), taskParameters.radixForChangeValue);

  // Клик в области кнопок масштабирования
  function onControlElementClick(event, callback) {
    var clickTarget = event.target;
    if (isIncButton(clickTarget) && currentValue !== taskParameters.maxValue) {
      currentValue += taskParameters.changeStep;
    } else if (isDecButton(clickTarget) && currentValue !== taskParameters.minValue) {
      currentValue -= taskParameters.changeStep;
    }
    resizeInput.setAttribute('value', currentValue + taskParameters.changeUnits);
    callback(currentValue);
  }

  // Если клик на кнопке "+"
  function isIncButton(clickTarget) {
    return clickTarget.classList.contains(taskParameters.incBtnClass);
  }

  // Если клик на кнопке "-"
  function isDecButton(clickTarget) {
    return clickTarget.classList.contains(taskParameters.decBtnClass);
  }

  return function initializeScale(target, callback) {
    target.addEventListener('click', function (event) {
      onControlElementClick(event, callback);
    });
  };

})();
