export function resetSingleSpa() {
  window.SINGLE_SPA_TESTING = true;
  delete window.elrondSpa;
  const elrondSpaScriptTag = document.getElementById("elrond-spa-distributable");
  if (elrondSpaScriptTag) {
    elrondSpaScriptTag.parentNode.removeChild(elrondSpaScriptTag);
  }
  return new Promise((resolve, reject) => {
    const scriptEl = document.createElement("script");
    scriptEl.setAttribute("id", "elrond-spa-distributable");
    scriptEl.setAttribute("src", "/base/lib/elrond-spa.js");
    scriptEl.onload = resolve;
    scriptEl.onerror = reject;
    document.head.appendChild(scriptEl);
  });
}
