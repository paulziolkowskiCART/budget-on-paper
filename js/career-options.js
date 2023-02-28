import { data } from './EECU-data.js';

// https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
const formatter = Intl.NumberFormat('en-US', {
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
    // Give each list item a name to help with searching
    listItem.dataset.name = name;
    listItem.append(header, bubble);

    return listItem;
}

document.addEventListener('DOMContentLoaded', () => {
    const careerOptionsList = document.getElementById('career-options-list');

    // Create list items from the data given
    const listItems = data.map(o => createListItem(...o));

    careerOptionsList.append(...listItems);

    const search = document.getElementById('search');

    // Update the list when the user inputs into the search box
    search.addEventListener('input', e => {
        const value = e.target.value.trim().toLowerCase();

        const items = document.getElementsByClassName('career-options-list-item');

        if (value.length > 0) {
            // Show only what matches from the search
            Array.prototype.forEach.call(items, i => {
                const name = i.dataset.name.trim().toLowerCase();

                const isMatch = name.includes(value);

                i.classList.toggle('none', !isMatch);
            });
        } else {
            // Show all the items because the search is empty
            Array.prototype.forEach.call(items, i => i.classList.toggle('none', false));
        }
    });
});
