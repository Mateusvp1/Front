window.onload = () => {
    const colunasFuncionarios = ['id', 'nome', 'cpf', 'email', 'dataAdmissao'];
    const colunasRegistros = ['id', 'horaPonto', 'tipoRegistro'];
  
    carregarTabela('funcionarios', 'tabelaFuncionarios', colunasFuncionarios);
    carregarTabela('registros', 'tabelaRegistros', colunasRegistros);
  
    const funcionarioForm = document.getElementById('FuncionarioForm');
    funcionarioForm.addEventListener('submit', function (event) {
      event.preventDefault();
      cadastrar(this, 'funcionarios');
    });
  
    const registroForm = document.getElementById('registroForm');
    registroForm.addEventListener('submit', function (event) {
      event.preventDefault();
      cadastrar(this, 'registros');
    });
  
    const excluirForm = document.getElementById('excluirForm');
    excluirForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const tipo = this.tipoExcluir.value;
      const id = this.idExcluir.value;
  
      if (!tipo || !id) {
        alert('Por favor, selecione o tipo e insira o ID.');
        return;
      }
  
      const confirmacao = confirm('Tem certeza de que deseja excluir este registro?');
      if (confirmacao) {
        excluirRegistro(tipo, id);
      }
    });
  
    const atualizarFuncionarioForm = document.getElementById('atualizarFuncionarioForm');
    atualizarFuncionarioForm.addEventListener('submit', function (event) {
      event.preventDefault();
      atualizarRegistro(this, 'funcionarios');
    });
  
    const atualizarRegistroForm = document.getElementById('atualizarRegistroForm');
    atualizarRegistroForm.addEventListener('submit', function (event) {
      event.preventDefault();
      atualizarRegistro(this, 'registros');
    });
  };
  
  function alertaPost(response) {
    if (response.status >= 200 && response.status < 300) {
      alert('Operação realizada com sucesso!');
      recarregarPagina();
    } else {
      alert('Erro na operação. Verifique o console para mais detalhes.');
      console.error(response);
    }
  }
  
  function cadastrar(form, endpoint) {
    const formData = new FormData(form);
    axios.post(`http://localhost:8080/${endpoint}`, Object.fromEntries(formData))
      .then(response => {
        alertaPost(response);
      })
      .catch(error => {
        console.error(`Erro ao cadastrar em ${endpoint}:`, error);
      });
  }
  
  function carregarTabela(endpoint, tabelaId, colunas) {
    axios.get(`http://localhost:8080/${endpoint}`)
      .then(response => {
        const tabela = document.getElementById(tabelaId);
        const tbody = tabela.querySelector('tbody');
        tbody.innerHTML = "";
  
        response.data.forEach(item => {
          const row = document.createElement("tr");
  
          colunas.forEach(coluna => {
            const cell = document.createElement("td");
            cell.textContent = item[coluna];
            row.appendChild(cell);
          });
  
          const actionsCell = document.createElement("td");
          actionsCell.innerHTML = `
            <button onclick="carregarDadosParaAtualizacao('${endpoint}', ${item.id})">Editar</button>
            <button onclick="excluirRegistro('${endpoint}', ${item.id})">Excluir</button>
          `;
          row.appendChild(actionsCell);
  
          tbody.appendChild(row);
        });
      })
      .catch(error => {
        console.error(`Erro ao carregar tabela de ${endpoint}:`, error);
      });
  }
  
  function excluirRegistro(tipo, id) {
    axios.delete(`http://localhost:8080/${tipo}/${id}`)
      .then(response => {
        alertaPost(response);
      })
      .catch(error => {
        console.error(`Erro ao excluir registro de ${tipo}:`, error);
      });
  }
  
  function atualizarRegistro(form, endpoint) {
    const formData = new FormData(form);
    const id = formData.get('idAtualizar' + capitalizeFirstLetter(endpoint.slice(0, -1)));
    formData.delete('idAtualizar' + capitalizeFirstLetter(endpoint.slice(0, -1)));
  
    axios.put(`http://localhost:8080/${endpoint}/${id}`, Object.fromEntries(formData))
      .then(response => {
        alertaPost(response);
      })
      .catch(error => {
        console.error(`Erro ao atualizar ${endpoint.slice(0, -1)}:`, error);
      });
  }
  
  function carregarDadosParaAtualizacao(endpoint, id) {
    axios.get(`http://localhost:8080/${endpoint}/${id}`)
      .then(response => {
        const data = response.data;
        for (const key in data) {
          const input = document.querySelector(`#atualizar${capitalizeFirstLetter(endpoint.slice(0, -1))}Form [name=${key}Atualizar${capitalizeFirstLetter(endpoint.slice(0, -1))}]`);
          if (input) {
            input.value = data[key];
          }
        }
      })
      .catch(error => {
        console.error(`Erro ao carregar dados de ${endpoint.slice(0, -1)} para atualização:`, error);
      });
  }
  
  function recarregarPagina() {
    location.reload();
  }
  
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }