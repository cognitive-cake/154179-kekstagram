'use strict';

(function () {
  var taskParameters = {
    beginSliceIndex: 7, // первый параметр для метода .slice(). Применяется к строке наподобие 'upload-effect-chrome'
    minScale: 25,
    maxScale: 100,
    scaleStep: 25,
    scaleUnits: '%',
    radixForScaleValue: 10
  };

  // Переменные для показа/сокрытия формы
  var photoContainer = document.querySelector('.pictures');
  var uploadForm = document.querySelector('#upload-select-image');
  var uploadFileInput = uploadForm.querySelector('#upload-file');
  var uploadOverlay = uploadForm.querySelector('.upload-overlay');
  var uploadOverlayClose = uploadForm.querySelector('.upload-form-cancel');
  var uploadComment = uploadForm.querySelector('.upload-form-description');

  // Переменные для эффектов
  var effectFieldset = uploadForm.querySelector('.upload-effect-controls');
  var imagePreview = uploadForm.querySelector('.effect-image-preview');
  var lastEffectClass;

  // Переменные для масштабирования
  var resizeControls = uploadForm.querySelector('.upload-resize-controls');
  var resizeValue = resizeControls.querySelector('.upload-resize-controls-value');

  var KEY_CODES = {
    esc: 27,
    enter: 13
  };

  // --------- Обработчики событий ---------
  // --- Показ/сокрытие формы ---
  // Открытие формы кадрирования
  function uploadOpen() {
    uploadOverlay.classList.remove('hidden');
    uploadOverlayClose.addEventListener('click', onCloseCrossClick);
    document.addEventListener('keydown', onUploadOverlayEscPress);
    uploadComment.addEventListener('focus', onCommentFocusing);
    effectFieldset.addEventListener('click', onEffectFieldsetClick);
    resizeControls.addEventListener('click', onResizeControlsClick);

    photoContainer.removeEventListener('click', window.pictures.onPictureClick);
  }
  // Закрытие формы кадрирования
  function uploadClose() {
    uploadOverlay.classList.add('hidden');
    uploadOverlayClose.removeEventListener('event', onCloseCrossClick);
    document.removeEventListener('keydown', onUploadOverlayEscPress);
    uploadComment.removeEventListener('focus', onCommentFocusing);
    effectFieldset.removeEventListener('click', onEffectFieldsetClick);
    resizeControls.removeEventListener('click', onResizeControlsClick);

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
  // ^^^ Показ/сокрытие формы ^^^
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
    imagePreview.classList.remove(lastEffectClass);
    lastEffectClass = effectName;
    imagePreview.classList.add(effectName);
  }
  // ^^^ Применение эффекта к изображению ^^^
  // --- Изменение масштаба изображения ---
  // Клик в области кнопок масштабирования
  function onResizeControlsClick(event) {
    var clickTarget = event.target;
    var currentValue = parseInt(resizeValue.getAttribute('value'), taskParameters.radixForScaleValue);
    while (clickTarget !== resizeControls) {
      if (clickTarget.classList.contains('upload-resize-controls-button-inc')) {
        if (currentValue === taskParameters.maxScale) {
          break;
        }
        increaseScale(currentValue);
        break;
      } else if (clickTarget.classList.contains('upload-resize-controls-button-dec')) {
        if (currentValue === taskParameters.minScale) {
          break;
        }
        decreaseScale(currentValue);
        break;
      }
      clickTarget = clickTarget.parentElement;
    }
  }
  // Увеличение масштаба
  function increaseScale(currentValue) {
    var newValue = currentValue + taskParameters.scaleStep;
    resizeValue.setAttribute('value', newValue + taskParameters.scaleUnits);
    imagePreview.style.transform = 'scale(' + newValue / 100 + ')';
  }
  // Уменьшение масштаба
  function decreaseScale(currentValue) {
    var newValue = currentValue - taskParameters.scaleStep;
    resizeValue.setAttribute('value', newValue + taskParameters.scaleUnits);
    imagePreview.style.transform = 'scale(' + newValue / 100 + ')';
  }
  // ^^^ Изменение масштаба изображения ^^^
  // ^^^^^^^^^ Обработчики событий ^^^^^^^^^

  // Выполнение скрипта
  uploadFileInput.addEventListener('change', onPhotoUpload);
})();
