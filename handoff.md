# handoff.md — 카드키 재발급 키오스크 프로토타입 개발 전달 문서

## 1. 전달 목적

본 문서는 세로형 키오스크 1080 × 1920 해상도 기준으로 **문제발생 > 카드키 재발급** 프로토타입을 구현하기 위한 개발/디자인 핸드오프 문서이다.

개발자는 `prd.md`의 화면별 기능 요구사항과 `design.md`의 디자인 시스템을 기준으로 화면을 구현한다.

---

## 2. 산출물 구성

| 파일 | 설명 |
|---|---|
| `prd.md` | 제품 요구사항, 화면별 기능 정의, 상태값, 예외 처리, MVP 범위 |
| `design.md` | 디자인 시스템, 컬러/타이포/컴포넌트/접근성 기준 |
| `handoff.md` | 개발 전달용 화면 목록, 라우팅, 구현 체크리스트 |

---

## 3. 기준 환경

| 항목 | 값 |
|---|---|
| 해상도 | 1080 × 1920 px |
| 방향 | Portrait |
| 입력 방식 | 터치 기반 |
| 주요 조작 | 버튼 클릭, 텍스트 입력, 수량 선택, 카드 삽입/수령 이벤트 |
| 디자인 기준 | 업로드 이미지 기반 UI 재현 + 접근성 보정 |

---

## 4. 화면 라우팅

```text
MAIN_HOME
  └─ 문제발생 클릭
      └─ PROBLEM_SELECT
          ├─ 카드키 재발급 클릭
          │   └─ Problemsolve_Cardkey_reiussue_depth01
          │       └─ 예약자명 입력 후 확인완료
          │           └─ Problemsolve_Cardkey_reiussue_depth02
          │               └─ 재발급 진행
          │                   └─ Problemsolve_Cardkey_reiussue_depth03 modal
          │                       └─ 객실 키 삽입 감지
          │                           └─ Problemsolve_Cardkey_reiussue_depth04 modal
          │                               └─ 수량 선택 후 확인
          │                                   └─ Problemsolve_Cardkey_reiussue_depth05
          │                                       └─ 재발급 성공
          │                                           └─ Problemsolve_Cardkey_reiussue_depth06 modal
          │                                               └─ 객실 키 수령 완료
          │                                                   └─ Problemsolve_Cardkey_reiussue_depth07
          │                                                       └─ 처음 화면으로 / 자동 이동
          │                                                           └─ Problemsolve_Cardkey_reiussue_depth08
          │                                                               └─ MAIN_HOME
          ├─ 상태확인 클릭
          │   └─ 준비 중 안내 모달
          └─ 도움요청 클릭
              └─ 프론트 문의 안내 모달
```

---

## 5. 화면별 구현 체크리스트

## 5.1 `MAIN_HOME`

- [ ] 기존 홈 화면 구조 유지
- [ ] `문제발생` 버튼 추가
- [ ] 버튼 클릭 시 `PROBLEM_SELECT`로 이동
- [ ] 홈/언어/전화문의 영역 유지
- [ ] 버튼 터치 영역 240 × 88 px 이상 확보

---

## 5.2 `PROBLEM_SELECT`

- [ ] 제목: `어떤 문제가 발생했나요?`
- [ ] 보조 문구: `해결이 필요한 항목을 선택해주세요.`
- [ ] 선택 카드 3개 노출
  - [ ] 카드키 재발급
  - [ ] 상태확인
  - [ ] 도움요청
- [ ] 카드키 재발급 클릭 시 depth01 이동
- [ ] 상태확인/도움요청은 준비 중 또는 프론트 문의 안내 처리

---

## 5.3 `Problemsolve_Cardkey_reiussue_depth01`

- [ ] 이미지와 동일한 예약자명 입력 화면 구성
- [ ] 탭: 예약자명 / QR코드 / 예약번호
- [ ] 예약자명 탭 활성화
- [ ] 입력 필드 placeholder: `예약자명`
- [ ] 키보드 UI 표시
- [ ] 입력값 없을 때 CTA 비활성화
- [ ] 입력값 있을 때 `확인완료` 버튼 활성화
- [ ] 클릭 시 예약 조회 mock 또는 API 호출
- [ ] 성공 시 depth02 이동
- [ ] 실패 시 오류 문구 표시

