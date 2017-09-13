'use strict';

window.sorting = (function () {
  var param = {
    labelClass: 'filters-item',
    inputClass: 'filters-radio'
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
        var linkedInput = sortingForm.querySelector('#' + sortName);
        if (!linkedInput.checked) {
          switch (sortName) {
            case 'filter-popular':
              removePhotos();
              addSortedPhotosToDom(sortingPopular());
              break;
            case 'filter-discussed':
              removePhotos();
              addSortedPhotosToDom(sortingDiscussed());
              break;
            case 'filter-random':
              removePhotos();
              addSortedPhotosToDom(sortingRandom());
              break;
            default:
              removePhotos();
              addSortedPhotosToDom(photoData);
          }
        }
        break;
      }
      clickTarget = clickTarget.parentElement;
    }
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
      return Math.random() - 0.5; // Если честно, совсем не понимаю как это работает. Магия какая-то. Стащил такое решение с сайта Кантора.
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
