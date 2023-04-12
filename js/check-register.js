import { data } from './EECU-data.js';

const locationURL = new URL(document.location);
const searchParams = locationURL.searchParams;

document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('add-button');
    const tableBody = document.getElementById('check-register-table-body');
    const rowTemplate = document.querySelector('tr:last-child').cloneNode(true);

    function createRow(row) {
        const lastRow = tableBody.lastElementChild;

        const idInput = lastRow.querySelector('td:first-child input');
        const dateInput = lastRow.querySelector('td:nth-child(2) input');
        const balanceInput = lastRow.querySelector('td:last-child input');

        const rowIdInput = row.querySelector('td:first-child input');
        const rowDateInput = row.querySelector('td:nth-child(2) input');
        const rowWithdrawalInput = row.querySelector('td:nth-child(4) input');
        const rowDepositInput = row.querySelector('td:nth-child(5) input');
        const rowBalanceInput = row.querySelector('td:last-child input');

        rowIdInput.value = parseInt(idInput.value) + 1;
        rowDateInput.valueAsDate = new Date();
        rowBalanceInput.value = balanceInput.value;

        balanceInput.addEventListener('input', ev => {
            rowBalanceInput.value = (isNaN(parseFloat(ev.target.value)) ? 0 : parseFloat(ev.target.value)) - (isNaN(parseFloat(rowWithdrawalInput.value)) ? 0 : parseFloat(rowWithdrawalInput.value)) + (isNaN(parseFloat(rowDepositInput.value)) ? 0 : parseFloat(rowDepositInput.value));
        });

        rowWithdrawalInput.addEventListener('input', ev => {
            rowBalanceInput.value = (isNaN(parseFloat(balanceInput.value)) ? 0 : parseFloat(balanceInput.value)) - (isNaN(parseFloat(ev.target.value)) ? 0 : parseFloat(ev.target.value)) + (isNaN(parseFloat(rowDepositInput.value)) ? 0 : parseFloat(rowDepositInput.value));
        });

        rowDepositInput.addEventListener('input', ev => {
            rowBalanceInput.value = (isNaN(parseFloat(balanceInput.value)) ? 0 : parseFloat(balanceInput.value)) + (isNaN(parseFloat(ev.target.value)) ? 0 : parseFloat(ev.target.value)) - (isNaN(parseFloat(rowWithdrawalInput.value)) ? 0 : parseFloat(rowWithdrawalInput.value));
        });

        return row;
    }

    addButton.addEventListener('click', ev => {
        tableBody.append(createRow(rowTemplate.cloneNode(true)));

        addButton.scrollIntoView({
            behavior: 'smooth'
        });
    });

    const idParam = parseInt(searchParams.get('id'));

    if (!isNaN(idParam)) {
        const [name, balance] = data[idParam - 1];

        const lastRow = tableBody.lastElementChild;

        const idInput = lastRow.querySelector('td:first-child input');
        const dateInput = lastRow.querySelector('td:nth-child(2) input');
        const descriptionTextarea = lastRow.querySelector('td textarea');
        const depositInput = lastRow.querySelector('td:nth-child(5) input');
        const balanceInput = lastRow.querySelector('td:last-child input');

        idInput.value = '1';
        dateInput.valueAsDate = new Date();
        descriptionTextarea.value = name;
        depositInput.value = balance;
        balanceInput.value = depositInput.value;
    }
});
