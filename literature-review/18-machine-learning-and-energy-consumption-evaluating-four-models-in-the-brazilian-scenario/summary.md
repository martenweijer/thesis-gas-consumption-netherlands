# Machine Learning and Energy Consumption: Evaluating Four Models in the Brazilian Scenario
Farías, J. G., Willcox, L. F. C., Najjar, M. K., Boer, D.-T., & Haddad, A. N. (2025). Machine learning and energy consumption: Evaluating four models in the Brazilian scenario. In M. R. Oliveira et al. (Eds.), *CIRMARE 2025*, LNCE 769 (pp. 575–586). Springer Nature Switzerland AG. https://doi.org/10.1007/978-3-032-08224-4_49

## Summary

This paper compares four ML models for predicting energy consumption in Brazil: Linear Regression, Random Forest, XGBoost, and K-Nearest Neighbors (KNN). The authors use a national public dataset covering all consumption classes from 2004 to 2024. Two analyses are performed, one for all classes combined and one for the residential sector only. Random Forest and XGBoost consistently come out on top, both reaching R² above 0.95.

## Research questions

- Is it possible to develop accurate predictions of energy consumption using ML models?
- Which ML model produces the most accurate predictions for the Brazilian context?

## Contributions

- Direct comparison of four ML models on a large national energy dataset under identical conditions.
- Shows that tree-based ensemble methods (RF, XGBoost) substantially outperform Linear Regression when all consumption classes are mixed.
- Narrowing to the residential class alone improves performance across all four models.

## Methodology

- **Dataset:** "Monthly Electric Energy Consumption" published by Empresa de Pesquisa Energética (Brazilian Ministry of Mines and Energy), covering January 2004 to December 2024. Attributes include date, state, geographic region, energy system, class, and number of consumer units.
- **Models:** Linear Regression, Random Forest, XGBoost, K-Nearest Neighbors.
- **Pipeline:** Data retrieval → preprocessing (missing values, noise) → model training → prediction → error calculation → comparison.
- **Evaluation metrics:** MAE (training and test), RMSE (training and test), R².
- Two separate analyses: all classes combined and residential sector only.

## Results

**All consumption classes:**

| Model             | MAE_Test    | RMSE_Test    | R²     |
|-------------------|-------------|--------------|--------|
| Linear Regression | 93,737.74   | 201,441.93   | 0.6650 |
| Random Forest     | 55,437.91   | 84,347.02    | 0.9413 |
| XGBoost           | 35,428.40   | 84,270.19    | 0.9414 |
| KNN               | 38,958.57   | 94,932.59    | 0.9256 |

**Residential sector only:**

| Model             | MAE_Test   | RMSE_Test    | R²     |
|-------------------|------------|--------------|--------|
| Linear Regression | 67,684.51  | 113,493.97   | 0.9540 |
| Random Forest     | 58,643.35  | 100,168.44   | 0.9567 |
| XGBoost           | 58,589.61  | 110,113.07   | 0.9567 |
| KNN               | 61,752.71  | 114,546.75   | 0.9531 |

RF and XGBoost perform nearly identically in both analyses. Linear Regression is clearly the weakest, especially when classes are mixed.

## Limitations

- Only four models were tested. No neural networks or LightGBM-style variants.
- Data is at national level, so no municipal or regional breakdown.
- Only electric energy is covered. Gas and other carriers are not included.
- Only the residential class was analyzed in detail; other sectors were not broken down separately.

## Conclusions

Random Forest and XGBoost are the most accurate models, both hitting R² > 0.95 on the residential sector. Linear Regression struggles when all consumption classes are mixed (R² = 0.67), but recovers to R² = 0.954 when the dataset is more homogeneous. The authors argue that tree-based ensemble methods are a practical fit for national-level energy forecasting.

## Relevance to thesis

This is a useful benchmark. The paper tests the three core models (Linear Regression, Random Forest, XGBoost) and gets a ranking. The context is different — electric energy in Brazil rather than natural gas in the Netherlands — but the methodology is comparable.
