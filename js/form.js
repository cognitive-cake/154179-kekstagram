'use strict';

(function () {
  var HASH_TAGS_VALIDATION = {
    firstChar: '#',
    regExpFirstChar: /#/g,
    separator: ' ',
    maxAmount: 5,
    maxOneTagLength: 20,
    errorMessage: 'Хэш-тег начинается с символа \`#\` (решётка) и состоит из одного слова. \nХэш-теги разделяются пробелами. \nОдин и тот же хэш-тег не может быть использован дважды. \nНельзя указать больше пяти хэш-тегов. \nМаксимальная длина одного хэш-тега 20 символов.'
  };
  var COMMENT_VALIDATION = {
    minLength: 30,
    minLengthMessage: 'Минимальная длина - 30 символов'
  };
  var EFFECTS_PARAMETERS = {
    defaultClass: 'effect-none',
    defaultValue: 100,
    defaultScale: 100,
    lineUnit: '%',
    pinPositionPrecision: 1,
    previewPrecision: 2,
    classIndex: 1,

    chrome: {
      class: 'effect-chrome',
      property: 'grayscale',
      maxValue: 1,
      units: ''
    },
    sepia: {
      class: 'effect-sepia',
      property: 'sepia',
      maxValue: 1,
      units: ''
    },
    marvin: {
      class: 'effect-marvin',
      property: 'invert',
      maxValue: 100,
      units: '%'
    },
    phobos: {
      class: 'effect-phobos',
      property: 'blur',
      maxValue: 3,
      units: 'px'
    },
    heat: {
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
    removeEffectAndScaleFromPhoto();
    uploadOverlay.classList.add('hidden');
    uploadOverlayClose.removeEventListener('click', onCloseCrossClick);
    document.removeEventListener('keydown', onUploadOverlayEscPress);
    uploadComment.removeEventListener('focus', onCommentFocusing);
    uploadComment.removeEventListener('input', onCommentInput);
    submitButton.removeEventListener('click', onSubmitClick);
    uploadForm.removeEventListener('submit', onFormSubmit);
    uploadForm.reset();

    photoContainer.addEventListener('click', window.gallery.onPictureClick);
  }

  // Загрузка фотографии
  function onPhotoUpload() {
    if (window.initializeUpload.setNewImage()) {
      uploadOpen();
    }
  }

  // Клик на кнопке закрытия формы кадрирования
  function onCloseCrossClick() {
    uploadClose();
  }

  // Нажатие на ESC при показанной форме кадрирования
  function onUploadOverlayEscPress(event) {
    var keyCode = event.keyCode;
    if (keyCode === window.tools.keyCodes.esc) {
      uploadClose();
    }
  }

  // Фокус на поле для комментария
  function onCommentFocusing() {
    document.removeEventListener('keydown', onUploadOverlayEscPress);
    uploadComment.addEventListener('blur', onCommentDefocusing);
  }

  // Фокус с поля для комментария снят
  function onCommentDefocusing() {
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

    if (imagePreview.classList.contains(EFFECTS_PARAMETERS.defaultClass)) {
      setDefaultFilter();
    } else {
      showEffectsSlider();
    }
  }

  // Удаление эффекта и масштаба
  function removeEffectAndScaleFromPhoto() {
    imagePreview.classList.remove(lastEffectClass);
    imagePreview.style.filter = '';
    setPinPosition(EFFECTS_PARAMETERS.defaultValue);
    hideEffectsSlider();
    adjustScale(EFFECTS_PARAMETERS.defaultScale);
    window.initializeScale.setInputValue(EFFECTS_PARAMETERS.defaultScale);
  }

  // Применение фильтра по-умолчанию
  function setDefaultFilter() {
    imagePreview.classList.remove(lastEffectClass);
    imagePreview.style.filter = '';
    setPinPosition(EFFECTS_PARAMETERS.defaultValue);
    hideEffectsSlider();
  }

  // Показ слайдера насыщенности для эффектов
  function showEffectsSlider() {
    setEffectAndMovePin(EFFECTS_PARAMETERS.defaultValue);
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
    switch (imagePreview.classList[EFFECTS_PARAMETERS.classIndex]) {
      case EFFECTS_PARAMETERS.chrome.class:
        currentEffect = EFFECTS_PARAMETERS.chrome;
        break;
      case EFFECTS_PARAMETERS.sepia.class:
        currentEffect = EFFECTS_PARAMETERS.sepia;
        break;
      case EFFECTS_PARAMETERS.marvin.class:
        currentEffect = EFFECTS_PARAMETERS.marvin;
        break;
      case EFFECTS_PARAMETERS.phobos.class:
        currentEffect = EFFECTS_PARAMETERS.phobos;
        break;
      case EFFECTS_PARAMETERS.heat.class:
        currentEffect = EFFECTS_PARAMETERS.heat;
        break;
      default:
        currentEffect = EFFECTS_PARAMETERS.defaultClass;
    }
    return currentEffect;
  }

  // Установка положения для слайдера
  function setPinPosition(value) {
    var pinPositionString = value.toFixed(EFFECTS_PARAMETERS.pinPositionPrecision) + EFFECTS_PARAMETERS.lineUnit;
    effectLevelPin.style.left = pinPositionString;
    effectLevelPin.setAttribute('title', pinPositionString);
    effectLevelBar.style.width = pinPositionString;
  }

  // Установка значения filter для текущего эффекта
  function setFilterValueForPreview(effect, value) {
    if (effect === EFFECTS_PARAMETERS.defaultClass) {
      imagePreview.style.filter = '';
      return;
    }
    var valueInDecimal = value / 100;
    imagePreview.style.filter = effect.property + '(' + (valueInDecimal * effect.maxValue).toFixed(EFFECTS_PARAMETERS.previewPrecision) + effect.units + ')';
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
  window.initializeScale.init(resizeControls, adjustScale);

  // ^^^ Изменение масштаба изображения ^^^
  // --- Валидация хэш-тегов ---

  // Клик на кнопке отправки формы
  function onSubmitClick() {
    window.tools.unsetInvalidClass(hashTagInput);
    hashTagInput.setCustomValidity('');
    checkHashTagsValidity();
  }

  // Валидация строки с хэш-тегами
  function checkHashTagsValidity() {
    var arrayOfValues = hashTagInput.value.split(HASH_TAGS_VALIDATION.separator);
    if (arrayOfValues[0] === '') {
      return;
    }
    arrayOfValues = arrayOfValues.filter(function (it) {
      return it !== '';
    });
    for (var i = 0; i < arrayOfValues.length; i++) {
      var singleTag = arrayOfValues[i];
      var hashSymbols = singleTag.match(HASH_TAGS_VALIDATION.regExpFirstChar);

      var isValid = singleTag.charAt(0) === HASH_TAGS_VALIDATION.firstChar && (hashSymbols && hashSymbols.length === 1) && singleTag.length <= HASH_TAGS_VALIDATION.maxOneTagLength;

      if (!isValid) {
        window.tools.setInvalidClass(hashTagInput);
      }
    }
    if (!window.tools.isUniqElementsInArray(arrayOfValues)) {
      window.tools.setInvalidClass(hashTagInput);
    }
    if (arrayOfValues.length > HASH_TAGS_VALIDATION.maxAmount) {
      window.tools.setInvalidClass(hashTagInput);
    }
    if (window.tools.checkInvalidClass(hashTagInput)) {
      hashTagInput.setCustomValidity(HASH_TAGS_VALIDATION.errorMessage);
    }
  }

  // ^^^ Валидация хэш-тегов ^^^
  // --- Валидация комментария ---

  function onCommentInput() {
    window.tools.unsetInvalidClass(uploadComment);
    uploadComment.setCustomValidity('');
    if (checkMinLength() || !uploadComment.checkValidity()) {
      window.tools.setInvalidClass(uploadComment);
    }
  }

  // Проверка на минимальную длину комментария (т.к. EDGE не поддерживает minlength)
  function checkMinLength() {
    var string = uploadComment.value;
    if (string.length < COMMENT_VALIDATION.minLength) {
      uploadComment.setCustomValidity(COMMENT_VALIDATION.minLengthMessage);
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