---

## 5.4 `Problemsolve_Cardkey_reiussue_depth02`

- [ ] 이미지와 동일한 예약 확인 화면 구성
- [ ] 제목: `예약이 확인되었어요.`
- [ ] 객실 이미지/객실명/예약자명/예약번호/체크인/체크아웃 정보 표시
- [ ] 기존 `체크인 진행` 버튼을 `재발급 진행`으로 변경
- [ ] 버튼 클릭 시 depth03 모달 표시
- [ ] 예약자명은 가능하면 마스킹 처리

---

## 5.5 `Problemsolve_Cardkey_reiussue_depth03`

- [ ] 배경 dim 처리
- [ ] 중앙 모달 표시
- [ ] 문구: `카드키 재발급을 위해 객실 키를 넣어주세요.`
- [ ] 객실 키 삽입 이미지 표시
- [ ] 취소 버튼 표시
- [ ] 카드 삽입 감지 이벤트 mock 처리
- [ ] 성공 시 depth04 이동
- [ ] 취소 시 depth02 또는 PROBLEM_SELECT로 복귀

---

## 5.6 `Problemsolve_Cardkey_reiussue_depth04`

- [ ] 배경 문구를 `객실키 재발급을 진행하고 있어요.`로 변경
- [ ] 중앙 모달 제목: `객실 키 수량을 선택해주세요.`
- [ ] 수량 스테퍼 구현
- [ ] 기본값 1
- [ ] 최소값 1
- [ ] 최대값 2 또는 정책값
- [ ] 확인 버튼 클릭 시 선택 수량 저장
- [ ] depth05로 이동

---

## 5.7 `Problemsolve_Cardkey_reiussue_depth05`

- [ ] 제목: `객실키 재발급을 진행하고 있어요. 잠시만 기다려주세요.`
- [ ] 기존 체크인 문구를 모두 재발급 문구로 변경
- [ ] `16% 진행 중` 대신 `2분 정도 소요될 예정이에요.` 표시
- [ ] 진행 중에는 사용자 입력 제한
- [ ] 재발급 완료 mock 후 depth06 표시
- [ ] 실패 mock 케이스 준비 권장

---

## 5.8 `Problemsolve_Cardkey_reiussue_depth06`

- [ ] 이미지와 동일한 객실 키 수령 모달 구성
- [ ] 문구: `객실 키를 받아주세요.`
- [ ] 객실 번호 표시
- [ ] 카드키 수량 카운트 표시: 예 `객실 키 (0/2)`
- [ ] 카드 수령 이벤트 mock 처리
- [ ] 모든 수량 수령 시 depth07 이동

---

## 5.9 `Problemsolve_Cardkey_reiussue_depth07`

- [ ] 기존 완료 화면 기반 구성
- [ ] 문구 변경: `객실 키 발급이 완료되었어요. 객실 키를 받아주세요.`
- [ ] 객실 번호/객실명/기간 정보 표시
- [ ] `처음 화면으로` 버튼 표시
- [ ] 클릭 시 depth08 또는 MAIN_HOME 이동
- [ ] 자동 이동 타이머 표시

---

## 5.10 `Problemsolve_Cardkey_reiussue_depth08`

- [ ] 신규 감사/종료 화면 구현
- [ ] 메인 문구: `불편을 끼쳐드려 죄송합니다.`
- [ ] 보조 문구: `카드키 재발급이 완료되었어요. 추가적인 문제가 발생한 경우 프론트로 와주세요.`
- [ ] 감사 문구: `이용해주셔서 감사합니다.`
- [ ] CTA: `처음 화면으로`
- [ ] 15~20초 후 자동으로 MAIN_HOME 이동

---

## 6. Mock Data

```json
{
  "reservationName": "김*",
  "reservationId": "24028019",
  "roomNumber": "0916",
  "roomType": "슈페리어 더블",
  "checkInAt": "2024-04-19T12:17:00+09:00",
  "checkOutAt": "2024-04-20T12:00:00+09:00",
  "stayNights": 1,
  "keyIssueCount": 2,
  "keyReceivedCount": 0,
  "reissueStatus": "REISSUE_PROCESSING"
}
```

