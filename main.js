/**
 * LottoBall Web Component
 * Encapsulates the visual representation of a single lotto ball.
 */
class LottoBall extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const number = this.getAttribute('number') || '0';
    const color = this._getBallColor(parseInt(number));
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          animation: pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          opacity: 0;
          transform: scale(0.5);
        }

        .ball {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: ${color};
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.25rem;
          color: white;
          box-shadow: inset -4px -4px 8px rgba(0,0,0,0.3), 
                      inset 4px 4px 8px rgba(255,255,255,0.2),
                      0 10px 20px rgba(0,0,0,0.3);
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
          user-select: none;
        }

        @keyframes pop {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (max-width: 480px) {
          .ball {
            width: 40px;
            height: 40px;
            font-size: 1.1rem;
          }
        }
      </style>
      <div class="ball">${number}</div>
    `;
  }

  _getBallColor(num) {
    if (num <= 10) return 'linear-gradient(135deg, #facc15, #eab308)'; // Yellow
    if (num <= 20) return 'linear-gradient(135deg, #60a5fa, #2563eb)'; // Blue
    if (num <= 30) return 'linear-gradient(135deg, #f87171, #dc2626)'; // Red
    if (num <= 40) return 'linear-gradient(135deg, #94a3b8, #475569)'; // Grey
    return 'linear-gradient(135deg, #4ade80, #16a34a)'; // Green
  }
}

customElements.define('lotto-ball', LottoBall);

/**
 * Main App Logic
 */
class LottoApp {
  constructor() {
    this.generateBtn = document.getElementById('generate-btn');
    this.ballContainer = document.getElementById('ball-container');
    this.historyList = document.getElementById('history-list');
    
    this.isGenerating = false;
    this.init();
  }

  init() {
    this.generateBtn.addEventListener('click', () => this.generateNumbers());
  }

  async generateNumbers() {
    if (this.isGenerating) return;
    this.isGenerating = true;
    this.generateBtn.disabled = true;
    this.generateBtn.textContent = '추첨 중...';

    // Clear previous balls
    this.ballContainer.innerHTML = '';

    const numbers = this._getRandomNumbers();
    
    for (const num of numbers) {
      await this._sleep(400); // Delay for animation effect
      const ball = document.createElement('lotto-ball');
      ball.setAttribute('number', num);
      this.ballContainer.appendChild(ball);
    }

    this._addToHistory(numbers);
    
    this.isGenerating = false;
    this.generateBtn.disabled = false;
    this.generateBtn.textContent = '번호 생성하기';
  }

  _getRandomNumbers() {
    const pool = Array.from({ length: 45 }, (_, i) => i + 1);
    const result = [];
    
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      result.push(pool.splice(randomIndex, 1)[0]);
    }
    
    return result.sort((a, b) => a - b);
  }

  _addToHistory(numbers) {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    const li = document.createElement('li');
    li.className = 'history-item';
    
    const timeSpan = document.createElement('span');
    timeSpan.textContent = timeStr;
    timeSpan.style.color = 'var(--text-secondary)';
    timeSpan.style.fontSize = '0.8rem';

    const numbersDiv = document.createElement('div');
    numbersDiv.className = 'history-numbers';
    
    numbers.forEach(num => {
      const ball = document.createElement('span');
      ball.className = 'history-ball';
      ball.textContent = num;
      // Simple color indicator
      const color = this._getSimpleColor(num);
      ball.style.border = `2px solid ${color}`;
      numbersDiv.appendChild(ball);
    });

    li.appendChild(timeSpan);
    li.appendChild(numbersDiv);
    this.historyList.appendChild(li);

    // Keep only last 5
    if (this.historyList.children.length > 5) {
      this.historyList.removeChild(this.historyList.firstChild);
    }
  }

  _getSimpleColor(num) {
    if (num <= 10) return '#eab308';
    if (num <= 20) return '#2563eb';
    if (num <= 30) return '#dc2626';
    if (num <= 40) return '#475569';
    return '#16a34a';
  }

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Initialize the app
new LottoApp();
