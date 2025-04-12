const loadEl = document.getElementById("load-animation");
// make sure export the functions
//  create function show animation
//  set the loading animation display to block

export function showAnimation() {
  loadEl.style.display = "block";
}

// create function hide animation
// set loading animation display to none

export function hideAnimation() {
  loadEl.style.display = "none";
}
