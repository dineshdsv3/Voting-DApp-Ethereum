pragma solidity 0.5.0;


contract election {

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    Candidate[] public candidates;

    uint public candidateCount;

    function addCandidate(string memory _name) public {
        candidates.push(Candidate(candidateCount,_name,0));
        candidateCount++;
    }

}