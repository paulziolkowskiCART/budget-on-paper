import { data } from './EECU-data.js';

// https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
const formatter = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

const locationURL = new URL(document.location);
const searchParams = locationURL.searchParams;

function createOptionCard(name, salary, id) {
    // const encodedName = encodeURIComponent(name);
    const formattedSalary = formatter.format(salary);

    const option = document.createElement('b');
    const optionText = document.createTextNode(name);

    option.appendChild(optionText);

    const cardSalary = document.createElement('div');
    const cardSalaryText = document.createTextNode(formattedSalary);

    cardSalary.classList.add('option-card-salary');
    cardSalary.title = formattedSalary;
    cardSalary.appendChild(cardSalaryText);

    const card = document.createElement('a');

    // Give each list item a name to aid with searching
    card.dataset.name = name;
    card.dataset.id = id;
    card.href = `/option.html?id=${id}`;
    card.title = name;
    card.classList.add('option-card');
    card.append(option, cardSalary);

    return card;
}

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('option-card-container');
    const cards = document.getElementsByClassName('option-card');

    const noResults = document.getElementById('option-no-results');

    let optionCards = [];

    // Create list items from the data given
    for (let i = 0; i < data.length; i++) {
        optionCards.push(createOptionCard(...data[i], i + 1));
    }

    container.append(...optionCards);

    const search = document.getElementById('search-form-input');

    // Update the list when the user inputs into the search box
    search.addEventListener('input', e => {
        const value = e.target.value.trim().toLowerCase();

        if (value.length > 0) {
            // Show only what matches from the search
            Array.prototype.forEach.call(cards, c => {
                const name = c.dataset.name.trim().toLowerCase();

                const isMatch = name.includes(value);

                c.classList.toggle('hide', !isMatch);
            });

            const unhiddenCard = container.querySelector('.option-card:not(.hide)');

            noResults.classList.toggle('hide', unhiddenCard != null);
        } else {
            // Show all the items because the search is empty
            Array.prototype.forEach.call(cards, c => c.classList.toggle('hide', false));
        }
    });

    const inputEvent = new Event('input');

    search.value = searchParams.get('q');

    search.dispatchEvent(inputEvent);
});
