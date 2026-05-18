const roomReference = './assets/hotel-room.jpg';

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

const state = {
  screen: 'home',
  name: '',
  count: 1,
  received: 0,
  progress: 16,
  toast: '',
  timer: 0
};

const root = document.getElementById('root');

function setScreen(screen) {
  window.clearInterval(state.timer);
  state.screen = screen;
  render();

  if (screen === 'processing') {
    state.progress = 16;
    state.timer = window.setInterval(() => {
      state.progress = Math.min(state.progress + 14, 100);
      render();
      if (state.progress === 100) {
        window.clearInterval(state.timer);
        window.setTimeout(() => setScreen('receive'), 500);
      }
    }, 650);
  }

  if (screen === 'thanks') {
    state.timer = window.setTimeout(() => goHome(), 15000);
  }
}

function goHome() {
  window.clearInterval(state.timer);
  Object.assign(state, {
    screen: 'home',
    name: '',
    count: 1,
    received: 0,
    progress: 16,
    toast: ''
  });
  render();
}

function goBack() {
  const previous = {
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
  setScreen(previous[state.screen] || 'home');
}

function showToast(label) {
  state.toast = `${label} 기능은 준비 중입니다. 프론트로 문의해주세요.`;
  render();
  window.setTimeout(() => {
    state.toast = '';
    render();
  }, 2600);
}

function nowText() {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date());
}

function layout(content) {
  return `
    <main class="viewport">
      <section class="kiosk-shell">
        <header class="topbar"><span>산하 호텔</span><time>${nowText()}</time></header>
        ${content}
        ${bottomNav()}
        ${state.toast ? `<div class="toast">${state.toast}</div>` : ''}
      </section>
    </main>
  `;
}

function bottomNav() {
  const showBack = state.screen !== 'home';
  return `
    <nav class="bottom-nav">
      <button data-action="home" aria-label="홈">⌂</button>
      <span>전화문의 1544-4172</span>
      ${showBack ? '<button data-action="back">↶ 뒤로가기</button>' : '<i></i>'}
    </nav>
  `;
}

function home() {
  const cards = [
    ['예약 확인', '입실 10분 전부터 체크인이 가능해요.', './assets/icon-reservation.svg'],
    ['대실', '', './assets/icon-dayuse.svg'],
    ['숙박', '', './assets/icon-stay.svg'],
    ['체크아웃', '', './assets/icon-checkout.svg'],
    ['객실명 확인', '', './assets/icon-room-name.svg']
  ];

  return `
    <div class="screen home-screen">
      <p class="notice">원활한 이용을 위해 먼저 신분증을 준비해주세요.</p>
      <p class="brand">Sanha Hotel for Yanolja3</p>
      <h1>셀프 체크인</h1>
      <div class="home-grid">
        ${cards
          .map(
            ([title, copy, icon], index) => `
              <button class="${index === 0 ? 'feature-card large' : 'feature-card'}">
                <span>
                  <strong>${title}</strong>
                  ${copy ? `<small>${copy}</small>` : ''}
                  ${index < 3 ? '<em>현장 고객</em>' : ''}
                </span>
                <i><img src="${icon}" alt="" /></i>
              </button>
            `
          )
          .join('')}
      </div>
      <button class="problem-button" data-action="problem"><span>!</span>문제발생</button>
      <div class="languages"><button>English</button><button>中文</button><button>日本語</button></div>
    </div>
  `;
}

function problem() {
  return `
    <div class="screen problem-screen">
      <h2>어떤 문제가 발생했나요?</h2>
      <p class="subhead">해결이 필요한 항목을 선택해주세요.</p>
      <div class="problem-list">
        <button class="problem-card active" data-action="name">
          <i><img src="./assets/icon-cardkey.svg" alt="" /></i><span><strong>카드키 재발급</strong><small>카드키 오류, 분실, 인식 실패를 해결해요.</small></span>
        </button>
        <button class="problem-card" data-toast="상태확인">
          <i><img src="./assets/icon-status.svg" alt="" /></i><span><strong>상태확인</strong><small>예약, 결제, 체크인 진행 상태를 확인해요.</small></span>
        </button>
        <button class="problem-card" data-toast="도움요청">
          <i><img src="./assets/icon-help.svg" alt="" /></i><span><strong>도움요청</strong><small>프론트 직원의 도움이 필요할 때 선택해요.</small></span>
        </button>
      </div>
    </div>
  `;
}

