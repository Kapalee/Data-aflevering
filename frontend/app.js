// ============ GLOBAL VARIABELS ============ //
const endpoint = "http://localhost:3333";

let selectedUser;

// ============ INIT APP ============ //

window.addEventListener("load", initApp);

function initApp() {
  updateUsersGrid(); // to initialize the grid view with users
  // event listeners
  document
    .querySelector("#form-create")
    .addEventListener("submit", createArtist);
  document.querySelector("#form-update").addEventListener("submit", updateUser);
}

// ============ READ ============ //

async function updateUsersGrid() {
  const users = await readArtists();
  displayArtists(users);
}

// Read (GET) all users from Firebase (Database) using REST API
async function readArtists() {
  const response = await fetch(`${endpoint}/artists`);
  const data = await response.json();
  const users = Object.keys(data).map((key) => ({ id: key, ...data[key] })); // from object to array
  return users;
}

// Create HTML and display all users from given list
function displayArtists(list) {
  document.querySelector("#users-grid").innerHTML = "";
  for (const artist of list) {
    document.querySelector("#users-grid").insertAdjacentHTML(
      "beforeend",
      /*html*/ `
            <article>
                <img src="${artist.image}">
                <h2>${artist.name}</h2>
                <p>${artist.birthdate}</p>
                <p>${artist.activeSince}</p>
                <p>${artist.genres}</p>
                <p>${artist.labels}</p>
                <p>${artist.website}</p>
                <p>${artist.shortDescription}</p>
                 <div class="btns">
                    <button class="btn-update-artist">Update</button>
                    <button class="btn-delete-artist">Delete</button>
                </div>
            </article>
        `
    );
    document
      .querySelector("#users-grid article:last-child .btn-delete-artist")
      .addEventListener("click", () => deleteUser(artist.id));
    document
      .querySelector("#users-grid article:last-child .btn-update-artist")
      .addEventListener("click", () => selectUser(artist));
  }
}

// ============ CREATE ============ //
// Create (POST) artist to Firebase (Database) using REST API
async function createArtist(event) {
  event.preventDefault();
  const form = event.target;
  const name = form.name.value;
  const birthDate = form.birthDate.value;
  const activeSince = form.activeSince.value;
  const labels = form.labels.value;
  const website = form.website.value;
  const genres = form.genres.value;
  const image = form.image.value;
  const shortDescription = form.shortDescription.value;
  // create a new artist
  const newArtist = {
    name,
    image,
    birthDate,
    activeSince,
    labels,
    website,
    genres,
    shortDescription,
  };
  const artistAsJson = JSON.stringify(newArtist);
  const response = await fetch(`${endpoint}/artists`, {
    method: "POST",
    body: artistAsJson,
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    // if success, update the users grid
    updateUsersGrid();
    // and scroll to top
    scrollToTop();
  }
}

// ============ UPDATE ============ //
function selectUser(artist) {
  // Set global varaiable
  selectedUser = artist;
  const form = document.querySelector("#form-update");
  form.name.value = artist.name;
  form.birthDate.value = artist.birthDate;
  form.website.value = artist.website;
  form.image.value = artist.image;
  form.labels.value = artist.labels;
  form.genres.value = artist.genres;
  form.activeSince.value = artist.activeSince;
  form.shortDescription.value = artist.shortDescription;
  form.scrollIntoView({ behavior: "smooth" });
}

async function updateUser(event) {
  event.preventDefault();
  const form = event.target;
  const name = form.name.value;
  const birthDate = form.birthDate.value;
  const activeSince = form.activeSince.value;
  const labels = form.labels.value;
  const website = form.website.value;
  const genres = form.genres.value;
  const image = form.image.value;
  const shortDescription = form.shortDescription.value;
  // update artist
  const userToUpdate = {
    name,
    image,
    birthDate,
    activeSince,
    labels,
    website,
    genres,
    shortDescription,
  };
  const userAsJson = JSON.stringify(userToUpdate);
  const response = await fetch(`${endpoint}/artists/${selectedUser.id}`, {
    method: "PUT",
    body: userAsJson,
    headers: { "Content-Type": "application/json" },
  });
  if (response.ok) {
    // if success, update the users grid
    updateUsersGrid();
    // and scroll to top
    scrollToTop();
  }
}

// ================== DELETE ============ //
async function deleteUser(id) {
  const response = await fetch(`${endpoint}/artists/${id}`, {
    method: "DELETE",
  });
  if (response.ok) {
    // if success, update the users grid
    updateUsersGrid();
  }
}

// ================== Events ============ //

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
