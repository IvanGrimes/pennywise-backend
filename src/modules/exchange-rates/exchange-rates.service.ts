import { CurrencyEnum } from '@lib/types';
import { Inject, Injectable } from '@nestjs/common';
import * as superagent from 'superagent';
import { Repository } from 'typeorm';
import { exchangeRatesRepositoryDi } from './exchange-rates.di';
import { ExchangeRatesEntity } from './exchange-rates.entity';

type ExchangeRates = {
  fetchedAt: number;
  rates: {
    RUB: number;
    USD: number;
    GBP: number;
    AED: number;
  };
};

@Injectable()
export class ExchangeRatesService {
  constructor(
    @Inject(exchangeRatesRepositoryDi)
    private readonly exchangeRatesRepository: Repository<ExchangeRatesEntity>,
  ) {}

  private async fetchRates() {
    const result = await superagent
      .get('http://api.exchangeratesapi.io/v1/latest')
      .query({
        access_key: '1589d705c544923a30f79e913c7ce54c',
        symbols: 'RUB,USD,AED,GBP',
      });

    return result.body as ExchangeRates;
  }

  async convert({
    value,
    from,
    to,
  }: {
    value: number;
    from: CurrencyEnum;
    to: CurrencyEnum;
  }) {
    let exchangeRates = await this.exchangeRatesRepository.findOne({
      where: { id: 1 },
    });

    if (!exchangeRates) {
      const result = await this.fetchRates();

      exchangeRates = this.exchangeRatesRepository.create({
        id: 1,
        updatedAt: new Date(),
        ...result.rates,
      });

      await this.exchangeRatesRepository.save(exchangeRates);
    }
    if (exchangeRates) {
      exchangeRates.updatedAt.setHours(exchangeRates.updatedAt.getHours() + 3);

      if (Date.now() - exchangeRates.updatedAt.getTime() > 1000 * 60 * 60) {
        const result = await this.fetchRates();

        exchangeRates = this.exchangeRatesRepository.merge(
          exchangeRates,
          result.rates,
        );

        await this.exchangeRatesRepository.save(exchangeRates);
      }
    }

    if (!exchangeRates) {
      throw new Error('Could not fetch exchange rates');
    }

    const parsedTo = to.toUpperCase() as keyof ExchangeRates['rates'];
    const parsedFrom = from.toUpperCase() as keyof ExchangeRates['rates'];

    if (from === CurrencyEnum.eur) {
      return value * exchangeRates[parsedTo];
    }

    return Number(
      (value * (exchangeRates[parsedTo] / exchangeRates[parsedFrom])).toFixed(
        2,
      ),
    );
  }
}
