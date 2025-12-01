# TP Docker — Gestion de Contacts

**Statut :** Prototype Docker multi-conteneurs

---

## Objectif
Déployer une application «gestion de contacts» en deux conteneurs (frontend + base de données) et fournir un ensemble reproductible pour tester localement.

---

## Structure du dépôt
```
tp-docker-contacts/
├── frontend/
│   ├── Dockerfile
│   ├── server.js
│   ├── package.json
│   └── public/
│       ├── index.html
│       ├── app.js
│       └── style.css
├── database/
│   ├── Dockerfile
│   └── init.sql
├── docker-compose.yml
├── commandes.txt
└── screenshots/
    ├── 1_homepage.png
    ├── 2_add_contact.png
    └── 3_docker_ps.png
```

---

## Aperçu (screenshots)
Placez vos captures d'écran dans le dossier `screenshots/` et gardez ces noms pour que les références soient cohérentes :

- `screenshots/1_homepage.png` — page d'accueil (formulaire + liste)
- `screenshots/2_add_contact.png` — aperçu après ajout d'un contact
- `screenshots/3_docker_ps.png` — sortie de `docker ps`

> Les images sont actuellement des placeholders — remplacez-les avant publication.

---

## Installation (rapide)
Prérequis : Docker et Docker Compose installés.

1. Cloner le dépôt :
```bash
git clone <url-du-repo>
cd tp-docker-contacts
```
2. Lancer avec Docker Compose :
```bash
docker-compose up --build
```
3. Ouvrir l'application :

Visitez `http://localhost:3000`.

---

## Commandes utiles

- Build manuel des images :
```bash
docker build -t contacts-db:1.0 ./database
docker build -t contacts-frontend:1.0 ./frontend
```
- Création réseau (si nécessaire) :
```bash
docker network create contacts-network
```
- Lancer DB (exemple) :
```bash
docker run -d --name contacts-db --network contacts-network -e MYSQL_ROOT_PASSWORD=rootpassword -e MYSQL_DATABASE=contacts_db -e MYSQL_USER=contacts_user -e MYSQL_PASSWORD=contacts_pass contacts-db:1.0
```
- Lancer frontend (exemple) :
```bash
docker run -d --name contacts-frontend --network contacts-network -e DB_HOST=contacts-db -e DB_USER=contacts_user -e DB_PASS=contacts_pass -e DB_NAME=contacts_db -p 3000:3000 contacts-frontend:1.0
```

---

## Architecture (court)
- **frontend** : Node.js / Express — sert les fichiers statiques et l'API `GET/POST /api/contacts`.
- **database** : MySQL — base `contacts_db` et table `contacts`.

---

## Persistance
Utiliser un volume Docker pour MySQL :

```yaml
volumes:
  contacts_db_data:
```

ou mappez un dossier hôte : `-v /chemin/hote/mysql:/var/lib/mysql`.

Remarque : si le volume existe, les scripts d'initialisation ne seront pas ré-exécutés.

---

## Dépendances & santé
- Avec `docker-compose`, utilisez `depends_on` + `healthcheck` pour s'assurer que la DB est prête avant le frontend.
- Alternativement, ajoutez un script `wait-for` dans l'image frontend pour retenter la connexion.

---

## Fichier `docker-compose.yml` (extrait recommandé)

```yaml
version: '3.8'
services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: contacts_db
      MYSQL_USER: contacts_user
      MYSQL_PASSWORD: contacts_pass
    volumes:
      - contacts_db_data:/var/lib/mysql
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    ports:
      - "3306:3306"
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 5s
      timeout: 5s
      retries: 5

  frontend:
    build: ./frontend
    environment:
      DB_HOST: db
      DB_USER: contacts_user
      DB_PASS: contacts_pass
      DB_NAME: contacts_db
    ports:
      - "3000:3000"
    depends_on:
      db:
        condition: service_healthy

volumes:
  contacts_db_data:
```

---

## Conseils de partage
- Inclure `commandes.txt` listant les commandes exactes exécutées.
- Fournir un `.env.example` pour les variables sensibles.
- Documenter toute étape manuelle (ex. import de dump SQL, restauration de volume).

---

## FAQ rapide
**Q : Que se passe-t-il après un reboot ?**

R : Les conteneurs ne redémarrent pas automatiquement sauf si `--restart` ou `restart:` est défini.

**Q : Pourquoi `init.sql` n'est pas appliqué ?**

R : Si le volume MySQL existe déjà, les scripts init ne se lancent qu'à la création initiale du volume.

---

## Contribution
Pull requests bienvenues. Pour toute modification majeure (structure, ports, données initiales), ajoutez un fichier `CHANGELOG.md`.

---

## Licence
Choisir/indiquer la licence souhaitée (ex : MIT).

---

*Fichier généré automatiquement — modifiez le contenu selon vos besoins.*
