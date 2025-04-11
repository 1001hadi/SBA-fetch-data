const tableBody = document.getElementById("table-body");
const paginationEl = document.getElementById("pagination");

const baseUrl = "https://swapi.dev/api/people/";

// declare variables for current, next and previous pages
let currPage = baseUrl;
let nextPage;
let prevPage;

// add event listener to the dom content to load the fetched data when start
document.addEventListener("DOMContentLoaded", handleFetchData);

async function handleFetchData() {
  // make sure clear existing data from table
  tableBody.innerHTML = "";
  // fetch main url and collect data
  await fetch(baseUrl)
    .then((response) => response.json())
    .then((data) => {
      // assign next and previous vars to data
      nextPage = data.next;
      prevPage = data.previous;
      data.results.forEach((person) => {
        // Fetch homeworld and species data with Promise.all
        Promise.all([
          fetch(person.homeworld).then((response) => response.json()),
          person.species.length > 0
            ? fetch(person.species[0]).then((response) => response.json())
            : Promise.resolve({ name: "Unknown" }),
        ]).then(([homeworldData, speciesData]) => {
          const tableRow = document.createElement("tr");
          tableRow.innerHTML = `
                      <td>${person.name}</td>
                      <td>${person.birth_year}</td>
                      <td>${person.height}</td>
                      <td>${person.mass}kg</td>
                      <td>${homeworldData.name}</td>
                      <td>${speciesData.name}</td>
                  `;
          tableBody.appendChild(tableRow);
        });
      });
      // make sure handle the pagination after data loaded
    })
    .catch((err) => console.error("Error from API:", err));
}

// handle pagination function
// make sure clear pagination story
// check if there is previous page
// create prev btn and assign name for it
// make sure add event listener to previous btn to handle logic of fetching previous page
// append btn to the pagination element
// repeat the process fro next btn!!!

function handlePagination() {
  paginationEl.innerHTML = "";

  if (prevPage) {
    let prevBtn = document.createElement("button");
    prevBtn.textContent = "PrevPage";
    prevBtn.addEventListener("click", () => {
      currPage = prevPage;
      handleFetchData(prevPage);
    });
    paginationEl.appendChild(prevBtn);
  }
}
