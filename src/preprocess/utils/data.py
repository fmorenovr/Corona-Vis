#!/usr/bin/env python

# -*- coding: utf-8 -*-
# encoding: utf-8

import pandas as pd
import numpy as np
import re
import zipfile
import wget
import os

from datetime import datetime

def load_data(data_to_study="version_2"):
  df = None
  if not os.path.isfile('data/DATOSABIERTOS_SISCOVID.zip') and data_to_study=="version_1":
    try:
      wget.download("https://www.datosabiertos.gob.pe/sites/default/files/DATOSABIERTOS_SISCOVID.zip", out="data/")
  
      with zipfile.ZipFile("data/DATOSABIERTOS_SISCOVID.zip", 'r') as zip_ref:
        zip_ref.extractall("data/.")
        df = pd.read_csv("data/DATAPOSITIVOS_CDC_PCM_20200525.csv", encoding = "utf-8")
  
    except:
      print("couldnt download")
      return None
  
  elif not os.path.isfile('data/positivos_covid.csv') and data_to_study=="version_2":
  
    try:
      wget.download("https://cloud.minsa.gob.pe/s/Y8w3wHsEdYQSZRp/download", out="data/")
      
      df = pd.read_csv("data/positivos_covid.csv", encoding = "utf-8", sep=";")
      
    except:
      print("couldnt download")
      return None

  else:
    if data_to_study == "version_1":
      df = pd.read_csv("data/DATAPOSITIVOS_CDC_PCM_20200525.csv", encoding = "ISO-8859-1")
    else:
      df = pd.read_csv("data/positivos_covid.csv", encoding = "utf-8", sep=";")
      
  df.dropna(subset=['FECHA_RESULTADO'], how='all', inplace=True)
  
  dates = []
  # year/month/day
  for d in df["FECHA_RESULTADO"]:
    if type(d) is float:
      d_ = str(int(d)).split(".")[0]
      dates.append(d_[:4]+"-"+d_[4:6]+"-"+d_[6:])
    else:
      a = d.split('/')
      if len(a[0])<2:
        a[0] = '0'+a[0] 
      dates.append(a[2]+'-'+a[1]+'-'+a[0])

  df["FECHA_RESULTADO"] = dates
  
  return df

def extract_info(data, mode="PROVINCIA", dep_name="LIMA", dist_name="LIMA"):
  df = pd.DataFrame(data, columns=[mode, 'FECHA_RESULTADO'])
  df.rename(columns={'FECHA_RESULTADO':'fecha', mode:'region'}, inplace=True)
  regions = df['region'].unique()
  #df['fecha'] = pd.to_datetime(df['fecha'], infer_datetime_format=True)
  df['fecha'] = df['fecha'].apply(lambda x:datetime.strptime(x, '%Y-%m-%d'))
  #df['fecha'] = df['fecha'].astype(int)
  df.sort_values(by=['fecha'], inplace=True, ascending=True) 
  df_dates_regions = df.groupby(['fecha', 'region']).size().reset_index(name='confirmados')
  df_regions = df.groupby(['region']).size().reset_index(name='confirmados')
  return df_dates_regions, df_regions

def prepare_data(depts_raw, mode="PROVINCIA"):
  # manipulate in numpy, because I am too dumb and lazy to look up pandas APIs and just want to get it done
  sorted_regions = (depts_raw.sort_values(['region', 'fecha'], ascending=[True, True])).to_numpy()
  print(sorted_regions)

  # the values shown in "CONFIRMADOS" is *total* for that area. 
  # We have to subtract values with the previous day to get 
  # new confirmed

  new_region_values = np.copy(sorted_regions)

  current_region = ""

  for i in range(0, len(sorted_regions)):
    if current_region != sorted_regions[i][1]:
      # changed regions and this is the first row
      # we don't need to process that one
      current_region = sorted_regions[i][1]
      #print('Cleaning ' + current_region)
      continue

    new_confirmados = sorted_regions[i][2] - sorted_regions[i-1][2]
    if new_confirmados < 0:
      new_confirmados = 0

    new_region_values[i][2] = new_confirmados

  # build back de pandas dataframe so we can save it.
  df = pd.DataFrame(data=new_region_values, index=depts_raw.index, columns=depts_raw.columns)
  df.drop(df.loc[df['confirmados']==0].index, inplace=True)
  df.to_csv("data/"+mode+'_clean.csv', index=False)

  # If you read this and think it is inneficient, you are completely correct!
  # The reason it is structured like this is that this has been broken
  # many times and I always have had to save the file to check it at different
  # stages of the pipeline.

  state_df = (
              pd.read_csv("data/"+mode+'_clean.csv', parse_dates=['fecha'])
              .rename(columns={'confirmados': 'confirmed_new',
                               'fecha': 'date',
                               'region' : 'state'})               
              .groupby(['state','date']).sum()
          )

  
  return state_df
