import { CardModel } from "./cardModel";
import { Deck } from "./deck";

const SECTIONS = {
  unstarted: 0,
  commander: 1,
  companion: 2,
  deck: 3,
  sideboard: 4,
  about: 5,
};

const _deckRegex = /^deck$/i;
const _sideboardRegex = /^sideboard$/i;
const _commanderRegex = /^commander$/i;
const _companionRegex = /^companion$/i;
const _aboutRegex = /^about$/i;
const _newlineRegex = /\n/g;

export class Decklist extends Deck {
  constructor(rawInput) {
    super();

    let splitData = rawInput.trim().split(_newlineRegex);
    let currentSection = 0;

    try {
      splitData.forEach((line) => {
        line = line.trim();

        if (line.match(_aboutRegex)) {
          console.log("setting SECTIONS.about");
          currentSection = SECTIONS.about;
          return;
        } else if (line.match(_commanderRegex)) {
          currentSection = SECTIONS.commander;
          return;
        } else if (line.match(_companionRegex)) {
          currentSection = SECTIONS.companion;
          return;
        } else if (line.match(_deckRegex)) {
          currentSection = SECTIONS.deck;
          return;
        } else if (
          line.match(_sideboardRegex) ||
          (currentSection === SECTIONS.deck && line.length === 0)
        ) {
          currentSection = SECTIONS.sideboard;
          return;
        } else if (line.length === 0) {
          return;
        }

        switch (currentSection) {
          case SECTIONS.about:
            this.name = line.match(/^name (?<name>.+)$/i)?.groups.name;
            break;
          case SECTIONS.commander:
            this.commander = new CardModel(line);
            break;
          case SECTIONS.companion:
            this.companion = new CardModel(line);
            break;
          case SECTIONS.deck:
            this.deck.push(new CardModel(line));
            break;
          case SECTIONS.sideboard:
            this.sideboard.push(new CardModel(line));
            break;
        }
      });

      this.valid = true;
    } catch (error) {
      this.valid = false;
      console.error(error);
    }
  }
}
