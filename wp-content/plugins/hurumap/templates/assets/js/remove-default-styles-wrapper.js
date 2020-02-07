window.onload = () => {
  Array.from(document.body.getElementsByTagName("style")).forEach(el => {
    if (
      el.innerHTML.includes("editor-styles-wrapper") &&
      !el.innerHTML.includes("HURUmap")
    ) {
      el.remove();
    }
  });
};
