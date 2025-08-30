import { Op } from "sequelize";
import db from "../models/index.js";

const Income = db.Income;

export const getIncomes = async (req, res) => {
    try {
        const { start, end } = req.query;
        const where = { user_id: req.user.id };

        if (start && end) {
            where.income_date = { [Op.between]: [new Date(start), new Date(end)] };
        }

        const incomes = await Income.findAll({ where, order: [["income_date", "DESC"]] });
        res.json(incomes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching incomes", error: error.message });
    }
};

export const getIncomeById = async (req, res) => {
    try {
        const income = await Income.findOne({
            where: { id: req.params.id, user_id: req.user.id },
        });

        if (!income) return res.status(404).json({ message: "Income not found" });
        res.json(income);
    } catch (error) {
        res.status(500).json({ message: "Error fetching income", error: error.message });
    }
};

export const createIncome = async (req, res) => {
    try {
        const { amount, date, source, description } = req.body;

        const income = await Income.create({
            amount,
            income_date: date,
            source,
            description,
            user_id: req.user.id,
        });

        res.status(201).json(income);
    } catch (error) {
        res.status(500).json({ message: "Error creating income", error: error.message });
    }
};

export const updateIncome = async (req, res) => {
    try {
        const { amount, date, source, description } = req.body;

        const income = await Income.findOne({
            where: { id: req.params.id, user_id: req.user.id },
        });

        if (!income) return res.status(404).json({ message: "Income not found" });

        if (amount !== undefined) income.amount = amount;
        if (date !== undefined) income.income_date = date;
        if (source !== undefined) income.source = source;
        if (description !== undefined) income.description = description;

        await income.save();
        res.json(income);
    } catch (error) {
        res.status(500).json({ message: "Error updating income", error: error.message });
    }
};

export const deleteIncome = async (req, res) => {
    try {
        const income = await Income.findOne({
            where: { id: req.params.id, user_id: req.user.id },
        });

        if (!income) return res.status(404).json({ message: "Income not found" });

        await income.destroy();
        res.json({ message: "Income deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting income", error: error.message });
    }
};
