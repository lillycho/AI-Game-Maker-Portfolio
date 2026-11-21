const id = new URLSearchParams(location.search).get('id');
const project = projects.find(item => item.id === id);
if (project) {
  document.title = project.title + ' · 조윤빈';
  const heading = document.querySelector('#case-name');
  heading.textContent = project.title;
  const titleText = document.createRange();
  titleText.selectNodeContents(heading);
  function fitTitle() {
    heading.style.removeProperty('--fit-size');
    const width = titleText.getBoundingClientRect().width;
    if (width > heading.clientWidth) {
      const size = parseFloat(getComputedStyle(heading).fontSize);
      heading.style.setProperty('--fit-size', (size * (heading.clientWidth - 1) / width) + 'px');
    }
  }
  fitTitle();
  window.addEventListener('resize', fitTitle);
  document.fonts.ready.then(fitTitle);
  document.querySelector('.case-meta').textContent = [...project.tags, project.date].join('  /  ');
  document.querySelector('.case-description').textContent = project.subtitle;
  if (project.demo) {
    const demo = document.createElement('a');
    demo.className = 'case-demo';
    demo.href = project.demo.url;
    demo.textContent = project.demo.label;
    document.querySelector('.case-intro').append(demo);
  }
  for (const link of document.querySelectorAll('.back')) {
    link.href = './index.html#' + project.section;
    link.setAttribute('aria-label', (project.section === 'works' ? 'Works' : 'Analysis') + ' 목록으로');
  }
  const pages = document.querySelector('#pages');
  for (const [index, page] of project.pages.entries()) {
    const image = document.createElement('img');
    image.src = page.src;
    image.alt = project.title + ' 문서 ' + (index + 1) + '쪽';
    image.width = page.width;
    image.height = page.height;
    image.loading = index === 0 ? 'eager' : 'lazy';
    pages.append(image);
  }
  const original = document.createElement('a');
  original.href = project.pdf || './files/' + project.id + '.pdf';
  original.download = project.title + '.pdf';
  original.textContent = '원본 PDF 다운로드';
  document.querySelector('.case-end').append(original);
}
