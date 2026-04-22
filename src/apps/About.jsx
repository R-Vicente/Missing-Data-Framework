/* global React, PAPER */
const { useState: useStateAbout } = React;

function About() {
  return (
    <div className="about-root">
      <div className="about-hero">
        <div className="about-kicker">Research paper · {PAPER.field}</div>
        <h1 className="about-title">{PAPER.title}</h1>
        <div className="about-authors">
          {PAPER.authors.map((a, i) => (
            <span key={a.name}>
              {i > 0 ? ", " : ""}
              {a.name}
              <sup>{a.aff}</sup>
            </span>
          ))}
          {" · "}
          <a href={PAPER.affiliations[0].url} target="_blank" rel="noreferrer">
            {PAPER.affiliations[0].name}
          </a>
          {" · "}
          {PAPER.year}
        </div>
      </div>

      <div className="about-body">
        <h3>Abstract</h3>
        <p>{PAPER.abstract}</p>

        <h3>About this landing page</h3>
        <p>
          This site hosts supplementary material for the paper: extended result
          tables that did not fit in the main manuscript, figures, and the
          full analysis code used to produce them. Everything is organised as a
          virtual desktop — open the <strong>Tables</strong>, <strong>Charts</strong>,
          and <strong>Code</strong> folders from the desktop or Start menu.
        </p>

        <p>
          The <strong>Tables</strong> folder contains all 12 result tables, including
          the complete NRMSE values across four normalisations, all five amputation
          conditions, degradation curves across six missingness rates, PFC results
          for mixed-type datasets, and the Friedman/Nemenyi statistical test summaries.
          Each table can be downloaded as CSV.
        </p>

        <p>
          The <strong>Code</strong> folder contains the full source code needed to
          reproduce every experiment reported in the paper: the <code>utils.py</code> library
          (dataset loaders, imputation methods, amputation algorithms, metrics, and
          statistical tests) and the <code>nb_master_compute.py</code> driver script.
          All files can be downloaded individually or together.
        </p>

        <div className="about-meta">
          <div className="cell"><div className="k">Field</div><div className="v">{PAPER.field}</div></div>
          <div className="cell"><div className="k">Year</div><div className="v">{PAPER.year}</div></div>
          <div className="cell"><div className="k">Datasets</div><div className="v">12</div></div>
          <div className="cell"><div className="k">Methods compared</div><div className="v">6</div></div>
          <div className="cell"><div className="k">Replicates</div><div className="v">100</div></div>
          <div className="cell"><div className="k">Affiliation</div>
            <div className="v">
              <a href={PAPER.affiliations[0].url} target="_blank" rel="noreferrer">
                {PAPER.affiliations[0].name}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.About = About;
