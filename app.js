const tableRow = document.getElementById("table-row");
const baseUrl = "https://swapi.dev/api/people/?page=1";

async function getPeople() {
  const data = await fetch(baseUrl)
    .then((res) => res.json())
    .then((res) => {
      console.log(res.results);
    })
    .catch((err) => {
      console.log(err);
    });

}
getPeople();
