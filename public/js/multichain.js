const multichain = require("multichain-node")({
    port: 5792,
    host: '178.128.27.70',
    user: "multichainrpc",
    pass: "DRqV48TQKoYXJqTyHea4GHk6QbfiGuazcSxEDs6YfNqY"
});

function getInfo() {
  multichain.getInfo((err, info) => {
    if(err){
        throw err;
    }
    return info;
  })
}
function helloWorld() {
  alert("Hello world");
}
