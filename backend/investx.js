const http = require('http');
const https = require('https');
const url = require('url');

const server = new http.Server();
const proxyUrl = 'api.binance.com'

function binanceReq(incomeReq, incomeResp) {
    const options = {
        protocol: 'https:',
        hostname: proxyUrl,
        method: incomeReq.method,
        path: incomeReq.url,
    }
    const req = https.request(options, (res) => {
        res.on('data', (chunk) => {
            incomeResp.write(chunk);
        })
        res.on('end', () => {
            incomeResp.end();
        })
    })
    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });
    req.end();
}

server.on('request', (req, res) => {
    binanceReq(req, res);
})

server.listen(8080, '127.0.0.1');
