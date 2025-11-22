// Sprint_Capacity.js
// All JS moved from Sprint_Capacity.html

let integrantes = [];
let metas = [];
let atividades = [];
let sprintInfos = [];
let feriados = [];
let gmuds = [];
function renderIntegrantes() {
    let html = '';
    integrantes.forEach((intg, idx) => {
        html += `<div class='meta-item'><span class='meta-label'>${intg.nome}</span> <span class='meta-resp'>${intg.funcao}</span> <button class='meta-remove' onclick='removeIntegrante(${idx})'>Remover</button></div>`;
    });
    document.getElementById('integrantesList').innerHTML = html;
    renderMetaResponsaveis();
}
function addIntegrante() {
    const nome = document.getElementById('integranteNome').value;
    const funcao = document.getElementById('integranteFuncao').value;
    integrantes.push({nome, funcao});
    renderIntegrantes();
    document.getElementById('integranteForm').reset();
}
function removeIntegrante(idx) {
    integrantes.splice(idx,1);
    renderIntegrantes();
}
function renderMetaResponsaveis() {
    const select = document.getElementById('metaRespInput');
    select.innerHTML = '<option value="">Responsável</option>';
    integrantes.forEach(intg => {
        select.innerHTML += `<option value="${intg.nome}">${intg.nome}</option>`;
    });
}
function renderMetas() {
    let html = '';
    metas.forEach((meta, idx) => {
        html += `<div class='meta-item'><span class='meta-label'>${meta.text}</span> <span class='meta-resp'>${meta.resp}</span> <button class='meta-remove' onclick='removeMeta(${idx})'>Remover</button></div>`;
    });
    document.getElementById('metasList').innerHTML = html;
}
function addMeta() {
    const metaText = document.getElementById('metaInput').value;
    const metaResp = document.getElementById('metaRespInput').value;
    if (!metaResp) return;
    metas.push({text: metaText, resp: metaResp});
    renderMetas();
    document.getElementById('metaForm').reset();
}
function removeMeta(idx) {
    metas.splice(idx,1);
    renderMetas();
}
// Capacity Card
const diasSemana = ["SEG", "TER", "QUA", "QUI", "SEX"];
let capacityHeaders = [];
let capacityRows = [];
let capacityData = [];
let capacityColIndex = 0;
function renderCapacityTable() {
    let html = '<table style="width:100%;border-collapse:collapse;">';
    html += '<thead><tr>';
    html += '<th style="border:1px solid #e0e0e0;padding:8px;background:#e9eef2;">Colaborador</th>';
    capacityHeaders.forEach((h, idx) => {
        html += `<th style='border:1px solid #e0e0e0;padding:8px;background:#e9eef2;'>${h}</th>`;
    });
    html += '<th style="border:1px solid #e0e0e0;padding:8px;background:#e9eef2;">Remover</th>';
    html += '</tr></thead><tbody>';
    capacityRows.forEach((row, rIdx) => {
        html += '<tr>';
        html += `<td style='border:1px solid #e0e0e0;padding:6px;'><select onchange='editCapacityRow(${rIdx}, this.value)' style='width:100%;padding:4px;border-radius:4px;border:1px solid #d0d0d0;font-size:15px;'>`;
        html += `<option value="">Selecione</option>`;
        integrantes.forEach(intg => {
            html += `<option value="${intg.nome}"${row === intg.nome ? ' selected' : ''}>${intg.nome}</option>`;
        });
        html += `</select></td>`;
        for(let c=0; c<capacityHeaders.length; c++) {
            let val = capacityData[rIdx] && capacityData[rIdx][c] != null ? capacityData[rIdx][c] : 7.0;
            let inputClass = (parseFloat(val) === 7.) ? 'bg-verde' : 'bg-vermelho';
            html += `<td style='border:1px solid #e0e0e0;padding:6px;'><input type='number' min='0' value='${val}' onchange='editCapacityCell(${rIdx},${c},this.value)' style='width:60px;text-align:center;' class='${inputClass}' /></td>`;
        }
        html += `<td style='border:1px solid #e0e0e0;padding:6px;'><button onclick='removeCapacityRow(${rIdx})' style='background:#e74c3c;color:#fff;border:none;border-radius:4px;padding:4px 10px;cursor:pointer;'>Remover</button></td>`;
        html += '</tr>';
    });
    html += '</tbody></table>';
    document.getElementById('capacityTableContainer').innerHTML = html;
}
function addCapacityRow() {
    capacityRows.push("");
    let newRow = [];
    for(let c=0; c<capacityHeaders.length; c++) newRow.push(7.0);
    capacityData.push(newRow);
    updateCapacityAndSumarizador();
}
function addCapacityCol() {
    const nextDia = diasSemana[capacityColIndex % diasSemana.length];
    capacityHeaders.push(nextDia);
    capacityColIndex++;
    capacityRows.forEach((_, idx) => {
        if (!capacityData[idx]) capacityData[idx] = [];
        capacityData[idx].push(7.0);
    });
    updateCapacityAndSumarizador();
}
function removeCapacityCol() {
    if (capacityHeaders.length === 0) return;
    capacityHeaders.pop();
    capacityColIndex = Math.max(0, capacityColIndex - 1);
    capacityRows.forEach((_, idx) => {
        if (capacityData[idx]) capacityData[idx].pop();
    });
    updateCapacityAndSumarizador();
}
function editCapacityRow(idx, val) {
    capacityRows[idx] = val;
    updateCapacityAndSumarizador();
}
function editCapacityCell(rIdx, cIdx, val) {
    if (!capacityData[rIdx]) capacityData[rIdx] = [];
    capacityData[rIdx][cIdx] = parseFloat(val) || 0;
    updateCapacityAndSumarizador();
}
function removeCapacityRow(idx) {
    capacityRows.splice(idx,1);
    capacityData.splice(idx,1);
    updateCapacityAndSumarizador();
}
// Sumarizador de Capacity
function renderSumarizadorTable() {
    let html = '<table style="width:100%;border-collapse:collapse;">';
    html += '<thead><tr>';
    html += '<th style="border:1px solid #e0e0e0;padding:8px;background:#e9eef2;">Colaborador</th>';
    // Adiciona colunas para cada dia da semana
    capacityHeaders.forEach((h, idx) => {
        html += `<th style='border:1px solid #e0e0e0;padding:8px;background:#e9eef2;'>${h}</th>`;
    });
    html += '<th style="border:1px solid #e0e0e0;padding:8px;background:#e9eef2;">Total de Horas</th>';
    html += '</tr></thead><tbody>';
    capacityRows.forEach((row, rIdx) => {
        if (!row) return;
        let total = 0;
        html += `<tr><td style='border:1px solid #e0e0e0;padding:6px;'>${row}</td>`;
        for(let c=0; c<capacityHeaders.length; c++) {
            let val = capacityData[rIdx] && capacityData[rIdx][c] != null ? capacityData[rIdx][c] : 0;
            total += parseFloat(val) || 0;
            html += `<td style='border:1px solid #e0e0e0;padding:6px;'>${val}</td>`;
        }
        html += `<td style='border:1px solid #e0e0e0;padding:6px;font-weight:600;'>${total}</td></tr>`;
    });
    html += '</tbody></table>';
    document.getElementById('sumarizadorTableContainer').innerHTML = html;
}
// Atualiza sumarizador sempre que a tabela de capacity muda
function updateCapacityAndSumarizador() {
    renderCapacityTable();
    renderSumarizadorTable();
}
// Inicializa tabelas
renderCapacityTable();
renderSumarizadorTable();
renderIntegrantes();
renderMetas();
// Atualiza Capacity e Sumarizador ao adicionar/remover integrantes
const oldAddIntegrante = addIntegrante;
addIntegrante = function() {
    oldAddIntegrante();
    updateCapacityAndSumarizador();
}
const oldRemoveIntegrante = removeIntegrante;
removeIntegrante = function(idx) {
    oldRemoveIntegrante(idx);
    updateCapacityAndSumarizador();
}
function renderAtividadesResp() {
    const select = document.getElementById('atividadeResp');
    select.innerHTML = '<option value="">Responsável</option>';
    integrantes.forEach(intg => {
        select.innerHTML += `<option value="${intg.nome}">${intg.nome}</option>`;
    });
}
function getCapacityTotalByColaborador(nome) {
    let idx = capacityRows.findIndex(row => row === nome);
    if (idx === -1) return 0;
    let total = 0;
    for(let c=0; c<capacityHeaders.length; c++) {
        let val = capacityData[idx] && capacityData[idx][c] != null ? capacityData[idx][c] : 0;
        total += parseFloat(val) || 0;
    }
    return total;
}
function renderAtividadesTable() {
    let html = '<table style="width:100%;border-collapse:collapse;">';
    html += '<thead><tr>';
    html += '<th style="border:1px solid #e0e0e0;padding:8px;background:#e9eef2;">Link do Jira</th>';
    html += '<th style="border:1px solid #e0e0e0;padding:8px;background:#e9eef2;">Responsável</th>';
    html += '<th style="border:1px solid #e0e0e0;padding:8px;background:#e9eef2;">Estimativa (h)</th>';
    html += '<th style="border:1px solid #e0e0e0;padding:8px;background:#e9eef2;">Horas Restantes</th>';
    html += '<th style="border:1px solid #e0e0e0;padding:8px;background:#e9eef2;">Observação</th>';
    html += '<th style="border:1px solid #e0e0e0;padding:8px;background:#e9eef2;">Remover</th>';
    html += '</tr></thead><tbody>';
    // Map to track remaining hours per colaborador
    let horasRestantesPorColaborador = {};
    atividades.forEach((atv, idx) => {
        let totalCapacity = getCapacityTotalByColaborador(atv.resp);
        let prevRestante = horasRestantesPorColaborador[atv.resp] !== undefined ? horasRestantesPorColaborador[atv.resp] : totalCapacity;
        let horasRestantes = prevRestante - (parseFloat(atv.estimativa) || 0);
        horasRestantesPorColaborador[atv.resp] = horasRestantes;
        let horasClass = horasRestantes >= 0 ? 'horas-positivas' : 'horas-negativas';
        html += `<tr>`;
        html += `<td style='border:1px solid #e0e0e0;padding:6px;'><a href='${atv.jira}' target='_blank'>${atv.jira}</a></td>`;
        html += `<td style='border:1px solid #e0e0e0;padding:6px;'>${atv.resp}</td>`;
        html += `<td style='border:1px solid #e0e0e0;padding:6px;'>${atv.estimativa}</td>`;
        html += `<td style='border:1px solid #e0e0e0;padding:6px;'><span class='${horasClass}'>${horasRestantes}</span></td>`;
        html += `<td style='border:1px solid #e0e0e0;padding:6px;'>${atv.obs}</td>`;
        html += `<td style='border:1px solid #e0e0e0;padding:6px;'><button onclick='removeAtividade(${idx})' style='background:#e74c3c;color:#fff;border:none;border-radius:4px;padding:4px 10px;cursor:pointer;'>Remover</button></td>`;
        html += `</tr>`;
    });
    html += '</tbody></table>';
    document.getElementById('atividadesTableContainer').innerHTML = html;
}
function addAtividade() {
    const jira = document.getElementById('atividadeJira').value;
    const resp = document.getElementById('atividadeResp').value;
    const estimativa = document.getElementById('atividadeEstimativa').value;
    const obs = document.getElementById('atividadeObs').value;
    atividades.push({jira, resp, estimativa, obs});
    renderAtividadesTable();
    document.getElementById('atividadeForm').reset();
}
function removeAtividade(idx) {
    atividades.splice(idx,1);
    renderAtividadesTable();
}
// Atualiza responsáveis das atividades ao mudar integrantes
const oldAddIntegrante2 = addIntegrante;
addIntegrante = function() {
    oldAddIntegrante2();
    renderAtividadesResp();
    updateCapacityAndSumarizador();
}
const oldRemoveIntegrante2 = removeIntegrante;
removeIntegrante = function(idx) {
    oldRemoveIntegrante2(idx);
    renderAtividadesResp();
    updateCapacityAndSumarizador();
}
// Inicializa tabela de atividades
renderAtividadesResp();
renderAtividadesTable();
function exportJSON() {
    // Calcula horas restantes para cada atividade
    let horasRestantesPorColaborador = {};
    const atividadesComHoras = atividades.map((atv) => {
        let totalCapacity = getCapacityTotalByColaborador(atv.resp);
        let prevRestante = horasRestantesPorColaborador[atv.resp] !== undefined ? horasRestantesPorColaborador[atv.resp] : totalCapacity;
        let horasRestantes = prevRestante - (parseFloat(atv.estimativa) || 0);
        horasRestantesPorColaborador[atv.resp] = horasRestantes;
        return {
            ...atv,
            horasRestantes: horasRestantes
        };
    });
    const json = {
        informacoesSprint: {
            sprintInfos: [...sprintInfos],
            feriados: [...feriados],
            semJanelasGmuds: [...gmuds]
        },
        integrantes: [...integrantes],
        metas: [...metas],
        capacity: {
            headers: [...capacityHeaders],
            rows: [...capacityRows],
            data: JSON.parse(JSON.stringify(capacityData))
        },
        atividades: atividadesComHoras
    };
    const blob = new Blob([JSON.stringify(json, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sprint_capacity.json';
    a.click();
    URL.revokeObjectURL(url);
}
function addSprintInfo() {
    const nome = document.getElementById('sprintNome').value;
    const inicio = document.getElementById('sprintInicio').value;
    const fim = document.getElementById('sprintFim').value;
    if (!nome || !inicio || !fim) return;
    sprintInfos = [{nome, inicio, fim}];
    renderSprintResumo();
}
// Alteração solicitada "hora e dia" - Ajuste data início
function formatDateBR(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    // Corrige fuso horário para evitar exibir um dia antes
    const userTimezoneOffset = d.getTimezoneOffset() * 60000;
    const localDate = new Date(d.getTime() + userTimezoneOffset);
    const dia = String(localDate.getDate()).padStart(2, '0');
    const mes = String(localDate.getMonth() + 1).padStart(2, '0');
    const ano = localDate.getFullYear();
    return `${dia}/${mes}/${ano}`;
}
function renderSprintResumo() {
    const resumoDiv = document.getElementById('sprintResumo');
    if (sprintInfos.length === 0) { resumoDiv.innerHTML = ''; return; }
    const info = sprintInfos[0];
    resumoDiv.innerHTML = `<div style='background:#f4f6f8;padding:10px 10px;border-radius:8px;margin-top:10px;display:flex;align-items:center;gap:18px;'>
        <span style='font-weight:400;'></span> <span><strong>${info.nome}</strong></span>
        <span style='font-weight:400;'>Início:</span> <span>${formatDateBR(info.inicio)}</span>
        <span style='font-weight:400;'>Fim:</span> <span>${formatDateBR(info.fim)}</span>
        <button onclick='removeSprintInfo()' style='background:#e74c3c;color:#fff;border:none;border-radius:4px;padding:4px 10px;cursor:pointer;margin-left:auto;'>Excluir</button>
    </div>`;
}
function removeSprintInfo() {
    sprintInfos = [];
    renderSprintResumo();
}
function addFeriado() {
    const data = document.getElementById('feriadoData').value;
    if (!data || feriados.includes(data)) return;
    feriados.push(data);
    renderFeriadosLista();
    document.getElementById('feriadoData').value = '';
}
function renderFeriadosLista() {
    const listaDiv = document.getElementById('feriadosLista');
    if (feriados.length === 0) { listaDiv.innerHTML = ''; return; }
    listaDiv.innerHTML = feriados.map((d, idx) => {
        // Criação robusta da data local
        const [ano, mes, dia] = d.split('-').map(Number);
        const dateObj = new Date(ano, mes - 1, dia);
        const diasSemana = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
        const diaSemana = diasSemana[dateObj.getDay()];
        return `<div style='background:#f4f6f8;padding:8px 12px;border-radius:6px;margin-bottom:6px;display:flex;align-items:center;gap:12px;justify-content:space-between;'>
            <span style='font-weight:500;'>${formatDateBR(d)} ${diaSemana}</span>
            <button onclick='removeFeriado(${idx})' style='background:#e74c3c;color:#fff;border:none;border-radius:4px;padding:2px 8px;cursor:pointer;'>Excluir</button>
        </div>`;
    }).join('');
}
function removeFeriado(idx) {
    feriados.splice(idx,1);
    renderFeriadosLista();
}
function addGmud() {
    const data = document.getElementById('gmudData').value;
    if (!data || gmuds.includes(data)) return;
    gmuds.push(data);
    renderGmudLista();
    document.getElementById('gmudData').value = '';
}
function renderGmudLista() {
    const listaDiv = document.getElementById('gmudLista');
    if (gmuds.length === 0) { listaDiv.innerHTML = ''; return; }
    listaDiv.innerHTML = gmuds.map((d, idx) => {
        // Criação robusta da data local
        const [ano, mes, dia] = d.split('-').map(Number);
        const dateObj = new Date(ano, mes - 1, dia);
        const diasSemana = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
        const diaSemana = diasSemana[dateObj.getDay()];
        return `<div style='background:#f4f6f8;padding:8px 12px;border-radius:6px;margin-bottom:6px;display:flex;align-items:center;gap:12px;justify-content:space-between;'>
            <span style='font-weight:500;'>${formatDateBR(d)} ${diaSemana}</span>
            <button onclick='removeGmud(${idx})' style='background:#e74c3c;color:#fff;border:none;border-radius:4px;padding:2px 8px;cursor:pointer;'>Excluir</button>
        </div>`;
    }).join('');
}
function removeGmud(idx) {
    gmuds.splice(idx,1);
    renderGmudLista();
}
// Alteração solicitada "hora e dia" - Sumarização de Dias Úteis movida para o card Informações da Sprint
function renderSumarizacaoSprint() {
    const div = document.getElementById('sumarizacaoSprint');
    if (!div) return;
    if (sprintInfos.length === 0) { div.innerHTML = '<span style="color:#888;">Preencha os dados da sprint.</span>'; return; }
    const info = sprintInfos[0];
    let feriadosFormatados = feriados.map(f => {
        const dateObj = new Date(f);
        const diasSemana = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
        const diaSemana = diasSemana[dateObj.getDay()];
        return `${formatDateBR(f)} (${diaSemana})`;
    });
    // Sumarização de Dias Úteis
    const { diasUteis, totalHoras } = calcularDiasUteisEHoras(info.inicio, info.fim, feriados);
    div.innerHTML = `<div style='background:#f4f6f8;padding:14px 18px;border-radius:8px;margin-top:10px;'>
        <div style='margin-bottom:8px;'><strong>Nome da Sprint:</strong> ${info.nome}</div>
        <div style='margin-bottom:8px;'><strong>Início:</strong> ${formatDateBR(info.inicio)} <strong>Fim:</strong> ${formatDateBR(info.fim)}</div>
        <div style='margin-bottom:8px;'><strong>Feriados:</strong> ${feriadosFormatados.length ? feriadosFormatados.join(', ') : 'Nenhum'}</div>
        <div style='margin-bottom:8px;'><strong>Dias Úteis:</strong> ${diasUteis}</div>
        <div style='margin-bottom:8px;'><strong>Total de Horas (7h/dia):</strong> ${totalHoras}</div>
    </div>`;
}
// Atualiza sumarização sempre que sprint ou feriado muda
function updateSprintAndFeriadoSumarizacao() {
    renderSprintResumo();
    renderFeriadosLista();
    renderSumarizacaoSprint();
}
// Modifica addSprintInfo e addFeriado para atualizar sumarização
const oldAddSprintInfo = addSprintInfo;
addSprintInfo = function() {
    oldAddSprintInfo();
    updateSprintAndFeriadoSumarizacao();
}
const oldRemoveSprintInfo = removeSprintInfo;
removeSprintInfo = function() {
    oldRemoveSprintInfo();
    updateSprintAndFeriadoSumarizacao();
}
const oldAddFeriado = addFeriado;
addFeriado = function() {
    oldAddFeriado();
    updateSprintAndFeriadoSumarizacao();
}
const oldRemoveFeriado = removeFeriado;
removeFeriado = function(idx) {
    oldRemoveFeriado(idx);
    updateSprintAndFeriadoSumarizacao();
}
// Inicializa sumarização
renderSumarizacaoSprint();
// Alteração solicitada "hora e dia" - Novo método para calcular dias úteis e total de horas considerando feriados
function calcularDiasUteisEHoras(inicio, fim, feriadosArr) {
    if (!inicio || !fim) return { diasUteis: 0, totalHoras: 0 };
    const start = new Date(inicio);
    const end = new Date(fim);
    // Cria um Set de feriados no formato YYYY-MM-DD
    let feriadosSet = new Set((feriadosArr || []).map(f => new Date(f).toISOString().slice(0,10)));
    let diasUteis = 0;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const diaSemana = d.getDay();
        const dateStr = d.toISOString().slice(0,10);
        // Corrigido: sábado = 6, domingo = 0
        if (diaSemana !== 0 && diaSemana !== 6 && !feriadosSet.has(dateStr)) diasUteis++;
    }
    return { diasUteis, totalHoras: diasUteis * 7 };
}
// Removido: função renderCalendarioSprint
// Adiciona import dinâmico e chamada correta
let calendarioSprintLoaded = false;
function callRenderCalendarioSprint() {
    if (!calendarioSprintLoaded) {
        const script = document.createElement('script');
        script.src = 'CalendarioSprint.js';
        script.onload = () => {
            calendarioSprintLoaded = true;
            if (typeof renderCalendarioSprint === 'function') {
                renderCalendarioSprint(sprintInfos, feriados, gmuds);
            }
        };
        document.head.appendChild(script);
    } else {
        if (typeof renderCalendarioSprint === 'function') {
            renderCalendarioSprint(sprintInfos, feriados, gmuds);
        }
    }
}
// Atualiza o calendário sempre que a sprint ou feriado for alterada
const oldAddSprintInfo3 = addSprintInfo;
addSprintInfo = function() {
    oldAddSprintInfo3();
    callRenderCalendarioSprint();
    updateSprintAndFeriadoSumarizacao();
}
const oldRemoveSprintInfo3 = removeSprintInfo;
removeSprintInfo = function() {
    oldRemoveSprintInfo3();
    callRenderCalendarioSprint();
    updateSprintAndFeriadoSumarizacao();
}
const oldAddFeriado3 = addFeriado;
addFeriado = function() {
    oldAddFeriado3();
    callRenderCalendarioSprint();
    updateSprintAndFeriadoSumarizacao();
}
const oldRemoveFeriado3 = removeFeriado;
removeFeriado = function(idx) {
    oldRemoveFeriado3(idx);
    callRenderCalendarioSprint();
    updateSprintAndFeriadoSumarizacao();
}
const oldAddGmud = addGmud;
addGmud = function() {
    oldAddGmud();
    callRenderCalendarioSprint();
    updateSprintAndFeriadoSumarizacao();
}
const oldRemoveGmud = removeGmud;
removeGmud = function(idx) {
    oldRemoveGmud(idx);
    callRenderCalendarioSprint();
    updateSprintAndFeriadoSumarizacao();
}
// Inicializa calendário
callRenderCalendarioSprint();
// --- Persistência localStorage ---
const STORAGE_KEY = 'sprint_capacity_data_v1';
function saveToLocalStorage() {
    const data = {
        integrantes, metas, atividades, sprintInfos, feriados, gmuds,
        capacityHeaders, capacityRows, capacityData
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function restoreFromLocalStorage() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return;
    try {
        const obj = JSON.parse(data);
        if (obj.integrantes) integrantes = obj.integrantes;
        if (obj.metas) metas = obj.metas;
        if (obj.atividades) atividades = obj.atividades;
        if (obj.sprintInfos) sprintInfos = obj.sprintInfos;
        if (obj.feriados) feriados = obj.feriados;
        if (obj.gmuds) gmuds = obj.gmuds;
        if (obj.capacityHeaders) capacityHeaders = obj.capacityHeaders;
        if (obj.capacityRows) capacityRows = obj.capacityRows;
        if (obj.capacityData) capacityData = obj.capacityData;
    } catch(e) { /* ignore */ }
}
function clearLocalStorageAndReload() {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
}
// --- Fim persistência ---
// Restaura dados ao carregar
restoreFromLocalStorage();
// Renderiza tudo após restaurar do localStorage
renderIntegrantes();
renderMetas();
renderCapacityTable();
renderSumarizadorTable();
renderAtividadesResp();
renderAtividadesTable();
renderSprintResumo();
renderFeriadosLista();
renderGmudLista();
renderSumarizacaoSprint();
callRenderCalendarioSprint();
// Salva sempre que houver alteração relevante
function saveAndUpdate() { saveToLocalStorage(); }
// Após cada alteração relevante, chamar saveAndUpdate()
// Integrantes
const oldAddIntegranteLS = addIntegrante;
addIntegrante = function() { oldAddIntegranteLS(); saveAndUpdate(); updateCapacityAndSumarizador(); }
const oldRemoveIntegranteLS = removeIntegrante;
removeIntegrante = function(idx) { oldRemoveIntegranteLS(idx); saveAndUpdate(); updateCapacityAndSumarizador(); }
// Metas
const oldAddMetaLS = addMeta;
addMeta = function() { oldAddMetaLS(); saveAndUpdate(); }
const oldRemoveMetaLS = removeMeta;
removeMeta = function(idx) { oldRemoveMetaLS(idx); saveAndUpdate(); }
// Atividades
const oldAddAtividadeLS = addAtividade;
addAtividade = function() { oldAddAtividadeLS(); saveAndUpdate(); }
const oldRemoveAtividadeLS = removeAtividade;
removeAtividade = function(idx) { oldRemoveAtividadeLS(idx); saveAndUpdate(); }
// Sprint
const oldAddSprintInfoLS = addSprintInfo;
addSprintInfo = function() { oldAddSprintInfoLS(); saveAndUpdate(); callRenderCalendarioSprint(); updateSprintAndFeriadoSumarizacao(); }
const oldRemoveSprintInfoLS = removeSprintInfo;
removeSprintInfo = function() { oldRemoveSprintInfoLS(); saveAndUpdate(); callRenderCalendarioSprint(); updateSprintAndFeriadoSumarizacao(); }
// Feriados
const oldAddFeriadoLS = addFeriado;
addFeriado = function() { oldAddFeriadoLS(); saveAndUpdate(); callRenderCalendarioSprint(); updateSprintAndFeriadoSumarizacao(); }
const oldRemoveFeriadoLS = removeFeriado;
removeFeriado = function(idx) { oldRemoveFeriadoLS(idx); saveAndUpdate(); callRenderCalendarioSprint(); updateSprintAndFeriadoSumarizacao(); }
// GMUD
const oldAddGmudLS = addGmud;
addGmud = function() { oldAddGmudLS(); saveAndUpdate(); callRenderCalendarioSprint(); updateSprintAndFeriadoSumarizacao(); }
const oldRemoveGmudLS = removeGmud;
removeGmud = function(idx) { oldRemoveGmudLS(idx); saveAndUpdate(); callRenderCalendarioSprint(); updateSprintAndFeriadoSumarizacao(); }
// Capacity
const oldEditCapacityRowLS = editCapacityRow;
editCapacityRow = function(idx, val) { oldEditCapacityRowLS(idx, val); saveAndUpdate(); }
const oldEditCapacityCellLS = editCapacityCell;
editCapacityCell = function(rIdx, cIdx, val) { oldEditCapacityCellLS(rIdx, cIdx, val); saveAndUpdate(); }
const oldAddCapacityRowLS = addCapacityRow;
addCapacityRow = function() { oldAddCapacityRowLS(); saveAndUpdate(); }
const oldRemoveCapacityRowLS = removeCapacityRow;
removeCapacityRow = function(idx) { oldRemoveCapacityRowLS(idx); saveAndUpdate(); }
const oldAddCapacityColLS = addCapacityCol;
addCapacityCol = function() { oldAddCapacityColLS(); saveAndUpdate(); }
const oldRemoveCapacityColLS = removeCapacityCol;
removeCapacityCol = function() { oldRemoveCapacityColLS(); saveAndUpdate(); }