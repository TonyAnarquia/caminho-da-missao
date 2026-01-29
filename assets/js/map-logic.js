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
        const PROPOSTAS_CANDIDATOS = {
            "renan-santos": {
                nome: "Renan Santos",
                cargo: "Pr&eacute;-candidato &agrave; Presid&ecirc;ncia",
                partido: "Miss&atilde;o",
                instagram: "https://www.instagram.com/p/DRCpUvkkTL1",
                titulo: "7 propostas da Miss&atilde;o",
                propostas: [
                    {
                        numero: "1",
                        titulo: "Guerra contra o Crime Organizado",
                        paragrafos: [
                            "A Miss&atilde;o reconhece que j&aacute; existe uma guerra acontecendo no Brasil hoje. PCC e Comando Vermelho j&aacute; declaram suas inten&ccedil;&otilde;es de exercer dom&iacute;nio territorial em algumas regi&otilde;es, j&aacute; possuem ex&eacute;rcitos atuando, j&aacute; implementam suas pr&oacute;prias leis e t&ecirc;m at&eacute; suas pr&oacute;prias culturas.",
                            "O Estado brasileiro finge que n&atilde;o existe, ou que s&atilde;o apenas pequenas gangues em conflito. Est&aacute; na hora de reconhecer que o Brasil n&atilde;o vive um per&iacute;odo de paz. E n&atilde;o vai ser com mais pedidos de 'paz' que vamos parar essa guerra."
                        ]
                    },
                    {
                        numero: "2",
                        titulo: "Direito Penal do Inimigo",
                        paragrafos: [
                            "Faccionados do Comando Vermelho e Primeiro Comando da Capital n&atilde;o s&atilde;o apenas bandidos comuns; eles exercem poder pol&iacute;tico sobre territ&oacute;rios dominados, amea&ccedil;ando n&atilde;o apenas a popula&ccedil;&atilde;o local, mas a soberania do Estado brasileiro.",
                            "Portanto eles n&atilde;o devem ter um processo criminal com ampla defesa, diversos ju&iacute;zes, Minist&eacute;rio P&uacute;blico, tr&acirc;nsito em julgado etc.",
                            "O Estado precisa agir com a maior rapidez poss&iacute;vel. Quebra de sigilos, pris&atilde;o, depoimentos etc, tudo deve ser feito com urg&ecirc;ncia."
                        ]
                    },
                    {
                        numero: "3",
                        titulo: "Desfaveliza&ccedil;&atilde;o",
                        paragrafos: [
                            "Favelas n&atilde;o s&atilde;o apenas lugares com condi&ccedil;&otilde;es subumanas de vida. Se tornaram QGs de fac&ccedil;&otilde;es, que sequestram os trabalhadores que l&aacute; vivem.",
                            "Al&eacute;m disso, a cultura que sai desses lugares, os problemas e a falta de perspectiva e de melhora de vida n&atilde;o devem ser romantizados.",
                            "O Brasil precisa de um gigantesco plano de habita&ccedil;&atilde;o, reurbaniza&ccedil;&atilde;o, educa&ccedil;&atilde;o e emprego para acabar com tudo que a favela representa hoje.",
                            "E a cadeia de reprodu&ccedil;&atilde;o de desvantagem - fam&iacute;lias sem figura paterna - s&atilde;o o maior alimento para a cria&ccedil;&atilde;o do crime organizado. Isso precisa ser tratado com seriedade para termos menos soldados e uma na&ccedil;&atilde;o menos doente."
                        ]
                    },
                    {
                        numero: "4",
                        titulo: "Interiorizar as atividades produtivas",
                        paragrafos: [
                            "As regi&otilde;es mais pobres do Brasil s&atilde;o o para&iacute;so de pol&iacute;ticos corruptos, que aproveitam a pobreza das pessoas para comprar votos, desviar recursos e se perpetuarem no poder.",
                            "Levar atividades produtivas para os interiores, principalmente do Nordeste, e gerar classe m&eacute;dia, quebra o ciclo que alimenta h&aacute; d&eacute;cadas a lideran&ccedil;a dessas pessoas nessa verdadeira escravid&atilde;o moderna."
                        ]
                    },
                    {
                        numero: "5",
                        titulo: "Responsabilidade gerencial",
                        paragrafos: [
                            "O Brasil precisa mudar o sistema de incentivos que elege seus pol&iacute;ticos. Pol&iacute;ticos que n&atilde;o entregam melhorias claras nos &iacute;ndices de educa&ccedil;&atilde;o, saneamento, sa&uacute;de e seguran&ccedil;a devem perder seus direitos pol&iacute;ticos.",
                            "O fundo partid&aacute;rio e eleitoral e demais departamentos devem tamb&eacute;m ser destinados apenas a partidos cujos gestores conseguem apresentar melhorias em todos os &iacute;ndices do Brasil."
                        ]
                    },
                    {
                        numero: "6",
                        titulo: "Fus&atilde;o de munic&iacute;pios",
                        paragrafos: [
                            "Munic&iacute;pios que dependem de verbas federais ou estaduais para pagar suas pr&oacute;prias contas devem deixar de existir e se fundir com outros munic&iacute;pios pr&oacute;ximos. Chega de bancar cidades deficit&aacute;rias.",
                            "No geral, cidades do Centro-Sul do pa&iacute;s pagam mais do que deveriam em impostos para manter cidades do Centro-Norte e Nordeste vivendo e pedindo mais dinheiro para pagar sal&aacute;rios de pol&iacute;tico. Nada de bom pode vir dessa l&oacute;gica."
                        ]
                    },
                    {
                        numero: "7",
                        titulo: "Mutir&atilde;o anti Bolsa-Fam&iacute;lia",
                        paragrafos: [
                            "Munic&iacute;pios com mais de 30% da popula&ccedil;&atilde;o recebendo Bolsa-Fam&iacute;lia devem promover mutir&otilde;es de emprego.",
                            "Pessoas em idade economicamente ativa que se recusarem em trabalhar dever&atilde;o perder o direito de receber Bolsa-Fam&iacute;lia em tr&ecirc;s meses."
                        ]
                    }
                ]
            }
        };

        // 2. ESTADO DA APLICAÇÃO
        let estadoSelecionado = null;
        let geojsonLayer;
        let dadosCandidatos = {};
        let candidatosIndex = {};
        let layersPorSigla = {};
        let estadosIndex = {};

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
        configurarModal();

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
                        montarSelectEstados(geo);
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
            layersPorSigla[s] = layer;
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
                selecionarEstado(s, nome, layer);
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

