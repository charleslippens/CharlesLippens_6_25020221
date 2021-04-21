## So Pekocko

### ⇢ Présentation :  


Construire une API sécurisée pour une application d'avis gastronomiques et d'évaluation de sauces piquantes.

L'objectif était de réaliser la partie backend puisque le frontend était déja fourni.

### ⇢ Technologies utilisées :

▹ JavaScript
▹ Node.js
▹ Express.js
▹ MongoDB

### ⇢ Prérequis :

La partie frontend a été générée avec Angular CLI version 7.0.2. La partie backend a été générée avec Node.js

Pour faire fonctionner le projet, vous devez installer Node.js

### ⇢ Installation :

▹ Creéz un dossier SoPekocko.

### Fronted:

▹ Clonez le frontend du projet https://github.com/OpenClassrooms-Student-Center/dwj-projet6 ou téléchargez le zip sur le lien précédent.

▹ Dézippez le contenu de "dwj-projet6-master" et placez le dans un dossier frontend préalablement créé à l'intérieur du dossier SoPekocko .

▹ A partir du dossier frontend, exécutez npm i --save-dev node-sass@4.14.1 puis npm run start (ng serve); Le port utilisé est 4200


#Backend

▹ Clonez le repository sur cette page ou téléchargez le zip directement.

▹ Dézippez le contenu placez le backend à l'intérieur du dossier SoPekocko.

▹ Editez le fichier .env  situé dans backend en remplaçant les valeurs par défaut pour accéder à la base de données :

DB_CONNECT: mongodb+srv://<username>:<password>@<cluster_number>.<cluster_name>.mongodb.net/<databasename>?retryWrites=true&w=majority
  
Par exemple : mongodb+srv://test:test@cluster0.xvfqr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

EMAIL_SECRET: écrire une clé aléatoire (32 caractères)

JWT_RAND_SECRET: écrire une clé aléatoire de type https://jwt.io/


▹ A partir du dossier backend, exécutez npm install puis nodemon server; Le port utilisé est 3000.


Le serveur doit fonctionner sur localhost avec le port par défaut 4200. 

Le lien du site local est http://localhost:4200/login


