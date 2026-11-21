const resume = [
  ['학력', [['2021.03 ~ 2026.08', '서강대학교 아트&테크놀로지 전공 · 융합소프트웨어 연계전공', '졸업 예정 · 4.03/4.5 | 3.73/4.3']]],
  ['경력', [['2025.03 ~ 2025.09', '서울대학교병원 의료영상정보학연구실(MediSC) 인턴'], ['2023.09 ~ 2024.01', '서강대학교 미디어아트 연구실(e.m.a. studio) 학부연구생']]],
  ['자격증', [['2026.08', '데이터 분석 준전문가(ADsP)'], ['2026.06', 'SQL 개발자(SQLD)'], ['2026.03', '컴퓨터활용능력 2급'], ['2023.03', 'GTQ 그래픽기술자격 1급'], ['2021.03', '자동차운전면허 2종보통']]],
  ['수상', [['2025.09', '2025 의료메타버스학회 Best Poster'], ['2025.01', '2025 Winter XREAL XR Hackathon 최우수상'], ['2024.01', '2024 한국 HCI 학회 Creative Awards 최우수상']]],
  ['활동', [['2026.10 ~ ing', 'Show Your World : VARCO AI 기반 게임 개발 프로젝트 (NC AI 청년 미래내일 일경험)'], ['2026.07', '넥슨 대학생 게임잼 ‘재밌넥’'], ['2024.09 ~ 2026.08', '메타버스 학회 XREAL 7기 디자이너'], ['2024.08 ~ 2025.08', 'Google Developer Groups on Campus Sogang 코어 멤버(운영진)'], ['2024.08 ~ 2025.08', '2024 Small Creators Group (푸르미르 전) 팀장'], ['2023.02 ~ 2024.01', '2023 Small Creators Group (오네이로이의 상점) 팀장']]],
  ['어학', [['2026.02', 'OPIc · Intermediate High'], ['2026.02', 'TOEIC · 925/990']]]
];
function element(tag, text) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  return node;
}
for (const [label, items] of resume) {
  const group = element('section');
  const entries = element('div');
  group.append(element('h4', label), entries);
  for (const [date, title, note] of items) {
    const row = element('p');
    const detail = element('span', title);
    if (note) detail.append(element('small', note));
    row.append(element('span', date), detail);
    entries.append(row);
  }
  document.querySelector('#history').append(group);
}
const works = projects.filter(project => project.section === 'works');
const analyses = projects.filter(project => project.section !== 'works')
  .sort((a, b) => b.date.localeCompare(a.date));
for (const project of [...works, ...analyses]) {
  const link = element('a');
  link.href = './project.html?id=' + encodeURIComponent(project.id);
  const cover = element('img');
  cover.src = project.cover || './assets/' + project.id + '.webp';
  cover.alt = '';
  cover.loading = 'lazy';
  const caption = element('div');
  caption.append(element('small', project.tags.join(' · ')), element('h3', project.title), element('p', project.subtitle));
  caption.prepend(element('time', project.date));
  const thumbnail = element('span');
  thumbnail.className = 'thumbnail';
  thumbnail.append(cover);
  link.append(thumbnail, caption);
  document.querySelector(project.section === 'works' ? '#work-cards' : '#analysis-cards').append(link);
}
const workCards = document.querySelector('#work-cards');
if (!workCards.childElementCount) {
  workCards.append(element('p', '작업물을 준비하고 있습니다.'));
}
const opening = document.querySelector('.opening');
const scene = document.querySelector('#intro');
const menu = [...document.querySelectorAll('.rail a')];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const sections = menu.map(link => document.querySelector(link.hash));
let nextFrame = 0;
function paintScroll() {
  nextFrame = 0;
  const travel = opening.offsetHeight - scene.offsetHeight;
  const progress = travel > 0 ? Math.min(1, Math.max(0, -opening.getBoundingClientRect().top / travel)) : 0;
  const zoom = reducedMotion.matches ? 0 : progress;
  scene.style.setProperty('--depth', zoom);
  for (const section of sections) {
    const { top, bottom } = section.getBoundingClientRect();
    const entrance = Math.min(1, Math.max(0, (innerHeight * 0.68 - top) / (innerHeight * 0.5)));
    const exit = Math.min(1, Math.max(0, (bottom - innerHeight * 0.68) / (innerHeight * 0.32)));
    const visibility = reducedMotion.matches ? 1 : Math.min(entrance, section.id === 'analysis' ? 1 : exit);
    section.style.setProperty('--visibility', visibility);
  }
  const active = sections.filter(section => section.getBoundingClientRect().top < innerHeight * 0.55).pop();
  menu.forEach(link => {
    if (link.hash === '#' + active?.id) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
function schedulePaint() {
  if (!nextFrame) nextFrame = requestAnimationFrame(paintScroll);
}
window.addEventListener('scroll', schedulePaint, { passive: true });
window.addEventListener('resize', schedulePaint);
reducedMotion.addEventListener('change', schedulePaint);
paintScroll();

