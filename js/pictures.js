'use strict';

(function () {
  var taskParameters = {
    photoCount: 25,
    likesMin: 15,
    likesMax: 200,
    commentsMin: 1,
    commentsMax: 2
  };
  var photosDescription = [
    // Пример объекта для данного массива
    // {
    //   url: '',
    //   likes: '',
    //   comments: []
    // }
  ];
  var COMMENTS_TO_PHOTOS = [ // Неуверен, что стоит объявлять этот массив как константу. Пока что не понятно, когда объявлять константы, а когда переменные. Это ведь только для моего удобства?
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];

  window.pictures = (function () {
    var template = document.querySelector('#picture-template');
    var pictures = document.querySelector('.pictures');
    var overlay = document.querySelector('.upload-overlay');
    var galleryOverlay = document.querySelector('.gallery-overlay');

    // Создание описаний к фотографиям и добавление их в массив
    function createArrayOfPhotosDescriptions(array, amount) {
      for (var i = 1; i <= amount; i++) {
        createSinglePhotoDescription(array, i);
      }
    }
    // Генерация единичного описания фотографии
    function createSinglePhotoDescription(array, index) {
      var newDescription = {
        url: 'photos/' + index + '.jpg',
        likes: Math.round(window.tools.getRandomNumber(taskParameters.likesMin, taskParameters.likesMax)),
        comments: createCommentForPhoto()
      };
      array.push(newDescription);
    }
    // Создание массива с комментариями к фото
    function createCommentForPhoto() {
      var comments = [];
      var amountOfComments = Math.round(window.tools.getRandomNumber(taskParameters.commentsMin, taskParameters.commentsMax));

      for (var i = 0; i < amountOfComments; i++) {
        comments.push(window.tools.getRandomValueOfArray(COMMENTS_TO_PHOTOS));
      }
      return comments;
    }
    // Создание единичного элемента с фотографией
    function createSinglePhotoElement(obj) {
      var cloneNode = template.content.cloneNode('true');
      var photoData = obj;
      cloneNode.querySelector('img').setAttribute('src', photoData.url);
      cloneNode.querySelector('.picture-likes').textContent = photoData.likes;
      cloneNode.querySelector('.picture-comments').textContent = photoData.comments;
      return cloneNode;
    }
    // Создание списка с фотографиями
    function createListOfPhotos(array) {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < array.length; i++) {
        fragment.appendChild(createSinglePhotoElement(array[i]));
      }
      return fragment;
    }

    createArrayOfPhotosDescriptions(photosDescription, taskParameters.photoCount);
    pictures.appendChild(createListOfPhotos(photosDescription));
    overlay.classList.add('hidden');
  })();
})();
