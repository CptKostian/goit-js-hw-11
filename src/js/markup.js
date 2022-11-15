const imgCollection = document.querySelector('.gallery');

export async function createMarkup(collection, isTheFirstSearch) {
  const pictures = await collection;

  const markup = pictures
    .map(
      picture => `<a href='${picture.largeImageURL}' class='gallery__item'>
      <img class='gallery_photo' src="${picture.webformatURL}" alt="${picture.tags}">
      <div class='gallery__info'>
      <div class='gallery__category'>Likes<p>${picture.likes}</p></div>
      <div class='gallery__category'>Views<p>${picture.views}</p></div>
      <div class='gallery__category'>Comments<p>${picture.comments}</p></div>
      <div class='gallery__category'>Downloads<p>${picture.downloads}</p></div>
      </div>
      </a>`
    )
    .join('');

  if (isTheFirstSearch) {
    imgCollection.innerHTML = markup;
    return;
  }

  imgCollection.insertAdjacentHTML('beforeend', markup);
}
