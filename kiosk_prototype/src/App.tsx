import { useEffect, useMemo, useState } from 'react';
import roomReference from '../assets/hotel-room.jpg';

type Screen =
  | 'home'
  | 'problem'
  | 'name'
  | 'reservation'
  | 'insertKey'
  | 'keyError'
  | 'count'
  | 'processing'
  | 'receive'
  | 'complete'
  | 'thanks';

const reservation = {
  guestName: '김*',
  reservationId: '24028019',
  roomNumber: '0916',
  roomType: '슈페리어 더블',
  checkInDate: '2024-04-19',
  checkInTime: '12:17',
  checkOutDate: '2024-04-20',
  checkOutTime: '12:00',
  nights: 1
};

const keyboardRows = [
  ['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ'],
  ['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ'],
  ['ABC', 'ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ', '⌫'],
  ['·', '-', '간격', '+']
];

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [name, setName] = useState('');
  const [count, setCount] = useState(1);
  const [received, setReceived] = useState(0);
  const [progress, setProgress] = useState(16);
  const [toast, setToast] = useState('');

  const nowText = useMemo(() => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(new Date());
  }, [screen]);

  useEffect(() => {
    if (screen !== 'processing') return;
    setProgress(16);
    const timer = window.setInterval(() => {
      setProgress((value) => {
        const next = Math.min(value + 14, 100);
        if (next === 100) {
          window.setTimeout(() => setScreen('receive'), 500);
        }
        return next;
      });
    }, 650);
    return () => window.clearInterval(timer);
  }, [screen]);

  useEffect(() => {
    if (screen !== 'thanks') return;
    const timer = window.setTimeout(() => setScreen('home'), 15000);
    return () => window.clearTimeout(timer);
  }, [screen]);

  const goHome = () => {
    setScreen('home');
    setName('');
    setCount(1);
    setReceived(0);
    setProgress(16);
    setToast('');
  };

  const goBack = () => {
    const previous: Record<Screen, Screen> = {
      home: 'home',
      problem: 'home',
      name: 'problem',
      reservation: 'name',
      insertKey: 'reservation',
      keyError: 'insertKey',
      count: 'reservation',
      processing: 'count',
      receive: 'complete',
      complete: 'receive',
      thanks: 'complete'
    };
    setScreen(previous[screen]);
  };

  const appendKey = (key: string) => {
    if (key === '⌫') return setName((value) => value.slice(0, -1));
    if (key === '간격') return setName((value) => `${value} `);
    if (key === 'ABC') return setName((value) => `${value}A`);
    if (key === '·') return;
    setName((value) => `${value}${key}`);
  };

  const showComingSoon = (label: string) => {
    setToast(`${label} 기능은 준비 중입니다. 프론트로 문의해주세요.`);
    window.setTimeout(() => setToast(''), 2600);
  };

  return (
    <main className="viewport">
      <section className="kiosk-shell">
        <TopBar nowText={nowText} />
        {screen === 'home' && <Home onProblem={() => setScreen('problem')} />}
        {screen === 'problem' && (
          <ProblemSelect
            onSelectCardKey={() => setScreen('name')}
            onComingSoon={showComingSoon}
          />
        )}
        {screen === 'name' && (
          <NameInput
            name={name}
            setName={setName}
            appendKey={appendKey}
            onSubmit={() => setScreen('reservation')}
          />
        )}
        {screen === 'reservation' && <ReservationConfirm onStart={() => setScreen('insertKey')} />}
        {screen === 'insertKey' && (
          <>
            <ReservationConfirm onStart={() => setScreen('insertKey')} muted />
            <Modal title="카드키 재발급을 위해 객실 키를 넣어주세요.">
              <KeySlotGraphic label="기존 키 · ROOM KEY" />
              <button className="secondary wide" onClick={() => setScreen('reservation')}>
                취소
              </button>
              <button className="primary wide" onClick={() => setScreen('keyError')}>
                삽입 감지
              </button>
              <p className="countdown">10초 후 처음 화면으로 이동합니다</p>
            </Modal>
          </>
        )}
        {screen === 'keyError' && <KeyError onContinue={() => setScreen('count')} />}
        {screen === 'count' && (
          <>
            <BusyBackdrop title="객실키 재발급을 진행하고 있어요." />
            <Modal title="객실 키 수량을 선택해주세요." compact>
              <p className="modal-copy">필요한 객실 키 수량을 선택해주세요.</p>
              <div className="stepper" aria-label="객실 키 수량">
                <button onClick={() => setCount((value) => Math.max(1, value - 1))}>−</button>
                <strong>{count}</strong>
                <button onClick={() => setCount((value) => Math.min(2, value + 1))}>＋</button>
              </div>
              <button
                className="primary wide"
                onClick={() => {
                  setReceived(0);
                  setScreen('processing');
                }}
              >
                확인
              </button>
              <p className="countdown">오늘 중 다른 화면으로 이동합니다</p>
            </Modal>
          </>
        )}
        {screen === 'processing' && <Processing progress={progress} />}
        {screen === 'receive' && (
          <>
            <CompleteBackdrop />
            <Modal title="객실 키를 받아주세요.">
              <KeySlotGraphic label="객실 키 · ROOM KEY" />
              <div className="receive-row">
                <strong>{reservation.roomNumber}호</strong>
                <span>
                  객실 키 ({received}/{count})
                </span>
              </div>
              <p className="modal-emphasis">객실 키를 받으면 다음 객실 키가 발급돼요.</p>
              <button
                className="primary wide"
                onClick={() => {
                  const next = Math.min(received + 1, count);
                  setReceived(next);
                  if (next === count) window.setTimeout(() => setScreen('complete'), 250);
                }}
              >
                수령 완료
              </button>
              <p className="countdown">30초 후 다음 화면으로 이동합니다</p>
            </Modal>
          </>
        )}
        {screen === 'complete' && <Complete onHome={() => setScreen('thanks')} />}
        {screen === 'thanks' && <Thanks onHome={goHome} />}
        <BottomNav onHome={goHome} onBack={goBack} showBack={screen !== 'home'} />
        {toast && <div className="toast">{toast}</div>}
      </section>
    </main>
  );
}

