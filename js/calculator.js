import { deductionsData } from './deductions-data.js';

// https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
const formatter = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

const locationURL = new URL(document.location);
const searchParams = locationURL.searchParams;

const salary = parseInt(searchParams.get('salary'));

function getTotalDeductions(monthlySalary) {
    let total = 0;

    for (const [_, percentage, amount] of deductionsData) {
        total += monthlySalary * (percentage ? parseFloat(percentage) : 0) + (amount ? parseFloat(amount) : 0);
    }

    return total;
}

function createDeductionsTableRow(name, percentage, amount, monthlySalary) {
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
        factorSpan.appendChild(document.createTextNode(formatter.format(monthlySalary)));
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
    const grossAnnuals = document.getElementsByClassName('gross-annual');
    const grossMonthlies = document.getElementsByClassName('gross-monthly');
    const deductions = document.getElementsByClassName('deductions');
    const netIncomes = document.getElementsByClassName('net-income');
    const summary = document.getElementById('summary');
    const payPeriodDeductions = document.getElementById('pay-period-deductions');
    const deductionsTableBody = document.getElementById('deductions-table-body');
    const yourSalaryFormInput = document.getElementById('your-salary-form-input');

    if (!isNaN(salary)) {
        yourSalaryFormInput.value = salary

        for (const grossAnnual of grossAnnuals) {
            grossAnnual.textContent = formatter.format(salary);
        }

        for (const grossMonthly of grossMonthlies) {
            grossMonthly.textContent = formatter.format(salary / 12);
        }

        for (const deduction of deductions) {
            deduction.textContent = formatter.format(getTotalDeductions(salary / 12));
        }

        for (const netIncome of netIncomes) {
            netIncome.textContent = formatter.format(salary / 12 - getTotalDeductions(salary / 12));
        }

        deductionsTableBody.textContent = '';
        deductionsTableBody.append(...deductionsData.map(d => createDeductionsTableRow(...d, salary / 12)));

        summary.classList.toggle('hide', false);
        payPeriodDeductions.classList.toggle('hide', false);
    }

    yourSalaryFormInput.addEventListener('input', ev => {
        const value = ev.target.value;

        if (value > 0) {
            for (const grossAnnual of grossAnnuals) {
                grossAnnual.textContent = formatter.format(value);
            }

            for (const grossMonthly of grossMonthlies) {
                grossMonthly.textContent = formatter.format(value / 12);
            }

            for (const deduction of deductions) {
                deduction.textContent = formatter.format(getTotalDeductions(value / 12));
            }

            for (const netIncome of netIncomes) {
                netIncome.textContent = formatter.format(value / 12 - getTotalDeductions(value / 12));
            }

            deductionsTableBody.textContent = '';
            deductionsTableBody.append(...deductionsData.map(d => createDeductionsTableRow(...d, value / 12)));

            summary.classList.toggle('hide', false);
            payPeriodDeductions.classList.toggle('hide', false);
        } else {
            summary.classList.toggle('hide', true);
            payPeriodDeductions.classList.toggle('hide', true);
        }
    });
});
