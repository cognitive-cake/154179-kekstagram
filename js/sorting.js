'use strict';

window.sorting = (function () {
  var param = {
    labelClass: 'filters-item',
  };
  var photoData = [];

  var photoContainer = document.querySelector('.pictures');
  var sortingForm = document.querySelector('.filters');

  // Показ фильтров
  function showSortingForm(data) {
    photoData = data;
    sortingForm.classList.remove('hidden');
    sortingForm.addEventListener('click', onSortingClick);
  }

  // Клик на сортировке
  function onSortingClick(event) {
    var clickTarget = event.target;
    while (clickTarget !== sortingForm) {
      if (clickTarget.classList.contains(param.labelClass)) {
        var sortName = clickTarget.getAttribute('for');
        sortPhotos(sortName);
        break;
      }
      clickTarget = clickTarget.parentElement;
    }
  }

  // Нахождение способа сортировки фотограф
  function sortPhotos(sortName) {
    var sortedPhotos;

    switch (sortName) {
      case 'filter-popular':
        sortedPhotos = sortingPopular();
        break;
      case 'filter-discussed':
        sortedPhotos = sortingDiscussed();
        break;
      case 'filter-random':
        sortedPhotos = sortingRandom();
        break;
      default:
        sortedPhotos = photoData.slice();
    }

    window.tools.debounce(function () {
      removePhotos();
      addSortedPhotosToDom(sortedPhotos);
    });
  }

  // Удаление всех фотографий
  function removePhotos() {
    photoContainer.innerHTML = '';
  }

  // Сортировка по популярности
  function sortingPopular() {
    var photoDataPopular = photoData.slice();
    photoDataPopular.sort(function (a, b) {
      return b.likes - a.likes;
    });
    return photoDataPopular;
  }

  // Сортировка по кол-ву комментариев
  function sortingDiscussed() {
    var photoDataDiscussed = photoData.slice();
    photoDataDiscussed.sort(function (a, b) {
      return b.comments.length - a.comments.length;
    });
    return photoDataDiscussed;
  }

  // Сортировка в случайном порядке
  function sortingRandom() {
    var photoDataRandom = photoData.slice();
    photoDataRandom.sort(function (a, b) {
      return Math.random() - 0.5;
    });
    return photoDataRandom;
  }

  // Добавление фотографий в DOM
  function addSortedPhotosToDom(data) {
    var listOfPhotos = window.picture.createListOfPhotos(data);
    photoContainer.appendChild(listOfPhotos);
  }

  // Экспорт
  return {
    showSortingForm: showSortingForm
  };
})();
