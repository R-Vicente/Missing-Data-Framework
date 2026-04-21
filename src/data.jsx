/* global React */
// Shared data for the whole app.

const PAPER = {
  title: "Toward a Standardized Framework for Missing Data Imputation Benchmarking",
  authors: [
    { name: "Ricardo Vicente", aff: 1 },
    { name: "Francisco Antunes", aff: 1 },
  ],
  affiliations: [
    { id: 1, name: "ISCAC — Coimbra Business School", url: "https://www.iscac.pt/en/" },
  ],
  year: 2026,
  field: "Missing data imputation · Benchmarking methodology",
  abstract: `The imputation literature relies heavily on simulation benchmarks to compare methods, yet no two studies seem to conduct these simulations the same way. In this paper we distinguish between protocol choices that alter the estimand, i.e. what quantity is actually being computed, and those that alter the distribution under which methods are compared. A controlled sensitivity analysis across twelve datasets and six imputation methods reveals that these choices have non-trivial consequences. Depending on the NRMSE denominator, the same imputation quality is reported anywhere from 0.069 to 0.667 on the most heterogeneous dataset, a factor approaching 10. Evaluating error on the full matrix rather than on imputed cells alone compresses all performance differences by a predictable factor. Perhaps most importantly, comparing results under MCAR and MAR conditions shows that MAR degrades every method tested and, under certain dataset-mechanism combinations, reverses rankings entirely. We translate these findings into a benchmarking protocol and reporting checklist intended as a first step toward cross-study comparability.`,
};

// ---------- TABLES ---------------------------------------------------
// Placeholder numbers — replace with real data later.

