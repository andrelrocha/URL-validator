import fs from 'fs';
import chalk from 'chalk';

//Récupère toutes les correspondances de liens dans le texte et les transforme ensuite en objets clé-valeur
function extraitLiens(text) {
    const regex = /\[([^\[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;
    const captures = [...text.matchAll(regex)];
    const resultats = captures.map(captures => ({ [captures[1]]: [captures[2]] }))
    return resultats.length !== 0 ? resultats : "Il n'y a pas de liens dans le fichier";
}

function gereErreur(erreur) {
    throw new Error(chalk.red(erreur.code, "Il n'y a pas des fichiers dans le répertoire appelé."));
}

//Extrait les liens du texte ou traite les erreurs de manière personnalisée
async function prendFichier(cheminDuFichier) {
    try {
        const encondage = 'utf-8';
        const text = await fs.promises.readFile(cheminDuFichier, encondage)
        return extraitLiens(text);
    } catch (erreur) {
        gereErreur(erreur)
    } finally {
        (console.log(chalk.yellow("Fin de la lecture des fichiers.\nTest des liens en cours, veuillez patienter un instant.\n")))
    }
}

export default prendFichier;