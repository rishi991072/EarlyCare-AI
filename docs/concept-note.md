# Project Concept Note: EarlyCare AI

## Problem
People may need help understanding whether reported symptoms warrant monitoring, routine medical advice, or urgent attention. Online symptom tools can be misunderstood as diagnostic systems.

## Proposed solution
EarlyCare AI is an educational prototype that collects a small set of user-reported symptoms and context, checks a limited set of warning signs first, and returns understandable next steps. Its initial implementation is rule-based; it does not claim to diagnose conditions.

## SDG alignment
United Nations Sustainable Development Goal 3: Good Health and Well-being. The project explores accessible health information and responsible digital-health design.

## Intended users
For demonstration and learning: students, educators, and people exploring how a health-screening interface might work. It is not for clinical use.

## Scope
- Responsive web interface
- Validated API input
- Conservative warning-sign prompts
- Transparent limitations
- Future dataset-backed ML experiments, if a suitable dataset and evaluation justify them

## Risks and safeguards
Health information is sensitive. The MVP does not save assessment history. Emergency warning signs take priority. No medication recommendations or confirmed diagnoses are provided. The warning checks are limited and do not replace professional triage.

## Evaluation plan
Test API validation, warning-sign precedence, frontend integration, usability, and—only after data selection—ML performance on held-out data. Report class-wise precision, recall, F1, confusion matrix, and false negatives where appropriate.
