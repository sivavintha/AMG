const winston = require('winston');
const path = require('path');

module.exports = function () {
    winston.add(
        new winston.transports.Console({
            level: "silly",
            handleExceptions: true,
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp(),
                winston.format.simple(),
                winston.format.printf(info => "(" + info.timestamp + ") " + info.level + ": " + JSON.stringify(info.message, null, 2))
            )
        })
    );

    if (process.env.NODE_ENV === "production") {
        winston.add(
            new winston.transports.File({
                filename: path.join(__dirname, '../logs/combined.log'),
                level: "silly"
            })
        );
        winston.add(
            new winston.transports.File({
                filename: path.join(__dirname, '../logs/error.log'),
                level: "error"
            })
        );
        winston.info("PRODUCTION MODE");
    }
};