import 'dotenv/config';

// Lancer : npx tsx playground/exemple.ts
// Copiez ce fichier, renommez-le, et écrivez votre exemple dedans.

console.log('Le playground fonctionne.');
console.log('JWT_SECRET est', process.env.JWT_SECRET ? 'lu depuis .env' : 'absent : cp .env.example .env');
