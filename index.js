// Getting some HTML components
const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");

let photos = [];
let totalPhotos = 0; // This will contain the length of photos[]
let photosLoaded = 0; // This will keep track of how many photos were loaded in the page
let photosReady = false; // This becomes true when all the images have been loaded.

// Unsplash API
const photoCount = 10;
const apiKey = "APxFL1KASrlTuMGqxwnRl4hK1Ry8FETodFYFJkgraN8";
const apiURL = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${photoCount}`;

// A custom function to make our code less repeated
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

function imageLoaded() {
  photosLoaded++; // Every time an image is loaded
  if (photosLoaded === totalPhotos) {
    photosReady = true;
    loader.hidden = true;
  } // Set to true once all photos are loaded
}

function displayPhotos() {
  totalPhotos = photos.length;
  photos.forEach((photo) => {
    // Create the anker tag for the photo to lead us to the actual link of the photo
    const item = document.createElement("a");
    setAttributes(item, {
      href: photo.links.html,
      target: "_blank",
    });
    // Create the image tag to contain the photo
    const img = document.createElement("img");
    img.setAttribute("src", photo.urls.regular);

    // Most photos do not have an alt text so we set our own for those photos.
    if (!photo.alt_description) {
      setAttributes(img, {
        src: photo.urls.regular,
        alt: "a photo without any description",
        title: "view photo",
      });
    } else {
      setAttributes(img, {
        src: photo.urls.regular,
        alt: photo.alt_description,
        title: photo.alt_description,
      });
    }

    // Add an event listener that checks if an image was loaded.
    // Run the function imageLoaded once the image is loaded.
    img.addEventListener("load", imageLoaded);

    // Put img inside of the anker tags
    item.appendChild(img);

    // Put put the anker tags inside the image container div.
    imageContainer.appendChild(item);
  });
}

// get photos from the Unsplash API
async function getPhotos() {
  try {
    const res = await fetch(apiURL);
    photos = await res.json();
    console.log(photos);
    displayPhotos();
  } catch (err) {
    console.log(err);
  }
}

// Implementing infinite scrolling
// We are adding an event listener when scrolling is done in the window.
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    true
  ) {
    // Set ready to false before we get another set of photos, this will ensure that
    // we don't keep adding new photos as soon as the user meets the scroll
    // condition for the very first time.
    ready = false;
    getPhotos();
  }
});

// This function executes as soon as the webpage is loaded.
getPhotos();
