const originalDeck = [[1, 2, 3, 4, 5, 6, 7, 8],
[1, 9, 10, 11, 12, 13, 14, 15],
[1, 16, 17, 18, 19, 20, 21, 22],
[1, 23, 24, 25, 26, 27, 28, 29],
[1, 30, 31, 32, 33, 34, 35, 36],
[1, 37, 38, 39, 40, 41, 42, 43],
[1, 44, 45, 46, 47, 48, 49, 50],
[1, 51, 52, 53, 54, 55, 56, 57],
[2, 9, 16, 23, 30, 37, 44, 51],
[2, 10, 17, 24, 31, 38, 45, 52],
[2, 11, 18, 25, 32, 39, 46, 53],
[2, 12, 19, 26, 33, 40, 47, 54],
[2, 13, 20, 27, 34, 41, 48, 55],
[2, 14, 21, 28, 35, 42, 49, 56],
[2, 15, 22, 29, 36, 43, 50, 57],
[3, 9, 17, 25, 33, 41, 49, 57],
[3, 10, 18, 26, 34, 42, 50, 51],
[3, 11, 19, 27, 35, 43, 44, 52],
[3, 12, 20, 28, 36, 37, 45, 53],
[3, 13, 21, 29, 30, 38, 46, 54],
[3, 14, 22, 23, 31, 39, 47, 55],
[3, 15, 16, 24, 32, 40, 48, 56],
[4, 9, 18, 27, 36, 38, 47, 56],
[4, 10, 19, 28, 30, 39, 48, 57],
[4, 11, 20, 29, 31, 40, 49, 51],
[4, 12, 21, 23, 32, 41, 50, 52],
[4, 13, 22, 24, 33, 42, 44, 53],
[4, 14, 16, 25, 34, 43, 45, 54],
[4, 15, 17, 26, 35, 37, 46, 55],
[5, 9, 19, 29, 32, 42, 45, 55],
[5, 10, 20, 23, 33, 43, 46, 56],
[5, 11, 21, 24, 34, 37, 47, 57],
[5, 12, 22, 25, 35, 38, 48, 51],
[5, 13, 16, 26, 36, 39, 49, 52],
[5, 14, 17, 27, 30, 40, 50, 53],
[5, 15, 18, 28, 31, 41, 44, 54],
[6, 9, 20, 24, 35, 39, 50, 54],
[6, 10, 21, 25, 36, 40, 44, 55],
[6, 11, 22, 26, 30, 41, 45, 56],
[6, 12, 16, 27, 31, 42, 46, 57],
[6, 13, 17, 28, 32, 43, 47, 51],
[6, 14, 18, 29, 33, 37, 48, 52],
[6, 15, 19, 23, 34, 38, 49, 53],
[7, 9, 21, 26, 31, 43, 48, 53],
[7, 10, 22, 27, 32, 37, 49, 54],
[7, 11, 16, 28, 33, 38, 50, 55],
[7, 12, 17, 29, 34, 39, 44, 56],
[7, 13, 18, 23, 35, 40, 45, 57],
[7, 14, 19, 24, 36, 41, 46, 51],
[7, 15, 20, 25, 30, 42, 47, 52],
[8, 9, 22, 28, 34, 40, 46, 52],
[8, 10, 16, 29, 35, 41, 47, 53],
[8, 11, 17, 23, 36, 42, 48, 54],
[8, 12, 18, 24, 30, 43, 49, 55],
[8, 13, 19, 25, 31, 37, 50, 56],
[8, 14, 20, 26, 32, 38, 44, 57],
[8, 15, 21, 27, 33, 39, 45, 51]];
const deck = _.shuffle(originalDeck.map(_.shuffle));

const emojiStickers = allEmojis();

function cardToData(card) {
  return {
    "name": "somecard",
    "children": card.map(i => ({"name": emojiStickers[i]})),
  };
}

function drawCard(card, id, where, hidden) {
  var packLayout = d3.pack();
  packLayout.size([300, 300]);

  const rootNode = d3.hierarchy(cardToData(card)).sum(function (d) { return d.name ? 1 : 0; });

  packLayout(rootNode);

  const svg = d3.select(where)
    .append("svg")
    .attr("class", "card" + (hidden ? " hidden" : ""))
    .attr("data-card-id", id)
    .attr("width", 300)
    .attr("height", 300);

  var nodes = svg
    .selectAll("g")
    .data(rootNode.descendants())
    .enter()
    .append("g")
    .attr("class", "sticker")
    .attr("transform", function (d) { return "translate(" + [d.x, d.y] + ")" })

  nodes
    .append("circle")
    .attr("r", function (d) { return d.r; })

  nodes
    .append("text")
    .attr("dy", 18)
    .text(function (d) {
      return d.children === undefined ? d.data.name : "";
    })
  
  return svg;
}

function allEmojis() {
  return _.range(128513, 128591).map(x => String.fromCodePoint(x));
}

