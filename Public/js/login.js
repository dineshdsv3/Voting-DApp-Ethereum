app = {

    init: async () => {
        await app.loadWeb3();
        await app.loadAccount();
    },

    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
            app.web3Provider = web3.currentProvider
            web3 = new Web3(web3.currentProvider)
        } else {
            window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(ethereum)
            try {
                // Request account access if needed
                await ethereum.enable()
                // Acccounts now exposed
                web3.eth.sendTransaction({/* ... */ })
            } catch (error) {
                // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            app.web3Provider = web3.currentProvider
            window.web3 = new Web3(web3.currentProvider)
            // Acccounts always exposed
            web3.eth.sendTransaction({/* ... */ })
        }
        // Non-dapp browsers...
        else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    },

    loadAccount : async () => {
        app.account = web3.eth.accounts;
        console.log('the account associated is', app.account);
        $('#accountLoader').append(`Ethereum Account is ${app.account}`);
    },

}

document.getElementById('login').addEventListener('click',login);

async function login() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var userType = document.getElementById('typeOfUser').value;
    var address = app.account.toString();


    // console.log(username,password,userType,address);
   var loginMessage = await $.ajax({
        type: 'POST',
        url: '/login',
        data: JSON.stringify ({name: username,
            password: password,
            userType: userType,
            address: address}),
        contentType: "application/json",
        dataType: 'json'
    });
    console.log(loginMessage);

    const message = document.getElementById('message');

    if(loginMessage.message == "userFound" && loginMessage.userType == "moderator") {
        window.location.pathname = "html/moderatorHome.html"
    } else if(loginMessage.message == "userFound" && loginMessage.userType == "voter") {
        window.location.pathname = "html/voter.html"
    } else {
        message.innerText = "Username, Password or Account details are incorrect";
        message.style.color = "red";
    }
}



$(()=> {
    $(window).load(()=>{
        app.init();
    }) 
})