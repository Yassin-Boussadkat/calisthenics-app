# Calisthenics Training App

Dit is een full-stack app die ik heb gebouwd om mijn eigen calisthenics-training bij te houden en om te laten zien wat ik het afgelopen jaar heb geleerd. Het idee is simpel: je maakt je eigen weekplanning, houdt je workouts bij en kunt achteraf zien wat je daadwerkelijk hebt gehaald ten opzichte van wat je had gepland.

## Live demo

De app staat live op https://calisthenics-app-eta.vercel.app. Wil je 'm meteen met wat data erin zien in plaats van een leeg account, log dan in met:

demo@demo.com
Wachtwoord: Demo1234!

## Wat de app doet

Je registreert en logt in via JWT-authenticatie, met twee rollen: een gewone gebruiker en een admin die de lijst met oefeningen beheert. Als gebruiker bouw je zelf je weekagenda, welke oefening op welke dag, met hoeveel sets, reps en gewicht. Op de dag zelf zie je meteen wat er gepland staat, en start je de workout om in te vullen wat je daadwerkelijk hebt gehaald. Alles wat je logt, komt terug in je geschiedenis: planning naast resultaat, per dag. En per oefening zie je je persoonlijke record en een grafiekje van je progressie over tijd.

## Hoe het gebouwd is

Backend: Java 17 met Spring Boot, Spring Security met JWT voor authenticatie, Spring Data JPA en PostgreSQL voor de data. Frontend: React met Vite, gestyled met Tailwind, grafieken met Recharts, en Axios voor de API-calls. De backend en frontend zijn los van elkaar gedeployed — backend en database op Render, frontend op Vercel — met CORS ingesteld via een environment variable zodat ik lokaal en in productie niks hoef om te bouwen in de code zelf.

## Zelf draaien

Je hebt Java 17, Node.js en Docker nodig.

```bash
# Database
docker compose up -d

# Backend
mvn spring-boot:run

# Frontend
cd frontend
npm install
npm run dev
```

De benodigde environment variables (JWT secret, database-inloggegevens) staan toegelicht in `application.properties`.

## Wat ik bewust nog niet heb gebouwd

De statistiekenpagina heb ik binnen het tijdsbestek van het project nog niet volledig kunnen afmaken. Dit is een mooie vervolgstap voor het project, waarbij ik de statistieken verder kan uitbreiden en meer inzicht kan geven in de voortgang van een gebruiker.