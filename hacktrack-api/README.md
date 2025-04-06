# HackTrack API

HackTrack est une API pour gérer des hackathons et les équipes qui y participent.
Elle est construite avec **Express.js**, **Prisma ORM**, **SQLite** et **l'authentification JWT**.

## Fonctionnalités

- Authentification des utilisateurs (inscription, connexion, authentification basée sur JWT)
- Gestion des hackathons (liste, détails, inscription)
- Gestion des équipes (création, rejoindre)
- Documentation de l'API avec Redoc

## Installation

### Prérequis

- Node.js (v18 ou supérieur)
- npm (Node Package Manager)

### Étapes

1. Clonez le dépôt :
   ```bash
   git clone <repository-url>
   cd hacktrack-api
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez les variables d'environnement :
   Créez un fichier `.env` à la racine du projet et ajoutez les informations suivantes :
   ```
   JWT_SECRET=your_jwt_secret
   ```

4. Initialisez la base de données :
   Générez le client Prisma et appliquez les migrations :
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. Chargez les données d'exemple dans la base de données :
   ```bash
   npm run seed
   ```

## Démarrer l'API

Démarrez le serveur Express :
```bash
npm start
```

L'API sera disponible à l'adresse `http://localhost:3002`.

## Documentation de l'API

Accédez à la documentation de l'API à l'adresse suivante :
```
http://localhost:3002/docs
```

## Développement

Pour le développement, vous pouvez utiliser `nodemon` pour redémarrer automatiquement le serveur en cas de modification des fichiers :
```bash
npx nodemon src/server.js
```

## Structure du projet

```
hacktrack-api/
├── prisma/                 # Schéma Prisma et fichier de seed
│   ├── schema.prisma       # Schéma de la base de données
│   ├── seed.js             # Script de seed pour les données d'exemple
├── src/                    # Code source
│   ├── routes/             # Gestionnaires de routes de l'API
│   ├── server.js           # Point d'entrée de l'API
├── package.json            # Configuration du projet et dépendances
├── README.md               # Documentation du projet
```

## Dépendances

- **Express.js** : Framework web pour construire l'API
- **Prisma ORM** : ORM pour SQLite
- **SQLite** : Base de données
- **JWT** : Authentification
- **Zod** : Validation des requêtes
- **Redoc** : Documentation de l'API

## Licence

Ce projet est sous licence MIT.
