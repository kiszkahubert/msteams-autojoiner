import { Builder, By, Key, until } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome'

async function runSelenium(){
    const driver = await new Builder().forBrowser('chrome').build();
    try{
        await driver.get('https://www.google.com');
    } finally{
        await driver.quit();
    }
}

runSelenium().catch(console.error);
