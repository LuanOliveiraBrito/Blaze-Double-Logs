const puppeteer = require('puppeteer')
const fs = require('fs')


class blaze {

    primeiro = true;

    constructor() {
        this.executar()
    }

    async executar() {
        const browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: true,
            defaultViewport: null,
        })

        const page = await browser.newPage()
        await page.goto('https://blaze.com/pt/games/double')
        await page.waitForSelector('div[id="roulette-timer"] > div')

        while (1) {
            const check = await page.evaluate(() => {
                return document.querySelector('div[id="roulette-timer"] > div').getAttribute('class')
            })
            if (check == 'time-left') break;
        }
        console.log('Ativando script')
        await this.game(page)
    }

    async game(page) {
        while (1) {
            const check = await page.evaluate(() => {
                return document.querySelector('div[id="roulette-timer"] > div').getAttribute('class')
            })
            if (check == 'progress-bar') {
                if (!this.primeiro) await this.resultado(page)
                await this.apostar(page)
            }

        }
    }

    async resultado(page) {
        let resultado = ''
        const capturarCor = await page.evaluate(() => {
            return document.querySelector('div[class="roulette-previous casino-recent"] > div > div > div > div').getAttribute('class')
        })
        const capturarNumero = await page.evaluate(() => {
            return document.querySelector('div[class="roulette-previous casino-recent"] > div > div > div > div > div').innerText
        })

        switch (capturarCor) {
            case 'sm-box black':
                resultado = 'PRETO'
                break;
            case 'sm-box red':
                resultado = 'VERMELHO'
                break;
            case 'sm-box white':
                resultado = 'BRANCO'
                break;
        }
        await fs.promises.appendFile(`logsNumber.txt`, `COR: ${resultado} | NÚMERO: ${capturarNumero} | HORAS: ${new Date}\n`, (err) => {})
    }

    async apostar(page) {
        await sleep(13)

        if (this.primeiro) this.primeiro = false
        while (1) {
            const check = await page.evaluate(() => {
                return document.querySelector('div[id="roulette-timer"] > div').getAttribute('class')
            })
            if (check == 'time-left') break;
        }
    }

}

new blaze

async function sleep(sec) {

    return new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve()
        }, sec * 1000);
    })
}