import { data } from "./EECU-data.js";

const careerOptionsList = document.getElementsByClassName('career-options-list')[0];

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

for (const option of data) {
    const [name, salary] = [...option];
    const formattedSalary = formatter.format(salary);
    careerOptionsList.innerHTML += `<a class="career-options-list-item flex column center-justify" href="/calculator.html?name=${encodeURIComponent(name)}&salary=${salary}">
    <h3>${name}</h3>
    <div class="salary" title="Gross Annual Income">${formattedSalary}</div>
</a>`
}