function stickerFromCardGroup(g) {
  return g.lastElementChild.innerHTML;
}

let stackCards = [_.head(deck)];
let playerCards = _.tail(deck);

let stackSvgs = [];
let playerSvgs = [];

let playerStickerSelection = null;
let stackStickerSelection = null;

stackSvgs.push(drawCard(stackCards[0], 0, "#stackCards", false));
for (let i = 0; i < playerCards.length; ++i) {
  playerSvgs.push(drawCard(playerCards[i], i+1, "#playerCards", i !== 0));
}

async function tryMatch() {
  const stackSticker = stickerFromCardGroup(stackStickerSelection);
  const playerSticker = stickerFromCardGroup(playerStickerSelection);
  if (stackSticker !== playerSticker) {
    return false;
  }
  stackStickerSelection.classList.remove("selection");
  playerStickerSelection.classList.remove("selection");
  stackStickerSelection = null;
  playerStickerSelection = null;

  try {
    await putCardDown();
    resetHandlers();
    updateCardCount();
  } catch (e) {
    if (e instanceof GameOver) {
      endGame();
      return;
    }
    console.error(e);
  }
  return true;
}

function updateCardCount() {
  d3.select("#remainingCardCount").html(`${playerCards.length}`);
}

class GameOver {}

function promisifyEvent(chain, evt) {
  return new Promise(resolve => chain.on(evt, resolve));
}

function getCirclePosition(selector) {
  var elem = document.querySelector(selector);
  var svg = elem.ownerSVGElement;

  var pt = svg.createSVGPoint();
  pt.x = elem.cx.baseVal.value;
  pt.y = elem.cy.baseVal.value;

  while (true) {
    if (elem.offsetLeft !== undefined) {
      pt.x += elem.offsetLeft;
      pt.y += elem.offsetTop;
    } else {
      var transform = elem.transform.baseVal.consolidate();
      if (transform) {
        pt = pt.matrixTransform(transform.matrix);
      }
    }
    if (elem.parentNode == document.body)
      break;
    elem = elem.parentNode;
  }
  return pt;
}

async function putCardDown() {
  const stackPos = getCirclePosition("#stackCards > svg > g > circle");
  const playerPos = getCirclePosition("#playerCards > svg > g > circle");

  await promisifyEvent(_.head(playerSvgs)
    .transition()
    .attr("transform", () => "translate(" + [stackPos.x-playerPos.x, stackPos.y-playerPos.y] + ")")
    .duration(500)
    .ease(d3.easeExp), "end");
  _.head(playerSvgs).attr("transform", () => "translate(0,0)");
  _.head(stackSvgs).classed("hidden", true);

  stackSvgs = [_.head(playerSvgs), ...stackSvgs];
  stackCards = [_.head(playerCards), ...stackCards];
  playerSvgs = _.tail(playerSvgs);
  playerCards = _.tail(playerCards);

  if (playerCards.length == 0) {
    throw new GameOver();
  }

  d3.select("#playerCards:first-child").remove();
  d3.select("#stackCards").insert(() => _.head(stackSvgs).node());
  _.head(playerSvgs).classed("hidden", false);
}

async function resetHandlers() {
  _.head(stackSvgs)
    .selectAll("g.sticker")
    .on("click", async function () {
      if (stackStickerSelection !== null) {
        stackStickerSelection.classList.toggle("selection");
        if (stackStickerSelection === this) {
          stackStickerSelection = null;
          return;
        }
      }
      stackStickerSelection = this;
      if (playerStickerSelection !== null && await tryMatch()) {
        return;
      }
      this.classList.toggle("selection");
    });

  _.head(playerSvgs)
    .selectAll("g.sticker")
    .on("click", async function () {
      if (playerStickerSelection !== null) {
        playerStickerSelection.classList.toggle("selection");
        if (playerStickerSelection === this) {
          playerStickerSelection = null;
          return;
        }
      }
      playerStickerSelection = this;
      if (stackStickerSelection !== null && await tryMatch()) {
        return;
      }
      this.classList.toggle("selection");
    });
}

const timeTick = setInterval(function() {
  const deltaMs = Date.now() - startTime;
  const secs = deltaMs / 1000;
  const displaySecs = (""+Math.floor(secs % 60)).padStart(2, "0");
  const mins = secs / 60;
  const displayMins = (""+Math.floor(mins % 60)).padStart(2, "0");
  const hours = mins / 60;
  const displayHours = (""+Math.floor(hours % 24)).padStart(2, "0");
  d3.select("#time").html(`${displayHours}:${displayMins}:${displaySecs}`);
}, 1000);

function endGame() {
  d3.select("div#stackCards").remove();
  d3.select("div#playerCards").remove();
  d3.select("div#timer")
    .classed("big", true);
  clearInterval(timeTick);
}

const startTime = Date.now();
resetHandlers();
updateCardCount();