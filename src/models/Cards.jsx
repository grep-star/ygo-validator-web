import { FUSION, SYNCHRO, XYZ, PENDULUM, LINK, RITUAL, SPELL, TRAP, EFFECT, NORMAL } from '../Constants'
import cardsJson from '../specs/cards.json'
import cardSets from '../specs/card_sets.json'

class Card {
    constructor(ids, name, cardSets, type) {
        this.ids = ids
        this.name = name
        this.cardSets = cardSets
        this.type = type
    }

    mapToDomClass() {
        const foundType = [FUSION, SYNCHRO, XYZ, LINK, RITUAL, SPELL, TRAP, PENDULUM, EFFECT, NORMAL].find(cardClass => (
            this.type.toLowerCase().includes(cardClass)
        ))
        return 'card-' + (foundType ? foundType : EFFECT)
    }
}

class Decklist {
    constructor(main, extra, side) {
        this.main = main
        this.extra = extra
        this.side = side
    }

    combine() {
        return this.main.concat(this.extra, this.side)
    }

    combineAndMap() {
        const map = new Map()
        this.combine().forEach(element => {
            map.set(element, 1 + (map.get(element) || 0))
        })
        return map
    }

    static parseFromFile(contents) {
        const asArr = contents.split(/\r?\n/).filter(x => x)
        const mainMarker = '#main'
        const extraMarker = '#extra'
        const sideMarker = '!side'

        const mainDeckIds = asArr.slice(asArr.indexOf(mainMarker) + 1, asArr.indexOf(extraMarker))
        const extraDeckIds = asArr.slice(asArr.indexOf(extraMarker) + 1, asArr.indexOf(sideMarker))
        const sideDeckIds = asArr.slice(asArr.indexOf(sideMarker) + 1)

        return(
            new Decklist(
                this.mapIdsToCards(mainDeckIds),
                this.mapIdsToCards(extraDeckIds),
                this.mapIdsToCards(sideDeckIds)
            )
        )
    }

    static mapIdsToCards(ids) {
        return(ids.map(id => (
            allKnownCards.find(card => card.ids.includes(parseInt(id)))
        )))
    }
}

const allKnownCards = cacheCards()

function cacheCards() {
    console.log('Caching list of known cards...')
    return(cardsJson.map(cardJson => (
        new Card(
            cardJson.ids,
            cardJson.name,
            cardJson.card_sets,
            cardJson.type
        )
    )))
}

function identifyCardsInSet(setName) {
    return(
        allKnownCards.filter(card => (
            card.cardSets && card.cardSets.includes(setName)
        ))
    )
}

function buildHistoricalCardList(lastSetName) {
    const lastDate = cardSets.find(set => (
        set.set_name === lastSetName
    )).tcg_date
    const permittedSets = cardSets.filter(set => (
        set.tcg_date <= lastDate
    )).map(set => set.set_name)
    return allKnownCards.filter(card => (
        card.cardSets && card.cardSets.find(possibleSet => (
            permittedSets.includes(possibleSet)
        )) != null
    ))
}

function lookupCardByName(cardName) {
    return allKnownCards.find(card => card.name === cardName)
}

function sortSetsOnDate(sets) {
    return sets.sort((a, b) => (a.tcg_date < b.tcg_date) ? -1 : (a.tcg_date > b.tcg_date) ? 1 : 0)
}

export { Decklist, identifyCardsInSet, buildHistoricalCardList, lookupCardByName, sortSetsOnDate }