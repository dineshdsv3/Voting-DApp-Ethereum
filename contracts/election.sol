pragma solidity 0.5.0;


contract election {

    bool public votingStatus;
    Candidate[] public candidates;
    Voter[] public voters;
    string public winner;

    uint public voterCount;
    uint public candidateCount;

    mapping(address => bool) public isVoted;

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

    function castVote(uint _candidateId) public {
        require(votingStatus == true,"Voting is not in progress Ask your admin to start voting");

        require(isVoted[msg.sender] == false,"You have already voted");

        for(uint i = 0; i<=candidateCount; i++) {
          if(_candidateId == candidates[i].id){
               candidates[i].voteCount++;
               isVoted[msg.sender] = true;
            }
        }
    }
}