window.onload = () => {
  /**
   * Setup same origin frame height
   */
  if (window.frameElement) { 
    const wrapper =
      document.getElementById("wrapper") ||
      iframe.contentDocument.getElementById("flourish-popup-constrainer");
    const height =
      wrapper && wrapper.offsetHeight > 420 ? wrapper.offsetHeight : 420;

    window.frameElement.style.height = `${height}px`;
  }

  document.body.style.background = "rgb(0,0,0) !important";
  const headers = document.getElementsByClassName("flourish-header");
  if (headers && headers.length) {
    headers[0].style.display = "none";
  }
};
