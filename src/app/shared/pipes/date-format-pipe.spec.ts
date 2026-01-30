import { DateFormatPipe } from './date-format-pipe';

describe('DateFormatPipe', () => {
  
  let pipe: DateFormatPipe;

  beforeEach (() => {
    pipe = new DateFormatPipe()
  } );

  it(`formato de fecha corto`, ()=>{
    //cusamos un valor de data posible desde back u otro origen
    const data = new Date('2024-06-15T00:00:00');
    // llamamos al metodo de transform para formatear la fecha conferida al modo corto
    const result = pipe.transform(data, `short`);
    // inferimos que el resultado es el esperado consideramdo el formato short usnado el metodo Intl.DateTimeformat
    console.log(`resutado esperado de short`,result);
    
    expect(result).toBe(new Intl.DateTimeFormat(`es-PE`, {dateStyle: `short`}).format(data));
  });

  it(`formato de fecha long`, ()=>{
    //cusamos un valor de data posible desde back u otro origen
    const data = new Date('2024-06-15T00:00:00');
    // llamamos al metodo de transform para formatear la fecha conferida al modo largo
    const result = pipe.transform(data, `long`);
    // inferimos que el resultado es el esperado consideramdo el formato long usnado el metodo Intl.DateTimeformat
    console.log(`resutado esperado de long`, result);
    
    expect(result).toBe(new Intl.DateTimeFormat(`es-PE`, {dateStyle: `long`}).format(data));
  });

  it(`formato de fecha full`, ()=>{
    //cusamos un valor de data posible desde back u otro origen
    const data = new Date('2024-06-15T00:00:00');
    // llamamos al metodo de transform para formatear la fecha conferida al modo full
    const result = pipe.transform(data, `full`);
    // inferimos que el resultado es el esperado consideramdo el formato full usnado el metodo Intl.DateTimeformat
    console.log(`resutado esperado de full`, result);
    
    expect(result).toBe(new Intl.DateTimeFormat(`es-PE`, {dateStyle: `full`}).format(data));
  })

});