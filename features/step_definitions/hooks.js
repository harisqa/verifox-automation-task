module.exports = function() {

  this.Before(function() {
    //clear cache if needed
    // this.driver.get('chrome://settings/clearBrowserData');
    // this.driver.get('chrome://settings/clearCookies');
    return this.driver.manage().window().maximize() 
  });
    
  this.After(function() {
      return this.driver.quit();
  });

};