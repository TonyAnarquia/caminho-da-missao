(function() {
    const header = document.querySelector('.site-header--modern');
    if (!header) return;

    const toggle = header.querySelector('.site-header__toggle');
    let userToggled = false;

    function setCollapsed(collapsed) {
        header.classList.toggle('is-collapsed', collapsed);
        if (toggle) {
            toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
        }
    }

    function handleScroll() {
        if (window.innerWidth > 900) return;
        if (userToggled) return;
        if (window.scrollY > 120) {
            setCollapsed(true);
        } else if (window.scrollY < 40) {
            setCollapsed(false);
        }
    }

    if (toggle) {
        toggle.addEventListener('click', () => {
            userToggled = true;
            const isCollapsed = header.classList.contains('is-collapsed');
            setCollapsed(!isCollapsed);
        });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) {
            userToggled = false;
            setCollapsed(false);
        }
    });

    const navHome = header.querySelector('.nav-home');
    const navArtigos = header.querySelector('.nav-artigos');
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    if (path === '/' || path === '') {
        navHome && navHome.classList.add('is-active');
    } else if (path.startsWith('/artigos')) {
        navArtigos && navArtigos.classList.add('is-active');
    }

    const themesNav = document.getElementById('site-theme-nav');
    if (!themesNav) return;

    fetch('/assets/content/indices/artigos.json')
        .then(r => r.json())
        .then(lista => {
            const temas = Array.from(new Set((lista || []).map(a => a.tema).filter(Boolean)));
            const params = new URLSearchParams(window.location.search);
            const temaAtivo = (params.get('tema') || '').toLowerCase();

            const links = ['Todos', ...temas].map(t => {
                const label = t === 'Todos' ? 'Todos' : t;
                const query = t === 'Todos' ? '' : `?tema=${encodeURIComponent(t)}`;
                const href = `/artigos${query}`;
                const active = t !== 'Todos' ? t.toLowerCase() === temaAtivo : (!temaAtivo && window.location.pathname.startsWith('/artigos'));
                return `<a class="theme-link${active ? ' is-active' : ''}" href="${href}">${label}</a>`;
            }).join('');

            themesNav.innerHTML = links;
        })
        .catch(() => {
            themesNav.innerHTML = '';
        });
})();
