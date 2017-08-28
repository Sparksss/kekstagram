'use strict';


// создаем данные

var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var CLASS_HIDDEN = 'hidden';

var ESCAPE_KEYCODE = 27;

var ENTER_KEYCODE = 13;

var similarPictureElement = document.querySelector('.pictures');

var pictureTemplate = document.querySelector('#picture-template').content;

var croppingForm = document.querySelector('.upload-overlay');

var galleryOverlay = document.querySelector('.gallery-overlay');

var getRandomNumber = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};
// заполняем сгенерированными данными массив с комментариями
var getRandomNumberComments = function () {
  var temporaryComments = [];
  var commentsNumber = getRandomNumber(0, 50);
  for (var i = 0; i < commentsNumber; i++) {
    temporaryComments[i] = COMMENTS[getRandomNumber(0, 5)];
  }
  return temporaryComments;
};

// создаём объекты и заполняем их данными

var getUserPhotos = function (number) {
  return {
    url: 'photos/' + number + '.jpg',
    likes: getRandomNumber(15, 200),
    comments: getRandomNumberComments()
  };
};

// заполняем массив объектами

var getArrayPictures = function () {
  var photoGallery = [];
  for (var i = 0; i <= 25; i++) {
    photoGallery[i] = getUserPhotos(i + 1);
  }
  return photoGallery;
};

var photoGallery = getArrayPictures();

// добавляем объекты из массива в фрагмент

var getRenderPhotos = function () {
  var photoLength = photoGallery.length;
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < photoLength; i++) {
    fragment.appendChild(getRenderPictures(photoGallery[i]));
  }
  return fragment;
};

// клонируем шаблон, и заполняем его данными

var getRenderPictures = function (photo) {
  var photoElement = pictureTemplate.cloneNode(true);
  photoElement.querySelector('img').src = photo.url;
  photoElement.querySelector('.picture-comments').textContent = photo.comments.length;
  photoElement.querySelector('.picture-likes').textContent = photo.likes;
  return photoElement;
};

// заполняем данными из объекта html элемент

var showPhoto = function (picture) {
  galleryOverlay.querySelector('.gallery-overlay-image').src = picture.url;
  galleryOverlay.querySelector('.likes-count').textContent = picture.likes;
  galleryOverlay.querySelector('.comments-count').textContent = picture.comments.length;
};

croppingForm.classList.add(CLASS_HIDDEN);
similarPictureElement.appendChild(getRenderPhotos());

// получаем html элементы для фотогалереи

var pictureElements = similarPictureElement.querySelectorAll('.picture');

var closeGallery = galleryOverlay.querySelector('.gallery-overlay-close');

var checkCloseGallery = 'gallery-overlay-close';

var lengthPictureCollection = pictureElements.length;

// наполняем галерею картинкой и данными, а так же удаляем класс который скрывает галерею

var onClickOpenGallery = function (indexPicture) {
  showPhoto(photoGallery[indexPicture]);
  galleryOverlay.classList.remove(CLASS_HIDDEN);

};

// функция для закрытия галереи

var closePopup = function () {
  galleryOverlay.classList.add(CLASS_HIDDEN);
};

// обработчик для открытия галереи

var addClickHandler = function (i) {
  pictureElements[i].addEventListener('click', function (evt) {
    evt.preventDefault();
    onClickOpenGallery(i);
  });
};

// применяем обработчик к каждому фото на странице

for (var i = 0; i < lengthPictureCollection; i++) {
  addClickHandler(i);
}

// обработчик закрытия галереи по клавише Enter

document.addEventListener('keydown', function (evt) {
  if (evt.target.classList.contains(checkCloseGallery) && evt.keyCode === ENTER_KEYCODE) {
    closePopup();
  }
});

// обработчик закрытия галереи по клавише ESC

document.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ESCAPE_KEYCODE) {
    closePopup();
  }
});

// обработчик закрытия галереи по клику

closeGallery.addEventListener('click', function () {
  closePopup();
});


// получам html элементы для работы с формой кадрирования

var uploadImage = document.querySelector('#upload-select-image');

var uploadFile = uploadImage.querySelector('.upload-image');

var uploadOverlay = uploadImage.querySelector('.upload-overlay');

var downloadForm = uploadImage.querySelector('.upload-image');

var cancelFraming = uploadOverlay.querySelector('.upload-form-cancel');

var reduceImageSize = uploadOverlay.querySelector('.upload-resize-controls-button-dec');

var increaseImageSize = uploadOverlay.querySelector('.upload-resize-controls-button-inc ');

