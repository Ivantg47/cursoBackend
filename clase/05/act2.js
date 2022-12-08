const moment = require("moment/moment");

const hoy = moment()
console.log(hoy);

const fecha = moment('06/02/1993', 'DD/MM/YYYY')
console.log(fecha);

const dias = hoy.diff(fecha, 'days')

console.log(`Dias vividos: ${dias}`);
