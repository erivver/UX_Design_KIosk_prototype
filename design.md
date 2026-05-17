# design.md — 세로형 키오스크 카드키 재발급 UI Design System

## 0. 디자인 방향

본 디자인은 업로드된 키오스크 화면 이미지를 기반으로 추출한 스타일을 따른다. 전체 톤은 **밝은 화이트 배경, 연한 피치/베이지 계열 포인트 컬러, 부드러운 회색 텍스트, 큰 카드형 버튼, 중앙 정렬 모달**을 중심으로 구성한다.

타겟 디바이스가 **1080 × 1920 px 세로형 키오스크**이므로, 모바일보다 훨씬 큰 화면이지만 사용자는 서서 빠르게 조작한다. 따라서 UI는 작은 정보 밀도보다 **큰 터치 영역, 명확한 문장, 단순한 단계 진행, 오류 복구 가능성**을 우선한다.

---

## 1. 기준 캔버스

| 항목 | 값 |
|---|---|
| Device | Portrait Kiosk |
| Resolution | 1080 × 1920 px |
| Safe Margin | 좌우 96 px, 상단 72 px, 하단 96 px |
| Content Width | 888 px 권장 |
| Modal Width | 720~780 px 권장 |
| Primary CTA Width | 640~760 px 권장 |
| Grid | 12 columns, gutter 24 px |
| Corner Radius Base | 16~24 px |

---

## 2. 이미지 기반 Design System 추출

### 2.1 시각적 특징

| 항목 | 추출 내용 |
|---|---|
| 배경 | 거의 흰색에 가까운 웜 화이트 |
| 포인트 컬러 | 연한 피치/오렌지 컬러. 주요 제목 강조, CTA 버튼, 선택 상태에 사용 |
| 텍스트 컬러 | 진한 차콜보다는 부드러운 쿨 그레이 사용 |
| 카드 | 흰색 카드 + 연한 회색 stroke + 약한 그림자 |
| 모달 | dim overlay 위 중앙 흰색 박스 |
| 아이콘 | 얇은 라인 아이콘, 회색/피치 톤 |
| 정보 구조 | 상단 상태, 중앙 핵심 안내, 하단 고객센터/네비게이션 |

### 2.2 Color Tokens

이미지에서 보이는 색감을 기반으로 실제 구현에 사용할 수 있도록 접근성을 보정한 토큰이다. 원본 이미지는 전반적으로 대비가 낮으므로, 실사용 키오스크에서는 텍스트 컬러를 더 진하게 적용하는 것을 권장한다.

```css
:root {
  /* Brand / Main */
  --color-primary-50: #FFF4ED;
  --color-primary-100: #F7E0D0;
  --color-primary-200: #EDC6A6;
  --color-primary-300: #E5B184;
  --color-primary-400: #D99A67;
  --color-primary-500: #C9844F;

  /* Background */
  --color-bg-base: #FFFCFA;
  --color-bg-soft: #FAF6F2;
  --color-surface: #FFFFFF;
  --color-surface-muted: #F7F3F0;

  /* Text */
  --color-text-strong: #4F5663;
  --color-text-default: #6F7682;
  --color-text-muted: #9CA1AA;
  --color-text-disabled: #C9CDD3;

  /* Border / Divider */
  --color-border-light: #ECE8E4;
  --color-border-default: #DDD8D4;
  --color-border-focus: #E5B184;

  /* Dim / Overlay */
  --color-dim: rgba(31, 36, 45, 0.58);

  /* Feedback */
  --color-success: #8A9B7A;
  --color-warning: #D99A67;
  --color-error: #D96B5F;
}
```

### 2.3 Typography Tokens

키오스크 접근성을 위해 일반 웹/모바일보다 큰 폰트 크기를 사용한다.

| Token | Size | Weight | Usage |
|---|---:|---:|---|
| Display/Large | 72 px | 700 | 홈 대제목, 완료 객실번호 |
| Heading/XL | 60 px | 700 | 주요 화면 제목 |
| Heading/L | 52 px | 700 | 모달 메인 문구 |
| Heading/M | 44 px | 600 | 섹션 제목, 카드 제목 |
| Body/L | 34 px | 500 | 본문 주요 안내 |
| Body/M | 30 px | 500 | 설명 문구, 정보 라벨 |
| Body/S | 26 px | 400 | 보조 문구, 하단 안내 |
| Caption | 22 px | 400 | 시간, 전화번호, 카운트다운 |