var controlSizeImage = uploadOverlay.querySelector('.upload-resize-controls-value');

var sizeImage = uploadOverlay.querySelector('.effect-image-preview');

var parentEffectElement = uploadOverlay.querySelector('.upload-effect-controls');

var hashTags = uploadOverlay.querySelector('.upload-form-hashtags');

var MIN_VALUE = 25;

var MAX_VALUE = 100;

// функция закрытия формы кадрирования

var closeFramingHandler = function () {
  downloadForm.classList.remove(CLASS_HIDDEN);
  uploadOverlay.classList.add(CLASS_HIDDEN);
};

// функция открытия формы кадрирования

var onInputOpenFramingForm = function () {
  uploadOverlay.classList.remove(CLASS_HIDDEN);
  downloadForm.classList.add(CLASS_HIDDEN);
};

// функция изменения масштаба изображения

var changeImageSize = function (direction) {
  var newValue = parseInt(controlSizeImage.value, 10) + 25 * direction;
  if (newValue >= MIN_VALUE && newValue <= MAX_VALUE) {
    controlSizeImage.value = newValue + '%';
    sizeImage.style.transform = 'scale(' + newValue / 100 + ')';
  }
};

// функция проверки хеш-тегов на идентичность

var checkForTheSameWord = function (listTags, index) {
  var lengthListTags = listTags.length;
  for (var j = 1; j < lengthListTags; j++) {
    if (listTags[j] === listTags[index] && j !== index) {
      hashTags.setCustomValidity('Теги не должны повторяться!');
      break;
    }
  }
};

/* функция проверки хеш-тегов
* проверка поля хеш-тега на пустоту
*  Проверка 1 символа хеш-тега (обязательно #)
*  Проверка хеш-тегов на количество, не больше 5
*  проверка каждого хеш-тега чтобы длинна не превышала 20 символов
*/

var checkHashTagsHandler = function () {
  var maxHashTags = 5;
  var maxLengthTag = 21;
  var tagsFieldValue = hashTags.value;
  var listHashTag = tagsFieldValue.match(/\#[a-zA-Zа-яА-Я0-9\-]+/g);

  hashTags.setCustomValidity('');

  if (tagsFieldValue.length === 0) {
    return;
  }

  if (listHashTag === null) {
    hashTags.setCustomValidity('Первый символ должен быть решеткой');
  } else {
    var lengthListHashTags = listHashTag.length;
    if (lengthListHashTags > maxHashTags) {
      hashTags.setCustomValidity('Нелья добавить больше 5 хеш-тегов');
    }

    for (var l = 0; l < lengthListHashTags; l++) {
      if (listHashTag[l].length > maxLengthTag) {
        hashTags.setCustomValidity('Длина 1 тега не должна превышать 20 символов!');
        break;
      }
      if (lengthListHashTags > 1) {
        checkForTheSameWord(listHashTag, l);
      }
    }
  }
};


 // переменная для записи классов

var currentEffect = null;


// функция для изменения эффета у изображения

var changeImageEffectHandler = function (effect) {
  sizeImage.classList.remove(currentEffect);
  currentEffect = 'effect-' + effect.value;
  sizeImage.classList.add(currentEffect);
};

// обработчик событий для открытия формы кадрирования

uploadFile.addEventListener('change', function () {
  onInputOpenFramingForm();
});

// обрабоитчик события для закрытия формы кадрирования

cancelFraming.addEventListener('click', function () {
  closeFramingHandler();
});

// обработчик события для закрытия формы кадрирования на клавишу ESC

document.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ESCAPE_KEYCODE) {
    closeFramingHandler();
  }
});

// обработчик собыитя для закрытия формы кадрирования на клавишу ENTER если крестик в фокусе

document.addEventListener('keydown', function (evt) {
  if (evt.target.classList.contains(cancelFraming.className) && evt.keyCode === ENTER_KEYCODE) {
    closeFramingHandler();
  }
});

// обработчик события для уменьшения размера фотографии

reduceImageSize.addEventListener('click', function () {
  changeImageSize(-1);
});

// обработчик события для увеличения размера фотографии

increaseImageSize.addEventListener('click', function () {
  changeImageSize(1);
});


 // обработчик события для изменения эффектов изображению по клику

parentEffectElement.addEventListener('click', function (evt) {
  var target = evt.target;
  if (target.tagName.toLowerCase() === 'input') {
    changeImageEffectHandler(target);
  }
});

// обработчик события  для  запуска проверки хеш-тегов если изменяетя значение в input

hashTags.addEventListener('input', function () {
  checkHashTagsHandler();
});
