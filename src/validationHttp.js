import fetch from 'node-fetch'

function extraitLiens(arrLiens) {
    const elementsStr = arrLiens.map((objetLien) => Object.values(objetLien)).join();
    const nouvelleArray = elementsStr.split(",");
    return nouvelleArray
}

async function checkStatus(arrUrl) {
    const arrStatus = await Promise.all(arrUrl.map(async (url) => {
            try {
                const response = await fetch(url)
                return response.status;
            } catch (erreur) {
                return gereErreurs(erreur);
            }
        })
    )
    return arrStatus
}

function gereErreurs(erreur) {
    if (erreur.code === 'ENOTFOUND') {
        return "lien non trouvé";
    } else {
        return "une erreur s'est produite";
    } 
}

export default async function listeValidee(listeDeLiens) {
    const liens = extraitLiens(listeDeLiens);
    const status = await checkStatus(liens);
    
    return listeDeLiens.map((objet, index) => ({
        ...objet, 
        status: status[index]
    }))
}