```css
--font-family-base: "Pretendard", "Noto Sans KR", system-ui, sans-serif;
--font-display-large: 700 72px/1.24 var(--font-family-base);
--font-heading-xl: 700 60px/1.28 var(--font-family-base);
--font-heading-l: 700 52px/1.32 var(--font-family-base);
--font-heading-m: 600 44px/1.36 var(--font-family-base);
--font-body-l: 500 34px/1.5 var(--font-family-base);
--font-body-m: 500 30px/1.5 var(--font-family-base);
--font-body-s: 400 26px/1.5 var(--font-family-base);
--font-caption: 400 22px/1.4 var(--font-family-base);
```

---

## 3. Spacing / Radius / Shadow Tokens

```css
--space-4: 4px;
--space-8: 8px;
--space-12: 12px;
--space-16: 16px;
--space-24: 24px;
--space-32: 32px;
--space-40: 40px;
--space-48: 48px;
--space-64: 64px;
--space-80: 80px;
--space-96: 96px;
--space-120: 120px;

--radius-sm: 12px;
--radius-md: 20px;
--radius-lg: 28px;
--radius-xl: 36px;

--shadow-card: 0 8px 24px rgba(42, 48, 56, 0.06);
--shadow-modal: 0 20px 60px rgba(42, 48, 56, 0.18);
```

---

## 4. 접근성 기준 — Kiosk Accessibility

### 4.1 터치 영역

| 컴포넌트 | 최소 크기 | 권장 크기 |
|---|---:|---:|
| Primary CTA | 560 × 96 px | 720 × 120 px |
| Secondary Button | 320 × 88 px | 420 × 104 px |
| Icon Button | 88 × 88 px | 104 × 104 px |
| 카드형 선택 버튼 | 720 × 160 px | 840 × 200 px |
| 키보드 키 | 72 × 72 px | 88 × 88 px |
| 스테퍼 버튼 | 96 × 96 px | 112 × 112 px |

### 4.2 가독성

- 본문 텍스트는 최소 30 px 이상 사용한다.
- 핵심 안내 문구는 44~60 px로 구성한다.
- 원본 이미지처럼 연한 회색 텍스트만 사용할 경우 시인성이 낮아질 수 있으므로, 실제 구현에서는 `--color-text-strong` 또는 `--color-text-default`를 사용한다.
- 오류 문구는 빨간색만 사용하지 말고 아이콘과 함께 제공한다.

### 4.3 조작 흐름

- 한 화면에서 사용자가 해야 할 행동은 하나만 강조한다.
- CTA는 화면 하단 65~80% 영역에 배치해 손이 닿기 쉽게 한다.
- 자동 이동이 있는 화면은 남은 시간 또는 자동 이동 문구를 반드시 표시한다.
- 모든 취소/뒤로가기 동작은 사용자가 이전 상태로 돌아갈 수 있어야 한다.

---

## 5. Component System

## 5.1 Button

### Primary Button

| 속성 | 값 |
|---|---|
| 용도 | 다음 단계 진행, 확인, 재발급 진행 |
| Height | 112~120 px |
| Width | 640~760 px |
| Radius | 16~20 px |
| Background | `--color-primary-300` |
| Text | white 또는 접근성 보정 시 `#FFFFFF` |
| Font | Body/L 또는 Heading/M |
| Disabled Background | `--color-primary-100` |
| Disabled Text | `#FFFFFF` with 70% opacity |

### Secondary Button

| 속성 | 값 |
|---|---|
| 용도 | 취소, 처음 화면으로, 보조 이동 |
| Height | 96~104 px |
| Width | 360~520 px |
| Radius | 16~20 px |
| Background | `--color-surface` |
| Border | 2 px solid `--color-border-default` |
| Text | `--color-text-default` |

### Assist / Problem Button

| 속성 | 값 |
|---|---|
| 용도 | Main Home의 문제발생 진입 |
| Height | 96~112 px |
| Width | 360~480 px 또는 카드형 840 px |
| Background | `--color-bg-soft` 또는 `--color-primary-50` |
| Border | 2 px solid `--color-primary-200` |
| Icon | 느낌표/도움 아이콘 |
| Text | 문제발생 |

---

## 5.2 Card

### Function Card

| 속성 | 값 |
|---|---|
| 용도 | 홈 기능 선택, 문제 유형 선택 |
| Background | `--color-surface` |
| Border | 2 px solid `--color-border-light` |
| Radius | 20~28 px |
| Shadow | `--shadow-card` |
| Padding | 40~48 px |
| Min Height | 180~240 px |
| Title Font | Heading/M |
| Icon Size | 72~96 px |

### Reservation Info Card

