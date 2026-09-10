# Nanobody Design Benchmark — website framework

This is a data-ready preview of an independent benchmark website for target-conditioned nanobody generation models. Every score currently shown is fictional and labelled as demo data.

## Local preview

```bash
npm install
npm run dev
```

## Builds

```bash
npm run build        # Sites-compatible build
npm run build:pages  # static export for GitHub Pages
```

For a GitHub project site, set both `PAGES_BASE_PATH` and `NEXT_PUBLIC_BASE_PATH` to `/<repository-name>` while building. Set `NEXT_PUBLIC_SITE_URL` to the trusted deployment origin so social metadata uses absolute URLs.

This directory is intentionally self-contained and can be published as its own repository. The included `.github/workflows/pages.yml` validates pull requests and deploys pushes to `main` or `master`. Do not publish the parent research workspace when you only want to share the website template.

The Pages workflow also injects the repository URL, so the deployed footer displays a **Send feedback** link. Reviewers can submit structured comments through the included website-feedback issue template.

## Replacing the demo data

The preview dataset and its types live in `app/data/demo-benchmark.ts`. Every task × target observation carries its own value, 95% CI, coverage, sample count and availability state. “All targets” reads a precomputed macro/micro aggregate rather than averaging values in the UI. When real results arrive, replace the demo module with a generated, schema-validated release module without changing the page components.

The preview is deliberately marked `noindex` and all share metadata says that values are fictional. Before the first citable release, update the metadata in `app/layout.tsx`, regenerate `public/og.png`, and remove the robots block only after the data and protocol have been validated.

Full generated sequences are intentionally excluded from the public interface. The future ingestion step should emit anonymous sample IDs and public metrics only.

## Attribution

This work used Proteinbase by Adaptyv Bio under ODC-BY license. This is an independent project and is not affiliated with or endorsed by ProteinBase.
