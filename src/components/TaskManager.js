// frontend/src/components/TaskManager.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Importa ícones de edição e exclusão

// Atualizando a URL para o backend hospedado no Render
const apiUrl = 'https://task-backend-eyp4.onrender.com/tarefas';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({ nome: '', custo: '', data_limite: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [error, setError] = useState(null); // Adicionando estado para erro

  useEffect(() => {
    loadTasks();
  }, []);

  // Função para carregar todas as tarefas do backend
  const loadTasks = async () => {
    try {
      const response = await axios.get(apiUrl);
      setTasks(response.data);
      setError(null); // Limpar erros caso a requisição tenha sucesso
    } catch (error) {
      console.error("Erro ao carregar as tarefas", error);
      setError("Erro ao carregar as tarefas. Tente novamente mais tarde.");
    }
  };

  // Função para enviar uma nova tarefa ou editar uma tarefa existente
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      custo: parseFloat(formData.custo.replace('.', '').replace(',', '.'))
    };
    try {
      if (isEditing) {
        await axios.put(`${apiUrl}/${editingTaskId}`, formattedData);
        setIsEditing(false);
        setEditingTaskId(null);
      } else {
        await axios.post(apiUrl, formattedData);
      }
      setFormData({ nome: '', custo: '', data_limite: '' });
      loadTasks();
    } catch (error) {
      console.error("Erro ao salvar a tarefa", error);
      setError("Erro ao salvar a tarefa. Tente novamente.");
    }
  };

  // Função de formatação para o custo em moeda brasileira
  const formatCurrency = (value) => {
    const numberValue = value.replace(/\D/g, '');
    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numberValue / 100);
    return formattedValue.replace('R$', '').trim();
  };

  // Manipula as mudanças no formulário, aplicando formatação no campo de custo
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'custo') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: formatCurrency(value)
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // Prepara a tarefa para edição
  const handleEdit = (task) => {
    setFormData({
      nome: task.nome,
      custo: task.custo.toFixed(2).replace('.', ','),
      data_limite: task.data_limite
    });
    setIsEditing(true);
    setEditingTaskId(task.id);
  };

  // Exclui uma tarefa após confirmação
  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir esta tarefa?')) {
      try {
        await axios.delete(`${apiUrl}/${id}`);
        loadTasks();
      } catch (error) {
        console.error("Erro ao excluir a tarefa", error);
        setError("Erro ao excluir a tarefa. Tente novamente.");
      }
    }
  };

  // Função para iniciar o processo de inclusão de uma nova tarefa
  const handleAddNewTask = () => {
    setFormData({ nome: '', custo: '', data_limite: '' }); // Limpa o formulário
    setIsEditing(false); // Define o estado para inclusão (não edição)
    setEditingTaskId(null); // Remove qualquer ID de tarefa em edição
  };

  return (
    <div className="task-manager">
      <h1>Lista de Tarefas</h1>

      {/* Exibe mensagem de erro, se houver */}
      {error && <div className="error-message">{error}</div>}

      {/* Formulário de inclusão/edição */}
      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          name="nome"
          placeholder="Nome da Tarefa"
          value={formData.nome}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="custo"
          placeholder="Custo (R$)"
          value={formData.custo}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="data_limite"
          value={formData.data_limite}
          onChange={handleChange}
          required
        />
        <button type="submit">{isEditing ? "Salvar Alterações" : "Adicionar Tarefa"}</button>
      </form>

      {/* Lista de tarefas */}
      <ul className="task-list">
        {tasks.map(task => (
          <li
            key={task.id}
            className={`task-item ${task.custo >= 1000 ? 'highlight' : ''}`} // Aplica fundo amarelo para custo >= 1000
          >
            <span>
              <strong>Nome:</strong> {task.nome} <br />
              <strong>Custo:</strong> R$ {task.custo.toFixed(2).replace('.', ',')} <br />
              <strong>Data Limite:</strong> {task.data_limite}
            </span>
            <div className="task-actions">
              <button onClick={() => handleEdit(task)}><FaEdit /></button>
              <button onClick={() => handleDelete(task.id)}><FaTrashAlt /></button>
            </div>
          </li>
        ))}
      </ul>

      {/* Botão de inclusão */}
      <button onClick={handleAddNewTask} className="add-task-button">
        Incluir nova tarefa
      </button>
    </div>
  );
};

export default TaskManager;
