const tableBody = document.getElementById("table-body");
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
          console.log(homeworldData, speciesData);
        });
      });
    })
    .catch((err) => console.error("Error from API:", err));
}