| 속성 | 값 |
|---|---|
| 용도 | 예약 확인 화면의 예약 정보 표시 |
| Layout | 이미지 좌측, 객실 정보 우측, 하단 예약 세부 정보 |
| Image Size | 260 × 180 px 권장 |
| Label Font | Body/S |
| Value Font | Body/M 또는 Body/L |
| Divider | 필요 시 `--color-border-light` |

---

## 5.3 Modal

| 속성 | 값 |
|---|---|
| Overlay | `--color-dim` |
| Modal Width | 720~780 px |
| Modal Min Height | 560 px |
| Background | `--color-surface` |
| Radius | 20~28 px |
| Padding | 56~72 px |
| Shadow | `--shadow-modal` |
| Title Font | Heading/L |
| Body Font | Body/M |
| Image Area | 360 × 220 px 권장 |
| CTA Button | 하단 고정, 높이 104~112 px |

### Modal Rules

- 모달은 화면 중앙에 배치한다.
- 모달 밖 배경은 58% 이상의 dim을 적용해 현재 작업에 집중시킨다.
- 모달 제목은 2줄 이하로 유지한다.
- 취소 버튼이 있는 경우, 실수 방지를 위해 Primary CTA보다 시각적 강도를 낮춘다.

---

## 5.4 Input Field

| 속성 | 값 |
|---|---|
| Height | 104~120 px |
| Width | 840~888 px |
| Radius | 16~20 px |
| Border | 2 px solid `--color-border-light` |
| Focus Border | 3 px solid `--color-border-focus` |
| Placeholder | `--color-text-muted` |
| Text | `--color-text-strong` |
| Font | Body/L |
| Padding | 좌우 32 px |

---

## 5.5 Tabs

| 속성 | 값 |
|---|---|
| 항목 | 예약자명 / QR코드 / 예약번호 |
| Height | 80 px |
| Active Text | `--color-primary-400` |
| Inactive Text | `--color-text-muted` |
| Active Underline | 4 px, `--color-primary-300` |
| Font | Body/M |

---

## 5.6 Numeric Stepper

| 속성 | 값 |
|---|---|
| 용도 | 객실 키 수량 선택 |
| Button Size | 104 × 104 px |
| Number Font | Heading/M |
| Min | 1 |
| Max | 호텔 정책값. 현재 MVP 권장값 2 |
| Disabled | opacity 40% |
| Active | `--color-primary-300` 또는 `--color-text-default` |

---

## 5.7 Progress Indicator

| 속성 | 값 |
|---|---|
| 용도 | 재발급 진행 중 상태 표시 |
| Type | Indeterminate 또는 예상 소요 시간 텍스트 중심 |
| Text | “2분 정도 소요될 예정이에요.” |
| Bar Width | 240~320 px |
| Bar Height | 6~8 px |
| Color | `--color-primary-300` |

---

## 6. Layout Pattern

### 6.1 기본 화면 레이아웃

```text
1080 × 1920
┌──────────────────────────────┐
│ Top Status: hotel / date time │ 72~120
├──────────────────────────────┤
│ Main Title Area               │ 200~420
│ 핵심 문구 / 화면 제목          │
├──────────────────────────────┤
│ Main Content Area             │ 420~1400
│ 카드, 입력필드, 예약정보 등     │
├──────────────────────────────┤
│ Primary CTA Area              │ 1400~1660
├──────────────────────────────┤
│ Bottom Navigation / CS         │ 1660~1920
└──────────────────────────────┘
```

### 6.2 모달 레이아웃

```text
Dim Overlay Full Screen
┌──────────────────────────────┐
│                              │
│        ┌────────────┐        │
│        │ Modal      │        │
│        │ Title      │        │
│        │ Image      │        │
│        │ Controls   │        │
│        │ CTA        │        │
│        └────────────┘        │
│                              │
└──────────────────────────────┘
```

---

## 7. Page Design Specifications

## 7.1 `MAIN_HOME.png`

### 디자인 설명

- 전체 배경은 웜 화이트.
- 상단에는 작은 상태 정보와 날짜/시간이 배치된다.
- 중앙 상단에 호텔명과 큰 제목 `셀프 체크인`이 위치한다.
- 주요 기능은 카드형 버튼으로 배치한다.
- 하단에는 언어 선택과 전화문의가 있다.
- 신규 `문제발생` 버튼은 기존 기능과 충돌하지 않도록 보조 버튼으로 추가한다.

### 추가 버튼 배치 제안

| 항목 | 값 |
|---|---|
| 위치 | 주요 카드 영역 하단, 언어 선택 영역 위 |
| 크기 | 840 × 112 px |
| 텍스트 | 문제발생 |
| 아이콘 | 원형 느낌표 또는 도움 아이콘 |
| 스타일 | 피치 톤 outline button |

