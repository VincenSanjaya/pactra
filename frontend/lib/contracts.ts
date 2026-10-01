export const PACT_FACTORY_ADDRESS = "0xC41d8e986554664051da084D2E0318d8087A074e" as const;

export const MOCK_USDC_ADDRESS = "0xb63f92AAEe87818f29C0ec7dAfDB740c42A1dfA2" as const;

export const pactFactoryAbi = [
  {
    type: "function",
    name: "createPact",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "_freelancer",
        type: "address",
      },
      {
        name: "_paymentToken",
        type: "address",
      },
      {
        name: "_projectTitle",
        type: "string",
      },
      {
        name: "_projectDescription",
        type: "string",
      },
    ],
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
  },
  {
    type: "function",
    name: "getPactCount",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
  },
  {
    type: "function",
    name: "getClientPacts",
    stateMutability: "view",
    inputs: [
      {
        name: "_client",
        type: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "address[]",
      },
    ],
  },
  {
    type: "function",
    name: "getFreelancerPacts",
    stateMutability: "view",
    inputs: [
      {
        name: "_freelancer",
        type: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "address[]",
      },
    ],
  },
] as const;

export const pactEscrowAbi = [
  {
    type: "function",
    name: "client",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
  },
  {
    type: "function",
    name: "freelancer",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
  },
  {
    type: "function",
    name: "projectTitle",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
  },
  {
    type: "function",
    name: "projectDescription",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
  },
  {
    type: "function",
    name: "totalAmount",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
  },
  {
    type: "function",
    name: "releasedAmount",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
  },
  {
    type: "function",
    name: "pactStatus",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint8",
      },
    ],
  },
  {
    type: "function",
    name: "funded",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
  },
  {
    type: "function",
    name: "getMilestoneCount",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
  },
] as const;
