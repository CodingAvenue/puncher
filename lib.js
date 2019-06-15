const puppeteer = require("puppeteer");
const fs = require("fs-extra");

const { EMAIL_ADDRESS, PASSWORD } = process.env;

async function startSession() {
  const browser = await puppeteer.launch({
    userDataDir: "./user_data"
  });

  const page = await browser.newPage();
  await page.goto("http://work.codingavenue.com/clock", {
    waitUntil: "networkidle2"
  });

  await page.waitFor("input[name=email_address]");

  // TODO: env variable not working inside $eval
  await page.$eval(
    "input[name=email_address]",
    el => (el.value = EMAIL_ADDRESS)
  );

  await page.$eval("input[name=password]", el => (el.value = PASSWORD));
  await page.click('input[type="submit"]');
  await page.waitForSelector("a.btn");

  return { page, browser };
}

async function cleanup() {
  await fs.remove("./user_data");
}

// TODO: Return boolean instead of throwing error to prevent zombies

const punchin = async () => {
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

const ispunchedin = async () => {
  await cleanup();

  const { page, browser } = await startSession();

  const status = await page.evaluate(
    () => document.querySelector("a.btn").textContent
  );

  isPunchedIn = status !== "Punch In Now";

  browser.close();

  return isPunchedIn;
};

const punchout = async () => {
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

module.exports = { punchin, punchout, ispunchedin };
