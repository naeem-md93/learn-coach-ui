/**
 * @typedef {'login' | 'dashboard' | 'upload' | 'study' | 'quiz' | 'results' | 'progress'} Page
 *
 * @typedef {'Biology' | 'Mathematics' | 'Statistics' | 'Electronics' | 'Physics'} Subject
 *
 * @typedef {Object} Resource
 * @property {string} id
 * @property {string} title
 * @property {'book' | 'article'} type
 * @property {Subject} subject
 * @property {number} pages
 * @property {number} readPages
 * @property {string} uploadedAt
 * @property {string} [cover]
 *
 * @typedef {Object} ChatMessage
 * @property {'user' | 'ai'} role
 * @property {string} content
 * @property {string} timestamp
 *
 * @typedef {Object} QuizQuestion
 * @property {number} id
 * @property {string} question
 * @property {string[]} options
 * @property {number[]} correctAnswers
 * @property {string} explanation
 * @property {string} topic
 */

/** @type {Resource[]} */
export const mockResources = [
  {
    id: '1',
    title: 'Probability, Statistics, and an Introduction to Data Science',
    type: 'book',
    subject: 'Statistics',
    pages: 320,
    readPages: 87,
    uploadedAt: '2024/09/06',
    cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=400&fit=crop&auto=format',
  },
  {
    id: '2',
    title: 'Molecular Biology of the Cell',
    type: 'book',
    subject: 'Biology',
    pages: 480,
    readPages: 210,
    uploadedAt: '2024/08/13',
    cover: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=300&h=400&fit=crop&auto=format',
  },
  {
    id: '3',
    title: 'Fundamentals of Analog Electronics',
    type: 'book',
    subject: 'Electronics',
    pages: 256,
    readPages: 12,
    uploadedAt: '2024/08/25',
    cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=400&fit=crop&auto=format',
  },
  {
    id: '4',
    title: 'Photosynthesis and the Calvin Cycle',
    type: 'article',
    subject: 'Biology',
    pages: 18,
    readPages: 18,
    uploadedAt: '2024/09/01',
    cover: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=300&h=400&fit=crop&auto=format',
  },
  {
    id: '5',
    title: 'Differential and Integral Calculus',
    type: 'book',
    subject: 'Mathematics',
    pages: 398,
    readPages: 145,
    uploadedAt: '2024/07/09',
    cover: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=300&h=400&fit=crop&auto=format',
  },
]

