'use strict';

window.data = (function () {
  var taskParameters = {
    photoCount: 25,
    likesMin: 15,
    likesMax: 200,
    commentsMin: 1,
    commentsMax: 2,
    tabindex: 0
  };

  var COMMENTS_TO_PHOTOS = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];

  var serverData;

  // Успешное получение данных от сервера
  function onSuccess(response) {
    serverData = response;
  }

  // Ошибка получения данных от сервера
  function onError(message) {
    var node = document.createElement('div');
    node.style.zIndex = 100;
    node.style.margin = '0 auto';
    node.style.textAlign = 'center';
    node.style.backgroundColor = '#f97f7f';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';

    node.textContent = message;
    document.body.insertAdjacentElement('afterbegin', node);
  }

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

  // Выполнение скрипта

  window.backend.load(onSuccess, onError);
  var photosDescription = createArrayOfPhotosDescriptions(taskParameters.photoCount);

  // Экспорт
  return {
    photosDescription: photosDescription,
    serverData: serverData
  };
})();
