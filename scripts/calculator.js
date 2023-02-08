import { data } from './deductions-data.js';

// Source: https://developer.mozilla.org/en-US/docs/Web/API/URL/searchParams#examples
const searchParams = (new URL(document.location)).searchParams;

const salary = parseInt(searchParams.get('salary'));

const monthlySalary = salary / 12;

const currencyFormatter = Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD'
});

const body = document.getElementsByClassName('pay-period-deductions-body')[0];
const totalDeductionsElement = document.getElementsByClassName('total-deductions')[0].lastElementChild;

let totalDeductions = 0;

for (const deduction of data) {
    const [name, percentage, amount] = [...deduction];
    let row = `<tr class="pay-period-deduction">
    <th class="deduction-name" scope="row">${name}</th>
    <td>
    `;
    if (typeof percentage == 'number') {
        const formattedPercentage = percentage.toLocaleString(undefined, {
            style: 'percent',
            maximumSignificantDigits: 2
        });
        row += `<div class="center"><span class="foreground-faded small">${isNaN(monthlySalary) ? '?' : currencyFormatter.format(monthlySalary)}</span> &times; <span class="bubble deduction-percentage">${formattedPercentage}</span></div>
        </td>
        <td>
        `;
    } else {
        row += `</td>
        <td>
        `;
    }
    if (typeof amount == 'number') {
        const formattedAmount = currencyFormatter.format(amount);
        row += `<div class="center"><span class="bubble deduction-amount">${formattedAmount}</span></div>
        </td>
        `;
    } else {
        row += `<div class="center"></div>
        `;
    }
    let total = typeof percentage == 'number' ? monthlySalary * percentage : (amount || 0);
    row += `<td class="end">=</td>
    <td class="deduction-total">${isNaN(monthlySalary) ? '?' : currencyFormatter.format(total)}</td>
    `;
    totalDeductions = totalDeductions + total;
    body.innerHTML += row;
}

totalDeductionsElement.innerHTML = isNaN(totalDeductions) ? '?' : currencyFormatter.format(totalDeductions);
