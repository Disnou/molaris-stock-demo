const STORAGE_REAGENTES = "molaris_reagentes_v2";
const STORAGE_HISTORICO = "molaris_historico_v2";

const FATORES_UNIDADE = {
    volume: { uL: 0.001, mL: 1, L: 1000 },
    massa: { ug: 0.000001, mg: 0.001, g: 1, kg: 1000 }
};

const ROTULOS_UNIDADE = {
    uL: "µL",
    mL: "mL",
    L: "L",
    ug: "µg",
    mg: "mg",
    g: "g",
    kg: "kg"
};

const TOGGLE_PROXIMA_UNIDADE = {
    L: "mL",
    mL: "uL",
    uL: "L",
    kg: "g",
    g: "mg",
    mg: "ug",
    ug: "kg"
};

function arredondar(valor) {
    return Math.round((Number(valor) + Number.EPSILON) * 1000000) / 1000000;
}

function converterUnidade(valor, de, para, tipo) {
    const mapa = FATORES_UNIDADE[tipo];
    if (!mapa || !mapa[de] || !mapa[para]) return Number(valor) || 0;
    const emBase = Number(valor) * mapa[de];
    return arredondar(emBase / mapa[para]);
}

function formatarNumero(num) {
    const limpo = Math.round((Number(num) + Number.EPSILON) * 10000) / 10000;
    return limpo.toLocaleString("pt-BR", { maximumFractionDigits: 4 });
}

function rotuloUnidade(un) {
    return ROTULOS_UNIDADE[un] || un;
}

function escapeHtml(texto) {
    return String(texto ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function dataRelativaDias(dias) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + dias);
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
}

function formatarDataBR(iso) {
    if (!iso || !iso.includes("-")) return "—";
    const [ano, mes, dia] = iso.split("-");
    return `${dia}/${mes}/${ano}`;
}

