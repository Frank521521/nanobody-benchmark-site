import type { Metadata } from 'next';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';

const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const socialImage = new URL(`${basePath}/og.png`, siteOrigin).toString();
const canonicalUrl = new URL(`${basePath}/releases/`, siteOrigin).toString();

export const metadata: Metadata = {
  title: 'Release Preview | Nanobody Design Benchmark',
  description: 'Preview of the versioned release structure, data contract and changelog. Demo values only.',
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: 'Release Preview | Nanobody Design Benchmark',
    description: 'Versioned release framework with fictional demo values.',
    url: canonicalUrl,
    images: [{ url: socialImage, width: 1200, height: 630, alt: 'Nanobody Design Benchmark demo preview' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Release Preview | Nanobody Design Benchmark',
    description: 'Versioned release framework with fictional demo values.',
    images: [socialImage],
  },
};

const contract = [
  ['release.json', 'Dataset, protocol, source date and checksums'],
  ['models.json', 'Model identity, exact version and access metadata'],
  ['tasks.json', 'Task, target, metric, direction and eligibility rules'],
  ['scores.json', 'Per-target and precomputed aggregate values, CI, coverage, n and missingness'],
  ['samples/*.json', 'Anonymous sample-level metrics loaded on demand'],
];

export default function ReleasesPage() {
  return (
    <main>
      <SiteHeader active="releases" />
      <section className="subpage-hero releases-hero">
        <p className="eyebrow"><span /> Immutable result snapshots</p>
        <h1>One URL for every<br /><em>version of the truth.</em></h1>
        <p>New data can move the field forward without silently changing the results cited by an earlier report or paper.</p>
      </section>

      <section className="release-list">
        <article className="release-entry is-current">
          <div className="release-version"><span>Preview</span><strong>v0.1</strong><small>September 2026</small></div>
          <div className="release-detail">
            <p className="eyebrow"><span /> Current framework</p>
            <h2>Interface preview</h2>
            <p>Establishes the navigation, leaderboard behavior, model comparison, methodology structure and data boundaries before real results are imported.</p>
            <ul>
              <li>Five fictional models and three fictional target views</li>
              <li>Four independent task rankings</li>
              <li>Official and provisional eligibility states</li>
              <li>No generated protein sequences published</li>
            </ul>
            <span className="demo-badge">Do not cite · demo values</span>
          </div>
        </article>

        <article className="release-entry is-future">
          <div className="release-version"><span>Planned</span><strong>v1.0</strong><small>After data validation</small></div>
          <div className="release-detail">
            <p className="eyebrow"><span /> First evidence release</p>
            <h2>Validated benchmark results</h2>
            <p>The first citable release will replace all demo values, publish the frozen protocol and attach checksums to every public result artifact.</p>
          </div>
        </article>
      </section>

      <section className="contract-section">
        <div>
          <p className="eyebrow"><span /> Public data contract</p>
          <h2>Swap the data,<br /><em>keep the interface.</em></h2>
          <p>Each release uses the same small set of versioned files. The website reads aggregate data first and loads anonymous sample results only when requested.</p>
        </div>
        <div className="contract-table">
          {contract.map(([file, purpose]) => (
            <div key={file}><code>{file}</code><p>{purpose}</p></div>
          ))}
        </div>
      </section>

      <section className="version-rules">
        <article><span>Major</span><strong>Protocol-breaking change</strong><p>New split, scoring definition or incompatible benchmark unit.</p></article>
        <article><span>Minor</span><strong>Compatible expansion</strong><p>New task, target or metric without changing prior results.</p></article>
        <article><span>Patch</span><strong>Result or metadata update</strong><p>New model submission or a correction that keeps the protocol intact.</p></article>
      </section>
      <SiteFooter />
    </main>
  );
}
