console.log("JavaScript front-end ligado"); // testing connection

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

async function getCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des travaux");
    }
    const categories = await response.json();
    return categories;
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


//im selecting all the filtter-buttons
const filterButtons = document.querySelector(".filter-buttons");


function displayCategories(categories) {

  categories.forEach(category => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.setAttribute("data-category", category.id);
    button.className="button";

    filterButtons.appendChild(button);
  });
}


function filterWorks(category, works) {
  if (category === "all") {
    return works; // get all the works
  } else {
    return works.filter(work => work.category.id == category); // selecting all the works but getting only the category "id"
  }
}


async function init() {
  const works = await getWorks();
  displayWorks(works);

  const categories = await getCategories(); // grab the data from API
  displayCategories(categories); // shows in filter-buttons

  // Adding the Event Click to the buttons
  const buttons=document.querySelectorAll("button");
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const category = button.dataset.category;
      console.log(category)
      const filteredWorks = filterWorks(category, works);  // when clicking one buttun: Gets the category (data-category), Filter the works with filterWorks() and Refreshes the gallery with displayWorks(filteredWorks)
      displayWorks(filteredWorks);

    // Remove 'active' from all the buttons and adds 'active" on the clicked button
    buttons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    });
  });
}

init();
