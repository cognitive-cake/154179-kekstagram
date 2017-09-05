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
  var resizeValue = resizeControls.querySelector('.upload-resize-controls-value');

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
    effectFieldset.addEventListener('click', onEffectFieldsetClick);
    resizeControls.addEventListener('click', onResizeControlsClick);
    submitButton.addEventListener('click', onSubmitClick);

    photoContainer.removeEventListener('click', window.gallery.onPictureClick);
  }
  // Закрытие формы кадрирования
  function uploadClose() {
    uploadOverlay.classList.add('hidden');
    uploadOverlayClose.removeEventListener('event', onCloseCrossClick);
    document.removeEventListener('keydown', onUploadOverlayEscPress);
    uploadComment.removeEventListener('focus', onCommentFocusing);
    uploadComment.removeEventListener('input', onCommentInput);
    effectFieldset.removeEventListener('click', onEffectFieldsetClick);
    resizeControls.removeEventListener('click', onResizeControlsClick);
    submitButton.removeEventListener('click', onSubmitClick);

    photoContainer.addEventListener('click', window.gallery.onPictureClick);
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

    showEffectsSlider();
    if (imagePreview.classList.contains(effectsParameters.defaultEffectClass)) {
      hideEffectsSlider();
    }
  }
  // Показ слайдера насыщенности для эффектов
  function showEffectsSlider() {
    setEffect(effectsParameters.defaultEffectValue);
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
  // ^^^ Применение эффекта к изображению ^^^
  // --- Изменение масштаба изображения ---
  // Клик в области кнопок масштабирования
  function onResizeControlsClick(event) {
    var clickTarget = event.target;
    if (isResizeButton(clickTarget)) {
      var currentValue = getCurrentScaleValue();
      if (isIncButton(clickTarget)) {
        increaseScale(currentValue);
        return;
      } else if (isDecButton(clickTarget)) {
        decreaseScale(currentValue);
        return;
      }
    }
  }
  // Нахождение кнопки
  function isResizeButton(clickTarget) {
    return clickTarget.classList.contains('upload-resize-controls-button');
  }
  // Нахождение текущего значения масштаба
  function getCurrentScaleValue() {
    return parseInt(resizeValue.getAttribute('value'), taskParameters.radixForScaleValue);
  }
  // Если клик на кнопке "+"
  function isIncButton(clickTarget) {
    return clickTarget.classList.contains('upload-resize-controls-button-inc');
  }
  // Если клик на кнопке "-"
  function isDecButton(clickTarget) {
    return clickTarget.classList.contains('upload-resize-controls-button-dec');
  }
  // Увеличение масштаба
  function increaseScale(currentValue) {
    if (currentValue === taskParameters.maxScale) {
      return;
    }
    var newValue = currentValue + taskParameters.scaleStep;
    resizeValue.setAttribute('value', newValue + taskParameters.scaleUnits);
    imagePreview.style.transform = 'scale(' + newValue / 100 + ')';
  }
  // Уменьшение масштаба
  function decreaseScale(currentValue) {
    if (currentValue === taskParameters.minScale) {
      return;
    }
    var newValue = currentValue - taskParameters.scaleStep;
    resizeValue.setAttribute('value', newValue + taskParameters.scaleUnits);
    imagePreview.style.transform = 'scale(' + newValue / 100 + ')';
  }
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
  // ^^^^^^^^^ Обработчики событий ^^^^^^^^^

  // Выполнение скрипта
  uploadFileInput.addEventListener('change', onPhotoUpload);
})();
