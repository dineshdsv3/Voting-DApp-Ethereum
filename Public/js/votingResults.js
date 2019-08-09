app = {

    contracts: {},
    winnerName : "",
    maxCount : 0,
    
    init: async () => {
        
        await app.loadWeb3();
        await app.loadAccount();
        await app.loadContract();
        await app.showResults();
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

    loadAccount: async () => {
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
    

    showResults: async () => {
        
        var votingStatus = await app.election.votingStatus();
        if(votingStatus) {
            
            $('#votingStatus').append(`Voting is Still going. Come after the completion of voting. Contact your admin for the completion date`);
        }else {
            $('#votingStatus').hide();
            $('#finalResults').show();
        }


        $('#accountAddress').html('The account associated is ' + app.account);
        var can = await app.election.candidateCount();
        var candidateCount = can.toNumber();

        // console.log(candidateCount);
        for (let i = 0; i < candidateCount; i++) {
            var candidates = await app.election.candidates(i);
            var candId = candidates[0].toNumber();
            var candName = candidates[1];
            var candVoteCount = candidates[2].toNumber();
            // console.log(candId);
            if(candVoteCount > app.maxCount) {
                app.maxCount = candVoteCount;
                app.winnerName = candName;
            }

            var candidateList = $('#candList');

            var candidateTemplate = `<tr><td>${candId}</td> <td>${candName}</td><td>${candVoteCount}</td></tr>`
            candidateList.append(candidateTemplate);
            
 
        }
        var votingWinner = $('#winner');
        winnerTemplate = `<p>Winner for this voting process is ${app.winnerName}`;
        votingWinner.append(winnerTemplate);

    },





}


$( () => {
     $('#finalResults').hide();
    $(window).load(() => {
        app.init();
    })
})