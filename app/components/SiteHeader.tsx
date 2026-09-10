type Props = { active?: 'leaderboard' | 'methodology' | 'releases' };

export function SiteHeader({ active }: Props) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  return (
    <header className="site-header">
      <a className="brand" href={`${basePath}/`} aria-label="Nanobody Design Benchmark home">
        <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
        <span>NDB<span className="brand-muted"> / benchmark</span></span>
      </a>
      <nav aria-label="Primary navigation">
        <a className={active === 'leaderboard' ? 'nav-active' : ''} href={`${basePath}/#leaderboard`}>Leaderboard</a>
        <a className={active === 'methodology' ? 'nav-active' : ''} href={`${basePath}/methodology/`}>Methodology</a>
        <a className={active === 'releases' ? 'nav-active' : ''} href={`${basePath}/releases/`}>Releases</a>
      </nav>
      <a className="header-link" href={`${basePath}/methodology/`}>View protocol <span aria-hidden="true">↗</span></a>
    </header>
  );
}
