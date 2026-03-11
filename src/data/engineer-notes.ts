export const NOTES = [
  {
    index: "01",
    cat: "Architecture",
    date: "Feb 2026",
    title: "The Real Cost of Abstraction Layers",
    summary:
      "Every abstraction is a bet that the future resembles today's assumptions. The best codebases delay generalization until a pattern emerges three times — premature abstraction creates coupling that is invisible during development and punishing during scale.",
    expanded:
      "Working on the PropTech CRM backend reinforced this: the impulse to genericize the lead-ingestion layer early would have hardened assumptions about source format and frequency. Instead, keeping it concrete through the first two integrations revealed the actual shape of the abstraction. The resulting module was half the code and far more resilient.",
    meta: "Architecture · System Design · Backend",
  },
  {
    index: "02",
    cat: "Performance",
    date: "Jan 2026",
    title: "Latency as a Product Personality",
    summary:
      "When we optimized the CRM API layer from ~340ms to ~67ms median response, the shift wasn't just in metrics — it changed how users described the product. Response time is the system speaking before any UI element does. Engineers who treat it as purely technical miss a product lever.",
    expanded:
      "The optimization path combined scheduled caching for high-frequency lookups, upsert-based DB sync to remove redundant writes, and moving non-critical tasks into async background jobs. Each change was small; the compound effect was a 40% throughput improvement. The lesson: latency budgets belong in product specs, not post-incident reviews.",
    meta: "Performance · Infrastructure · API Design",
  },
  {
    index: "03",
    cat: "Reliability",
    date: "Nov 2025",
    title: "Designing Systems That Fail Gracefully",
    summary:
      "The failures that cause the most damage are never in the runbook. Building the Jobra AI ATS taught me that robustness comes not from predicting every failure mode, but from designing recovery paths that work even for surprises.",
    expanded:
      "Distributed pipelines processing applicant data across ML scoring, storage, and notification layers are inherently fault-prone. We treated every anomaly as a signal, not noise — implementing circuit breakers, idempotent retry logic, and structured degradation paths. The result was a system that maintained 99.9% uptime without requiring perfect upstream behaviour.",
    meta: "Reliability · Distributed Systems · ATS",
  },
  {
    index: "04",
    cat: "Systems",
    date: "Oct 2025",
    title: "Event Schemas Are Contracts in Disguise",
    summary:
      "Async event systems feel decoupled at the interface but are semantically coupled beneath. Changing what an event means is harder than changing a synchronous API — the feedback loop is slower and the blast radius much larger.",
    expanded:
      "This surfaced during Jobra AI's recruiter pipeline refactor. Events emitted by the ML scoring layer were consumed by three downstream systems. A silent schema drift caused a reporting discrepancy that took two days to trace. Since then, schema versioning and consumer-aware migration paths are non-negotiables in any event-driven architecture I design.",
    meta: "Architecture · Events · Domain Design",
  },
];
