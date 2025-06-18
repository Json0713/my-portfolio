// assets/js/hero.js

document.addEventListener("DOMContentLoaded", () => {
  const profilePic = document.getElementById("profile-pic");

  if (!profilePic) return;

  function updateProfileImage(theme) {
    const newSrc = theme === "light"
      ? "assets/images/profile-light.jpg"
      : "assets/images/May01-Portrait1-FINAL-100517.jpg";

    profilePic.classList.add("fade-out");
    setTimeout(() => {
      profilePic.src = newSrc;
      profilePic.classList.remove("fade-out");
      profilePic.classList.add("fade-in");
      setTimeout(() => profilePic.classList.remove("fade-in"), 300);
    }, 200);
  }

  const observer = new MutationObserver(() => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    updateProfileImage(currentTheme);
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"]
  });
});
