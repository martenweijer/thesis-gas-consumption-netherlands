# Forecasting of residential unit's heat demands: a comparison of machine learning techniques in a real-world case study
Kemper, N., Heider, M., Pietruschka, D., & Hähner, J. (2025). Forecasting of residential unit's heat demands: a comparison of machine learning techniques in a real-world case study. *Energy Systems, 16*(1), 281–315. https://doi.org/10.1007/s12667-023-00579-y

## Summary

This paper studies a model comparison for short-term heat demand forecasting in a single residential building complex in southern Germany. The setting is a newly built quarter of 66 units near Munich, with data collected from June 2020 to February 2022, about 1.75 years of hourly readings in total (15,228 data points). The goal is 24–48 hour ahead forecasts to feed an energy management system that schedules a central heating plant.

Three families of methods get tested. The time series group uses HWS and SARIMA. Offline machine learning covers LR, KRR, SVR, RFR, DNN, CNN, and LSTM. Online ML includes RLS, SGD, ODL, ODL-ER, and HBP. The online methods are there for a specific deployment scenario: when a new building has no historical data yet, you need something that learns from each new data point without a full training set.

The main result is that offline ML wins, with Kernel Ridge Regression and Random Forest Regression at the top. Time series models couldn't beat a naive baseline (just predicting last hour's value), and online ML fared no better. And deep learning, despite LSTM's reputation for time series problems, performed almost as poorly as SARIMA.

## Research questions

- Which family of forecasting methods produces the most accurate 24–48h heat demand forecasts: time series, offline ML, or online ML?
- Do seasonal specialist models (trained separately on summer and winter data) outperform generalist models trained on all data?

## Contributions

- Three-way comparison of time series, offline ML, and online ML methods on the same real-world dataset, including explainability and computational cost as evaluation criteria
- Use of MASE (Mean Absolute Scaled Error) relative to a naive model as the primary benchmark, which catches the failure case where a model looks decent in absolute error but still can't beat last hour's reading
- Analysis of peak demand and outlier prediction, which is a requirement for safety
- Public release of both the dataset and code

## Methodology

- **Data:** 66 residential units, southern Germany (completed 2019); heat meter at central system measures combined space heating and domestic hot water; 60-minute intervals in Wh; June 2020 to February 2022
- **Features (8):** month, day of week, hour of day, outside temperature, solar radiation, heat 24h ago, average heat over last 24h, degree hour (difference between indoor target 21°C and outdoor temp, only on days below the 15°C heating limit)
- **Season split:** winter = September 21 to May 4; summer = May 5 to September 20
- **Time series split:** year 1 (June 2020 to May 2021) for training, year 2 (June 2021 to February 2022) for evaluation
- **Offline ML split:** 80/20 random split with 30 Monte Carlo cross-validation seeds; hyperparameter tuning via Bayesian optimization (KerasTuner); grid search for RLS, SGD, and ER
- **Online ML:** sequential in-vivo simulation, model trained on first 24h and updated at each new data point; repeated 30 times
- **Models:** HWS, SARIMA; LR, KRR, SVR, RFR, DNN, CNN, LSTM; RLS, SGD, ODL, ODL-ER (ANN with experience replay buffer), HBP (adaptive-complexity ANN)
- **Evaluation metrics:** RMSE (absolute prediction quality), MASE (scaled against naive model), MAD (spread across Monte Carlo runs)

## Results

Time series (RMSE, full dataset):

| Model | RMSE [kWh] | MASE |
|-------|-----------|------|
| HWS | 21.84 | 3.66 |
| SARIMA | 15.72 | 2.79 |

Both are well above MASE 1.0. They're worse than just predicting the last known value.

Offline ML (RMSE, full dataset):

| Model | RMSE [kWh] | MASE |
|-------|-----------|------|
| KRR | 6.11 | 0.26 |
| RFR | 6.37 | 0.27 |
| SVR | 6.76 | 0.28 |
| CNN | 7.20 | 0.31 |
| DNN | 7.79 | 0.33 |
| LR | 7.82 | 0.34 |
| LSTM | 17.61 | 0.89 |

KRR is best by RMSE. RFR has slightly lower MAD across Monte Carlo runs, meaning more consistent results when the train/test split changes. LSTM at 17.61 is almost indistinguishable from SARIMA, which is not what you'd expect from a model designed for sequences.

Online ML (RMSE, full dataset):

| Model | RMSE [kWh] | MASE |
|-------|-----------|------|
| ODL-ER | 6.61 | 1.23 |
| RLS | 7.49 | 1.29 |
| HBP | 8.13 | 1.39 |
| ODL | 8.50 | 1.37 |
| SGD | 15.55 | 2.70 |

ODL-ER is the best of the online methods but still can't beat the naive model (MASE 1.23). Seasonal specialist models didn't consistently improve on generalists. For anomaly prediction (sudden cold snaps), offline models held up; online models were less stable.

## Limitations

- Single building complex with 66 units. Too few residents for reliable hot water demand patterns, especially in summer when usage is unpredictable
- Only 1.75 years of data, which is not enough for deep learning and barely enough for time series models to observe a full seasonal cycle
- All data was collected during the COVID-19 pandemic, so occupancy and usage patterns were unusual in ways that aren't representative of normal operation
- No validation set was available for online ML hyperparameter tuning; parameters had to be set on the same data used for evaluation
- Weather features are limited to temperature and solar radiation; wind speed, humidity, and cloud cover are absent

## Conclusions

KRR and RFR are the practical choices for offline deployment. Both get MASE around 0.26–0.27 and are far easier to interpret than the neural network alternatives. LSTM is a surprise underperformer, essentially on par with SARIMA. The authors put this down to dataset size, 15k hourly points isn't much for a recurrent network. Online ML works as a cold-start option but shouldn't be kept around once historical data builds up.

The authors plan to deploy RFR in the actual building system. They're also honest that the COVID data issue hasn't gone away and the model will probably need retraining once post-pandemic patterns stabilize.

## Relevance to thesis

The finding that simpler models beat deep learning on limited data is worth keeping in mind: if municipal-level data is sparse, the same pattern might show up. And the MASE framing is useful: comparing model performance against "last year's consumption" would be a clean sanity check.
