'use strict';


(function () {
  var taskParameters = {
    photoCount: 25,
    likesMin: 15,
    likesMax: 200,
    commentsMin: 1,
    commentsMax: 2,
    tabindex: 0
  };

  var template = document.querySelector('#picture-template');
  var photoContainer = document.querySelector('.pictures');
  var uploadOverlay = document.querySelector('.upload-overlay');
  var galleryOverlay = document.querySelector('.gallery-overlay');
  var galleryOverlayClose = galleryOverlay.querySelector('.gallery-overlay-close');

  var COMMENTS_TO_PHOTOS = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];
  var KEY_CODES = {
    esc: 27,
    enter: 13
  };

  // Создание описаний к фотографиям и добавление их в массив
  function createArrayOfPhotosDescriptions(amount) {
    var array = [];
    for (var i = 1; i <= amount; i++) {
      array.push(createSinglePhotoDescription(i));
    }
    return array;
  }
  // Генерация единичного описания фотографии
  function createSinglePhotoDescription(index) {
    var likesAmount = window.tools.getRandomRoundNumber(taskParameters.likesMin, taskParameters.likesMax);
    var newDescription = {
      url: 'photos/' + index + '.jpg',
      likes: likesAmount,
      comments: createCommentForPhoto()
    };
    return newDescription;
  }
  // Создание массива с комментариями к фото
  function createCommentForPhoto() {
    var comments = [];
    var amountOfComments = window.tools.getRandomRoundNumber(taskParameters.commentsMin, taskParameters.commentsMax);

    for (var i = 0; i < amountOfComments; i++) {
      comments.push(window.tools.getRandomValueOfArray(COMMENTS_TO_PHOTOS));
    }
    return comments;
  }
  // Создание единичного элемента с фотографией
  function createSinglePhotoElement(photoData) {
    var cloneNode = template.content.cloneNode('true');
    // cloneNode.querySelector('.picture').setAttribute('tabindex', taskParameters.tabindex);
    cloneNode.querySelector('img').setAttribute('src', photoData.url);
    cloneNode.querySelector('.picture-likes').textContent = photoData.likes;
    cloneNode.querySelector('.picture-comments').textContent = photoData.comments.length;
    return cloneNode;
  }
  // Создание списка с фотографиями
  function createListOfPhotos(array) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < array.length; i++) {
      var object = array[i];
      var photo = createSinglePhotoElement(object);
      fragment.appendChild(photo);
    }
    return fragment;
  }
  // Определение правильного окончания для слова "n комментариев"
  function getTrueEndingOfWord(commentsAmount) {
    var lastNumber = commentsAmount.charAt(commentsAmount.length - 1);
    var commentWord;
    switch (true) {
      case +lastNumber === 1:
        commentWord = ' комментарий';
        break;
      case lastNumber > 1 && lastNumber < 5:
        commentWord = ' комментария';
        break;
      default:
        commentWord = ' комментариев';
    }
    return commentWord;
  }
  // Вставка фотографии с данными в оверлей
  function setPhotoToOverlay(element) {
    var elementImgSource = element.querySelector('img').getAttribute('src');
    var elementLikesAmount = element.querySelector('.picture-likes').textContent;
    var elementCommentsAmount = element.querySelector('.picture-comments').textContent;
    var commentWord = getTrueEndingOfWord(elementCommentsAmount);

    galleryOverlay.querySelector('.gallery-overlay-image').setAttribute('src', elementImgSource);
    galleryOverlay.querySelector('.likes-count').textContent = elementLikesAmount;
    galleryOverlay.querySelector('.comments-count').textContent = elementCommentsAmount;
    galleryOverlay.querySelector('.comments-word').textContent = commentWord;
  }

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
        setPhotoToOverlay(clickTarget);
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

  var photosDescription = createArrayOfPhotosDescriptions(taskParameters.photoCount);
  var listOfPhotos = createListOfPhotos(photosDescription);

  photoContainer.appendChild(listOfPhotos);
  uploadOverlay.classList.add('hidden');

  photoContainer.addEventListener('click', onPictureClick);
})();
