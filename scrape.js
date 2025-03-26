const puppeteer = require("puppeteer");
const fs = require("fs");
const json2csv = require("json2csv").Parser;

const url = "https://www.scrapingcourse.com/button-click";

const scrapeFunction = async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to the target URL
  await page.goto(url);

  //   Click the "Load More" button a fixed number of times
  for (let i = 0; i < 5; i++) {
    // Click the "Load More" button
    await page.click("button#load-more-btn");
  }

  // wait for the 48th product card
  await page.waitForSelector(".product-grid .product-item:nth-child(48)");

  // extract product information and return an array of products
  const products = await page.evaluate(() => {
    const productList = [];
    productElements = document.querySelectorAll(".product-grid .product-item");

    // loop through each product to extract the data
    productElements.forEach((product) => {
      const name = product.querySelector("div span.product-name").textContent;
      const imageLink = product
        .querySelector("img.product-image")
        .getAttribute("src");
      const price = product.querySelector("div span.product-price").textContent;
      const url = product.querySelector("a").getAttribute("href");

      // push the extracted data to the array created
      productList.push({ name, imageLink, price, url });
    });

    return productList;
  });

  console.log(products);

  // create a new JSON file and parse all the data to the file
  fs.writeFileSync("products.json", JSON.stringify(products, null, 2));

  const parser = new json2csv();
  const productsCSV = parser.parse(products);
  fs.writeFileSync("products.csv", productsCSV);

  console.log("Data saved to products.csv");

  // Close the browser and all of its pages
  await browser.close();
};

scrapeFunction();
