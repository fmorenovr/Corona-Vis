#!/usr/bin/env python

# -*- coding: utf-8 -*-
# encoding: utf-8

import pandas as pd
import numpy as np

from scipy import stats as sps
from scipy.interpolate import interp1d

# We create an array for every possible value of Rt
R_T_MAX = 12
r_t_range = np.linspace(0, R_T_MAX, R_T_MAX*100+1)

# best sigma for Perú (prior hyperparameters)
#OPTIMAL_SIGMA = 0.35 # through Kevin's Optimization
OPTIMAL_SIGMA = 0.01

# Gamma is 1/serial interval
# https://wwwnc.cdc.gov/eid/article/26/7/20-0282_article
# https://www.nejm.org/doi/full/10.1056/NEJMoa2001316
GAMMA = 1/7

def smooth_new_cases(new_cases):
  
  """
  Function to apply gaussian smoothing to cases
  Arguments
  ----------
  new_cases: time series of new cases
  Returns 
  ----------
  smoothed_cases: cases after gaussian smoothing
  See also
  ----------
  This code is heavily based on Realtime R0
  by Kevin Systrom
  https://github.com/k-sys/covid-19/blob/master/Realtime%20R0.ipynb
  """

  smoothed_cases = new_cases.rolling(7,
    win_type='gaussian',
    min_periods=1,
    center=True).mean(std=2).round()
  
  zeros = smoothed_cases.index[smoothed_cases.eq(0)]
  if len(zeros) == 0:
    idx_start = 0
  else:
    last_zero = zeros.max()
    idx_start = smoothed_cases.index.get_loc(last_zero) + 1
  smoothed_cases = smoothed_cases.iloc[idx_start:]
  original = new_cases.loc[smoothed_cases.index]
  
  return original, smoothed_cases


def calculate_posteriors(sr, sigma=0.15):

  """
  Function to calculate posteriors of Rt over time
  Arguments
  ----------
  sr: smoothed time series of new cases
  sigma: gaussian noise applied to prior so we can "forget" past observations
       works like exponential weighting
  Returns 
  ----------
  posteriors: posterior distributions
  log_likelihood: log likelihood given data
  See also
  ----------
  This code is heavily based on Realtime R0
  by Kevin Systrom
  https://github.com/k-sys/covid-19/blob/master/Realtime%20R0.ipynb
  """

  # (1) Calculate Lambda
  lam = sr[:-1].values * np.exp(GAMMA * (r_t_range[:, None] - 1))

  
  # (2) Calculate each day's likelihood
  likelihoods = pd.DataFrame(
    data = sps.poisson.pmf(sr[1:].values, lam),
    index = r_t_range,
    columns = sr.index[1:])
  
  # (3) Create the Gaussian Matrix
  process_matrix = sps.norm(loc=r_t_range,
                scale=sigma
               ).pdf(r_t_range[:, None]) 

  # (3a) Normalize all rows to sum to 1
  process_matrix /= process_matrix.sum(axis=0)
  
  # (4) Calculate the initial prior
  prior0 = sps.gamma(a=4).pdf(r_t_range)
  prior0 /= prior0.sum()

  # Create a DataFrame that will hold our posteriors for each day
  # Insert our prior as the first posterior.
  posteriors = pd.DataFrame(
    index=r_t_range,
    columns=sr.index,
    data={sr.index[0]: prior0}
  )
  
  # We said we'd keep track of the sum of the log of the probability
  # of the data for maximum likelihood calculation.
  log_likelihood = 0.0

  # (5) Iteratively apply Bayes' rule
  for previous_day, current_day in zip(sr.index[:-1], sr.index[1:]):

    #(5a) Calculate the new prior
    current_prior = process_matrix @ posteriors[previous_day]
    
    #(5b) Calculate the numerator of Bayes' Rule: P(k|R_t)P(R_t)
    numerator = likelihoods[current_day] * current_prior
    
    #(5c) Calcluate the denominator of Bayes' Rule P(k)
    denominator = np.sum(numerator)
    
    # Execute full Bayes' Rule
    posteriors[current_day] = numerator/denominator
    
    # Add to the running sum of log likelihoods
    log_likelihood += np.log(denominator)
  
  return posteriors, log_likelihood


def highest_density_interval(pmf, p=.9):

  """
  Function to calculate highest density interval 
  from posteriors of Rt over time
  Arguments
  ----------
  pmf: posterior distribution of Rt
  p: mass of high density interval
  Returns 
  ----------
  interval: expected value and density interval
  See also
  ----------
  This code is heavily based on Realtime R0
  by Kevin Systrom
  https://github.com/k-sys/covid-19/blob/master/Realtime%20R0.ipynb
  """
  # If we pass a DataFrame, just call this recursively on the columns
  if(isinstance(pmf, pd.DataFrame)):
    return pd.DataFrame([highest_density_interval(pmf[col], p=p) for col in pmf], index=pmf.columns)
  
  cumsum = np.cumsum(pmf.values)
  best = None
  for i, value in enumerate(cumsum):
    for j, high_value in enumerate(cumsum[i+1:]):
      if (high_value-value > p) and (not best or j<best[1]-best[0]):
        best = (i, i+j+1)
        break
      
  low = pmf.index[best[0]]
  high = pmf.index[best[1]]
  most_likely = pmf.idxmax()

  interval = pd.Series([most_likely, low, high], index=['ML',f'Low_{p*100:.0f}', f'High_{p*100:.0f}'])

  return interval

def run_full_model(cases, sigma=OPTIMAL_SIGMA):
  # initializing result dict
  result = {''}

  # smoothing series
  new, smoothed = smooth_new_cases(cases)

  # calculating posteriors
  posteriors, log_likelihood = calculate_posteriors(smoothed, sigma=sigma)

  # calculating HDI
  result = highest_density_interval(posteriors, p=.9)

  return [result, new]
  
