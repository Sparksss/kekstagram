'use strict';

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

var getRandomNumberComments = function () {
  var temporaryComments = [];
  var commentsNumber = getRandomNumber(0, 50);
  for (var i = 0; i < commentsNumber; i++) {
    temporaryComments[i] = COMMENTS[getRandomNumber(0, 5)];
  }
  return temporaryComments;
};
var getUserPhotos = function (number) {
  return {
    url: 'photos/' + number + '.jpg',
    likes: getRandomNumber(15, 200),
    comments: getRandomNumberComments()
  };
};

var getArrayPictures = function () {
  var photoGallery = [];
  for (var i = 0; i <= 25; i++) {
    photoGallery[i] = getUserPhotos(i + 1);
  }
  return photoGallery;
};

var photoGallery = getArrayPictures();

var getRenderPhotos = function () {
  var photoLength = photoGallery.length;
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < photoLength; i++) {
    fragment.appendChild(getRenderPictures(photoGallery[i]));
  }
  return fragment;
};


var getRenderPictures = function (photo) {
  var photoElement = pictureTemplate.cloneNode(true);
  photoElement.querySelector('img').src = photo.url;
  photoElement.querySelector('.picture-comments').textContent = photo.comments.length;
  photoElement.querySelector('.picture-likes').textContent = photo.likes;
  return photoElement;
};

var showPhoto = function (picture) {
  galleryOverlay.querySelector('.gallery-overlay-image').src = picture.url;
  galleryOverlay.querySelector('.likes-count').textContent = picture.likes;
  galleryOverlay.querySelector('.comments-count').textContent = picture.comments.length;
};

croppingForm.classList.add(CLASS_HIDDEN);
similarPictureElement.appendChild(getRenderPhotos());

var pictureElements = similarPictureElement.querySelectorAll('.picture');

var closeGallery = galleryOverlay.querySelector('.gallery-overlay-close');

var checkCloseGallery = 'gallery-overlay-close';

var lengthPictureCollection = pictureElements.length;

var onClickOpenGallery = function (indexPicture) {
  showPhoto(photoGallery[indexPicture]);
  galleryOverlay.classList.remove(CLASS_HIDDEN);

};

var closePopup = function () {
  galleryOverlay.classList.add(CLASS_HIDDEN);
};

var addClickHandler = function (i) {
  pictureElements[i].addEventListener('click', function (evt) {
    evt.preventDefault();
    onClickOpenGallery(i);
  });
};

for (var i = 0; i < lengthPictureCollection; i++) {
  addClickHandler(i);
}

document.addEventListener('keydown', function (evt) {
  if (evt.target.classList.contains(checkCloseGallery) && evt.keyCode === ENTER_KEYCODE) {
    closePopup();
  }
});

document.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ESCAPE_KEYCODE) {
    closePopup();
  }
});
closeGallery.addEventListener('click', function () {
  closePopup();
});

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

var closeFramingHandler = function () {
  downloadForm.classList.remove(CLASS_HIDDEN);
  uploadOverlay.classList.add(CLASS_HIDDEN);
};


var onInputOpenFramingForm = function () {
  uploadOverlay.classList.remove(CLASS_HIDDEN);
  downloadForm.classList.add(CLASS_HIDDEN);
};

var changeImageSize = function (direction) {
  var newValue = parseInt(controlSizeImage.value, 10) + 25 * direction;
  if (newValue >= MIN_VALUE && newValue <= MAX_VALUE) {
    controlSizeImage.value = newValue + '%';
    sizeImage.style.transform = 'scale(' + newValue / 100 + ')';
  }
 };

var checkForTheSameWord = function (firstWord, secondWord, checkTag) {
  if (firstWord === secondWord) {
    checkTag.setCustomValidity('Теги не должны повторяться!');
  }
};

var checkHashTagsHandler = function (hashTag) {
  var maxLengthTag = 21;
  var maxHashTags = 5;
  var listHashTag = hashTag.value.match(/\#[a-zA-Zа-яА-Я0-9\-]+/g);
  if (listHashTag === null) {
    hashTag.setCustomValidity('Первый символ должен быть решеткой');
  } else {
    var lengthListHashTags = listHashTag.length;
    for (var l = 1; l < lengthListHashTags; l++) {
      if (listHashTag[l].length < maxLengthTag) {
        hashTag.setCustomValidity('Длина 1 тега не должна превышать 20 символов!');
        break;
      } else if (listHashTag.length <= maxHashTags) {
        hashTag.setCustomValidity('Нелья добавить больше 5 хеш-тегов');
        break;
      }
      checkForTheSameWord(listHashTag[l], listHashTag[l + 1], hashTag);
    }
    hashTag.setCustomValidity('');
  }
};

var changeImageEffectHandler = function (effect) {
  sizeImage.setAttribute('class', 'effect-image-preview ' + 'effect-' + effect.value);
};

uploadFile.addEventListener('change', function () {
  onInputOpenFramingForm();
});

cancelFraming.addEventListener('click', function () {
  closeFramingHandler();
});

document.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ESCAPE_KEYCODE) {
    closeFramingHandler();
  }
});

document.addEventListener('keydown', function (evt) {
  if (evt.target.classList.contains(cancelFraming.className) && evt.keyCode === ENTER_KEYCODE) {
    closeFramingHandler();
  }
});

reduceImageSize.addEventListener('click', function () {
  changeImageSize(-1);
});

increaseImageSize.addEventListener('click', function () {
  changeImageSize(1);
});

parentEffectElement.addEventListener('click', function (evt) {
  var target = evt.target;
  if (target.tagName.toLowerCase() === 'input') {
    changeImageEffectHandler(target);
  }
});

hashTags.addEventListener('input', function (evt) {
  var target = evt.target;
  if (target.value.length > 0) {
    checkHashTagsHandler(target);
  }
});
