import { TransactionEntityTypeEnum } from '@modules/transactions';
import { Any, Between, FindOperator, In, Not } from 'typeorm';
import { TransactionFiltersDto } from './transaction-filters.dto';

export const getTransactionFilters = (
  transactionFiltersDto: TransactionFiltersDto,
) => {
  return {
    transaction: getTransactionFilter(transactionFiltersDto),
    category: getCategoryFilter(transactionFiltersDto),
    account: getAccountFilter(transactionFiltersDto),
  };
};

function getTransactionFilter(transactionFiltersDto: TransactionFiltersDto) {
  const result: {
    createdAt?: FindOperator<Date>;
    transactionType?: TransactionEntityTypeEnum;
  } = {
    transactionType: transactionFiltersDto.transactionType,
  };

  if (!transactionFiltersDto.dateFrom || !transactionFiltersDto.dateTo)
    return result;

  const dateTo = new Date(transactionFiltersDto.dateTo);

  dateTo.setDate(dateTo.getDate() + 1);

  result.createdAt = Between(new Date(transactionFiltersDto.dateFrom), dateTo);

  return result;
}

function getCategoryFilter(transactionFiltersDto: TransactionFiltersDto) {
  if (!transactionFiltersDto.categoryIds?.length) return {};

  const id =
    transactionFiltersDto.categoryBehavior === 'include'
      ? Any(transactionFiltersDto.categoryIds)
      : Not(In(transactionFiltersDto.categoryIds));

  return { id };
}

function getAccountFilter(transactionFiltersDto: TransactionFiltersDto) {
  return {
    id: transactionFiltersDto.accountIds?.length
      ? Any(transactionFiltersDto.accountIds)
      : undefined,
  };
}
