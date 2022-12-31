let isTrayVisible = true;

const tray = document.createElement("div");
tray.setAttribute("id", "navlet-tray");
tray.style.bottom = "14px";
tray.style.border = "2px solid rgba(0,0,0,0)";
tray.style.borderTopLeftRadius = "22px";
tray.style.borderBottomLeftRadius = "22px";
tray.style.background = "rgba(255,255,255,0.75)";
tray.style.backdropFilter = "blur(8px)";

const buttonTop = document.createElement("button");
const buttonBottom = document.createElement("button");
const br = document.createElement("br");
const restore = document.createElement("button");

[restore, buttonBottom, buttonTop].forEach((item) => {
  item.style.border = "2px solid rgba(0,0,0,0.5)";
  item.style.color = "#fff";
  item.style.fontWeight = "900";
  item.style.cursor = "pointer";
  item.style.padding = "0";
  item.style.backgroundColor = "rgba(0,0,0,0.5)";
  item.style.backgroundSize = "14px";
  item.style.backgroundRepeat = "no-repeat";
  item.style.backgroundPositionX = "center";
  item.style.backgroundPositionY = "center";
});
[restore, tray].forEach((item) => {
  item.style.borderRight = "0";
  item.style.zIndex = "2147483647";
  item.style.position = "fixed";
  item.style.right = "0";
});
[buttonTop, buttonBottom].forEach((item) => {
  item.style.fontSize = "20px";
  item.style.height = "32px";
  item.style.width = "32px";
  item.style.minWidth = "0";
  item.style.borderRadius = "20px";
  item.style.margin = "4px 18px 6px 4px";
});
// Element customizations
buttonTop.style.backgroundImage =
  "url('https://github.com/irizwankhan/navlet/raw/main/extension/img/t.png')";
buttonTop.setAttribute("id", "navlet-top");

buttonBottom.style.backgroundImage =
  "url('https://github.com/irizwankhan/navlet/raw/main/extension/img/b.png')";
buttonBottom.setAttribute("id", "navlet-bottom");

restore.style.backgroundImage = isTrayVisible
  ? "url('https://github.com/irizwankhan/navlet/raw/main/extension/img/r.png')"
  : "url('https://github.com/irizwankhan/navlet/raw/main/extension/img/l.png')";
restore.setAttribute("id", "navlet-restore");
restore.style.bottom = "47px";
restore.style.borderTopLeftRadius = "12px";
restore.style.borderBottomLeftRadius = "12px";
restore.style.height = "24px";
restore.style.width = "20px";
restore.style.minWidth = "0";
restore.style.minHeight = "0";
restore.style.margin = "0";
restore.style.backgroundSize = "8px";
if (isTrayVisible) restore.style.backgroundPositionX = "6px";

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
    restore.style.backgroundPositionX = "center";
    restore.style.backgroundImage =
      "url('https://github.com/irizwankhan/navlet/raw/main/extension/img/l.png')";
  } else {
    document.getElementById("navlet-tray").style.display = "block";
    isTrayVisible = true;
    restore.style.backgroundPositionX = "6px";
    restore.style.backgroundImage =
      "url('https://github.com/irizwankhan/navlet/raw/main/extension/img/r.png')";
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
// navlet ends

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg == "toggleTray") {
    restoreTray();
  }
});
