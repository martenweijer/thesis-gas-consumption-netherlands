# Predicting Gas Consumption for Energy Savings and Cost Reduction in District Heating Systems Using Decision Tree Algorithms

Tasić, M., Ćirić, I., Mitrović, D., Kitić, A., Ignjatović, M., Ćirić, M., & Cvetković, S. (2026). Predicting gas consumption for energy savings and cost reduction in district heating systems using decision tree algorithms. In M. Trajanović et al. (Eds.), *Transformative Technologies Shaping a Smarter Society*, Lecture Notes in Networks and Systems 1621. Springer Nature Switzerland AG. https://doi.org/10.1007/978-3-032-04890-5_19

## Summary

This paper applies a decision tree to predict natural gas consumption in a district heating system at the Faculty of Mechanical Engineering in Niš, Serbia. The system is monitored via SCADA, which collects operational data like outdoor temperature, time of day, and delivered thermal energy. The model was trained on the 2022/23 heating season (Oct 15 – Dec 31, 2022) and tested on unseen data from the 2024/25 season (Oct 15 – Dec 31, 2024).

## Research questions

- Can a decision tree accurately predict natural gas consumption in a district heating system?
- How useful is this approach for real-time optimization and energy cost reduction?

## Contributions

- Shows that a decision tree can forecast short-term gas consumption in a district heating plant.
- Claims ML-based predictions can reduce gas costs by 10–25% and operational costs by 15%, while increasing system efficiency by 20%.
- Proposes integrating the model into SCADA/PLC infrastructure for real-time automation.

## Methodology

- **Data source:** SCADA system of the district heating plant (Faculty of Mechanical Engineering, Niš)
- **Input features:** Time and date, outdoor air temperature, delivered thermal energy (kWh)
- **Output:** Gas consumption (m³)
- **Train/test split:** 70% training (2022/23 season), 30% testing; validated on 2024/25 season data
- **Tool:** MATLAB
- **Metrics:** MAE, RMSE, R², MAPE
- Gas consumption was derived proportionally from monthly meter readings using delivered thermal energy ratios

## Results

Training set performance:
- MSE: 1.02346
- R²: 0.99999
- MAPE: 0.08765%
- RMSE: 1.01166

The model fits the training data almost perfectly, predicted values are nearly identical to actuals. It makes me suspicious.

## Limitations

- Only ~2.5 months of training data from a single heating season.
- Single-campus context — not generalizable to residential or municipal scale.
- Just three input features; no socio-demographic or housing factors.
- R² of 0.99999 on training data is suspicious. The model likely memorized the training set.
- Gas consumption wasn't directly measured, it was derived indirectly from thermal energy readings.

## Conclusions

The decision tree worked well for this specific district heating plant. The authors plan to expand the dataset to multiple seasons and hook the model into SCADA/PLC for live control. They also argue that models like this can cut CO₂ emissions by up to 18% over the long term.

## Relevance to thesis

It's a clear example of a decision tree applied to gas consumption prediction. It also confirms that outdoor temperature is a strong predictor, which lines up with the thesis approach. And the background section references several Dutch studies (refs 7–11) on how housing type, building age, and occupancy affect residential gas use, those are directly relevant to feature selection in my thesis.
