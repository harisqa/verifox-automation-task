var assert = require('assert');
var { By, until, Key } = require('selenium-webdriver');

const base_url = 'https://www.verifox.de';
const title_value = 'VERIVOX - die Tarifexperten. Jetzt vergleichen & sparen!';
const calculator_url = base_url + '/internet/';
const jetzt_vergleichen_button = By.xpath(
  '/html/body/div[2]/main/div[2]/section/div[1]/div/div[2]/form/div[2]/button'
);
const ihre_vorwahl_field = By.xpath(
  '/html/body/div[2]/main/div[2]/section/div[1]/div/div[2]/form/div[2]/div[1]/input'
);
const sixteen_mb = By.xpath(
  '/html/body/div[2]/main/div[2]/section/div[1]/div/div[2]/form/div[2]/div[2]/label[1]'
);
const fifty_mb = By.xpath(
  '/html/body/div[2]/main/div[2]/section/div[1]/div/div[2]/form/div[2]/div[2]/label[2]'
);
const hundred_mb = By.xpath(
  '/html/body/div[2]/main/div[2]/section/div[1]/div/div[2]/form/div[2]/div[2]/label[3]'
);
const two_hundred_fifty_mb = By.xpath(
  '/html/body/div[2]/main/div[2]/section/div[1]/div/div[2]/form/div[2]/div[2]/label[4]'
);
const provider = By.className('provider-container');
const tarif_kosten_table_header = By.xpath('//table/tbody/tr[1]/th[1]');
const tarif_details_header = By.tagName('h3');
const gesamtkonsten_value = By.css(
  '.subtab-price-details.three-column-price-details > p:nth-of-type(1) > span:nth-of-type(1)'
);
const price_in_banner = By.css('.summary-tariff-content .price');
const funf_minuten_button = By.css('.summary-tariff-content a');
const funf_minuten_button_alternative = By.css(
  'offer-summary-page-bottom .offer-page-cta.responsive-label-txt'
);
//TODO: Use better selector than full xpath
const price_container = By.className('price-container');
const mehr_zum_tarif_first = By.className(
  'responsive-label-txt resultlist-cta'
);
const weitere_laden_button = By.css(
  '.pagination-area > button'
);
const accept_cookies_button = By.className('gdpr-vx-consent-bar-button');

module.exports = function () {
  this.Given(/^the User is on www.verivox.de$/, function () {
    this.driver.get(base_url);
    //accept cookies to hide banner
    this.driver.findElement(accept_cookies_button).click();
    this.driver.getTitle().then(function (title) {
      assert.equal(title, title_value);
      return title;
    });
  });

  this.When(/^he is on DSL calculator$/, function () {
    return this.driver.get(calculator_url);
  });

  this.When(
    /^he enters prefix\/code Ihre Vorwahl as '(\d+)' with '(\d+)' Mbit\/s bandwidth selection$/,
    function (prefix, tariff_type) {
      var tariff = null;

      switch (tariff_type) {
        case '16':
          tariff = sixteen_mb;
          break;
        case '50':
          tariff = fifty_mb;
          break;
        case '100':
          tariff = hundred_mb;
          break;
        case '250':
          tariff = two_hundred_fifty_mb;
          break;
      }

      this.driver.findElement(ihre_vorwahl_field).sendKeys(prefix);
      return this.driver.findElement(tariff).click();
    }
  );

  this.When(/^clicks on the button labeled as JETZT VERGLEICHEN$/, function () {
    this.driver.findElement(jetzt_vergleichen_button).click();
    //Go to sleep while modal is visible
    return this.driver.sleep(10000);
  });

  this.Then(
    /^he should be able see the Result List page with all the available Tariffs$/,
    function () {
      //check if there are at least 5 price containers loaded
      var price_containers = this.driver
        .findElements(price_container)
        .then(elements => assert.ok(elements.length > 5));
      return price_containers;
    }
  );

  this.When(/^he selects one of the listed Tariffs$/, function () {
    //scroll down for 100 pixels
    this.driver.executeScript('window.scrollBy(0,100)');
  });

  this.When(/^clicks on mehr zum Tarif button$/, function () {
    return this.driver.findElement(mehr_zum_tarif_first).click();
  });

  this.Then(
    /^he should be able see the details of the selected Tariff$/,
    function () {
      this.driver.sleep(5000);
      //check price in banner
      this.driver
        .findElement(price_in_banner)
        .getText()
        .then(function (txt) {
          assert.equal(txt, '25,60 €');
        });
      //check for header name on tariff detail
      this.driver
        .findElement(tarif_details_header)
        .getText()
        .then(function (txt) {
          assert.equal(txt, 'Magenta Zuhause M inkl. MagentaTV & Tablet');
        });

      //check for provider text on tariff detail
      this.driver
        .findElement(provider)
        .getText()
        .then(function (txt) {
          assert.equal(txt, 'von Telekom\n24 Monate Laufzeit');
        });

      //check for tarif costs table header
      this.driver
        .findElement(tarif_kosten_table_header)
        .getText()
        .then(function (txt) {
          assert.equal(txt, 'Tarifkosten');
        });

      //scroll down for 300 pixels
      this.driver.executeScript('window.scrollBy(0,500)');

      //check for gessamtkosten über 24 Monate price
      return this.driver
        .findElement(gesamtkonsten_value)
        .getText()
        .then(function (txt) {
          assert.equal(txt, '614,31 Euro');
        });
    }
  );

  this.Then(
    /^he should also see a button labeled as In 5 Minuten online wechseln$/,
    function () {
      this.driver.findElement(funf_minuten_button);
      return this.driver.findElement(funf_minuten_button_alternative);
    }
  );

  this.Then(/^there are more than '(\d+)' tariffs available$/, function (
    tariffsCount
  ) {
    var price_containers = this.driver
      .findElements(price_container)
      .then(elements => assert.ok(elements.length > tariffsCount));
    return price_containers;
  });

  this.When(/^user scrolls down and clicks on weitere laden button$/, function () {
    this.driver.executeScript('window.scrollBy(0,3000)');
    this.driver.findElement(weitere_laden_button).click();
    return this.driver.sleep(10000);
  });

  this.Then(/^weitere laden button do not exist$/, function () {
    var weitere_laden_buttons = this.driver
      .findElements(weitere_laden_button)
      .then(elements => assert.ok(elements.length == 0));
    return weitere_laden_buttons;
  });

};
