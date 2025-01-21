"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const selenium_webdriver_1 = require("selenium-webdriver");
var personalAccount = false;
function runSelenium() {
    return __awaiter(this, void 0, void 0, function* () {
        const driver = yield new selenium_webdriver_1.Builder().forBrowser('chrome').build();
        try {
            yield driver.get('https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=5e3ce6c0-2b1f-4285-8d4b-75ee78787346&scope=openId%20profile%20openid%20offline_access&redirect_uri=https%3A%2F%2Fteams.microsoft.com%2Fv2&client-request-id=01948937-8045-74c2-9a59-218750826ddd&response_mode=fragment&response_type=code&x-client-SKU=msal.js.browser&x-client-VER=3.27.0&client_info=1&code_challenge=dNavlv0VmOZCOFtD7iPiWdhxjqICJwavD7h6kpDrl60&code_challenge_method=S256&nonce=01948937-8046-78a9-87af-71201f777aab&state=eyJpZCI6IjAxOTQ4OTM3LTgwNDYtN2U2OS05MzRkLWJjNjZlMTM3ZDBjYyIsIm1ldGEiOnsiaW50ZXJhY3Rpb25UeXBlIjoicmVkaXJlY3QifX0%3D%7Chttps%3A%2F%2Fteams.microsoft.com%2Fv2%2F%3Flm%3Ddeeplink%26lmsrc%3DhomePageWeb%26cmpid%3DWebSignIn%26culture%3Dpl-pl%26country%3Dpl%26enablemcasfort21%3Dtrue');
            const emailInput = yield driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.id('i0116')), 10000);
            yield emailInput.sendKeys('s99575@pollub.edu.pl');
            const submitButton = yield driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.id('idSIButton9')), 10000);
            yield submitButton.click();
            const accTypeQuestion = yield isElementPresent(driver, 'aadTile');
            if (accTypeQuestion) {
                // before await for choice from front-end
                if (!personalAccount) {
                    const aadTile = yield driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.id('aadTile')), 10000);
                    console.log("here");
                    yield aadTile.click();
                }
                else {
                    const msaTile = yield driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.id('msaTile')), 10000);
                    console.log("not here");
                    yield msaTile.click();
                }
            }
            const passwordInput = yield driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.id('i0118')), 10000);
            passwordInput.sendKeys("Paszabicepsg2a.");
            const submitButton2 = yield driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.id('idSIButton9')), 10000);
            yield submitButton2.click();
            const rememberMePopOut = yield isElementPresent(driver, 'idSIButton9');
            if (rememberMePopOut) {
                const submitButton3 = yield driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.id('idSIButton9')), 1000);
                submitButton3.click();
            }
        }
        finally {
            yield driver.sleep(60000);
            yield driver.quit();
        }
    });
}
function isElementPresent(driver, elementId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield driver.sleep(1000);
            yield driver.findElement(selenium_webdriver_1.By.id(elementId));
            console.log("found");
            return true;
        }
        catch (error) {
            console.log("not found");
            if (error.name === 'NoSuchElementError') {
                return false;
            }
        }
    });
}
runSelenium().catch(console.error);
