import { Builder, By, Key, until, WebDriver } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome'

var personalAccount: boolean = false;
const teamNames: string[] = [];

async function login(driver: WebDriver) {
    try {
        console.log("login begin");
        const emailInput = await driver.wait(until.elementLocated(By.id('i0116')), 10000);
        await emailInput.sendKeys('s99575@pollub.edu.pl');
        const submitButton = await driver.wait(until.elementLocated(By.id('idSIButton9')), 10000);
        await submitButton.click();
        const accTypeQuestion = await isElementPresent(driver, 'aadTile');
        if (accTypeQuestion) {
            if (!personalAccount) {
                const aadTile = await driver.wait(until.elementLocated(By.id('aadTile')), 10000);
                await aadTile.click();
            } else {
                const msaTile = await driver.wait(until.elementLocated(By.id('msaTile')), 10000);
                await msaTile.click();
            }
        }
        const passwordInput = await driver.wait(until.elementLocated(By.id('i0118')), 10000);
        await passwordInput.sendKeys("Paszabicepsg2a.");
        const submitButton2 = await driver.wait(until.elementLocated(By.id('idSIButton9')), 10000);
        await submitButton2.click();
        const rememberMePopOut = await isElementPresent(driver, 'idSIButton9');
        if (rememberMePopOut) {
            const submitButton3 = await driver.wait(until.elementLocated(By.id('idSIButton9')), 1000);
            await submitButton3.click();
        }
        await driver.sleep(2000);
    } catch (error) {
        throw error;
    }
}

async function isElementPresent(driver: WebDriver, elementId: string): Promise<boolean> {
    console.log("is present");
    try {
        await driver.sleep(1000);
        await driver.findElement(By.id(elementId));
        return true;
    } catch (error: any) {
        if (error.name === 'NoSuchElementError') {
            return false;
        }
        throw error;
    }
}

async function runSelenium() {
    const options = new chrome.Options();
    options.addArguments('--headless');
    const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
    try {
        await driver.get('https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=5e3ce6c0-2b1f-4285-8d4b-75ee78787346&scope=openId%20profile%20openid%20offline_access&redirect_uri=https%3A%2F%2Fteams.microsoft.com%2Fv2&client-request-id=01948937-8045-74c2-9a59-218750826ddd&response_mode=fragment&response_type=code&x-client-SKU=msal.js.browser&x-client-VER=3.27.0&client_info=1&code_challenge=dNavlv0VmOZCOFtD7iPiWdhxjqICJwavD7h6kpDrl60&code_challenge_method=S256&nonce=01948937-8046-78a9-87af-71201f777aab&state=eyJpZCI6IjAxOTQ4OTM3LTgwNDYtN2U2OS05MzRkLWJjNjZlMTM3ZDBjYyIsIm1ldGEiOnsiaW50ZXJhY3Rpb25UeXBlIjoicmVkaXJlY3QifX0%3D%7Chttps%3A%2F%2Fteams.microsoft.com%2Fv2%2F%3Flm%3Ddeeplink%26lmsrc%3DhomePageWeb%26cmpid%3DWebSignIn%26culture%3Dpl-pl%26country%3Dpl%26enablemcasfort21%3Dtrue');
        await login(driver);
        const groupsButton = await driver.wait(until.elementLocated(By.id('2a84919f-59d8-4441-a975-2a8c2643b741')), 20000);
        await groupsButton.click();
        await driver.sleep(2000);
        const teams = await driver.findElements(By.css('span[dir="auto"].fui-StyledText'));
        for (let i = 3; i < teams.length; i++) {
            try {
                const name = await teams[i].getText();
                teamNames[i] = name;
            } catch (error) {
                console.log(error)
            }
        }
        console.log("ende");
    } finally {
        await driver.sleep(5000);
        await driver.quit();
    }
}

const [,, email, password] = process.argv;
runSelenium().catch(console.error);