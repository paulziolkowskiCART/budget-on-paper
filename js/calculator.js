import { data } from "./deductions-data";

// Source: https://developer.mozilla.org/en-US/docs/Web/API/URL/searchParams#examples
const params = (new URL(document.location)).searchParams

const name = params.get('name');
const salary = parseInt(params.get('salary'));
