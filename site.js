(() => {
  'use strict';

  const lessons = [
    { id: '00-course-orientation', number: '00', title: 'How to use this course', summary: 'Navigate the course, pick a learning path, and practice deliberately.', group: 'Foundations', duration: '5 min', tags: 'start beginner learning path' },
    { id: '01-mental-models', number: '01', title: 'System design mental models', summary: 'Boundaries, bottlenecks, request paths, coupling, and trade-offs.', group: 'Foundations', duration: '12 min', tags: 'architecture latency throughput Little law coupling' },
    { id: '02-requirements-and-estimates', number: '02', title: 'Requirements & estimates', summary: 'Translate product needs into measurable targets and realistic workloads.', group: 'Foundations', duration: '15 min', tags: 'capacity estimate rps storage bandwidth workload' },
    { id: '03-api-and-data-design', number: '03', title: 'API & data design', summary: 'Contracts, invariants, transactions, pagination, and safe retries.', group: 'Foundations', duration: '16 min', tags: 'api database schema sql transactions consistency idempotency' },
    { id: '04-scaling-and-caching', number: '04', title: 'Scaling & caching', summary: 'Load balancing, cache policies, read/write growth, and bottlenecks.', group: 'Architecture', duration: '16 min', tags: 'scale cache redis replica load balancer hot key' },
    { id: '05-distributed-systems', number: '05', title: 'Distributed systems', summary: 'Replication, partitions, ordering, consistency, and uncertain networks.', group: 'Architecture', duration: '17 min', tags: 'replication sharding cap quorum leader consistency partition' },
    { id: '06-reliability', number: '06', title: 'Reliability & fault tolerance', summary: 'SLOs, deadlines, circuit breakers, failure domains, and recovery.', group: 'Architecture', duration: '15 min', tags: 'availability reliability slo sla error budget circuit breaker rpo rto' },
    { id: '07-queues-and-events', number: '07', title: 'Queues & event-driven design', summary: 'Outbox, delivery semantics, ordering, backlog, and replay.', group: 'Architecture', duration: '16 min', tags: 'queue kafka event outbox async pubsub retry dead letter' },
    { id: '08-security-observability', number: '08', title: 'Security & observability', summary: 'Threat models, authorization boundaries, metrics, logs, and traces.', group: 'Practice', duration: '16 min', tags: 'security authentication authorization observability tracing metrics logs stride' },
    { id: '09-design-interview', number: '09', title: 'The design interview', summary: 'A repeatable way to clarify, model, draw, and explain a system.', group: 'Practice', duration: '12 min', tags: 'interview communication system design template' },
    { id: '10-storage-systems', number: '10', title: 'Storage systems', summary: 'Choose storage models from data shape, queries, and lifecycle needs.', group: 'Deep dives', duration: '18 min', tags: 'database sql nosql object storage search analytics index data store' },
    { id: '11-networking-and-edge', number: '11', title: 'Networking & the edge', summary: 'DNS, TLS, CDNs, proxies, connection pools, and long-lived links.', group: 'Deep dives', duration: '16 min', tags: 'network dns tls cdn edge http load balancer connection pool' },
    { id: '12-architecture-evolution', number: '12', title: 'Architecture evolution', summary: 'Modular systems, service boundaries, safe migrations, and multi-region.', group: 'Deep dives', duration: '18 min', tags: 'migration microservices monolith strangler expand contract multi region' },
    { id: '13-search-and-recommendations', number: '13', title: 'Search & recommendations', summary: 'Indexing, retrieval, ranking, freshness, and safe discovery.', group: 'Applied systems', duration: '20 min', tags: 'search recommendation inverted index autocomplete typeahead ranking vector retrieval' },
    { id: '14-data-pipelines', number: '14', title: 'Data pipelines & stream processing', summary: 'Batch and stream workflows, event time, replay, and checkpoints.', group: 'Applied systems', duration: '20 min', tags: 'data pipeline stream batch kafka watermark window event time replay schema' },
    { id: '15-cost-and-performance', number: '15', title: 'Cost, capacity & performance', summary: 'Model resource demand, measure tail latency, and optimize cost.', group: 'Applied systems', duration: '18 min', tags: 'cost capacity performance load testing latency utilization throughput bandwidth' },
  ];

  const caseStudies = [
    { id: 'url-shortener', title: 'URL shortener', icon: '↗', summary: 'Key generation, redirects, hot keys, abuse, and cache behavior.', tags: 'short url redirect hash id generation cache' },
    { id: 'news-feed', title: 'News feed', icon: '▤', summary: 'Fan-out strategies, ranking, freshness, and privacy checks.', tags: 'feed social fanout ranking celebrity' },
    { id: 'real-time-chat', title: 'Real-time chat', icon: '◌', summary: 'Conversation ordering, delivery states, presence, and reconnects.', tags: 'chat websocket message delivery realtime' },
    { id: 'video-streaming', title: 'Video streaming', icon: '▷', summary: 'Ingest, transcode, adapt quality, and serve video through CDNs.', tags: 'video netflix youtube streaming transcoding adaptive bitrate cdn' },
    { id: 'ride-hailing', title: 'Ride-hailing match', icon: '⌖', summary: 'Geospatial search, driver freshness, dispatch, and exclusive matching.', tags: 'uber ride driver location geo geohash dispatch' },
    { id: 'file-sync', title: 'Cloud file sync', icon: '↔', summary: 'Chunked transfers, offline changes, sharing, and version conflicts.', tags: 'dropbox drive file storage sync chunks offline conflict' },
    { id: 'rate-limiter', title: 'Distributed rate limiter', icon: '◴', summary: 'Token buckets, quotas, distributed counters, and outage policy.', tags: 'rate limit token bucket sliding window quota throttling' },
    { id: 'web-crawler', title: 'Web crawler', icon: '⌕', summary: 'Frontier scheduling, politeness, deduplication, and safe fetching.', tags: 'google crawler robots txt web search frontier deduplication indexing' },
    { id: 'ticket-reservations', title: 'Ticket reservations', icon: '▣', summary: 'Waiting rooms, expiring holds, inventory correctness, and payment recovery.', tags: 'ticketmaster ticket booking seats flash sale inventory hold oversell queue' },
    { id: 'payment-ledger', title: 'Payment ledger', icon: '¤', summary: 'Idempotent charges, balanced entries, webhooks, and reconciliation.', tags: 'payment stripe ledger wallet idempotency refund webhook accounting' },
    { id: 'notification-system', title: 'Notification system', icon: '✉', summary: 'Preferences, channel providers, prioritization, and reliable delivery.', tags: 'notification email sms push fanout provider consent retry' },
  ];
  const courseIntroVideo = 'https://docs.google.com/videos/d/15kJjGC8OyHCujioJoT_r3xM69kETwXy85pg1QYZWatI/play?usp=sharing';

  const routeSpecs = [
    ...lessons.map(item => ({ type: 'lesson', id: item.id, title: `${item.number} · ${item.title}`, description: item.summary, tags: item.tags, path: `lessons/${item.id}.md` })),
    ...caseStudies.map(item => ({ type: 'case', id: item.id, title: item.title, description: item.summary, tags: item.tags, path: `case-studies/${item.id}.md` })),
    { type: 'page', id: 'questions', title: 'System design interview question bank', description: 'Publicly reported company-oriented prompts, canonical problems, and interviewer follow-ups.', tags: 'google meta amazon netflix uber dropbox microsoft interview question faang prompt', path: 'INTERVIEW_QUESTION_BANK.md' },
    { type: 'page', id: 'labs', title: 'Practice labs & capstone', description: 'Ten progressive exercises and a complete design challenge.', tags: 'practice exercise capstone project', path: 'labs/README.md' },
    { type: 'page', id: 'glossary', title: 'System design glossary', description: 'Concise definitions and common misconceptions.', tags: 'terms definitions vocabulary', path: 'GLOSSARY.md' },
    { type: 'page', id: 'template', title: 'Design review template', description: 'A structured notebook for your next system design.', tags: 'template worksheet design review', path: 'templates/design-review.md' },
    { type: 'page', id: 'contributing', title: 'Contributing guide', description: 'Help improve the open course.', tags: 'contribute open source', path: 'CONTRIBUTING.md' },
  ];

  const page = document.getElementById('page-content');
  const toc = document.getElementById('page-toc');
  const nav = document.getElementById('course-nav');
  const searchOverlay = document.getElementById('search-overlay');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const cache = new Map();
  const progressKey = 'system-design-course-progress-v1';
  let completed = loadProgress();
  let searchCorpus = null;
  let searchCorpusPromise = null;
  let searchSelection = 0;
  let activeSearchResults = [];
  let currentRoute = { type: 'home' };

  if (window.mermaid) {
    window.mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'strict',
      fontFamily: 'DM Sans, system-ui, sans-serif',
      themeVariables: {
        darkMode: true,
        background: '#0b131c',
        primaryColor: '#142b31',
        primaryTextColor: '#dce9ed',
        primaryBorderColor: '#428b82',
        lineColor: '#67cdbd',
        secondaryColor: '#1b2031',
        tertiaryColor: '#13222c',
        clusterBkg: '#0e1922',
        clusterBorder: '#304653',
        edgeLabelBackground: '#101923',
        fontSize: '13px',
        noteBkgColor: '#1b2631',
        noteTextColor: '#c4d4db',
        actorBkg: '#15252c',
        actorBorder: '#538f87',
        actorTextColor: '#e0eeef',
        signalColor: '#67cdbd',
        signalTextColor: '#d6e4e8',
        labelBoxBkgColor: '#101923',
        labelBoxBorderColor: '#334854',
        labelTextColor: '#cfdee4',
        loopTextColor: '#cfdee4',
        activationBkgColor: '#1a3c3a',
        activationBorderColor: '#54b7aa',
      },
    });
  }

  function loadProgress() {
    try {
      const values = JSON.parse(localStorage.getItem(progressKey) || '[]');
      return new Set(Array.isArray(values) ? values : []);
    } catch (_) {
      return new Set();
    }
  }

  function saveProgress() {
    try { localStorage.setItem(progressKey, JSON.stringify([...completed])); } catch (_) { /* Private browsing may disable storage. */ }
    updateProgress();
    renderNavigation();
  }

  function updateProgress() {
    const count = lessons.filter(item => completed.has(item.id)).length;
    const label = document.getElementById('progress-label');
    const fill = document.getElementById('progress-fill');
    const bar = document.getElementById('progress-bar');
    const caption = document.getElementById('progress-caption');
    if (label) label.textContent = `${count} / ${lessons.length}`;
    if (fill) fill.style.width = `${(count / lessons.length) * 100}%`;
    if (bar) {
      bar.setAttribute('aria-valuemax', String(lessons.length));
      bar.setAttribute('aria-valuenow', String(count));
    }
    if (caption) caption.textContent = count === 0 ? 'A little learning, one lesson at a time.' : count === lessons.length ? 'Course complete. Keep designing.' : 'Your progress is saved on this device.';
    document.querySelectorAll('[data-progress-count]').forEach(el => { el.textContent = String(count); });
  }

  function renderNavigation() {
    const groups = [...new Set(lessons.map(item => item.group))];
    nav.innerHTML = groups.map(group => {
      const items = lessons.filter(item => item.group === group);
      return `<div class="nav-section-label">${escapeHtml(group)}</div>${items.map(item => {
        const active = currentRoute.type === 'lesson' && currentRoute.id === item.id;
        return `<a class="nav-link${active ? ' active' : ''}" href="${routeHref('lesson', item.id)}" data-route="lesson:${item.id}"${active ? ' aria-current="page"' : ''}>
          <span class="nav-number">${item.number}</span><span>${escapeHtml(item.title)}</span>${completed.has(item.id) ? '<span class="nav-check" aria-label="Complete">✓</span>' : ''}
        </a>`;
      }).join('')}`;
    }).join('');
    updateProgress();
  }

  function baseUrl() { return new URL('./', document.baseURI); }
  function routeHref(type, id = '') {
    const url = baseUrl();
    if (type === 'home') return url.pathname;
    const key = type === 'case' ? 'case' : type === 'page' ? 'page' : 'lesson';
    url.searchParams.set(key, id);
    return `${url.pathname}${url.search}`;
  }

  function getRouteFromUrl() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('lesson')) return { type: 'lesson', id: params.get('lesson') };
    if (params.has('case')) return { type: 'case', id: params.get('case') };
    if (params.has('page')) return { type: 'page', id: params.get('page') };
    if (params.has('document')) return { type: 'document', id: params.get('document') };
    return { type: 'home' };
  }

  function setUrl(route, replace = false) {
    const url = new URL(window.location.href);
    url.search = '';
    url.hash = '';
    if (route.type === 'lesson') url.searchParams.set('lesson', route.id);
    else if (route.type === 'case') url.searchParams.set('case', route.id);
    else if (route.type === 'page') url.searchParams.set('page', route.id);
    else if (route.type === 'document') url.searchParams.set('document', route.id);
    window.history[replace ? 'replaceState' : 'pushState']({ route }, '', `${url.pathname}${url.search}${route.hash || ''}`);
  }

  function navigate(route, options = {}) {
    currentRoute = route;
    if (options.updateUrl !== false) setUrl(route, options.replace === true);
    closeSidebar();
    renderRoute().then(() => {
      if (route.hash) {
        const target = document.getElementById(decodeURIComponent(route.hash.slice(1)));
        if (target) target.scrollIntoView({ block: 'start' });
      } else if (!options.keepScroll) {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    });
  }

  async function fetchMarkdown(path) {
    if (cache.has(path)) return cache.get(path);
    const url = new URL(path, baseUrl());
    const response = await fetch(url, { headers: { Accept: 'text/markdown, text/plain;q=0.9' } });
    if (!response.ok) throw new Error(`Could not load ${path} (${response.status})`);
    const text = await response.text();
    cache.set(path, text);
    return text;
  }

  function extractTitle(markdown, fallback) {
    const match = markdown.match(/^#\s+(.+)$/m);
    return match ? match[1].replace(/\s+/g, ' ').trim() : fallback;
  }

  function markdownToHtml(markdown) {
    if (!window.marked || !window.DOMPurify) {
      return `<div class="content-warning">The lesson renderer could not load. The Markdown source is still available in the <a href="https://github.com/RDrahul123/System-Design" target="_blank" rel="noreferrer">GitHub repository</a>.</div><pre><code>${escapeHtml(markdown)}</code></pre>`;
    }
    const html = window.marked.parse(markdown, { gfm: true, breaks: false });
    return window.DOMPurify.sanitize(html, { ADD_TAGS: ['details', 'summary'], ADD_ATTR: ['target', 'rel'] });
  }

  function renderDiagrams(container) {
    const codeBlocks = [...container.querySelectorAll('pre > code.language-mermaid')];
    for (const code of codeBlocks) {
      const holder = document.createElement('div');
      holder.className = 'mermaid';
      holder.textContent = code.textContent;
      code.parentElement.replaceWith(holder);
    }
    if (window.mermaid && codeBlocks.length) {
      window.mermaid.run({ nodes: [...container.querySelectorAll('.mermaid')] }).catch(error => {
        console.warn('A course diagram could not be rendered:', error);
        container.querySelectorAll('.mermaid').forEach(node => {
          const source = node.textContent;
          node.innerHTML = `<pre class="diagram-fallback"><code>${escapeHtml(source)}</code></pre><p class="diagram-error">Diagram preview unavailable. The diagram source is shown above.</p>`;
        });
      });
    }
  }

  function routeMarkdownLinks(container, sourcePath) {
    const sourceUrl = new URL(sourcePath, baseUrl());
    container.querySelectorAll('a[href]').forEach(anchor => {
      const raw = anchor.getAttribute('href');
      if (!raw || raw.startsWith('#') || /^(?:mailto:|tel:|https?:|data:)/i.test(raw)) return;
      try {
        const target = new URL(raw, sourceUrl);
        if (target.origin !== window.location.origin || !target.pathname.startsWith(baseUrl().pathname)) return;
        const repoPath = decodeURIComponent(target.pathname.slice(baseUrl().pathname.length));
        const route = routeForMarkdownPath(repoPath);
        if (!route) {
          anchor.href = target.href;
          return;
        }
        anchor.href = routeHref(route.type, route.id) + target.hash;
        anchor.dataset.route = `${route.type}:${route.id}`;
        if (target.hash) anchor.dataset.hash = target.hash;
      } catch (_) { /* Leave malformed/unsupported links as authored. */ }
    });
    container.querySelectorAll('img[src]').forEach(image => {
      const raw = image.getAttribute('src');
      if (!raw || /^(?:https?:|data:)/i.test(raw)) return;
      try { image.src = new URL(raw, sourceUrl).href; } catch (_) { /* Preserve the authored URL. */ }
    });
  }

  function routeForMarkdownPath(path) {
    const clean = path.replace(/^\.\//, '').replace(/\/$/, '');
    if (clean === 'README.md' || clean === '') return { type: 'home', id: '' };
    const lessonMatch = clean.match(/^lessons\/([\w-]+)\.md$/);
    if (lessonMatch) return { type: 'lesson', id: lessonMatch[1] };
    const caseMatch = clean.match(/^case-studies\/([\w-]+)\.md$/);
    if (caseMatch && caseMatch[1] !== 'README') return { type: 'case', id: caseMatch[1] };
    if (clean === 'case-studies/README.md') return { type: 'page', id: 'case-studies' };
    if (clean === 'labs/README.md') return { type: 'page', id: 'labs' };
    if (clean === 'GLOSSARY.md') return { type: 'page', id: 'glossary' };
    if (clean === 'INTERVIEW_QUESTION_BANK.md') return { type: 'page', id: 'questions' };
    if (clean === 'templates/design-review.md') return { type: 'page', id: 'template' };
    if (/^(?:CONTRIBUTING|LICENSE)\.md?$/.test(clean)) return { type: 'document', id: clean };
    return null;
  }

  function makeToc(container) {
    const headings = [...container.querySelectorAll('h2, h3')];
    if (!headings.length) {
      toc.hidden = true;
      toc.innerHTML = '';
      return;
    }
    toc.hidden = false;
    toc.innerHTML = `<div class="toc-title">On this page</div>${headings.map(h => `<a class="toc-link level-${h.tagName === 'H3' ? '3' : '2'}" href="#${escapeAttr(h.id)}">${escapeHtml(h.textContent)}</a>`).join('')}`;
    toc.querySelectorAll('a').forEach(link => link.addEventListener('click', event => {
      event.preventDefault();
      const id = decodeURIComponent(link.hash.slice(1));
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(history.state, '', `${location.pathname}${location.search}#${link.hash.slice(1)}`);
    }));
  }

  function readingHeader(number, title, summary, duration, kind = 'LESSON') {
    return `<div class="reading-kicker"><span class="lesson-tag">${escapeHtml(number)}</span><span>${escapeHtml(kind)}</span></div>
      <h1 class="reading-title">${escapeHtml(title)}</h1>
      <p class="reading-summary">${escapeHtml(summary || '')}</p>
      <div class="reading-meta"><span><i class="meta-dot"></i>${escapeHtml(duration || 'Self-paced')}</span><span>Visual walkthrough</span><span>Knowledge check</span></div>
      <div class="reading-divider"></div>`;
  }

  async function renderLesson(item) {
    page.innerHTML = `<div class="loading-state"><span class="loading-orbit"></span><p>Loading lesson ${item.number}…</p></div>`;
    const markdown = await fetchMarkdown(`lessons/${item.id}.md`);
    const body = document.createElement('div');
    body.className = 'article-body';
    body.innerHTML = markdownToHtml(markdown);
    routeMarkdownLinks(body, `lessons/${item.id}.md`);
    page.innerHTML = `<div class="reading-page"><div class="breadcrumbs"><a href="${routeHref('home')}" data-route="home">Course home</a><span class="breadcrumb-separator">/</span><span>${escapeHtml(item.group)}</span></div>
      ${readingHeader(item.number, item.title, item.summary, item.duration)}
      <div class="article-slot"></div>
      <div class="article-end"><button class="mark-complete${completed.has(item.id) ? ' done' : ''}" type="button" data-complete="${item.id}" aria-pressed="${completed.has(item.id)}"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3 8 3.1 3.1L13 4.5"/></svg><span>${completed.has(item.id) ? 'Lesson completed' : 'Mark lesson complete'}</span></button><a class="article-next" href="${nextLesson(item.id) ? routeHref('lesson', nextLesson(item.id).id) : routeHref('case', 'url-shortener')}" data-route="${nextLesson(item.id) ? `lesson:${nextLesson(item.id).id}` : 'case:url-shortener'}">${nextLesson(item.id) ? `Next: ${escapeHtml(nextLesson(item.id).title)} →` : 'Start a case study →'}</a></div>
      ${renderPrevNext(item.id)}
    </div>`;
    page.querySelector('.article-slot').replaceWith(body);
    makeToc(body);
    renderDiagrams(body);
    document.title = `${item.number} · ${item.title} — System Design`;
  }

  function nextLesson(id) {
    const index = lessons.findIndex(item => item.id === id);
    return index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : null;
  }

  function renderPrevNext(id) {
    const index = lessons.findIndex(item => item.id === id);
    const previous = index > 0 ? lessons[index - 1] : null;
    const next = index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : null;
    return `<div class="article-nav-bottom">${previous ? `<a class="article-nav-card" href="${routeHref('lesson', previous.id)}" data-route="lesson:${previous.id}"><span>← Previous lesson</span><strong>${previous.number} · ${escapeHtml(previous.title)}</strong></a>` : '<span></span>'}${next ? `<a class="article-nav-card next" href="${routeHref('lesson', next.id)}" data-route="lesson:${next.id}"><span>Next lesson →</span><strong>${next.number} · ${escapeHtml(next.title)}</strong></a>` : `<a class="article-nav-card next" href="${routeHref('case', 'url-shortener')}" data-route="case:url-shortener"><span>Next →</span><strong>Worked case studies</strong></a>`}</div>`;
  }

  function renderHome() {
    toc.hidden = true;
    toc.innerHTML = '';
    const count = completed.size;
    page.innerHTML = `<div class="home-page">
      <section class="hero-panel">
        <div class="hero-glow" aria-hidden="true"></div>
        <div class="hero-copy">
          <div class="hero-kicker"><span></span> A visual, open-source course</div>
          <h1 class="hero-title">Design systems<br />that <span class="accent">make sense.</span></h1>
          <p class="hero-intro">Go from first principles to production trade-offs. Learn to reason about scale, data, and failure—with diagrams that show how the pieces connect.</p>
          <div class="hero-actions"><a class="button-primary" href="${courseIntroVideo}" target="_blank" rel="noopener noreferrer">Watch course introduction <span aria-hidden="true">↗</span></a><a class="button-secondary" href="${routeHref('lesson', '00-course-orientation')}" data-route="lesson:00-course-orientation">Start Lesson 00</a></div>
          <div class="hero-stats"><div class="hero-stat"><strong>16</strong><span>guided lessons</span></div><div class="hero-stat"><strong>40+</strong><span>visual diagrams</span></div><div class="hero-stat"><strong>11</strong><span>worked case studies</span></div><div class="hero-stat"><strong>Free</strong><span>and open-source</span></div></div>
        </div>
        <div class="hero-art" aria-hidden="true"><img src="./assets/hero-architecture.svg" alt="" /></div>
      </section>

      <section class="intro-video-card" aria-label="Course introduction video">
        <a class="intro-video-link" href="${courseIntroVideo}" target="_blank" rel="noopener noreferrer" aria-label="Watch System Design From First Principles — A Learner’s Roadmap in Google Vids">
          <span class="video-grid-art" aria-hidden="true"></span><span class="video-eyebrow">THE COURSE ROADMAP</span><span class="video-play"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 10 6-10 6z"/></svg></span><span class="video-link-label">WATCH ON GOOGLE VIDS <span>↗</span></span>
        </a>
        <div class="intro-video-copy"><span class="section-overline">Start here · course introduction</span><h2>See the learning path before you begin.</h2><p>A short roadmap to the course: what system design means, how the lessons fit together, and how to get the most from the examples.</p><a href="${courseIntroVideo}" target="_blank" rel="noopener noreferrer">Watch “A Learner’s Roadmap” in Google Vids <span>↗</span></a></div>
      </section>

      <section class="section-block" aria-labelledby="curriculum-title">
        <div class="section-heading"><div><span class="section-overline">The learning path</span><h2 id="curriculum-title">Build the mental model</h2><p>Follow the sequence, or jump to the topic you need.</p></div><a class="text-link" href="${routeHref('lesson', '00-course-orientation')}" data-route="lesson:00-course-orientation">How to use this course <span>↗</span></a></div>
        <div class="curriculum-grid">${lessons.map(item => `<a class="lesson-card${completed.has(item.id) ? ' complete' : ''}" href="${routeHref('lesson', item.id)}" data-route="lesson:${item.id}"><span class="lesson-card-number">${item.number}</span><span class="lesson-card-copy"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.summary)}</span></span><span class="lesson-card-arrow" aria-hidden="true">↗</span></a>`).join('')}</div>
      </section>

      <section class="section-block" aria-labelledby="case-title">
        <div class="section-heading"><div><span class="section-overline">Learn by taking systems apart</span><h2 id="case-title">Eleven end-to-end designs</h2><p>Practice product, infrastructure, real-time, and data-intensive systems.</p></div><a class="text-link" href="${routeHref('page', 'case-studies')}" data-route="page:case-studies">All case studies <span>↗</span></a></div>
        <div class="case-grid">${caseStudies.map(item => `<a class="case-card" href="${routeHref('case', item.id)}" data-route="case:${item.id}"><span class="case-icon" aria-hidden="true">${item.icon}</span><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.summary)}</p><span class="case-open"><span>WORKED DESIGN</span><span>Read case →</span></span></a>`).join('')}</div>
      </section>

      <section class="section-block"><div class="study-banner"><div><h3>Preparing for a system design interview?</h3><p>Browse canonical prompts, public company-associated examples, the concepts each tests, and 20 high-signal follow-up questions.</p></div><a class="button-primary" href="${routeHref('page', 'questions')}" data-route="page:questions">Open question bank <span>→</span></a></div></section>

      <section class="section-block">
        <div class="study-banner"><div><h3>Turn concepts into design practice</h3><p>Work through progressive exercises, then design a collaborative document system using the course’s reusable review template.</p></div><a class="button-primary" href="${routeHref('page', 'labs')}" data-route="page:labs">Open labs <span>→</span></a></div>
      </section>

      <section class="section-block" aria-labelledby="principles-title">
        <div class="section-heading"><div><span class="section-overline">The course philosophy</span><h2 id="principles-title">A few principles to keep close</h2></div></div>
        <div class="home-principles"><div class="principle-card"><span>01 / START SIMPLE</span><strong>Requirements before components.</strong><p>Choose infrastructure because a named need calls for it—not because a diagram has an empty box.</p></div><div class="principle-card"><span>02 / MAKE IT EXPLICIT</span><strong>Every trade-off has a cost.</strong><p>Latency, freshness, durability, complexity, and cost all compete. Say which one matters here.</p></div><div class="principle-card"><span>03 / DESIGN FOR CHANGE</span><strong>Failure is part of the flow.</strong><p>Retries, recovery, migration, and observability belong in the design—not in the footnotes.</p></div></div>
      </section>
      <p class="home-progress-note">${count ? `You have completed <strong>${count}</strong> of ${lessons.length} lessons on this device.` : 'Your course progress is saved privately in this browser when you mark a lesson complete.'}</p>
    </div>`;
    document.title = 'System Design — From First Principles';
  }

  const supportPages = {
    labs: { title: 'Practice labs & capstone', path: 'labs/README.md', description: 'Build confidence by turning each idea into a concrete design artifact.' },
    glossary: { title: 'System design glossary', path: 'GLOSSARY.md', description: 'A shared vocabulary for the trade-offs, guarantees, and failure modes in this course.' },
    template: { title: 'Design review template', path: 'templates/design-review.md', description: 'A reusable notebook for requirements, workload, architecture, decisions, and risks.' },
    contributing: { title: 'Contributing guide', path: 'CONTRIBUTING.md', description: 'Help improve this open, vendor-neutral course.' },
    'case-studies': { title: 'Worked system design case studies', path: 'case-studies/README.md', description: 'Compare eleven architecture walkthroughs across product, infrastructure, media, marketplace, storage, and transactional systems.' },
    questions: { title: 'System design interview question bank', path: 'INTERVIEW_QUESTION_BANK.md', description: 'Practice canonical prompts and company-associated examples from public interview-preparation material, with attribution caveats and follow-up questions.' },
  };

  async function renderSupport(id) {
    const item = supportPages[id];
    if (!item) return renderNotFound();
    page.innerHTML = `<div class="loading-state"><span class="loading-orbit"></span><p>Loading ${escapeHtml(item.title)}…</p></div>`;
    const markdown = await fetchMarkdown(item.path);
    const body = document.createElement('div');
    body.className = 'article-body';
    body.innerHTML = markdownToHtml(markdown);
    routeMarkdownLinks(body, item.path);
    page.innerHTML = `<div class="reading-page"><div class="breadcrumbs"><a href="${routeHref('home')}" data-route="home">Course home</a><span class="breadcrumb-separator">/</span><span>Course resources</span></div>${readingHeader('REFERENCE', item.title, item.description, 'Read and practice', 'RESOURCE')}<div class="article-slot"></div></div>`;
    page.querySelector('.article-slot').replaceWith(body);
    makeToc(body);
    renderDiagrams(body);
    document.title = `${item.title} — System Design`;
  }

  async function renderDocument(path) {
    if (!/^(?:CONTRIBUTING|LICENSE)\.md?$/.test(path)) return renderNotFound();
    const markdown = await fetchMarkdown(path);
    const title = extractTitle(markdown, path.replace(/\.md?$/, ''));
    const body = document.createElement('div');
    body.className = 'article-body';
    body.innerHTML = markdownToHtml(markdown);
    routeMarkdownLinks(body, path);
    page.innerHTML = `<div class="reading-page"><div class="breadcrumbs"><a href="${routeHref('home')}" data-route="home">Course home</a><span class="breadcrumb-separator">/</span><span>Repository</span></div>${readingHeader('REFERENCE', title, '', 'Reference', 'REPOSITORY')}<div class="article-slot"></div></div>`;
    page.querySelector('.article-slot').replaceWith(body);
    makeToc(body);
    document.title = `${title} — System Design`;
  }

  function renderNotFound() {
    toc.hidden = true;
    page.innerHTML = `<section class="not-found"><span class="eyebrow">NOT FOUND</span><h1>This page wandered off the architecture diagram.</h1><p class="reading-summary">The requested lesson or resource does not exist. Return to the course map and choose another path.</p><p><a class="button-primary" href="${routeHref('home')}" data-route="home">Back to course home →</a></p></section>`;
    document.title = 'Page not found — System Design';
  }

  async function renderRoute() {
    page.setAttribute('aria-busy', 'true');
    renderNavigation();
    try {
      if (currentRoute.type === 'home') renderHome();
      else if (currentRoute.type === 'lesson') {
        const item = lessons.find(row => row.id === currentRoute.id);
        item ? await renderLesson(item) : renderNotFound();
      } else if (currentRoute.type === 'case') {
        const item = caseStudies.find(row => row.id === currentRoute.id);
        if (!item) renderNotFound();
        else {
          const markdown = await fetchMarkdown(`case-studies/${item.id}.md`);
          const body = document.createElement('div');
          body.className = 'article-body';
          body.innerHTML = markdownToHtml(markdown);
          routeMarkdownLinks(body, `case-studies/${item.id}.md`);
          page.innerHTML = `<div class="reading-page"><div class="breadcrumbs"><a href="${routeHref('home')}" data-route="home">Course home</a><span class="breadcrumb-separator">/</span><a href="${routeHref('page', 'case-studies')}" data-route="page:case-studies">Case studies</a></div>${readingHeader('CASE STUDY', item.title, item.summary, 'Worked architecture', 'CASE STUDY')}<div class="article-slot"></div><div class="article-end"><a class="article-next" href="${routeHref('page', 'labs')}" data-route="page:labs">Practice with a lab →</a></div></div>`;
          page.querySelector('.article-slot').replaceWith(body);
          makeToc(body);
          renderDiagrams(body);
          document.title = `${item.title} case study — System Design`;
        }
      } else if (currentRoute.type === 'page') await renderSupport(currentRoute.id);
      else if (currentRoute.type === 'document') await renderDocument(currentRoute.id);
      else renderNotFound();
    } catch (error) {
      console.error(error);
      toc.hidden = true;
      page.innerHTML = `<section class="not-found"><span class="eyebrow">COULD NOT LOAD CONTENT</span><h1>The lesson did not arrive.</h1><p class="reading-summary">Check your connection and try again. The Markdown source is available in the <a href="https://github.com/RDrahul123/System-Design" target="_blank" rel="noreferrer">GitHub repository</a>.</p><button class="button-secondary" type="button" id="retry-render">Retry lesson</button></section>`;
      document.getElementById('retry-render')?.addEventListener('click', () => renderRoute());
      document.title = 'Unable to load — System Design';
    } finally {
      page.setAttribute('aria-busy', 'false');
    }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  }
  function escapeAttr(value) { return escapeHtml(value); }

  function openSidebar() {
    document.getElementById('course-sidebar').classList.add('open');
    document.getElementById('sidebar-backdrop').hidden = false;
    document.getElementById('menu-toggle').setAttribute('aria-expanded', 'true');
    document.getElementById('menu-toggle').setAttribute('aria-label', 'Close course navigation');
    document.body.classList.add('nav-open');
  }
  function closeSidebar() {
    document.getElementById('course-sidebar').classList.remove('open');
    document.getElementById('sidebar-backdrop').hidden = true;
    document.getElementById('menu-toggle').setAttribute('aria-expanded', 'false');
    document.getElementById('menu-toggle').setAttribute('aria-label', 'Open course navigation');
    document.body.classList.remove('nav-open');
  }

  document.getElementById('menu-toggle').addEventListener('click', () => {
    document.getElementById('course-sidebar').classList.contains('open') ? closeSidebar() : openSidebar();
  });
  document.getElementById('sidebar-backdrop').addEventListener('click', closeSidebar);

  document.addEventListener('click', event => {
    const completeButton = event.target.closest('[data-complete]');
    if (completeButton) {
      const id = completeButton.dataset.complete;
      completed.has(id) ? completed.delete(id) : completed.add(id);
      saveProgress();
      completeButton.classList.toggle('done', completed.has(id));
      completeButton.setAttribute('aria-pressed', String(completed.has(id)));
      completeButton.querySelector('span').textContent = completed.has(id) ? 'Lesson completed' : 'Mark lesson complete';
      return;
    }
    const routeLink = event.target.closest('[data-route]');
    if (!routeLink || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const [type, ...parts] = routeLink.dataset.route.split(':');
    const id = parts.join(':');
    const route = type === 'home' ? { type: 'home' } : { type, id };
    if (routeLink.dataset.hash) route.hash = routeLink.dataset.hash;
    event.preventDefault();
    navigate(route);
  });

  function openSearch() {
    searchOverlay.hidden = false;
    searchInput.value = '';
    renderSearchResults('');
    requestAnimationFrame(() => searchInput.focus());
  }
  function closeSearch() {
    searchOverlay.hidden = true;
    document.getElementById('search-trigger').focus();
  }
  document.getElementById('search-trigger').addEventListener('click', openSearch);
  document.getElementById('search-close').addEventListener('click', closeSearch);
  searchOverlay.addEventListener('click', event => { if (event.target === searchOverlay) closeSearch(); });

  function getSearchCorpus() {
    if (searchCorpusPromise) return searchCorpusPromise;
    searchCorpus = routeSpecs.map(row => ({ ...row, body: '' }));
    searchCorpusPromise = Promise.all(searchCorpus.map(async item => {
      try {
        const text = await fetchMarkdown(item.path);
        item.body = text.replace(/```[\s\S]*?```/g, ' ').replace(/[`*_>#|()[\]]/g, ' ').replace(/\s+/g, ' ').toLowerCase();
      } catch (_) { /* Titles/tags still make the item searchable. */ }
    })).then(() => searchCorpus);
    return searchCorpusPromise;
  }

  async function renderSearchResults(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      searchResults.innerHTML = '<p class="search-hint">Search lesson titles, case studies, and concepts.</p>';
      activeSearchResults = [];
      return;
    }
    searchResults.innerHTML = '<p class="search-hint">Looking through the course…</p>';
    const corpus = await getSearchCorpus();
    if (searchOverlay.hidden || searchInput.value.trim().toLowerCase() !== q) return;
    const terms = q.split(/\s+/).filter(Boolean);
    activeSearchResults = corpus.map(item => {
      const title = item.title.toLowerCase();
      const haystack = `${title} ${item.description.toLowerCase()} ${item.tags.toLowerCase()} ${item.body}`;
      const score = terms.reduce((total, term) => total + (title.includes(term) ? 8 : 0) + (item.tags.toLowerCase().includes(term) ? 4 : 0) + (item.description.toLowerCase().includes(term) ? 2 : 0) + (item.body.includes(term) ? 1 : 0), 0);
      return { ...item, score };
    }).filter(item => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 9);
    searchSelection = 0;
    if (!activeSearchResults.length) {
      searchResults.innerHTML = '<p class="search-hint">No matches yet. Try a broader concept such as “data”, “cache”, or “failure”.</p>';
      return;
    }
    searchResults.innerHTML = activeSearchResults.map((item, index) => `<button class="search-result${index === 0 ? ' selected' : ''}" type="button" role="option" aria-selected="${index === 0}" data-search-index="${index}"><span class="result-type">${item.type === 'lesson' ? 'L' : item.type === 'case' ? 'C' : 'R'}</span><span class="result-copy"><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.description)}</small></span><span class="result-enter">↵</span></button>`).join('');
    searchResults.querySelectorAll('[data-search-index]').forEach(button => button.addEventListener('click', () => openSearchResult(Number(button.dataset.searchIndex))));
  }

  function openSearchResult(index) {
    const item = activeSearchResults[index];
    if (!item) return;
    closeSearch();
    navigate(item.type === 'lesson' ? { type: 'lesson', id: item.id } : item.type === 'case' ? { type: 'case', id: item.id } : { type: 'page', id: item.id });
  }

  searchInput.addEventListener('input', () => renderSearchResults(searchInput.value));
  searchInput.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!activeSearchResults.length) return;
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      searchSelection = (searchSelection + direction + activeSearchResults.length) % activeSearchResults.length;
      searchResults.querySelectorAll('[data-search-index]').forEach(button => {
        const active = Number(button.dataset.searchIndex) === searchSelection;
        button.classList.toggle('selected', active);
        button.setAttribute('aria-selected', String(active));
      });
      searchResults.querySelectorAll('.selected')[0]?.scrollIntoView({ block: 'nearest' });
    } else if (event.key === 'Enter') {
      event.preventDefault();
      openSearchResult(searchSelection);
    } else if (event.key === 'Escape') closeSearch();
  });

  document.addEventListener('keydown', event => {
    const isMac = navigator.platform.toLowerCase().includes('mac');
    if ((isMac ? event.metaKey : event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      openSearch();
    }
    if (event.key === 'Escape' && !searchOverlay.hidden) closeSearch();
    if (event.key === 'Escape' && document.getElementById('course-sidebar').classList.contains('open')) closeSidebar();
  });

  window.addEventListener('popstate', () => {
    currentRoute = getRouteFromUrl();
    renderRoute().then(() => {
      if (window.location.hash) document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView();
    });
  });

  currentRoute = getRouteFromUrl();
  renderRoute();
})();
