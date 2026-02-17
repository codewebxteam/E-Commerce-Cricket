import fs from 'fs';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";

// Manual .env parser
const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=');
    if (key && value) env[key.trim()] = value.trim();
});

const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
    console.log('Searching for admin users...');

    const q = query(collection(db, "users"), where("role", "==", "admin"));
    const snap = await getDocs(q);

    if (snap.empty) {
        console.log('No admin users found.');
    } else {
        console.log(`Found ${snap.size} admin user(s):`);
        snap.forEach(doc => {
            console.log(`- Email: ${doc.data().email}, UID: ${doc.id}`);
        });
    }

    process.exit(0);
}

run().catch(err => {
    console.log('Error:', err.message);
    process.exit(1);
});
