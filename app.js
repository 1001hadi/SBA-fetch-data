const tableBody = document.getElementById("table-body");
const paginationEl = document.getElementById("pagination");
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("input");

const baseUrl = "https://swapi.dev/api/people/";

// declare variables for current, next and previous pages
let currPage = baseUrl;
let nextPage;
let prevPage;

// add event listener to the dom content to load the fetched data when start
// bug fixed with adding function parameter of current page
document.addEventListener("DOMContentLoaded", () => handleFetchData(currPage));

async function handleFetchData(url) {
  // make sure clear existing data from table
  tableBody.innerHTML = "";
  // fetch main url and collect data
  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // assign current page to main url
      // assign next and previous vars to data
      currPage = url;
      nextPage = data.next;
      prevPage = data.previous;

      data.results.forEach((character) => {
        // Fetch homeworld and species data with Promise.all
        Promise.all([
          fetch(character.homeworld).then((response) => response.json()),
          character.species.length > 0
            ? fetch(character.species[0]).then((response) => response.json())
            : Promise.resolve({ name: "unknown" }),
        ]).then(([homeworldData, speciesData]) => {
          const tableRow = document.createElement("tr");
          tableRow.innerHTML = `
                      <td>${character.name}</td>
                      <td>${character.birth_year}</td>
                      <td>${character.height}</td>
                      <td>${character.mass}kg</td>
                      <td>${homeworldData.name}</td>
                      <td>${speciesData.name}</td>
                  `;
          tableBody.appendChild(tableRow);
        });
      });
      // make sure handle the pagination after data loaded
      handlePagination();
    })
    .catch((err) => console.error("Error from API:", err));
}

// handle pagination function
// make sure clear pagination story
// check if there is previous page
// create prev btn and assign name for it
// make sure add event listener to previous btn to handle logic of fetching previous page
// append btn to the pagination element
// repeat the process for next btn!!!

function handlePagination() {
  paginationEl.innerHTML = "";
  // previous page
  if (prevPage) {
    let prevBtn = document.createElement("button");
    prevBtn.textContent = "< Prev Page";
    prevBtn.addEventListener("click", () => {
      currPage = prevPage;
      handleFetchData(prevPage);
    });
    paginationEl.appendChild(prevBtn);
  }
  // next page
  if (nextPage) {
    let nextBtn = document.createElement("button");
    nextBtn.textContent = "next Page >";
    nextBtn.addEventListener("click", () => {
      currPage = nextPage;
      handleFetchData(nextPage);
    });
    paginationEl.appendChild(nextBtn);
  }
}

// attach eventListener to search button
// get the search value of input
// if there is searched character
// fetch the base url and return then searched data
// create result var and assign it to the returned character name
// in next step create handle search and assign result var to it as parameter
// clear the paginationEl after search completed
// don't forget to catch the Error
// else reset to original fetched page if search is empty

searchBtn.addEventListener("click", handleSearchBtn);

function handleSearchBtn() {
  let searchedChar = searchInput.value.toLowerCase();
  console.log(searchedChar);
  if (searchedChar) {
    fetch(baseUrl)
      .then((res) => res.json())
      .then((data) => {
        let result = data.results.filter((character) =>
          character.name.toLowerCase().includes(searchedChar)
        );
        handleSearch(result);
        paginationEl.innerHTML = "";
      })
      .catch((err) => console.log("error from API", err));
  } else {
    handleFetchData(currPage);
  }
}

// handle search function
// clear table body content
// after looping on entered search value
// fetch data again for the result of search
// create new table row for the result
// add the result to table body
