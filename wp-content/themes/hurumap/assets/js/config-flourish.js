window.onload = () => {
  /**
   * Setup same origin frame height
   */
  if (window.frameElement || window.parent) { 
    const iframe = window.frameElement || window.parent.document.querySelector(`iframe[src*="${chartId}"]`)
    const wrapper =
      document.getElementById("wrapper") ||
      document.getElementById("flourish-popup-constrainer");
    const height =
      wrapper && wrapper.offsetHeight > 420 ? wrapper.offsetHeight : 420;

    iframe.style.height = `${height}px`;
  }

  document.body.style.background = "rgb(0,0,0) !important";
  const headers = document.getElementsByClassName("flourish-header");
  if (headers && headers.length) {
    headers[0].style.display = "none";
  }
};
