import { CurrencyPipe } from './currency-pipe';

describe('CurrencyPipe', () => {
  it('create an instance', () => {
    const pipe = new CurrencyPipe();
    expect(pipe).toBeTruthy();
  });

  it('debe formatear un numero entero correctamente', () => {
    const pipe = new CurrencyPipe();
    const result = pipe.transform(100);
    expect(result).toBe('S/ 100.00');
  });

  it('debe formatear un numero decimal a 2 posiciones', () => {
    const pipe = new CurrencyPipe();
    const result = pipe.transform(99.90);
    expect(result).toBe('S/ 99.90');
  });

  it('debe retornar valor por defecto para entradas no numéricas', () => {
    const pipe = new CurrencyPipe();
    const result = pipe.transform('abc');
    expect(result).toBe('S/ 0.00');
  });

  it('debe retornar valor por defecto para null', () => {
    const pipe = new CurrencyPipe();
    const result = pipe.transform(null);
    expect(result).toBe('S/ 0.00');
  });

  it('debe retornar valor por defecto para undefined', () => {
    const pipe = new CurrencyPipe();
    const result = pipe.transform(undefined);
    expect(result).toBe('S/ 0.00');
  });
});
