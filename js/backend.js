'use strict';

window.backend = (function () {

  function load(onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = 10000;

    xhr.addEventListener('load', function (event) {
      if (xhr.status === 200) {
        onLoad(xhr.responseText);
      } else {
        onError('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
      }

      xhr.addEventListener('error', function (eventError) {
        onError('Произошла ошибка соединения');
      });

      xhr.addEventListener('timeout', function (eventTimeout) {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.timeout = 10000;
    });


    xhr.open('GET', 'https://1510.dump.academy/kekstagram/data');
    xhr.send();
  }

  function save(data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = 10000;

    xhr.addEventListener('event', function (event) {
      // body...
    });

    xhr.open('POST', 'https://1510.dump.academy/kekstagram');
    xhr.send(data);
  }

  function onLoad(responseText) {

  }

  function onError(errorMessage) {

  }

  return {
    load: load,
    save: save
  };
})();
