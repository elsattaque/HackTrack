# Elsa Letellier ESGI2
# HackTrack - Plateforme de Gestion de Hackathons

HackTrack est une application web permettant de gérer des hackathons, de créer des équipes et de participer à des événements.

## Prérequis

- [Node.js](https://nodejs.org/) (version 16 ou supérieure)
- [npm](https://www.npmjs.com/) (généralement installé avec Node.js)

## Installation

Pour installer et lancer le projet, suivez ces étapes :

### 1. Cloner le projet

```bash
git clone https://github.com/elsattaque/HackTrack.git
cd FinalHackTrack
```

### 2. Installer les dépendances

#### Backend (API)

```bash
cd hacktrack-api
npm install
```

#### Frontend (Client)

```bash
cd hacktrack-client
npm install
```

### 3. Lancer le projet

#### Backend (API)

```bash
cd hacktrack-api
npm run dev
```

Le serveur backend sera accessible à l'adresse : http://localhost:3002

#### Frontend (Client)

Dans un nouveau terminal :

```bash
cd hacktrack-client
npm run dev
```

L'application frontend sera accessible à l'adresse : http://localhost:5173

## Fonctionnalités

- Authentification (inscription, connexion, déconnexion)
- Consultation des hackathons (en cours, à venir, passés)
- Création d'équipes pour les hackathons
- Rejoindre des équipes existantes
- Pagination des listes de hackathons

## Structure du Projet

### Frontend (Client)

- `/src/pages` : Composants de pages principales
- `/src/components` : Composants réutilisables
- `/src/contexts` : Contextes React (AuthContext)
- `/src/services` : Services pour les appels API

## Technologies Utilisées

### Frontend
- React
- React Router
- Zod (validation de formulaires)
- React Hook Form
