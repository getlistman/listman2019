module.exports = {
  'listman e2e test' : function (browser) {
    browser
      .url('https://listman.y15e.io')
      .waitForElementVisible('body')
      .click('#signin')
      .waitForElementVisible('input[name="username"]')
      .setValue('input[name="username"]', 'y15e')
      .setValue('input[name="password"]', 'Test!234')
      .click('button.is-primary')
      .waitForElementVisible('table.is-fullwidth')
      .click('table.is-fullwidth a:first-child')
      .waitForElementVisible('div.tabs')
      .click('#signout')
      .waitForElementVisible('figure.image')
      .end();
  }
};
