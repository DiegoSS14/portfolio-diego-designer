const themeInitializerScript = `
(function applyStoredTheme() {
  try {
    var persistedTheme = localStorage.getItem("portfolio-theme");
    var initialTheme = persistedTheme === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", initialTheme);
  } catch (error) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();
`;

export function ThemeInitializerScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeInitializerScript }} />;
}
