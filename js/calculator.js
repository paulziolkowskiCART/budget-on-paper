import { data } from './deductions-data.js';

// Source: https://developer.mozilla.org/en-US/docs/Web/API/URL/searchParams#examples
const searchParams = (new URL(document.location)).searchParams;

const salary = parseFloat(searchParams.get('salary'));

const monthlySalary = salary / 12;

const currencyFormatter = Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD'
});

const yourCareerOption = document.getElementById('your-career-option');
const yourSalary = document.getElementById('your-salary');
const yourMonthlySalary = document.getElementById('your-monthly-salary');
const yourMonthlySalaryAfterDeductions = document.getElementById('your-monthly-salary-after-deductions');

const body = document.getElementsByClassName('pay-period-deductions-body')[0];
const totalDeductionsElement = document.getElementsByClassName('total-deductions')[0].lastElementChild;

let totalDeductions = 0;

if (!(searchParams.get('name'))) {
    yourCareerOption.classList.add('none');
}

let input;

if (isNaN(salary)) {
    yourSalary.innerHTML = '<h3>Your salary:</h3><div class="result">$ <input type="number" placeholder="1" name="salary" id="salary" class="result"></div>';
    input = document.querySelector('input');
    yourMonthlySalary.classList.add('none');
    yourMonthlySalaryAfterDeductions.classList.add('none');
    document.querySelector('table').classList.add('none');
} else {
    yourSalary.getElementsByClassName('result')[0].textContent = currencyFormatter.format(salary);
}

if (input) {
    input.addEventListener('change', () => {
        window.location.search = `salary=${parseFloat(input.value)}`;
    })
}

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
    row += `<td class="end">${isNaN(monthlySalary) ? '' : '='}</td>
    <td class="deduction-total">${isNaN(monthlySalary) ? '' : currencyFormatter.format(total)}</td>
    `;
    totalDeductions = totalDeductions + total;
    body.innerHTML += row;
}

totalDeductionsElement.innerHTML = isNaN(totalDeductions) ? '?' : currencyFormatter.format(totalDeductions);

yourCareerOption.getElementsByClassName('result')[0].textContent = searchParams.get('name');
yourMonthlySalary.getElementsByClassName('before-monthly-salary')[0].textContent = currencyFormatter.format(salary);
yourMonthlySalary.getElementsByClassName('salary')[0].textContent = currencyFormatter.format(monthlySalary);
yourMonthlySalaryAfterDeductions.getElementsByClassName('result')[0].innerHTML = `<div class="result"><span class="salary bubble">${currencyFormatter.format(monthlySalary)}</span> <span id="deduction" class="bold" style="color: darkred;">- ${currencyFormatter.format(totalDeductions)}</span> = <span class="bold bubble net">${currencyFormatter.format(monthlySalary - totalDeductions)}</span></div>
`;
