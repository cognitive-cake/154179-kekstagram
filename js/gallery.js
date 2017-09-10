'use strict';

window.gallery = (function () {

  var photoContainer = document.querySelector('.pictures');
  var galleryOverlay = document.querySelector('.gallery-overlay');
  var galleryOverlayClose = galleryOverlay.querySelector('.gallery-overlay-close');

  var KEY_CODES = {
    esc: 27,
    enter: 13
  };

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
  function onCloseCrossClick(event) {
    galleryClose();
  }
  // Нажатие Enter на крестике галереи
  function onCloseCrossEnterPress(event) {
    var keyCode = event.keyCode;
    if (keyCode === KEY_CODES.enter) {
      galleryClose();
    }
  }
  // Нажатие на ESC при открытой галерее
  function onGalleryEscPress(event) {
    var keyCode = event.keyCode;
    if (keyCode === KEY_CODES.esc) {
      galleryClose();
    }
  }
  // ^^^^^^^^^ Обработчики событий ^^^^^^^^^

  // Выполнение скрипта
  window.backend.load(onSuccess, onError);

  function onSuccess(data) {
    var listOfPhotos = window.picture.createListOfPhotos(data);
    photoContainer.appendChild(listOfPhotos);
  }

  function onError(message) {
    var node = document.createElement('div');
    node.style.zIndex = 100;
    node.style.margin = '0 auto';
    node.style.textAlign = 'center';
    node.style.backgroundColor = '#f97f7f';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';

    node.textContent = message;
    document.body.insertAdjacentElement('afterbegin', node);
  }

  photoContainer.addEventListener('click', onPictureClick);

  // Экспорт
  return {
    onPictureClick: onPictureClick
  };
})();