function montarSelectEstados(geo) {
    const select = document.getElementById('estado-select');
    if (!select || !geo || !geo.features) return;

    const options = [];
    geo.features.forEach((f) => {
        const s = f.properties.sigla || f.properties.UF || f.id;
        const nome = f.properties.nome || f.properties.name || s;
        if (!s) return;
        estadosIndex[s] = nome;
        options.push({ sigla: s, nome: nome });
    });

    options.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
    select.innerHTML = '<option value="">Selecione um Estado</option>' +
        options.map(o => `<option value="${o.sigla}">${o.nome} (${o.sigla})</option>`).join('');

    select.onchange = function() {
        const val = this.value;
        if (!val) {
            resetMapa();
            return;
        }
        selecionarEstado(val);
    };
}

function selecionarEstado(sigla, nomeFallback, layerFallback) {
    const layer = layerFallback || layersPorSigla[sigla];
    if (!layer) return;
    const nome = nomeFallback || estadosIndex[sigla] || sigla;

    estadoSelecionado = sigla;
    geojsonLayer.setStyle(aplicarEstilo);
    layer.bringToFront();
    map.fitBounds(layer.getBounds(), { padding: [20, 20] });

    document.getElementById('nome-estado-selecionado').innerText = nome;
    document.getElementById('lista-vazia').style.display = 'none';
    document.getElementById('container-abas').style.display = 'block';

    const cands = dadosCandidatos[sigla] || [];
    const nacional = dadosCandidatos["NACIONAL"] || [];

    const select = document.getElementById('estado-select');
    if (select && select.value !== sigla) select.value = sigla;

    if (window.innerWidth < 850) {
        document.getElementById('info-container').scrollIntoView({ behavior: 'smooth' });
    }

    atualizarPainelLateral(cands, nacional);
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
            const select = document.getElementById('estado-select');
            if (select) select.value = '';
            if (geojsonLayer) geojsonLayer.setStyle(aplicarEstilo);
            map.setView([-15.78, -52], 4);
            gerenciarArrasto();
        }

        function gerarCard(c) {
    // Verificamos se c.id existe, se não, usamos o nome do candidato como fallback
      const idCandidato = c.id || c.nome.toLowerCase().replace(/\s+/g, '-');
      candidatosIndex[idCandidato] = c;
    
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

function configurarModal() {
    const modal = document.getElementById('modal-candidato');
    if (!modal) return;
    modal.addEventListener('click', function(e) {
        if (e.target === modal) fecharModal();
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') fecharModal();
    });
}

function slugify(valor) {
    return (valor || '')
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function escapeHtml(valor) {
    return (valor || '')
        .toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function buscarPropostas(id, candidato) {
    const keys = [];
    if (id) {
        keys.push(id);
        keys.push(slugify(id));
    }
    if (candidato && candidato.nome) {
        keys.push(slugify(candidato.nome));
    }
    for (const key of keys) {
        if (PROPOSTAS_CANDIDATOS[key]) return PROPOSTAS_CANDIDATOS[key];
    }
    return null;
}

function renderPropostas(proposta, candidato) {
    const nome = escapeHtml(candidato.nome || proposta.nome || 'Candidato');
    const cargo = candidato.cargo ? escapeHtml(candidato.cargo) : (proposta.cargo || '');
    const partido = candidato.partido ? escapeHtml(candidato.partido) : (proposta.partido || '');
    const foto = candidato.foto || '';
    const iniciais = nome.split(' ').filter(Boolean).map(p => p[0]).join('').slice(0, 2);
    const titulo = proposta.titulo || 'Propostas';

    const cabecalho = cargo || partido
        ? `<p class="proposal-role">${cargo}${cargo && partido ? ' � ' : ''}${partido}</p>`
        : '';

    const fotoHtml = foto
        ? `<img src="${foto}" alt="${nome}" class="proposal-photo" />`
        : `<div class="proposal-photo-fallback">${iniciais || 'RM'}</div>`;

    const lista = proposta.propostas.map((item) => {
        const paragrafos = item.paragrafos.map(p => `<p>${p}</p>`).join('');
        return `
            <div class="proposal-item">
                <div class="proposal-number">${item.numero}</div>
                <div class="proposal-body">
                    <h3>${item.titulo}</h3>
                    ${paragrafos}
                </div>
            </div>`;
    }).join('');

    const link = proposta.instagram
        ? `<a class="proposal-link" href="${proposta.instagram}" target="_blank" rel="noopener noreferrer">Ver propostas no Instagram</a>`
        : '';

    return `
        <div class="proposal-modal">
            <div class="proposal-head">
                <div class="proposal-head-text">
                    <span class="proposal-kicker">Propostas</span>
                    <h2 class="proposal-name">${nome}</h2>
                    ${cabecalho}
                </div>
                <div class="proposal-head-photo">
                    ${fotoHtml}
                </div>
            </div>
            <div class="proposal-title">${titulo}</div>
            <div class="proposal-list">
                ${lista}
            </div>
            ${link ? `<div class="proposal-footer">${link}</div>` : ''}
        </div>`;
}

async function abrirPerfil(id) {
    const modal = document.getElementById('modal-candidato');
    const content = document.getElementById('modal-body-content');
    const candidato = candidatosIndex[id] || {};
    const proposta = buscarPropostas(id, candidato);
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    content.innerHTML = '<div class="proposal-loading">Carregando informações oficiais...</div>';

    if (proposta) {
        content.innerHTML = renderPropostas(proposta, candidato);
        return;
    }

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
                ${dados.links ? dados.links.map(l => `<a href="${l.url}" target="_blank" rel="noopener noreferrer" style="color:#EEBB00; margin-right:15px; text-decoration:none;">Link: ${l.label}</a>`).join('') : ''}
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
    document.body.style.overflow = '';
    document.getElementById('modal-body-content').innerHTML = '';
}
