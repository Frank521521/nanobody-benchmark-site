'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';
import {
  demoModels,
  resultFor,
  scoreFor,
  targets,
  tasks,
  type DemoModel,
  type TargetKey,
  type TaskKey,
} from './data/demo-benchmark';

type SelectedTarget = TargetKey | 'All targets';

export default function Home() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  const [taskKey, setTaskKey] = useState<TaskKey>('binding');
  const [target, setTarget] = useState<SelectedTarget>('All targets');
  const [query, setQuery] = useState('');
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [activeModel, setActiveModel] = useState<DemoModel | null>(null);
  const pageContentRef = useRef<HTMLElement>(null);
  const modalRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const task = tasks.find((item) => item.key === taskKey) ?? tasks[0];
  const rankedModels = useMemo(() => {
    return demoModels
      .filter((model) => `${model.name} ${model.lab}`.toLowerCase().includes(query.toLowerCase()))
      .map((model) => ({ model, result: resultFor(model, taskKey, target) }))
      .sort((a, b) => task.direction === 'higher' ? b.result.value - a.result.value : a.result.value - b.result.value);
  }, [query, target, task.direction, taskKey]);

  const compared = selectedModels.length
    ? demoModels.filter((model) => selectedModels.includes(model.id))
    : rankedModels.slice(0, 3).map(({ model }) => model);
  const chartMax = Math.max(...compared.map((model) => scoreFor(model, taskKey, target)), 1);

  useEffect(() => {
    if (!activeModel) return;

    const previousOverflow = document.body.style.overflow;
    const pageContent = pageContentRef.current;
    pageContent?.setAttribute('inert', '');
    document.body.style.overflow = 'hidden';
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveModel(null);
        return;
      }

      if (event.key !== 'Tab' || !modalRef.current) return;
      const focusable = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      pageContent?.removeAttribute('inert');
      document.body.style.overflow = previousOverflow;
      lastTriggerRef.current?.focus();
    };
  }, [activeModel]);

  const toggleCompare = (modelId: string) => {
    setSelectedModels((current) => {
      if (current.includes(modelId)) return current.filter((id) => id !== modelId);
      if (current.length >= 3) return [...current.slice(1), modelId];
      return [...current, modelId];
    });
  };

  return (
    <>
    <main ref={pageContentRef}>
      <SiteHeader active="leaderboard" />

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Independent research benchmark</p>
          <h1>Nanobody design,<br /><em>measured in the open.</em></h1>
          <p className="hero-intro">
            A transparent, target-aware evaluation of generative protein models—from binding quality to sequence diversity.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#leaderboard">Explore results <span>↓</span></a>
            <a className="text-link" href={`${basePath}/methodology/`}>Read the methodology <span>→</span></a>
          </div>
        </div>

        <aside className="release-card" aria-label="Current benchmark release">
          <div className="release-topline">
            <span>Current release</span>
            <span className="demo-badge">Demo data</span>
          </div>
          <strong>v0.1 preview</strong>
          <div className="sequence-art" aria-hidden="true">
            <span>QVQLVESGGGLVQ</span><b>RG</b><span>SLRLSCAAS</span><b>GF</b>
          </div>
          <dl className="release-stats">
            <div><dt>Models</dt><dd>05</dd></div>
            <div><dt>Targets</dt><dd>03</dd></div>
            <div><dt>Runs</dt><dd>13</dd></div>
          </dl>
          <p>Framework preview · values are illustrative</p>
        </aside>
      </section>

      <section className="principles" aria-label="Benchmark principles">
        <div><span>01</span><p><strong>Task-specific ranks</strong>No misleading composite score.</p></div>
        <div><span>02</span><p><strong>Uncertainty included</strong>Coverage and confidence shown.</p></div>
        <div><span>03</span><p><strong>Versioned evidence</strong>Every result stays traceable.</p></div>
      </section>

      <section className="leaderboard-section" id="leaderboard">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span /> Target-conditioned generation</p>
            <h2>{task.metric}</h2>
            <p className="section-description">{task.description}</p>
          </div>
          <div className="metric-note"><span>{task.direction === 'higher' ? '↑' : '↓'}</span> {task.direction === 'higher' ? 'Higher' : 'Lower'} is better</div>
        </div>

        <div className="task-tabs" role="group" aria-label="Benchmark task">
          {tasks.map((item) => (
            <button
              className={item.key === taskKey ? 'is-selected' : ''}
              key={item.key}
              onClick={() => setTaskKey(item.key)}
              aria-pressed={item.key === taskKey}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="table-shell">
          <div className="table-toolbar">
            <label>
              <span>Target</span>
              <select value={target} onChange={(event) => setTarget(event.target.value as SelectedTarget)}>
                <option>All targets</option>
                {targets.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="search-control">
              <span className="sr-only">Search models</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search model or lab" />
            </label>
            <span className="evidence-filter">Evidence <strong>In silico</strong></span>
            <span className="updated">Updated Sep 2026</span>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr><th>Compare</th><th>Rank</th><th>Model</th><th>Score</th><th>95% CI</th><th>Coverage</th><th>Evaluated n</th><th>Status</th></tr>
              </thead>
              <tbody>
                {rankedModels.map(({ model, result }, index) => {
                  const officialRank = model.status === 'Official'
                    ? rankedModels.slice(0, index + 1).filter((entry) => entry.model.status === 'Official').length
                    : '—';
                  return (
                    <tr key={model.id}>
                      <td>
                        <label className="compare-check" title="Add model to comparison">
                          <input
                            type="checkbox"
                            checked={selectedModels.includes(model.id)}
                            onChange={() => toggleCompare(model.id)}
                            aria-label={`Compare ${model.name}`}
                          />
                          <span />
                        </label>
                      </td>
                      <td className="rank">{officialRank}</td>
                      <td>
                        <button
                          className="model-link"
                          onClick={(event) => {
                            lastTriggerRef.current = event.currentTarget;
                            setActiveModel(model);
                          }}
                        >
                          <strong>{model.name}</strong><small>{model.lab} · {model.family}</small>
                        </button>
                      </td>
                      <td className="score">{result.value.toFixed(1)}{task.unit}</td>
                      <td>±{result.ci95.toFixed(1)}</td>
                      <td>{result.coverage}%</td>
                      <td>{result.sampleCount}</td>
                      <td><span className={`status ${model.status === 'Official' ? 'official' : ''}`}>{model.status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!rankedModels.length && <p className="empty-state">No demo models match this search.</p>}
          <p className="demo-note">Preview only. These values are intentionally fictional and will be replaced by validated benchmark releases.</p>
        </div>

        <div className="compare-panel" aria-label="Model comparison">
          <div className="compare-copy">
            <p className="eyebrow"><span /> Compare view</p>
            <h3>{selectedModels.length ? `${selectedModels.length} selected models` : 'Top three models'}</h3>
            <p>Select up to three rows above. The chart follows the active task and target without creating a second, incompatible ranking.</p>
            {selectedModels.length > 0 && <button className="clear-button" onClick={() => setSelectedModels([])}>Clear selection</button>}
          </div>
          <div className="bar-chart">
            {compared.map((model) => {
              const value = scoreFor(model, taskKey, target);
              return (
                <div className="bar-row" key={model.id}>
                  <div className="bar-label"><strong>{model.name}</strong><span>{value.toFixed(1)}{task.unit}</span></div>
                  <div className="bar-track"><span style={{ width: `${(value / chartMax) * 100}%`, background: model.color }} /></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="targets-section">
        <div className="targets-intro">
          <p className="eyebrow"><span /> One benchmark, multiple views</p>
          <h2>Read the result,<br /><em>not just the rank.</em></h2>
          <p>Every release keeps task definition, target coverage, run metadata and evidence type beside the number.</p>
          <a className="text-link" href={`${basePath}/methodology/`}>See the evaluation protocol <span>→</span></a>
        </div>
        <div className="target-grid">
          {targets.map((item, index) => (
            <button className="target-card" key={item} onClick={() => { setTarget(item); document.getElementById('leaderboard')?.scrollIntoView(); }}>
              <span>0{index + 1} / target</span>
              <strong>{item}</strong>
              <p>{index === 0 ? 'Receptor-targeted design' : index === 1 ? 'Immune checkpoint design' : 'Growth-factor receptor design'}</p>
              <i aria-hidden="true">↗</i>
            </button>
          ))}
          <div className="target-card protocol-card">
            <span>Protocol / coverage</span>
            <strong>100%</strong>
            <p>Required for an official rank</p>
            <i aria-hidden="true">✓</i>
          </div>
        </div>
      </section>

      <section className="about-strip">
        <p>Built for reproducible comparison</p>
        <h2>Every score should answer three questions: <em>what was measured, how, and on which version?</em></h2>
        <div className="about-actions">
          <a className="button button-dark" href={`${basePath}/methodology/`}>Review methodology <span>→</span></a>
          <a className="button button-outline" href={`${basePath}/releases/`}>Browse releases <span>→</span></a>
        </div>
      </section>

      <SiteFooter />
    </main>

      {activeModel && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setActiveModel(null)}>
          <section ref={modalRef} className="model-modal" role="dialog" aria-modal="true" aria-labelledby="model-title" onMouseDown={(event) => event.stopPropagation()}>
            <button ref={closeButtonRef} className="modal-close" onClick={() => setActiveModel(null)} aria-label="Close model details">×</button>
            <p className="eyebrow"><span /> Demo model card</p>
            <h2 id="model-title">{activeModel.name}</h2>
            <p className="model-description">{activeModel.description}</p>
            <dl className="model-meta">
              <div><dt>Developer</dt><dd>{activeModel.lab}</dd></div>
              <div><dt>Architecture</dt><dd>{activeModel.family}</dd></div>
              <div><dt>Parameters</dt><dd>{activeModel.parameters}</dd></div>
              <div><dt>Access</dt><dd>{activeModel.access}</dd></div>
              <div><dt>Evaluated runs</dt><dd>{activeModel.runs}</dd></div>
              <div><dt>Submission coverage</dt><dd>{activeModel.coverage}%</dd></div>
            </dl>
            <div className="mini-scores">
              {tasks.map((item) => {
                const value = scoreFor(activeModel, item.key, 'All targets');
                return (
                  <div key={item.key}>
                    <span>{item.shortMetric}</span><strong>{value.toFixed(1)}{item.unit}</strong>
                    <i><b style={{ width: `${value}%`, background: activeModel.color }} /></i>
                  </div>
                );
              })}
            </div>
            <p className="modal-note">All model metadata and results shown in this preview are fictional.</p>
          </section>
        </div>
      )}
    </>
  );
}
