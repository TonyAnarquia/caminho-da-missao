(function() {
    function normalizeAsset(path) {
        if (!path) return '';
        if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) {
            return path;
        }
        return '/' + path.replace(/^\.?\/*/, '');
    }

    function normalize(value) {
        return (value || '')
            .toString()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    const grid = document.getElementById('articles-grid');
    const search = document.getElementById('article-search');
    const filter = document.getElementById('article-filter');
    const hero = document.querySelector('.articles-hero');
    const params = new URLSearchParams(window.location.search);
    const temaParam = params.get('tema') || '';

    function getSlugFromPath() {
        const parts = window.location.pathname.split('/').filter(Boolean);
        if (parts[0] !== 'artigos') return '';
        return parts[1] || '';
    }

    function renderCard(artigo) {
        const tags = (artigo.tags || []).map(t => `<span class="article-tag">${t}</span>`).join('');
        const audioBadge = artigo.audio_url ? `<span class="article-badge">Audio IA</span>` : '';
        return `
            <a class="article-card article-card--link" href="/artigos/${artigo.slug}">
                <div class="article-thumb" style="background-image:url('${normalizeAsset(artigo.imagem)}')"></div>
                <div class="article-body">
                    <div class="article-meta">
                        <span>${artigo.tema || 'Artigo'}</span>
                        <span>${artigo.data || ''}</span>
                    </div>
                    <h4>${artigo.titulo}</h4>
                    <p>${artigo.resumo || ''}</p>
                    <div class="article-tags">${tags}</div>
                    <div class="article-actions">
                        ${audioBadge}
                        <span class="article-link">Ler artigo</span>
                    </div>
                </div>
            </a>
        `;
    }

    function renderHeroBlock(primary, secondaries) {
        const secondaryHtml = secondaries.map(item => `
            <a class="hero-secondary" href="/artigos/${item.slug}">
                <div class="hero-secondary-thumb" style="background-image:url('${normalizeAsset(item.imagem)}')"></div>
                <div class="hero-secondary-body">
                    <span>${item.tema || 'Artigo'}</span>
                    <h4>${item.titulo}</h4>
                </div>
            </a>
        `).join('');

        return `
            <div class="articles-hero-grid">
                <a class="hero-primary" href="/artigos/${primary.slug}">
                    <div class="hero-primary-thumb" style="background-image:url('${normalizeAsset(primary.imagem)}')"></div>
                    <div class="hero-primary-body">
                        <span>${primary.tema || 'Artigo'}</span>
                        <h3>${primary.titulo}</h3>
                        <p>${primary.resumo || ''}</p>
                        <span class="article-link">Ler artigo</span>
                    </div>
                </a>
                <div class="hero-secondary-list">
                    ${secondaryHtml}
                </div>
            </div>
        `;
    }

    function renderList(lista) {
        if (!grid) return;
        grid.classList.remove('article-detail');

        const primary = lista[0];
        const secondaries = lista.slice(1, 3);
        const rest = lista.slice(3);

        const mainItems = rest.map(artigo => {
            const audioBadge = artigo.audio_url ? `<span class="article-row-badge">Audio IA</span>` : '';
            return `
                <a class="article-row" href="/artigos/${artigo.slug}">
                    <div class="article-row-thumb" style="background-image:url('${normalizeAsset(artigo.imagem)}')"></div>
                    <div class="article-row-body">
                        <div class="article-row-meta">
                            <span>${artigo.tema || 'Artigo'}</span>
                            <span>${artigo.data || ''}</span>
                        </div>
                        <h3 class="article-row-title">${artigo.titulo}</h3>
                        <p class="article-row-summary">${artigo.resumo || ''}</p>
                        <div class="article-row-actions">
                            ${audioBadge}
                            <span class="article-link">Ler artigo</span>
                        </div>
                    </div>
                </a>
            `;
        }).join('');

        const maisLidas = lista.slice(0, 5).map((artigo, index) => `
            <a class="rank-item" href="/artigos/${artigo.slug}">
                <span class="rank-number">${index + 1}</span>
                <span class="rank-title">${artigo.titulo}</span>
            </a>
        `).join('');

        const heroBlock = primary ? renderHeroBlock(primary, secondaries) : '';

        grid.innerHTML = `
            <div class="articles-main">
                ${heroBlock}
                <div class="articles-list">${mainItems}</div>
            </div>
            <aside class="articles-side">
                <div class="articles-box">
                    <h4>Mais lidas</h4>
                    <div class="rank-list">${maisLidas}</div>
                </div>
                <div class="articles-box">
                    <h4>Filtros rapidos</h4>
                    <p style="margin:0;color:#cbd5e1;font-size:12px;">Use a busca e o tema para refinar a lista.</p>
                </div>
            </aside>
        `;
    }

    function renderDetail(artigo) {
        if (!grid) return;
        grid.classList.add('article-detail');
        if (hero) hero.style.display = 'none';

        const tags = (artigo.tags || []).map(t => `<span class="article-tag">${t}</span>`).join('');
        const audioUrl = artigo.audio_url ? normalizeAsset(artigo.audio_url) : '';
        const audio = audioUrl
            ? `<div class="article-audio-player">
                    <span>Audio oficial (MP3)</span>
                    <audio controls preload="none" src="${audioUrl}"></audio>
               </div>`
            : `<div class="article-audio-player">
                    <div class="audio-header">Ouvir noticia</div>
                    <div class="audio-bar">
                        <button class="audio-play" data-action="play" aria-label="Ouvir">▶</button>
                        <div class="audio-wave" aria-hidden="true"></div>
                        <div class="audio-time">--:--</div>
                        <button class="audio-speed" data-action="speed">1.0x</button>
                    </div>
               </div>`;

        const conteudo = (artigo.conteudo || []).map(item => {
            if (item.tipo === 'h2') return `<h2>${item.texto}</h2>`;
            if (item.tipo === 'h3') return `<h3>${item.texto}</h3>`;
            if (item.tipo === 'quote') return `<blockquote>${item.texto}</blockquote>`;
            return `<p>${item.texto}</p>`;
        }).join('');

        grid.innerHTML = `
            <article class="article-full">
                <a class="article-back" href="/artigos">← Voltar para artigos</a>
                <div class="article-full-hero" style="background-image:url('${normalizeAsset(artigo.imagem)}')"></div>
                <div class="article-full-body">
                    <div class="article-meta">
                        <span>${artigo.tema || 'Artigo'}</span>
                        <span>${artigo.data || ''}</span>
                    </div>
                    <h1>${artigo.titulo}</h1>
                    <p class="article-full-resumo">${artigo.resumo || ''}</p>
                    <div class="article-tags">${tags}</div>
                    ${audio}
                    <div class="article-content">
                        ${conteudo}
                    </div>
                    <div class="article-cta">
                        <a class="article-link" href="/candidato/${artigo.candidato_id || ''}">Ver candidato</a>
                    </div>
                </div>
            </article>
        `;

        if (!audioUrl && 'speechSynthesis' in window) {
            const text = [artigo.titulo, artigo.resumo, (artigo.conteudo || []).map(i => i.texto).join(' ')].join(' ');
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'pt-BR';
            let rate = 1;
            const playBtn = grid.querySelector('.audio-play');
            const speedBtn = grid.querySelector('.audio-speed');
            if (playBtn) {
                playBtn.addEventListener('click', () => {
                    const isPlaying = playBtn.classList.toggle('is-playing');
                    playBtn.textContent = isPlaying ? '❚❚' : '▶';
                    if (isPlaying) {
                        window.speechSynthesis.cancel();
                        utterance.rate = rate;
                        window.speechSynthesis.speak(utterance);
                    } else {
                        window.speechSynthesis.pause();
                    }
                });
            }
            if (speedBtn) {
                speedBtn.addEventListener('click', () => {
                    rate = rate >= 1.5 ? 1.0 : rate + 0.25;
                    speedBtn.textContent = rate.toFixed(2).replace('.00', '') + 'x';
                });
            }
        }
    }

    function applyFilters(lista) {
        const query = normalize(search ? search.value : '');
        const tema = filter ? filter.value : '';
        return lista.filter(item => {
            if (item.status && item.status !== 'published') return false;
            if (tema && item.tema !== tema) return false;
            if (!query) return true;
            const hay = normalize([item.titulo, item.resumo, item.tema, (item.tags || []).join(' ')].join(' '));
            return hay.includes(query);
        });
    }

    fetch('/assets/content/indices/artigos.json')
        .then(r => r.json())
        .then(lista => {
            lista = (lista || []).slice().sort((a, b) => (b.data || '').localeCompare(a.data || ''));
            const slug = getSlugFromPath();
            if (slug) {
                fetch(`/assets/content/artigos/${slug}.json`)
                    .then(r => r.json())
                    .then(renderDetail)
                    .catch(() => {
                        if (grid) grid.innerHTML = '<div class="article-empty">Artigo nao encontrado.</div>';
                    });
                return;
            }

            const temas = Array.from(new Set(lista.map(a => a.tema).filter(Boolean)));
            if (filter) {
                filter.innerHTML += temas.map(t => `<option value="${t}">${t}</option>`).join('');
                if (temaParam) {
                    const match = temas.find(t => t.toLowerCase() === temaParam.toLowerCase());
                    if (match) filter.value = match;
                }
            }
            const update = () => renderList(applyFilters(lista));
            if (search) search.addEventListener('input', update);
            if (filter) filter.addEventListener('change', update);
            renderList(applyFilters(lista));
        })
        .catch(() => {
            if (grid) grid.innerHTML = '<div class="article-empty">Nao foi possivel carregar os artigos.</div>';
        });
})();
