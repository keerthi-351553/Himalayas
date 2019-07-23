var seleniumServer = require("selenium-server");
var binPath = seleniumServer.path;

module.exports = {
  "src_folders": ["tests"],
  "output_folder": "reports",
  "custom_commands_path": "",
  "custom_assertions_path": "",
  "page_objects_path": "",
  "globals_path": "",

  "selenium": {
    "start_process": true,
    "server_path": binPath,
    "log_path": "",
    "port": 4444,
    "cli_args": {
      "webdriver.edge.driver": ""
    }
  },

  "test_settings": {
    "default": {
      "launch_url": "http://52.168.175.97:3002/#/",
      "selenium_port": 4444,
      "selenium_host": "localhost",
      "silent": true,
      "screenshots": {
        "enabled": true,
        "path": "./screenshots"
      },
      "globals": {
        "userName": "",
        "password": ""
      },
      "desiredCapabilities": {
        "browserName": "chrome",
        "javascriptEnabled": true,
        "marionette": true,
         "chromeOptions": {
                "args": [
                    "headless", "disable-gpu"
                 ],
                 "binary": "/usr/bin/google-chrome"
              }
      }
    },

    "chrome": {
      "desiredCapabilities": {
        "browserName": "chrome",
        "javascriptEnabled": true,
        "acceptSslCerts": true
      }
    },
    "firefox": {
      "desiredCapabilities": {
        "browserName": "firefox",
        "marionette": true,
        "javascriptEnabled": true
      }
    }
  }
}
