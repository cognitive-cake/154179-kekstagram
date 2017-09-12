'use strict';

window.sorting = (function () {
  var taskParameters = {

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
      if (clickTarget.classList.contains('filters-radio') && !clickTarget.hasAttribute('checked')) {
        var sortType = clickTarget.getAttribute('id');
        switch (sortType) {
          case 'filter-popular':

            break;
          case 'filter-discussed':

            break;
          case 'filter-random':

            break;
          default:

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
