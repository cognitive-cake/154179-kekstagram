'use strict';

window.sorting = (function () {
  var photoData = [];
  var filterClass = 'filters-item';

  var photoContainer = document.querySelector('.pictures');
  var sortingForm = document.querySelector('.filters');

  // Показ фильтров
  function showForm(data) {
    photoData = data;
    sortingForm.classList.remove('hidden');
    sortingForm.addEventListener('click', onSortingClick);
  }

  // Клик на сортировке
  function onSortingClick(event) {
    var clickTarget = event.target;
    while (clickTarget !== sortingForm) {
      if (clickTarget.classList.contains(filterClass)) {
        var sortName = clickTarget.getAttribute('for');
        sortPhotos(sortName);
        break;
      }
      clickTarget = clickTarget.parentElement;
    }
  }

  // Нахождение способа сортировки фотографий
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
    var popularPhotos = photoData.slice();
    popularPhotos.sort(function (a, b) {
      return b.likes - a.likes;
    });
    return popularPhotos;
  }

  // Сортировка по кол-ву комментариев
  function sortingDiscussed() {
    var discussedPhotos = photoData.slice();
    discussedPhotos.sort(function (a, b) {
      return b.comments.length - a.comments.length;
    });
    return discussedPhotos;
  }

  // Сортировка в случайном порядке
  function sortingRandom() {
    var randomPhotos = photoData.slice();
    randomPhotos.sort(function (a, b) {
      return Math.random() - 0.5;
    });
    return randomPhotos;
  }

  // Добавление фотографий в DOM
  function addSortedPhotosToDom(data) {
    var listOfPhotos = window.picture.createListOfPhotos(data);
    photoContainer.appendChild(listOfPhotos);
  }

  // Экспорт
  return {
    showForm: showForm
  };
})();