function TopBar({ nowText }: { nowText: string }) {
  return (
    <header className="topbar">
      <span>산하 호텔</span>
      <time>{nowText}</time>
    </header>
  );
}

function Home({ onProblem }: { onProblem: () => void }) {
  const cards = [
    ['예약 확인', '입실 10분 전부터 체크인이 가능해요.', './assets/icon-reservation.svg'],
    ['대실', '', './assets/icon-dayuse.svg'],
    ['숙박', '', './assets/icon-stay.svg'],
    ['체크아웃', '', './assets/icon-checkout.svg'],
    ['객실명 확인', '', './assets/icon-room-name.svg']
  ];

  return (
    <div className="screen home-screen">
      <p className="notice">원활한 이용을 위해 먼저 신분증을 준비해주세요.</p>
      <p className="brand">Sanha Hotel for Yanolja3</p>
      <h1>셀프 체크인</h1>
      <div className="home-grid">
        {cards.map(([title, copy, icon], index) => (
          <button className={index === 0 ? 'feature-card large' : 'feature-card'} key={title}>
            <span>
              <strong>{title}</strong>
              {copy && <small>{copy}</small>}
              {index < 3 && <em>현장 고객</em>}
            </span>
            <i><img src={icon} alt="" /></i>
          </button>
        ))}
      </div>
      <button className="problem-button" onClick={onProblem}>
        <span>!</span>
        문제발생
      </button>
      <LanguageRow />
    </div>
  );
}

function ProblemSelect({
  onSelectCardKey,
  onComingSoon
}: {
  onSelectCardKey: () => void;
  onComingSoon: (label: string) => void;
}) {
  return (
    <div className="screen problem-screen">
      <h2>어떤 문제가 발생했나요?</h2>
      <p className="subhead">해결이 필요한 항목을 선택해주세요.</p>
      <div className="problem-list">
        <button className="problem-card active" onClick={onSelectCardKey}>
          <i><img src="./assets/icon-cardkey.svg" alt="" /></i>
          <span>
            <strong>카드키 재발급</strong>
            <small>카드키 오류, 분실, 인식 실패를 해결해요.</small>
          </span>
        </button>
        <button className="problem-card" onClick={() => onComingSoon('상태확인')}>
          <i><img src="./assets/icon-status.svg" alt="" /></i>
          <span>
            <strong>상태확인</strong>
            <small>예약, 결제, 체크인 진행 상태를 확인해요.</small>
          </span>
        </button>
        <button className="problem-card" onClick={() => onComingSoon('도움요청')}>
          <i><img src="./assets/icon-help.svg" alt="" /></i>
          <span>
            <strong>도움요청</strong>
            <small>프론트 직원의 도움이 필요할 때 선택해요.</small>
          </span>
        </button>
      </div>
    </div>
  );
}

