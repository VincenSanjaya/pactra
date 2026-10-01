Pactra User Flow
Actors
Client
Creates a Pact, funds escrow, reviews submissions, and approves milestones.
Freelancer
Completes work, submits milestone deliverables, and receives payment.
AI Reviewer
Reviews milestone submissions against the requirements and provides feedback.
Main Flow

1. Client connects wallet.
2. Client creates a Pact.
3. Client enters:
   Project title
   Project description
   Freelancer wallet address
   Milestone title
   Milestone requirement
   Milestone payment amount
4. Client creates the Pact.
5. Client funds the escrow using Mock USDC.
6. Pact becomes active.
7. Freelancer opens the Pact.
8. Freelancer submits a milestone.
   Submission can contain:
   Deliverable link
   Description
   Evidence or notes
9. AI reviews the submission against the milestone requirement.
10. AI provides:
    Review summary
    Requirement match
    Missing requirements
    Recommendation
11. Client reviews the work.
12. Client chooses:
    Approve
    or
    Request Revision
13. If Approved:
    The smart contract releases the milestone payment to the freelancer.
14. If Request Revision:
    The milestone returns to revision state.
    Freelancer can submit again.
15. After every milestone is approved:
    The Pact becomes Completed.
