'use strict';

window.picture = (function () {
  var template = document.querySelector('#picture-template');

  // Создание единичного элемента с фотографией
  function createSinglePhotoElement(photoData) {
    var cloneNode = template.content.cloneNode('true');
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

  // Экспорт
  return {
    createListOfPhotos: createListOfPhotos,
  };
})();
