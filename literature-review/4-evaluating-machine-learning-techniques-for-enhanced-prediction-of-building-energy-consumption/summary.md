# Evaluating Machine Learning Techniques for Enhanced Prediction of Building Energy Consumption
Vonitsanos, G., Kanavos, A., & Mylonas, P. (2024). Evaluating machine learning techniques for enhanced prediction of building energy consumption. In *2024 9th South-East Europe Design Automation, Computer Engineering, Computer Networks and Social Media Conference (SEEDA-CECNSM)* (pp. 50–57). IEEE. https://doi.org/10.1109/SEEDA-CECNSM63478.2024.00018

## Summary

This paper tests SVM, Random Forest, Decision Tree, and KNN for predicting hourly electricity consumption in three Cornell University buildings. Data runs from January 2022 to June 2024. Every model gets a negative R² on every building, meaning none of them beat a simple mean prediction. SVM is the least bad across all metrics.

## Research questions

- Which ML algorithm most accurately predicts electricity consumption in university buildings?
- How do SVM, Random Forest, Decision Tree, and KNN compare across standard regression metrics?

## Contributions

- Comparison of four ML algorithms on real hourly electricity data from three buildings
- Shows SVM consistently outperforms the other three on MSE, RMSE, MAE, and MAPE
- Uses Apache Spark for data processing, very interesting choice

## Methodology

- **Data:** Hourly electricity consumption from three Cornell University buildings (AmericanIndianProgramHouse, AppelCommons, GrummanHall), Jan 2022 – June 2024
- **Split:** 80% train, 20% test
- **Preprocessing:** SimpleImputer for missing values, StandardScaler for numerical features, ColumnTransformer for categorical encoding
- **Models:** SVM, Random Forest, Decision Tree, KNN
- **Evaluation metrics:** MSE, RMSE, MAE, MAPE, R²
- **Tools:** Apache Spark, Python

## Results

GrummanHall building (Table III):

| Algorithm | MSE | RMSE | MAE | MAPE | R² |
|-----------|-----|------|-----|------|----|
| Decision Tree | 69.77 | 25.29 | 20.44 | 23.62% | -0.73 |
| KNN | 55.19 | 22.70 | 18.11 | 21.25% | -0.39 |
| Random Forest | 47.62 | 20.68 | 16.17 | 19.24% | -0.16 |
| SVM | 39.87 | 19.75 | 15.51 | 18.41% | -0.05 |

SVM ranks first across all three buildings. But every R² is negative. Decision Tree is worst by a wide margin (R² = -0.73 on GrummanHall), and even SVM only gets to -0.05.

## Limitations

- All R² values are negative across all buildings and models — none of them are actually useful for this task
- No hyperparameter tuning or cross-validation mentioned
- Only three buildings at one campus
- No XGBoost or gradient boosting models tested
- No feature importance or interpretability analysis

## Conclusions

SVM works best among the four, but "best" is relative. The authors still frame this as a success for SVM, which is a stretch when no model beats a mean predictor. Future work suggestions are simple: refine SVM, try ensemble methods, add external features like weather and user behavior. Nothing specific.

## Relevance to thesis

The negative R² scores raises real questions about the paper's quality. Worth a passing mention as background on ML for energy consumption only.