/** @type {QuizQuestion[]} */
export const mockQuizQuestions = [
  {
    id: 1,
    question: 'Which of the following are characteristics of the normal distribution?',
    options: ['The mean, median, and mode are all equal', 'The curve is asymmetric on both sides', 'The area under the curve equals 1', 'The standard deviation is always equal to 1', 'It is always skewed left or right'],
    correctAnswers: [0, 2],
    explanation: 'The normal distribution is a symmetric distribution in which the mean, median, and mode are all equal. Also, the area under the probability curve always equals 1. The standard deviation is 1 in the standard normal distribution, but it can be any value in the general normal distribution.',
    topic: 'Normal Distribution',
  },
  {
    id: 2,
    question: 'The Central Limit Theorem states that:',
    options: ['The sample mean is always equal to the population mean', 'As sample size increases, the distribution of the sample mean approaches normal', 'It cannot be applied to discrete distributions', 'The sample variance equals the population variance', 'At least 30 observations are always sufficient'],
    correctAnswers: [1, 4],
    explanation: 'The Central Limit Theorem is one of the most important theorems in statistics. It states that as sample size increases (typically n≥30), the distribution of the sample mean approaches a normal distribution, regardless of the shape of the population distribution.',
    topic: 'Central Limit Theorem',
  },
  {
    id: 3,
    question: 'In statistical hypothesis testing, what does a Type I Error mean?',
    options: ['Rejecting the null hypothesis when it is true', 'Accepting the null hypothesis when it is false', 'Choosing the wrong significance level', 'Miscalculating the test statistic', 'Rejecting the alternative hypothesis when it is true'],
    correctAnswers: [0],
    explanation: 'A Type I Error (false positive, or alpha error) occurs when the null hypothesis is true but we reject it. The probability of this error equals the significance level alpha, usually chosen as 0.05.',
    topic: 'Hypothesis Testing',
  },
  {
    id: 4,
    question: 'Which of the following statements about Pearson correlation are correct?',
    options: ['Its value is always between -1 and +1', 'It shows a causal relationship', 'It is suitable for ordinal data as well', 'It is invariant to the scale of measurement', 'A value of zero means complete independence'],
    correctAnswers: [0, 3],
    explanation: 'The Pearson correlation coefficient is always between -1 and +1 and is invariant to the scale of measurement (it does not change with a change of units). Correlation does not imply a causal relationship, and a value of zero only indicates the absence of a linear relationship, not complete independence.',
    topic: 'Correlation',
  },
  {
    id: 5,
    question: 'In simple linear regression, which of the following assumptions must hold?',
    options: ['A linear relationship between the variables', 'Normality of the error distribution', 'Independence of the errors', 'The independent variable must be discrete', 'Homoscedasticity (constant variance of errors)'],
    correctAnswers: [0, 1, 2, 4],
    explanation: 'Linear regression has several assumptions: (1) a linear relationship, (2) normality of errors, (3) independence of errors, and (4) homoscedasticity. The independent variable can be either continuous or discrete.',
    topic: 'Regression',
  },
  {
    id: 6,
    question: 'Which of the following methods is used to compare the means of several groups?',
    options: ['Two-sample t-test', 'Analysis of Variance (ANOVA)', 'Chi-square test', 'Logistic regression', 'F-test'],
    correctAnswers: [1, 4],
    explanation: 'One-way Analysis of Variance (ANOVA) and its F-statistic are used to compare the means of more than two groups. The two-sample t-test is only for comparing two groups, and the chi-square test is for categorical data.',
    topic: 'Analysis of Variance',
  },
  {
    id: 7,
    question: 'If the coefficient of determination (R²) of a regression model equals 0.85, what can be inferred?',
    options: ['The model explains 85% of the variation in the dependent variable', 'The correlation coefficient equals 0.92', 'The model is a perfect fit', 'The standard error is small', 'More independent variables should be added'],
    correctAnswers: [0, 1],
    explanation: 'R²=0.85 means the model explains 85% of the variance in the dependent variable. Also, since R²=r² in simple regression, r=√0.85≈0.92. A high R² alone is not proof that the model is a perfect fit.',
    topic: 'Coefficient of Determination',
  },
  {
    id: 8,
    question: 'In Bayesian statistics, the posterior distribution is calculated using which of the following?',
    options: ['The prior distribution', 'The likelihood function', "Bayes' theorem", 'The 95% confidence level', 'The frequentist confidence interval'],
    correctAnswers: [0, 1, 2],
    explanation: "In Bayesian statistics, the posterior distribution is calculated by combining the prior distribution (previous beliefs) and the likelihood function (new data) using Bayes' theorem: P(θ|data) ∝ P(data|θ) × P(θ)",
    topic: 'Bayesian Statistics',
  },
  {
    id: 9,
    question: 'Which of the following metrics is suitable for evaluating a model in classification problems?',
    options: ['Mean Squared Error (MSE)', 'Accuracy', 'Confusion Matrix', 'RMSE', 'AUC-ROC'],
    correctAnswers: [1, 2, 4],
    explanation: 'Accuracy, the Confusion Matrix, and AUC-ROC are used to evaluate classification models. MSE and RMSE are regression metrics, not classification metrics.',
    topic: 'Model Evaluation',
  },
  {
    id: 10,
    question: 'In machine learning, what does overfitting mean?',
    options: ['The model performs well on the training data', 'The model performs poorly on new data', 'The model has low complexity', 'Regularization was not used', 'The model has high variance'],
    correctAnswers: [0, 1, 4],
    explanation: 'Overfitting occurs when a model also learns the noise in the training data: high accuracy on training data (option 1) but poor performance on new data (option 2). This corresponds to high variance (option 5) in the model.',
    topic: 'Machine Learning',
  },
]

