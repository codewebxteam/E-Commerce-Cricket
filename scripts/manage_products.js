import fs from 'fs';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc, addDoc, serverTimestamp } from "firebase/firestore";

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
    console.log('Starting product management...');

    // 1. Delete all products
    const snap = await getDocs(collection(db, "products"));
    console.log(`Found ${snap.size} products to delete.`);
    for (const item of snap.docs) {
        try {
            await deleteDoc(doc(db, "products", item.id));
            console.log(`Deleted product: ${item.id}`);
        } catch (e) {
            console.error(`Failed to delete ${item.id}:`, e.message);
        }
    }

    // 2. Add new products
    const newProducts = [
        {
            name: "SS Platinum English Willow Bat",
            subtitle: "Elite Players Edition",
            description: "Elite grade 1+ English Willow, used by top internationals. Perfectly balanced for explosive power.",
            manufacturer: "SS Cricket, India",
            price: 45000,
            mrp: 52000,
            discount: 13,
            category: "Cricket Bats",
            images: ["https://ik.imagekit.io/vmzc9m9fg/ss_platinum.jpg"],
            stock: 5,
            rating: 4.8,
            reviewsCount: 12,
            highlights: ["Hand-crafted in India", "Ultra-premium finish", "Grade 1+ Willow"],
            specs: { "Weight": "1160g", "Grains": "9-11", "Handle": "Round" },
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        },
        {
            name: "SG Test White Cricket Ball",
            subtitle: "The Standard of Test Cricket",
            description: "Official test match ball, superior seam shape and retention. Ideal for longevity and swing.",
            manufacturer: "SG Cricket, India",
            price: 1800,
            mrp: 2200,
            discount: 18,
            category: "Cricket Balls",
            images: ["https://ik.imagekit.io/vmzc9m9fg/sg_test_white.jpg"],
            stock: 24,
            rating: 4.5,
            reviewsCount: 45,
            highlights: ["Hand-stitched", "MCC Approved", "4-Piece Construction"],
            specs: { "Material": "Alum tanned leather", "Color": "White" },
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        },
        {
            name: "Adidas 22YDS Spike Shoes",
            subtitle: "Speed on the Pitch",
            description: "High-performance spikes for maximum traction and speed. Lightweight design for all-day comfort.",
            manufacturer: "Adidas India",
            price: 8500,
            mrp: 9999,
            discount: 15,
            category: "Shoes",
            images: ["https://ik.imagekit.io/vmzc9m9fg/adidas_spikes.jpg"],
            stock: 10,
            rating: 4.2,
            reviewsCount: 18,
            highlights: ["Adiwear outsole", "Breathable mesh", "TPU cage for stability"],
            specs: { "Sole": "TPU with spikes", "Color": "White/Blue" },
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        }
    ];

    for (const p of newProducts) {
        try {
            const docRef = await addDoc(collection(db, "products"), p);
            console.log(`Added product: ${p.name} (${docRef.id})`);
        } catch (e) {
            console.error(`Failed to add ${p.name}:`, e.message);
        }
    }

    console.log('All done!');
    process.exit(0);
}

run().catch(err => {
    console.log('Error:', err.message);
    process.exit(1);
});
