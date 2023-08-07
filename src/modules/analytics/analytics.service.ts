import { getTransactionFilters } from '@lib/filters/transactions';
import { Injectable } from '@nestjs/common';
import { CategoriesService } from '@modules/categories';
import { ExchangeRatesService } from '@modules/exchange-rates';
import { TransactionEntityTypeEnum } from '@modules/transactions';
import { GetExpensesByCategoriesRequestDto } from './dto';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly exchangeRatesService: ExchangeRatesService,
  ) {}

  async getExpensesByCategories({
    userId,
    getExpensesByCategoriesDto,
  }: {
    userId: number;
    getExpensesByCategoriesDto: GetExpensesByCategoriesRequestDto;
  }) {
    const filters = getTransactionFilters(getExpensesByCategoriesDto);
    const categories = await this.categoriesService.get(
      userId,
      {
        transactions: true,
        user: true,
      },
      {
        id: filters.category.id,
        transactions: {
          type: filters.transaction.transactionType,
          createdAt: filters.transaction.createdAt,
          account: { id: filters.account.id },
        },
      },
    );

    const result = await categories.reduce<
      Promise<
        {
          category: { id: number; name: string; color: string };
          amount: number;
        }[]
      >
    >(async (acc, item) => {
      (await acc).push({
        category: {
          id: item.id,
          name: item.name,
          color: item.color,
        },
        amount: Math.round(
          (await item.transactions?.reduce(async (acc1, item1) => {
            let amount = item1.amount;

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
