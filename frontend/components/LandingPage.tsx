"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const workflow = [
  {
    number: "01",
    title: "Define the work",
    description:
      "Client creates a Pact with clear milestones, requirements, and payment amounts.",
  },
  {
    number: "02",
    title: "Lock the funds",
    description:
      "mUSDC is secured inside an escrow contract deployed on Arbitrum.",
  },
  {
    number: "03",
    title: "Submit & review",
    description:
      "The freelancer submits work and AI assists with requirement verification.",
  },
  {
    number: "04",
    title: "Approve & release",
    description:
      "The client makes the final decision. Approval releases the milestone payment.",
  },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [activeFlow, setActiveFlow] = useState(0);

  useEffect(() => {
    setMounted(true);

    const interval = window.setInterval(() => {
      setActiveFlow((current) => (current + 1) % 4);
    }, 1800);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("pactra-visible");
          }
        });
      },
      {
        threshold: 0.12,
      }
    );

    document.querySelectorAll(".pactra-reveal").forEach((element) => {
      observer.observe(element);
    });

    return () => {
      window.clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#0b0d0f] text-[#f5f7f8]">
      <style>{`
        html {
          scroll-behavior: smooth;
        }

        .pactra-grid {
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 64px 64px;
        }

        .pactra-reveal {
          opacity: 0;
          transform: translateY(28px);
          transition:
            opacity 700ms cubic-bezier(.2,.8,.2,1),
            transform 700ms cubic-bezier(.2,.8,.2,1);
        }

        .pactra-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .pactra-orb {
          animation: pactraFloat 5s ease-in-out infinite;
        }

        .pactra-scan {
          animation: pactraScan 3.2s ease-in-out infinite;
        }

        .pactra-pulse {
          animation: pactraPulse 2s ease-in-out infinite;
        }

        @keyframes pactraFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-9px);
          }
        }

        @keyframes pactraScan {
          0%, 100% {
            transform: translateY(0);
            opacity: 0;
          }
          15% {
            opacity: .7;
          }
          70% {
            opacity: .35;
          }
          90% {
            transform: translateY(285px);
            opacity: 0;
          }
        }

        @keyframes pactraPulse {
          0%, 100% {
            opacity: .45;
          }
          50% {
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }

          .pactra-reveal {
            opacity: 1;
            transform: none;
          }

          .pactra-orb,
          .pactra-scan,
          .pactra-pulse {
            animation: none;
          }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#0b0d0f]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#c7ff1a] text-sm font-bold text-black">
              P
            </div>

            <span className="text-[17px] font-semibold tracking-[-0.02em]">
              Pactra
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#product"
              className="text-sm text-[#8e969f] transition hover:text-white"
            >
              Product
            </a>

            <a
              href="#ai"
              className="text-sm text-[#8e969f] transition hover:text-white"
            >
              AI Review
            </a>

            <a
              href="#network"
              className="text-sm text-[#8e969f] transition hover:text-white"
            >
              Arbitrum
            </a>
          </div>

          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 rounded-lg bg-[#c7ff1a] px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[#d4ff4c]"
          >
            Launch App
            <span className="transition group-hover:translate-x-0.5">↗</span>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="pactra-grid relative min-h-screen border-b border-[#24282d] pt-[72px]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[15%] top-[20%] h-[350px] w-[350px] rounded-full bg-[#c7ff1a]/[0.035] blur-[110px]" />
          <div className="absolute bottom-[10%] right-[10%] h-[300px] w-[300px] rounded-full bg-white/[0.025] blur-[100px]" />
        </div>

        <div className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-[1240px] items-center gap-16 px-6 py-20 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div>
            <div
              className={`mb-8 inline-flex items-center gap-2 rounded-full border border-[#c7ff1a]/20 bg-[#c7ff1a]/[0.06] px-3 py-1.5 text-xs text-[#c7ff1a] transition duration-700 ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#c7ff1a] pactra-pulse" />
              Built on Arbitrum
            </div>

            <h1
              className={`max-w-[720px] text-[58px] font-semibold leading-[0.98] tracking-[-0.055em] transition delay-100 duration-700 sm:text-[72px] lg:text-[84px] ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              Work.
              <br />
              Verify.
              <br />
              <span className="text-[#c7ff1a]">Get paid.</span>
            </h1>

            <p
              className={`mt-8 max-w-[590px] text-lg leading-8 text-[#8e969f] transition delay-200 duration-700 ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              AI-assisted onchain escrow that helps freelancers and clients
              agree on work, verify milestones, and release payments with
              confidence.
            </p>

            <div
              className={`mt-10 flex flex-wrap items-center gap-3 transition delay-300 duration-700 ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-3 rounded-lg bg-[#c7ff1a] px-5 py-3.5 text-sm font-semibold text-black transition hover:bg-[#d4ff4c]"
              >
                Launch Pactra
                <span className="transition group-hover:translate-x-1">→</span>
              </Link>

              <a
                href="#product"
                className="inline-flex items-center gap-2 rounded-lg border border-[#2a2f35] bg-[#111418] px-5 py-3.5 text-sm text-[#d9dddf] transition hover:border-[#3a4047] hover:bg-[#161a1f]"
              >
                See how it works
                <span className="text-[#636b74]">↓</span>
              </a>
            </div>

            <div
              className={`mt-14 flex flex-wrap gap-x-8 gap-y-3 text-xs text-[#636b74] transition delay-500 duration-700 ${
                mounted ? "opacity-100" : "opacity-0"
              }`}
            >
              <span>Non-custodial escrow</span>
              <span>Milestone payments</span>
              <span>AI-assisted verification</span>
            </div>
          </div>

          {/* HERO PRODUCT VISUAL */}
          <div
            className={`relative transition delay-300 duration-1000 ${
              mounted
                ? "translate-x-0 opacity-100"
                : "translate-x-8 opacity-0"
            }`}
          >
            <div className="pactra-orb relative rounded-[24px] border border-[#2a2f35] bg-[#0f1215] p-3 shadow-2xl shadow-black/40">
              <div className="relative overflow-hidden rounded-[18px] border border-[#24282d] bg-[#111418]">
                <div className="pactra-scan pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-[#c7ff1a]/60 shadow-[0_0_20px_rgba(199,255,26,0.4)]" />

                <div className="flex items-center justify-between border-b border-[#24282d] px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#c7ff1a]/20 bg-[#c7ff1a]/10 text-xs font-semibold text-[#c7ff1a]">
                      P
                    </div>

                    <div>
                      <p className="text-sm font-medium">Website Redesign</p>
                      <p className="mt-0.5 text-[11px] text-[#636b74]">
                        Pact #004
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full border border-[#43d17b]/20 bg-[#43d17b]/10 px-2.5 py-1 text-[11px] text-[#43d17b]">
                    Escrow funded
                  </span>
                </div>

                <div className="p-5">
                  <div className="mb-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-[#24282d] bg-[#0b0d0f] p-4">
                      <p className="text-[11px] uppercase tracking-[0.1em] text-[#636b74]">
                        Locked
                      </p>

                      <p className="mt-2 text-xl font-semibold">
                        1,000
                        <span className="ml-1 text-xs font-normal text-[#636b74]">
                          mUSDC
                        </span>
                      </p>
                    </div>

                    <div className="rounded-xl border border-[#24282d] bg-[#0b0d0f] p-4">
                      <p className="text-[11px] uppercase tracking-[0.1em] text-[#636b74]">
                        Network
                      </p>

                      <div className="mt-3 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#43d17b]" />
                        <p className="text-sm font-medium">Arbitrum</p>
                      </div>
                    </div>
                  </div>

                  <p className="mb-3 text-xs uppercase tracking-[0.12em] text-[#636b74]">
                    Pact lifecycle
                  </p>

                  <div className="space-y-2">
                    {[
                      "Funds locked",
                      "Work submitted",
                      "AI reviewed",
                      "Client approval",
                    ].map((label, index) => {
                      const completed = index <= activeFlow;

                      return (
                        <div
                          key={label}
                          className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-all duration-500 ${
                            completed
                              ? "border-[#c7ff1a]/20 bg-[#c7ff1a]/[0.045]"
                              : "border-[#24282d] bg-[#0d1013]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-6 w-6 items-center justify-center rounded-full border text-[10px] transition ${
                                completed
                                  ? "border-[#c7ff1a] bg-[#c7ff1a] text-black"
                                  : "border-[#343a40] text-[#636b74]"
                              }`}
                            >
                              {completed ? "✓" : index + 1}
                            </div>

                            <span
                              className={`text-sm ${
                                completed ? "text-white" : "text-[#636b74]"
                              }`}
                            >
                              {label}
                            </span>
                          </div>

                          {index === activeFlow && (
                            <span className="text-[10px] uppercase tracking-[0.12em] text-[#c7ff1a]">
                              Processing
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 rounded-xl border border-[#24282d] bg-[#0b0d0f] p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#8e969f]">
                        Payment authority
                      </span>

                      <span className="text-xs font-medium text-white">
                        Client
                      </span>
                    </div>

                    <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#24282d]">
                      <div className="h-full w-[72%] rounded-full bg-[#c7ff1a]" />
                    </div>

                    <p className="mt-3 text-[11px] leading-5 text-[#636b74]">
                      AI can recommend. Only the client can approve fund
                      release.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-[#24282d] bg-[#111418]/95 px-4 py-3 shadow-xl backdrop-blur md:block">
              <p className="text-[10px] uppercase tracking-[0.12em] text-[#636b74]">
                Settlement
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#43d17b]" />
                <p className="text-xs text-white">Onchain & verifiable</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#4d545c]">
            Scroll
          </span>
          <span className="text-[#636b74]">↓</span>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="border-b border-[#24282d]">
        <div className="mx-auto max-w-[1240px] px-6 py-28 lg:px-8 lg:py-36">
          <div className="pactra-reveal max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#c7ff1a]">
              The problem
            </p>

            <h2 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-[-0.04em] md:text-6xl">
              Great work should not depend on
              <span className="text-[#636b74]"> trust alone.</span>
            </h2>
          </div>

          <div className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-[#24282d] bg-[#24282d] lg:grid-cols-2">
            <div className="pactra-reveal bg-[#0f1215] p-8 md:p-10">
              <p className="text-xs uppercase tracking-[0.12em] text-[#636b74]">
                For freelancers
              </p>

              <p className="mt-12 max-w-md text-2xl font-medium leading-9 tracking-[-0.025em]">
                “Will I actually get paid after I deliver the work?”
              </p>

              <div className="mt-10 h-px bg-[#24282d]" />

              <p className="mt-5 text-sm leading-6 text-[#8e969f]">
                Pactra locks milestone funds before work begins, making the
                commitment visible onchain.
              </p>
            </div>

            <div className="pactra-reveal bg-[#0f1215] p-8 md:p-10">
              <p className="text-xs uppercase tracking-[0.12em] text-[#636b74]">
                For clients
              </p>

              <p className="mt-12 max-w-md text-2xl font-medium leading-9 tracking-[-0.025em]">
                “How do I know the work is ready before releasing payment?”
              </p>

              <div className="mt-10 h-px bg-[#24282d]" />

              <p className="mt-5 text-sm leading-6 text-[#8e969f]">
                Milestone submissions and AI-assisted review provide structured
                evidence before the client decides.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section id="product" className="border-b border-[#24282d]">
        <div className="mx-auto max-w-[1240px] px-6 py-28 lg:px-8 lg:py-36">
          <div className="pactra-reveal flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#c7ff1a]">
                How Pactra works
              </p>

              <h2 className="mt-5 max-w-xl text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
                From agreement to settlement.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-[#8e969f]">
              Every stage has a clear owner. Smart contracts secure funds, AI
              assists evaluation, and humans retain final payment control.
            </p>
          </div>

          <div className="mt-20 border-t border-[#24282d]">
            {workflow.map((step, index) => (
              <div
                key={step.number}
                className="pactra-reveal group grid gap-5 border-b border-[#24282d] py-8 transition md:grid-cols-[120px_1fr_1fr] md:items-center"
              >
                <p className="font-mono text-sm text-[#636b74]">
                  {step.number}
                </p>

                <h3 className="text-2xl font-medium tracking-[-0.025em] transition group-hover:text-[#c7ff1a]">
                  {step.title}
                </h3>

                <p className="max-w-md text-sm leading-6 text-[#8e969f]">
                  {step.description}
                </p>

                {index < workflow.length - 1 && (
                  <div className="hidden" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI SECTION */}
      <section id="ai" className="relative border-b border-[#24282d]">
        <div className="mx-auto grid max-w-[1240px] items-center gap-16 px-6 py-28 lg:grid-cols-2 lg:px-8 lg:py-36">
          <div className="pactra-reveal">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#c7ff1a]">
              AI with boundaries
            </p>

            <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.08] tracking-[-0.04em] md:text-5xl">
              AI reviews the work.
              <br />
              <span className="text-[#636b74]">You control the money.</span>
            </h2>

            <p className="mt-7 max-w-lg text-base leading-7 text-[#8e969f]">
              Pactra compares a freelancer&apos;s submission against milestone
              requirements and produces an advisory review. It cannot approve a
              payment or move escrow funds.
            </p>

            <div className="mt-10 space-y-4">
              {[
                "Requirement-by-requirement analysis",
                "Matched and missing deliverables",
                "Approve, revision, or manual-review recommendation",
                "Client always makes the final decision",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#c7ff1a]/30 bg-[#c7ff1a]/10 text-[10px] text-[#c7ff1a]">
                    ✓
                  </span>
                  <span className="text-sm text-[#b2b8be]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pactra-reveal rounded-[22px] border border-[#2a2f35] bg-[#111418] p-3">
            <div className="rounded-[16px] border border-[#24282d] bg-[#0b0d0f] p-5 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">AI Review</p>
                  <p className="mt-1 text-xs text-[#636b74]">
                    Example milestone analysis
                  </p>
                </div>

                <span className="rounded-full border border-[#ffb547]/20 bg-[#ffb547]/10 px-2.5 py-1 text-[11px] text-[#ffb547]">
                  Revision suggested
                </span>
              </div>

              <div className="mt-7">
                <div className="flex items-end justify-between">
                  <span className="text-xs text-[#8e969f]">
                    Requirement coverage
                  </span>
                  <span className="font-mono text-sm text-white">3 / 4</span>
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#24282d]">
                  <div className="h-full w-3/4 rounded-full bg-[#c7ff1a]" />
                </div>
              </div>

              <div className="mt-7 space-y-2">
                {[
                  ["✓", "Responsive landing page", true],
                  ["✓", "Hero section", true],
                  ["✓", "Pricing section", true],
                  ["!", "FAQ section missing", false],
                ].map(([icon, label, match]) => (
                  <div
                    key={String(label)}
                    className="flex items-center gap-3 rounded-lg border border-[#24282d] bg-[#111418] px-3.5 py-3"
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] ${
                        match
                          ? "bg-[#43d17b]/10 text-[#43d17b]"
                          : "bg-[#ffb547]/10 text-[#ffb547]"
                      }`}
                    >
                      {icon}
                    </span>

                    <span className="text-sm text-[#b2b8be]">{label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-[#24282d] pt-5">
                <p className="text-[11px] uppercase tracking-[0.12em] text-[#636b74]">
                  Final action
                </p>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button className="rounded-lg border border-[#343a40] bg-[#161a1f] px-3 py-3 text-xs text-white">
                    Request revision
                  </button>

                  <button className="rounded-lg bg-[#c7ff1a] px-3 py-3 text-xs font-semibold text-black">
                    Approve & release
                  </button>
                </div>

                <p className="mt-3 text-center text-[10px] text-[#636b74]">
                  Payment actions require the client wallet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NETWORK */}
      <section id="network" className="pactra-grid border-b border-[#24282d]">
        <div className="mx-auto max-w-[1240px] px-6 py-28 lg:px-8 lg:py-36">
          <div className="pactra-reveal text-center">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#c7ff1a]">
              Settlement layer
            </p>

            <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
              Built on Arbitrum.
              <span className="text-[#636b74]"> Verifiable by design.</span>
            </h2>
          </div>

          <div className="pactra-reveal mt-16 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-[#24282d] bg-[#111418] p-6">
              <p className="text-xs uppercase tracking-[0.12em] text-[#636b74]">
                PactFactory
              </p>

              <p className="mt-8 font-mono text-sm text-white">
                0xC41d...074e
              </p>

              <p className="mt-3 text-xs leading-5 text-[#636b74]">
                Deploys and indexes Pact escrow agreements.
              </p>
            </div>

            <div className="rounded-2xl border border-[#24282d] bg-[#111418] p-6">
              <p className="text-xs uppercase tracking-[0.12em] text-[#636b74]">
                Payment token
              </p>

              <p className="mt-8 text-xl font-semibold">mUSDC</p>

              <p className="mt-3 text-xs leading-5 text-[#636b74]">
                Mock USDC used for the Arbitrum Sepolia demo.
              </p>
            </div>

            <div className="rounded-2xl border border-[#24282d] bg-[#111418] p-6">
              <p className="text-xs uppercase tracking-[0.12em] text-[#636b74]">
                Network
              </p>

              <div className="mt-8 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#43d17b]" />
                <p className="text-xl font-semibold">Arbitrum Sepolia</p>
              </div>

              <p className="mt-3 text-xs leading-5 text-[#636b74]">
                Chain ID 421614 · live testnet deployment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c7ff1a]/[0.045] blur-[130px]" />

        <div className="pactra-reveal relative mx-auto flex max-w-[1240px] flex-col items-center px-6 py-32 text-center lg:px-8 lg:py-44">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#c7ff1a]">
            Pactra
          </p>

          <h2 className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-0.05em] md:text-7xl">
            Stop relying on promises.
            <br />
            <span className="text-[#636b74]">Make a Pact.</span>
          </h2>

          <p className="mt-7 max-w-xl text-base leading-7 text-[#8e969f]">
            Secure the agreement, verify the work, and settle milestone
            payments onchain.
          </p>

          <Link
            href="/dashboard"
            className="group mt-10 inline-flex items-center gap-3 rounded-lg bg-[#c7ff1a] px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-[#d4ff4c]"
          >
            Launch Pactra
            <span className="transition group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#24282d]">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#c7ff1a] text-xs font-bold text-black">
              P
            </div>

            <div>
              <p className="text-sm font-medium">Pactra</p>
              <p className="text-xs text-[#636b74]">
                Work. Verify. Get paid.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#636b74]">
            <span>Built on</span>
            <span className="text-[#b2b8be]">Arbitrum</span>
            <span>·</span>
            <span>Hackathon MVP</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
