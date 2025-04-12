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
  // make sure put them in try-catch block
  try {
    const res = await axios.get(url);
    let data = res.data;

    // assign current page to main url
    // assign next and previous vars to data
    currPage = url;
    nextPage = data.next;
    prevPage = data.previous;

    const characterPromise = data.results.map(async (character) => {
      let [homeworldRes, speciesRes] = await Promise.all([
        axios.get(character.homeworld),
        character.species.length > 0
          ? axios.get(character.species[0])
          : { data: { name: "unknown" } },
      ]);

      let homeworldData = homeworldRes.data;
      let speciesData = speciesRes.data;

      const tableRow = document.createElement("tr");
      tableRow.innerHTML = `
                       <td>${character.name}</td>
                       <td>${character.birth_year}</td>
                       <td>${character.height}</td>
                       <td>${character.mass}kg</td>
                       <td>${homeworldData.name}</td>
                       <td>${speciesData.name}</td>
                   `;
      return tableRow;
    });
    // loop over the table rows data and add them to table body
    const tableRows = await Promise.all(characterPromise);
    tableRows.forEach((rows) => {
      tableBody.appendChild(rows);
    });
    // make sure handle the pagination after data loaded
    handlePagination();
  } catch (err) {
    console.error("error from API:", err);
  }
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

async function handleSearchBtn() {
  let searchedChar = searchInput.value.toLowerCase();
  // console.log(searchedChar);
  if (searchedChar) {
    let searchedArr = [];
    let nextUrl = baseUrl;
    // console.log(searchedArr);

    try {
      while (nextUrl) {
        const res = await axios.get(nextUrl);
        const data = await res.data;
        searchedArr.push(...data.results);
        nextUrl = data.next;
      }

      const result = searchedArr.filter((character) =>
        character.name.toLowerCase().includes(searchedChar)
      );
      // console.log(result);

      handleSearch(result);
      paginationEl.innerHTML = "";
    } catch (err) {
      console.error("Error from API:", err);
    }
  } else {
    handleFetchData(currPage);
  }
}

// handle search function
// clear table body content
// after looping on entered search values
// fetch data again for the result of search
// create new table row for the result
// add the result to table body

async function handleSearch(searchResult) {
  tableBody.innerHTML = "";
  for (const character of searchResult) {
    try {
      const [homeworldRes, speciesRes] = await Promise.all([
        axios.get(character.homeworld),
        character.species.length > 0
          ? axios.get(character.species[0])
          : { data: { name: "unknown" } },
      ]);

      let homeworldData = homeworldRes.data;
      let speciesData = speciesRes.data;

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
    } catch (err) {
      console.log("can't fetching data for character you entered!", err);
    }
  }
}
