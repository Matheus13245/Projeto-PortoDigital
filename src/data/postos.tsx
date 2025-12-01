export type TipoCarga = "lenta" | "media" | "rapida";

export interface Fila {
  tipo: TipoCarga;     // agora só UM tipo
  vagas: number;       // vagas daquele tipo
  fila: number;        // pessoas aguardando
}

export interface Posto {
  tags: {};
  id: number;
  nome: string;
  latitude: number;
  longitude: number;
  endereco?: string;
  fila: Fila;          // apenas um tipo
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
      tipo: "lenta",
      vagas: 2,
      fila: 5,
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
      tipo: "media",
      vagas: 2,
      fila: 1,
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
      tipo: "lenta",
      vagas: 3,
      fila: 4,
    },
  },
  {
    id: 4,
    tags: {},
    nome: "Shopping Patteo",
    latitude: -7.993276,
    longitude: -34.840233,
    endereco: "Casa Caiada, Olinda - PE",
    fila: {
      tipo: "media",
      vagas: 2,
      fila: 3,
    },
  },
  {
    id: 5,
    tags: {},
    nome: "Restaurante",
    latitude: -7.994901,
    longitude: -34.844004,
    endereco: "Bairro Novo, Olinda - PE",
    fila: {
      tipo: "rapida",
      vagas: 1,
      fila: 2,
    },
  },
  {
    id: 6,
    tags: {},
    nome: "Posto Fortaleza",
    latitude: -3.71722,
    longitude: -38.5434,
    endereco: "Av. Beira Mar, Fortaleza - CE",
    fila: {
      tipo: "lenta",
      vagas: 2,
      fila: 2,
    },
  },
  {
    id: 7,
    tags: {},
    nome: "Posto Shell Piedade",
    latitude: -8.18085,
    longitude: -34.92047,
    endereco: "Piedade, Jaboatão - PE",
    fila: {
      tipo: "rapida",
      vagas: 1,
      fila: 2,
    },
  },
  {
    id: 8,
    tags: {},
    nome: "Posto Ipiranga Casa Forte",
    latitude: -8.02735,
    longitude: -34.9227,
    endereco: "Casa Forte, Recife - PE",
    fila: {
      tipo: "media",
      vagas: 2,
      fila: 1,
    },
  },
  {
    id: 9,
    tags: {},
    nome: "Posto BR Espinheiro",
    latitude: -8.03781,
    longitude: -34.89835,
    endereco: "Espinheiro, Recife - PE",
    fila: {
      tipo: "lenta",
      vagas: 2,
      fila: 2,
    },
  },
  {
    id: 10,
    tags: {},
    nome: "Posto Shell Madalena",
    latitude: -8.0504,
    longitude: -34.9049,
    endereco: "Madalena, Recife - PE",
    fila: {
      tipo: "lenta",
      vagas: 3,
      fila: 1,
    },
  },
  {
    id: 11,
    tags: {},
    nome: "Posto BR Caxangá",
    latitude: -8.04326,
    longitude: -34.9497,
    endereco: "Caxangá, Recife - PE",
    fila: {
      tipo: "media",
      vagas: 2,
      fila: 3,
    },
  },
  {
    id: 12,
    tags: {},
    nome: "Posto Shell Paulista",
    latitude: -7.94026,
    longitude: -34.8201,
    endereco: "Paulista - PE",
    fila: {
      tipo: "rapida",
      vagas: 1,
      fila: 2,
    },
  },
  {
    id: 13,
    tags: {},
    nome: "Posto Ipiranga Rio Doce",
    latitude: -7.98795,
    longitude: -34.83548,
    endereco: "Rio Doce, Olinda - PE",
    fila: {
      tipo: "media",
      vagas: 2,
      fila: 2,
    },
  },
  {
    id: 14,
    tags: {},
    nome: "Posto BR Imbiribeira",
    latitude: -8.10888,
    longitude: -34.91785,
    endereco: "Imbiribeira, Recife - PE",
    fila: {
      tipo: "lenta",
      vagas: 3,
      fila: 2,
    },
  },
  {
    id: 15,
    tags: {},
    nome: "Posto Shell Boa Vista",
    latitude: -8.0541,
    longitude: -34.8889,
    endereco: "Boa Vista, Recife - PE",
    fila: {
      tipo: "media",
      vagas: 2,
      fila: 3,
    },
  },
  {
    id: 16,
    tags: {},
    nome: "Posto BR Afogados",
    latitude: -8.07597,
    longitude: -34.9078,
    endereco: "Afogados, Recife - PE",
    fila: {
      tipo: "lenta",
      vagas: 3,
      fila: 4,
    },
  },
];