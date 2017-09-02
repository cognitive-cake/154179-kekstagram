'use strict';

window.preview = (function () {
  var galleryOverlay = document.querySelector('.gallery-overlay');

  // Вставка фотографии с данными в оверлей
  function setPhotoToOverlay(element) {
    var elementImgSource = element.querySelector('img').getAttribute('src');
    var elementLikesAmount = element.querySelector('.picture-likes').textContent;
    var elementCommentsAmount = element.querySelector('.picture-comments').textContent;
    var commentWord = window.picture.getTrueEndingOfWord(elementCommentsAmount);

    galleryOverlay.querySelector('.gallery-overlay-image').setAttribute('src', elementImgSource);
    galleryOverlay.querySelector('.likes-count').textContent = elementLikesAmount;
    galleryOverlay.querySelector('.comments-count').textContent = elementCommentsAmount;
    galleryOverlay.querySelector('.comments-word').textContent = commentWord;
  }

  // Экспорт
  return {
    setPhotoToOverlay: setPhotoToOverlay
  };
})();
