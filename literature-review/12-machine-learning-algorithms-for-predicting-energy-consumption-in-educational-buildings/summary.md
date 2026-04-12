# Machine Learning Algorithms for Predicting Energy Consumption in Educational Buildings
Elhabyb, K., Baina, A., Bellafkih, M., & Deifalla, A. F. (2024). Machine learning algorithms for predicting energy consumption in educational buildings. *International Journal of Energy Research*, 2024, Article ID 6812425. https://doi.org/10.1155/2024/6812425

## Summary

This paper compares RF, LSTM, and GBR for predicting electricity consumption in three university buildings at Downtown University (USA). The data runs from January 2020 to January 2023, covering CLAS (College of Law and Society), NHAI (Nursing and Health Innovation), and Cronkite (journalism). GBR came out on top in most cases, hitting R² values as high as 0.998.

## Research questions

- Which ML algorithm most accurately predicts energy consumption in educational buildings?
- What building features matter most for prediction?

## Contributions

- Side-by-side comparison of RF, LSTM, and GBR on real electricity data from three different building types
- Feature importance analysis: CHWTON (chilled water tons) and KW (power consumption) were the strongest predictors
- GBR works well here as an alternative to LSTM, worth noting for building energy prediction tasks

## Methodology

- **Data:** Three university buildings, January 2020–January 2023, hourly readings, 29 raw features (HVAC metrics, lighting, occupancy, calendar variables)
- **Preprocessing:** Z-score normalization; no missing values found; feature selection via correlation analysis and tree-based models, keeping 5 features: KW, KWS, CHWTON, total houses, CHWTONgalsgas
- **Split:** 70% training / 30% testing
- **Validation:** 5-fold cross-validation
- **Metrics:** R², MSE, RMSE, MAE, MAPE

## Results

GBR was the best model across all buildings:

| Building | Model | R²     | RMSE  | MAE    | MAPE   |
|----------|-------|--------|-------|--------|--------|
| CLAS     | RF    | 0.851  | 16.53 | 219.73 | 76.95  |
| CLAS     | LSTM  | 0.867  | 13.30 | 79.07  | 56.03  |
| CLAS     | GBR   | 0.984  | 9.34  | 71.72  | 40.26  |
| NHAI     | RF    | 0.479  | 20.44 | 47.78  | 8.45   |
| NHAI     | LSTM  | 0.837  | 19.28 | 33.08  | 48.11  |
| NHAI     | GBR   | 0.795  | 17.44 | 32.68  | 52.57  |
| Cronkite | RF    | 0.893  | 10.85 | 117.70 | 56.55  |
| Cronkite | LSTM  | 0.761  | 7.32  | 29.10  | 64.61  |
| Cronkite | GBR   | 0.998  | 4.04  | 16.34  | 36.34  |

Cross-validation scores: RF=0.83, LSTM=0.92, GBR=0.95. The NHAI building is the exception. Its non-symmetric data made LSTM the better fit there, which makes sense given LSTM's ability to capture temporal patterns. But GBR won everywhere else.

## Limitations

- Only three buildings from one university, so the results don't generalize easily
- Electricity only; no gas or heat
- Building-level prediction, not geographic aggregation
- Small dataset; the authors suggest more data would help GBR further
- MAPE values are high for some models

## Conclusions

GBR performed best overall. Its sequential training process (each iteration corrects the previous one's errors) gives it an edge on complex energy data. LSTM is still useful when data has strong temporal dependencies — NHAI being the clearest example of this. RF lags behind both in most comparisons.

Feature selection mattered a lot here. HVAC load metrics (CHWTON) dominated importance rankings, which makes sense for buildings where cooling systems run constantly.

## Relevance to thesis

Moderate. The paper shows GBR holding up well against LSTM and RF, which supports including it as a candidate model. The feature selection approach (tree-based pruning from 29 down to 5 features) is worth borrowing.

But the context is quite different. This is hourly electricity data for university buildings, not annual residential gas consumption at the municipal level. The patterns won't transfer directly. Still, the model comparison framework and evaluation metrics (RMSE, MAE, MAPE, R²) map onto what this thesis needs.
