'use strict';

window.initializeUpload = (function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var uploadForm = document.querySelector('#upload-select-image');
  var uploadFileInput = uploadForm.querySelector('#upload-file');
  var uploadedImage = uploadForm.querySelector('.effect-image-preview');

  // Назначение загруженного изображения в качестве превью
  function setNewImage() {
    var file = uploadFileInput.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        uploadedImage.src = reader.result;
      });

      reader.readAsDataURL(file);
      return true;
    } else {
      window.tools.displayErrorMessage('Неподходящий формат файла');
      return false;
    }

  }

  return {
    setNewImage: setNewImage
  };
})();
