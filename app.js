const baseUrl = "https://swapi.dev/api/people/?page=1";

async function getPeople() {
  const data = await fetch(baseUrl)
    .then((res) => res.json())
    .then((character) => {
      console.log(character);
    });

  return data;
}

getPeople();
