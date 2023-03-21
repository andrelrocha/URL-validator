import chalk from 'chalk';
import fs from 'fs';
import prendFichier from './lecteurDeFichiers.js';
import listeValidee from './validationHttp.js';

//reçoit un array avec des informations passées dans la ligne de commande
const chemin = process.argv;

async function imprimeListe(valide, resultat, nomFichier = "") {
    if (valide) {
        console.log(
            chalk.yellow("Liste des liens et leur statut de réponse\n"), 
            chalk.black.bgGreen(nomFichier), 
            await listeValidee(resultat));
    } else {
        console.log(
            chalk.yellow("Liste de liens"), 
            chalk.black.bgGreen(nomFichier), 
            resultat);
    }
}

async function traiteTexte(argumentsPasse) {
    const chemin = argumentsPasse[2];
    const valide = argumentsPasse[3] === 'valide';

    try {
        //si un chemin de répertoire incorrect est passé, une erreur sera renvoyée
        fs.lstatSync(chemin);
    } catch (erreur) {
        if (erreur.code === "ENOENT") {
            console.log(chalk.red("FICHIER OU RÉPERTOIRE APPELÉ N'EXISTE PAS."));
            return
        }
    }

    if (fs.lstatSync(chemin).isFile()) {
        const resultats = await prendFichier(chemin);
        imprimeListe(valide, resultats)
    } else if (fs.lstatSync(chemin).isDirectory()) {
        const fichiers = await fs.promises.readdir(chemin);
        fichiers.forEach(async (nomFichier) => {
            const liste = await prendFichier(`${chemin}/${nomFichier}`)
            imprimeListe(valide, liste, nomFichier)
        })
    }
}

traiteTexte(chemin);