const { incomeExpenseService } = require("../services");
const { IncomeExpense } = require("../models");

const createIncomeExpense = async (req, res) => {
	try {
		const { category, amount, date } = req.body;
		const incomeExpense = await incomeExpenseService.create(req.user.id, category, amount, date);
		return res.status(201).json({ incomeExpense });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const getIncomeExpense = async (req, res) => {
	try {
		if(req.query.filter){
			if(req.query.filter==='Expense' || req.query.filter==='Income'){
				const incomeExpense = await IncomeExpense.findAll({ where: {UserId: req.user.id, category: req.query.filter}});
				return res.status(200).json({ incomeExpense });
			}
		}
		const incomeExpense = await incomeExpenseService.getAll(req.user.id);
		return res.status(200).json({ incomeExpense });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const deleteIncomeExpense = async (req, res) => {
	try {
		const incomeExpense = await incomeExpenseService.getIncomeExpenseById(req.params.id);

		if (incomeExpense) {
			if (incomeExpense.UserId !== req.user.id) {
				return res.status(403).json({ error: "You are not authorized to perform this!" });
			}
			await incomeExpenseService.deleteIncomeExpenseById(req.params.id);
			return res.status(200).json({ message: "Income Expense deleted!" });
		}
		return res.status(404).json({ error: "Income Expense not found!" });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const updateIncomeExpense = async (req, res) => {
	try {
		const incomeExpense = await incomeExpenseService.getIncomeExpenseById(req.params.id);

		if (incomeExpense) {
			if (incomeExpense.UserId !== req.user.id) {
				return res.status(403).json({ error: "You are not authorized to perform this!" });
			}
			await incomeExpense.set({
                ...incomeExpense,
                ...req.body
            });
            await incomeExpense.save();
            await incomeExpense.reload();
			return res.status(200).json(incomeExpense);
		}
		return res.status(404).json({ error: "Income Expense not found!" });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

module.exports = {
	createIncomeExpense,
	getIncomeExpense,
	deleteIncomeExpense,
	updateIncomeExpense
};
