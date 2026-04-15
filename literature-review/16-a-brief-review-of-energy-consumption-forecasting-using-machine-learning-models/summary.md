# A Brief Review of Energy Consumption Forecasting Using Machine Learning Models
Eddaoudi, Z., Aarab, Z., Boudmen, K., Elghazi, A., & Rahmani, M. D. (2024). A brief review of energy consumption forecasting using machine learning models. *Procedia Computer Science*, 236, 33–40. https://doi.org/10.1016/j.procs.2024.05.001

## Summary

This paper is a short literature review of ML methods used for energy consumption forecasting. It covers buildings, industry, electric vehicles, and ships. The authors survey papers from 2016 to 2022 and put together a comparison table of ML techniques, prediction granularity, data sources, and energy types. The main claim is that ML models beat traditional statistical methods for energy prediction, and that deep learning and hybrid ensemble methods are showing up more often as datasets get larger.

## Research questions

- What ML techniques are used for energy consumption forecasting across different sectors?
- How do different ML methods compare in terms of accuracy and applicability?

## Contributions

- Overview of renewable and non-renewable energy types and their relevance to forecasting
- Summary of supervised and unsupervised ML paradigms in the context of energy prediction
- Comparative table of 20+ papers covering ML techniques, sectors, prediction frequency, and energy types
- Trends identified: shift toward hybrid and ensemble methods, growing use of deep learning

## Methodology

Literature review. The authors searched for energy consumption prediction studies from 2016 to 2022. Papers were selected based on ML use for energy consumption and organized into a comparison table. No quantitative meta-analysis was done.

## Results

- Electricity consumption in buildings is the most studied target. ANN, LSTM, SVM, and RF are the most common models.
- XGBoost and SVR are popular for electric vehicle energy prediction
- Single ML models (ANN, SVM) hold up fine for small datasets or short-term forecasts. Deep learning and ensemble methods pull ahead with more data and longer horizons.
- Hybrid methods like RF-LSTM and CNN-LSTM show the highest reported accuracy in recent work
- Gas consumption appears in one study (Ngo et al., 5 educational buildings, hourly granularity) alongside electricity

## Limitations

- No performance metrics are reported in the comparison table; accuracy claims are qualitative
- Coverage is uneven: buildings dominate, other sectors receive little attention
- Only covers supervised and unsupervised learning; no discussion of semi-supervised or reinforcement learning despite mentioning them in the introduction

## Conclusions

ML models, especially deep learning and hybrid approaches, are effective for energy consumption forecasting. The building sector is the most active area of research. The trend is toward combining multiple models to improve accuracy and efficiency. Future work should focus on faster and more accurate hybrid models.

## Relevance to thesis

This paper provides a useful high-level map of which ML models are used for energy forecasting in general. The mention of natural gas consumption (Ngo et al. [50]) is relevant, but the paper does not discuss municipal-level aggregation, socio-demographic features, or residential gas specifically. It confirms that Random Forest, XGBoost, ANN, and SVR are standard choices for energy prediction tasks.
