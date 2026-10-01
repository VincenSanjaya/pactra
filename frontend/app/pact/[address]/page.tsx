"use client";

import {
    use,
    useEffect,
    useState,
} from "react";

import PactHeader from "@/components/pact/PactHeader";
import PactStats from "@/components/pact/PactStats";
import PactParticipants from "@/components/pact/PactParticipants";
import AddMilestoneForm from "@/components/pact/AddMilestoneForm";
import FundEscrowPanel from "@/components/pact/FundEscrowPanel";
import MilestonePanel from "@/components/pact/MilestonePanel";
import TransactionStatus from "@/components/pact/TransactionStatus";
import DemoFaucetPanel from "@/components/pact/DemoFaucetPanel";

import {
    pactStatusLabel,
} from "@/lib/pact-utils";

import {
    usePact,
    type Address,
} from "@/hooks/usePact";

import {
    usePactActions,
    type PactAction,
} from "@/hooks/usePactActions";

import {
    useAIReview,
} from "@/hooks/useAIReview";

export default function PactDetailPage({
    params,
}: {
    params: Promise<{
        address: string;
    }>;
}) {
    const resolvedParams =
        use(params);

    const pactAddress =
        resolvedParams.address as Address;

    const [
        selectedMilestone,
        setSelectedMilestone,
    ] = useState(0);

    const [
        milestoneTitle,
        setMilestoneTitle,
    ] = useState("");

    const [
        milestoneRequirement,
        setMilestoneRequirement,
    ] = useState("");

    const [
        milestoneAmount,
        setMilestoneAmount,
    ] = useState("");

    const [
        submissionURI,
        setSubmissionURI,
    ] = useState("");

    const [
        successMessage,
        setSuccessMessage,
    ] = useState("");

    const [
        lastAction,
        setLastAction,
    ] =
        useState<PactAction>("");

    const pact =
        usePact(
            pactAddress,
            selectedMilestone
        );

    const actions =
        usePactActions(
            pactAddress
        );

    const ai =
        useAIReview();

    useEffect(() => {
        if (!actions.txSuccess) {
            return;
        }

        async function handleSuccess() {
            await pact.refreshAll();

            if (
                lastAction ===
                "addMilestone"
            ) {
                setMilestoneTitle("");
                setMilestoneRequirement("");
                setMilestoneAmount("");

                setSuccessMessage(
                    "Milestone added successfully."
                );
            }

            if (
                lastAction ===
                "approveUsdc"
            ) {
                setSuccessMessage(
                    "mUSDC allowance approved."
                );
            }

            if (
                lastAction ===
                "fundEscrow"
            ) {
                setSuccessMessage(
                    "Escrow funded successfully."
                );
            }

            if (
                lastAction ===
                "submitMilestone"
            ) {
                setSubmissionURI("");

                ai.resetAIReview();

                setSuccessMessage(
                    "Milestone submitted successfully."
                );
            }

            if (
                lastAction ===
                "requestRevision"
            ) {
                ai.resetAIReview();

                setSuccessMessage(
                    "Revision requested."
                );
            }

            if (
                lastAction ===
                "approveMilestone"
            ) {
                setSuccessMessage(
                    "Milestone approved and payment released."
                );
            }

            if (
                lastAction ===
                "mintDemoUsdc"
            ) {
                setSuccessMessage(
                    "1,000 demo mUSDC minted successfully."
                );
            }

            window.setTimeout(() => {
                setSuccessMessage("");
                actions.resetWrite();
            }, 3500);
        }

        handleSuccess();
    }, [
        actions.txSuccess,
        lastAction,
        pact,
        ai,
        actions,
    ]);

    useEffect(() => {
        ai.resetAIReview();
    }, [
        selectedMilestone,
    ]);

    async function copyText(
        value?: string
    ) {
        if (!value) {
            return;
        }

        await navigator.clipboard.writeText(
            value
        );

        setSuccessMessage(
            "Address copied."
        );

        window.setTimeout(() => {
            setSuccessMessage("");
        }, 2000);
    }

    function handleAddMilestone() {
        if (
            !milestoneTitle ||
            !milestoneRequirement ||
            !milestoneAmount
        ) {
            return;
        }

        setLastAction(
            "addMilestone"
        );

        setSuccessMessage("");

        actions.addMilestone(
            milestoneTitle,
            milestoneRequirement,
            milestoneAmount
        );
    }

    function handleApproveUsdc() {
        if (
            pact.totalAmount ===
            undefined
        ) {
            return;
        }

        setLastAction(
            "approveUsdc"
        );

        setSuccessMessage("");

        actions.approveUsdc(
            pact.totalAmount
        );
    }

    function handleFundEscrow() {
        setLastAction(
            "fundEscrow"
        );

        setSuccessMessage("");

        actions.fundEscrow();
    }

    function handleSubmitWork() {
        if (!submissionURI) {
            return;
        }

        setLastAction(
            "submitMilestone"
        );

        setSuccessMessage("");

        actions.submitMilestone(
            selectedMilestone,
            submissionURI
        );
    }

    function handleRequestRevision() {
        setLastAction(
            "requestRevision"
        );

        setSuccessMessage("");

        actions.requestRevision(
            selectedMilestone
        );
    }

    function handleApproveMilestone() {
        setLastAction(
            "approveMilestone"
        );

        setSuccessMessage("");

        actions.approveMilestone(
            selectedMilestone
        );
    }

    function handleRunAIReview() {
        if (!pact.milestone) {
            return;
        }

        ai.runAIReview(
            pact.milestone[1],
            pact.milestone[3]
        );
    }

    function handleMintDemoUsdc() {
        if (!pact.connectedAddress) {
            return;
        }

        setLastAction(
            "mintDemoUsdc"
        );

        setSuccessMessage("");

        actions.mintDemoUsdc(
            pact.connectedAddress
        );
    }

    const roleLabel =
        pact.isClient
            ? "Viewing as Client"
            : pact.isFreelancer
                ? "Viewing as Freelancer"
                : pact.isConnected
                    ? "Read-only"
                    : "";

    return (
        <main className="px-8 py-10">
            <div className="mx-auto max-w-[1180px]">
                <PactHeader
                    pactAddress={
                        pactAddress
                    }
                    projectTitle={
                        pact.projectTitle
                    }
                    projectDescription={
                        pact.projectDescription
                    }
                    pactStatus={
                        Number(
                            pact.pactStatus
                        )
                    }
                    roleLabel={
                        roleLabel
                    }
                    onCopy={
                        copyText
                    }
                />

                <TransactionStatus
                    successMessage={
                        successMessage
                    }
                    writeError={
                        actions.writeError
                    }
                    writeHash={
                        actions.writeHash
                    }
                />

                <PactStats
                    status={pactStatusLabel(
                        Number(
                            pact.pactStatus
                        )
                    )}
                    total={
                        pact.formattedTotal
                    }
                    released={
                        pact.formattedReleased
                    }
                    escrowBalance={
                        pact.formattedEscrowBalance
                    }
                    funded={
                        Boolean(
                            pact.funded
                        )
                    }
                />

                <PactParticipants
                    client={
                        pact.client
                    }
                    freelancer={
                        pact.freelancer
                    }
                    onCopy={
                        copyText
                    }
                />

                <DemoFaucetPanel
                    balance={
                        pact.formattedWalletBalance
                    }
                    isConnected={
                        pact.isConnected
                    }
                    isBusy={
                        actions.isBusy
                    }
                    onMint={
                        handleMintDemoUsdc
                    }
                />

                {pact.isClient &&
                    !pact.funded && (
                        <AddMilestoneForm
                            title={
                                milestoneTitle
                            }
                            requirement={
                                milestoneRequirement
                            }
                            amount={
                                milestoneAmount
                            }
                            isBusy={
                                actions.isBusy
                            }
                            onTitleChange={
                                setMilestoneTitle
                            }
                            onRequirementChange={
                                setMilestoneRequirement
                            }
                            onAmountChange={
                                setMilestoneAmount
                            }
                            onSubmit={
                                handleAddMilestone
                            }
                        />
                    )}

                {pact.isClient &&
                    !pact.funded &&
                    pact.totalAmount !==
                    undefined &&
                    pact.totalAmount >
                    BigInt(0) && (
                        <FundEscrowPanel
                            allowance={
                                pact.formattedAllowance
                            }
                            hasEnoughAllowance={
                                pact.hasEnoughAllowance
                            }
                            isBusy={
                                actions.isBusy
                            }
                            onApprove={
                                handleApproveUsdc
                            }
                            onFund={
                                handleFundEscrow
                            }
                        />
                    )}

                <MilestonePanel
                    milestoneCount={
                        pact.milestoneCount
                    }
                    milestone={
                        pact.milestone
                    }
                    selectedMilestone={
                        selectedMilestone
                    }
                    onSelectedMilestoneChange={
                        setSelectedMilestone
                    }
                    isClient={
                        pact.isClient
                    }
                    isFreelancer={
                        pact.isFreelancer
                    }
                    funded={
                        Boolean(
                            pact.funded
                        )
                    }
                    isBusy={
                        actions.isBusy
                    }
                    submissionURI={
                        submissionURI
                    }
                    onSubmissionURIChange={
                        setSubmissionURI
                    }
                    onSubmitWork={
                        handleSubmitWork
                    }
                    onRequestRevision={
                        handleRequestRevision
                    }
                    onApproveMilestone={
                        handleApproveMilestone
                    }
                    aiReview={
                        ai.aiReview
                    }
                    aiLoading={
                        ai.aiLoading
                    }
                    aiError={
                        ai.aiError
                    }
                    onRunAIReview={
                        handleRunAIReview
                    }
                />
            </div>
        </main>
    );
}