export const pdfPages = [
  {
    page: 1,
    content: `Chapter 3: Continuous Probability Distributions

In this chapter, we introduce the most important continuous probability distributions, which are widely used in statistical data analysis.

3.1 The Normal Distribution

The normal distribution, or Gaussian distribution, is one of the most fundamental probability distributions in statistics. It was introduced by the German mathematician Carl Friedrich Gauss and is used today across all fields of science.

Probability density function:
f(x) = (1/σ√2π) × exp(-(x-μ)²/2σ²)

where:
  • μ: population mean
  • σ: population standard deviation
  • π: pi (≈ 3.14159)

Key properties of the normal distribution:
1. The curve is perfectly symmetric about the mean
2. The mean, median, and mode are all equal
3. The area under the curve equals 1 (the law of total probability)
4. About 68% of the data fall within μ±σ
5. About 95% of the data fall within μ±2σ
6. About 99.7% of the data fall within μ±3σ (the 3-sigma rule)`,
  },
  {
    page: 2,
    content: `3.2 The Standard Normal Distribution

The standard normal distribution is a special case of the normal distribution in which μ=0 and σ=1.

To convert any observation from a normal distribution to the standard normal, we use the Z-score:

Z = (X - μ) / σ

This transformation lets us use standard normal tables (Z-tables) to compute probabilities.

Example 3.1:
Suppose the heights of students at a university follow a normal distribution with a mean of 175 cm and a standard deviation of 8 cm. What percentage of students have a height between 167 and 183 cm?

Solution:
Z₁ = (167 - 175) / 8 = -1
Z₂ = (183 - 175) / 8 = +1

P(-1 < Z < +1) = P(Z < 1) - P(Z < -1) = 0.8413 - 0.1587 = 0.6826

So about 68.26% of students fall within this range.

Important note: the additivity property
If X ~ N(μ, σ²) and Y ~ N(ν, τ²) and they are independent, then:
X + Y ~ N(μ+ν, σ²+τ²)`,
  },
  {
    page: 3,
    content: `3.3 The Central Limit Theorem

The Central Limit Theorem (CLT) is one of the most important and remarkable theorems in mathematical statistics.

Statement of the theorem:
If X₁, X₂, ..., Xₙ is a random sample from a population with mean μ and finite variance σ², then as n increases, the distribution of:

X̄ₙ = (X₁ + X₂ + ... + Xₙ) / n

approaches a normal distribution with mean μ and standard deviation σ/√n.

In other words:
Zₙ = (X̄ₙ - μ) / (σ/√n) → N(0, 1)

Why this theorem matters:
This theorem explains why so many natural phenomena have an approximately normal distribution — because each phenomenon is the result of the sum of many small independent factors.

Moreover, this theorem underlies many statistical methods and lets us use normal-based methods even for populations that are not normally distributed — as long as the sample size is large enough (typically n ≥ 30).`,
  },
]

/** @type {Record<string, { bg: string; text: string; dot: string }>} */
export const subjectColors = {
  Biology: { bg: 'bg-success/10', text: 'text-success', dot: 'bg-success' },
  Mathematics: { bg: 'bg-primary/10', text: 'text-primary', dot: 'bg-primary' },
  Statistics: { bg: 'bg-accent/10', text: 'text-accent', dot: 'bg-accent' },
  Electronics: { bg: 'bg-warning/10', text: 'text-warning', dot: 'bg-warning' },
  Physics: { bg: 'bg-danger/10', text: 'text-danger', dot: 'bg-danger' },
}

/** @type {Record<string, string>} */
export const subjectLabels = {
  Biology: 'Biology',
  Mathematics: 'Mathematics',
  Statistics: 'Statistics',
  Electronics: 'Electronics',
  Physics: 'Physics',
}
