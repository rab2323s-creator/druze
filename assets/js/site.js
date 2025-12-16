(function () {
  const root = document.documentElement;

  // default: dark editorial look
  const saved = localStorage.getItem("theme");
  if (saved === "light") root.dataset.theme = "light";

  window.toggleTheme = function () {
    const isLight = root.dataset.theme === "light";
    if (isLight) {
      delete root.dataset.theme;
      localStorage.removeItem("theme");
    } else {
      root.dataset.theme = "light";
      localStorage.setItem("theme", "light");
    }
  };
})();
