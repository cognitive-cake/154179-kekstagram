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

    createArrayOfPhotosDescriptions(photosDescription, taskParameters.photoCount);
  })();
})();
