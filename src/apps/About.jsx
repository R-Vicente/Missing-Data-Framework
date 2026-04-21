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
          analysis code used to produce them. Everything is organised as a
          virtual desktop — open the <strong>Tables</strong>, <strong>Charts</strong>,
          and <strong>Code</strong> folders from the desktop or Start menu.
        </p>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
          odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla
          quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent
          mauris. Fusce nec tellus sed augue semper porta. Mauris massa.
          Vestibulum lacinia arcu eget nulla.
        </p>

        <p>
          Class aptent taciti sociosqu ad litora torquent per conubia nostra,
          per inceptos himenaeos. Curabitur sodales ligula in libero. Sed
          dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean
          quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis
          tristique sem. Proin ut ligula vel nunc egestas porttitor.
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
