// STAND family page – shared template (v2).
// Each family's index.html sets window.STAND_API (their Apps Script link) and window.STAND_LEAD (first name of their STAND contact)
// and then loads this file. Nothing about any family is kept in this file.
(function () {
'use strict';

const API = window.STAND_API;
const LEAD = window.STAND_LEAD || 'STAND';
const app = document.getElementById('app');

const ICONS = {
  coming: '<path d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/>',
  stand: '<path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 20c0-3 2.2-5 5-5s5 2 5 5M11 20c0-3 2.2-5 5-5s5 2 5 5"/>',
  you: '<path d="M4 6h16v12H4zM4 7l8 6 8-6"/>',
  done: '<path d="M5 12.5 10 17l9-10"/>',
  chev: '<path d="m6 9 6 6 6-6"/>',
  working: '<path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="8"/>',
  waiting: '<path d="M7 4h10M7 20h10M8 4c0 5 8 5 8 8s-8 3-8 8M16 4c0 5-8 5-8 8s8 3 8 8"/>',
  notyet: '<circle cx="12" cy="12" r="8"/>',
  clock: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
  doc: '<path d="M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7l-4-4Z"/><path d="M14 3v4h4M9 13h6M9 17h6"/>',
  folder: '<path d="M3 7a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7Z"/>'
};
const svg = (d, cls) => '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';

const META = [
  { id: 'coming', cls: 't-coming', label: 'Coming up', title: 'Coming up', sub: 'Meetings and dates to know about.', empty: 'Nothing booked right now.' },
  { id: 'stand', cls: 't-stand', label: 'What STAND is doing', title: 'What STAND is doing for you', sub: "Things we're following up on your behalf.", empty: 'Nothing open right now.' },
  { id: 'you', cls: 't-you', label: 'What we need from you', title: 'Anything we need from you', sub: "Every one of these helps us push for the right support. Start at the top, and tap one to see how. Message us if you're stuck.", empty: "Nothing right now. You're all caught up. We'll let you know if that changes." },
  { id: 'done', cls: 't-done', label: 'Done recently', title: 'Done recently', sub: "From the last two weeks. Look at what's been sorted.", empty: 'Nothing finished in the last two weeks.' }
];

// Places that can help, from the Helpful Contacts page on standuk.co.uk.
const SUPPORT = [
  { group: 'School and additional support', orgs: [
    { name: 'Enquire', note: 'Advice on additional support for learning. 0345 123 2303', url: 'https://enquire.org.uk' },
    { name: "Barnardo's Let's Talk ASN", note: 'Help if you disagree with the school about support. 0131 446 7000', url: 'https://www.barnardos.org.uk/what-we-do/services/lets-talk-asn-scotland' },
    { name: 'Govan Law Centre Education Law Unit', note: 'Template letters and legal advice. 0800 043 0306', url: 'https://govanlawcentre.org/education-law-unit' }
  ]},
  { group: 'Someone to speak up with you', orgs: [
    { name: 'Kindred', note: 'Advocacy for families of children with additional needs', url: 'https://www.kindred-scotland.org' },
    { name: 'Find an independent advocate', note: 'Scottish Independent Advocacy Alliance', url: 'https://www.siaa.org.uk/find-an-advocate' }
  ]},
  { group: 'Money and benefits', orgs: [
    { name: 'Citizens Advice Scotland', note: 'Help to Claim helpline 0800 023 2581', url: 'https://www.citizensadvice.org.uk' }
  ]},
  { group: 'Health and complaints', orgs: [
    { name: 'Patient Advice and Support Service', note: 'Your rights as an NHS patient, and help with complaints. 0800 917 2127', url: 'https://www.cas.org.uk/pass' },
    { name: 'Scottish Public Services Ombudsman', note: 'If a complaint to a public body has not been put right', url: 'https://www.spso.org.uk' }
  ]},
  { group: 'From STAND', orgs: [
    { name: 'Parent and carer WhatsApp groups', note: 'Email emma@standuk.co.uk to join', url: '' },
    { name: 'More helpful contacts', note: 'The full list on our website', url: 'https://www.standuk.co.uk/useful-information/helpful-contacts' }
  ]}
];

// Jargon buster. "match" finds the word in page text so it can be tapped. Keep explanations plain and accurate.
const JARGON = [
  { term: "Child's Planning Meeting", aka: 'CPM', match: /\bChild['’]?s Planning Meetings?\b|\bCPMs?\b|\bplanning meetings?\b/i,
    say: "A meeting about how your child is getting on and what support they need. You, the school and anyone else involved (like health or social work) talk it through together.",
    more: "What's agreed should be written down in the minutes and in your child's Child's Plan: what will happen, who will do it and by when. You can bring someone with you, like STAND, and you can ask for a copy of the minutes if you don't get one." },
  { term: 'Minutes', match: /\bminutes\b/i,
    say: "The written record of a meeting: who was there, what was talked about and what was agreed.",
    more: "If something in the minutes doesn't match what was said, you can ask for it to be corrected. Do this in writing and keep a copy." },
  { term: "Child's Plan", match: /\bChild['’]?s Plans?\b/i,
    say: "A single plan for your child, used when they need extra support from one or more services. It sets out what your child needs, what will be done, who is responsible, and when it will be looked at again.",
    more: "It's part of GIRFEC. You should be involved in writing it, your child's views should be in it, and you can ask for a copy each time it changes." },
  { term: 'GIRFEC', aka: 'Getting it right for every child', match: /\bGIRFEC\b|Getting it right for every child/i,
    say: "Scotland's way of working with children and families. Services should work together, listen to you and your child, and put your child's wellbeing at the centre." },
  { term: 'Wellbeing indicators', aka: 'SHANARRI', match: /\bSHANARRI\b|wellbeing indicators?/i,
    say: "Eight words used to think about how a child is doing: Safe, Healthy, Achieving, Nurtured, Active, Respected, Responsible and Included." },
  { term: 'Named Person', match: /\bNamed Person\b/i,
    say: "A clear point of contact for your child and family, often the health visitor before school and someone senior at school after that.",
    more: "It's no longer a legal role in Scotland, but many areas still use the name." },
  { term: 'Lead Professional', match: /\bLead Professional\b/i,
    say: "The person who coordinates your child's plan when more than one service is involved, so you have one main person to go to." },
  { term: 'Additional support needs', aka: 'ASN', match: /\badditional support needs?\b|\bASN\b/i,
    say: "Your child has additional support needs if they need extra help to get the most out of school, for any reason and for any length of time. They don't need a diagnosis for this." },
  { term: 'ASL Act', aka: 'Additional Support for Learning Act', match: /\bASL Act\b|Additional Support for Learning\b/i,
    say: "The Education (Additional Support for Learning) (Scotland) Act 2004. The law that says the council must identify and meet children's additional support needs at school.",
    more: "It also gives parents rights, like asking for an assessment, being told about decisions, and ways to sort out disagreements." },
  { term: 'Coordinated Support Plan', aka: 'CSP', match: /\bCoordinated Support Plans?\b|\bCSPs?\b/i,
    say: "A legal plan under the ASL Act for some children whose needs come from complex or several factors, are likely to last more than a year, and need a lot of support from education and at least one other service, like health or social work.",
    more: "A CSP comes with extra rights, including taking a disagreement to a tribunal." },
  { term: 'Section 23', match: /\b(section|s\.?)\s?23\b/i,
    say: "This can mean two different things, so check the letter.",
    more: "In school letters it usually means the council asking the NHS (or another council) to help with your child's support, for example an assessment or advice. They have to help unless there's a good reason not to, normally within 10 weeks (16 at most in some situations). In social work letters it usually means an assessment of your child's needs because of disability, which the council must carry out when a parent asks." },
  { term: 'Educational psychologist', aka: 'EP', match: /\beducational psychologists?\b|\bEd ?Psych\b/i,
    say: "A psychologist who works with schools to understand how your child learns and what helps. They can observe, assess and give advice to the school and to you." },
  { term: 'CAMHS', aka: 'Child and Adolescent Mental Health Services', match: /\bCAMHS\b/i,
    say: "The NHS service for children's and young people's mental health. In some areas it also does medication reviews and some assessments." },
  { term: 'Occupational therapist', aka: 'OT', match: /\boccupational therap(y|ist)s?\b|\bOT\b/,
    say: "Someone who looks at everyday things like sensory needs, dressing, handwriting and getting about, and suggests changes or equipment that help." },
  { term: 'Speech and language therapist', aka: 'SLT or SALT', match: /\bspeech and language\b|\bSALT\b|\bSLT\b/i,
    say: "Someone who helps with communication: understanding, talking, social communication, and sometimes eating and drinking." },
  { term: 'Neurodevelopmental assessment', match: /\bneurodevelopmental\b/i,
    say: "An assessment to understand how your child thinks, learns and experiences the world, which can lead to a diagnosis such as autism or ADHD." },
  { term: 'Self-directed Support', aka: 'SDS', match: /\bSelf[- ]directed Support\b|\bSDS\b/i,
    say: "How social work support is arranged in Scotland. After an assessment, you choose how much control you want, from a direct payment you manage yourself to the council arranging it for you." },
  { term: 'Child Disability Payment', aka: 'CDP', match: /\bChild Disability Payment\b|\bCDP\b/i,
    say: "A Social Security Scotland payment for children with a disability or long-term condition, to help with the extra costs. It isn't based on your income." },
  { term: 'Re-determination', match: /\bre-?determination\b/i,
    say: "Asking Social Security Scotland to look at a decision again if you disagree with it. You normally need to ask within 42 days of the decision." },
  { term: 'Risk assessment', match: /\brisk assessments?\b/i,
    say: "A written look at what could go wrong and what will be done to keep everyone safe. You can ask to see any risk assessment about your child and to have a say in it." },
  { term: 'Reduced timetable', aka: 'part-time timetable', match: /\b(reduced|part[- ]time) timetables?\b/i,
    say: "When a child goes to school for fewer hours than usual. National guidance says it should be temporary, agreed with you, written down and reviewed often." },
  { term: 'Exclusion', match: /\bexclu(sion|ded)\b/i,
    say: "When a child is formally not allowed to go to school for a time. It should be recorded and you should get a letter.",
    more: "Being asked to keep your child at home or collect them early, without a formal exclusion, is sometimes called an informal exclusion. National guidance says this shouldn't happen." },
  { term: 'Placing request', match: /\bplacing requests?\b/i,
    say: "Asking the council for your child to go to a particular school, special school or unit. The council has to reply in writing, and if it says no you can appeal." },
  { term: 'Reasonable adjustments', match: /\breasonable adjustments?\b/i,
    say: "Changes a school or service has to make so a disabled child isn't put at a disadvantage, under the Equality Act 2010." },
  { term: 'Subject access request', aka: 'SAR', match: /\bsubject access requests?\b|\bSARs?\b/,
    say: "Your right under data protection law to ask an organisation for a copy of the information it holds about you or your child. They normally have one month to reply." },
  { term: 'Freedom of information request', aka: 'FOI', match: /\bfreedom of information\b|\bFOIs?\b/i,
    say: "Asking a public body, like the council, for information it holds (not personal information). They normally have 20 working days to reply." },
  { term: 'UNCRC', aka: 'children\'s rights', match: /\bUNCRC\b/i,
    say: "The UN Convention on the Rights of the Child. It's now part of Scots law, so public bodies must respect children's rights, including your child's right to have their views heard." },
  { term: 'Tribunal', match: /\btribunal\b/i,
    say: "An independent panel that can decide some disagreements about additional support for learning, such as Coordinated Support Plans, some placing requests and disability discrimination at school." },
  { term: 'Authority to act', match: /\bauthority to act\b|\bconsent form\b/i,
    say: "A form you sign so STAND can speak to the school, council or NHS for you. You can change your mind at any time." }
];

const MONTHS = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };

// "12 Dec 2026", "12 December", "12/12/2026" -> Date (or null). No year: the nearest sensible one.
function parseDate(text) {
  let m = /(\d{1,2})\/(\d{1,2})\/(\d{2,4})/.exec(text || '');
  if (m) { const y = +m[3] < 100 ? 2000 + +m[3] : +m[3]; return new Date(y, +m[2] - 1, +m[1]); }
  m = /(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]{3})[a-z]*\.?(?:\s+(\d{4}))?/.exec(text || '');
  if (!m) return null;
  const mon = MONTHS.indexOf(m[2].toLowerCase());
  if (mon < 0) return null;
  const now = today();
  if (m[3]) return new Date(+m[3], mon, +m[1]);
  let d = new Date(now.getFullYear(), mon, +m[1]);
  if (d - now < -180 * 864e5) d = new Date(now.getFullYear() + 1, mon, +m[1]);
  return d;
}
function daysUntil(text) { const d = parseDate(text); return d ? Math.round((d - today()) / 864e5) : null; }
function gentle(text) {
  const n = daysUntil(text);
  if (n == null) return 'When you can';
  if (n <= 3) return 'Soon, if you can';
  if (n <= 7) return 'This week';
  if (n <= 14) return 'In the next couple of weeks';
  return 'No rush';
}
function countdown(label, text) {
  const d = parseDate(text); if (!d) return null;
  const n = Math.round((d - today()) / 864e5);
  const nice = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  const what = label.replace(/:$/, '');
  if (n > 1) return { late: false, text: what + ' in ' + n + ' days (' + nice + ')' };
  if (n === 1) return { late: false, text: what + ' tomorrow (' + nice + ')' };
  if (n === 0) return { late: false, text: what + ' today' };
  return { late: true, text: what + ' date passed ' + (-n) + (n === -1 ? ' day' : ' days') + ' ago (' + nice + ')' };
}

// ---- "More detail": labelled lines -> headed blocks ----
const DUE_LABEL = /(due|deadline|reply by|respond by|decision by|appeal by)/i;
const LIST_LABEL = /^(questions to ask|what to bring|what was agreed|actions|agreed actions|next steps)$/i;
function parseMore(text) {
  const blocks = []; let cur = null; let source = '';
  String(text || '').split(/\r?\n/).forEach(raw => {
    const line = raw.trim(); if (!line) return;
    if (/^from (the |stand|our )/i.test(line) && line.indexOf(':') === -1) { source = line.replace(/\.$/, ''); return; }
    const m = /^([A-Z][A-Za-z'’ ()/-]{1,40}?):\s*(.*)$/.exec(line);
    if (m && !/^https?$/i.test(m[1])) { cur = { label: m[1].trim(), lines: [] }; blocks.push(cur); if (m[2]) cur.lines.push(m[2]); return; }
    if (!cur) { cur = { label: '', lines: [] }; blocks.push(cur); }
    cur.lines.push(line);
  });
  return { blocks, source };
}
function dueFrom(more) {
  const p = parseMore(more);
  for (const b of p.blocks) { if (DUE_LABEL.test(b.label)) { const c = countdown(b.label, b.lines.join(' ')); if (c) return c; } }
  return null;
}
function dueChip(c) {
  const s = el('span', 'due' + (c.late ? ' late' : '')); s.innerHTML = svg(ICONS.clock); s.append(c.text); return s;
}

// ---- tap-to-explain words ----
let dialog = null, jargonOpen = null;
function explainTerm(j) {
  if (!dialog || typeof dialog.showModal !== 'function') {
    const box = document.getElementById('jargon'); if (box) { box.scrollIntoView(); if (jargonOpen) jargonOpen(j.term); } return;
  }
  dialog.innerHTML = '';
  dialog.append(el('h3', null, j.term + (j.aka ? ' (' + j.aka + ')' : '')), el('p', null, j.say));
  if (j.more) dialog.append(el('p', null, j.more));
  const row = el('div', 'row');
  const close = el('button', 'tick', 'Got it'); close.type = 'button'; close.addEventListener('click', () => dialog.close());
  const all = el('button', 'btn-link', 'See all words'); all.type = 'button';
  all.addEventListener('click', () => { dialog.close(); const box = document.getElementById('jargon'); if (box) { box.scrollIntoView({ behavior: 'smooth' }); if (jargonOpen) jargonOpen(j.term); } });
  row.append(close, all); dialog.append(row);
  dialog.showModal(); close.focus();
}
// Returns text as nodes, with the first mention of each jargon word turned into a button. "seen" stops repeats within one item.
function rich(text, seen) {
  const frag = document.createDocumentFragment();
  let rest = String(text == null ? '' : text);
  while (rest) {
    let best = null;
    JARGON.forEach(j => {
      if (seen && seen.has(j.term)) return;
      const m = j.match.exec(rest);
      if (m && (!best || m.index < best.m.index)) best = { j, m };
    });
    if (!best) { frag.append(rest); break; }
    frag.append(rest.slice(0, best.m.index));
    const b = el('button', 'term', best.m[0]); b.type = 'button';
    b.setAttribute('aria-label', best.m[0] + ', what does this mean?');
    const j = best.j; b.addEventListener('click', ev => { ev.stopPropagation(); explainTerm(j); });
    frag.append(b);
    if (seen) seen.add(j.term);
    rest = rest.slice(best.m.index + best.m[0].length);
  }
  return frag;
}
function richEl(tag, cls, text, seen) { const e = el(tag, cls); e.append(rich(text, seen)); return e; }
function termIn(text) { return JARGON.find(j => j.match.test(text || '')); }

function moreBlocks(more, seen) {
  const p = parseMore(more);
  if (!p.blocks.length && !p.source) return null;
  const wrap = el('div', 'blocks');
  p.blocks.forEach(b => {
    const box = el('div', 'block');
    if (b.label) box.append(el('h4', null, b.label));
    if (DUE_LABEL.test(b.label)) { const c = countdown(b.label, b.lines.join(' ')); if (c) box.append(dueChip(c)); }
    const bullets = b.lines.length > 1 && (LIST_LABEL.test(b.label) || b.lines.every(l => /^[-•*]\s*/.test(l)));
    const items = b.lines.length === 1 && LIST_LABEL.test(b.label) && b.lines[0].indexOf(';') > -1 ? b.lines[0].split(/\s*;\s*/) : null;
    if (bullets || items) {
      const ul = el('ul');
      (items || b.lines).forEach(l => ul.append(richEl('li', null, l.replace(/^[-•*]\s*/, ''), seen)));
      box.append(ul);
    } else b.lines.forEach(l => box.append(richEl('p', null, l.replace(/^[-•*]\s*/, ''), seen)));
    wrap.append(box);
  });
  if (p.source) wrap.append(el('p', 'source', p.source));
  return wrap;
}

// Only Google Drive and Docs links are opened from the page.
function safeLink(u) { return /^https:\/\/(drive|docs)\.google\.com\//.test(u || '') ? u : ''; }
function docButton(url) {
  const isFolder = /\/folders\//.test(url);
  const p = el('div', 'blocks');
  const a = el('a', 'docbtn'); a.href = url; a.target = '_blank'; a.rel = 'noopener';
  a.innerHTML = svg(isFolder ? ICONS.folder : ICONS.doc); a.append(isFolder ? 'Open the folder' : 'Open the document');
  p.append(a, el('p', 'docnote', isFolder ? 'Opens in Google Drive. Everything from this one is kept together in there.' : 'Opens in Google Drive.'));
  return p;
}
function explainBox(it) {
  const j = termIn(it.what); if (!j) return null;
  const box = el('div', 'explain');
  box.append(el('strong', null, 'What does ' + j.term + (j.aka && j.aka.length < 6 ? ' (' + j.aka + ')' : '') + ' mean?'));
  box.append(el('p', null, j.say));
  if (j.more) box.append(el('p', null, j.more));
  return box;
}

// ---- talking to STAND's Apps Script ----
function call(body) {
  return fetch(API, { method: 'POST', body: JSON.stringify(body), credentials: 'omit', redirect: 'follow' })
    .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
}
// The saved code belongs to this page only, so two family pages on one phone don't overwrite each other.
const KEY = 'stand-family-code:' + location.pathname.replace(/index\.html$/, '');
const OLD_KEY = 'stand-family-code';
let CODE = null;
function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function remember(c) { try { localStorage.setItem(KEY, c); } catch (e) {} }
function forget() { try { localStorage.removeItem(KEY); } catch (e) {} }
const MESSAGES = {
  wrong: "That code didn't match. Check the code from STAND and try again.",
  locked: 'Too many tries for now. Please wait an hour, or message ' + LEAD + " and we'll help.",
  error: 'Something went wrong opening your page. Message ' + LEAD + " and we'll sort it.",
  offline: "We couldn't open your page just now. Check your signal and try again."
};

function showLoading() {
  app.innerHTML = '';
  const top = el('header', 'top');
  top.append(el('p', 'eyebrow', 'Your support from STAND'), el('p', 'intro', 'Opening your page...'));
  app.append(top);
}
function showGate(reason) {
  app.innerHTML = '';
  const top = el('header', 'top');
  top.append(el('p', 'eyebrow', 'Your support from STAND'), el('h1', null, 'Welcome'));
  top.append(el('p', 'intro', "Enter the 6-digit code STAND gave you. You'll only need to do this once on this phone."));
  const form = el('form', 'gate'); form.id = 'gate';
  const label = el('label', null, 'Your code'); label.htmlFor = 'code';
  const input = el('input'); input.id = 'code'; input.inputMode = 'numeric'; input.autocomplete = 'one-time-code'; input.maxLength = 6; input.pattern = '[0-9]*';
  const btn = el('button', 'tick', 'Open my page'); btn.type = 'submit';
  form.append(label, input);
  if (reason) { const m = el('p', 'gate-msg', MESSAGES[reason] || MESSAGES.error); m.setAttribute('role', 'alert'); form.append(m); }
  form.append(btn);
  form.addEventListener('submit', ev => { ev.preventDefault(); const c = input.value.replace(/\D/g, ''); if (c.length === 6) tryCode(c, ''); else showGate('wrong'); });
  app.append(top, form, el('p', 'donehint', "Don't have a code? Message " + LEAD + " and we'll send it."));
  input.focus();
}
// from: '' typed, 'saved' this page's saved code, 'old' a code saved by the older version of the page
function tryCode(c, from) {
  showLoading();
  call({ action: 'getPage', code: c })
    .then(res => {
      if (res && res.ok) { CODE = c; remember(c); app.innerHTML = ''; start(res.data); }
      else {
        if (from === 'saved') forget();
        showGate(from && res && res.reason === 'wrong' ? null : (res && res.reason));
      }
    })
    .catch(() => showGate('offline'));
}

function start(DATA) {
  let active = 'coming';
  const open = new Set();
  const ticks = DATA.ticks || {};
  let justDone = null, showAllYou = false, showAll = false;
  const histOpen = new Set(), docOpen = new Set();

  dialog = el('dialog', 'define'); dialog.setAttribute('aria-label', 'What this word means');
  dialog.addEventListener('click', ev => { if (ev.target === dialog) dialog.close(); });

  const top = el('header', 'top');
  top.append(el('p', 'eyebrow', 'Your support from STAND'));
  top.append(el('h1', null, (DATA.title || 'STAND').replace(/^STAND\s*[–-]\s*/, '')));
  top.append(el('p', 'intro', "Here's where things are. Tap a box to see the details. Words with a dotted line under them can be tapped to see what they mean."));
  top.append(el('p', 'updated', DATA.updated || ''));
  const cheerSlot = el('div'); top.append(cheerSlot);
  const tiles = el('nav', 'tiles'); tiles.setAttribute('aria-label', 'Sections');
  const panel = el('section', 'panel'); panel.setAttribute('aria-live', 'polite');
  const history = el('section', 'history'); history.id = 'history';
  const docs = el('section', 'docs'); docs.id = 'documents';
  const jargon = el('section', 'jargon'); jargon.id = 'jargon';
  const contact = el('section', 'contact');
  contact.append(el('h2', null, 'Need to talk to us?'));
  contact.append(el('p', null, DATA.contact || 'Get in touch with STAND any time.'));
  const support = el('section', 'support');
  const foot = el('footer', 'foot');
  const skip = el('nav', 'skip'); skip.setAttribute('aria-label', 'Jump to');
  app.append(top, tiles, panel, skip, history, docs, jargon, contact, support, foot, dialog);

  const isYou = it => (it.who || '').toLowerCase() === 'you';
  const sheetItems = id => (DATA.sections && DATA.sections[id]) || [];
  const linkOf = it => safeLink(it.link) || safeLink(/^https?:\/\//.test(it.extra || '') ? it.extra : '');

  function tickedList() {
    const cutoff = Date.now() - 14 * 864e5;
    return Object.keys(ticks).map(k => ({ what: k, at: ticks[k] }))
      .filter(t => new Date(t.at).getTime() > cutoff)
      .sort((a, b) => new Date(b.at) - new Date(a.at))
      .map(t => ({ what: t.what, when: new Date(t.at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }), who: 'You', ticked: true }));
  }
  function items(id) {
    if (id === 'you') return sheetItems('you').filter(it => !ticks[it.what]);
    if (id === 'done') return tickedList().concat(sheetItems('done').filter(it => !ticks[it.what]));
    return sheetItems(id);
  }
  function statusOf(text) {
    const t = (text || '').toLowerCase();
    if (t.indexOf('working') > -1) return ['working', text];
    if (t.indexOf('waiting') > -1) return ['waiting', text];
    if (t.indexOf('not started') > -1) return ['notyet', text];
    return null;
  }

  function renderCheer() {
    cheerSlot.innerHTML = '';
    const n = items('done').filter(isYou).length;
    if (!n) return;
    const cheer = el('p', 'cheer'); cheer.innerHTML = svg(ICONS.done);
    cheer.append(n === 1 ? "You've ticked something off recently. Thank you, it really helps." : "You've ticked off " + n + " things recently. That's brilliant, thank you.");
    cheerSlot.append(cheer);
  }

  const PRAISE = ['You did this. Thank you, it makes a real difference.', "That's done, and it was you. Well done.", 'Sorted, thanks to you. Brilliant.'];
  const WELL_DONE = ['Brilliant, well done!', "That's one less thing. Well done!", 'Nice one, thank you!'];
  function save(fn, what) { call({ action: fn, code: CODE, what: what }).catch(() => {}); }
  function tickOff(it) { ticks[it.what] = new Date().toISOString(); justDone = it.what; open.clear(); save('tickItem', it.what); renderAll(); const w = document.getElementById('welldone'); if (w) w.focus(); }
  function undoTick(what) { delete ticks[what]; justDone = null; save('untickItem', what); renderAll(); }

  function renderTiles() {
    tiles.innerHTML = '';
    META.forEach(s => {
      const b = el('button', 'tile ' + s.cls); b.type = 'button'; b.id = 'tile-' + s.id;
      b.setAttribute('aria-pressed', String(s.id === active));
      b.innerHTML = svg(ICONS[s.id], 'icon');
      b.append(el('span', 'n', String(items(s.id).length)), el('span', 'label', s.label));
      b.addEventListener('click', () => { active = s.id; justDone = null; renderTiles(); renderPanel(); });
      tiles.append(b);
    });
  }

  // The expanded part of any item: plain words, what the word means, more detail, steps, document.
  function detailParts(it, opts) {
    const seen = new Set(); const parts = [];
    if (it.detail) parts.push(richEl('p', null, it.detail, seen));
    const mb = moreBlocks(it.more, seen); if (mb) parts.push(mb);
    if (opts && opts.where) parts.push(el('p', 'where', 'Where: ' + opts.where));
    const steps = (it.howto || '').split(/\n+/).map(x => x.replace(/^\s*(\d+[.)]|[-•])\s*/, '').trim()).filter(Boolean);
    if (steps.length) {
      const box = el('div', 'howto'); box.append(el('h3', null, 'How to do it'));
      const ol = el('ol'); steps.forEach(st => ol.append(richEl('li', null, st, seen))); box.append(ol);
      parts.push(box);
    }
    const ex = explainBox(it); if (ex) parts.push(ex);
    const link = linkOf(it); if (link) parts.push(docButton(link));
    return parts;
  }

  function renderPanel() {
    const s = META.find(x => x.id === active);
    panel.style.setProperty('--c', getComputedStyle(document.getElementById('tile-' + s.id)).getPropertyValue('--c'));
    panel.innerHTML = '';
    panel.append(el('h2', null, s.title), el('p', 'sub', s.sub));

    if (s.id === 'you' && justDone) {
      const w = el('div', 'welldone'); w.id = 'welldone'; w.tabIndex = -1;
      w.append(el('h3', null, WELL_DONE[Object.keys(ticks).length % WELL_DONE.length]));
      w.append(el('p', null, "That's ticked off and moved to Done recently. Drop " + LEAD + " a quick message to say it's done, so we can pick it up from here."));
      const u = el('button', 'btn-link', "Undo, I haven't done this yet"); u.type = 'button'; const what = justDone;
      u.addEventListener('click', () => undoTick(what)); w.append(u); panel.append(w);
    }

    let list = items(s.id);
    if (!list.length) { panel.append(el('p', 'empty', s.empty)); return; }
    const total = list.length;
    if (s.id === 'you' && !showAllYou) list = list.slice(0, 3);
    const ul = el('ul', 'list');
    list.forEach((it, i) => {
      const key = s.id + i, isOpen = open.has(key);
      const where = s.id === 'coming' ? it.extra : '';
      const status = s.id === 'stand' ? statusOf(it.extra) : (s.id === 'done' ? (isYou(it) ? ['you', 'You did this'] : ['done', 'Done']) : null);
      const due = s.id !== 'done' ? dueFrom(it.more) : null;
      const hasMore = s.id === 'you' || !!it.ticked || !!(it.detail || it.more || where || linkOf(it) || it.howto || termIn(it.what));
      const li = el('li', 'item'); li.dataset.open = String(isOpen);
      const head = hasMore ? el('button') : el('div', 'static');
      if (hasMore) { head.type = 'button'; head.id = 'item-' + key; head.setAttribute('aria-expanded', String(isOpen)); }
      const what = el('span', 'what');
      if (s.id === 'you' && i === 0) what.append(el('span', 'start', 'Start here'));
      what.append(it.what);
      head.append(what);
      if (hasMore) head.insertAdjacentHTML('beforeend', svg(ICONS.chev, 'chev'));
      if (s.id === 'you') {
        const u = el('span', 'urgency'); u.innerHTML = svg(ICONS.clock); u.append(gentle(it.when) + (it.when ? '  ·  aim for ' + it.when.replace(/^By\s+/i, '') : ''));
        head.append(u);
      } else if (it.when) head.append(el('span', 'when', (s.id === 'done' ? 'Done ' : '') + it.when));
      if (due) head.append(dueChip(due));
      if (status) { const c = el('span', 'chip ' + status[0]); c.innerHTML = svg(ICONS[(status[0] === 'done' || status[0] === 'you') ? 'done' : status[0]]); c.append(status[1]); head.append(c); }
      if (hasMore) head.addEventListener('click', () => { isOpen ? open.delete(key) : open.add(key); justDone = null; renderPanel(); const f = document.getElementById('item-' + key); if (f) f.focus(); });
      li.append(head);
      if (hasMore && isOpen) {
        const d = el('div', 'detail');
        if (s.id === 'done' && isYou(it)) d.append(el('p', 'praise', PRAISE[i % PRAISE.length]));
        if (it.ticked) { const ub = el('button', 'btn-link', "Undo, I haven't done this yet"); ub.type = 'button'; ub.addEventListener('click', () => undoTick(it.what)); d.append(ub, el('p', 'donehint', 'Ticked this by mistake? Tap undo and it goes back on your list.')); }
        detailParts(it, { where }).forEach(p => d.append(p));
        if (s.id === 'you') {
          const t = el('button', 'tick'); t.type = 'button'; t.id = 'tick-' + key;
          t.innerHTML = svg(ICONS.done); t.append("I've done this");
          t.addEventListener('click', () => tickOff(it));
          d.append(t, el('p', 'donehint', "Stuck? Just message us and we'll help."));
        }
        li.append(d);
      }
      ul.append(li);
    });
    panel.append(ul);
    if (s.id === 'you' && total > 3) {
      const b = el('button', 'btn-link', showAllYou ? 'Show fewer' : 'See ' + (total - 3) + " more, when you're ready");
      b.type = 'button'; b.id = 'you-more';
      b.addEventListener('click', () => { showAllYou = !showAllYou; renderPanel(); document.getElementById('you-more').focus(); });
      panel.append(b);
    }
  }

  function renderHistory() {
    const list = sheetItems('history');
    history.innerHTML = '';
    if (!list.length) return;
    history.append(el('h2', null, "What's happened so far"), el('p', 'sub', 'The story so far, newest first. The purple dots are things you did. Tap "Read more" to see the detail and the paperwork.'));
    const ol = el('ol', 'timeline');
    (showAll ? list : list.slice(0, 6)).forEach((it, i) => {
      const li = el('li', isYou(it) ? 'mine' : '');
      li.append(el('span', 'date', it.when || ''), el('span', 'what', it.what));
      if (isYou(it)) li.append(el('span', 'mine-tag', 'You did this'));
      const expandable = it.more || linkOf(it) || termIn(it.what);
      if (expandable) {
        const isOpen = histOpen.has(i);
        if (it.detail && !isOpen) li.append(richEl('p', 'more', it.detail));
        const b = el('button', 'open-more', isOpen ? 'Show less' : 'Read more'); b.type = 'button'; b.id = 'hist-' + i;
        b.setAttribute('aria-expanded', String(isOpen));
        b.addEventListener('click', () => { isOpen ? histOpen.delete(i) : histOpen.add(i); renderHistory(); document.getElementById('hist-' + i).focus(); });
        li.append(b);
        if (isOpen) { const d = el('div', 'tl-detail'); detailParts(it).forEach(p => d.append(p)); li.append(d); }
      } else if (it.detail) li.append(richEl('p', 'more', it.detail));
      ol.append(li);
    });
    history.append(ol);
    if (list.length > 6) {
      const b = el('button', 'btn-link', showAll ? 'Show less' : 'Show everything (' + list.length + ')');
      b.type = 'button'; b.id = 'history-toggle';
      b.addEventListener('click', () => { showAll = !showAll; renderHistory(); document.getElementById('history-toggle').focus(); });
      history.append(b);
    }
  }

  function renderDocs() {
    const list = sheetItems('docs').filter(it => !/^nothing right now/i.test(it.what));
    docs.innerHTML = '';
    if (!list.length) return;
    docs.append(el('h2', null, 'Your documents'), el('p', 'sub', "Letters, reports and plans about your child, all in one place. They open in Google Drive, so you'll need to be signed in to the Google account we shared them with."));
    const ul = el('ul', 'list');
    list.forEach((it, i) => {
      const isOpen = docOpen.has(i);
      const li = el('li', 'item'); li.dataset.open = String(isOpen);
      const head = el('button'); head.type = 'button'; head.id = 'doc-' + i; head.setAttribute('aria-expanded', String(isOpen));
      head.append(el('span', 'what', it.what));
      head.insertAdjacentHTML('beforeend', svg(ICONS.chev, 'chev'));
      if (it.when) head.append(el('span', 'when', it.when));
      head.addEventListener('click', () => { isOpen ? docOpen.delete(i) : docOpen.add(i); renderDocs(); document.getElementById('doc-' + i).focus(); });
      li.append(head);
      if (isOpen) {
        const d = el('div', 'detail');
        const parts = detailParts(it);
        if (!parts.length) d.append(el('p', 'donehint', "We haven't added this one yet. Ask " + LEAD + ' if you need it.'));
        parts.forEach(p => d.append(p));
        li.append(d);
      }
      ul.append(li);
    });
    docs.append(ul);
  }

  function renderJargon() {
    jargon.innerHTML = '';
    jargon.append(el('h2', null, 'Jargon buster'), el('p', 'sub', "Words you'll hear in meetings and letters, in plain English. You can also tap any word with a dotted line on this page."));
    const label = el('label', 'sr', 'Find a word'); label.htmlFor = 'jargon-find'; label.style.fontWeight = '700';
    const find = el('input'); find.id = 'jargon-find'; find.type = 'search'; find.placeholder = 'Type a word, like CPM'; find.autocomplete = 'off';
    const list = el('div', 'terms');
    const sorted = JARGON.slice().sort((a, b) => a.term.localeCompare(b.term));
    const rows = sorted.map(j => {
      const det = el('details'); det.dataset.term = j.term;
      const sum = el('summary'); sum.append(j.term); if (j.aka) { sum.append(' '); sum.append(el('span', 'aka', '(' + j.aka + ')')); }
      det.append(sum, el('p', null, j.say)); if (j.more) det.append(el('p', null, j.more));
      list.append(det); return { j, det };
    });
    const none = el('p', 'empty', "We haven't got that one yet. Ask " + LEAD + " and we'll explain."); none.hidden = true; list.append(none);
    find.addEventListener('input', () => {
      const q = find.value.trim().toLowerCase(); let shown = 0;
      rows.forEach(r => { const hit = !q || (r.j.term + ' ' + (r.j.aka || '') + ' ' + r.j.say).toLowerCase().indexOf(q) > -1; r.det.hidden = !hit; if (hit) shown++; });
      none.hidden = shown > 0;
    });
    jargonOpen = term => { find.value = ''; find.dispatchEvent(new Event('input')); const r = rows.find(x => x.j.term === term); if (r) { r.det.open = true; r.det.querySelector('summary').focus(); } };
    jargon.append(label, find, list);
  }

  function renderSkip() {
    skip.innerHTML = '';
    [['history', "What's happened", sheetItems('history').length], ['documents', 'Your documents', sheetItems('docs').filter(it => !/^nothing right now/i.test(it.what)).length], ['jargon', 'Jargon buster', 1]]
      .filter(x => x[2]).forEach(x => { const a = el('a', null, x[1]); a.href = '#' + x[0]; skip.append(a); });
  }

  function renderSupport() {
    support.innerHTML = '';
    support.append(el('h2', null, 'Other places that can help'), el('p', 'sub', 'Free and independent. Tap a name to visit their website.'));
    const dl = el('dl');
    SUPPORT.forEach(g => {
      dl.append(el('dt', null, g.group));
      const dd = el('dd');
      g.orgs.forEach(o => {
        const div = el('div', 'org');
        if (o.url) { const a = el('a', null, o.name); a.href = o.url; a.target = '_blank'; a.rel = 'noopener'; div.append(a); }
        else div.append(el('strong', null, o.name));
        div.append(el('span', null, o.note));
        dd.append(div);
      });
      dl.append(dd);
    });
    support.append(dl);
  }

  function renderFoot() {
    foot.innerHTML = '';
    const tags = el('p', 'tags');
    ['#inclusion', '#support', '#empowerment'].forEach(t => tags.append(el('span', null, t)));
    foot.append(tags, el('p', null, 'STAND exists to make Scotland a place where neurodivergent children, their families and their carers thrive. We are stronger together.'));
    const p = el('p'); const a = el('a', null, 'standuk.co.uk'); a.href = 'https://www.standuk.co.uk'; a.target = '_blank'; a.rel = 'noopener';
    p.append(a, ' · Stronger Together for Autism and Neurodivergence SCIO, SC052228');
    foot.append(p);
  }

  function renderAll() { renderCheer(); renderTiles(); renderPanel(); }
  renderAll(); renderSkip(); renderHistory(); renderDocs(); renderJargon(); renderSupport(); renderFoot();
}

(function boot() {
  if (!API) { app.textContent = 'This page is not set up yet.'; return; }
  const s = get(KEY);
  if (s) return tryCode(s, 'saved');
  const old = get(OLD_KEY);
  if (old) return tryCode(old, 'old');
  showGate(null);
})();

// Exposed for STAND's own testing only (no family data).
window.STAND_TEST = { parseMore, parseDate, countdown, dueFrom, termIn, JARGON };
})();