function calcularDiasRestantes(iso) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const [ano, mes, dia] = iso.split("-").map(Number);
    const alvo = new Date(ano, mes - 1, dia);
    return Math.round((alvo.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
}

function criarDadosIniciais() {
    return [
        {
            id: "reg-1",
            nome: "Ácido Clorídrico 37% (HCl)",
            formula: "HCl",
            cas: "7647-01-0",
            categoria: "Ácidos",
            lote: "LOT-2026-014",
            validade: dataRelativaDias(240),
            tipo: "volume",
            quantidade: 1.5,
            unidade: "L",
            minimo: 0.5,
            local: "Capela A1"
        },
        {
            id: "reg-2",
            nome: "Etanol Absoluto P.A. 99,5%",
            formula: "C2H5OH",
            cas: "64-17-5",
            categoria: "Solventes",
            lote: "LOT-2026-089",
            validade: dataRelativaDias(195),
            tipo: "volume",
            quantidade: 420,
            unidade: "mL",
            minimo: 500,
            local: "Armário Inflamáveis B2"
        },
        {
            id: "reg-3",
            nome: "Tampão PBS 10x Estéril",
            formula: "NaCl / Fosfato",
            cas: "7647-14-5",
            categoria: "Tampões",
            lote: "PBS-10X-402",
            validade: dataRelativaDias(14),
            tipo: "volume",
            quantidade: 850,
            unidade: "mL",
            minimo: 300,
            local: "Geladeira 2°C–8°C"
        },
        {
            id: "reg-4",
            nome: "Kit Glicose Enzimática GOD-PAP",
            formula: "Enzimático",
            cas: "—",
            categoria: "Kits Clínicos",
            lote: "GLC-2025-11",
            validade: dataRelativaDias(-12),
            tipo: "volume",
            quantidade: 180,
            unidade: "mL",
            minimo: 100,
            local: "Geladeira Bioquímica"
        },
        {
            id: "reg-5",
            nome: "Cloreto de Sódio P.A.",
            formula: "NaCl",
            cas: "7647-14-5",
            categoria: "Sais",
            lote: "SAL-2026-031",
            validade: dataRelativaDias(410),
            tipo: "massa",
            quantidade: 1.2,
            unidade: "kg",
            minimo: 0.4,
            local: "Prateleira Sais C1"
        },
        {
            id: "reg-6",
            nome: "Azul de Metileno 1% Aquoso",
            formula: "C16H18ClN3S",
            cas: "61-73-4",
            categoria: "Corantes",
            lote: "COR-2026-007",
            validade: dataRelativaDias(22),
            tipo: "volume",
            quantidade: 95,
            unidade: "mL",
            minimo: 100,
            local: "Bancada Hematologia"
        },
        {
            id: "reg-7",
            nome: "Hidróxido de Sódio em Lentilhas",
            formula: "NaOH",
            cas: "1310-73-2",
            categoria: "Bases",
            lote: "BAS-2026-052",
            validade: dataRelativaDias(320),
            tipo: "massa",
            quantidade: 650,
            unidade: "g",
            minimo: 250,
            local: "Armário Bases D1"
        },
        {
            id: "reg-8",
            nome: "Água Ultrapura Tipo I (Milli-Q)",
            formula: "H2O",
            cas: "7732-18-5",
            categoria: "Solventes",
            lote: "H2O-2026-119",
            validade: dataRelativaDias(120),
            tipo: "volume",
            quantidade: 4.5,
            unidade: "L",
            minimo: 2,
            local: "Bancada Central"
        }
    ];
}

function criarHistoricoInicial() {
    const agora = new Date();
    const hora1 = agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    return [
        {
            id: "hist-seed-1",
            tipo: "Baixa",
            classe: "hist-baixa",
            reagente: "Etanol Absoluto P.A. 99,5%",
            lote: "LOT-2026-089",
            detalhe: "-80 mL (Saldo: 420 mL)",
            obs: "Higienização bancada microbiologia",
            horario: hora1
        },
        {
            id: "hist-seed-2",
            tipo: "Reposição",
            classe: "hist-reposicao",
            reagente: "Cloreto de Sódio P.A.",
            lote: "SAL-2026-031",
            detalhe: "+500 g (+0,5 kg)",
            obs: "Recebimento fornecedor",
            horario: hora1
        }
    ];
}

let reagentes = [];
let historico = [];
let filtroBusca = "";
let filtroCategoria = "todas";
let filtroStatus = "todos";
let unidadesExibicao = {};
let tipoConversor = "volume";
let acaoConfirmarPendente = null;

function carregarEstado() {
    try {
        const rawReg = localStorage.getItem(STORAGE_REAGENTES);
        const rawHist = localStorage.getItem(STORAGE_HISTORICO);
        reagentes = rawReg ? JSON.parse(rawReg) : criarDadosIniciais();
        historico = rawHist ? JSON.parse(rawHist) : criarHistoricoInicial();
        if (!Array.isArray(reagentes) || !reagentes.length && !rawReg) {
            reagentes = criarDadosIniciais();
        }
        if (!Array.isArray(historico)) {
            historico = criarHistoricoInicial();
        }
    } catch {
        reagentes = criarDadosIniciais();
        historico = criarHistoricoInicial();
    }
}

function salvarEstado() {
    try {
        localStorage.setItem(STORAGE_REAGENTES, JSON.stringify(reagentes));
        localStorage.setItem(STORAGE_HISTORICO, JSON.stringify(historico));
    } catch {
        // Ignora erro caso armazenamento esteja indisponível
    }
}

function avaliarStatus(reg) {
    const dias = calcularDiasRestantes(reg.validade);
    const vencido = dias < 0;
    const vencendo = dias >= 0 && dias <= 30;
    const reposicao = Number(reg.quantidade) <= Number(reg.minimo);
    const regular = !vencido && !vencendo && !reposicao;
    return { dias, vencido, vencendo, reposicao, regular };
}

function registrarHistorico(tipo, classe, reg, detalhe, obs = "") {
    const horario = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    historico.unshift({
        id: `hist-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
        tipo,
        classe,
        reagente: reg.nome,
        lote: reg.lote,
        detalhe,
        obs,
        horario
    });
    if (historico.length > 50) historico.pop();
    salvarEstado();
}

let toastTimer = null;
function mostrarToast(mensagem) {
    const el = document.getElementById("toast");
    el.textContent = mensagem;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        el.hidden = true;
    }, 3200);
}

function renderizarKPIsEAlertas() {
    let total = reagentes.length;
    let qtdReposicao = 0;
    let qtdValidade = 0;
    let qtdRegular = 0;
    let qtdVencidos = 0;
    let qtdVencendo = 0;

    reagentes.forEach(reg => {
        const st = avaliarStatus(reg);
        if (st.reposicao) qtdReposicao++;
        if (st.vencido || st.vencendo) qtdValidade++;
        if (st.vencido) qtdVencidos++;
        if (st.vencendo) qtdVencendo++;
        if (st.regular) qtdRegular++;
    });

    document.getElementById("kpi-total").textContent = total;
    document.getElementById("kpi-reposicao").textContent = qtdReposicao;
    document.getElementById("kpi-validade").textContent = qtdValidade;
    document.getElementById("kpi-ok").textContent = qtdRegular;

    document.querySelectorAll(".kpi-card").forEach(card => {
        card.classList.toggle("ativo", card.dataset.kpiFilter === filtroStatus);
    });

    const banner = document.getElementById("alert-banner");
    if (qtdReposicao === 0 && qtdValidade === 0) {
        banner.hidden = true;
        return;
    }

    const partes = [];
    if (qtdVencidos > 0) partes.push(`${qtdVencidos} vencido${qtdVencidos > 1 ? "s" : ""}`);
    if (qtdVencendo > 0) partes.push(`${qtdVencendo} perto do vencimento`);
    if (qtdReposicao > 0) partes.push(`${qtdReposicao} abaixo do mínimo`);

    banner.innerHTML = `
        <div class="alert-banner-info">
            <strong>Alertas ativos:</strong>
            <span>${partes.join(" • ")}.</span>
        </div>
        <div class="alert-banner-actions">
            ${qtdReposicao > 0 ? `<button type="button" class="alert-btn" data-quick-filter="reposicao">Ver Reposição</button>` : ""}
            ${qtdValidade > 0 ? `<button type="button" class="alert-btn" data-quick-filter="validade">Ver Validade</button>` : ""}
        </div>
    `;
    banner.hidden = false;

    banner.querySelectorAll("[data-quick-filter]").forEach(btn => {
        btn.addEventListener("click", () => aplicarFiltroStatus(btn.dataset.quickFilter));
    });
}

function aplicarFiltroStatus(status) {
    filtroStatus = status;
    document.querySelectorAll(".pill-filter").forEach(pill => {
        pill.classList.toggle("ativo", pill.dataset.status === status);
    });
    renderizarReagentes();
    renderizarKPIsEAlertas();
}

function renderizarReagentes() {
    const lista = document.getElementById("lista-reagentes");
    const vazio = document.getElementById("estado-vazio");
    const termo = filtroBusca.trim().toLowerCase();

    const filtrados = reagentes.filter(reg => {
        const st = avaliarStatus(reg);
        const bateCategoria = filtroCategoria === "todas" || reg.categoria === filtroCategoria;
        const texto = `${reg.nome} ${reg.formula} ${reg.cas} ${reg.lote} ${reg.local}`.toLowerCase();
        const bateBusca = !termo || texto.includes(termo);

        let bateStatus = true;
        if (filtroStatus === "regular") bateStatus = st.regular;
        else if (filtroStatus === "reposicao") bateStatus = st.reposicao;
        else if (filtroStatus === "vencendo") bateStatus = st.vencendo;
        else if (filtroStatus === "vencido") bateStatus = st.vencido;
        else if (filtroStatus === "validade") bateStatus = st.vencido || st.vencendo;

        return bateCategoria && bateBusca && bateStatus;
    });

    if (!filtrados.length) {
        lista.innerHTML = "";
        vazio.hidden = false;
        return;
    }

    vazio.hidden = true;
    lista.innerHTML = filtrados.map(reg => {
        const st = avaliarStatus(reg);
        const unExibicao = unidadesExibicao[reg.id] || reg.unidade;
        const qtdExibida = converterUnidade(reg.quantidade, reg.unidade, unExibicao, reg.tipo);
        const minExibido = converterUnidade(reg.minimo, reg.unidade, unExibicao, reg.tipo);
        const proxUnidade = TOGGLE_PROXIMA_UNIDADE[unExibicao] || reg.unidade;

        const proporcao = reg.minimo > 0 ? Math.min(100, Math.round((reg.quantidade / (reg.minimo * 2)) * 100)) : 100;
        const classeBarra = st.vencido ? "danger" : st.reposicao ? "warn" : "ok";

        let textoDias = `${st.dias} dias restantes`;
        let classeDias = "";
        if (st.dias < 0) {
            textoDias = `Vencido há ${Math.abs(st.dias)}d`;
            classeDias = "vencido";
        } else if (st.dias === 0) {
            textoDias = "Vence hoje";
            classeDias = "vencendo";
        } else if (st.dias <= 30) {
            textoDias = `Vence em ${st.dias}d`;
            classeDias = "vencendo";
        }

        const badges = [];
        if (st.vencido) badges.push(`<span class="status-badge badge-vencido">Vencido</span>`);
        if (st.vencendo) badges.push(`<span class="status-badge badge-vencendo">Vencendo</span>`);
        if (st.reposicao) badges.push(`<span class="status-badge badge-reposicao">Reposição</span>`);
        if (st.regular) badges.push(`<span class="status-badge badge-regular">Regular</span>`);

        return `
            <article class="reagente-row" data-id="${escapeHtml(reg.id)}">
                <div>
                    <div class="reagente-nome">${escapeHtml(reg.nome)}</div>
                    <div class="reagente-meta">
                        ${reg.formula ? `<span class="formula-chip">${escapeHtml(reg.formula)}</span>` : ""}
                        ${reg.cas && reg.cas !== "—" ? `<span>CAS ${escapeHtml(reg.cas)}</span>` : ""}
                        <span>${escapeHtml(reg.categoria)}</span>
                        ${reg.local ? `<span>&#128205; ${escapeHtml(reg.local)}</span>` : ""}
                    </div>
                </div>

                <div>
                    <div class="lote-codigo">${escapeHtml(reg.lote)}</div>
                    <div class="validade-data">
                        Val.: ${formatarDataBR(reg.validade)}
                        &bull; <span class="validade-dias ${classeDias}">${textoDias}</span>
                    </div>
                </div>

                <div>
                    <div class="qtd-linha">
                        <span class="qtd-valor">${formatarNumero(qtdExibida)} ${rotuloUnidade(unExibicao)}</span>
                        <button type="button" class="btn-unidade-toggle" data-action="toggle-unit" data-id="${escapeHtml(reg.id)}" title="Alternar unidade de exibição">&#8644; ${rotuloUnidade(proxUnidade)}</button>
                    </div>
                    <div class="stock-bar"><div class="stock-bar-fill ${classeBarra}" style="width: ${proporcao}%"></div></div>
                    <div class="minimo-label">Mínimo: ${formatarNumero(minExibido)} ${rotuloUnidade(unExibicao)}</div>
                </div>

                <div class="badges-col">${badges.join("")}</div>

                <div class="row-actions">
                    <button type="button" class="btn-mini baixa" data-action="baixa" data-id="${escapeHtml(reg.id)}">Baixa</button>
                    <button type="button" class="btn-mini repor" data-action="repor" data-id="${escapeHtml(reg.id)}">Repor</button>
                    <button type="button" class="btn-mini editar" data-action="editar" data-id="${escapeHtml(reg.id)}">Editar</button>
                    <button type="button" class="btn-mini excluir" data-action="excluir" data-id="${escapeHtml(reg.id)}">Excluir</button>
                </div>
            </article>
        `;
    }).join("");
}

function renderizarHistorico() {
    document.getElementById("badge-historico").textContent = historico.length;
    const lista = document.getElementById("lista-historico");
    if (!historico.length) {
        lista.innerHTML = `<div class="estado-vazio"><p>Nenhuma movimentação registrada ainda.</p></div>`;
        return;
    }

    lista.innerHTML = historico.map(item => `
        <div class="hist-item">
            <div class="hist-left">
                <span class="hist-tipo ${escapeHtml(item.classe)}">${escapeHtml(item.tipo)}</span>
                <div>
                    <div class="hist-detalhe"><strong>${escapeHtml(item.reagente)}</strong> (${escapeHtml(item.lote)}) &mdash; ${escapeHtml(item.detalhe)}</div>
                    ${item.obs ? `<div class="hist-obs">${escapeHtml(item.obs)}</div>` : ""}
                </div>
            </div>
            <span class="hist-time">${escapeHtml(item.horario)}</span>
        </div>
    `).join("");
}

function popularSelectUnidades(selectEl, tipo, selecionada) {
    const opcoes = Object.keys(FATORES_UNIDADE[tipo]);
    selectEl.innerHTML = opcoes
        .map(un => `<option value="${un}" ${un === selecionada ? "selected" : ""}>${rotuloUnidade(un)}</option>`)
        .join("");
}

function abrirModal(id) {
    const modal = document.getElementById(id);
    modal.hidden = false;
    const primeiroCampo = modal.querySelector("input:not([type=hidden]), select, button");
    if (primeiroCampo) primeiroCampo.focus();
}

function fecharModal(id) {
    document.getElementById(id).hidden = true;
}

function abrirModalReagente(reg = null) {
    const erro = document.getElementById("reg-erro");
    erro.hidden = true;

    if (reg) {
        document.getElementById("modal-reagente-titulo").textContent = "Editar Reagente";
        document.getElementById("reg-id").value = reg.id;
        document.getElementById("reg-nome").value = reg.nome;
        document.getElementById("reg-formula").value = reg.formula || "";
        document.getElementById("reg-cas").value = reg.cas && reg.cas !== "—" ? reg.cas : "";
        document.getElementById("reg-categoria").value = reg.categoria;
        document.getElementById("reg-lote").value = reg.lote;
        document.getElementById("reg-validade").value = reg.validade;
        document.getElementById("reg-tipo").value = reg.tipo;
        popularSelectUnidades(document.getElementById("reg-unidade"), reg.tipo, reg.unidade);
        document.getElementById("reg-quantidade").value = reg.quantidade;
        document.getElementById("reg-minimo").value = reg.minimo;
        document.getElementById("reg-local").value = reg.local || "";
    } else {
        document.getElementById("modal-reagente-titulo").textContent = "Novo Reagente";
        document.getElementById("form-reagente").reset();
        document.getElementById("reg-id").value = "";
        document.getElementById("reg-tipo").value = "volume";
        popularSelectUnidades(document.getElementById("reg-unidade"), "volume", "mL");
        document.getElementById("reg-validade").value = dataRelativaDias(180);
    }
    abrirModal("modal-reagente");
}

function atualizarPreviewMovimento() {
    const id = document.getElementById("mov-id").value;
    const tipoMov = document.getElementById("mov-tipo").value;
    const reg = reagentes.find(r => r.id === id);
    if (!reg) return;

    const valor = parseFloat(document.getElementById("mov-valor").value);
    const unEntrada = document.getElementById("mov-unidade").value;
    const preview = document.getElementById("mov-preview");
    const erro = document.getElementById("mov-erro");
    erro.hidden = true;

    if (!valor || valor <= 0) {
        preview.textContent = "Informe uma quantidade maior que zero para calcular a conversão.";
        return;
    }

    const convertido = converterUnidade(valor, unEntrada, reg.unidade, reg.tipo);
    const novoSaldo = tipoMov === "baixa"
        ? arredondar(reg.quantidade - convertido)
        : arredondar(reg.quantidade + convertido);

    const eqTexto = unEntrada !== reg.unidade
        ? `Equivale a <strong>${formatarNumero(convertido)} ${rotuloUnidade(reg.unidade)}</strong> &rarr; `
        : "";

    preview.innerHTML = `${eqTexto}Novo saldo previsto: <strong>${formatarNumero(novoSaldo)} ${rotuloUnidade(reg.unidade)}</strong>`;
}

function abrirModalMovimento(reg, tipoMov) {
    document.getElementById("mov-id").value = reg.id;
    document.getElementById("mov-tipo").value = tipoMov;
    document.getElementById("mov-titulo").textContent = tipoMov === "baixa" ? "Dar Baixa (Consumo)" : "Repor Lote (Entrada)";
    document.getElementById("mov-reagente-nome").textContent = `${reg.nome} (${reg.lote})`;
    document.getElementById("mov-saldo-atual").textContent = `Saldo atual: ${formatarNumero(reg.quantidade)} ${rotuloUnidade(reg.unidade)}`;
    document.getElementById("mov-valor").value = "";
    document.getElementById("mov-observacao").value = "";
    document.getElementById("mov-erro").hidden = true;
    popularSelectUnidades(document.getElementById("mov-unidade"), reg.tipo, reg.unidade);
    atualizarPreviewMovimento();
    abrirModal("modal-movimento");
}

function abrirConfirmacao(titulo, texto, callback) {
    document.getElementById("confirm-titulo").textContent = titulo;
    document.getElementById("confirm-texto").textContent = texto;
    acaoConfirmarPendente = callback;
    abrirModal("modal-confirmar");
}

function atualizarConversor() {
    const valor = parseFloat(document.getElementById("conv-valor").value);
    const de = document.getElementById("conv-de").value;
    const para = document.getElementById("conv-para").value;
    const box = document.getElementById("conv-resultado");
    const tabela = document.getElementById("conv-tabela");

    if (Number.isNaN(valor) || valor < 0) {
        box.innerHTML = `<span class="result-label">Resultado da conversão</span><strong class="result-value">Informe um valor válido</strong>`;
        tabela.innerHTML = "";
        return;
    }

    const res = converterUnidade(valor, de, para, tipoConversor);
    box.innerHTML = `<span class="result-label">${formatarNumero(valor)} ${rotuloUnidade(de)} equivale a</span><strong class="result-value">${formatarNumero(res)} ${rotuloUnidade(para)}</strong>`;

    const unidades = Object.keys(FATORES_UNIDADE[tipoConversor]);
    tabela.innerHTML = unidades.map(un => {
        const valUn = converterUnidade(valor, de, un, tipoConversor);
        return `<div class="equiv-item"><span>Em ${rotuloUnidade(un)}</span><strong>${formatarNumero(valUn)} ${rotuloUnidade(un)}</strong></div>`;
    }).join("");
}

function atualizarDiluicao() {
    const c1 = parseFloat(document.getElementById("dil-c1").value);
    const c2 = parseFloat(document.getElementById("dil-c2").value);
    const v2 = parseFloat(document.getElementById("dil-v2").value);
    const un = document.getElementById("dil-unidade").value;
    const box = document.getElementById("dil-resultado");

    if (!c1 || c1 <= 0 || !c2 || c2 <= 0 || !v2 || v2 <= 0) {
        box.innerHTML = `<span class="dil-erro">Preencha C&#8321;, C&#8322; e V&#8322; com valores maiores que zero.</span>`;
        return;
    }
    if (c2 > c1) {
        box.innerHTML = `<span class="dil-erro">A concentração desejada (C&#8322;) não pode ser maior que a inicial (C&#8321;).</span>`;
        return;
    }

    const v1 = arredondar((c2 * v2) / c1);
    const solvente = arredondar(v2 - v1);

    box.innerHTML = `
        <span class="result-label">Receita de preparo (${formatarNumero(c2)} ${escapeHtml(un)})</span>
        <div class="dil-breakdown">
            <div><strong>Solução estoque (V&#8321;):</strong> <span class="mono">${formatarNumero(v1)} mL</span></div>
            <div><strong>Solvente / Diluente:</strong> <span class="mono">${formatarNumero(solvente)} mL</span></div>
            <div><strong>Volume final (V&#8322;):</strong> <span class="mono">${formatarNumero(v2)} mL</span></div>
        </div>
    `;
}

function exportarCSV() {
    const cabecalho = ["Nome", "Formula", "CAS", "Categoria", "Lote", "Validade", "Quantidade", "Unidade", "Estoque Minimo", "Localizacao", "Situacao"];
    const linhas = reagentes.map(reg => {
        const st = avaliarStatus(reg);
        const situacoes = [];
        if (st.vencido) situacoes.push("Vencido");
        if (st.vencendo) situacoes.push("Vencendo");
        if (st.reposicao) situacoes.push("Reposição");
        if (st.regular) situacoes.push("Regular");

        return [
            reg.nome,
            reg.formula || "",
            reg.cas || "",
            reg.categoria,
            reg.lote,
            formatarDataBR(reg.validade),
            formatarNumero(reg.quantidade),
            rotuloUnidade(reg.unidade),
            formatarNumero(reg.minimo),
            reg.local || "",
            situacoes.join(" / ")
        ].map(campo => `"${String(campo).replace(/"/g, '""')}"`).join(";");
    });

    const csv = "\uFEFF" + [cabecalho.join(";"), ...linhas].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `molaris-stock-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    mostrarToast("Inventário exportado em CSV.");
}

function configurarEventos() {
    // Abas
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const tab = btn.dataset.tab;
            document.querySelectorAll(".tab-btn").forEach(b => {
                const ativo = b === btn;
                b.classList.toggle("ativo", ativo);
                b.setAttribute("aria-selected", ativo ? "true" : "false");
            });
            document.querySelectorAll(".tab-panel").forEach(panel => {
                panel.hidden = panel.id !== `panel-${tab}`;
            });
        });
    });

    // KPIs filtram e abrem aba Estoque
    document.querySelectorAll(".kpi-card").forEach(card => {
        card.addEventListener("click", () => {
            document.getElementById("tab-estoque").click();
            aplicarFiltroStatus(card.dataset.kpiFilter);
        });
    });

    // Busca, Categoria e Pills
    document.getElementById("busca-input").addEventListener("input", e => {
        filtroBusca = e.target.value;
        renderizarReagentes();
    });

    document.getElementById("filtro-categoria").addEventListener("change", e => {
        filtroCategoria = e.target.value;
        renderizarReagentes();
    });

    document.querySelectorAll(".pill-filter").forEach(pill => {
        pill.addEventListener("click", () => aplicarFiltroStatus(pill.dataset.status));
    });

    document.getElementById("btn-limpar-filtros").addEventListener("click", () => {
        filtroBusca = "";
        filtroCategoria = "todas";
        document.getElementById("busca-input").value = "";
        document.getElementById("filtro-categoria").value = "todas";
        aplicarFiltroStatus("todos");
    });

    // Ações na lista de reagentes (delegação de eventos)
    document.getElementById("lista-reagentes").addEventListener("click", e => {
        const btn = e.target.closest("[data-action]");
        if (!btn) return;
        const id = btn.dataset.id;
        const acao = btn.dataset.action;
        const reg = reagentes.find(r => r.id === id);
        if (!reg) return;

        if (acao === "toggle-unit") {
            const atual = unidadesExibicao[id] || reg.unidade;
            unidadesExibicao[id] = TOGGLE_PROXIMA_UNIDADE[atual] || reg.unidade;
            renderizarReagentes();
        } else if (acao === "baixa" || acao === "repor") {
            abrirModalMovimento(reg, acao);
        } else if (acao === "editar") {
            abrirModalReagente(reg);
        } else if (acao === "excluir") {
            abrirConfirmacao(
                "Excluir Reagente",
                `Deseja remover "${reg.nome}" (${reg.lote}) do estoque desta demonstração?`,
                () => {
                    reagentes = reagentes.filter(r => r.id !== reg.id);
                    registrarHistorico("Exclusão", "hist-exclusao", reg, "Lote removido do estoque");
                    renderTudo();
                    mostrarToast("Reagente removido.");
                }
            );
        }
    });

    // Botões do topo
    document.getElementById("btn-novo-reagente").addEventListener("click", () => abrirModalReagente(null));
    document.getElementById("btn-exportar-csv").addEventListener("click", exportarCSV);
    document.getElementById("btn-restaurar-demo").addEventListener("click", () => {
        abrirConfirmacao(
            "Restaurar Dados da Demonstração",
            "Isso restaurará os 8 reagentes de exemplo e o histórico inicial no seu navegador. Continuar?",
            () => {
                reagentes = criarDadosIniciais();
                historico = criarHistoricoInicial();
                unidadesExibicao = {};
                filtroBusca = "";
                filtroCategoria = "todas";
                document.getElementById("busca-input").value = "";
                document.getElementById("filtro-categoria").value = "todas";
                salvarEstado();
                aplicarFiltroStatus("todos");
                renderizarHistorico();
                mostrarToast("Dados de demonstração restaurados.");
            }
        );
    });

    document.getElementById("btn-limpar-historico").addEventListener("click", () => {
        if (!historico.length) return;
        abrirConfirmacao(
            "Limpar Histórico",
            "Deseja apagar todas as movimentações registradas nesta sessão?",
            () => {
                historico = [];
                salvarEstado();
                renderizarHistorico();
                mostrarToast("Histórico limpo.");
            }
        );
    });

    // Tipo de medida muda unidades no modal de reagente
    document.getElementById("reg-tipo").addEventListener("change", e => {
        const tipo = e.target.value;
        popularSelectUnidades(document.getElementById("reg-unidade"), tipo, tipo === "volume" ? "mL" : "g");
    });

    // Submit Cadastro/Edição
    document.getElementById("form-reagente").addEventListener("submit", e => {
        e.preventDefault();
        const id = document.getElementById("reg-id").value;
        const nome = document.getElementById("reg-nome").value.trim();
        const formula = document.getElementById("reg-formula").value.trim();
        const cas = document.getElementById("reg-cas").value.trim() || "—";
        const categoria = document.getElementById("reg-categoria").value;
        const lote = document.getElementById("reg-lote").value.trim();
        const validade = document.getElementById("reg-validade").value;
        const tipo = document.getElementById("reg-tipo").value;
        const quantidade = parseFloat(document.getElementById("reg-quantidade").value);
        const unidade = document.getElementById("reg-unidade").value;
        const minimo = parseFloat(document.getElementById("reg-minimo").value);
        const local = document.getElementById("reg-local").value.trim();
        const erro = document.getElementById("reg-erro");

        if (!nome || !lote || !validade || Number.isNaN(quantidade) || quantidade < 0 || Number.isNaN(minimo) || minimo < 0) {
            erro.textContent = "Preencha todos os campos obrigatórios com valores válidos.";
            erro.hidden = false;
            return;
        }

        if (id) {
            const idx = reagentes.findIndex(r => r.id === id);
            if (idx !== -1) {
                reagentes[idx] = { id, nome, formula, cas, categoria, lote, validade, tipo, quantidade: arredondar(quantidade), unidade, minimo: arredondar(minimo), local };
                delete unidadesExibicao[id];
                registrarHistorico("Edição", "hist-edicao", reagentes[idx], `Saldo ajustado: ${formatarNumero(quantidade)} ${rotuloUnidade(unidade)}`);
                mostrarToast("Reagente atualizado.");
            }
        } else {
            const novo = {
                id: `reg-${Date.now()}`,
                nome,
                formula,
                cas,
                categoria,
                lote,
                validade,
                tipo,
                quantidade: arredondar(quantidade),
                unidade,
                minimo: arredondar(minimo),
                local
            };
            reagentes.unshift(novo);
            registrarHistorico("Cadastro", "hist-cadastro", novo, `Entrada inicial: ${formatarNumero(quantidade)} ${rotuloUnidade(unidade)}`);
            mostrarToast("Novo reagente cadastrado.");
        }

        fecharModal("modal-reagente");
        renderTudo();
    });

    // Movimento (Baixa / Reposição)
    document.getElementById("mov-valor").addEventListener("input", atualizarPreviewMovimento);
    document.getElementById("mov-unidade").addEventListener("change", atualizarPreviewMovimento);

    document.getElementById("form-movimento").addEventListener("submit", e => {
        e.preventDefault();
        const id = document.getElementById("mov-id").value;
        const tipoMov = document.getElementById("mov-tipo").value;
        const valor = parseFloat(document.getElementById("mov-valor").value);
        const unEntrada = document.getElementById("mov-unidade").value;
        const obs = document.getElementById("mov-observacao").value.trim();
        const erro = document.getElementById("mov-erro");

        const reg = reagentes.find(r => r.id === id);
        if (!reg) return;

        if (!valor || valor <= 0) {
            erro.textContent = "Informe uma quantidade maior que zero.";
            erro.hidden = false;
            return;
        }

        const convertido = converterUnidade(valor, unEntrada, reg.unidade, reg.tipo);
        const novoSaldo = tipoMov === "baixa"
            ? arredondar(reg.quantidade - convertido)
            : arredondar(reg.quantidade + convertido);

        if (tipoMov === "baixa" && novoSaldo < 0) {
            erro.textContent = `Saldo insuficiente: a baixa de ${formatarNumero(convertido)} ${rotuloUnidade(reg.unidade)} supera os ${formatarNumero(reg.quantidade)} ${rotuloUnidade(reg.unidade)} disponíveis.`;
            erro.hidden = false;
            return;
        }

        reg.quantidade = novoSaldo;
        const sinal = tipoMov === "baixa" ? "-" : "+";
        const eq = unEntrada !== reg.unidade ? ` (${sinal}${formatarNumero(convertido)} ${rotuloUnidade(reg.unidade)})` : "";
        const detalhe = `${sinal}${formatarNumero(valor)} ${rotuloUnidade(unEntrada)}${eq} → Saldo: ${formatarNumero(novoSaldo)} ${rotuloUnidade(reg.unidade)}`;

        registrarHistorico(
            tipoMov === "baixa" ? "Baixa" : "Reposição",
            tipoMov === "baixa" ? "hist-baixa" : "hist-reposicao",
            reg,
            detalhe,
            obs
        );

        fecharModal("modal-movimento");
        renderTudo();
        mostrarToast(tipoMov === "baixa" ? "Baixa registrada com sucesso." : "Reposição registrada com sucesso.");
    });

    // Modal Confirmar
    document.getElementById("btn-confirmar-acao").addEventListener("click", () => {
        const fn = acaoConfirmarPendente;
        acaoConfirmarPendente = null;
        fecharModal("modal-confirmar");
        if (fn) fn();
    });

    // Fechar modais (botões, clique fora, Esc)
    document.querySelectorAll("[data-close-modal]").forEach(btn => {
        btn.addEventListener("click", () => fecharModal(btn.dataset.closeModal));
    });

    document.querySelectorAll(".modal-overlay").forEach(overlay => {
        overlay.addEventListener("click", e => {
            if (e.target === overlay) fecharModal(overlay.id);
        });
    });

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            document.querySelectorAll(".modal-overlay:not([hidden])").forEach(m => {
                m.hidden = true;
            });
        }
    });

    // Conversor
    document.querySelectorAll("[data-conv-tipo]").forEach(btn => {
        btn.addEventListener("click", () => {
            tipoConversor = btn.dataset.convTipo;
            document.querySelectorAll("[data-conv-tipo]").forEach(b => b.classList.toggle("ativo", b === btn));
            if (tipoConversor === "volume") {
                popularSelectUnidades(document.getElementById("conv-de"), "volume", "mL");
                popularSelectUnidades(document.getElementById("conv-para"), "volume", "L");
            } else {
                popularSelectUnidades(document.getElementById("conv-de"), "massa", "mg");
                popularSelectUnidades(document.getElementById("conv-para"), "massa", "g");
            }
            atualizarConversor();
        });
    });

    document.getElementById("btn-swap-unidades").addEventListener("click", () => {
        const de = document.getElementById("conv-de");
        const para = document.getElementById("conv-para");
        const temp = de.value;
        de.value = para.value;
        para.value = temp;
        atualizarConversor();
    });

    document.getElementById("conv-valor").addEventListener("input", atualizarConversor);
    document.getElementById("conv-de").addEventListener("change", atualizarConversor);
    document.getElementById("conv-para").addEventListener("change", atualizarConversor);

    // Diluição
    ["dil-c1", "dil-c2", "dil-v2", "dil-unidade"].forEach(id => {
        document.getElementById(id).addEventListener("input", atualizarDiluicao);
        document.getElementById(id).addEventListener("change", atualizarDiluicao);
    });
}

function renderTudo() {
    salvarEstado();
    renderizarKPIsEAlertas();
    renderizarReagentes();
    renderizarHistorico();
}

document.addEventListener("DOMContentLoaded", () => {
    carregarEstado();
    popularSelectUnidades(document.getElementById("conv-de"), "volume", "mL");
    popularSelectUnidades(document.getElementById("conv-para"), "volume", "L");
    configurarEventos();
    renderTudo();
    atualizarConversor();
    atualizarDiluicao();
});
