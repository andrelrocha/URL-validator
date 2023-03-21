import fetch from 'node-fetch'

function extraitLiens(arrLiens) {
    const elementsStr = arrLiens.map((objetLien) => Object.values(objetLien)).join();
    const nouvelleArray = elementsStr.split(",");
    return nouvelleArray
}

async function checkStatut(arrUrl) {
    const arrStatut = await Promise.all(arrUrl.map(async (url) => {
            try {
                const response = await fetch(url)
                return response.status;
            } catch (erreur) {
                return gereErreurs(erreur);
            }
        })
    )
    return arrStatut
}

function gereErreurs(erreur) {
    if (erreur.code === 'ENOTFOUND') {
        return "Oops, lien non trouvé.";
    } else {
        return "Une erreur s'est produite.";
    } 
}

export default async function listeValidee(listeDeLiens) {
    const liens = extraitLiens(listeDeLiens);
    const statut = await checkStatut(liens);
    
    return listeDeLiens.map((objet, index) => ({
        ...objet, 
        statut: statut[index]
    }))
}