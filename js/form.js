'use strict';

(function () {
  var hashTagsValidation = {
    firstChar: '#',
    regExpFirstChar: /#/g,
    tagsSeparator: ' ',
    maxTagsAmount: 5,
    maxOneTagLength: 20,
    errorMessage: 'Хэш-тег начинается с символа \`#\` (решётка) и состоит из одного слова. \nХэш-теги разделяются пробелами. \nОдин и тот же хэш-тег не может быть использован дважды. \nНельзя указать больше пяти хэш-тегов. \nМаксимальная длина одного хэш-тега 20 символов.'
  };
  var effectsParameters = {
    defaultEffectClass: 'effect-none',
    defaultEffectValue: 100,
    effectLineUnit: '%',
    effectPinPositionPrecision: 1,
    effectPreviewPrecision: 2,
    effectClassIndex: 1,

    effectChrome: {
      class: 'effect-chrome',
      property: 'grayscale',
      maxValue: 1,
      units: ''
    },
    effectSepia: {
      class: 'effect-sepia',
      property: 'sepia',
      maxValue: 1,
      units: ''
    },
    effectMarvin: {
      class: 'effect-marvin',
      property: 'invert',
      maxValue: 100,
      units: '%'
    },
    effectPhobos: {
      class: 'effect-phobos',
      property: 'blur',
      maxValue: 3,
      units: 'px'
    },
    effectHeat: {
      class: 'effect-heat',
      property: 'brightness',
      maxValue: 3,
      units: ''
    },
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
  var effectLevelSlider = uploadForm.querySelector('.upload-effect-level');
  var effectLevelPin = effectLevelSlider.querySelector('.upload-effect-level-pin');
  var effectLevelBar = effectLevelSlider.querySelector('.upload-effect-level-val');
  var lastEffectClass;

  // Переменные для масштабирования
  var resizeControls = uploadForm.querySelector('.upload-resize-controls');

  // Переменные для хэш-тегов
  var hashTagInput = uploadForm.querySelector('.upload-form-hashtags');
  var submitButton = uploadForm.querySelector('#upload-submit');

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
    uploadComment.addEventListener('input', onCommentInput);
    submitButton.addEventListener('click', onSubmitClick);
    uploadForm.addEventListener('submit', onFormSubmit);

    photoContainer.removeEventListener('click', window.gallery.onPictureClick);
  }

  // Закрытие формы кадрирования
  function uploadClose() {
    removeEffectFromPhoto();
    uploadOverlay.classList.add('hidden');
    uploadOverlayClose.removeEventListener('event', onCloseCrossClick);
    document.removeEventListener('keydown', onUploadOverlayEscPress);
    uploadComment.removeEventListener('focus', onCommentFocusing);
    uploadComment.removeEventListener('input', onCommentInput);
    submitButton.removeEventListener('click', onSubmitClick);
    uploadForm.removeEventListener('submit', onFormSubmit);
    uploadForm.reset();

    photoContainer.addEventListener('click', window.gallery.onPictureClick);
  }

  // Загрузка фотографии
  function onPhotoUpload(event) {
    window.initializeUpload.setNewImage();
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

  // Применение эффекта к фотографии
  function addEffectToPhoto(clickTarget, effectName) {
    imagePreview.classList.remove(lastEffectClass);
    lastEffectClass = effectName;
    imagePreview.classList.add(effectName);

    showEffectsSlider();
    if (imagePreview.classList.contains(effectsParameters.defaultEffectClass)) {
      hideEffectsSlider();
    }
  }

  // Удаление эффекта при закрытии формы
  function removeEffectFromPhoto() {
    imagePreview.classList.remove(lastEffectClass);
    imagePreview.style.filter = '';
    setPinPosition(effectsParameters.defaultEffectValue);
    hideEffectsSlider();
  }

  // Показ слайдера насыщенности для эффектов
  function showEffectsSlider() {
    setEffectAndMovePin(effectsParameters.defaultEffectValue);
    effectLevelSlider.classList.remove('hidden');
    effectLevelPin.addEventListener('mousedown', onEffectPinMouseDown);
  }

  // Скрытие слайдера насыщенности для эффектов
  function hideEffectsSlider() {
    effectLevelSlider.classList.add('hidden');
    effectLevelPin.removeEventListener('mousedown', onEffectPinMouseDown);
  }

  // Нажатие на пин мышью
  function onEffectPinMouseDown(evt) {
    evt.preventDefault();
    var startX = evt.clientX;
    var effectLineWidth = uploadForm.querySelector('.upload-effect-level-line').clientWidth;

    // Перетаскивание пина
    function onEffectPinMouseMove(moveEvt) {
      moveEvt.preventDefault();

      var shiftX = startX - moveEvt.clientX;
      var pinPositionInPercent = ((effectLevelPin.offsetLeft - shiftX) / effectLineWidth) * 100;
      startX = moveEvt.clientX;

      if (pinPositionInPercent > 100) {
        pinPositionInPercent = 100;
      }
      if (pinPositionInPercent < 0) {
        pinPositionInPercent = 0;
      }

      setEffectAndMovePin(pinPositionInPercent);
    }

    // Отпускание кнопки мыши на пине
    function onEffectPinMouseUp(upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onEffectPinMouseMove);
      document.removeEventListener('mouseup', onEffectPinMouseUp);
    }

    document.addEventListener('mousemove', onEffectPinMouseMove);
    document.addEventListener('mouseup', onEffectPinMouseUp);
  }

  // Применение эффекта
  function setEffectAndMovePin(value) {
    var filter = findCurrentEffect();
    setPinPosition(value);
    setFilterValueForPreview(filter, value);
  }

  // Нахождение текущего эффекта
  function findCurrentEffect() {
    var currentEffect;
    switch (imagePreview.classList[effectsParameters.effectClassIndex]) {
      case effectsParameters.effectChrome.class:
        currentEffect = effectsParameters.effectChrome;
        break;
      case effectsParameters.effectSepia.class:
        currentEffect = effectsParameters.effectSepia;
        break;
      case effectsParameters.effectMarvin.class:
        currentEffect = effectsParameters.effectMarvin;
        break;
      case effectsParameters.effectPhobos.class:
        currentEffect = effectsParameters.effectPhobos;
        break;
      case effectsParameters.effectHeat.class:
        currentEffect = effectsParameters.effectHeat;
        break;
      default:
        currentEffect = effectsParameters.defaultEffectClass;
    }
    return currentEffect;
  }

  // Установка положения для слайдера
  function setPinPosition(value) {
    var pinPositionString = value.toFixed(effectsParameters.effectPinPositionPrecision) + effectsParameters.effectLineUnit;
    effectLevelPin.style.left = pinPositionString;
    effectLevelPin.setAttribute('title', pinPositionString);
    effectLevelBar.style.width = pinPositionString;
  }

  // Установка значения filter для текущего эффекта
  function setFilterValueForPreview(effect, value) {
    if (effect === effectsParameters.defaultEffectClass) {
      imagePreview.style.filter = '';
      return;
    }
    var valueInDecimal = value / 100;
    imagePreview.style.filter = effect.property + '(' + (valueInDecimal * effect.maxValue).toFixed(effectsParameters.effectPreviewPrecision) + effect.units + ')';
  }

  // Вызов модуля и передача ему callback-функции
  window.initializeFilters(effectFieldset, addEffectToPhoto);

  // ^^^ Применение эффекта к изображению ^^^
  // --- Изменение масштаба изображения ---

  // Применение нового значения масштаба
  function adjustScale(newValue) {
    imagePreview.style.transform = 'scale(' + newValue / 100 + ')';
  }

  // Вызов модуля и передача ему callback-функции
  window.initializeScale(resizeControls, adjustScale);

  // ^^^ Изменение масштаба изображения ^^^
  // --- Валидация хэш-тегов ---

  // Клик на кнопке отправки формы
  function onSubmitClick(event) {
    window.tools.unsetInvalidClass(hashTagInput);
    hashTagInput.setCustomValidity('');
    checkHashTagsValidity();
  }

  // Валидация строки с хэш-тегами
  function checkHashTagsValidity() {
    var arrayOfValues = hashTagInput.value.split(hashTagsValidation.tagsSeparator);
    if (arrayOfValues[0] === '') {
      return;
    }
    for (var i = 0; i < arrayOfValues.length; i++) {
      var singleTag = arrayOfValues[i];
      var hashSymbols = singleTag.match(hashTagsValidation.regExpFirstChar);

      if (singleTag.charAt(0) !== hashTagsValidation.firstChar) {
        window.tools.setInvalidClass(hashTagInput);
      }
      if (hashSymbols && hashSymbols.length > 1) {
        window.tools.setInvalidClass(hashTagInput);
      }
      if (singleTag.length > hashTagsValidation.maxOneTagLength) {
        window.tools.setInvalidClass(hashTagInput);
      }
    }
    if (!window.tools.isUniqElementsInArray(arrayOfValues)) {
      window.tools.setInvalidClass(hashTagInput);
    }
    if (arrayOfValues.length > hashTagsValidation.maxTagsAmount) {
      window.tools.setInvalidClass(hashTagInput);
    }
    if (window.tools.checkInvalidClass(hashTagInput)) {
      hashTagInput.setCustomValidity(hashTagsValidation.errorMessage);
    }
  }

  // ^^^ Валидация хэш-тегов ^^^
  // --- Валидация комментария ---

  function onCommentInput(event) {
    window.tools.unsetInvalidClass(uploadComment);
    if (!uploadComment.checkValidity()) {
      window.tools.setInvalidClass(uploadComment);
    }
  }

  // ^^^ Валидация комментария ^^^
  // --- Передача формы на сервер ---

  // Передача формы на сервер
  function onFormSubmit(event) {
    event.preventDefault();
    window.backend.save(new FormData(uploadForm), function (responseText) {
      uploadClose();
    }, window.tools.displayErrorMessage);
  }

  // ^^^ Передача формы на сервер ^^^
  // ^^^^^^^^^ Обработчики событий ^^^^^^^^^

  // Выполнение скрипта
  uploadFileInput.addEventListener('change', onPhotoUpload);
})();
