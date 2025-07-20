export const mockDashboardData = {
  overviewStats: [
    { label: 'Ganancia total', value: 75000 },
    { label: 'Ingresos totales', value: 120000 },
    { label: 'Gastos totales', value: 45000 },
  ],
  salesData: [
    { label: 'Hoy', value: -1500 },
    { label: 'Última Semana', value: 8500 },
    { label: 'Último Mes', value: 30000 },
    { label: 'Último Año', value: 350000 },
  ],
  bestSellingServices: [
    { label: 'Depilación Láser', value: 5000 },
    { label: 'Blanqueamiento Láser', value: 3000 },
    { label: 'Faciales', value: 2000 },
  ],
  bestSellingProducts: [
    { label: 'Beauty Clarant', value: 10000 },
    { label: 'Hydra Cream', value: 8000 },
    { label: 'Facial Serum', value: 7000 },
  ],
  yearlySales: {
    categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    series: [
      {
        name: '2024',
        data: [
          { name: 'Ingresos Totales', data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49] },
          { name: 'Gastos Totales', data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77] },
        ],
      },
      {
        name: '2025',
        data: [
          { name: 'Ingresos Totales', data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49] },
          { name: 'Gastos Totales', data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77] },
        ],
      },
    ],
  },
};
