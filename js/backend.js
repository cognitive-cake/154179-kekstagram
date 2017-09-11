'use strict';

window.backend = (function () {

  // Получение данных от сервера
  function load(onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = 10000;

    xhr.addEventListener('load', function (event) {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function (eventError) {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function (eventTimeout) {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });


    xhr.open('GET', 'https://1510.dump.academy/kekstagram/data');
    xhr.send();
  }

  // Отправка данных на сервер
  function save(data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = 10000;

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function (eventError) {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function (eventTimeout) {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.open('POST', 'https://1510.dump.academy/kekstagram');
    xhr.send(data);
  }

  return {
    load: load,
    save: save
  };
})();
