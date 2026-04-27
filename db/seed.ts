import { db } from '@/lib/db';
import { craftItems, edgeRows, faqItems } from './schema';

// Seeds the three editable-content tables from the same arrays that originally
// lived inline in the page JSX. Idempotent: clears each table first, then inserts.
// Run with: npm run db:seed

const craftSeed = [
  {
    ord: 1,
    number: '01',
    title: 'SaaS platforms',
    meta: 'B2B · multi tenant',
    scene: 'saas',
    body: 'Subscription software your customers log into every day. We build the full stack: tenants, billing, admin, audit logs.',
    bullets: [
      'Login, roles, multi tenant data isolation',
      'Subscription billing + usage metering',
      'Admin console for your team',
      'Audit logs and compliance hooks',
    ],
  },
  {
    ord: 2,
    number: '02',
    title: 'AI applications',
    meta: 'LLM · agents · RAG',
    scene: 'ai',
    body: 'Software that puts AI to real work: chat over your documents, agents that take action, automation that holds up in production.',
    bullets: [
      'Chat over your docs (RAG)',
      'Agents that take real actions',
      'Eval harness so you know it works',
      'Cost and latency tuning',
    ],
  },
  {
    ord: 3,
    number: '03',
    title: 'Web applications',
    meta: 'React · Next · TS',
    scene: 'web',
    body: 'Websites that do something, not brochures. Bookings, dashboards, marketplaces, internal tools that move the needle.',
    bullets: [
      'Marketing sites with a CMS',
      'Internal tools and dashboards',
      'Marketplaces and two sided platforms',
      'High traffic landing pages',
    ],
  },
  {
    ord: 4,
    number: '04',
    title: 'Mobile apps',
    meta: 'iOS · Android · RN',
    scene: 'mobile',
    body: 'Apps your users install from the App Store and Play. Native when the experience demands it, React Native when one codebase fits.',
    bullets: [
      'iOS and Android in one codebase',
      'Push notifications and deep links',
      'Offline first sync',
      'Store submission and review handling',
    ],
  },
  {
    ord: 5,
    number: '05',
    title: 'Rapid prototyping',
    meta: 'Idea to clickable in 7 days',
    scene: 'proto',
    body: 'Idea to real working software in seven days. Real screens, real flows, real URL. Demo it Monday.',
    bullets: [
      'Day 1 to 2: scoping and flow design',
      'Day 3 to 6: build',
      'Day 7: live URL with walkthrough',
      'Fixed price, no surprises',
    ],
  },
  {
    ord: 6,
    number: '06',
    title: 'A to Z delivery',
    meta: 'Discovery · build · scale',
    scene: 'az',
    body: 'One vendor for the full lifecycle: discovery, design, build, launch, monitoring. One contract, one Slack channel.',
    bullets: [
      'Discovery and user research',
      'Brand, design, content',
      'Engineering and QA',
      'Hosting, monitoring, on call',
    ],
  },
];

const faqSeed = [
  {
    ord: 1,
    question: 'Why a dubai studio? Where are your clients based?',
    answer:
      "We're based in Dubai and we work with clients all over the world. The timezone gives us comfortable overlap with most regions, and we run async-first regardless.",
  },
  {
    ord: 2,
    question: 'How fast can you actually start?',
    answer:
      "For most projects: within a week. We keep one squad on rotation specifically for new engagements. Book a scoping call and you'll have a brief, a quote, and a start date in 48 hours.",
  },
  {
    ord: 3,
    question: 'How do you use modern tooling in the work?',
    answer:
      "Sparingly and pragmatically. Senior engineers own architecture, judgment calls, and review. Modern tooling helps with the supporting work: scaffolding, migrations, test fixtures, documentation. The output is the same shape as a traditional studio's work, with throughput that is roughly 2 to 3 times faster.",
  },
  {
    ord: 4,
    question: 'Who owns the code and IP?',
    answer:
      'You do. Full source, full IP, full repository access from day one. We keep nothing proprietary. Hand-off includes documentation, deploy runbooks, and a 30-day support window for free.',
  },
  {
    ord: 5,
    question: 'What stacks do you work in?',
    answer:
      "Web: TypeScript, React, Next.js, Node, Python, Go. Mobile: Swift, Kotlin, React Native. AI: anything that ships, from OpenAI and Anthropic to open-weights and custom fine-tunes. We'll match your team's stack if you have one.",
  },
  {
    ord: 6,
    question: 'Can you take over a stalled project?',
    answer:
      'Often, yes. We start with a one-week audit (fixed price), give you a candid assessment, and only continue if we believe we can help. About a third of our work is rescue engagements.',
  },
  {
    ord: 7,
    question: 'Do you sign NDAs and DPAs?',
    answer:
      'Always. We also work under custom MSAs, GDPR DPAs, and SOC 2 / ISO-aligned controls when required. Compliance docs available on request.',
  },
];

const edgeSeed = [
  { ord: 1, dimension: 'Engineering team',  us: 'Only senior engineers (10+ yrs)',          them: 'Senior lead, mid + junior delivery' },
  { ord: 2, dimension: 'Time to prototype', us: '7 days, working software',                 them: '4 to 8 weeks of discovery' },
  { ord: 3, dimension: 'Code & IP',         us: 'Yours from day 1, full repo access',       them: 'Handed over at end, sometimes' },
  { ord: 4, dimension: 'Review culture',    us: 'Senior review on every commit',            them: 'Lead review at milestones, if at all' },
  { ord: 5, dimension: 'Hand-off',          us: 'Runbooks, monitoring, 30-day support',     them: 'Slack channel that goes quiet' },
  { ord: 6, dimension: 'Engagement model',  us: 'Bespoke scope, shaped to your business',   them: 'Fixed playbook, applied to every client' },
];

async function main() {
  console.log('Clearing editable-content tables...');
  await db.delete(craftItems);
  await db.delete(faqItems);
  await db.delete(edgeRows);

  console.log(`Inserting ${craftSeed.length} craft items...`);
  await db.insert(craftItems).values(craftSeed);

  console.log(`Inserting ${faqSeed.length} faq items...`);
  await db.insert(faqItems).values(faqSeed);

  console.log(`Inserting ${edgeSeed.length} edge rows...`);
  await db.insert(edgeRows).values(edgeSeed);

  console.log('Seed complete.');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
