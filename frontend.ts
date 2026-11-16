export default function mount(spindle: any) {
  const STORAGE_KEY = "y2k_flipphone_chats_v1";
  let state: Record<string, { from: "me" | "them"; text: string }[]> = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || '{"Stephanie 1.0":[{"from":"them","text":"omg check out our new flip phones!! 💖"}]}'
  );
  let activeContact = Object.keys(state)[0] || "Stephanie 1.0";
  let isOpen = false;
  let sending = false;

  const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

  const style = document.createElement("style");
  style.textContent = `
    #y2k-fp-root {
      position: fixed; bottom: 85px; right: 18px; z-index: 99999;
      font-family: "Verdana", sans-serif; user-select: none;
    }
    .y2k-fp-closed {
      width: 78px; height: 128px; cursor: pointer;
      background: linear-gradient(145deg, #ff80bf, #ff1a8c, #ffb3d9);
      border: 3px dotted #fff; border-radius: 22px;
      box-shadow: 0 0 0 3px #ff1a8c, 0 8px 20px rgba(255,20,147,0.5);
      display: flex; flex-direction: column; align-items: center; justify-content: space-between;
      padding: 8px 6px; color: #fff; text-align: center; position: relative;
      transition: transform 0.25s ease;
    }
    .y2k-fp-closed:hover { transform: scale(1.06); }
    .y2k-fp-ant {
      width: 11px; height: 20px; position: absolute; top: -22px; right: 14px;
      background: linear-gradient(90deg, #ff66b2, #fff, #ff66b2);
      border: 2px solid #ff1a8c; border-radius: 6px 6px 0 0;
    }
    .y2k-fp-mini-lcd {
      width: 100%; background: #ffe6f2; color: #800040; border: 2px solid #ff1a8c;
      border-radius: 10px; padding: 4px 2px; font-size: 9px; font-weight: bold;
    }
    .y2k-fp-open {
      width: 265px; perspective: 900px;
    }
    .y2k-fp-top {
      background: linear-gradient(145deg, #ff99cc, #ff4da6, #ffb3d9);
      border-top: 4px dotted #fff; border-left: 4px dotted #fff; border-right: 4px dotted #fff;
      border-radius: 26px 26px 0 0; padding: 10px 10px 6px 10px;
      box-shadow: 0 -3px 0 #ff1a8c, -3px 0 0 #ff1a8c, 3px 0 0 #ff1a8c;
      transform-origin: bottom center;
      animation: y2kFlipSwing 0.48s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      position: relative;
    }
    @keyframes y2kFlipSwing {
      0% { transform: rotateX(-110deg) scaleY(0.6); opacity: 0.2; }
      100% { transform: rotateX(0deg) scaleY(1); opacity: 1; }
    }
    .y2k-fp-screen {
      background: #fff0f7; border: 3px solid #ff1a8c; border-radius: 14px;
      padding: 7px; color: #4d0026; box-shadow: inset 0 2px 6px rgba(255,26,140,0.25);
    }
    .y2k-fp-bar {
      display: flex; justify-content: space-between; font-size: 9px; font-weight: bold;
      color: #cc0066; border-bottom: 1px dashed #ff80bf; padding-bottom: 3px; margin-bottom: 5px;
    }
    .y2k-fp-contacts {
      display: flex; gap: 4px; margin-bottom: 5px; align-items: center;
    }
    .y2k-fp-contacts select {
      flex: 1; background: #ffd6eb; border: 1px solid #ff66b2; border-radius: 8px;
      color: #800040; font-size: 11px; font-weight: bold; padding: 2px 4px;
    }
    .y2k-fp-add {
      background: #ff66b2; color: #fff; border: none; border-radius: 8px;
      padding: 2px 7px; font-weight: bold; cursor: pointer; font-size: 11px;
    }
    .y2k-fp-msgs {
      height: 155px; overflow-y: auto; display: flex; flex-direction: column; gap: 5px;
      padding: 3px; font-size: 11px; line-height: 1.35;
    }
    .y2k-msg-them {
      align-self: flex-start; background: #ffe0f0; border: 1px solid #ff99cc;
      border-radius: 10px 10px 10px 2px; padding: 5px 8px; max-width: 82%;
    }
    .y2k-msg-me {
      align-self: flex-end; background: #ff4da6; color: #fff;
      border-radius: 10px 10px 2px 10px; padding: 5px 8px; max-width: 82%;
    }
    .y2k-fp-hinge {
      height: 12px; background: linear-gradient(90deg, #ff1a8c, #fff, #ff1a8c);
      border-left: 3px solid #ff1a8c; border-right: 3px solid #ff1a8c;
      text-align: center; font-size: 8px; line-height: 11px; color: #800040; cursor: pointer;
    }
    .y2k-fp-base {
      background: linear-gradient(145deg, #ff99cc, #ff4da6, #ffb3d9);
      border-bottom: 4px dotted #fff; border-left: 4px dotted #fff; border-right: 4px dotted #fff;
      border-radius: 0 0 26px 26px; padding: 8px 10px 10px 10px;
      box-shadow: 0 3px 0 #ff1a8c, -3px 0 0 #ff1a8c, 3px 0 0 #ff1a8c, 0 10px 22px rgba(255,20,147,0.45);
    }
    .y2k-fp-input-row {
      display: flex; gap: 4px; margin-bottom: 6px;
    }
    .y2k-fp-input {
      flex: 1; background: #fff5fa; border: 2px solid #ff66b2; border-radius: 10px;
      padding: 4px 7px; font-size: 11px; color: #4d0026; outline: none;
    }
    .y2k-fp-controls {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;
    }
    .y2k-btn-send {
      background: #fff; color: #009933; border: 2px solid #ff66b2; border-radius: 10px;
      padding: 2px 10px; font-size: 10px; font-weight: bold; cursor: pointer;
    }
    .y2k-btn-end {
      background: #fff; color: #cc0033; border: 2px solid #ff66b2; border-radius: 10px;
      padding: 2px 10px; font-size: 10px; font-weight: bold; cursor: pointer;
    }
    .y2k-btn-ok {
      width: 28px; height: 28px; border-radius: 50%; border: 2px solid #ff1a8c;
      background: radial-gradient(#fff, #ff66b2); color: #660033; font-size: 9px; font-weight: bold;
    }
    .y2k-keypad {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; text-align: center;
      font-size: 9px; font-weight: bold; color: #660033;
    }
    .y2k-key {
      background: #fff5fa; border: 1px solid #ff80bf; border-radius: 8px; padding: 3px 0; cursor: pointer;
    }
    .y2k-key:active { background: #ff99cc; }
  `;
  document.head.appendChild(style);

  const root = document.createElement("div");
  root.id = "y2k-fp-root";
  document.body.appendChild(root);

  const render = () => {
    if (!isOpen) {
      root.innerHTML = `
        <div class="y2k-fp-closed" id="y2k-open-btn" title="Tap to flip open">
          <div class="y2k-fp-ant"></div>
          <div style="font-size:8px; letter-spacing:2px;">💎 ✦ 💎</div>
          <div class="y2k-fp-mini-lcd">
            <div>▂▄▆█ 🔋</div>
            <div style="margin:2px 0; color:#ff1a8c;">♥ FLIP ♥</div>
            <div style="font-size:8px;">TAP OPEN</div>
          </div>
          <div style="font-size:12px;">💖 ✨ 💖</div>
        </div>
      `;
      root.querySelector("#y2k-open-btn")?.addEventListener("click", () => {
        isOpen = true;
        render();
      });
      return;
    }

    const msgs = state[activeContact] || [];
    const options = Object.keys(state)
      .map((c) => `<option value="${c}" ${c === activeContact ? "selected" : ""}>♥ ${c} ♥</option>`)
      .join("");

    root.innerHTML = `
      <div class="y2k-fp-open">
        <div class="y2k-fp-top">
          <div class="y2k-fp-ant"></div>
          <div style="text-align:center; font-size:8px; letter-spacing:3px; color:#fff; margin-bottom:4px;">✦ ••••• ✦</div>
          <div class="y2k-fp-screen">
            <div class="y2k-fp-bar">
              <span>▂▄▆█ Y2K</span>
              <span>${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              <span>🔋100%</span>
            </div>
            <div class="y2k-fp-contacts">
              <select id="y2k-contact-sel">${options}</select>
              <button class="y2k-fp-add" id="y2k-add-contact" title="New Contact">+</button>
            </div>
            <div class="y2k-fp-msgs" id="y2k-msg-box">
              ${msgs.map((m) => `<div class="${m.from === "me" ? "y2k-msg-me" : "y2k-msg-them"}">${m.text}</div>`).join("")}
              ${sending ? `<div class="y2k-msg-them"><i>typing...</i></div>` : ""}
            </div>
          </div>
        </div>
        <div class="y2k-fp-hinge" id="y2k-close-hinge" title="Tap to flip closed">💎 💎 💎</div>
        <div class="y2k-fp-base">
          <div class="y2k-fp-input-row">
            <input class="y2k-fp-input" id="y2k-txt-input" placeholder="Type text..." />
          </div>
          <div class="y2k-fp-controls">
            <button class="y2k-btn-send" id="y2k-send-btn">SEND</button>
            <button class="y2k-btn-ok" id="y2k-ok-btn">OK</button>
            <button class="y2k-btn-end" id="y2k-end-btn">END</button>
          </div>
          <div class="y2k-keypad">
            <div class="y2k-key" data-k="1">1 <sub>oo</sub></div>
            <div class="y2k-key" data-k="2">2 <sub>abc</sub></div>
            <div class="y2k-key" data-k="3">3 <sub>def</sub></div>
            <div class="y2k-key" data-k="4">4 <sub>ghi</sub></div>
            <div class="y2k-key" data-k="5">5 <sub>jkl</sub></div>
            <div class="y2k-key" data-k="6">6 <sub>mno</sub></div>
            <div class="y2k-key" data-k="7">7 <sub>pqrs</sub></div>
            <div class="y2k-key" data-k="8">8 <sub>tuv</sub></div>
            <div class="y2k-key" data-k="9">9 <sub>wxyz</sub></div>
            <div class="y2k-key" data-k="✦">* <sub>✦</sub></div>
            <div class="y2k-key" data-k=" ">0 <sub>_</sub></div>
            <div class="y2k-key" data-k="💖"># <sub>♪</sub></div>
          </div>
        </div>
      </div>
    `;

    const msgBox = root.querySelector("#y2k-msg-box");
    if (msgBox) msgBox.scrollTop = msgBox.scrollHeight;

    const closePhone = () => {
      isOpen = false;
      render();
    };
    root.querySelector("#y2k-end-btn")?.addEventListener("click", closePhone);
    root.querySelector("#y2k-close-hinge")?.addEventListener("click", closePhone);

    root.querySelector("#y2k-contact-sel")?.addEventListener("change", (e: any) => {
      activeContact = e.target.value;
      render();
    });

    root.querySelector("#y2k-add-contact")?.addEventListener("click", () => {
      const name = prompt("Enter character contact name:");
      if (name && name.trim()) {
        activeContact = name.trim();
        if (!state[activeContact]) state[activeContact] = [];
        save();
        render();
      }
    });

    const inputEl = root.querySelector("#y2k-txt-input") as HTMLInputElement;
    root.querySelectorAll(".y2k-key").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (inputEl) {
          inputEl.value += btn.getAttribute("data-k") || "";
          inputEl.focus();
        }
      });
    });

    const sendText = async () => {
      const text = inputEl?.value.trim();
      if (!text || sending) return;
      state[activeContact] = state[activeContact] || [];
      state[activeContact].push({ from: "me", text });
      save();
      sending = true;
      render();

      try {
        const res = await spindle.rpc.call("sendFlipText", {
          contact: activeContact,
          history: state[activeContact],
          userMsg: text
        });
        state[activeContact].push({ from: "them", text: res?.reply || "omg ttyl!! 💖" });
      } catch {
        state[activeContact].push({ from: "them", text: "low signal rn!! 📶💖" });
      }
      sending = false;
      save();
      render();
    };

    root.querySelector("#y2k-send-btn")?.addEventListener("click", sendText);
    root.querySelector("#y2k-ok-btn")?.addEventListener("click", sendText);
    inputEl?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendText();
    });
  };

  render();
}
