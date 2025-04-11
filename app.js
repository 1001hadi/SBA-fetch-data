const tableBody = document.getElementById("table-body");
const baseUrl = "https://swapi.dev/api/people/";

document.addEventListener("DOMContentLoaded", handleFetchData);

async function handleFetchData() {
  await fetch(baseUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.results);
    })
    .catch((error) => console.error("Error from API:", error));
}


