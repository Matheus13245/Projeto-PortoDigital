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
];
