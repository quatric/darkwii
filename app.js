(() => {
  const D = window.THEMES, root = document.documentElement;
  const $ = (id) => document.getElementById(id);
  const store = { get(k){ try { return localStorage.getItem(k); } catch { return null; } }, set(k,v){ try { localStorage.setItem(k,v); } catch {} } };
  const slug = (n) => n.toLowerCase();
  const shot = (t, n) => `shots/${slug(t.name)}/${n}.webp`;

  // light / dark
  const modeBtn = document.querySelector('.mode-toggle');
  function setMode(m){ root.dataset.theme = m; store.set('mode', m); modeBtn.setAttribute('aria-pressed', m === 'dark');
    modeBtn.querySelectorAll('[data-mode]').forEach(s => s.classList.toggle('on', s.dataset.mode === m)); }
  setMode(store.get('mode') || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
  modeBtn.addEventListener('click', (e) => { const s = e.target.closest('[data-mode]'); setMode(s ? s.dataset.mode : root.dataset.theme === 'dark' ? 'light' : 'dark'); });

  // tiles
  const tiles = $('tiles');
  tiles.innerHTML = D.themes.map((t, i) => `<button type="button" class="tile${t.name === 'Rainbow' ? ' rainbow-tile' : ''}" data-theme="${t.name}" role="radio" style="--tile-accent:${t.accent}" aria-checked="false" tabindex="-1"><img src="${shot(t,'disc-channel')}" width="640" height="480" alt=""><span class="tile-name">${t.name}</span></button>`).join('');

  function select(name, push){
    const t = D.themes.find(x => x.name === name) || D.themes[0];
    tiles.querySelectorAll('.tile').forEach(b => { const on = b.dataset.theme === t.name; b.setAttribute('aria-checked', on); b.tabIndex = on ? 0 : -1; });
    root.classList.toggle('rainbow', t.name === 'Rainbow');
    root.style.setProperty('--accent', t.name === 'Rainbow' ? '' : t.accent);
    if (t.name !== 'Rainbow') root.style.setProperty('--accent', t.accent); else root.style.removeProperty('--accent');
    const hero = $('hero-shot'); hero.src = shot(t, 'menu'); hero.alt = `The Wii Menu with the ${t.name} theme`;
    $('theme-name').textContent = `${t.name} · DarkWii Reimagined v1.0`;
    $('theme-note').textContent = `${t.name === 'Rainbow' ? 'Rainbow, the accent cycles' : `${t.name} ${t.accent}`}`;
    $('downloads').querySelector('tbody').innerHTML = t.files.map(f => `<tr><th scope="row">${f.name} <span class="region">· ${f.r}</span></th>` +
      ['csm','mym'].map(k => `<td><a class="pill" href="${f[k].file}" download title="SHA-256 ${f[k].sha}">${k}<span class="size">${f[k].mb.toFixed(1)} MB</span></a></td>`).join('') + '</tr>').join('');
    $('screens').innerHTML = D.shots.map(([n, cap]) => `<figure class="screen"><a href="${shot(t,n)}"><img src="${shot(t,n)}" width="640" height="480" loading="lazy" alt="${cap} with the ${t.name} theme"></a><figcaption>${cap}</figcaption></figure>`).join('');
    if (push) { store.set('theme', t.name); history.replaceState(null, '', '#' + slug(t.name)); }
  }
  tiles.addEventListener('click', (e) => { const b = e.target.closest('.tile'); if (b) select(b.dataset.theme, true); });
  tiles.addEventListener('keydown', (e) => {
    const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (!k) return;
    e.preventDefault(); const all = [...tiles.children]; const i = all.findIndex(b => b.getAttribute('aria-checked') === 'true');
    const n = all[(i + k + all.length) % all.length]; select(n.dataset.theme, true); n.focus();
  });
  const hash = location.hash.slice(1), fromHash = D.themes.find(t => slug(t.name) === hash);
  select(fromHash ? fromHash.name : store.get('theme') || 'DarkBlue', false);
})();
