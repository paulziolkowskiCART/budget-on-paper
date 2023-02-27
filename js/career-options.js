import { data } from './EECU-data.js';

const formatter = Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD'
});

function createListItem(name, salary) {
    const encodedName = encodeURIComponent(name);
    const formattedSalary = formatter.format(salary);

    const header = document.createElement('h3');
    const headerText = document.createTextNode(name);

    header.appendChild(headerText);

    const bubble = document.createElement('div');
    const bubbleText = document.createTextNode(formattedSalary);

    bubble.classList.add('bubble', 'salary');
    bubble.title = 'Gross Annual Income';
    bubble.appendChild(bubbleText);

    const listItem = document.createElement('a');

    listItem.classList.add('career-options-list-item', 'flex', 'column');
    listItem.href = `/calculator.html?name=${encodedName}&salary=${salary}`;
    listItem.append(header, bubble);

    return listItem;
}

document.addEventListener('DOMContentLoaded', () => {
    const careerOptionsList = document.getElementById('career-options-list');

    const listItems = data.map(o => createListItem(...o));

    careerOptionsList.append(...listItems);

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
});