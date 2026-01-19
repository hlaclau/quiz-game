# Quiz Game 

Application de quiz full-stack moderne avec une architecture propre (DDD).

## Aperçu

Quiz Game permet de créer et jouer à des quiz sur différents thèmes. L'application propose :

- Authentification via SSO Discord 
- Création de questions avec 4 réponses possibles
- Organisation par thèmes et niveaux de difficulté
- Interface responsive et moderne
- Dashboard admin pour valider et modifier des questions


## Prérequis

- [Bun](https://bun.sh/) >= 1.2
- [PostgreSQL](https://www.postgresql.org/) >= 14
- [Docker](https://www.docker.com/) (optionnel, pour le développement avec Docker)

## Installation

```bash
# Cloner le dépôt
git clone git@github.com:hlaclau/quiz-game.git
cd quiz-game

# Installer les dépendances
bun install

# Configurer les variables d'environement web et serveur (reprendre les .env.exemple)
# Appliquer le schéma de base de données
bun run db:push
```

## Lancement

```bash
# Développement (web + serveur)
bun run dev

# Ou séparément
bun run dev:web      # Frontend → http://localhost:3001
bun run dev:server   # API → http://localhost:3000
```

📚 Documentation OPENAPI disponible sur `http://localhost:3000/docs`

## Développement avec Docker

### Prérequis Docker

- Docker et Docker Compose installés

### Lancement avec Docker Compose

```bash
# Lancer tous les services (PostgreSQL + Server + Web)
docker-compose up

# Lancer en arrière-plan
docker-compose up -d

# Arrêter les services
docker-compose down

# Voir les logs
docker-compose logs -f

# Reconstruire les images
docker-compose build
```

Les services seront disponibles sur :
- **Frontend** → http://localhost:3001
- **API** → http://localhost:3000
- **PostgreSQL** → localhost:5432

### Configuration des variables d'environnement

Créez un fichier `.env` à la racine ou configurez les variables dans `docker-compose.yml` :
- `DISCORD_CLIENT_ID` : ID client Discord OAuth
- `DISCORD_CLIENT_SECRET` : Secret client Discord OAuth
- `CORS_ORIGIN` : Origine CORS autorisée (par défaut: http://localhost:3001)

### Base de données

La base de données PostgreSQL est automatiquement créée dans un volume Docker. Pour réinitialiser :

```bash
docker-compose down -v  # Supprime les volumes
docker-compose up       # Recrée tout
```

### Production

Pour la production, utilisez `docker-compose.prod.yml` :

```bash
docker-compose -f docker-compose.prod.yml up -d
```

Assurez-vous de configurer toutes les variables d'environnement nécessaires dans un fichier `.env` ou via les variables d'environnement du système.

## Stack Technique

| Couche | Technologies |
|--------|-------------|
| **Frontend** | React 19, TypeScript, TanStack Router/Start, TailwindCSS v4, shadcn/ui |
| **Backend** | Elysia, Bun, TypeScript |
| **Base de données** | PostgreSQL, Drizzle ORM |
| **Authentification** | Better-Auth (Discord OAuth) |
| **Qualité** | Biome (format et linting), Husky (pre-commit hooks), Turborepo, GitHub Actions (lancements des tests et linter lors des pull requests) |

## Architecture

### Structure du Monorepo

```
quiz-game/
├── apps/
│   ├── web/        → Frontend React (TanStack Start)
│   └── server/     → API Elysia (DDD)
├── packages/
│   ├── auth/       → Configuration Better-Auth
│   ├── db/         → Schéma Drizzle ORM
│   └── config/     → Config TypeScript partagée
```

### Architecture de l'API (DDD)

L'API suit les principes du **Domain-Driven Design** avec une séparation stricte des couches :

```
apps/server/src/
├── domain/           → Logique métier pure (aucune dépendance externe)
│   ├── entities/     → Question, Answer, Theme, Difficulty
│   ├── interfaces/   → Contrats des repositories
│   ├── services/     → Services de validation et scoring
│   ├── value-objects/→ Objets valeur immuables
│   └── errors/       → Erreurs métier
│
├── application/      → Orchestration des cas d'usage
│   ├── use-cases/    → Un dossier par fonctionnalité
│   └── dtos/         → Objets de transfert de données
│
├── infrastructure/   → Implémentations concrètes
│   ├── repositories/ → Repositories Drizzle
│   └── container.ts  → Injection de dépendances
│
└── presentation/     → Routes HTTP Elysia
    ├── *.routes.ts   → Points d'entrée REST
    └── middleware/   → Middleware d'authentification
```

### Règle des Dépendances

Les dépendances pointent toujours vers l'intérieur :

```
presentation → application → domain ← infrastructure
```

- **Domain** : Zéro dépendance externe, logique métier pure
- **Application** : Dépend uniquement des interfaces du domain
- **Infrastructure** : Implémente les interfaces, utilise le package DB (Drizzle)
- **Presentation** : Relie la couche application aux endpoints de l'API

## Patrons de Conception

### Use-Case Pattern

Chaque opération métier est encapsulée dans un use-case :

```typescript
// application/use-cases/create-question/create-question.use-case.ts
export class CreateQuestionUseCase {
  constructor(private readonly questionRepository: IQuestionRepository) {}

  async execute(input: CreateQuestionInput): Promise<CreateQuestionOutput> {
    Question.validateAnswersCount(input.answers.length);
    const question = await this.questionRepository.create(input);
    return { data: toDTO(question) };
  }
}
```

### Repository Pattern

L'accès aux données passe par des interfaces :

```typescript
// domain/interfaces/question-repository.interface.ts
export interface IQuestionRepository {
  create(input: CreateQuestionInput): Promise<Question>;
  findById(id: string): Promise<Question | null>;
  findAll(): Promise<Question[]>;
}

// infrastructure/repositories/question.repository.ts
export class DrizzleQuestionRepository implements IQuestionRepository {
  // Implémentation avec Drizzle ORM
}
```

### Injection de Dépendances

Les use-cases reçoivent leurs dépendances via le conteneur :

```typescript
// infrastructure/container.ts
export const useCases = {
  createQuestion: new CreateQuestionUseCase(repositories.question),
  getThemes: new GetThemesUseCase(repositories.theme),
};

// presentation/question.routes.ts
export const createQuestionRoutes = (useCase: CreateQuestionUseCase) => {
  return new Elysia({ prefix: "/api/questions" })
    .post("/", async ({ body }) => useCase.execute(body));
};
```

## Scripts Disponibles

| Commande | Description |
|----------|-------------|
| `bun run dev` | Lance web + serveur |
| `bun run dev:web` | Lance le frontend (port 3001) |
| `bun run dev:server` | Lance l'API (port 3000) |
| `bun run build` | Build de production |
| `bun run check` | Lint et format (Biome) |
| `bun run check-types` | Vérification TypeScript |
| `bun run db:push` | Applique le schéma DB |
| `bun run db:studio` | Ouvre Drizzle Studio |
| `bun run db:generate` | Génère les migrations |
| `bun run db:migrate` | Exécute les migrations |

## Contribuer

### Workflow

1. Créer une branche depuis `dev`
2. Développer la fonctionnalité
3. S'assurer que les checks passent : `bun run check`
4. Lancer les tests : `bun test` (dans `apps/server`)
5. Créer une PR vers `dev`

### Ajouter une Fonctionnalité (Backend)

1. **Domain** → Définir l'entité et l'interface du repository
2. **Application** → Créer le use-case dans son dossier dédié
3. **Infrastructure** → Implémenter le repository avec Drizzle
4. **Container** → Enregistrer le use-case avec ses dépendances
5. **Presentation** → Ajouter les routes qui délèguent au use-case

### Conventions

- **Biome** gère le formatage et le linting
- **Interfaces** préfixées par `I` (ex: `IQuestionRepository`)
- **Routes API** préfixées par `/api/`
- **Commits** : conventionnal commits
