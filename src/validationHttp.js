import fetch from 'node-fetch'
import chalk from 'chalk';

function extraiLinks(arrLinks) {
    const elementosStr = arrLinks.map((objetoLink) => Object.values(objetoLink)).join();
    const novaArray = elementosStr.split(",");
    return novaArray
}

async function checaStatus(arrUrl) {
    const arrStatus = await Promise.all(arrUrl.map(async (url) => {
            try {
                const response = await fetch(url)
                return response.status;
            } catch (erro) {
                return manejaErros(erro);
            }
        })
    )
    return arrStatus
}

function manejaErros(erro) {
    if (erro.code === 'ENOTFOUND') {
        return "link não encontrado";
    } else {
        return "ocorreu algum erro";
    } 
}

export default async function listaValidada(listaDeLinks) {
    const links = extraiLinks(listaDeLinks);
    const status = await checaStatus(links);
    
    return listaDeLinks.map((objeto, indice) => ({
        ...objeto, 
        status: status[indice]
    }))
}