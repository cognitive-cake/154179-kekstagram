'use strict';

window.preview = (function () {
  var galleryOverlay = document.querySelector('.gallery-overlay');

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
  // Определение правильного окончания для слова "n комментариев"
  function getTrueEndingOfWord(commentsAmount) {
    var lastNumber = commentsAmount.charAt(commentsAmount.length - 1);
    var commentWord;
    if (window.tools.isSecondTen(commentsAmount)) {
      commentWord = ' комментариев';
    } else {
      if (+lastNumber === 1) {
        commentWord = ' комментарий';
      } else if (lastNumber > 1 && lastNumber < 5) {
        commentWord = ' комментария';
      } else {
        commentWord = ' комментариев';
      }
    }
    return commentWord;
  }

  // Экспорт
  return {
    setPhotoToOverlay: setPhotoToOverlay
  };
})();
