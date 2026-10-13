module.exports = {
  apps: [
    {
      name: "hrscript",
      script: "./index.js",
      cron_restart: "0 * * * *", // каждый час
      watch: false,
      // env: {
      //   SERVER_URI: "https://hrapi.pharmlux.uz",
      //   MODE: "SCRIPT"
      // }
    }
  ]
}