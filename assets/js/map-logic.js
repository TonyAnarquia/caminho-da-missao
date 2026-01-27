		// 1. CONSTANTES E CONFIGURAÇÕES
        const URL_ESTADOS = 'https://raw.githubusercontent.com/TonyAnarquia/mapa-eleitoral-blog/refs/heads/main/estados.json';
        const URL_PLANILHA = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQWGZKaW2pCrP8sJjN3PHdIXqD0C7qiOwQ1tjpbHqNo2Dr1UZSmXgU2HNuqYD25BE4Q6LVbawsnsicv/pub?output=csv';
        
        const AJUSTE_SIGLAS = {
            'AC': [-9.2, -70.5], 'AL': [-9.65, -36.45], 'AM': [-3.5, -64], 'AP': [1.4, -51.7], 
            'BA': [-12.5, -41.7], 'CE': [-5.2, -39.5], 'DF': [-15.78, -47.85], 'ES': [-19.5, -40.5],
            'GO': [-15.8, -49.6], 'MA': [-5.3, -45.2], 'MG': [-18.5, -44.5], 'MS': [-20.3, -54.8],
            'MT': [-12.8, -56], 'PA': [-3.8, -53], 'PB': [-7.2, -36.6], 'PE': [-8.45, -37.7],
            'PI': [-7.5, -42.7], 'PR': [-24.8, -51.5], 'RJ': [-22.35, -42.85], 'RN': [-5.75, -36.65],
            'RO': [-11, -62.8], 'RR': [2.3, -61.3], 'RS': [-30, -53.8], 'SC': [-27.3, -50.6], 
            'SE': [-10.7, -37.3], 'SP': [-22.1, -48.7], 'TO': [-10.2, -48.3]
        };

        const CORES_ESTADOS = {
            'AC': '#1e293b', 'AL': '#1e293b', 'AP': '#1e293b', 'AM': '#1e293b',
            'BA': '#1e293b', 'CE': '#1e293b', 'DF': '#1e293b', 'ES': '#1e293b',
            'GO': '#1e293b', 'MA': '#1e293b', 'MT': '#1e293b', 'MS': '#1e293b',
            'MG': '#1e293b', 'PA': '#1e293b', 'PB': '#1e293b', 'PR': '#1e293b',
            'PE': '#1e293b', 'PI': '#1e293b', 'RJ': '#1e293b', 'RN': '#1e293b',
            'RS': '#1e293b', 'RO': '#1e293b', 'RR': '#1e293b', 'SC': '#1e293b',
            'SP': '#1e293b', 'SE': '#1e293b', 'TO': '#1e293b'
        };

        // 2. ESTADO DA APLICAÇÃO
        let estadoSelecionado = null;
        let geojsonLayer;
        let dadosCandidatos = {};

        const map = L.map('mapa-interativo', {
            zoomSnap: 0.5, 
            attributionControl: false, 
            minZoom: 4, 
            maxZoom: 7,
            maxBounds: [[-35, -75], [7, -32]], 
            maxBoundsViscosity: 1.0
        }).setView([-15.78, -52], 4);

        // 3. INICIALIZAÇÃO
        carregarDadosEIniciar();

        map.on('zoomend', gerenciarArrasto);
        map.on('click', (e) => {
            if (e.originalEvent.target.id === 'mapa-interativo') resetMapa();
        });
        map.addControl(new (criarBotaoReset())());

        // 4. FUNÇÕES
        function carregarDadosEIniciar() {
            Promise.all([
                fetch(URL_ESTADOS).then(r => r.json()),
                fetch(URL_PLANILHA).then(r => r.text())
            ]).then(res => {
                const geo = res[0];
                Papa.parse(res[1], {
                    header: true,
                    skipEmptyLines: true,
                    complete: function(results) {
                        results.data.forEach(linha => {
                            const uf = (linha.estado || '').toUpperCase().trim();
                            if (!dadosCandidatos[uf]) dadosCandidatos[uf] = [];
                            dadosCandidatos[uf].push(linha);
                        });
                        renderizarMapa(geo);
                        renderizarPresidenteInicial();
                    }
                });
            });
        }

        function renderizarMapa(geo) {
            geojsonLayer = L.geoJSON(geo, {
                style: aplicarEstilo,
                onEachFeature: function(f, layer) {
                    const s = f.properties.sigla || f.properties.UF || f.id;
                    const nome = f.properties.nome || f.properties.name || s;
                    layer.bindTooltip(nome, { direction: 'top', sticky: true });
                    
                    layer.on('mouseover', function () {
                        if (estadoSelecionado !== s) {
                            layer.setStyle({ color: '#ffffff', weight: 3, fillOpacity: 0.9 });
                            layer.bringToFront();
                        }
                    });
                    layer.on('mouseout', function () { geojsonLayer.setStyle(aplicarEstilo); });

                    const pos = AJUSTE_SIGLAS[s] || layer.getBounds().getCenter();
                    L.marker(pos, { 
                        icon: L.divIcon({ 
                            className: 'sigla-label', 
                            html: `<span>${s}</span>`, 
                            iconSize: [20, 20],
                            iconAnchor: [10, 10]
                        }), 
                        interactive: false 
                    }).addTo(map);

                    layer.on('click', function(e) {
                        L.DomEvent.stopPropagation(e);
                        estadoSelecionado = s;
                        geojsonLayer.setStyle(aplicarEstilo);
                        layer.bringToFront();
                        map.fitBounds(layer.getBounds(), { padding: [20, 20] });
                        
                        document.getElementById('nome-estado-selecionado').innerText = nome;
                        document.getElementById('lista-vazia').style.display = 'none';
                        document.getElementById('container-abas').style.display = 'block';

                        const cands = dadosCandidatos[s] || [];
                        const nacional = dadosCandidatos["NACIONAL"] || [];
                        
                        if(window.innerWidth < 850) {
                            document.getElementById('info-container').scrollIntoView({ behavior: 'smooth' });
                        }

                        atualizarPainelLateral(cands, nacional);
                    });
                }
            }).addTo(map);
        }

        function renderizarPresidenteInicial() {
            const nacional = dadosCandidatos["NACIONAL"] || [];
            if (nacional.length > 0) {
                const html = `
                    <div class="secao-titulo" style="margin-top:0;">Pré-candidato à Presidência</div>
                    ${nacional.map(gerarCard).join('')}
                `;
                document.getElementById('secao-presidente-inicial').innerHTML = html;
            }
        }

        function atualizarPainelLateral(cands, nacional) {
            document.getElementById('secao-presidencia').innerHTML = nacional.length ? 
                '<div class="secao-titulo">Pré-candidato a Presidência</div>' + nacional.map(gerarCard).join('') : '';
            
            const govs = cands.filter(c => c.cargo.toLowerCase() === 'governador');
            document.getElementById('secao-governador').innerHTML = govs.length ? 
                '<div class="secao-titulo">Pré-candidato a Governador</div>' + govs.map(gerarCard).join('') : '';

            const filtrar = (cargo) => {
               const html = cands.filter(c => c.cargo.toLowerCase() === cargo).map(gerarCard).join('');
               return html || '<p style="font-size:12px; color:#94a3b8; padding:20px; text-align:center;">Nenhum candidato cadastrado.</p>';
            };
    
            document.getElementById('tab-senado').innerHTML = '<div class="secao-titulo">Pré-candidatos à Senador</div>' + filtrar('senador');
            document.getElementById('tab-federal').innerHTML = '<div class="secao-titulo">Pré-candidatos à Deputado Federal</div>' + filtrar('federal');
            document.getElementById('tab-estadual').innerHTML = '<div class="secao-titulo">Pré-candidatos à Deputado Estadual</div>' + filtrar('estadual');
        }

        function aplicarEstilo(f) {
            const s = f.properties.sigla || f.properties.UF || f.id;

            if (s === estadoSelecionado) 
                return { 
                    fillColor: '#EEBB00', 
                    fillOpacity: 1, 
                    color: '#ffffff', 
                    weight: 3 
                };
            return { 
                fillColor: '#1e293b', 
                fillOpacity: 1.0, 
                color: '#334155', 
                weight: 1 };
        }

        function resetMapa() {
            estadoSelecionado = null;
            document.getElementById('nome-estado-selecionado').innerText = 'Selecione um Estado';
            document.getElementById('lista-vazia').style.display = 'block';
            document.getElementById('container-abas').style.display = 'none';
            document.getElementById('secao-presidencia').innerHTML = '';
            document.getElementById('secao-governador').innerHTML = '';
            if (geojsonLayer) geojsonLayer.setStyle(aplicarEstilo);
            map.setView([-15.78, -52], 4);
            gerenciarArrasto();
        }

        function gerarCard(c) {
    // Verificamos se c.id existe, se não, usamos o nome do candidato como fallback
    const idCandidato = c.id || c.nome.toLowerCase().replace(/\s+/g, '-');
    
    return `
    <div class="card-candidato">
        <img src="${c.foto || 'https://via.placeholder.com/64'}" class="cand-foto" alt="${c.nome}"/>
        <div class="cand-info">
            <span class="cand-nome">${c.nome}</span>
            <span class="cand-partido">${c.partido}</span>
            <div class="card-buttons-flex">
                <a href="${c.instagram}" target="_blank" class="btn-instagram">Instagram</a>
                <button onclick="abrirPerfil('${idCandidato}')" class="btn-perfil">+ Info</button>
            </div>
        </div>
    </div>`;
}

        function gerenciarArrasto() {
            if (map.getZoom() <= 4) {
                map.dragging.disable();
                map.setView([-15.78, -52], 4, { animate: true });
            } else {
                map.dragging.enable();
            }
        }

        function abrirTab(evt, tabId) {
            document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            document.getElementById(tabId).classList.add("active");
            evt.currentTarget.classList.add("active");
        }

        function criarBotaoReset() {
            return L.Control.extend({
                options: { position: 'bottomleft' },
                onAdd: function() {
                    const div = L.DomUtil.create('button', 'leaflet-control-reset');
                    div.innerHTML = 'Ver Brasil Inteiro';
                    div.onclick = resetMapa;
                    return div;
                }
            });
        }

        async function abrirPerfil(id) {
            const modal = document.getElementById('modal-candidato');
            const container = document.getElementById('conteudo-detalhado');
    
            modal.style.display = "block";
            container.innerHTML = "<p>Buscando informações oficiais...</p>";

            try {
                // Busca o arquivo JSON ou HTML gerado pelo CMS
                const response = await fetch(`assets/content/candidates/${id}.json`);
                const dados = await response.json();
        
                container.innerHTML = `
                    <h2>${dados.nome_completo}</h2>
                    <div class="biografia">${dados.texto_jornalista}</div>
                    <div class="video-container">${dados.embed_video}</div>
                    <div class="links-uteis">${dados.links_adicionais}</div>
                `;
            } catch (err) {
                container.innerHTML = "<p>Este candidato ainda não possui perfil detalhado publicado.</p>";
            }
        }   




        async function abrirPerfil(id) {
    const modal = document.getElementById('modal-candidato');
    const content = document.getElementById('modal-body-content');
    
    modal.style.display = 'flex';
    content.innerHTML = '<p style="text-align:center;">Carregando informações oficiais...</p>';

    try {
        // Busca o arquivo JSON gerado pelo CMS baseado no ID da planilha
        const response = await fetch(`/assets/content/perfil/${id}.json`);
        if (!response.ok) throw new Error();
        const dados = await response.json();

        content.innerHTML = `
            <h2 style="color:#EEBB00; font-size:28px;">${dados.title}</h2>
            <div style="line-height:1.8; font-size:16px;">${marked.parse(dados.body)}</div>
            ${dados.youtube_id ? `
                <div class="video-wrapper">
                    <iframe src="https://www.youtube.com/embed/${dados.youtube_id}" frameborder="0" allowfullscreen></iframe>
                </div>
            ` : ''}
            <div style="margin-top:20px;">
                ${dados.links ? dados.links.map(l => `<a href="${l.url}" target="_blank" style="color:#EEBB00; margin-right:15px; text-decoration:none;">🔗 ${l.label}</a>`).join('') : ''}
            </div>
        `;
    } catch (err) {
        content.innerHTML = `
            <div style="text-align:center; padding:40px;">
                <p>O perfil detalhado deste pré-candidato ainda está sendo redigido pela nossa equipe de jornalismo.</p>
                <button onclick="fecharModal()" style="background:#EEBB00; border:none; padding:10px 20px; border-radius:5px; cursor:pointer;">Voltar ao Mapa</button>
            </div>`;
    }
}

function fecharModal() {
    document.getElementById('modal-candidato').style.display = 'none';
    document.getElementById('modal-body-content').innerHTML = '';
}