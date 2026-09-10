import type { Metadata } from 'next';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';

const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const socialImage = new URL(`${basePath}/og.png`, siteOrigin).toString();
const canonicalUrl = new URL(`${basePath}/methodology/`, siteOrigin).toString();

const steps = [
  {
    number: '01',
    title: 'Freeze the benchmark unit',
    text: 'Every result names one dataset snapshot, split, target, protocol version and evaluator version. Cross-version results never share a rank.',
  },
  {
    number: '02',
    title: 'Run the same protocol',
    text: 'Stochastic generators use at least three independent runs. Decoding settings, sample count, hardware and random seeds remain attached to the result.',
  },
  {
    number: '03',
    title: 'Compute task-level scores',
    text: 'Each task declares its own primary metric and direction. The evaluation pipeline exports per-target values and a precomputed macro or micro aggregate with its own interval, coverage and sample count. Missing values are never converted to zero.',
  },
  {
    number: '04',
    title: 'Publish an immutable release',
    text: 'Validated aggregate and anonymous sample-level results are written to a versioned snapshot with checksums and a permanent changelog.',
  },
];

export const metadata: Metadata = {
  title: 'Methodology Preview | Nanobody Design Benchmark',
  description: 'Draft evaluation protocol, ranking policy and evidence boundaries. Not a finalized benchmark claim.',
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: 'Methodology Preview | Nanobody Design Benchmark',
    description: 'Draft evaluation protocol for a future benchmark release.',
    url: canonicalUrl,
    images: [{ url: socialImage, width: 1200, height: 630, alt: 'Nanobody Design Benchmark demo preview' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Methodology Preview | Nanobody Design Benchmark',
    description: 'Draft evaluation protocol for a future benchmark release.',
    images: [socialImage],
  },
};

export default function MethodologyPage() {
  return (
    <main>
      <SiteHeader active="methodology" />
      <section className="subpage-hero methodology-hero">
        <p className="eyebrow"><span /> Protocol draft · v0.1</p>
        <h1>Make every result<br /><em>traceable by design.</em></h1>
        <p>This page is the framework for the final scientific protocol. Exact formulas and thresholds will be inserted when the real evaluation files arrive.</p>
      </section>

      <section className="method-steps">
        {steps.map((step) => (
          <article key={step.number}>
            <span>{step.number}</span>
            <div><h2>{step.title}</h2><p>{step.text}</p></div>
          </article>
        ))}
      </section>

      <section className="taxonomy-section">
        <div>
          <p className="eyebrow"><span /> Metric taxonomy</p>
          <h2>Four questions,<br /><em>four separate views.</em></h2>
        </div>
        <div className="taxonomy-grid">
          <article><span>Quality</span><h3>Does it meet the target objective?</h3><p>Binding and affinity metrics, clearly labelled by evaluator and evidence type.</p></article>
          <article><span>Developability</span><h3>Can the candidate be worked with?</h3><p>Expression and other declared developability criteria, without silent imputation.</p></article>
          <article><span>Novelty</span><h3>Is it distinct from the reference set?</h3><p>The final release will state the reference database, identity method and exact threshold.</p></article>
          <article><span>Diversity</span><h3>Is the generated set internally varied?</h3><p>Within-target diversity is reported separately from novelty against known sequences.</p></article>
        </div>
      </section>

      <section className="evidence-section">
        <div className="evidence-copy">
          <p className="eyebrow"><span /> Evidence boundary</p>
          <h2>Prediction is not experiment.</h2>
          <p>Computational scores and experimental measurements receive separate labels, filters and rankings. A model cannot inherit an “experimental” claim from an in-silico evaluator.</p>
        </div>
        <div className="evidence-diagram" aria-label="Evidence stages">
          <div><span>01</span><strong>Generated candidate</strong><small>Anonymous sample ID</small></div>
          <i>→</i>
          <div><span>02</span><strong>In-silico evaluation</strong><small>Evaluator + version</small></div>
          <i>→</i>
          <div><span>03</span><strong>Experimental result</strong><small>Assay + provenance</small></div>
        </div>
      </section>

      <section className="protocol-note">
        <span>Important</span>
        <p>The current protocol text is a product-framework draft, not a final scientific claim. Demo scores must not be cited.</p>
      </section>
      <SiteFooter />
    </main>
  );
}