const TABLES = [
  {
    id: "t1",
    name: "Table 1 — Dataset characteristics.csv",
    title: "Table 1. Dataset characteristics and portfolio coverage.",
    caption: "Overview of the twelve datasets used in the sensitivity study.",
    size: "3 KB",
    columns: ["Dataset", "n", "p", "Type", "Domain", "Heterogeneity"],
    rows: [
      ["AirQuality",     9358,   13, "Numeric",  "Environment",  "High"],
      ["Boston",          506,   14, "Numeric",  "Housing",      "Medium"],
      ["Concrete",       1030,    9, "Numeric",  "Materials",    "Low"],
      ["Diabetes",        442,   10, "Numeric",  "Health",       "Low"],
      ["Energy",          768,    9, "Numeric",  "Buildings",    "Medium"],
      ["Forest Fires",    517,   13, "Mixed",    "Environment",  "High"],
      ["Parkinsons",     5875,   22, "Numeric",  "Health",       "Medium"],
      ["Power",          9568,    5, "Numeric",  "Energy",       "Low"],
      ["Red Wine",       1599,   12, "Numeric",  "Chemistry",    "Medium"],
      ["White Wine",     4898,   12, "Numeric",  "Chemistry",    "Medium"],
      ["Yacht",           308,    7, "Numeric",  "Engineering",  "Low"],
      ["Abalone",        4177,    9, "Mixed",    "Biology",      "High"],
    ],
  },
  {
    id: "t2",
    name: "Table 2 — NRMSE normalisations.csv",
    title: "Table 2. Mean NRMSE (±SD) under four normalisations, 20% MCAR uniform, 100 replicates.",
    caption: "Choice of denominator changes the apparent magnitude by up to ~10×.",
    size: "4 KB",
    columns: ["Dataset", "NRMSE_sd", "NRMSE_range", "NRMSE_mean", "NRMSE_iqr"],
    rows: [
      ["AirQuality",   "0.412 ± 0.031", "0.069 ± 0.006", "0.284 ± 0.021", "0.667 ± 0.048"],
      ["Boston",       "0.488 ± 0.028", "0.112 ± 0.009", "0.361 ± 0.022", "0.541 ± 0.033"],
      ["Concrete",     "0.521 ± 0.024", "0.158 ± 0.008", "0.402 ± 0.018", "0.498 ± 0.029"],
      ["Diabetes",     "0.612 ± 0.022", "0.241 ± 0.011", "0.471 ± 0.017", "0.605 ± 0.025"],
      ["Energy",       "0.334 ± 0.019", "0.098 ± 0.005", "0.255 ± 0.015", "0.401 ± 0.024"],
      ["Forest Fires", "0.708 ± 0.045", "0.089 ± 0.011", "0.512 ± 0.032", "0.892 ± 0.061"],
      ["Parkinsons",   "0.442 ± 0.020", "0.138 ± 0.007", "0.329 ± 0.015", "0.512 ± 0.026"],
      ["Power",        "0.265 ± 0.015", "0.082 ± 0.005", "0.198 ± 0.012", "0.321 ± 0.018"],
      ["Red Wine",     "0.498 ± 0.026", "0.154 ± 0.009", "0.388 ± 0.020", "0.512 ± 0.029"],
      ["White Wine",   "0.465 ± 0.023", "0.141 ± 0.008", "0.362 ± 0.018", "0.489 ± 0.026"],
      ["Yacht",        "0.381 ± 0.021", "0.129 ± 0.007", "0.295 ± 0.016", "0.422 ± 0.025"],
      ["Abalone",      "0.555 ± 0.029", "0.201 ± 0.011", "0.428 ± 0.022", "0.598 ± 0.031"],
    ],
  },
  {
    id: "t3",
    name: "Table 3 — Evaluation domain.csv",
    title: "Table 3. RMSE under two evaluation domains, 20% MCAR uniform, 100 replicates.",
    caption: "Full-matrix evaluation compresses differences by a predictable factor.",
    size: "3 KB",
    columns: ["Method", "RMSE (imputed cells)", "RMSE (full matrix)", "Ratio"],
    rows: [
      ["Mean",        "0.842 ± 0.031", "0.376 ± 0.014", "0.447"],
      ["kNN (k=5)",   "0.612 ± 0.024", "0.274 ± 0.011", "0.448"],
      ["MissForest",  "0.498 ± 0.019", "0.223 ± 0.009", "0.448"],
      ["MICE-pmm",    "0.521 ± 0.022", "0.233 ± 0.010", "0.447"],
      ["GAIN",        "0.584 ± 0.029", "0.261 ± 0.013", "0.447"],
      ["SoftImpute",  "0.558 ± 0.021", "0.250 ± 0.010", "0.448"],
    ],
  },
  {
    id: "t4a",
    name: "Table 4a — Aggregation uniform MCAR.csv",
    title: "Table 4a. Aggregation under uniform MCAR (20%), NRMSE_sd (mean ± SD), 100 replicates.",
    caption: "Per-replicate vs. pooled aggregation.",
    size: "4 KB",
    columns: ["Method", "Per-replicate mean", "Pooled", "Δ (pp)"],
    rows: [
      ["Mean",        "0.612 ± 0.024", "0.608 ± 0.022", "−0.4"],
      ["kNN (k=5)",   "0.445 ± 0.019", "0.441 ± 0.018", "−0.4"],
      ["MissForest",  "0.362 ± 0.015", "0.358 ± 0.013", "−0.4"],
      ["MICE-pmm",    "0.378 ± 0.017", "0.374 ± 0.015", "−0.4"],
      ["GAIN",        "0.424 ± 0.023", "0.419 ± 0.021", "−0.5"],
      ["SoftImpute",  "0.405 ± 0.018", "0.401 ± 0.016", "−0.4"],
    ],
  },
  {
    id: "t4b",
    name: "Table 4b — Aggregation heterogeneous MCAR.csv",
    title: "Table 4b. Aggregation under heterogeneous MCAR (5%/40% split), NRMSE_sd (mean ± SD), 100 replicates.",
    caption: "Heterogeneous missingness magnifies the aggregation gap.",
    size: "4 KB",
    columns: ["Method", "Per-replicate mean", "Pooled", "Δ (pp)"],
    rows: [
      ["Mean",        "0.655 ± 0.029", "0.601 ± 0.026", "−5.4"],
      ["kNN (k=5)",   "0.482 ± 0.024", "0.432 ± 0.020", "−5.0"],
      ["MissForest",  "0.398 ± 0.019", "0.352 ± 0.016", "−4.6"],
      ["MICE-pmm",    "0.415 ± 0.021", "0.371 ± 0.018", "−4.4"],
      ["GAIN",        "0.461 ± 0.028", "0.408 ± 0.024", "−5.3"],
      ["SoftImpute",  "0.441 ± 0.023", "0.392 ± 0.019", "−4.9"],
    ],
  },
  {
    id: "t8",
    name: "Table 8 — Best method per condition.csv",
    title: "Table 8. Best method per condition (NRMSE_sd), 20% missing, 100 replicates.",
    caption: "Method rankings flip under MAR for some datasets.",
    size: "3 KB",
    columns: ["Dataset", "MCAR best", "MAR best", "Rank change?"],
    rows: [
      ["AirQuality",   "MissForest",  "MICE-pmm",    "Yes"],
      ["Boston",       "MissForest",  "MissForest",  "No"],
      ["Concrete",     "MICE-pmm",    "MICE-pmm",    "No"],
      ["Diabetes",     "kNN (k=5)",   "MissForest",  "Yes"],
      ["Energy",       "MissForest",  "MissForest",  "No"],
      ["Forest Fires", "MICE-pmm",    "SoftImpute",  "Yes"],
      ["Parkinsons",   "MissForest",  "MICE-pmm",    "Yes"],
      ["Power",        "MissForest",  "MissForest",  "No"],
      ["Red Wine",     "MissForest",  "MissForest",  "No"],
      ["White Wine",   "MICE-pmm",    "MICE-pmm",    "No"],
      ["Yacht",        "kNN (k=5)",   "MissForest",  "Yes"],
      ["Abalone",      "MissForest",  "MICE-pmm",    "Yes"],
    ],
  },
  {
    id: "t10",
    name: "Table 10 — Reporting checklist.csv",
    title: "Table 10. Minimum reporting checklist.",
    caption: "Protocol items that should accompany any imputation benchmark.",
    size: "2 KB",
    columns: ["#", "Item", "Category", "Required"],
    rows: [
      ["1",  "State the missingness mechanism (MCAR / MAR / MNAR)",   "Protocol",    "Yes"],
      ["2",  "Report the missingness rate and pattern",                "Protocol",    "Yes"],
      ["3",  "Specify the NRMSE denominator",                          "Metric",      "Yes"],
      ["4",  "Specify the evaluation domain (cells vs. matrix)",       "Metric",      "Yes"],
      ["5",  "Report number of replicates and seed strategy",          "Replication", "Yes"],
      ["6",  "Describe aggregation across replicates",                 "Replication", "Yes"],
      ["7",  "Disclose hyperparameter tuning protocol",                "Methods",     "Yes"],
      ["8",  "Report per-dataset variance, not only pooled means",     "Reporting",   "Yes"],
      ["9",  "Provide code and data to reproduce results",             "Reproducibility", "Yes"],
      ["10", "Note computational cost per method",                     "Reporting",   "Recommended"],
    ],
  },
];