function nameInput() {
  return `
    <div class="screen name-screen">
      <h2><span>예약자명</span>을<br />입력해주세요.</h2>
      <div class="tabs"><button class="selected">예약자명</button><button>QR코드</button><button>예약번호</button></div>
      <label class="input-wrap">
        <input id="guestName" value="${escapeHtml(state.name)}" placeholder="예약자명" autofocus />
        <span>×</span>
      </label>
      <div class="keyboard">
        ${keyboardRows
          .map(
            (row) => `
            <div class="key-row">
              ${row
                .map(
                  (key) =>
                    `<button class="${key === '간격' ? 'space-key' : ''}" data-key="${key}">${key}</button>`
                )
                .join('')}
            </div>
          `
          )
          .join('')}
      </div>
      <p class="hint">예약정보의 예약자명과 확인 후에 입력해주세요</p>
      <button class="primary submit" data-action="reservation" ${state.name.trim() ? '' : 'disabled'}>확인완료</button>
    </div>
  `;
}

function reservationConfirm(muted = false) {
  return `
    <div class="screen reservation-screen ${muted ? 'muted' : ''}">
      <div class="check-circle">✓</div>
      <h2>예약이 확인되었어요.</h2>
      <p class="reservation-desc">카드키 재발급이 가능해요.</p>
      <article class="reservation-group">
        <div class="reservation-card">
        <img src="${roomReference}" alt="" />
        <div><h3>${reservation.roomType}</h3><small>기준 2인</small></div>
        </div>
        <div class="reservation-meta">
          ${info('예약자명', reservation.guestName)}
          ${info('예약번호', reservation.reservationId)}
        </div>
        ${stayRow()}
      </article>
      <button class="primary cta" data-action="insertKey">재발급 진행</button>
    </div>
  `;
}

function info(label, value) {
  return `<div><small>${label}</small><strong>${value}</strong></div>`;
}

function stayRow(extraClass = '') {
  return `
    <div class="stay-row ${extraClass}">
      <div><small>${reservation.checkInDate}(금)</small><strong>${reservation.checkInTime}</strong></div>
      <em>${reservation.nights}박</em>
      <div><small>${reservation.checkOutDate}(토)</small><strong>${reservation.checkOutTime}</strong></div>
    </div>
  `;
}

function modal(title, content, compact = false) {
  return `
    <div class="modal-layer">
      <section class="modal ${compact ? 'compact' : ''}">
        <h3>${title}</h3>
        ${content}
      </section>
    </div>
  `;
}

function keyGraphic(label) {
  return `<div class="key-graphic"><strong>${label}</strong><span></span><em>▼ KIOSK</em></div>`;
}

function insertKey() {
  return `
    ${reservationConfirm(true)}
    ${modal(
      '카드키 재발급을 위해<br />객실 키를 넣어주세요.',
      `
        ${keyGraphic('기존 키 · ROOM KEY')}
        <button class="secondary wide" data-action="reservation">취소</button>
        <button class="primary wide" data-action="keyError">삽입 감지</button>
        <p class="countdown">30초 후 다음 화면으로 이동합니다</p>
      `
    )}
  `;
}

function keyError() {
  return `
    <div class="screen key-error-screen">
      <div class="alert-circle">!</div>
      <h2>
        카드 키가 정상 등록되지 않아서
        <br />
        오류가 발생했어요.
      </h2>
      <p>재발급을 도와드릴게요.</p>
      <button class="primary cta" data-action="count">재발급 받기</button>
    </div>
  `;
}

function countSelect() {
  return `
    <div class="screen busy-screen"><h2>객실키 재발급을 진행하고 있어요.</h2><p>잠시만 기다려주세요.</p></div>
    ${modal(
      '객실 키 수량을 선택해주세요.',
      `
        <p class="modal-copy">필요한 객실 키 수량을 선택해주세요.</p>
        <div class="stepper" aria-label="객실 키 수량">
          <button data-action="decrement">−</button>
          <strong>${state.count}</strong>
          <button data-action="increment">＋</button>
        </div>
        <button class="primary wide" data-action="processing">확인</button>
        <p class="countdown">30초 후 다음 화면으로 이동합니다</p>
      `,
      true
    )}
  `;
}

