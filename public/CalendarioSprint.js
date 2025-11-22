// Função responsável por renderizar o calendário do período selecionado na sprint
function renderCalendarioSprint(sprintInfos, feriadosArr, gmudsArr) {
    const div = document.getElementById('calendarioSprint');
    if (!div) return;
    if (!sprintInfos || sprintInfos.length === 0) {
        div.innerHTML = '<span style="color:#888;">Preencha os dados da sprint para ver o calendário.</span>';
        return;
    }
    const info = sprintInfos[0];
    const inicio = new Date(info.inicio);
    const rfim = new Date(info.fim);
    const fim = new Date(rfim.getFullYear(), rfim.getMonth(), rfim.getDate() + 1, 23, 59, 59);

    if (isNaN(inicio) || isNaN(fim)) {
        div.innerHTML = '<span style="color:#888;">Datas inválidas.</span>';
        return;
    }
    // Prepara set de feriados no formato YYYY-MM-DD
    let feriadosSet = new Set();
    if (Array.isArray(feriadosArr)) {
        feriadosArr.forEach(f => {
            if (typeof f === 'string' && f.length >= 10) {
                feriadosSet.add(f.slice(0, 10));
            }
        });
    }
    let gmudsSet = new Set();
    if (Array.isArray(gmudsArr)) {
        gmudsArr.forEach(g => {
            if (typeof g === 'string' && g.length >= 10) {
                gmudsSet.add(g.slice(0, 10));
            }
        });
    }
    // Cabeçalho dos dias da semana
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    let html = '<table style="border-collapse:collapse;width:100%;max-width:100%;background:#fff;margin-top:16px;">';
    html += '<thead><tr>';
    diasSemana.forEach(dia => {
        html += `<th style='border:1px solid #e0e0e0;padding:6px;background:#e9eef2; max'>${dia}</th>`;
    });
    html += '</tr></thead><tbody>';
    // Calcula o primeiro domingo antes ou igual ao início (sem alterar o objeto inicio)
    let dataInicioTabela = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate());
    dataInicioTabela.setDate(dataInicioTabela.getDate() - dataInicioTabela.getDay());
    // Calcula o último sábado após ou igual ao fim
    let dataFimTabela = new Date(fim.getFullYear(), fim.getMonth(), fim.getDate());
    dataFimTabela.setDate(dataFimTabela.getDate() + (6 - dataFimTabela.getDay()));
    let dataAtual = new Date(dataInicioTabela);
    let terminou = false;
    while (dataAtual <= dataFimTabela && !terminou) {
        html += '<tr>';
        for (let i = 0; i < 7; i++) {
            let diaSemana = dataAtual.getDay();
            let dataStr = dataAtual.toISOString().slice(0, 10);
            let mostrarNumero = (diaSemana >= 1 && diaSemana <= 5) && (dataAtual >= inicio && dataAtual <= fim);
            let isFeriado = mostrarNumero && feriadosSet.has(dataStr);
            let isGmud = mostrarNumero && gmudsSet.has(dataStr);
            let style = 'border:1px solid #e0e0e0;padding:8px;text-align:center;';
            let cellContent = mostrarNumero ? dataAtual.getDate() : '';
            if (isFeriado) {
                style += 'background:#ffdddd;color:#c00;font-weight:bold;';
            } else if (isGmud) {
                style += 'background:#fff7cc;color:#b38b00;font-weight:bold;';
                if (mostrarNumero) {
                    cellContent += '<br><span style="font-size:11px;font-weight:normal;">Não haverá implantação</span>';
                }
            } else if (!mostrarNumero) {
                style += 'background:#f4f6f8;color:#bbb;';
            }
            // Garante que o último dia (fim) sempre aparece
            let isFim = (dataAtual.getFullYear() === fim.getFullYear() && dataAtual.getMonth() === fim.getMonth() && dataAtual.getDate() === fim.getDate());
            html += `<td style='${style}'>${cellContent}</td>`;
            if (isFim) {
                // Preencher células vazias até sábado, se necessário
                for (let j = i + 1; j < 7; j++) {
                    html += `<td style='border:1px solid #e0e0e0;padding:8px;text-align:center;background:#f4f6f8;color:#bbb;'></td>`;
                }
                terminou = true;
                break;
            }
            dataAtual.setDate(dataAtual.getDate() + 1);
        }
        if (!terminou) dataAtual.setDate(dataAtual.getDate());
        html += '</tr>';
    }
    html += '</tbody></table>';
    div.innerHTML = html;
}