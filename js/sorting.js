'use strict';

window.sorting = (function () {
  var param = {
    labelClass: 'filters-item',
    inputClass: 'filters-radio'
  };
  var originalData = [];

  var sortingForm = document.querySelector('.filters');

  // Показ фильтров
  function showSortingForm(data) {
    originalData = data;
    sortingForm.classList.remove('hidden');
    sortingForm.addEventListener('click', function (event) {
      onSortingClick(event);
    });
  }

  // Клик на сортировке
  function onSortingClick(event) {
    var clickTarget = event.target;
    while (clickTarget !== sortingForm) {
      if (clickTarget.classList.contains(param.labelClass)) {
        var sortName = clickTarget.getAttribute('for');
        var linkedInput = sortingForm.querySelector('#' + sortName);
        if (!linkedInput.checked) {
          switch (sortName) {
            case 'filter-popular':
              console.log(sortName);
              break;
            case 'filter-discussed':
              console.log(sortName);
              break;
            case 'filter-random':
              console.log(sortName);
              break;
            default:
              console.log(sortName);
          }
        }
        break;
      }
      clickTarget = clickTarget.parentElement;
    }
  }

  // Экспорт
  return {
    showSortingForm: showSortingForm
  };
})();
