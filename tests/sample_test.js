module.exports = {
	before: function (browser) {
		console.log("Setting up...");
		console.log('Process Version : ' + process.version);
		browser
			.url(browser.launchUrl)
	},

	after: function (browser, done) {
		browser.end(() => {
			console.log("Closing down..."); done();
		})
	},

	beforeEach: function (browser) {
		browser.pause(2000).useCss()
	},

	"Test 1 : Check If Max Health Care URL is accessibles ": function (browser) {
		browser.waitForElementVisible('body', 1000)
			.assert.title('Max Health Care Applications Powered by digital Rig..')
	},
	
}