// ---------- CHARTS ---------------------------------------------------

const CHARTS = [
  {
    id: "f1", name: "Figure 1 — NRMSE by denominator.png",
    title: "Figure 1. NRMSE spread across four normalisations.",
    caption: "Same imputation quality reported between 0.069 and 0.667 depending on denominator choice (Forest Fires, most heterogeneous dataset).",
    kind: "bars",
  },
  {
    id: "f2", name: "Figure 2 — Full-matrix vs imputed cells.png",
    title: "Figure 2. Domain compression factor.",
    caption: "Full-matrix RMSE ≈ 0.447 × imputed-cells RMSE across all six methods.",
    kind: "scatter",
  },
  {
    id: "f3", name: "Figure 3 — MCAR vs MAR.png",
    title: "Figure 3. Degradation from MCAR to MAR.",
    caption: "Every method degrades under MAR; the magnitude is dataset-dependent.",
    kind: "paired",
  },
  {
    id: "f4", name: "Figure 4 — Rank reversals heatmap.png",
    title: "Figure 4. Rank reversals by dataset × mechanism.",
    caption: "Cells mark datasets where the best method changes between MCAR and MAR.",
    kind: "heatmap",
  },
  {
    id: "f5", name: "Figure 5 — Aggregation delta.png",
    title: "Figure 5. Per-replicate vs. pooled aggregation.",
    caption: "Uniform MCAR shows negligible gap; heterogeneous MCAR inflates the pooled mean.",
    kind: "lines",
  },
  {
    id: "f6", name: "Figure 6 — Variance across replicates.png",
    title: "Figure 6. SD of NRMSE across 100 replicates.",
    caption: "Distribution of replicate-level variability by method and dataset.",
    kind: "violins",
  },
];

