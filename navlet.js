let isTrayVisible = true;

const tray = document.createElement("div");
tray.setAttribute("id", "navlet-tray");
tray.style.bottom = "14px";
tray.style.border = "2px solid rgba(0,0,0,0)";
tray.style.borderTopLeftRadius = "24px";
tray.style.borderBottomLeftRadius = "24px";
tray.style.background = "rgba(255,255,255,0.75)";
tray.style.backdropFilter = "blur(8px)";

const buttonTop = document.createElement("button");
buttonTop.innerHTML = "&#8679;";
buttonTop.setAttribute("id", "navlet-top");
buttonTop.style.margin = "8px 24px 6px 8px";

const buttonBottom = document.createElement("button");
buttonBottom.innerHTML = "&#8681;";
buttonBottom.setAttribute("id", "navlet-bottom");
buttonBottom.style.margin = "6px 24px 8px 8px";

const br = document.createElement("br");

const restore = document.createElement("button");
restore.innerHTML = isTrayVisible ? "&#8618;" : "&#8617;";
restore.setAttribute("id", "navlet-restore");
restore.style.bottom = "56px";
restore.style.background = "rgba(0,0,0,0.5)";
restore.style.borderTopLeftRadius = "12px";
restore.style.borderBottomLeftRadius = "12px";
restore.style.height = "24px";
restore.style.width = "20px";
restore.style.margin = "0";

[restore, buttonBottom, buttonTop].forEach((item) => {
  item.style.border = "2px solid rgba(0,0,0,0.5)";
  item.style.color = "#fff";
  item.style.fontWeight = "900";
  item.style.cursor = "pointer";
  item.style.padding = "0";
});
[restore, tray].forEach((item) => {
  item.style.borderRight = "0";
  item.style.zIndex = "999999";
  item.style.position = "fixed";
  item.style.right = "0";
});
[buttonTop, buttonBottom].forEach((item) => {
  item.style.fontSize = "20px";
  item.style.height = "38px";
  item.style.width = "38px";
  item.style.borderRadius = "20px";
  item.style.background = "rgba(0,0,0,0.5)";
});

tray.appendChild(buttonTop);
tray.appendChild(br);
tray.appendChild(buttonBottom);

// Remove if items already exists somehow
document.getElementById("navlet-tray")?.remove();
document.getElementById("navlet-restore")?.remove();

// Append the new tray
document.body.appendChild(tray);
document.body.appendChild(restore);

document.addEventListener("click", function (e) {
  if (e.target && e.target.id == "navlet-top") {
    scrollTo({
      top: 0,
    });
  }
  if (e.target && e.target.id == "navlet-bottom") {
    const scrollableElement = document.scrollingElement;
    scrollTo({
      top: scrollableElement.scrollHeight - scrollableElement.clientHeight,
    });
  }
  if (e.target && e.target.id == "navlet-restore") {
    restoreTray();
  }
});
function restoreTray() {
  if (isTrayVisible) {
    document.getElementById("navlet-tray").style.display = "none";
    isTrayVisible = false;
    restore.innerHTML = "&#8617;";
  } else {
    document.getElementById("navlet-tray").style.display = "block";
    isTrayVisible = true;
    restore.innerHTML = "&#8618;";
  }
}
const pi = Math.PI;
const timingFunction = (x) => 0.5 * (Math.cos(x * pi + pi) + 1);
function scrollTo({ top, element = document.scrollingElement }) {
  const startTop = element.scrollTop;
  top ??= startTop;
  top = Math.max(0, Math.min(element.scrollHeight - element.clientHeight, top));
  if (startTop === top) return;
  const distanceTop = top - startTop;

  let x = 0,
    prevTimestamp = null;

  function step(newTimestamp) {
    x += (newTimestamp - prevTimestamp) / 250;
    x = Math.min(x, 1);
    const fraction = timingFunction(x);
    element.scroll({
      top: startTop + fraction * distanceTop,
      behavior: "instant",
    });
    if (x >= 1) return;
    prevTimestamp = newTimestamp;
    window.requestAnimationFrame(step);
  }
  window.requestAnimationFrame((timestamp) => {
    prevTimestamp = timestamp;
    window.requestAnimationFrame(step);
  });
}
