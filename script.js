// =====================================
// BACKGROUND CLICK AD SYSTEM
// EVERY GENUINE CLICK
// =====================================

document.addEventListener("click", function (e) {

  // Ignore buttons
  if (e.target.closest("button")) return;

  // Ignore form controls
  if (
    e.target.closest("input") ||
    e.target.closest("textarea") ||
    e.target.closest("select") ||
    e.target.closest("label")
  ) return;

  // Ignore links and interactive elements
  if (
    e.target.closest("a") ||
    e.target.closest("[contenteditable='true']") ||
    e.target.closest("[role='button']")
  ) return;

  // Open clearly labeled advertisement
  const adWindow = window.open(
    "https://bauval.org/22/6964d7ca14dd51a0e8d81ea393ff89da",
    "_blank"
  );

}, true);
