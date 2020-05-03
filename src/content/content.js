import { wrapTableWithTitle, makeTableHtml } from "./table";
import { makeBadgesHtml } from "./badges";

const zipCode = getZipCode();

if (zipCode) {
  chrome.runtime.sendMessage({ zipCode }, ({ badgeProperties, tableProperties }) => {
    addBadges(badgeProperties);
    addNeighbourhoodTable(tableProperties);

    subscribeToBadgeClicks();
  });
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
  const headerDetailsElement = document.querySelector(".object-header__details-info");

  if (!headerDetailsElement) {
    return null;
  }

  let badgesContainerElement = document.querySelector(".object-header__details-info .labels");

  if (!badgesContainerElement) {
    badgesContainerElement = document.createElement("ul");
    badgesContainerElement.classList.add("labels");
    headerDetailsElement.appendChild(badgesContainerElement);
  }

  return badgesContainerElement;
}

function addNeighbourhoodTable(tableProperties) {
  const tableHtml = makeTableHtml(tableProperties);

  const neighbourhoodNameElement = document.querySelector(".object-buurt__name");

  if (neighbourhoodNameElement) {
    neighbourhoodNameElement.insertAdjacentHTML("afterend", tableHtml);
  }

  const agentElement = document.querySelector(".object-detail-verkocht__makelaars-header");

  if (agentElement) {
    const tableWithTitle = wrapTableWithTitle(tableProperties, tableHtml);
    agentElement.insertAdjacentHTML("beforebegin", tableWithTitle);
  }
}

function addBadges(badgeProperties) {
  const badgesContainerElement = getBadgesContainerElement();

  if (badgesContainerElement) {
    const badgesHtml = makeBadgesHtml(badgeProperties);
    badgesContainerElement.insertAdjacentHTML("beforeend", badgesHtml);
  }
}

function subscribeToBadgeClicks() {
  const badgesContainerElement = getBadgesContainerElement();

  badgesContainerElement.addEventListener("click", event => {
    const clickedElement = event.target;
    const isBadgeClick = clickedElement.classList.contains("funda-neighbourhoods-badge");

    if (isBadgeClick) {
      chrome.runtime.sendMessage({ action: "openOptionsPage" });
    }
  });
}