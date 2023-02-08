import { data } from './EECU-data.js';

const currencyFormatter = Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD'
});

const element = document.getElementsByClassName('career-options-list')[0];

for (const option of data) {
    const [name, salary] = [...option];
    const formattedSalary = currencyFormatter.format(salary);
    element.innerHTML += `<a class="career-options-list-item flex column center-justify" href="/calculator.html?name=${encodeURIComponent(name)}&salary=${salary}">
    <h3>${name}</h3>
    <div class="bubble salary" title="Gross Annual Income">${formattedSalary}</div>
    </a>
    `;
}
