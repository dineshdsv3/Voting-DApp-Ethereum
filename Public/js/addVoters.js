app = {

    contracts :{},

    init: async () => {
        await app.loadWeb3();
        await app.loadAccount();
        await app.loadContract();
        await app.addVoters();
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

    loadContract: async () => {
        const election = await $.getJSON('/contracts/election.json');
        app.contracts.election = TruffleContract(election);
        app.contracts.election.setProvider(app.web3Provider);

        // Getting the values from blockchain by smart contract

        app.election = await app.contracts.election.deployed();
        console.log(app.election);
    },

    addVoters : async () => {
        
        var vc = await app.election.voterCount();
        var voterCount = vc.toNumber();
        console.log(`beforecount ${voterCount}`);

        document.getElementById('voterAdd').addEventListener('click',addVoters);
        
        async function addVoters() {
            var name = document.getElementById('voterName').value;
            var address = document.getElementById('voterAddress').value;
            await app.election.addVoter(name,address);
            window.location.reload();
            // console.log(`afterCount ${voterCount}`);
        }

        for(let i=0; i<voterCount; i++) {
            var voters = await app.election.voters(i);
            var voterId = voters[0].toNumber();
            var voterName = voters[1];
            var voterAddress = voters[2];
            console.log(voterId,voterName,voterAddress);
            var voterList = $('#voterList');
            
            var voterTemplate =  `<tr><td>${voterId}</td> <td>${voterName}</td><td>${voterAddress}</td></tr>`
            voterList.append(voterTemplate);
            
        }
        
        
    }
}

function proceed() {
    window.location.pathname = "html/voterList.html"
}


$(()=> {
    $(window).load(()=>{
        app.init();
    }) 
})



