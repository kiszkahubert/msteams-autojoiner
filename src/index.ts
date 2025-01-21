import { Builder, By, Key, until } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome'

var personalAccount: boolean = false;

async function runSelenium(){
    const driver = await new Builder().forBrowser('chrome').build();
    try{
        await driver.get('https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=5e3ce6c0-2b1f-4285-8d4b-75ee78787346&scope=openId%20profile%20openid%20offline_access&redirect_uri=https%3A%2F%2Fteams.microsoft.com%2Fv2&client-request-id=01948937-8045-74c2-9a59-218750826ddd&response_mode=fragment&response_type=code&x-client-SKU=msal.js.browser&x-client-VER=3.27.0&client_info=1&code_challenge=dNavlv0VmOZCOFtD7iPiWdhxjqICJwavD7h6kpDrl60&code_challenge_method=S256&nonce=01948937-8046-78a9-87af-71201f777aab&state=eyJpZCI6IjAxOTQ4OTM3LTgwNDYtN2U2OS05MzRkLWJjNjZlMTM3ZDBjYyIsIm1ldGEiOnsiaW50ZXJhY3Rpb25UeXBlIjoicmVkaXJlY3QifX0%3D%7Chttps%3A%2F%2Fteams.microsoft.com%2Fv2%2F%3Flm%3Ddeeplink%26lmsrc%3DhomePageWeb%26cmpid%3DWebSignIn%26culture%3Dpl-pl%26country%3Dpl%26enablemcasfort21%3Dtrue');
        const emailInput = await driver.wait(until.elementLocated(By.id('i0116')), 10000);
        await emailInput.sendKeys('xx');
        const submitButton = await driver.wait(until.elementLocated(By.id('idSIButton9')), 10000);
        await submitButton.click();
        const accTypeQuestion = await isElementPresent(driver,'aadTile')
        if(accTypeQuestion){
            // before await for choice from front-end
            if(!personalAccount){
                const aadTile = await driver.wait(until.elementLocated(By.id('aadTile')), 10000);
                console.log("here");
                await aadTile.click();
            } else {
                const msaTile = await driver.wait(until.elementLocated(By.id('msaTile')), 10000);
                console.log("not here");
                await msaTile.click();
            }
        }
        const passwordInput = await driver.wait(until.elementLocated(By.id('i0118')), 10000);
        passwordInput.sendKeys("xx")
        const submitButton2 = await driver.wait(until.elementLocated(By.id('idSIButton9')), 10000);
        await submitButton2.click();
        const rememberMePopOut = await isElementPresent(driver,'idSIButton9')
        if(rememberMePopOut){
            const submitButton3 = await driver.wait(until.elementLocated(By.id('idSIButton9')),1000);
            submitButton3.click();
        }

    } finally{
        await driver.sleep(60000);
        await driver.quit();
    }
}
async function isElementPresent(driver: any, elementId: string) {
    try {
        await driver.sleep(1000);
        await driver.findElement(By.id(elementId));
        console.log("found")
        return true;
    } catch (error: any) {
        console.log("not found")
        if (error.name === 'NoSuchElementError') {
            return false;
        }
    }
}

runSelenium().catch(console.error);
