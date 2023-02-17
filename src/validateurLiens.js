import chalk from 'chalk';
import fs from 'fs';
import pegaArquivo from './lecteurDeFichiers';
import listaValidada from './validationHttp';

//recebe uma array com informações passadas no cmd
const caminho = process.argv;

async function imprimeLista(valida, resultado, nomeArquivo = "") {
    if (valida) {
        console.log(
            chalk.yellow("lista validada"), 
            chalk.black.bgGreen(nomeArquivo), 
            await listaValidada(resultado));
    } else {
        console.log(
            chalk.yellow("lista de links"), 
            chalk.black.bgGreen(nomeArquivo), 
            resultado);
    }
}

async function processaTexto(argumentos) {
    const caminho = argumentos[2];
    const valida = argumentos[3] === 'valida';

    try {
        //se for passado algum caminho errado no diretório essa informação já virá com erro
        fs.lstatSync(caminho);
    } catch (erro) {
        if (erro.code === "ENOENT") {
            console.log(chalk.red("ARQUIVO OU DIRETÓRIO CHAMADO NÃO EXISTE."));
            return
        }
    }

    if (fs.lstatSync(caminho).isFile()) {
        const resultados = await pegaArquivo(caminho);
        imprimeLista(valida, resultados)
    } else if (fs.lstatSync(caminho).isDirectory()) {
        const arquivos = await fs.promises.readdir(caminho);
        arquivos.forEach(async (nomeDeArquivo) => {
            const lista = await pegaArquivo(`${caminho}/${nomeDeArquivo}`)
            imprimeLista(valida, lista, nomeDeArquivo)
        })
    }
}

processaTexto(caminho);