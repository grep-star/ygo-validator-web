const assert = require('assert')
const Automator = require('../pageobjects/automator')
const WAVE_MOTION = 'WaveMotion'
const GOAT = 'GOAT'
const ALL_CATEGORIES = [WAVE_MOTION, GOAT]

describe('The format category selector', () => {
    it('should have the expected options', async () => {
        await Automator.launch()

        const found = await Automator.getFormatCategoryOptions()
        assert.deepEqual(found, ALL_CATEGORIES)
    })

    it('should display the selected result when clicked', async () => {
        Automator.clickFormatCategory(WAVE_MOTION)
        assert.equal(
            await Automator.readCurrentFormatCategory(),
            WAVE_MOTION
        )
    })
})


