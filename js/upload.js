'use strict';

(function () {
  var photoContainer = document.querySelector('.pictures');
  var uploadForm = document.querySelector('#upload-select-image');
  var uploadFileInput = uploadForm.querySelector('#upload-file');
  var uploadOverlay = uploadForm.querySelector('.upload-overlay');
  var uploadOverlayClose = uploadForm.querySelector('.upload-form-cancel');
  var uploadComment = uploadForm.querySelector('.upload-form-description');

  var KEY_CODES = {
    esc: 27,
    enter: 13
  };

  // --------- Обработчики событий ---------
  // Открытие формы кадрирования
  function uploadOpen() {
    uploadOverlay.classList.remove('hidden');
    uploadOverlayClose.addEventListener('click', onCloseCrossClick);
    document.addEventListener('keydown', onUploadOverlayEscPress);
    uploadComment.addEventListener('focus', onCommentFocus);
    photoContainer.removeEventListener('click', window.pictures.onPictureClick);
  }
  // Закрытие формы кадрирования
  function uploadClose() {
    uploadOverlay.classList.add('hidden');
    uploadOverlayClose.removeEventListener('event', onCloseCrossClick);
    document.removeEventListener('keydown', onUploadOverlayEscPress);
    uploadComment.removeEventListener('focus', onCommentFocus);
    photoContainer.addEventListener('click', window.pictures.onPictureClick);
  }
  // Загрузка фотографии
  function onPhotoUpload(event) {
    uploadOpen();
  }
  // Клик на кнопке закрытия формы кадрирования
  function onCloseCrossClick(event) {
    uploadClose();
  }
  // Нажатие на ESC при показанной форме кадрирования
  function onUploadOverlayEscPress(event) {
    var keyCode = event.keyCode;
    if (keyCode === KEY_CODES.esc) {
      uploadClose();
    }
  }
  // Фокус на поле для комментария
  function onCommentFocus(event) {
    document.removeEventListener('keydown', onUploadOverlayEscPress);
    uploadComment.addEventListener('blur', onCommentUnfocus);
  }
  // Фокус с поля для комментария снят
  function onCommentUnfocus(event) {
    document.addEventListener('keydown', onUploadOverlayEscPress);
    uploadComment.removeEventListener('blur', onCommentUnfocus);
  }
  // ^^^^^^^^^ Обработчики событий ^^^^^^^^^

  // Выполнение скрипта
  uploadFileInput.addEventListener('change', onPhotoUpload);
})();