function NameInput({
  name,
  setName,
  appendKey,
  onSubmit
}: {
  name: string;
  setName: (value: string) => void;
  appendKey: (key: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="screen name-screen">
      <h2>
        <span>예약자명</span>을
        <br />
        입력해주세요.
      </h2>
      <div className="tabs">
        <button className="selected">예약자명</button>
        <button>QR코드</button>
        <button>예약번호</button>
      </div>
      <label className="input-wrap">
        <input
          value={name}
          onChange={(event) => setName(event.target.value.replace(/[^\u3131-\uD79Da-zA-Z\s]/g, ''))}
          placeholder="예약자명"
          autoFocus
        />
        <span>×</span>
      </label>
      <div className="keyboard">
        {keyboardRows.map((row) => (
          <div className="key-row" key={row.join('')}>
            {row.map((key) => (
              <button className={key === '간격' ? 'space-key' : ''} onClick={() => appendKey(key)} key={key}>
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>
      <p className="hint">예약정보의 예약자명과 확인 후에 입력해주세요</p>
      <button className="primary submit" disabled={!name.trim()} onClick={onSubmit}>
        확인완료
      </button>
    </div>
  );
}

function ReservationConfirm({ onStart, muted = false }: { onStart: () => void; muted?: boolean }) {
  return (
    <div className={`screen reservation-screen ${muted ? 'muted' : ''}`}>
      <div className="check-circle">✓</div>
      <h2>예약이 확인되었어요.</h2>
      <p className="reservation-desc">카드키 재발급이 가능해요.</p>
      <article className="reservation-group">
        <div className="reservation-card">
          <img src={roomReference} alt="" />
          <div>
            <h3>{reservation.roomType}</h3>
            <small>기준 2인</small>
          </div>
        </div>
        <div className="reservation-meta">
          <Info label="예약자명" value={reservation.guestName} />
          <Info label="예약번호" value={reservation.reservationId} />
        </div>
        <div className="stay-row">
          <div>
            <small>{reservation.checkInDate}(금)</small>
            <strong>{reservation.checkInTime}</strong>
          </div>
          <em>{reservation.nights}박</em>
          <div>
            <small>{reservation.checkOutDate}(토)</small>
            <strong>{reservation.checkOutTime}</strong>
          </div>
        </div>
      </article>
      <button className="primary cta" onClick={onStart}>
        재발급 진행
      </button>
    </div>
  );
}

function KeyError({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="screen key-error-screen">
      <div className="alert-circle">!</div>
      <h2>
        카드 키가 정상 등록되지 않아서
        <br />
        오류가 발생했어요.
      </h2>
      <p>재발급을 도와드릴게요.</p>
      <button className="primary cta" onClick={onContinue}>
        재발급 도와받기
      </button>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}

function BusyBackdrop({ title }: { title: string }) {
  return (
    <div className="screen busy-screen">
      <h2>{title}</h2>
      <p>잠시만 기다려주세요.</p>
    </div>
  );
}

function Processing({ progress }: { progress: number }) {
  return (
    <div className="screen processing-screen">
      <h2>
        <span>객실키 재발급</span>을 진행하고 있어요.
        <br />
        잠시만 기다려주세요.
      </h2>
      <div className="machine">
        <div className="machine-face">
          <span />
          <span />
        </div>
        <div className="machine-slot" />
      </div>
      <p>{progress < 100 ? '2분 정도 소요될 예정이에요.' : '발급이 완료되었어요.'}</p>
      <div className="progress-track">
        <span style={{ width: `${progress}%` }} />
      </div>
      <strong className="progress-label">{progress}% 진행 중</strong>
    </div>
  );
}

function CompleteBackdrop() {
  return (
    <div className="screen complete-backdrop">
      <div className="check-circle">✓</div>
      <h2>객실 키와 영수증을 받아주세요.</h2>
    </div>
  );
}

function Complete({ onHome }: { onHome: () => void }) {
  return (
    <div className="screen done-screen">
      <div className="check-circle">✓</div>
      <h2>
        객실 키 발급이 완료되었어요.
        <br />
        객실 키를 받아주세요.
      </h2>
      <strong className="room-number">{reservation.roomNumber}호</strong>
      <p>{reservation.roomType}</p>
      <div className="stay-row compact">
        <div>
          <small>{reservation.checkInDate}(금)</small>
          <strong>{reservation.checkInTime}</strong>
        </div>
        <em>{reservation.nights}박</em>
        <div>
          <small>{reservation.checkOutDate}(토)</small>
          <strong>{reservation.checkOutTime}</strong>
        </div>
      </div>
      <button className="secondary home-return" onClick={onHome}>
        확인
      </button>
      <small className="auto">22초 후 처음 화면으로 이동합니다</small>
    </div>
  );
}

function Thanks({ onHome }: { onHome: () => void }) {
  return (
    <div className="screen thanks-screen">
      <div className="check-circle">✓</div>
      <h2>불편을 끼쳐드려 죄송합니다.</h2>
      <p>카드키 재발급이 완료되었어요. 추가적인 문제가 발생한 경우 프론트로 와주세요.</p>
      <strong>이용해주셔서 감사합니다.</strong>
      <button className="primary cta" onClick={onHome}>
        처음 화면으로
      </button>
      <small className="auto">15초 후 처음 화면으로 이동합니다</small>
    </div>
  );
}

function Modal({
  title,
  children,
  compact = false
}: {
  title: string;
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div className="modal-layer">
      <section className={`modal ${compact ? 'compact' : ''}`}>
        <h3>{title}</h3>
        {children}
      </section>
    </div>
  );
}

function KeySlotGraphic({ label }: { label: string }) {
  return (
    <div className="key-graphic">
      <strong>{label}</strong>
      <span />
      <em>▼ KIOSK</em>
    </div>
  );
}

function LanguageRow() {
  return (
    <div className="languages">
      <button>English</button>
      <button>中文</button>
      <button>日本語</button>
    </div>
  );
}

function BottomNav({
  onHome,
  onBack,
  showBack
}: {
  onHome: () => void;
  onBack: () => void;
  showBack: boolean;
}) {
  return (
    <nav className="bottom-nav">
      <button onClick={onHome} aria-label="홈">
        ⌂
      </button>
      <span>전화문의 1544-4172</span>
      {showBack ? <button onClick={onBack}>↶ 뒤로가기</button> : <i />}
    </nav>
  );
}

export default App;
