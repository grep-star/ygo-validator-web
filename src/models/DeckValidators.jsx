import { buildHistoricalCardList } from "./Cards"
import { ValidationResult } from "./ValidationResult"

const MAIN_DECK_MIN = 40
const MAIN_DECK_MAX = 60
const SIDE_DECK_MAX = 15
const EXTRA_DECK_MAX = 15

function generalDeckValidation(decklist) {
    const errors = []
    const mainSize = decklist.main.length
    if (mainSize < MAIN_DECK_MIN || mainSize > MAIN_DECK_MAX) {
        errors.push(`Main deck size of ${mainSize} is outside of the allowed range of ${MAIN_DECK_MIN} to ${MAIN_DECK_MAX} cards`)
    }
    if (decklist.side.length > SIDE_DECK_MAX) {
        errors.push(`Side deck can have a maximum of ${SIDE_DECK_MAX} cards`)
    }
    if (decklist.extra.length > EXTRA_DECK_MAX) {
        errors.push(`Extra deck can have a maximum of ${EXTRA_DECK_MAX} cards`)
    }
    return errors
}

class EnumeratedCardValidator {
    constructor(cardMap, traditional = false) {
        this.cardMap = cardMap
        this.traditional = traditional
    }

    validate(decklist) {
        const validationErrors = generalDeckValidation(decklist)
        for (const [card, numAttempted] of decklist.combineAndMap().entries()) {
            const allowed = this.getNumAllowed(card)
            if (numAttempted > allowed) {
                validationErrors.push(`"${card.name}": allowed: ${allowed}, attempted: ${numAttempted}`)
            }
        }
        return new ValidationResult(
            validationErrors.length == 0,
            validationErrors
        )
    }

    getNumAllowed(card) {
        if (this.traditional) {
            return this.cardMap.has(card) ? Math.max(this.cardMap.get(card), 1) : 0
        } else {
            return this.cardMap.get(card) || 0
        }
    }
}

class HistoricalFormatValidator {
    constructor(historicalFormatSpec, traditional = false) {
        this.historicalFormatSpec = historicalFormatSpec
        const cardMap = new Map()
        buildHistoricalCardList(historicalFormatSpec.lastSet).forEach(card => {
            let numAllowed = 3
            if (historicalFormatSpec.forbidden.includes(card.name)) {
                numAllowed = 0
            } else if (historicalFormatSpec.limited.includes(card.name)) {
                numAllowed = 1
            } else if (historicalFormatSpec.semiLimited.includes(card.name)) {
                numAllowed = 2
            }
            cardMap.set(card, numAllowed)
        })
        this.cardMap = cardMap
        this.traditional = traditional
    }

    validate(decklist) {
        return new EnumeratedCardValidator(this.cardMap, this.traditional).validate(decklist)
    }
}

export { EnumeratedCardValidator, HistoricalFormatValidator }