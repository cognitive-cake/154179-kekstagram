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
  var photosDescription = createArrayOfPhotosDescriptions(taskParameters.photoCount);

  // Экспорт
  return {
    photosDescription: photosDescription
  };
})();
