console.log("JavaScript front-end ligado com sucesso"); // testing connection

// funtion to grab the works from API
async function getWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des travaux");
    }
    const works = await response.json();
    return works;
  } catch (error) {
    console.error(error);
    return [];
  }
}


// grabing the div of the gallery, present on the HTML
const gallery = document.querySelector(".gallery");


function displayWorks(works) {
  gallery.innerHTML = ""; // clears the gallery

  works.forEach(work => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = work.imageUrl; // URL of the images from API
    img.alt = work.title;

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}


// this is the main function
async function init() {
  const works = await getWorks(); // grab the data from API
  displayWorks(works); // shows in the gallery
}

// then, executes
init();

//im selecting all the filtter-buttons
const filterButtons = document.querySelectorAll(".filter-buttons button");


function filterWorks(category, works) {
  if (category === "all") {
    return works; // get all the works
  } else {
    return works.filter(work => work.category.name === category); // selecting all the works but getting only the category "name"
  }
}


async function init() {
  const works = await getWorks();
  displayWorks(works);

  // Adding the Event Click to the buttons
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const category = button.dataset.category;
      const filteredWorks = filterWorks(category, works);  // when clicking one buttun: Gets the category (data-category), Filter the works with filterWorks() and Refreshes the gallery with displayWorks(filteredWorks)
      displayWorks(filteredWorks);

    // Remove 'active' from all the buttons and adds 'active" on the clicked button
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    });
  });
}

init();
