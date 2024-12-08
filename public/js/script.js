// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

// Tax Function
let taxSwitch = document.getElementById("flexSwitchCheckDefault");
taxSwitch.addEventListener("click", () => {
  let taxInfo = document.getElementsByClassName("tax-info");
  for (let info of taxInfo) {
    if (info.style.display != "inline") {
      info.style.display = "inline";
    } else {
      info.style.display = "none";
    }
  }
});


// Search Function
function handleSearchTypeChange() {
  const searchType = document.getElementById("searchType").value;
  const searchQueryInput = document.getElementById("searchQuery");
  const categoryDropdown = document.getElementById("categoryDropdown");

  // Reset all fields
  searchQueryInput.style.display = "none";
  categoryDropdown.style.display = "none";

  // Show relevant input based on selected type
  if (searchType === "location" || searchType === "country" || searchType === "price") {
      searchQueryInput.style.display = "block";
      searchQueryInput.placeholder = `Enter ${
      searchType.charAt(0).toUpperCase() + searchType.slice(1)
      }`;
  } else if (searchType === "category") {
      categoryDropdown.style.display = "block";
  }
}


// Function to handle form submission (triggered by both Enter and search button click)
function handleSearchFormSubmit(event) {
  const searchType = document.getElementById("searchType").value;
  const searchQuery = document.getElementById("searchQuery").value;
  const category = document.getElementById("categoryDropdown").value;

  // Prevent form submission if no valid input is provided
  if (!searchType) {
    event.preventDefault();
    alert("Please select a search type.");
    return false;
  }

  // Validate inputs based on selected search type
  if (searchType === "price") {
    // Ensure the price input is a positive number
    console.log(searchQuery);
    if (!searchQuery || isNaN(searchQuery) || Number(searchQuery) <= 0) {
      event.preventDefault();
      alert("Please enter a valid price (a positive number).");
      return false;
    }
  } else if (searchType === "category") {
    // Ensure a category is selected
    if (!category) {
      event.preventDefault();
      alert("Please select a category.");
      return false;
    }
  } else if (!searchQuery) {
    // For other types, ensure the text input is not empty
    event.preventDefault();
    alert(`Please provide a valid ${searchType}.`);
    return false;
  }

  // Allow form submission
  return true;
}

// Attach event listener to the form
document.getElementById("searchForm").addEventListener("submit", handleSearchFormSubmit);
