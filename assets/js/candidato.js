(function() {
    const params = new URLSearchParams(window.location.search);
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const pathId = pathParts[0] === 'candidato' ? pathParts[1] : '';
    const id = pathId || params.get('id') || 'renan-santos';
    const hero = document.getElementById('candidate-hero');
    const grid = document.getElementById('candidate-articles-grid');

    function renderHero(data) {
        if (!hero) return;
        const socials = (data.socials || []).map(s => `<a href="${s.url}" target="_blank" rel="noopener noreferrer" class="candidate-social">${s.label}</a>`).join('');
        hero.innerHTML = `
            <div class="candidate-hero-card">
                <div class="candidate-hero-content">
                    <span class="candidate-kicker">Candidato</span>
                    <h2>${data.nome}</h2>
                    <p>${data.cargo} | ${data.partido}</p>
                    <p class="candidate-bio">${data.bio || ''}</p>
                    <div class="candidate-socials">${socials}</div>
                </div>
                <div class="candidate-hero-photo">
                    <img src="${data.foto || ''}" alt="${data.nome}">
                </div>
            </div>
        `;
    }

    function renderArticles(artigos) {
        if (!grid) return;
        grid.innerHTML = artigos.map(a => `
            <article class="article-card">
                <div class="article-thumb" style="background-image:url('${a.imagem || ''}')"></div>
                <div class="article-body">
                    <div class="article-meta">
                        <span>${a.tema || 'Artigo'}</span>
                        <span>${a.data || ''}</span>
                    </div>
                    <h4>${a.titulo}</h4>
                    <p>${a.resumo || ''}</p>
                    <div class="article-actions">
                        <a class="article-link" href="/artigos">Ver todos</a>
                    </div>
                </div>
            </article>
        `).join('');
    }

    Promise.all([
        fetch(`assets/content/candidatos/${id}.json`).then(r => r.json()),
        fetch('assets/content/indices/artigos.json').then(r => r.json())
    ]).then(([candidato, artigos]) => {
        renderHero(candidato);
        const relacionados = (artigos || []).filter(a => a.candidato_id === id && a.status === 'published');
        renderArticles(relacionados);
    });
})();





