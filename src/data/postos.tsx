export interface Posto {
  id: number;
  nome: string;
  latitude: number;
  longitude: number;
  endereco?: string; // opcional, se quiser exibir depois
}

export const postos: Posto[] = [
  {
    id: 1,
    nome: "Posto Shell Boa Viagem",
    latitude: -8.1265,
    longitude: -34.9026,
    endereco: "Av. Domingos Ferreira, 2200 - Boa Viagem, Recife - PE",
  },
  {
    id: 2,
    nome: "Posto Ipiranga Derby",
    latitude: -8.0581,
    longitude: -34.8967,
    endereco: "Av. Gov. Agamenon Magalhães, 1855 - Derby, Recife - PE",
  },
  {
    id: 3,
    nome: "Posto BR Pina",
    latitude: -8.0898,
    longitude: -34.8834,
    endereco: "Av. Antônio de Góes, 900 - Pina, Recife - PE",
  },
    {
    id: 4,
    nome: "Shopping Patteo",
    latitude: -7.993276024706461,
    longitude: -34.8402334594689,
    endereco: "AR. Carmelita Muniz de Araújo, 225 - Casa Caiada, Olinda - PE, 53130-645",
  },
      {
    id: 5,
    nome: "Restaurante",
    latitude: -7.994901585121049, 
    longitude: -34.84400464505556,
    endereco: "Av. Carlos de Lima Cavalcante, 1085 - Bairro Novo, Olinda - PE, 53030-260",
  },
];