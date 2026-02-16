console.log("JavaScript front-end on"); // testing connection

//im selecting all the filtter-buttons
const filterButtons = document.querySelector(".filter-buttons");

// selects the title of HTML
const portfolioTitle = document.querySelector("#portfolio h2");

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

// funtion to grab categories from API
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

// function to delete works from API
async function deleteWork(id) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression");
    }

    // refresh all after delete one/more works
    const updatedWorks = await getWorks();
    displayWorks(updatedWorks);
    displayWorksInModal(updatedWorks);
  } catch (error) {
    console.error(error);
  }
}

// grabing the div of the gallery, present on the HTML
const gallery = document.querySelector(".gallery");

// function to show the works
function displayWorks(works) {
  gallery.innerHTML = ""; // clears the gallery

  works.forEach((work) => {
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

// function to show categories
function displayCategories(categories) {
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.setAttribute("data-category", category.id);
    button.className = "button";

    filterButtons.appendChild(button);
  });
}

// function to filter the works by the category id
function filterWorks(category, works) {
  if (category === "all") {
    return works; // get all the works
  } else {
    return works.filter((work) => work.category.id == category); // selecting all the works but getting only the category "id"
  }
}



// --- MAIN FUNCTION --- //

async function init() {

  const token = localStorage.getItem("token");

  // fetch data - get works
  const works = await getWorks();
  displayWorks(works);

  const categories = await getCategories();
  displayCategories(categories); // shows in filter-buttons

  
  // filter buttons - adding the Event Click to the buttons
  const buttons = document.querySelectorAll(".filter-buttons button");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {

      const category = button.dataset.category;
      const filteredWorks = filterWorks(category, works); //when clicking one button: Gets the category (data-category), Filter the works with filterWorks() and shows in the gallery with displayWorks(filteredWorks)
      displayWorks(filteredWorks);

      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
    });
  });

  
  // edit mode elements - bandeau noir and filter buttons
  const editBanner = document.querySelector(".edit-banner");
  const editButton = document.querySelector(".edit-button");
  const loginLink = document.querySelector('nav a[href="login.html"]');
  const filterButtons = document.querySelector(".filter-buttons");


  // modale elements
  const modal = document.getElementById("modal");
  const openModalBtn = document.querySelector(".edit-button");
  const closeModal = document.querySelector(".close-modal");
  const modalGallery = document.querySelector(".modal-gallery");


  // page system - second modale -
  const galleryView = document.getElementById("gallery-view");
  const formView = document.getElementById("form-view");

  const addPhotoButton = document.querySelector(".add-photo-button");
  const backToGallery = document.querySelector(".back-to-gallery");

  const addProjectForm = document.getElementById("add-project-form"); 
  const categorySelect = document.getElementById("category");

// image preview
  const imageInput = document.getElementById("image");
  const imagePreview = document.getElementById("image-preview");


  // preview of the photo in the form
  imageInput.addEventListener("change", () => {

  const file = imageInput.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(e) {

    imagePreview.innerHTML = "";

    const img = document.createElement("img");
    img.src = e.target.result;
    img.alt = "Preview";

    imagePreview.appendChild(img);
  };

  reader.readAsDataURL(file);

});


  // display works inside of modale
  function displayWorksInModal(worksToShow) {

    modalGallery.innerHTML = "";

    worksToShow.forEach((work) => {

      const figure = document.createElement("figure");
      figure.classList.add("modal-work");

      const img = document.createElement("img");
      img.src = work.imageUrl;
      img.alt = work.title;

      const deleteIcon = document.createElement("i");
      deleteIcon.classList.add("fa-solid", "fa-trash", "deleteIcon");

      deleteIcon.addEventListener("click", async () => {
        await deleteWork(work.id); // calls the function to do delete on the a função que faz DELETE na API

        // refresh works
        const updatedWorks = await getWorks();
        displayWorks(updatedWorks);
        displayWorksInModal(updatedWorks);
      });

      figure.appendChild(img);
      figure.appendChild(deleteIcon);
      modalGallery.appendChild(figure);
    });
  }

  
  // fill category select -form-
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });

  // add project 
  addProjectForm.addEventListener("submit", async (event) => {

  event.preventDefault(); // prevents the page of refreshing

  // selects the elements of the form
  const imageInput = document.getElementById("image");
  const titleInput = document.getElementById("title");
  const categoryInput = document.getElementById("category");

  const image = imageInput.files[0];
  const title = titleInput.value;
  const category = categoryInput.value;

  // validation: verifies if all camps all filled
  if (!image || !title || !category) {
    alert("Veuillez remplir tous les champs");
    return;
  }

  // cria um objeto FormData para enviar os dados como multipart/form-data
  const formData = new FormData();
  formData.append("image", image);
  formData.append("title", title);
  formData.append("category", category);

  // sends the data for the API using fetch
  await fetch("http://localhost:5678/api/works", {
    method: "POST", // método POST to create a new project
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  // refresh gallery dynamically
  const updatedWorks = await getWorks();

  displayWorks(updatedWorks); // refresh the gallery in the main page atualiza
  displayWorksInModal(updatedWorks); // refresh the gallery in the modale

  // reset form
  addProjectForm.reset();

  // go back to gallery page
  formView.style.display = "none";
  galleryView.style.display = "block"; // goes back to gallery modale

});


  // open modal
  if (openModalBtn) {
    openModalBtn.addEventListener("click", () => {
      modal.style.display = "flex";
      displayWorksInModal(works);

      // Always reset to gallery page when opening
      formView.style.display = "none";
      galleryView.style.display = "block";
    });
  }


  // switch to form page - second page modale
  addPhotoButton.addEventListener("click", () => {
    galleryView.style.display = "none";
    formView.style.display = "block";
  });

  
  // event click back to gallery page - first page modale
  backToGallery.addEventListener("click", () => {
    formView.style.display = "none";
    galleryView.style.display = "block";
  });

  
  // close modal //
  function closeModalAndReset() {
    modal.style.display = "none";
    formView.style.display = "none";
    galleryView.style.display = "block";
  }

  if (closeModal) {
    closeModal.addEventListener("click", closeModalAndReset);
  }

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModalAndReset();
    }
  });

  
  // edit mode (token)
  if (token) {

    editBanner.style.display = "flex";
    editButton.style.display = "flex";
    filterButtons.style.display = "none";

    // if exists token - transform the loggin in logout
    loginLink.textContent = "logout";
    loginLink.href = "#";

    // logout //
    loginLink.addEventListener("click", () => {
      localStorage.removeItem("token"); // Removes the token of localStorage, does the loggout of the user
      window.location.reload();
    });

  } else {

    editBanner.style.display = "none";
    editButton.style.display = "none";
    filterButtons.style.display = "flex";
  }

}

init();
