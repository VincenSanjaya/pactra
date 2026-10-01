Pactra Smart Contract Design

1. Contracts
   MockUSDC.sol
   Purpose:
   Test payment token for the Pactra MVP.
   Responsibilities:
   Mint mock USDC for testing.
   Transfer USDC between users and escrow contracts.
   PactFactory.sol
   Purpose:
   Creates and tracks Pact escrow contracts.
   Responsibilities:
   Create new Pact.
   Store all Pact addresses.
   Store Pact creator.
   Provide list of created Pacts.
   PactEscrow.sol
   Purpose:
   Handles one agreement between a client and a freelancer.
   Responsibilities:
   Store client address.
   Store freelancer address.
   Store project data.
   Store milestones.
   Receive USDC.
   Track submissions.
   Approve milestones.
   Request revisions.
   Release milestone payments.
   Track Pact completion.
2. Main Actors
   Client
   Can:
   Create Pact.
   Fund escrow.
   Approve milestone.
   Request revision.
   Cannot:
   Withdraw freelancer payment after milestone is approved.
   Freelancer
   Can:
   View Pact.
   Submit milestone.
   Resubmit after revision.
   Receive payment.
   Cannot:
   Approve own milestone.
   Withdraw escrow funds manually.
   AI Reviewer
   Can:
   Analyze milestone submission offchain.
   Return review result to frontend.
   Cannot:
   Move funds.
   Approve payment.
   Change smart contract state directly.
3. Pact Data
   Each Pact stores:
   client
   freelancer
   paymentToken
   projectTitle
   projectDescription
   totalAmount
   releasedAmount
   status
   Possible Pact status:
   Active
   Completed
   Cancelled
4. Milestone Data
   Each milestone stores:
   title
   requirement
   amount
   submissionURI
   status
   Milestone status:
   Pending
   Submitted
   RevisionRequested
   Approved
5. Main Functions
   PactFactory.sol
   createPact()
   Creates a new PactEscrow contract.
   getPacts()
   Returns created Pact addresses.
   PactEscrow.sol
   fund()
   Transfers Mock USDC from client into escrow.
   submitMilestone()
   Called by freelancer.
   Stores submission information.
   requestRevision()
   Called by client.
   Changes milestone status to RevisionRequested.
   approveMilestone()
   Called by client.
   Marks milestone as approved.
   Transfers milestone payment to freelancer.
   getMilestone()
   Returns milestone information.
   getRemainingBalance()
   Returns USDC still locked in escrow.
6. Payment Flow
   Client
   → approve MockUSDC spending
   → PactEscrow
   → funds locked
   Then:
   Client approves Milestone 1
   → PactEscrow
   → 300 USDC
   → Freelancer
7. Security Rules
   Only the client can fund the Pact.
   Only the assigned freelancer can submit work.
   Only the client can approve work.
   A milestone cannot be paid twice.
   A milestone cannot be approved before submission.
   Released payment cannot exceed deposited funds.
   Zero address cannot be used as freelancer.
   Client cannot be the freelancer.
8. AI Architecture
   AI review stays offchain.
   Flow:
   Freelancer submission
   → Frontend
   → AI API
   → Review result
   → Client UI
   The AI review does not control the smart contract.
   The client makes the final decision.
   Ini desain v0.1 kita.
   Ada satu keputusan arsitektur yang perlu kamu pahami sekarang.
   Kenapa kita pakai PactFactory.sol dan PactEscrow.sol?
   Bayangkan Alice bikin project dengan Bob.
   Factory membuat:
   PactEscrow #1
   Lalu Charlie bikin project dengan David.
   Factory membuat:
   PactEscrow #2
   Jadi setiap project punya “brankas” sendiri.
   Factory
   ↓
   Pact #1
   Alice ↔ Bob
   1000 USDC
   Factory
   ↓
   Pact #2
   Charlie ↔ David
   500 USDC
