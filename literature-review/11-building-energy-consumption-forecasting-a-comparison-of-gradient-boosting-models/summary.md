# Building Energy Consumption Forecasting: A Comparison of Gradient Boosting Models
Bassi, A., Shenoy, A., Sharma, A., Sigurdson, H., Glossop, C., & Chan, J. H. (2021). Building energy consumption forecasting: A comparison of gradient boosting models. In *Proceedings of the 12th International Conference on Advances in Information Technology (IAIT2021)* (pp. 1–9). ACM. https://doi.org/10.1145/3468784.3470656

## Summary

The paper runs a literature review and then a head-to-head comparison of LightGBM, CatBoost, and XGBoost on a synthesized office building dataset. All three are gradient boosting models that are popular in Kaggle energy competitions but had never been formally compared for building energy prediction. XGBoost wins on this dataset.

## Research questions

1. How can short-term building energy consumption predictions be improved using gradient boosting models?
2. How do LightGBM, CatBoost, and XGBoost compare in predictive accuracy on a synthesized building energy dataset?

## Contributions

- A literature review of gradient boosting applied to building energy forecasting.
- A direct comparison of all three models on the same dataset, which apparently had not been done before.
- Hyperparameter tuning with grid search (CatBoost) and Optuna (LightGBM), plus 5-fold cross-validation.

## Methodology

- **Dataset:** Synthesized from the Chicago Large Office Building dataset (EnergyPlus simulation, 4 years of hourly readings, 35,040 rows). Features include time variables and weather data (temperature, humidity, pressure, wind speed, solar irradiance).
- **Preprocessing:** Cyclical features converted to sine/cosine, float values converted to integers for CatBoost, 80/20 train/test split.
- **Models:** LightGBM, CatBoost, XGBoost.
- **Tuning:** Grid search for CatBoost; Optuna for LightGBM. 5-fold cross-validation to check for overfitting.
- **Metrics:** RMSLE, RN-RMSE (%), R².

## Results

| Model    | RMSLE  | RN-RMSE (%) | R²     |
|----------|--------|-------------|--------|
| LightGBM | 0.0910 | 1.9915      | 0.9917 |
| CatBoost | 0.1214 | 3.6180      | 0.9699 |
| XGBoost  | 0.0879 | 1.9112      | 0.9917 |

XGBoost edged out LightGBM on RMSLE and RN-RMSE. Both hit the same R² (0.9917). CatBoost trailed by a noticeable margin. No signs of overfitting across 5-fold CV for any model.

## Limitations

- The data is synthetic (EnergyPlus simulation), so it is unclear how well these results hold on real buildings.
- Only one building type in one climate (Chicago office) was tested.
- Runtime and memory usage were not compared.

## Conclusions

XGBoost performed best, but LightGBM was close. CatBoost lagged behind on this dataset. All three models handled the task well, with R² above 0.96. The authors suggest testing on real measured data as a next step.

## Relevance to thesis

Good methodological reference for comparing gradient boosting models. The comparison setup, same dataset, consistent metrics, tuned hyperparameters, is worth replicating.
