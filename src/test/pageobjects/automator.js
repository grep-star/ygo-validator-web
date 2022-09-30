const FORMAT_CATEGORY = 'format-category'

class Automator {
    launch () {
        return browser.url('http://127.0.0.1:5173')
    }

    get formatCategory () {
        return $(`#${FORMAT_CATEGORY}`)
    }

    async getFormatCategoryOptions () {
        await this.formatCategory.$('.//*[contains(@class, "IndicatorsContainer")]').click()
        return await this.formatCategory.$$(".//*[contains(@id, 'option')]").map(element => element.getText())
    }
}

module.exports = new Automator()
