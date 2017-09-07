'use strict';

window.initializeFilters = (function () {
  var taskParameters = {
    definingClassForEffects: 'upload-effect-label'
  };

  // Клик в поле с эффектами
  function onEffectFieldsetClick(event, target, callback) {
    var clickTarget = event.target;
    while (clickTarget !== target) {
      if (clickTarget.classList.contains(taskParameters.definingClassForEffects)) {
        callback(clickTarget);
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
