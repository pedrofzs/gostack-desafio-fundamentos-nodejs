import Transaction from '../models/Transaction';

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const income = this.transactions.reduce(
      (accumulator, { type, value }) =>
        type === 'income' ? accumulator + value : accumulator,
      0,
    );

    const outcome = this.transactions.reduce(
      (accumulator, { type, value }) =>
        type === 'outcome' ? accumulator + value : accumulator,
      0,
    );

    const balance: Balance = {
      income,
      outcome,
      total: income - outcome,
    };

    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({
      title,
      value,
      type,
    });

    const { total } = this.getBalance();

    if (type === 'outcome' && value > total) {
      throw Error(
        'The outcome transaction has a value greater than current balance.',
      );
    }

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
