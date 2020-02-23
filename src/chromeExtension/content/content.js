const { makeTableHtml } = require("./table");
const { makeBadgesHtml } = require("./badges");

const zipCode = getZipCode();

if (zipCode) {
  chrome.runtime.sendMessage(
    { zipCode },
    ({ badgeProperties, tableProperties }) => {
      addBadges(badgeProperties);
      addNeighbourhoodTable(tableProperties);

      subscribeToBadgeClicks();
    }
  );
}

function getZipCode() {
  const zipCodeElement = document.querySelector(".object-header__subtitle");

  if (zipCodeElement === null) {
    return null;
  }

  const elementText = zipCodeElement.innerText;
  const zipCodeRe = /\d\d\d\d\s*[A-Z][A-Z]/;
  const match = elementText.match(zipCodeRe);

  return match[0].replace(" ", "");
}

function getBadgesContainerElement() {
  let badgesContainerElement = document.querySelector(
    ".object-header__details-info .labels"
  );

  if (!badgesContainerElement) {
    badgesContainerElement = document.createElement("ul");
    badgesContainerElement.classList.add("labels");

    document
      .querySelector(".object-header__details-info")
      .appendChild(badgesContainerElement);
  }

  return badgesContainerElement;
}

function addNeighbourhoodTable(tableProperties) {
  const neighbourhoodNameElement = document.querySelector(
    ".object-buurt__name"
  );

  const tableHtml = makeTableHtml(tableProperties);

  neighbourhoodNameElement.insertAdjacentHTML("afterend", tableHtml);
}

function addBadges(badgeProperties) {
  const badgesHtml = makeBadgesHtml(badgeProperties);

  const badgesContainerElement = getBadgesContainerElement();
  badgesContainerElement.insertAdjacentHTML("beforeend", badgesHtml);
}

function subscribeToBadgeClicks() {
  const badgesContainerElement = getBadgesContainerElement();

  badgesContainerElement.addEventListener("click", event => {
    const clickedElement = event.target;
    const isBadgeClick = clickedElement.classList.contains("badge");

    if (isBadgeClick) {
      chrome.runtime.sendMessage({ action: "openOptionsPage" });
    }
  });
}
