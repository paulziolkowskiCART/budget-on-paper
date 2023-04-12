import { data } from './EECU-data.js';
import { deductionsData } from './deductions-data.js';

// https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
const formatter = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

const locationURL = new URL(document.location);
const searchParams = locationURL.searchParams;

const id = parseInt(searchParams.get('id'));

if (isNaN(id)) {
    document.location.href = '/';
}

if (data[id - 1] === undefined) {
    document.location.href = '/';
}

const [option, salary] = data[id - 1];

const monthlySalary = salary / 12;

const formattedSalary = formatter.format(salary);
const formattedMonthlySalary = formatter.format(monthlySalary);

function getTotalDeductions() {
    let total = 0;

    for (const [_, percentage, amount] of deductionsData) {
        total += monthlySalary * (percentage ? parseFloat(percentage) : 0) + (amount ? parseFloat(amount) : 0);
    }

    return total;
}

function createDeductionsTableRow(name, percentage, amount) {
    const formattedDeduction = formatter.format(monthlySalary * (percentage ? parseFloat(percentage) : 0) + (amount ? parseFloat(amount) : 0));

    const tableHeader = document.createElement('th');
    const tableHeaderText = document.createTextNode(name);

    tableHeader.scope = 'row';
    tableHeader.appendChild(tableHeaderText);

    const deductionPercentageCell = document.createElement('td');

    deductionPercentageCell.classList.add('slab');

    if (percentage) {
        const formattedPercentage = percentage.toLocaleString(undefined, {
            style: 'percent',
            maximumSignificantDigits: 2
        });

        const factorSpan = document.createElement('span');
        const signSpan = document.createElement('span');
        const deductionPercentageSpan = document.createElement('span');

        factorSpan.classList.add('factor');
        factorSpan.appendChild(document.createTextNode(formattedMonthlySalary));
        signSpan.appendChild(document.createTextNode('\u00D7'));
        deductionPercentageSpan.classList.add('deduction-percentage');
        deductionPercentageSpan.appendChild(document.createTextNode(formattedPercentage));

        deductionPercentageCell.append(factorSpan, ' ', signSpan, ' ', deductionPercentageSpan);
    }

    const deductionAmountCell = document.createElement('td');

    deductionAmountCell.classList.add('slab');

    if (amount) {
        const formattedAmount = formatter.format(amount);

        const deductionAmountSpan = document.createElement('span');

        deductionAmountSpan.classList.add('deduction-amount');
        deductionAmountSpan.appendChild(document.createTextNode(formattedAmount));

        deductionAmountCell.append(deductionAmountSpan);
    }

    const equalsCell = document.createElement('td');

    equalsCell.classList.add('slab');
    equalsCell.appendChild(document.createTextNode('='));

    const deductionCell = document.createElement('td');

    deductionCell.classList.add('slab');
    deductionCell.appendChild(document.createTextNode(formattedDeduction));

    const tableRow = document.createElement('tr');

    tableRow.append(tableHeader, deductionPercentageCell, deductionAmountCell, equalsCell, deductionCell);

    return tableRow;
}

document.addEventListener('DOMContentLoaded', () => {
    const optionName = document.getElementById('option-name');
    const optionSalary = document.getElementById('option-salary');
    const grossAnnuals = document.getElementsByClassName('gross-annual');
    const grossMonthlies = document.getElementsByClassName('gross-monthly');
    const deductions = document.getElementsByClassName('deductions');
    const netIncomes = document.getElementsByClassName('net-income');
    const deductionsTableBody = document.getElementById('deductions-table-body');
    const openIn = document.querySelector('a[target="_blank"]');

    optionName.textContent = option;
    optionSalary.textContent = formattedSalary;

    for (const grossAnnual of grossAnnuals) {
        grossAnnual.textContent = formatter.format(salary);
    }

    for (const grossMonthly of grossMonthlies) {
        grossMonthly.textContent = formatter.format(monthlySalary);
    }

    for (const deduction of deductions) {
        deduction.textContent = formatter.format(getTotalDeductions());
    }

    for (const netIncome of netIncomes) {
        netIncome.textContent = formatter.format(monthlySalary - getTotalDeductions());
    }

    deductionsTableBody.append(...deductionsData.map(d => createDeductionsTableRow(...d)));

    openIn.href = `/check-register.html?id=${id}`;
});
