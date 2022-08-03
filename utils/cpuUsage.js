const os = require('os')

module.exports = () => {
    return new Promise(async (resolve) => {
        const startMeasure = cpuAverage()
        setTimeout(async () => {
            const endMeasure = cpuAverage()
            const idleDifference = endMeasure.avgIdle - startMeasure.avgIdle
            const totalDifference = endMeasure.avgTotal - startMeasure.avgTotal
            const cpuPercentage = (10000 - Math.round((10000 * idleDifference) / totalDifference)) / 100

            return resolve(cpuPercentage)
        }, 1000)
    })
}

function cpuAverage() {
    let totalIdle = 0
    let totalTick = 0
    const cpus = os.cpus()

    for (let i = 0; i < cpus.length; i++) {
        for (let type in cpus[i].times) {
            totalTick += cpus[i].times[type]
        }
        totalIdle += cpus[i].times.idle
    }

    return {
        avgIdle: totalIdle / cpus.length,
        avgTotal: totalTick / cpus.length
    }
}
