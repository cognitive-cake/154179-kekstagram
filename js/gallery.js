'use strict';

window.gallery = (function () {

  var photoContainer = document.querySelector('.pictures');
  var galleryOverlay = document.querySelector('.gallery-overlay');
  var galleryOverlayClose = galleryOverlay.querySelector('.gallery-overlay-close');

  // --------- Обработчики событий ---------

  // Открытие галереи
  function galleryOpen() {
    galleryOverlay.classList.remove('hidden');
    photoContainer.removeEventListener('click', onPictureClick);
    galleryOverlayClose.addEventListener('click', onCloseCrossClick);
    galleryOverlayClose.addEventListener('keydown', onCloseCrossEnterPress);
    document.addEventListener('keydown', onGalleryEscPress);
  }

  // Закрытие галереи
  function galleryClose() {
    galleryOverlay.classList.add('hidden');
    photoContainer.addEventListener('click', onPictureClick);
    galleryOverlayClose.removeEventListener('click', onCloseCrossClick);
    galleryOverlayClose.removeEventListener('keydown', onCloseCrossEnterPress);
    document.removeEventListener('keydown', onGalleryEscPress);
  }

  // Клик на фотографии
  function onPictureClick(event) {
    event.preventDefault();
    var clickTarget = event.target;

    while (clickTarget !== photoContainer) {
      if (clickTarget.classList.contains('picture')) {
        window.preview.setPhotoToOverlay(clickTarget);
        galleryOpen();
        break;
      }
      clickTarget = clickTarget.parentElement;
    }
  }

  // Клик на крестике галереи
  function onCloseCrossClick() {
    galleryClose();
  }

  // Нажатие Enter на крестике галереи
  function onCloseCrossEnterPress(event) {
    var keyCode = event.keyCode;
    if (keyCode === window.tools.keyCodes.enter) {
      galleryClose();
    }
  }

  // Нажатие на ESC при открытой галерее
  function onGalleryEscPress(event) {
    var keyCode = event.keyCode;
    if (keyCode === window.tools.keyCodes.esc) {
      galleryClose();
    }
  }

  // ^^^^^^^^^ Обработчики событий ^^^^^^^^^

  // Генерация DOM-элементов на основе данных от сервера и добавление их в DOM-дерево
  function addPhotosToDom(data) {
    var listOfPhotos = window.picture.createListOfPhotos(data);
    photoContainer.appendChild(listOfPhotos);
    window.sorting.showSortingForm(data);
  }

  // Выполнение скрипта
  window.backend.load(addPhotosToDom, window.tools.displayErrorMessage);

  photoContainer.addEventListener('click', onPictureClick);

  // Экспорт
  return {
    onPictureClick: onPictureClick
  };
})();
