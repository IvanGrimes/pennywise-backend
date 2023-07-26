import { CategoriesService } from '@modules/categories';
import { ExchangeRatesService } from '@modules/exchange-rates';
import { TransactionEntityTypeEnum } from '@modules/transactions/transactions.types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly exchangeRatesService: ExchangeRatesService,
  ) {}

  async getExpensesByCategories(userId: number) {
    const categories = await this.categoriesService.get(userId, {
      transactions: true,
      user: true,
    });

    const result = await categories.reduce<
      Promise<
        {
          category: { name: string; color: string };
          amount: number;
        }[]
      >
    >(async (acc, item) => {
      (await acc).push({
        category: {
          name: item.name,
          color: item.color,
        },
        amount: Math.round(
          (await item.transactions?.reduce(async (acc1, item1) => {
            let amount =
              item1.type === TransactionEntityTypeEnum.Outcome
                ? item1.amount
                : 0;

            if (item1.account.currency !== item.user.mainCurrency) {
              amount = await this.exchangeRatesService.convert({
                value: amount,
                from: item1.account.currency,
                to: item.user.mainCurrency,
              });
            }

            return (await acc1) + amount;
          }, Promise.resolve(0))) ?? 0,
        ),
      });

      return acc;
    }, Promise.resolve([]));
    const totalAmount = result.reduce((acc, item) => acc + item.amount, 0);

    return result.map((item) => ({
      ...item,
      percentage: Math.round(item.amount / (totalAmount / 100)),
    }));
  }
}
