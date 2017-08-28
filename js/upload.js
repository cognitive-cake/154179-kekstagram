'use strict';

(function () {
  var taskParameters = {
    beginSliceIndex: 7 // первый параметр для метода .slice(). Применяется к строке наподобие 'upload-effect-chrome'
  };

  var photoContainer = document.querySelector('.pictures');
  var uploadForm = document.querySelector('#upload-select-image');
  var uploadFileInput = uploadForm.querySelector('#upload-file');
  var uploadOverlay = uploadForm.querySelector('.upload-overlay');
  var uploadOverlayClose = uploadForm.querySelector('.upload-form-cancel');
  var uploadComment = uploadForm.querySelector('.upload-form-description');
  var effectFieldset = uploadForm.querySelector('.upload-effect-controls');
  var effectInputs = effectFieldset.querySelectorAll('input[name="effect"]');
  var effectLabels = effectFieldset.querySelectorAll('.upload-effect-label');
  var effectPreview = uploadForm.querySelector('.effect-image-preview');
  var lastEffectClass;

  var KEY_CODES = {
    esc: 27,
    enter: 13
  };

  // --------- Обработчики событий ---------
  // --- Показ/скрытие формы ---
  // Открытие формы кадрирования
  function uploadOpen() {
    uploadOverlay.classList.remove('hidden');
    uploadOverlayClose.addEventListener('click', onCloseCrossClick);
    document.addEventListener('keydown', onUploadOverlayEscPress);
    uploadComment.addEventListener('focus', onCommentFocusing);
    effectFieldset.addEventListener('click', onEffectFieldsetClick);

    photoContainer.removeEventListener('click', window.pictures.onPictureClick);
  }
  // Закрытие формы кадрирования
  function uploadClose() {
    uploadOverlay.classList.add('hidden');
    uploadOverlayClose.removeEventListener('event', onCloseCrossClick);
    document.removeEventListener('keydown', onUploadOverlayEscPress);
    uploadComment.removeEventListener('focus', onCommentFocusing);
    effectFieldset.removeEventListener('click', onEffectFieldsetClick);

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
  function onCommentFocusing(event) {
    document.removeEventListener('keydown', onUploadOverlayEscPress);
    uploadComment.addEventListener('blur', onCommentDefocusing);
  }
  // Фокус с поля для комментария снят
  function onCommentDefocusing(event) {
    document.addEventListener('keydown', onUploadOverlayEscPress);
    uploadComment.removeEventListener('blur', onCommentDefocusing);
  }
  // ^^^ Показ/скрытие формы ^^^
  // --- Применение эффекта к изображению ---
  // Клик в поле с эффектами
  function onEffectFieldsetClick(event) {
    var clickTarget = event.target;
    while (clickTarget !== effectFieldset) {
      if (clickTarget.classList.contains('upload-effect-label')) {
        addEffectToPhoto(clickTarget);
        break;
      }
      clickTarget = clickTarget.parentElement;
    }
  }
  // Применение эффекта к фотографии
  function addEffectToPhoto(clickTarget) {
    var effectName = clickTarget.getAttribute('for').slice(taskParameters.beginSliceIndex);
    effectPreview.classList.remove(lastEffectClass);
    lastEffectClass = effectName;
    effectPreview.classList.add(effectName);
  }
  // ^^^ Применение эффекта к изображению ^^^
  // ^^^^^^^^^ Обработчики событий ^^^^^^^^^

  // Выполнение скрипта
  uploadFileInput.addEventListener('change', onPhotoUpload);
})();
