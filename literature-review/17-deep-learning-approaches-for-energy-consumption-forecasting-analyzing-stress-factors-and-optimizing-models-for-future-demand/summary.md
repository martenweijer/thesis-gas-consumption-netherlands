# Deep learning approaches for energy consumption forecasting: analyzing stress factors and optimizing models for future demand
Navale, S., Mishra, N., & Borhade, S. (2025). Deep learning approaches for energy consumption forecasting: analyzing stress factors and optimizing models for future demand. *Discover Applied Sciences*, 7, 1092. https://doi.org/10.1007/s42452-025-07718-3

## Summary

This paper compares ML and DL models for energy consumption forecasting using the ASHRAE Great Energy Predictor III dataset. Eight models are tested: LightGBM, XGBoost, CatBoost, ARIMA, LSTM, GRU, TCN, and autoencoders. Hyperparameter optimization is done with Optuna. Autoencoders come out on top (R² = 0.9686), and CatBoost is the best ML model after tuning (R² = 0.8575). ARIMA falls apart on this non-linear dataset — R² ≈ 0. The main takeaway is that well-tuned ML models can be a cheaper alternative to deep learning when compute is limited.

## Research questions

- How do ML and DL models compare for building-level energy consumption forecasting?
- What is the effect of hyperparameter optimization (via Optuna) on model performance?
- Which external factors (weather, occupancy, building characteristics) influence prediction accuracy?

## Contributions

- Side-by-side comparison of eight ML and DL models on a large real-world building energy dataset (~60 million records).
- Optuna used for automated hyperparameter tuning across all models — both ML and DL.
- Measured the performance vs. compute trade-off between ML and DL approaches.

## Methodology

- **Dataset:** ASHRAE GEPIII dataset — ~18.9M training records (Jan–Dec 2016) and ~41.7M test records (Jan 2017–May 2018) from multiple building types. Features include building metadata, time attributes, weather variables, and usage patterns.
- **Preprocessing:** Timestamp alignment, removal of erroneous/zero readings, logarithmic transformation (np.log1p), missing weather data imputed via group means or forward-fill, holiday indicator added, target and percentile-based feature encoding.
- **ML models:** LightGBM, XGBoost, CatBoost, ARIMA.
- **DL models:** LSTM, GRU, TCN, Autoencoders.
- **Optimization:** Optuna with Tree-structured Parzen Estimator (TPE), cross-validated on RMSE/MAE/R².
- **Evaluation metrics:** RMSE, MAE, R².

## Results

| Model | Optimization | RMSE | MAE | R² |
|---|---|---|---|---|
| LightGBM | Without | 0.9207 | 0.5337 | 0.7804 |
| LightGBM | With | 0.9427 | 0.5437 | 0.7698 |
| XGBoost | Without | 0.9304 | 0.5272 | 0.7758 |
| XGBoost | With | 0.7866 | 0.4254 | 0.8397 |
| **CatBoost** | **With** | **0.7416** | **0.3999** | **0.8575** |
| ARIMA | Without | 1.9588 | 1.5297 | ~0.00 |
| LSTM | With | 1.0840 | 0.6421 | 0.6963 |
| GRU | With | 1.0798 | 0.6321 | 0.6971 |
| TCN | With | 1.0562 | 0.5902 | 0.7117 |
| **Autoencoders** | **With** | **0.1708** | **0.1233** | **0.9686** |

- XGBoost and CatBoost gained the most from tuning. LightGBM actually got slightly worse after optimization — likely overfitting or a poor search.
- LSTM, GRU, and TCN barely moved. TCN did edge out the recurrent models in feature extraction, but the differences were small.
- Autoencoders beat everything else by a wide margin, but training cost was much higher.

## Limitations

- Dataset is limited to a single year of training data (2016), which may not capture multi-year trends.
- No real-time streaming data; results may not generalize to live forecasting systems.
- DL models are black boxes — no explainability or interpretability components included.
- The autoencoder's very low RMSE is on log-transformed data, which inflates the apparent advantage.
- Limited cross-domain validation; the dataset covers only one competition's building stock.

## Conclusions

Autoencoders are the best performers, but the compute cost is high. CatBoost and XGBoost with Optuna tuning get you most of the way there with far less overhead. ARIMA has no business being on this dataset. TCN beats LSTM and GRU, though none of the recurrent models responded well to hyperparameter search. The authors suggest hybrid approaches (LSTM + XGBoost), k-fold validation, and Diebold-Mariano tests as next steps. There's no mention of how these models would hold up with multi-year or cross-domain data.

## Relevance to thesis

The Optuna setup is a useful reference for hyperparameter search. The general point that simpler ML models hold up well when data is limited or compute is constrained is directly applicable.