function processing() {
  return `
    <div class="screen processing-screen">
      <h2><span>객실키 재발급</span>을 진행하고 있어요.<br />잠시만 기다려주세요.</h2>
      <div class="machine"><div class="machine-face"><span></span><span></span></div><div class="machine-slot"></div></div>
      <p>${state.progress < 100 ? '2분 정도 소요될 예정이에요.' : '발급이 완료되었어요.'}</p>
      <div class="progress-track"><span style="width:${state.progress}%"></span></div>
      <strong class="progress-label">${state.progress}% 진행 중</strong>
    </div>
  `;
}

function receive() {
  return `
    <div class="screen complete-backdrop"><div class="check-circle">✓</div><h2>객실 키와 영수증을 받아주세요.</h2></div>
    ${modal(
      '객실 키를 받아주세요.',
      `
        ${keyGraphic('객실 키 · ROOM KEY')}
        <div class="receive-row"><strong>${reservation.roomNumber}호</strong><span>객실 키 (${state.received}/${state.count})</span></div>
        <p class="modal-emphasis">객실 키를 받으면 다음 객실 키가 발급돼요.</p>
        <button class="primary wide" data-action="receiveOne">수령 완료</button>
        <p class="countdown">30초 후 다음 화면으로 이동합니다</p>
      `
    )}
  `;
}

function complete() {
  return `
    <div class="screen done-screen">
      <div class="check-circle">✓</div>
      <h2>객실 키 발급이 완료되었어요.<br />객실 키를 받아주세요.</h2>
      <strong class="room-number">${reservation.roomNumber}호</strong>
      <p>${reservation.roomType}</p>
      ${stayRow('compact')}
      <button class="secondary home-return" data-action="thanks">확인</button>
      <small class="auto">30초 후 다음 화면으로 이동합니다</small>
    </div>
  `;
}

function thanks() {
  return `
    <div class="screen thanks-screen">
      <div class="check-circle">✓</div>
      <h2>불편을 끼쳐드려 죄송합니다.</h2>
      <p>카드키 재발급이 완료되었어요. 
      추가적인 문제가 발생한 경우 
      프론트에 다시 와주세요.</p>
      <strong>이용해주셔서 감사합니다.</strong>
      <button class="primary cta" data-action="home">처음 화면으로</button>
      <small class="auto">15초 후 처음 화면으로 이동합니다</small>
    </div>
  `;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

function render() {
  const screens = {
    home,
    problem,
    name: nameInput,
    reservation: () => reservationConfirm(false),
    insertKey,
    keyError,
    count: countSelect,
    processing,
    receive,
    complete,
    thanks
  };
  root.innerHTML = layout(screens[state.screen]());
  bind();
}

function bind() {
  document.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.action;
      if (action === 'home') return goHome();
      if (action === 'back') return goBack();
      if (action === 'problem') return setScreen('problem');
      if (action === 'name') return setScreen('name');
      if (action === 'reservation') return setScreen('reservation');
      if (action === 'insertKey') return setScreen('insertKey');
      if (action === 'keyError') return setScreen('keyError');
      if (action === 'count') return setScreen('count');
      if (action === 'decrement') {
        state.count = Math.max(1, state.count - 1);
        return render();
      }
      if (action === 'increment') {
        state.count = Math.min(2, state.count + 1);
        return render();
      }
      if (action === 'processing') {
        state.received = 0;
        return setScreen('processing');
      }
      if (action === 'receiveOne') {
        state.received = Math.min(state.received + 1, state.count);
        if (state.received === state.count) return window.setTimeout(() => setScreen('complete'), 250);
        return render();
      }
      if (action === 'thanks') return setScreen('thanks');
    });
  });

  document.querySelectorAll('[data-toast]').forEach((button) => {
    button.addEventListener('click', () => showToast(button.dataset.toast));
  });

  document.querySelectorAll('[data-key]').forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.key;
      if (key === '⌫') state.name = state.name.slice(0, -1);
      else if (key === '간격') state.name += ' ';
      else if (key === 'ABC') state.name += 'A';
      else if (key !== '·') state.name += key;
      render();
    });
  });

  const input = document.getElementById('guestName');
  if (input) {
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
    input.addEventListener('input', (event) => {
      state.name = event.target.value.replace(/[^\u3131-\uD79Da-zA-Z\s]/g, '');
      render();
    });
  }
}

render();
