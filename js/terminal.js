document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('termOverlay');
  const termBody = document.getElementById('termBody');
  const input = document.getElementById('cmdInput');
  const openBtn = document.getElementById('openTermBtn');
  const fabBtn = document.getElementById('fabBtn');
  const closeBtn = document.getElementById('closeTermBtn');
  if (!overlay || !termBody || !input) return; // terminal markup not on this page

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const LINKS = {
    linkedin: 'https://www.linkedin.com/in/ishan-kavathekar-241333214/',
    github: 'https://github.com/ishank31',
    x: 'https://x.com/KavathekarIshan',
    scholar: 'https://scholar.google.com/citations?user=PnlwH5gAAAAJ&hl=en',
    cv: 'assets/images/Ishan_CV.pdf',
    emails: ['ishan.kavathekar@research.iiit.ac.in', 'ishankavathekar31@gmail.com']
  };

  const PAPERS = {
    tamas: {
      title: 'TAMAS: Benchmarking Adversarial Risks in Multi-Agent LLM Systems',
      authors: 'Ishan Kavathekar*, Hemang Jain*, Ameya Rathod, Ponnurangam Kumaraguru, Tanuja Ganu',
      venue: 'ACL 2026 Main · ICML-MAS Workshop 2025',
      paper: 'https://arxiv.org/abs/2511.05269',
      code: null,
      project: null
    },
    weaklinks: {
      title: 'Exposing Weak Links in Multi-Agent Systems under Adversarial Prompting',
      authors: 'Nirmit Arora, Sathvik Joel, Ishan Kavathekar, Palak, Rohan Gandhi, Yash Pandya, Tanuja Ganu, Aditya Kanade, Akshay Nambi',
      venue: 'AAMAS SE Workshop 2026',
      paper: 'https://arxiv.org/abs/2511.10949',
      code: 'https://github.com/microsoft/SafeAgents',
      project: null
    },
    smbt: {
      title: 'Small Models, Big Tasks: An Exploratory Empirical Study on Small Language Models for Function Calling',
      authors: 'Ishan Kavathekar*, Raghav Donakanti*, Ponnurangam Kumaraguru, Karthik Vaidhyanathan',
      venue: 'EASE 2025 — AI Models and Data Evaluation Track',
      paper: 'https://arxiv.org/abs/2504.19277',
      code: 'https://github.com/Raghav010/Small-Models-Big-Tasks',
      project: 'https://raghav010.github.io/smbt_web/'
    },
    ct2: {
      title: 'Counter Turing Test (CT²): Investigating AI-Generated Text Detection for Hindi',
      authors: 'Ishan Kavathekar, Anku Rani, Ashmit Chamoli, Ponnurangam Kumaraguru, Amit P. Sheth, Amitava Das',
      venue: 'EMNLP Findings 2024',
      paper: 'https://aclanthology.org/2024.findings-emnlp.282/',
      code: null,
      project: null
    },
    insaaf: {
      title: 'InSaAF: Incorporating Safety through Accuracy and Fairness — Are LLMs ready for the Indian Legal Domain?',
      authors: 'Yogesh Tripathi, Raghav Donakanti, Sahil Girhepuje, Ishan Kavathekar, Bhaskara Hanuma Vedula, Gokul S Krishnan, Shreya Goyal, Anmol Goel, Balaraman Ravindran, Ponnurangam Kumaraguru',
      venue: 'JURIX 2024',
      paper: 'https://arxiv.org/abs/2402.10567',
      code: null,
      project: 'https://cerai.iitm.ac.in/projects/insaaf/'
    }
  };

  const NEWS = [
    ['2026-07', 'INFO', 'joining Adobe Research, India as a Research Associate — safety &amp; capability evaluation of LLMs and agentic systems.'],
    ['2026-04', 'PASS', 'TAMAS accepted at ACL 2026 Main Conference 🎉'],
    ['2026-03', 'PASS', '"Exposing Weak Links in Multi-Agent Systems under Adversarial Prompting" accepted at AAMAS SE Workshop 2026 🎉'],
    ['2026-01', 'PASS', 'selected as 1 of 40 global participants, International AI Evaluation Program (≈6% acceptance) 🎉'],
    ['2025-06', 'PASS', '"TAMAS: A Dataset for Investigating Security Risks in Multi-Agent LLM Systems" accepted at ICML-MAS Workshop 2025 🎉'],
    ['2025-05', 'INFO', 'started research internship, Adobe Research Bengaluru — Multi-Modal Content Group.'],
    ['2025-03', 'PASS', '"Small Models, Big Tasks" accepted at EASE 2025 (AI Models and Data Evaluation track) 🎉'],
    ['2025-01', 'INFO', 'presented "Counter Turing Test" at SUMEval-2 Workshop @ COLING 2025.'],
    ['2025-01', 'INFO', 'started research internship, Microsoft Research Bengaluru, under Tanuja Ganu.'],
    ['2024-09', 'PASS', '"Counter Turing Test (CT²)" accepted at EMNLP 2024 Findings 🎉']
  ];

  const EXPERIENCE = [
    ['Incoming', 'Research Associate — Adobe Research, India'],
    ['May 2023 – Present', 'Undergraduate Researcher — Precog Lab, IIIT Hyderabad (under Dr. Ponnurangam Kumaraguru)'],
    ['May 2025 – Aug 2025', 'Research Intern — Adobe Research, Bengaluru (Multi-Modal Content Group)'],
    ['Jan 2025 – May 2025', 'Research Intern — Microsoft Research India, Bengaluru (under Tanuja Ganu, Aditya Kanade, Akshay Nambi)'],
    ['Jul 2023 – Aug 2024', 'Student Research Collaborator — AI Institute, University of South Carolina (remote, under Dr. Amitava Das)']
  ];

  const COMMANDS = ['about', 'experience', 'publications', 'news', 'links', 'contact', 'resume', 'help', 'clear'];

  function esc(s){ return s.replace(/&(?!amp;|lt;|gt;)/g, '&amp;'); }
  function scrollBottom(){ termBody.scrollTop = termBody.scrollHeight; }
  function append(html){
    const div = document.createElement('div');
    div.className = 't-block';
    div.innerHTML = html;
    termBody.appendChild(div);
    scrollBottom();
  }
  function appendRaw(node){ termBody.appendChild(node); scrollBottom(); }

  function chips(list){
    const wrap = document.createElement('div');
    wrap.className = 't-chips';
    list.forEach(c => {
      const b = document.createElement('span');
      b.className = 't-chip';
      b.textContent = c;
      b.onclick = () => { runCommand(c); input.focus(); };
      wrap.appendChild(b);
    });
    return wrap;
  }

  function echoCommand(cmd){
    append(`<span class="t-echoed"><span class="t-prompt">ishan@research:~$</span> <span class="t-cmdtext">${esc(cmd)}</span></span>`);
  }

  function pubLinksLine(p){
    const parts = [`<a href="${p.paper}" target="_blank" rel="noopener">paper</a>`];
    if (p.code) parts.push(`<a href="${p.code}" target="_blank" rel="noopener">code</a>`);
    if (p.project) parts.push(`<a href="${p.project}" target="_blank" rel="noopener">project page</a>`);
    return parts.join('  ·  ');
  }

  const OUTPUTS = {
    about: () => `
<div><span class="t-head">whoami</span> — <span class="t-pass">Incoming Research Associate, Adobe Research India</span></div>
<div class="t-dim" style="margin-top:6px;">Hi, I'm Ishan. I'll soon be joining Adobe Research, India as a Research Associate, working on
evaluating the safety and capabilities of large language models and agentic systems.</div>
<div class="t-dim" style="margin-top:6px;">I'm a dual-degree Computer Science student at
<a href="https://www.iiit.ac.in/" target="_blank" rel="noopener">IIIT Hyderabad</a>, and an undergraduate researcher at
<a href="https://precog.iiit.ac.in/" target="_blank" rel="noopener">Precog Lab</a> under
<a href="https://www.iiit.ac.in/faculty/ponnurangam-kumaraguru/" target="_blank" rel="noopener">Dr. Ponnurangam Kumaraguru</a>.</div>
<div class="t-dim" style="margin-top:6px;">My work centers on how LLM agents and multi-agent systems hold up under adversarial
pressure, and how to measure that reliably instead of assuming it.</div>
`,
    experience: () => {
      const rows = EXPERIENCE.map(([when, what]) =>
        `<tr><td class="t-cmdname" style="white-space:nowrap;">${esc(when)}</td><td>${what}</td></tr>`
      ).join('');
      return `<div class="t-head" style="margin-bottom:6px;">experience —</div><table class="t-help">${rows}</table>`;
    },
    publications: (args) => {
      if (args && args[0] && PAPERS[args[0].toLowerCase()]) {
        const p = PAPERS[args[0].toLowerCase()];
        return `
<div class="t-head">${p.title}</div>
<div class="t-dim" style="margin-top:4px;">${p.authors}</div>
<div class="t-amber" style="margin-top:2px;">${p.venue}</div>
<div style="margin-top:8px;">${pubLinksLine(p)}</div>
`;
      }
      const rows = Object.entries(PAPERS).map(([id, p]) =>
        `<div class="t-pub-item"><span class="t-id">[${id}]</span> ${p.title} <span class="t-dim">— ${p.venue}</span></div>`
      ).join('');
      return `<div class="t-head" style="margin-bottom:6px;">publications —</div>${rows}<div class="t-dim" style="margin-top:10px;">run <span class="t-pass">publications &lt;id&gt;</span> for details, e.g. <span class="t-pass">publications tamas</span></div>`;
    },
    news: () => {
      const rows = NEWS.map(([d, lvl, msg]) =>
        `<div><span class="t-dim">${d}</span>  <span class="${lvl === 'PASS' ? 't-pass' : 't-amber'}">${lvl}</span>  ${msg}</div>`
      ).join('');
      return `<div class="t-head" style="margin-bottom:6px;">news —</div>${rows}`;
    },
    links: () => `
<div class="t-head" style="margin-bottom:6px;">links —</div>
<div>linkedin  <a href="${LINKS.linkedin}" target="_blank" rel="noopener">${LINKS.linkedin}</a></div>
<div>github    <a href="${LINKS.github}" target="_blank" rel="noopener">${LINKS.github}</a></div>
<div>x         <a href="${LINKS.x}" target="_blank" rel="noopener">${LINKS.x}</a></div>
<div>scholar   <a href="${LINKS.scholar}" target="_blank" rel="noopener">${LINKS.scholar}</a></div>
`,
    contact: () => `
<div class="t-head" style="margin-bottom:6px;">contact —</div>
${LINKS.emails.map(e => `<div>email  <a href="mailto:${e}">${e}</a></div>`).join('')}
<div class="t-dim" style="margin-top:6px;">Always glad to talk research — reach out any time.</div>
`,
    resume: () => `<div>opening <a href="${LINKS.cv}" target="_blank" rel="noopener">${LINKS.cv}</a> — if it doesn't open automatically, click the link.</div>`,
    help: () => `
<div class="t-head" style="margin-bottom:6px;">available commands —</div>
<table class="t-help">
  <tr><td class="t-cmdname">about</td><td>who I am, right now</td></tr>
  <tr><td class="t-cmdname">experience</td><td>research roles, in order</td></tr>
  <tr><td class="t-cmdname">publications [id]</td><td>papers — try 'publications tamas'</td></tr>
  <tr><td class="t-cmdname">news</td><td>recent updates, log-style</td></tr>
  <tr><td class="t-cmdname">links</td><td>linkedin / github / x / scholar</td></tr>
  <tr><td class="t-cmdname">contact</td><td>how to reach me</td></tr>
  <tr><td class="t-cmdname">resume</td><td>open my CV</td></tr>
  <tr><td class="t-cmdname">clear</td><td>clear the screen</td></tr>
</table>
`,
    clear: () => { termBody.innerHTML = ''; return null; }
  };

  function runCommand(raw){
    const trimmed = raw.trim();
    if (!trimmed) return;
    echoCommand(trimmed);
    const parts = trimmed.split(/\s+/);
    let cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    const aliases = { whoami: 'about', papers: 'publications', log: 'news', cv: 'resume', '?': 'help' };
    if (aliases[cmd]) cmd = aliases[cmd];

    if (cmd === 'sudo'){
      append(`<span class="t-flag">Permission denied:</span> <span class="t-dim">you're not root here. Try 'contact' instead — that one actually works.</span>`);
      return;
    }
    if (cmd === 'echo'){
      append(`<div class="t-dim">${esc(args.join(' '))}</div>`);
      return;
    }
    const fn = OUTPUTS[cmd];
    if (!fn){
      append(`<span class="t-flag">command not found:</span> <span class="t-dim">${esc(cmd)}</span> — type <span class="t-pass">help</span> to see available commands.`);
      return;
    }
    const out = fn(args);
    if (out) append(out);
  }

  const history = [];
  let histIdx = -1;
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter'){
      const val = input.value;
      if (val.trim()){ history.push(val); histIdx = history.length; }
      runCommand(val);
      input.value = '';
    } else if (e.key === 'ArrowUp'){
      if (histIdx > 0){ histIdx--; input.value = history[histIdx]; }
      e.preventDefault();
    } else if (e.key === 'ArrowDown'){
      if (histIdx < history.length - 1){ histIdx++; input.value = history[histIdx]; }
      else { histIdx = history.length; input.value = ''; }
      e.preventDefault();
    }
  });

  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeTerm(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlay.classList.contains('open')) closeTerm(); });

  function tick(){
    const now = new Date();
    const clockEl = document.getElementById('termClock');
    if (clockEl) clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  tick(); setInterval(tick, 1000);

  function boot(){
    termBody.innerHTML = '';
    const bootLines = ['booting ishan-kavathekar-v1 …', 'loading profile … done', 'connection established.'];

    if (reduce){
      bootLines.forEach(l => append(`<span class="t-dim">${l}</span>`));
      append(OUTPUTS.about());
      append(`<span class="t-dim">type</span> <span class="t-pass">help</span> <span class="t-dim">to see available commands, or tap one:</span>`);
      appendRaw(chips(COMMANDS));
      input.focus();
      return;
    }
    let i = 0;
    (function next(){
      if (i < bootLines.length){
        append(`<span class="t-dim">${bootLines[i]}</span>`);
        i++;
        setTimeout(next, 220);
      } else {
        setTimeout(() => {
          append(OUTPUTS.about());
          append(`<span class="t-dim">type</span> <span class="t-pass">help</span> <span class="t-dim">to see available commands, or tap one:</span>`);
          appendRaw(chips(COMMANDS));
          input.focus();
        }, 180);
      }
    })();
  }

  function openTerm(){
    overlay.classList.add('open');
    document.body.classList.add('term-open');
    if (fabBtn) fabBtn.classList.add('show');
    boot();
  }
  function closeTerm(){
    overlay.classList.remove('open');
    document.body.classList.remove('term-open');
  }

  if (openBtn) openBtn.addEventListener('click', openTerm);
  if (fabBtn) fabBtn.addEventListener('click', openTerm);
  if (closeBtn) closeBtn.addEventListener('click', closeTerm);
});
