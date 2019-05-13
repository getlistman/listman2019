module.exports = {
  'listman e2e test' : function (browser) {
    browser
      .url('https://listman.y15e.io')
      .waitForElementVisible('body')
      .click('a[href="/signin"]')
      .waitForElementVisible('input[name="username"]')
      .setValue('input[name="username"]', 'y15e')
      .setValue('input[name="password"]', 'Test!234')
      .click('button.is-primary')
      .waitForElementVisible('table.is-fullwidth')
      .end();
  }
};
