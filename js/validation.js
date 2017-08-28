'use strict';

(function () {
  var uploadForm = document.querySelector('#upload-select-image');
  var uploadFileInput = uploadForm.querySelector('#upload-file');
  var uploadOverlay = uploadForm.querySelector('.upload-overlay');
  var photoContainer = document.querySelector('.pictures');

  // --------- Обработчики событий ---------
  // Загрузка фотографии
  function onPhotoUpload(event) {
    photoContainer.removeEventListener('click', window.pictures.onPictureClick);
    uploadOverlay.classList.remove('hidden');
  }
  // ^^^^^^^^^ Обработчики событий ^^^^^^^^^

  // Выполнение скрипта
  uploadFileInput.addEventListener('change', onPhotoUpload);
})();