---

## 7.2 `PROBLEM_SELECT`

### 디자인 설명

신규 설계 화면이다. 기존 디자인 시스템을 유지하되, 사용자가 문제 유형을 쉽게 선택하도록 큰 카드 3개를 세로로 배치한다.

### 구성

```text
상단 상태 영역
제목: 어떤 문제가 발생했나요?
보조 문구: 해결이 필요한 항목을 선택해주세요.
[카드키 재발급]
[상태확인]
[도움요청]
하단: 전화문의 / 홈 / 뒤로가기
```

### 카드 스타일

- 각 카드 크기: 840 × 200 px
- 카드 간격: 32 px
- 아이콘: 88 px
- 제목: 44 px
- 설명: 28~30 px

---

## 7.3 `Problemsolve_Cardkey_reiussue_depth01.png`

### 디자인 설명

예약자명 입력 화면은 기존 이미지와 동일한 정보 구조를 유지한다. 제목에서 `예약자명`만 메인 컬러로 강조한다.

### 상세 구성

| 영역 | 디자인 |
|---|---|
| 제목 | 좌측 정렬, 2줄 가능. “예약자명” 강조 |
| 탭 | 3분할 탭, 예약자명 활성화 |
| 입력 필드 | 중앙 넓은 필드. placeholder 표시 |
| 키보드 | 한글 키보드. 키 간격 충분히 확보 |
| 안내 문구 | 오류/도움 안내는 입력 필드 아래 |
| CTA | 하단 넓은 버튼. 입력 전 비활성화 |

---

## 7.4 `Problemsolve_Cardkey_reiussue_depth02.png`

### 디자인 설명

예약이 확인되었다는 성공 상태를 먼저 보여주고, 사용자가 예약 정보가 본인 것인지 확인한 뒤 재발급을 진행한다.

### CTA 변경

- 기존: 체크인 진행
- 변경: 재발급 진행

### 접근성 보정

- 예약자명과 예약번호는 작은 글씨로 흐리게 보이지 않도록 최소 30 px 이상 사용한다.
- CTA는 화면 하단 중앙에 720 × 112 px 크기로 배치한다.

---

## 7.5 `Problemsolve_Cardkey_reiussue_depth03.png`

### 디자인 설명

기존 객실 키 삽입 안내 모달이다. 배경은 dim 처리하고, 중앙에 모달을 배치한다.

### 수정 문구

```text
카드키 재발급을 위해
객실 키를 넣어주세요.
```

### 모달 구성

| 요소 | 권장 값 |
|---|---|
| Modal Width | 760 px |
| Title | 44~52 px |
| Image | 360 × 220 px |
| Cancel Button | 420 × 96 px |
| Timer Text | 24~26 px |

---

## 7.6 `Problemsolve_Cardkey_reiussue_depth04.png`

### 디자인 설명

객실 키 수량 선택 모달이다. 배경의 진행 문구를 재발급 맥락으로 변경한다.

### 수정 문구

```text
객실키 재발급을 진행하고 있어요.
잠시만 기다려주세요.
```

### 모달 구성

| 요소 | 권장 값 |
|---|---|
| Title | 객실 키 수량을 선택해주세요. |
| Stepper | -, 숫자, + 구조 |
| CTA | 확인 |
| Timer | 9초 후 다음 화면으로 이동합니다 |

---

## 7.7 `Problemsolve_Cardkey_reiussue_depth05.png`

### 디자인 설명

처리 진행 중 화면이다. 기존 체크인 진행 화면을 재발급 처리 화면으로 전환한다.

### 수정 문구

```text
객실키 재발급을 진행하고 있어요.
잠시만 기다려주세요.
```

진행 상태 문구:

```text
2분 정도 소요될 예정이에요.
```

### 디자인 주의사항

- % 진행률 대신 예상 소요 시간 중심으로 안내한다.
- 장비 처리 중 사용자가 중복 조작하지 않도록 CTA를 제공하지 않는다.
- 2분 이상 지연될 경우 오류/도움요청 분기로 전환할 수 있는 상태 설계가 필요하다.

---

## 7.8 `Problemsolve_Cardkey_reiussue_depth06.png`

### 디자인 설명

발급된 객실 키를 수령하도록 안내하는 모달이다. 원본 이미지와 동일한 구조를 유지한다.

### 구성

| 요소 | 설명 |
|---|---|
| Title | 객실 키를 받아주세요. |
| Image | 객실 키 발급구 이미지 |
| Room Number | 0916호 등 큰 숫자보다 작게 표시 가능 |
| Count | 객실 키 (0/2) |
| 안내 문구 | 객실 키를 받으면 다음 객실 키가 발급되어요 |
| Timer | 30초 후 다음 화면으로 이동합니다 |

