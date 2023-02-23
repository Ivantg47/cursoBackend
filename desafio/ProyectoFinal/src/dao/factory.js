import credentials from "../config/credentials.js";

export let Data

switch (credentials.PERCISTRENCE) {

    case 'MONGO':
        console.log('Mongo connect');
        mongoose.set('strictQuery', false)
        mongoose.connect(credentials.MONGO_URL, {dbname: credentials.BD_NAME},  error => {
            if (error) {
                console.error('No connect', error);
                process.exit()
            }
        })
        
        break;

    case 'FILE':
        console.log('File percistance');
        break;
    default:
        console.log('Memory percistance');
        break;
}