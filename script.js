// Валидация формы
const validation = new JustValidate('#film-form');
validation
  .addField('#title', [
    {
      rule: 'required',
      errorMessage: 'Введите название фильма!',
    },
  ])
  .addField('#genre', [
    {
      rule: 'required',
      errorMessage: 'Введите жанр!',
    },
  ])
  .addField('#releaseYear', [
    {
      rule: 'required',
      errorMessage: 'Введите год!',
    },
    {
      rule: 'number',
      errorMessage: 'Год должен быть числом!',
    },
  ])


const title = document.getElementById("title");
const genre = document.getElementById("genre");
const releaseYear = document.getElementById("releaseYear");
const isWatched = document.getElementById("isWatched");

function handleFormSubmit(e) {
  e.preventDefault();
  const film = {
    title: title.value,
    genre: genre.value,
    releaseYear: releaseYear.value,
    isWatched: isWatched.checked,
  };

  addFilm(film);
  e.target.reset();
}

async function getAllFilms() {
  const response = await fetch("https://sb-film.skillbox.cc/films", {
    method: "GET",
    headers: {
      email: "ng19990107@gmail.com",
    },
  });
  const films = await response.json();
  allFilter();
}

async function addFilm(film) {
  await fetch("https://sb-film.skillbox.cc/films", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      email: "ng19990107@gmail.com",
    },
    body: JSON.stringify(film),
  });
  allFilter();
}

async function removeFilm(id) {
  const response = await fetch(`https://sb-film.skillbox.cc/films/${id}`, {
    method: "DELETE",
    headers: {
      email: "ng19990107@gmail.com",
    },
  });
  const data = await response.json();
  allFilter();
}

async function removeAllFilms() {
  const response = await fetch("https://sb-film.skillbox.cc/films", {
    method: "DELETE",
    headers: {
      email: "ng19990107@gmail.com",
    },
  });
  const data = await response.json();
  allFilter();
}

document.querySelector("#removeAll").addEventListener("click", removeAllFilms);

let filterIsWatched = ''

async function renderTable(filterTitle, filterGenre, filterReleaseYear, filterIsWatched) {

  const filmsResponse = await fetch("https://sb-film.skillbox.cc/films", {
    headers: {
      email: "ng19990107@gmail.com",
    },
  });
  const films = await filmsResponse.json();
  const filteredFilms = films.filter((film) => {
    const matchedTitle = film.title.toLowerCase().includes(filterTitle);
    const matchedGenre = film.genre.toLowerCase().includes(filterGenre);
    const matchedReleaseYear = String(film.releaseYear).includes(filterReleaseYear);
    const matchedIsWatched = filterIsWatched === "" || film.isWatched === filterIsWatched;
    return matchedTitle && matchedGenre && matchedReleaseYear && matchedIsWatched
  });
  const filmTableBody = document.getElementById("film-tbody");
  filmTableBody.innerHTML = "";
  filteredFilms.forEach((film) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${film.title}</td>
      <td>${film.genre}</td>
      <td>${film.releaseYear}</td>
      <td>${film.isWatched ? "Да" : "Нет"}</td>
      <td><button id="remove" data-id="${film.id}">Удалить</button></td>
    `;

    const removeBtn = row.querySelector("#remove");
    removeBtn.addEventListener("click", () => {
      removeFilm(removeBtn.dataset.id);
    });
    filmTableBody.appendChild(row);
  });
}

const allFilter = () => renderTable(filterTitle.value.toLowerCase(), filterGenre.value.toLowerCase(), filterReleaseYear.value, filterIsWatched);

const filterTitle = document.querySelector("#filterTitle"),
  filterGenre = document.querySelector("#filterGenre"),
  filterReleaseYear = document.querySelector("#filterReleaseYear"),
  selectFilter = document.querySelector("#selectFilter");

filterTitle.addEventListener("input", allFilter);
filterGenre.addEventListener("input", allFilter);
filterReleaseYear.addEventListener("input", allFilter);
selectFilter.addEventListener("change", () => {
  if (selectFilter.value !== "") {
    filterIsWatched = JSON.parse(selectFilter.value);
  } else {
    filterIsWatched = "";
  }
  allFilter();
});

document.getElementById("film-form").addEventListener("submit", handleFormSubmit);

// Display films on load
allFilter();
