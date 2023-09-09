const { default: puppeteer } = require("puppeteer");

const { writeFile, readFile } = require("fs/promises");

const { load } = require("cheerio");

const main = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      height: 800,
      width: 1500,
    },
  });
  const page = await browser.newPage();
  await page.goto("https://www.jiomart.com");

  await page.waitForTimeout(5000);

  await page.type(
    "#autocomplete-0-input",
    "samsung double door inverter fridge"
  );
  await page.keyboard.press("Enter");
  await page.waitForTimeout(12000);

  const $ = load(await page.content());
  await page.waitForTimeout(12000);

  let productsData = [];

  $("ol>li>a>div[class='plp-card-container']").each((_, el) => {
    const Name = $(
      "div[class='plp-card-details-wrapper'] >div>div[class='plp-card-details-name line-clamp jm-body-xs jm-fc-primary-grey-80']",
      el
    ).text();
    const discntPrice = $(
      "div[class='plp-card-details-wrapper'] >div>div[class='plp-card-details-price-wrapper ']>div>span[class='jm-heading-xxs jm-mb-xxs']",
      el
    ).text();
    const mainPrice = $(
      "div[class='plp-card-details-wrapper'] >div>div[class='plp-card-details-price-wrapper ']>div>span[class='jm-body-xxs jm-fc-primary-grey-60 line-through jm-mb-xxs']",
      el
    ).text();
    const discount = $(
      "div[class='plp-card-details-wrapper'] >div>div[class='plp-card-details-price-wrapper ']>div>span[class='jm-badge']",
      el
    ).text();
    const image = $(
      "div>div[class='plp-card-image-container']>div[class='plp-card-image '] >img",
      el
    ).attr("src");

    productsData.push({
      image,
      Name,
      discntPrice,
      mainPrice,
      discount,
    });
  });

  await writeFile("products.json", JSON.stringify(productsData));

  console.log(productsData);

  await browser.close();
};
main();
