import fakeApiData from '../Table/hearings.json';

export const deleteItem = (index) => {
    const newData = [...fakeApiData];
    
    newData.splice(index, 1);

    updateDataState(newData);

    return fakeApiData[index];
};

export const addItem = (newItem) => {
    const newData = [...fakeApiData];

    newData.push(newItem);

    updateDataState(newData);

    return newItem;
};

export const editItem = (index, editedItem) => {
    const newData = [...fakeApiData];
    
    newData[index] = editedItem;

    updateDataState(newData);

    return editedItem;
};

const updateDataState = (newData) => {
    fakeApiData.length = 0;
    fakeApiData.push(...newData);
};
