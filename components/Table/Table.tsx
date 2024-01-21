// PaginatedTable.js
"use client";

import React, { useState, useEffect } from 'react';
import { Title, Table, Pagination, Button, Text, Modal, TextInput, Grid, Group, useMantineColorScheme } from '@mantine/core';
import styles from './PaginatedTable.module.css';
import { deleteItem, addItem, editItem } from '../service/ApiService';
import Search from '../Search/Search';
import fakeApiData from '../Table/hearings.json';
import { DateTimePicker } from '@mantine/dates';


function PaginatedTableWithSearch() {
    const [pageNumber, setPageNumber] = useState(1);
    const [filteredData, setFilteredData] = useState(fakeApiData);
    const [selectedItem, setSelectedItem] = useState<Record<string, string> | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedItem, setEditedItem] = useState<Record<string, string>>({
        processNumber: '',
        date: '',
        court: '',
        correspondent: '',
    });

    const itemsPerPage = 5;
    const { setColorScheme } = useMantineColorScheme();
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayUsers = filteredData.slice(startIndex, endIndex);

    const pageCount = Math.ceil(filteredData.length / itemsPerPage);

    const handlePageChange = (newPageNumber) => {
        setPageNumber(newPageNumber);
    };

    // Lógica de pesquisa
    const handleSearch = (term) => {
        const searchTerm = term.toLowerCase();
        const filtered = fakeApiData.filter((item) =>
            Object.values(item).some((value) => value.toLowerCase().includes(searchTerm))
        );
        setFilteredData(filtered);
        setPageNumber(1);
    };

    const handleDelete = (index) => {
        const isConfirmed = window.confirm('Tem certeza de que deseja excluir este item?');

        if (isConfirmed) {
            deleteItem(index);
            setFilteredData(fakeApiData);
            setPageNumber(1);
        }
    };

    const handleEdit = (index) => {
        setSelectedItem(fakeApiData[index]);
        setEditedItem(fakeApiData[index]);
        setIsEditing(true);
    };

    const handleAdd = () => {
        setSelectedItem(null);
        setEditedItem({
            processNumber: '',
            date: '',
            court: '',
            correspondent: '',
        });
        setIsAdding(true);
    };

    const isValidDateFormat = (dateString) => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(dateString);
    };

    const handleSave = () => {

        if (!editedItem.processNumber || !editedItem.date || !editedItem.court || !editedItem.correspondent) {
            alert("Todos os campos são obrigatórios. Preencha todos antes de salvar.");
            return;
        }

        if (!isValidDateFormat(editedItem.date)) {
            alert("Formato de data inválido. Utilize o formato YYYY-MM-DD.");
            return;
        }

        if (isEditing && selectedItem !== null) {
            const index = fakeApiData.indexOf(selectedItem);
            editItem(index, editedItem);
        } else {
            addItem(editedItem);
        }
        setFilteredData(fakeApiData);
        setIsEditing(false);
        setIsAdding(false);
        setPageNumber(1);
    };

    // Função para fechar o modal
    const handleCloseModal = () => {
        setIsEditing(false);
        setIsAdding(false);
    };

    return (

        <div className={styles.container}>
            <Group mt="xl"> Tema:
                <Button onClick={() => setColorScheme('light')}>Light</Button>
                <Button onClick={() => setColorScheme('dark')}>Dark</Button>
                <Button onClick={() => setColorScheme('auto')}>Auto</Button>
            </Group>
            <br />
            <Title className={styles.title} ta="center" mt={100}>
                Tabela Jurídica
            </Title>

            <div className={styles.searchBarContainer}>
                <Search onSearch={handleSearch} className={styles.searchBar} />
                <Button onClick={handleAdd} size="sm" className={styles.addButton}>
                    Adicionar
                </Button>
            </div>

            <Table striped highlightOnHover withTableBorder withColumnBorders className={styles.table}>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Número do Processo</Table.Th>
                        <Table.Th>Data</Table.Th>
                        <Table.Th>Tribunal</Table.Th>
                        <Table.Th>Correspondente</Table.Th>
                        <Table.Th>Ações</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {displayUsers.map((element, index) => (
                        <Table.Tr key={index}>
                            <Table.Td>{element.processNumber}</Table.Td>
                            <Table.Td>{element.date}</Table.Td>
                            <Table.Td>{element.court}</Table.Td>
                            <Table.Td>{element.correspondent}</Table.Td>
                            <Table.Td>
                                <Button onClick={() => handleEdit(index)} size="sm" className={styles.actionButton}>
                                    Editar
                                </Button>
                                <Button onClick={() => handleDelete(index)} size="sm" variant="outline" color="red" className={styles.actionButton}>
                                    Excluir
                                </Button>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>

            <div className={styles.pagination}>
                <Pagination
                    total={pageCount}
                    value={pageNumber}
                    onChange={handlePageChange}
                    size="lg"
                />
            </div>

            <Modal
                opened={isEditing || isAdding}
                onClose={handleCloseModal}
                title={isEditing ? "Editar Item" : "Adicionar Novo Item"}
                size="g" // Alterando o tamanho do modal para médio
                styles={{ body: { padding: 10, maxWidth: 700 } }}  // Adicionando alguns estilos ao modal
            >
                <Grid gutter="g">
                    <div className={styles.gridColumn}>
                        <label htmlFor="processNumber">Número do Processo</label>
                        <TextInput
                            id="processNumber"
                            placeholder="Digite o número do processo"
                            value={editedItem.processNumber}
                            onChange={(event) => setEditedItem({ ...editedItem, processNumber: event.target.value })}
                        />
                    </div>
                    <div className={styles.gridColumn}>
                        <label htmlFor="date">Data</label>
                        <TextInput
                            id="date"
                            placeholder="Digite a data"
                            value={editedItem.date}
                            onChange={(event) => setEditedItem({ ...editedItem, date: event.target.value })}
                        />
                    </div>
                    <div className={styles.gridColumn}>
                        <label htmlFor="court">Tribunal</label>
                        <TextInput
                            id="court"
                            placeholder="Digite o tribunal"
                            value={editedItem.court}
                            onChange={(event) => setEditedItem({ ...editedItem, court: event.target.value })}
                        />
                    </div>
                    <div className={styles.gridColumn}>
                        <label htmlFor="correspondent">Correspondente</label>
                        <TextInput
                            id="correspondent"
                            placeholder="Digite o correspondente"
                            value={editedItem.correspondent}
                            onChange={(event) => setEditedItem({ ...editedItem, correspondent: event.target.value })}
                        />
                    </div>
                </Grid>
                <br />
                <div className={styles.modalButtons}>
                    <Button onClick={handleSave} style={{ marginRight: 10 }}>Salvar</Button>
                    <Button onClick={handleCloseModal} variant="light">Cancelar</Button>
                </div>
            </Modal>
        </div>
    );
}

export default function Home() {
    return <PaginatedTableWithSearch />;
}
