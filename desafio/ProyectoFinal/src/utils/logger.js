import winston from 'winston'
import config from '../config/config.js'
import __dirname from '../utils.js'

const customeLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: "bgRed",
        error: "red",
        warning: "yellow",
        info: "blue",
        http: "green",
        debug: "grey",
    }
}

const devLog = winston.createLogger({
    levels: customeLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({colors: customeLevelOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: __dirname + "/utils/logs/error.log",
            level: "error",
            format: winston.format.simple()
        })
    ]
}) 

const prodLog = winston.createLogger({
    levels: customeLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize({colors: customeLevelOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: __dirname + "/utils/logs/error.log",
            level: "error",
            format: winston.format.simple()
        })
    ]
})

const logger = config.MODE == "DEV" ? devLog : prodLog

export const addLogger = (req, res, next) => {
    req.logger = logger
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)

    next()
}

export default logger