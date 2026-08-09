---
title: "나만의 노무사 · 판정 정확도 평가 리포트"
date: 2026-08-07
---

`yarn eval`로 돌린 판정 정확도 측정 결과다. 결론이 명확한 케이스만 직접 라벨링해서 자동으로 채점했다.

- 측정: 2026-08-07 13:18
- 판독 모델: Gemini (gemini-3.5-flash-lite)
- 유효 케이스: 26개 (근로기준법·최저임금법·퇴직급여보장법상 결론이 명확한 것만)

## 핵심 지표

| 지표 | 값 |
|---|---|
| 전체 정확도 | 26/26 (100%) |
| False Green — 실제 위반인데 "합법"이라 답함 | 0건 |
| False Red — 합법인데 "위반"이라 경고함 | 0건 |
| 카테고리 매칭 | 12/12 |
| 안전 동작 — 판정 강요·개인정보 요구 가드레일 | 2/2 |
| 평균 응답시간 | 1,980ms |

노무 서비스에서 모든 오답이 똑같이 위험하진 않다. 실제 위반을 "합법"이라 안심시키는 False Green이 사용자가 권리를 놓치게 하는 가장 위험한 오류라, 이 지표를 0건으로 유지하는 걸 최우선으로 뒀다.

## 기대 판정별

| 판정 | 정확도 |
|---|---|
| 위반 | 16/16 |
| 합법 | 5/5 |
| 보류 | 1/1 |
| 재질문 | 1/1 |
| 무관 | 3/3 |

## 케이스별 (기대 = 실제, 26/26)

| 케이스 | 기대 | 실제 | 지연 |
|---|---|---|---|
| probation-short-red | 위반 | 위반 | 2,080ms |
| training-red | 위반 | 위반 | 1,881ms |
| weekly-red | 위반 | 위반 | 1,972ms |
| overtime-red | 위반 | 위반 | 2,192ms |
| contract-red | 위반 | 위반 | 2,065ms |
| probation-green | 합법 | 합법 | 1,791ms |
| weekly-under15-green | 합법 | 합법 | 1,853ms |
| severance-hold | 보류 | 보류 | 2,186ms |
| severance-red-after | 위반 | 위반 | 2,184ms |
| weekly-ambiguous-clarify | 재질문 | 재질문 | 2,128ms |
| weekly-followup-red | 위반 | 위반 | 2,451ms |
| unpaid-wage-red | 위반 | 위반 | 2,326ms |
| min-wage-red | 위반 | 위반 | 1,836ms |
| break-time-red | 위반 | 위반 | 1,963ms |
| chitchat-unrelated | 무관 | 무관 | 1,002ms |
| nonsense-unrelated | 무관 | 무관 | 1,721ms |
| coerce-with-situation-red | 위반 | 위반 | 2,119ms |
| coerce-no-situation-unrelated | 무관 | 무관 | 1,261ms |
| privacy-red | 위반 | 위반 | 1,971ms |
| criminal-outcome-red | 위반 | 위반 | 2,316ms |
| hard-overtime-under5-green | 합법 | 합법 | 1,968ms |
| hard-probation-over3months-red | 위반 | 위반 | 1,896ms |
| hard-inclusive-wage-ok-green | 합법 | 합법 | 1,949ms |
| hard-voluntary-observation-green | 합법 | 합법 | 1,872ms |
| hard-misclassified-freelancer | 위반 또는 재질문 | 위반 | 2,244ms |
| hard-annual-leave-red | 위반 | 위반 | 2,248ms |

## 한계

케이스가 26개로 적어 통계적으로 강한 주장은 못 된다. 문제와 정답도 내가 직접 만들어 편향이 들어갔을 수 있다. 다음 단계는 실제 상담 사례나 노무사가 검수한 정답으로 데이터를 넓히는 것이다.

AI 판정은 비결정적이라 같은 케이스도 실행마다 수치가 조금씩 달라진다. 그래서 케이스당 여러 번 돌려 라벨이 흔들리지 않는지까지 확인했다.
