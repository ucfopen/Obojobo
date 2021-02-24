// This is PM2 ecosystem configuration
// Note that some of these settings can be controlled with env vars
module.exports = {
  apps : [{
    name: "obojobo",
    script: "./index.js",
    exec_mode: "cluster",
    instances: process.env.PM2_APP_INSTANCES || "max",
    max_memory_restart: process.env.PM2_APP_MAX_MEMORY || "200M",
    combine_logs: true
  }]
}