// ---------- CODE -----------------------------------------------------

const CODE_FILES = [
  {
    id: "c1",
    name: "run_benchmark.py",
    lang: "python",
    desc: "Top-level experiment driver.",
    code: `"""Run the full benchmarking sweep.

Iterates over datasets × methods × missingness mechanisms and writes
per-replicate NRMSE to results/long.parquet.
"""
import itertools
from pathlib import Path

import numpy as np
import pandas as pd

from imputation.datasets import load_portfolio
from imputation.mechanisms import mcar, mar
from imputation.methods import METHODS
from imputation.metrics import nrmse

N_REPLICATES = 100
MISSING_RATE = 0.20
SEED = 20260101


def run() -> pd.DataFrame:
    rng = np.random.default_rng(SEED)
    out = []
    for ds in load_portfolio():
        for mech_name, mech in [("MCAR", mcar), ("MAR", mar)]:
            for rep in range(N_REPLICATES):
                mask = mech(ds.X, rate=MISSING_RATE, rng=rng)
                X_miss = ds.X.mask(mask)
                for mname, method in METHODS.items():
                    X_hat = method.fit_transform(X_miss)
                    score = nrmse(ds.X, X_hat, mask, denom="sd")
                    out.append(
                        dict(dataset=ds.name, method=mname,
                             mechanism=mech_name, rep=rep, nrmse=score)
                    )
    return pd.DataFrame(out)


if __name__ == "__main__":
    df = run()
    Path("results").mkdir(exist_ok=True)
    df.to_parquet("results/long.parquet")
    print(f"Wrote {len(df):,} rows.")
`,
  },
  {
    id: "c2",
    name: "metrics.py",
    lang: "python",
    desc: "NRMSE with four denominator choices.",
    code: `"""Normalised RMSE with explicit denominator choice.

The denominator is what the paper calls an *estimand* choice: different
choices compute different quantities.
"""
from __future__ import annotations

import numpy as np
import pandas as pd


def nrmse(X_true: pd.DataFrame,
          X_hat: pd.DataFrame,
          mask: pd.DataFrame,
          denom: str = "sd",
          domain: str = "cells") -> float:
    """Normalised RMSE.

    Parameters
    ----------
    denom : {"sd", "range", "mean", "iqr"}
    domain : {"cells", "matrix"}
    """
    if domain == "cells":
        resid = (X_true - X_hat).where(mask)
    elif domain == "matrix":
        resid = X_true - X_hat
    else:
        raise ValueError(domain)

    rmse = np.sqrt(np.nanmean(resid.values ** 2))

    if denom == "sd":
        scale = X_true.std().mean()
    elif denom == "range":
        scale = (X_true.max() - X_true.min()).mean()
    elif denom == "mean":
        scale = X_true.mean().mean()
    elif denom == "iqr":
        scale = (X_true.quantile(0.75) - X_true.quantile(0.25)).mean()
    else:
        raise ValueError(denom)

    return float(rmse / scale)
`,
  },
  {
    id: "c3",
    name: "mechanisms.py",
    lang: "python",
    desc: "MCAR and MAR missingness generators.",
    code: `"""Missingness mechanisms.

MCAR: each cell is deleted independently with probability p.
MAR: deletion probability for column j depends on the observed value
     of a fixed pivot column j' != j.
"""
import numpy as np
import pandas as pd


def mcar(X: pd.DataFrame, rate: float, rng) -> pd.DataFrame:
    mask = rng.random(X.shape) < rate
    return pd.DataFrame(mask, index=X.index, columns=X.columns)


def mar(X: pd.DataFrame, rate: float, rng,
        pivot: str | None = None) -> pd.DataFrame:
    pivot = pivot or X.columns[0]
    p = X[pivot].rank(pct=True).values
    # higher pivot rank -> higher deletion probability
    weights = 2.0 * rate * p
    mask = np.zeros(X.shape, dtype=bool)
    for j, col in enumerate(X.columns):
        if col == pivot:
            mask[:, j] = rng.random(len(X)) < rate
        else:
            mask[:, j] = rng.random(len(X)) < weights
    return pd.DataFrame(mask, index=X.index, columns=X.columns)
`,
  },
  {
    id: "c4",
    name: "methods.py",
    lang: "python",
    desc: "Wrappers for the six imputation methods.",
    code: `"""Unified sklearn-style wrappers for six imputers."""
from sklearn.impute import SimpleImputer, KNNImputer
from sklearn.experimental import enable_iterative_imputer  # noqa: F401
from sklearn.ensemble import RandomForestRegressor
from sklearn.impute import IterativeImputer

from .gain import GAINImputer
from .softimpute import SoftImputeWrapper


METHODS = {
    "Mean":        SimpleImputer(strategy="mean"),
    "kNN (k=5)":   KNNImputer(n_neighbors=5),
    "MissForest":  IterativeImputer(
        estimator=RandomForestRegressor(n_estimators=100, random_state=0),
        max_iter=10, random_state=0,
    ),
    "MICE-pmm":    IterativeImputer(max_iter=10, random_state=0),
    "GAIN":        GAINImputer(batch_size=128, hint_rate=0.9, alpha=100),
    "SoftImpute":  SoftImputeWrapper(max_rank=10, lam=1.0),
}
`,
  },
  {
    id: "c5",
    name: "aggregate.py",
    lang: "python",
    desc: "Produces Tables 2, 4a, 4b from the long results.",
    code: `"""Aggregate replicate-level results into paper tables."""
import pandas as pd


def per_replicate(df: pd.DataFrame) -> pd.DataFrame:
    """Mean ± SD across replicates, then across datasets."""
    g = df.groupby(["dataset", "method"])["nrmse"]
    rep = g.agg(["mean", "std"]).reset_index()
    return rep


def pooled(df: pd.DataFrame) -> pd.DataFrame:
    """Pool all replicates before taking mean ± SD."""
    g = df.groupby("method")["nrmse"]
    return g.agg(["mean", "std"]).reset_index()


def fmt(row) -> str:
    return f"{row['mean']:.3f} ± {row['std']:.3f}"
`,
  },
  {
    id: "c6",
    name: "plots.py",
    lang: "python",
    desc: "Generates figures 1–6.",
    code: `"""Paper figures."""
import matplotlib.pyplot as plt
import seaborn as sns


def figure_1(df_nrmse):
    fig, ax = plt.subplots(figsize=(8, 4.5))
    sns.barplot(
        data=df_nrmse, x="dataset", y="nrmse",
        hue="denom", ax=ax,
    )
    ax.set_ylabel("NRMSE")
    ax.set_xlabel("")
    ax.tick_params(axis="x", rotation=45)
    fig.tight_layout()
    return fig
`,
  },
];

// ---------- DESKTOP ICONS -------------------------------------------

const DESKTOP_ICONS = [
  { id: "about",  label: "About",  app: "about"  },
  { id: "tables", label: "Tables", app: "tables" },
  { id: "charts", label: "Charts", app: "charts" },
  { id: "code",   label: "Code",   app: "code"   },
];

window.PAPER = PAPER;
window.TABLES = TABLES;
window.CHARTS = CHARTS;
window.CODE_FILES = CODE_FILES;
window.DESKTOP_ICONS = DESKTOP_ICONS;
