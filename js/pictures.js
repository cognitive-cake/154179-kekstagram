'use strict';

(function () {
  var taskParameters = {
    photoCount: 25,
    likesMin: 15,
    likesMax: 200,
    commentsMin: 1,
    commentsMax: 2,
    photoForOverlayIndex: 0
  };

  var template = document.querySelector('#picture-template');
  var photoContainer = document.querySelector('.pictures');
  var uploadOverlay = document.querySelector('.upload-overlay');
  var galleryOverlay = document.querySelector('.gallery-overlay');

  var COMMENTS_TO_PHOTOS = [ // Неуверен, что стоит объявлять этот массив как константу. Пока что не понятно, когда объявлять константы, а когда переменные. Это ведь только для моего удобства?
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];

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
    cloneNode.querySelector('img').setAttribute('src', photoData.url);
    cloneNode.querySelector('.picture-likes').textContent = photoData.likes;
    cloneNode.querySelector('.picture-comments').textContent = photoData.comments;
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
    // Вставка фотографии с данными в оверлей
  function setPhotoToOverlay(obj) {
    var photoData = obj;
    galleryOverlay.querySelector('.gallery-overlay-image').setAttribute('src', photoData.url);
    galleryOverlay.querySelector('.likes-count').textContent = photoData.likes;
    galleryOverlay.querySelector('.comments-count').textContent = photoData.comments.length;
  }

  var photosDescription = createArrayOfPhotosDescriptions(taskParameters.photoCount);
  var listOfPhotos = createListOfPhotos(photosDescription);
  photoContainer.appendChild(listOfPhotos);
  uploadOverlay.classList.add('hidden');
  galleryOverlay.classList.remove('hidden');
  setPhotoToOverlay(photosDescription[taskParameters.photoForOverlayIndex]);
})();
