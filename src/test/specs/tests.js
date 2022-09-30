const assert = require('assert')
const Automator = require('../pageobjects/automator')

describe('The format category selector', () => {
    it('should have the expected options', async () => {
        await Automator.launch()

        const found = await Automator.getFormatCategoryOptions()
        assert.deepEqual(found, ["WaveMotion", "GOAT"])
    });
});3


