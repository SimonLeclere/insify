**Contexte du projet :**

Simon développe un éditeur de texte en ligne utilisant Next.js et ShadCN UI. L'objectif de l'application est de permettre aux utilisateurs de déposer un sujet de TD au format PDF pour générer un template prêt à remplir, avec des questions et des espaces vides pour les réponses. L'éditeur utilisera MDX ou LaTeX pour le formatage, et Novel sera utilisé pour l'édition de texte.

**Fonctionnalités principales :**
1. **Téléchargement de documents** :
   - Les utilisateurs déposeront un sujet de TD au format PDF.
   - Un parser, utilisant une API d'IA (comme Groq ou OpenAI via Vercel AI SDK), extraira les données du PDF.
   - L'utilisateur pourra modifier le texte extrait avant de valider.

2. **Step-by-step flow** :
   - L'application inclura un *stepper* pour guider l'utilisateur à travers les différentes étapes de création d'un projet :
     1. Informations générales à propos du sujet.
     2. Choix entre parser un sujet de TD ou commencer avec un document vide.
     3. Option de choisir un template si nécessaire.
     4. Confirmation du parsing.

3. **Composants dynamiques dans l'éditeur** :
   - L'éditeur prendra en charge des composants interactifs tels que des cases à cocher et des zones dynamiques. Novel devrait pouvoir supporter cela par défaut.

4. **Exportation en PDF** :
   - À ce stade, l'objectif est d'avoir un système d'exportation simple, par exemple en utilisant react-pdf (HTML → PDF). L'idée est de rendre cette méthode d'export facilement interchangeable plus tard, en fonction des besoins.

5. **Collaboration** :
   - À terme, il serait souhaité d'ajouter une fonctionnalité de collaboration en temps réel.

**Pages de l'application :**

1. **Page d'accueil** :
   - Une page sobre inspirée de l'onboarding de VS Code.
   - Un bouton pour créer un nouveau projet.
   - Une liste simple des projets récents.
  
2. **Page d'éditeur** (/editor/id) :
   - Cette page correspond à un projet ouvert et contient l'éditeur de texte pour travailler sur le sujet de TD.

**Stockage des projets et gestion de l'authentification :**

- Le stockage des projets et la gestion de l'authentification seront gérés via un backend, avec **Neon.tech** comme solution choisie. Neon permet également de gérer les utilisateurs et leurs projets de manière scalable.
- La liste des projets récents sera affichée sur la page d'accueil.

**Prochaines étapes** :

1. Structurer l'application avec les pages définies ci-dessus.
2. Implémenter le modal avec un stepper pour la création de nouveaux projets.
3. Intégrer le parsing basique du PDF et l'édition avec Novel.
4. Explorer des options simples d'exportation en PDF.
5. Réfléchir à une intégration de la collaboration à plus long terme.

**idées** :

1. Générer des liens d'invitation pour ajouter facilement un utilisateur à une équipe
