import { initializeApp } from 'firebase-admin/app'
import config from '../../config/config.js';
const db = initializeApp(config.firebaseConfig);
export default db 