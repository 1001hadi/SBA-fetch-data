//create function based on character data to take care of adding table row
// replace name of this function with handling promises and adding manually in handle fetch and handle search

export async function handleTableRow(character) {
  try {
    let [homeworldRes, speciesRes] = await Promise.all([
      axios.get(character.homeworld),
      character.species.length > 0
        ? axios.get(character.species[0])
        : { data: { name: "unknown" } },
    ]);
    let homeworldData = homeworldRes.data;
    let speciesData = speciesRes.data;

    let tableRow = document.createElement("tr");
    tableRow.innerHTML = `
    <td>${character.name}</td>
      <td>${character.birth_year}</td>
      <td>${character.height}</td>
      <td>${character.mass}kg</td>
      <td>${homeworldData.name}</td>
      <td>${speciesData.name}</td>
    `;
    return tableRow;
  } catch (err) {
    console.log("error happen when creating table rows data!", err);
  }
}
