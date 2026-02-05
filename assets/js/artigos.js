(function() {
    const grid = document.getElementById('articles-grid');
    const search = document.getElementById('article-search');
    const filter = document.getElementById('article-filter');

    function normalize(value) {
        return (value || '')
            .toString()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    function renderCard(artigo) {
        const tags = (artigo.tags || []).map(t => `<span class="article-tag">${t}</span>`).join('');
        const audio = artigo.audio_url
            ? `<button class="article-audio" data-audio="${artigo.audio_url}">Ouvir em IA</button>`
            : '';
        return `
            <article class="article-card">
                <div class="article-thumb" style="background-image:url('${artigo.imagem || ''}')"></div>
                <div class="article-body">
                    <div class="article-meta">
                        <span>${artigo.tema || 'Artigo'}</span>
                        <span>${artigo.data || ''}</span>
                    </div>
                    <h4>${artigo.titulo}</h4>
                    <p>${artigo.resumo || ''}</p>
                    <div class="article-tags">${tags}</div>
                    <div class="article-actions">
                        <a class="article-link" href="/candidato/${artigo.candidato_id || ''}">Ver candidato</a>
                        ${audio}
                    </div>
                </div>
            </article>
        `;
    }

    function renderList(lista) {
        if (!grid) return;
        grid.innerHTML = lista.map(renderCard).join('');
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
            const temas = Array.from(new Set(lista.map(a => a.tema).filter(Boolean)));
            if (filter) {
                filter.innerHTML += temas.map(t => `<option value="${t}">${t}</option>`).join('');
            }
            const update = () => renderList(applyFilters(lista));
            if (search) search.addEventListener('input', update);
            if (filter) filter.addEventListener('change', update);
            renderList(applyFilters(lista));

            document.addEventListener('click', function(e) {
                const btn = e.target.closest('.article-audio');
                if (!btn) return;
                const url = btn.getAttribute('data-audio');
                if (!url) return;
                const audio = new Audio(url);
                audio.play();
            });
        });
})();


