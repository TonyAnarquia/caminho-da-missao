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

    function renderList(lista) {
        if (!grid) return;
        grid.classList.remove('article-detail');
        grid.innerHTML = lista.map(renderCard).join('');
    }

    function renderDetail(artigo) {
        if (!grid) return;
        grid.classList.add('article-detail');
        if (hero) hero.style.display = 'none';

        const tags = (artigo.tags || []).map(t => `<span class="article-tag">${t}</span>`).join('');
        const audio = artigo.audio_url
            ? `<div class="article-audio-player">
                    <span>Audio IA disponivel</span>
                    <audio controls preload="none" src="${normalizeAsset(artigo.audio_url)}"></audio>
               </div>`
            : '';

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