---

## 7.9 `Problemsolve_Cardkey_reiussue_depth07.png`

### 디자인 설명

카드키 발급 완료 상태를 보여주는 화면이다. 기존 체크인 완료 화면에서 문구를 변경한다.

### 수정 문구

```text
객실 키 발급이 완료되었어요.
객실 키를 받아주세요.
```

### 구성

- 상단 체크 아이콘
- 완료 문구
- 객실 번호 `0916호`
- 객실 타입
- 예약 기간 정보
- `처음 화면으로` 버튼
- 자동 이동 안내

---

## 7.10 `Problemsolve_Cardkey_reiussue_depth08`

### 디자인 설명

이미지가 없는 신규 종료 화면이다. 완료 후 부드러운 사과와 감사 문구를 제공한다.

### 권장 문구

```text
불편을 끼쳐드려 죄송합니다.

카드키 재발급이 완료되었어요.
추가적인 문제가 발생한 경우 프론트로 와주세요.

이용해주셔서 감사합니다.
```

### 구성

| 요소 | 디자인 |
|---|---|
| 아이콘 | 체크 또는 하트형 감사 아이콘, 96 px |
| 메인 문구 | 52 px, strong color |
| 보조 문구 | 32~34 px, default text |
| CTA | 처음 화면으로 |
| 자동 이동 | 15초 후 처음 화면으로 이동합니다 |

---

## 8. Interaction Rules

| 상황 | 인터랙션 |
|---|---|
| CTA 비활성화 | 배경을 연한 primary-100으로 표시, 클릭 불가 |
| CTA 활성화 | primary-300, 텍스트 흰색 |
| 버튼 터치 | 100ms scale down 또는 opacity 85% |
| 화면 전환 | 200~300ms fade |
| 모달 등장 | dim fade + modal scale 98% to 100% |
| 오류 발생 | 입력 필드 하단 오류 문구 + error icon |
| 자동 이동 | 하단에 남은 시간 문구 표시 |

---

## 9. Copy Guidelines

### 원칙

- 사용자가 지금 해야 할 행동을 먼저 말한다.
- 한 문장은 25자 내외를 권장한다.
- 전문 용어보다 행동 중심 표현을 사용한다.
- 사과/감사 문구는 마지막에 짧게 제공한다.

### 권장 표현

| 상황 | 문구 |
|---|---|
| 문제 선택 | 어떤 문제가 발생했나요? |
| 예약자명 입력 | 예약자명을 입력해주세요. |
| 예약 확인 | 예약이 확인되었어요. |
| 재발급 시작 | 재발급 진행 |
| 키 삽입 | 카드키 재발급을 위해 객실 키를 넣어주세요. |
| 수량 선택 | 객실 키 수량을 선택해주세요. |
| 진행 중 | 객실키 재발급을 진행하고 있어요. 잠시만 기다려주세요. |
| 예상 시간 | 2분 정도 소요될 예정이에요. |
| 수령 | 객실 키를 받아주세요. |
| 완료 | 객실 키 발급이 완료되었어요. 객실 키를 받아주세요. |
| 종료 | 불편을 끼쳐드려 죄송합니다. 이용해주셔서 감사합니다. |

---

## 10. Asset Guidelines

| Asset | 설명 |
|---|---|
| Room Image | 예약 확인 화면에 사용하는 객실 썸네일. 260 × 180 px 이상 |
| Key Insert Illustration | 객실 키 삽입 안내 이미지 |
| Kiosk Processing Illustration | 재발급 진행 중 키오스크 일러스트 |
| Key Outlet Illustration | 카드키 수령 모달 이미지 |
| Check Icon | 완료/성공 상태 아이콘 |
| Problem Icon | 문제발생 버튼 및 문제 유형 선택에 사용 |

---

## 11. Implementation Notes

- CSS/디자인 토큰은 실제 개발 시 px 단위로 고정 적용한다.
- 모든 화면은 1080 × 1920 기준에서 우선 구현한다.
- 반응형보다 키오스크 고정 레이아웃 최적화를 우선한다.
- 원본 이미지의 대비가 낮은 텍스트는 접근성 기준에 맞게 진하게 조정한다.
- 키보드와 스테퍼는 실제 사용자가 손가락으로 조작하므로 모바일보다 큰 터치 타겟을 사용한다.
- 모달은 외부 클릭으로 닫히지 않도록 하고, 명시적인 취소 버튼 또는 자동 이동 정책을 둔다.
