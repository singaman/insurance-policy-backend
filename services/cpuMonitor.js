const os = require('os');
const { CPU_THRESHOLD, CPU_CHECK_INTERVAL } = require('../config/constants');

class CPUMonitor {
    constructor(threshold = CPU_THRESHOLD, checkInterval = CPU_CHECK_INTERVAL) {
        this.threshold = threshold;
        this.checkInterval = checkInterval;
        this.monitorInterval = null;
    }

    getCPUUsage() {
        const cpus = os.cpus();
        let totalIdle = 0;
        let totalTick = 0;

        cpus.forEach(cpu => {
            for (let type in cpu.times) {
                totalTick += cpu.times[type];
            }
            totalIdle += cpu.times.idle;
        });

        return {
            idle: totalIdle / cpus.length,
            total: totalTick / cpus.length,
            usage: ((1 - totalIdle / totalTick) * 100).toFixed(2)
        };
    }

    checkCPU() {
        const usage = this.getCPUUsage();
        const usagePercent = parseFloat(usage.usage);

        console.log(`📊 CPU Usage: ${usagePercent}% | Threshold: ${this.threshold}%`);

        if (usagePercent > this.threshold) {
            console.warn(`🚨 HIGH CPU ALERT: ${usagePercent}% exceeds threshold of ${this.threshold}% - Restarting server...`);
            this.restartServer();
        }
    }

    restartServer() {
        console.log('🔁 Initiating server restart...');
        
        // Graceful shutdown
        setTimeout(() => {
            console.log('💥 Server exiting with code 1 (process manager will restart)');
            process.exit(1);
        }, 1000);
    }

    start() {
        console.log(`🔍 Starting CPU monitoring (Threshold: ${this.threshold}%, Check interval: ${this.checkInterval}ms)`);
        
        this.monitorInterval = setInterval(() => {
            this.checkCPU();
        }, this.checkInterval);

        // Also check on startup
        this.checkCPU();
    }

    stop() {
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
            console.log('🛑 CPU monitoring stopped');
        }
    }
}

module.exports = new CPUMonitor();