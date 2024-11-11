// frontend/src/services/taskService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/tarefas'; // URL do backend (ajuste conforme necessário)

// Função para obter todas as tarefas
export const getTasks = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar tarefas', error);
    throw error;
  }
};

// Função para excluir uma tarefa
export const deleteTask = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Erro ao excluir tarefa', error);
    throw error;
  }
};

// Função para adicionar uma nova tarefa
export const addTask = async (task) => {
  try {
    await axios.post(API_URL, task);
  } catch (error) {
    console.error('Erro ao adicionar tarefa', error);
    throw error;
  }
};

// Função para atualizar uma tarefa
export const updateTask = async (id, task) => {
  try {
    await axios.put(`${API_URL}/${id}`, task);
  } catch (error) {
    console.error('Erro ao editar tarefa', error);
    throw error;
  }
};

// Função para mover a tarefa (subir ou descer)
export const moveTask = async (id, direction) => {
  try {
    await axios.patch(`${API_URL}/${id}/mover`, { direcao: direction });
  } catch (error) {
    console.error('Erro ao mover tarefa', error);
    throw error;
  }
};
