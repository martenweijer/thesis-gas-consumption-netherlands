# Natural Gas Consumption Forecasting Based on the Variability of External Meteorological Factors Using Machine Learning Algorithms
Panek, W.; Wlodek, T. (2022). Natural Gas Consumption Forecasting Based on the Variability of External Meteorological Factors Using Machine Learning Algorithms. *Energies*, 15, 348. https://doi.org/10.3390/en15010348

## Summary

This paper compares MLR, Random Forest, and a deep neural network for forecasting daily natural gas demand by municipal consumers in a medium-sized Polish city (~85,000 residents). Five years of hourly gas flow data from four metering stations, combined with meteorological data, go into the models. Two forecast horizons are tested: same-day and one day ahead. RF comes out on top, though its margin over DNN is thin.

## Research questions

- Which ML algorithm best predicts natural gas demand at the municipal level?
- Which meteorological and other external factors have the most impact on consumption?
- How does accuracy change as the forecast horizon increases?

## Contributions

- Empirical comparison of MLR, RF, and DNN for municipal-level natural gas forecasting in a Polish climate context
- Quantitative analysis of which meteorological factors matter most (air temperature dominates, Pearson r = −0.91)
- Shows that previous-day consumption is the strongest single predictor (R² = 0.98 with daily demand)
- Python implementation with outlier removal (Isolation Forest), data scaling, and model serialization

## Methodology

- **Data:** Five years of hourly gas flow data from four NG metering/reducing stations; meteorological data (air temperature, humidity, wind speed, cloud cover, vapor pressure, atmospheric pressure, rain/snowfall) at 1-hour intervals from the Institute of Meteorology and Water Management
- **Features:** Month, cloud cover, wind velocity, vapor pressure, air temperature, humidity, atmospheric pressure, related atmospheric pressure, rain/snowfall, previous-day NG demand, day of week
- **Target:** Daily natural gas consumption (m³)
- **Train/test split:** 70% training, 30% test (random split)
- **Models:**
  - MLR: standard ordinary least squares
  - RF: bootstrap aggregation of decision trees
  - DNN: 5 hidden layers (25→17→10→7→3 neurons), ReLU activation, Adam optimizer, MSE loss
- **Evaluation metrics:** R², RMSE, MAPE, STD of APE

## Results

| Algorithm | Horizon | R² | RMSE | MAPE |
|---|---|---|---|---|
| MLR | Current day | 0.995 | 3664.90 | 4.73% |
| MLR | +1 day | 0.978 | 8300.58 | 10.63% |
| RF | Current day | 0.998 | 2179.02 | 1.61% |
| RF | +1 day | 0.983 | 7289.73 | 7.53% |
| DNN | Current day | 0.998 | 2181.74 | 2.46% |
| DNN | +1 day | 0.978 | 8458.93 | 10.84% |

- RF is best for both horizons, but DNN is close on same-day prediction
- All three models hit R² > 0.97 across both forecast horizons
- Air temperature (r = −0.91) and previous-day consumption (r = 0.98) are the dominant predictors
- Month (r = 0.69) and humidity (r = 0.44) help, but less so
- Cloud cover (r = −0.035) and day of week (r = 0.15) barely matter
- Gas consumption is roughly four times higher in winter than summer

## Limitations

- Single city in south-eastern Poland; how well this generalizes to other climates is unknown
- Gas consumption data is confidential and not published
- No industrial consumers in the network, so demand is entirely residential/municipal
- DNN training takes significantly longer than RF
- Not all distribution areas have nearby weather stations, which limits scaling up

## Conclusions

RF works best for both same-day and day-ahead forecasting, though the gap with DNN is small. MLR holds up reasonably on same-day prediction but falls apart a day out (MAPE goes from 4.73% to 10.63%). RF's main advantage over DNN isn't accuracy — it's training time. Previous-day consumption and air temperature carry most of the predictive weight. Weather stations cover the approach reasonably well, but missing station coverage in parts of the distribution network is a real constraint.

## Relevance to thesis

- RF as a strong baseline is well-supported here. MAPE of 1.61% for same-day prediction is a useful benchmark to compare against.
- Air temperature and lagged consumption are the features that matter most. That supports using KNMI weather data and temporal lag features.
