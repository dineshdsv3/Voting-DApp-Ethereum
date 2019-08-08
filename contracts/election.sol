pragma solidity 0.5.0;


contract election {

    bool public votingStatus;
    Candidate[] public candidates;
    Voter[] public voters;
    string public winner;
    
    uint public voterCount;
    uint public candidateCount;

    struct Voter {
        uint id;
        string name;
        address voter;
    }

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    function addCandidate(string memory _name) public {
        candidateCount++;
        candidates.push(Candidate(candidateCount,_name,0));
    }

    function addVoter(string memory _name, address _address) public {
        voterCount++;
        voters.push(Voter(voterCount,_name,_address));
    }

    function startVoting() public {
        votingStatus = true;
    }

    function stopVoting() public {
        votingStatus = false;
    }
}