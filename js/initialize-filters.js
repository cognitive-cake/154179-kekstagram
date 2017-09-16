'use strict';

window.initializeFilters = (function () {
  var TASK_PARAMETERS = {
    definingClassForEffects: 'upload-effect-label',
    beginSliceIndex: 7, // первый параметр для метода .slice(). Применяется к строке наподобие 'upload-effect-chrome'
  };

  // Клик в поле с эффектами
  function onEffectFieldsetClick(event, target, callback) {
    var clickTarget = event.target;
    while (clickTarget !== target) {
      if (clickTarget.classList.contains(TASK_PARAMETERS.definingClassForEffects)) {
        var effectName = clickTarget.getAttribute('for').slice(TASK_PARAMETERS.beginSliceIndex);
        callback(clickTarget, effectName);
        break;
      }
      clickTarget = clickTarget.parentElement;
    }
  }

  return function initializeFilters(target, callback) {
    target.addEventListener('click', function (event) {
      onEffectFieldsetClick(event, target, callback);
    });
  };
})();
