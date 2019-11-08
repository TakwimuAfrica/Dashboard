(() => {
  function receiveMessage(event) {
    if (typeof event.data === "object") {
      const iframe = document.getElementById(event.data.id);
      if (iframe) {
        if (event.data.height) {
          iframe.style.height = event.data.height;
        }
        if (event.data.height) {
          iframe.style.width = event.data.width;
        }
      }
    }
  }
  window.addEventListener("message", receiveMessage, false);
})();