---

## 7. 이벤트 정의

| Event Name | Trigger | Payload |
|---|---|---|
| `problem_click` | Main Home에서 문제발생 클릭 | `{ source: "MAIN_HOME" }` |
| `problem_type_select` | 문제 유형 선택 | `{ type: "cardkey_reissue" }` |
| `reservation_search_submit` | 예약자명 확인완료 클릭 | `{ method: "name" }` |
| `reservation_search_success` | 예약 조회 성공 | `{ reservationId }` |
| `cardkey_reissue_start` | 재발급 진행 클릭 | `{ roomNumber }` |
| `old_key_inserted` | 기존 키 삽입 감지 | `{ roomNumber }` |
| `key_count_confirm` | 수량 확인 | `{ count }` |
| `cardkey_reissue_success` | 재발급 성공 | `{ count }` |
| `new_key_received` | 새 키 수령 감지 | `{ receivedCount, totalCount }` |
| `cardkey_reissue_complete` | 플로우 완료 | `{ reservationId, roomNumber }` |
| `cardkey_reissue_error` | 오류 발생 | `{ errorCode, step }` |

---

## 8. 상태 관리 제안

```ts
type ReissueStatus =
  | 'IDLE'
  | 'RESERVATION_SEARCHING'
  | 'RESERVATION_FOUND'
  | 'INSERT_KEY_WAITING'
  | 'KEY_COUNT_SELECTING'
  | 'REISSUE_PROCESSING'
  | 'KEY_RECEIVE_WAITING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELED';
```

---

## 9. 접근성 구현 체크리스트

- [ ] 주요 CTA 높이 112 px 이상
- [ ] 일반 버튼 높이 88 px 이상
- [ ] 아이콘 버튼 88 × 88 px 이상
- [ ] 본문 텍스트 30 px 이상
- [ ] 주요 제목 52 px 이상
- [ ] 오류 문구는 색상 + 아이콘 + 텍스트 병기
- [ ] 흐린 회색 텍스트는 실제 구현에서 대비 보정
- [ ] 모달 외부 클릭으로 닫히지 않음
- [ ] 자동 이동 문구 표시
- [ ] 모든 단계에서 홈/뒤로가기 또는 취소 경로 제공

---

## 10. 개발 확인 필요사항

| 항목 | 확인 필요 내용 |
|---|---|
| 장비 연동 | 카드키 삽입/발급/수령 감지 이벤트 API 존재 여부 |
| 정책 | 기존 키가 없는 분실 상황에서도 재발급 가능한지 여부 |
| 최대 수량 | 객실키 최대 재발급 수량 |
| 인증 | 예약자명만으로 재발급 가능한지, 예약번호/QR 확인이 필요한지 |
| 로그 | 카드키 재발급 기록 저장 방식 |
| 오류 대응 | 장비 오류 시 프론트 호출/문의 연결 방식 |
| 개인정보 | 예약자명/예약번호 마스킹 수준 |

---

## 11. Prototype Acceptance Criteria

프로토타입은 아래 조건을 만족하면 1차 완료로 본다.

- [ ] 1080 × 1920 세로형 화면에서 모든 UI가 잘리지 않는다.
- [ ] Main Home에서 문제발생 플로우로 진입할 수 있다.
- [ ] 문제 유형 선택 화면에서 카드키 재발급을 선택할 수 있다.
- [ ] 예약자명 입력 후 예약 확인 화면으로 이동한다.
- [ ] 예약 확인 화면의 CTA가 `재발급 진행`으로 표시된다.
- [ ] 객실 키 삽입 모달 문구가 재발급 맥락으로 변경되어 있다.
- [ ] 객실 키 수량 선택 모달이 동작한다.
- [ ] 진행 중 화면에 `2분 정도 소요될 예정이에요.` 문구가 표시된다.
- [ ] 객실 키 수령 모달이 표시된다.
- [ ] 완료 화면 문구가 `객실 키 발급이 완료되었어요. 객실 키를 받아주세요.`로 표시된다.
- [ ] 마지막 감사 화면이 표시된다.
- [ ] 처음 화면으로 돌아갈 수 있다.
