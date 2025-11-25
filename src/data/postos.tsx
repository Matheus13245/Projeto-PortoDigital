export interface Fila {
  lenta: { vagas: number; fila: number };
  media: { vagas: number; fila: number };
  rapida: { vagas: number; fila: number };
}

export interface Posto {
  tags: {};
  id: number;
  nome: string;
  latitude: number;
  longitude: number;
  endereco?: string;
  fila: Fila;
}


export const postos: Posto[] = [
  {
    id: 1,
    tags: {},
    nome: "Posto Shell Boa Viagem",
    latitude: -8.1265,
    longitude: -34.9026,
    endereco: "Av. Domingos Ferreira, 2200 - Boa Viagem, Recife - PE",
    fila: {
      lenta: { vagas: 2, fila: 5 },
      media: { vagas: 1, fila: 3 },
      rapida: { vagas: 1, fila: 0 },
    },
  },
  {
    id: 2,
    tags: {},
    nome: "Posto Ipiranga Derby",
    latitude: -8.0581,
    longitude: -34.8967,
    endereco: "Av. Gov. Agamenon Magalhães, 1855 - Derby, Recife - PE",
    fila: {
      lenta: { vagas: 1, fila: 2 },
      media: { vagas: 2, fila: 1 },
      rapida: { vagas: 1, fila: 0 },
    },
  },
  {
    id: 3,
    tags: {},
    nome: "Posto BR Pina",
    latitude: -8.0898,
    longitude: -34.8834,
    endereco: "Av. Antônio de Góes, 900 - Pina, Recife - PE",
    fila: {
      lenta: { vagas: 3, fila: 4 },
      media: { vagas: 1, fila: 2 },
      rapida: { vagas: 1, fila: 1 },
    },
  },
  {
    id: 4,
    tags: {},
    nome: "Shopping Patteo",
    latitude: -7.993276,
    longitude: -34.840233,
    endereco: "AR. Carmelita Muniz de Araújo, 225 - Casa Caiada, Olinda - PE, 53130-645",
    fila: {
      lenta: { vagas: 2, fila: 1 },
      media: { vagas: 2, fila: 3 },
      rapida: { vagas: 1, fila: 0 },
    },
  },
  {
    id: 5,
    tags: {},
    nome: "Restaurante",
    latitude: -7.994901,
    longitude: -34.844004,
    endereco: "Av. Carlos de Lima Cavalcante, 1085 - Bairro Novo, Olinda - PE, 53030-260",
    fila: {
      lenta: { vagas: 1, fila: 0 },
      media: { vagas: 2, fila: 1 },
      rapida: { vagas: 1, fila: 2 },
    },
  },
  // Posto adicionado: propositalmente posicionado além do alcance típico a partir de Recife
  {
    id: 6,
    tags: {},
    nome: 'Posto Fortaleza',
    latitude: -3.71722,
    longitude: -38.5434,
    endereco: 'Av. Beira Mar, Fortaleza - CE',
    fila: {
      lenta: { vagas: 2, fila: 2 },
      media: { vagas: 1, fila: 1 },
      rapida: { vagas: 1, fila: 0 },
    },
  },
  // --- Adições reais de postos ---
{
  id: 7,
  tags: {},
  nome: "Posto Shell Piedade",
  latitude: -8.180850,
  longitude: -34.920470,
  endereco: "Av. Bernardo Vieira de Melo, 1650 - Piedade, Jaboatão dos Guararapes - PE",
  fila: {
    lenta: { vagas: 2, fila: 1 },
    media: { vagas: 1, fila: 0 },
    rapida: { vagas: 1, fila: 2 },
  },
},
{
  id: 8,
  tags: {},
  nome: "Posto Ipiranga Casa Forte",
  latitude: -8.027350,
  longitude: -34.922700,
  endereco: "Av. 17 de Agosto, 1501 - Casa Forte, Recife - PE",
  fila: {
    lenta: { vagas: 1, fila: 3 },
    media: { vagas: 2, fila: 1 },
    rapida: { vagas: 1, fila: 0 },
  },
},
{
  id: 9,
  tags: {},
  nome: "Posto BR Espinheiro",
  latitude: -8.037810,
  longitude: -34.898350,
  endereco: "Rua da Hora, 501 - Espinheiro, Recife - PE",
  fila: {
    lenta: { vagas: 2, fila: 2 },
    media: { vagas: 1, fila: 2 },
    rapida: { vagas: 1, fila: 1 },
  },
},
{
  id: 10,
  tags: {},
  nome: "Posto Shell Madalena",
  latitude: -8.050400,
  longitude: -34.904900,
  endereco: "Rua Real da Torre, 500 - Madalena, Recife - PE",
  fila: {
    lenta: { vagas: 3, fila: 1 },
    media: { vagas: 1, fila: 1 },
    rapida: { vagas: 1, fila: 0 },
  },
},
{
  id: 11,
  tags: {},
  nome: "Posto BR Caxangá",
  latitude: -8.043260,
  longitude: -34.949700,
  endereco: "Av. Caxangá, 2955 - Cordeiro, Recife - PE",
  fila: {
    lenta: { vagas: 1, fila: 2 },
    media: { vagas: 2, fila: 3 },
    rapida: { vagas: 1, fila: 1 },
  },
},
{
  id: 12,
  tags: {},
  nome: "Posto Shell Paulista",
  latitude: -7.940260,
  longitude: -34.820100,
  endereco: "PE-15, 1100 - Centro, Paulista - PE",
  fila: {
    lenta: { vagas: 2, fila: 0 },
    media: { vagas: 1, fila: 1 },
    rapida: { vagas: 1, fila: 2 },
  },
},
{
  id: 13,
  tags: {},
  nome: "Posto Ipiranga Rio Doce",
  latitude: -7.987950,
  longitude: -34.835480,
  endereco: "Av. Ministro Marcos Freire, 1890 - Rio Doce, Olinda - PE",
  fila: {
    lenta: { vagas: 1, fila: 1 },
    media: { vagas: 2, fila: 2 },
    rapida: { vagas: 1, fila: 1 },
  },
},
{
  id: 14,
  tags: {},
  nome: "Posto BR Imbiribeira",
  latitude: -8.108880,
  longitude: -34.917850,
  endereco: "Av. Mascarenhas de Moraes, 4825 - Imbiribeira, Recife - PE",
  fila: {
    lenta: { vagas: 3, fila: 2 },
    media: { vagas: 1, fila: 0 },
    rapida: { vagas: 1, fila: 0 },
  },
},
{
  id: 15,
  tags: {},
  nome: "Posto Shell Boa Vista",
  latitude: -8.054100,
  longitude: -34.888900,
  endereco: "Av. Conde da Boa Vista, 800 - Boa Vista, Recife - PE",
  fila: {
    lenta: { vagas: 2, fila: 1 },
    media: { vagas: 2, fila: 3 },
    rapida: { vagas: 1, fila: 1 },
  },
},
{
  id: 16,
  tags: {},
  nome: "Posto BR Afogados",
  latitude: -8.075970,
  longitude: -34.907800,
  endereco: "Av. Recife, 5000 - Afogados, Recife - PE",
  fila: {
    lenta: { vagas: 3, fila: 4 },
    media: { vagas: 1, fila: 1 },
    rapida: { vagas: 1, fila: 0 },
  },
},

];
