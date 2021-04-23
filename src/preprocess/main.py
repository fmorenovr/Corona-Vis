#!/usr/bin/env python

# -*- coding: utf-8 -*-
# encoding: utf-8

from utils import *

modes=["DEPARTAMENTO", "PROVINCIA", "DISTRITO"]

data = load_data()

for mode in modes:

  info_df, region_df = extract_info(data, mode=mode)

  data_df = prepare_data(info_df, mode)

  state_df = data_df["confirmed_new"]

  from joblib import Parallel, delayed

  # core count to parallelize job
  N_JOBS = -1

  results = []

  with Parallel(n_jobs=N_JOBS) as parallel:
      results = parallel(delayed(run_full_model)(grp[1], sigma=0.01) for grp in state_df.groupby(level='state'))

  hl = [result[0] for result in results]
  news = [result[1] for result in results]

  final_results = pd.concat(hl)
  news_results = pd.concat(news)

  final_results.to_csv("data/"+mode+"_intervals.csv")
  region_df.to_csv("data/"+mode+"_total.csv")
  news_results.to_csv("data/"+mode+"_news.csv")
  
clean_df = pd.read_csv("data/DEPARTAMENTO_clean.csv")
  
new_by_dep = pd.pivot_table(clean_df,
                          index="region",
                          values="confirmados",
                          aggfunc={
                            "confirmados":sum
                          })

new_by_dep = new_by_dep.reset_index()
new_by_dep.rename(columns={"region":"name", "confirmados":"exits"}, inplace=True)
new_by_dep.to_csv("data/Summary_news.csv")
