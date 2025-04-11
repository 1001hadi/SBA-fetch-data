const tableBody = document.getElementById("table-body");
const paginationEl = document.getElementById("pagination");

const baseUrl = "https://swapi.dev/api/people/";

document.addEventListener("DOMContentLoaded", handleFetchData);

async function handleFetchData() {
  await fetch(baseUrl)
    .then((response) => response.json())
    .then((data) => {
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
    })
    .catch((err) => console.error("Error from API:", err));
}
