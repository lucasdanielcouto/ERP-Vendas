const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "7aivun",
  e2e: {
  
    deafultCommandTimeout: 5000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

