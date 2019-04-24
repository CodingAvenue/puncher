const puppeteer = require("puppeteer");
const fs = require("fs-extra");

async function startSession() {
  const browser = await puppeteer.launch({
    userDataDir: "./user_data"
  });

  const page = await browser.newPage();
  await page.goto("http://work.codingavenue.com/clock", {
    waitUntil: "networkidle2"
  });

  await page.waitFor("input[name=email_address]");

  await page.$eval(
    "input[name=email_address]",
    el => (el.value = "TYPE_EMAIL_ADDRESS_HERE")
  );

  await page.$eval("input[name=password]", el => (el.value = "TYPE_PASSWORD_HERE"));
  await page.click('input[type="submit"]');
  await page.waitForSelector("a.btn");

  return { page, browser };
}

async function isStatus(status) {
  return text === status;
}

async function cleanup() {
  await fs.remove("./user_data");
}

export const punchin = async () => {
  await cleanup();

  const { page, browser } = await startSession();

  const status = await page.evaluate(
    () => document.querySelector("a.btn").textContent
  );

  if (status !== "Punch In Now") {
    throw new Error("Already punched-in");
  }

  await page.click(".btn-info");
  await page.waitForSelector('input[type="radio"]');

  const element = await page.$(`input[value="illuminateed"]`);
  await element.click();

  await page.click('input[type="submit"]');

  browser.close();
};

export const punchout = async () => {
  await cleanup();

  const { page, browser } = await startSession();

  const status = await page.evaluate(
    () => document.querySelector("a.btn").textContent
  );

  if (status === "Punch In Now") {
    throw new Error("Already punched-out");
  }

  await page.click(".btn-danger");

  browser.close();
};
