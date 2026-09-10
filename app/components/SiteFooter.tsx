export function SiteFooter() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  const repositoryUrl = process.env.NEXT_PUBLIC_REPOSITORY_URL;
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
        <strong>Nanobody Design Benchmark</strong>
      </div>
      <p>
        Independent research project. This work used Proteinbase by Adaptyv Bio under ODC-BY license.
        Not affiliated with or endorsed by ProteinBase.
      </p>
      <div className="footer-links">
        <a href={`${basePath}/methodology/`}>Methodology</a>
        <a href={`${basePath}/releases/`}>Releases</a>
        {repositoryUrl && <a href={`${repositoryUrl}/issues/new?template=site-feedback.yml`} target="_blank" rel="noreferrer">Send feedback ↗</a>}
        <a href="https://proteinbase.com/download" target="_blank" rel="noreferrer">Data source ↗</a>
      </div>
    </footer>
  );
}
