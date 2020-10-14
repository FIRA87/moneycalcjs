	const generateId = () => `id${Math.random(Math.random() * 1e8).toString(16)}`;

	const totalBalance = document.querySelector('.total__balance'),
	totalMoneyIncome = document.querySelector('.total__money-income'),
	totalMoneyExpenses = document.querySelector('.total__money-expenses'),
	historyList = document.querySelector('.history__list'),
	form = document.querySelector('#form'),
	operationName = document.querySelector('.operation__name'),
	operationAmount = document.querySelector('.operation__amount');

	let dbOperation = JSON.parse(localStorage.getItem('calc')) || [];

	const renderOperation = (operation) => {
	const className =
		operation.amount < 0 ? 'history__item-minus' : 'history__item-plus';

	const listItem = document.createElement('li');

	listItem.classList.add('history__item');
	listItem.classList.add(className);

	listItem.innerHTML = `${operation.description}
		<span class="history__money">${operation.amount} ₽</span>
	<button class="history_delete" data-id="${operation.id}">x</button>
	`;

	historyList.append(listItem);
	};

	const updateBalance = () => {
	const resultIncome = dbOperation
		.filter((item) => item.amount > 0)
		.reduce((result, item) => result + item.amount, 0); // суммироваем доходы

	const resultExpenses = dbOperation
		.filter((item) => item.amount < 0)
		.reduce((result, item) => result + item.amount, 0); // суммироваем расходы

	totalMoneyIncome.textContent = resultIncome + ' ₽';
	totalMoneyExpenses.textContent = resultExpenses + ' ₽';
	totalBalance.textContent = resultIncome + resultExpenses + ' ₽';
	};

	const addOperation = (event) => {
	event.preventDefault();

	const operationNameValue = operationName.value,
		operationAmountValue = operationAmount.value;

	operationName.style.borderColor = ''; // стилы по умолчанию  для полей формы
	operationAmount.style.borderColor = ''; // стилы по умолчанию для полей формы

	if (operationNameValue && operationAmountValue) {
		const operation = {
		id: generateId(),
		description: operationNameValue,
		amount: +operationAmountValue,
		};

		dbOperation.push(operation);
		init(); // запускаем функцую что бы страница заново запускался
	} else {
		if (!operationNameValue) operationName.style.borderColor = 'red'; // если пусто поля формы, то раскрасым эти поля
		if (!operationAmountValue) operationAmount.style.borderColor = 'red'; // если пусто поля формы, то раскрасым эти поля
	}

	operationName.value = '';
	operationAmount.value = '';
	};

	// удаляем пункты
	const deleteOperation = () => {
	const target = event.target;
	if (target.classList.contains('history_delete')) {
		dbOperation = dbOperation.filter(
		(operation) => operation.id !== target.dataset.id
		);
		init();
	}
	};

	const init = () => {
	historyList.textContent = '';
	dbOperation.forEach(renderOperation); // вывод История расходов
	updateBalance();
	localStorage.setItem('calc', JSON.stringify(dbOperation)); // сохраняем данные в localStorage
	};

	form.addEventListener('submit', addOperation);
	historyList.addEventListener('click', deleteOperation);

	init();
