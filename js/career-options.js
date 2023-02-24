import { data } from './EECU-data.js';

const currencyFormatter = Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD'
});

const element = document.getElementsByClassName('career-options-list')[0];
const search = document.getElementById('search');

search.addEventListener('input', () => {
    const value = search.value;
    for (const item of document.getElementsByClassName('career-options-list-item')) {
        item.classList.remove('none');
        if (item.getElementsByTagName('h3')[0].textContent.toLocaleLowerCase().trim().indexOf(value.toLocaleLowerCase().trim())) {
            item.classList.add('none');
        }
    }
});

for (const option of data) {
    const [name, salary] = [...option];
    const formattedSalary = currencyFormatter.format(salary);
    element.innerHTML += `<a class="career-options-list-item flex column" href="/calculator.html?name=${encodeURIComponent(name)}&salary=${salary}">
    <h3>${name}</h3>
    <div class="bubble salary" title="Gross Annual Income">${formattedSalary}</div>
    </a>
    `;
}
