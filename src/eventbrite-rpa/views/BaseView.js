
class BaseView {

    constructor(page) {
        this.page = page;
    }

    async clickXpath(xpathSelector) {
        await this.page.waitForXpath(xpathSelector);
        let elements = await this.page.$x(xpathSelector);
        elements[0].click();
    }

    async clickSelector(cssSelector) {
        await this.page.waitForSelector(cssSelector);
        await this.page.click(cssSelector);
    }

}

export default BaseView;