# Desafio Porto Digital – App de Rotas para Carros Elétricos

Aplicativo mobile desenvolvido em **React Native com Expo** para auxiliar motoristas de carros elétricos a:

- Visualizar **postos de carregamento** em um mapa interativo  
- Calcular **autonomia** a partir da carga atual do veículo  
- Sugerir **rotas até os postos** compatíveis com a autonomia informada  
- Gerenciar **postos favoritos**  
- (Em desenvolvimento) Gerenciar **fila de espera** em cada ponto de recarga

O projeto foi construído como parte do desafio **Porto Digital – Carros Elétricos**, com foco em usabilidade, integração com **Google Maps** e simulação de **telemetria por personas**.

---

## 1. Stack e principais dependências

A solução utiliza:

- **Expo + React Native** (front-end mobile)
- **TypeScript**
- **React Navigation** (navegação entre telas)
- **React Native Paper / React Native Elements** (componentes de UI – dependa do que está no `package.json`)
- **React Native Maps / Expo Maps** (renderização do mapa)
- **Google Maps Platform**  
  - Maps SDK for Android  
  - Directions API (rotas) – se utilizada  
  - Places API (busca de locais) – se utilizada  
- **AsyncStorage** (armazenamento local de favoritos e preferências)
- Funções utilitárias próprias para:
  - Cálculo de distância (ex.: **Haversine** em `src/utils/route.ts`)
  - Cálculo da autonomia e filtragem de postos

> As versões exatas de cada dependência podem ser consultadas no arquivo `package.json` do projeto.

---

## 2. Pré-requisitos de ambiente

Para recriar a solução em um ambiente novo (Windows):

- **Node.js**: versão LTS (18.x ou superior)
- **npm** (instalado junto com o Node) ou **yarn**
- **Expo CLI** (usado via `npx` – não precisa instalar globalmente)
- **JDK 21** (conforme documentação do projeto)
- **Android Studio** com:
  - Android SDK
  - Um emulador Android configurado **OU** um dispositivo físico com depuração USB ativa
- Conta no **Google Cloud Platform** com as APIs necessárias habilitadas

> Detalhes mais minuciosos de configuração de ambiente (variáveis de ambiente, instalação do JDK 21, Android SDK etc.) podem ser documentados em um arquivo complementar, por exemplo: `docs/ambiente-dev-windows.md`.

---

## 3. Clonar o repositório

No terminal:

```bash
# 1. Clonar o repositório
git clone https://github.com/Matheus13245/Projeto-PortoDigital.git

# 2. Entrar na pasta do projeto
cd Projeto-PortoDigital


4. Instalar as dependências do projeto

Ainda no diretório do projeto:

# Usando npm
npm install

# ou, se preferir yarn
# yarn install


Este comando irá instalar todas as bibliotecas definidas no package.json (React Native, Expo, React Navigation, Maps, etc.).

5. Configurar a chave da API do Google Maps

Para que o mapa e as rotas funcionem corretamente, é necessário configurar a chave da Google Maps Platform.

5.1 Criar projeto no Google Cloud

Acesse o console do Google Cloud (Google Cloud Console).

Crie um novo projeto ou selecione um já existente.

Anote o nome/ID do projeto.

5.2 Habilitar APIs necessárias

No menu APIs e serviços:

Clique em + Ativar APIs e serviços.

Ative, pelo menos:

Maps SDK for Android

Directions API


5.3 Criar chave de API

Ainda em APIs e serviços, vá em Credenciais.

Clique em Criar credenciais → Chave de API.

Copie a chave gerada.

(Recomendado) Restrinja a chave:

Por app Android (informando package e SHA-1) ou Por tipo de requisição HTTP (se for usada em backend ou em APIs REST).

5.4 Configurar a chave no projeto

Crie um arquivo .env na raiz do projeto:

cp .env.example .env   # se houver arquivo de exemplo
# ou crie diretamente


Dentro de .env, adicione:

GOOGLE_MAPS_API_KEY=SUACHAVEAQUI


Depois, verifique no código:

Certifique-se de que está lendo a variável correta (GOOGLE_MAPS_API_KEY ou similar).

Em projetos Expo, é comum expor a chave via app.json/app.config.js. Exemplo simplificado:

{
  "expo": {
    "extra": {
      "googleMapsApiKey": "SUACHAVEAQUI"
    }
  }
}


Ajuste conforme a forma que já foi implementada no código.

6. Configuração do emulador ou dispositivo físico
6.1 Emulador Android

Abra o Android Studio.

Vá em Device Manager.

Crie um novo AVD com:

Dispositivo (Pixel 6a)

Inicie o emulador.

6.2 Dispositivo físico (Android)

Ative as Opções de desenvolvedor.

Ative a Depuração USB.

Conecte o aparelho ao computador via cabo USB.

Autorize o computador no aparelho, se solicitado.

7. Rodar a aplicação em modo desenvolvimento

Com todas as dependências instaladas, a API key configurada e um dispositivo/emulador pronto:

# Iniciar o servidor Expo
npx expo start


Será aberta uma página no navegador com o painel do Expo.

Escolha:

“Run on Android device/emulator” para rodar no emulador já aberto, ou

Conecte o celular e selecione o dispositivo físico.

Caso o projeto esteja configurado para build direto:

# Construir e rodar diretamente no Android
npx expo run:android

8. Usuários de teste (personas)

O sistema simula a telemetria de diferentes perfis de usuário por meio de logins mockados, baseados nas personas definidas para o desafio.


Persona	Login/E-mail	Senha	Características simuladas
Dr. Rafael Andrade	rafael@evapp.com
	123456	Advogado, roda grandes distâncias entre Boa Viagem e Recife
João Silva	joao@evapp.com
	123456	Motorista que usa o carro para deslocamentos urbanos curtos
Ana Paula	ana@evapp.com
	123456	Usuária que planeja viagens intermunicipais

9. Funcionalidades e fluxo de uso

Depois de rodar o app e fazer login com uma das personas acima, o avaliador poderá testar:

Tela de Login

Informar e-mail e senha da persona.

Em caso de erro, o app exibe mensagem de credenciais inválidas.

Dashboard / Home

Exibe informações básicas da persona e/ou veículo:

Nome

Modelo do carro elétrico

Nível de carga (em %)

Autonomia estimada (km)

Configuração de autonomia

Mapa com postos de recarga

Mapa centralizado na região principal do desafio (ex.: Recife e arredores).

Marcadores representando os postos de carregamento.

Ao tocar em um marcador:

Abre um card com detalhes do posto (nome, endereço, distância, etc.).

Sugestão de rota

A partir da posição do usuário (via GPS) e da autonomia informada:

O app calcula a distância até cada posto (utilizando API de rotas).

Filtra os postos que cabem dentro da autonomia restante.

Ao selecionar um posto:

É exibida a rota no mapa (com Directions API) 

Favoritos

Botão de favoritar/desfavoritar posto (ex.: FavoriteButton).

O estado é salvo em AsyncStorage (@postos_favoritos ou similar).

Na próxima abertura do app, os favoritos são recuperados.

Fila de espera (em desenvolvimento)

A ideia é integrar com uma API/IoT para indicar a fila de espera em tempo real.

No momento, a tela/layout pode estar pronto, mas:

Sem integração real com dispositivos e com dados mockados

A funcionalidade está parcial.

10. Estrutura de pastas (exemplo)

A estrutura se apresenta da seguinte forma:

src/
  components/
    FavoriteButton.tsx
    CardPosto.tsx
  screens/
    Login.tsx
    Home.tsx
    Map.tsx
    Profile.tsx
  navigation/
    index.tsx
    AppNavigator.tsx
  context/
    AuthContext.tsx
  utils/
    route.ts
  hooks/
  assets/
app.json
package.json


11. Problemas comuns (Troubleshooting)

Alguns erros frequentes e como resolver:

Erro com JDK / Gradle

Verifique se o JDK 21 está instalado.

Confirme se a variável JAVA_HOME aponta para o diretório correto.

Reinicie o terminal após alterar variáveis de ambiente.

Emulador não aparece na lista do Expo

Garanta que o emulador está iniciado antes de rodar npx expo start.

Verifique se o Android Studio instalou corretamente as ferramentas de plataforma.

Mapa aparece cinza ou não carrega

Confirme se:

A chave GOOGLE_MAPS_API_KEY está correta.

As APIs (Maps SDK for Android, Directions, Places) estão ativadas.

O billing (cobrança) está habilitado no projeto do Google Cloud.

Erro de permissão de localização

Verifique se o app solicita permissão de localização (no Android).

Se estiver usando Expo, confira as permissões em app.json ("permissions": ["ACCESS_FINE_LOCATION"], etc.).

12. Como o avaliador pode validar a solução

Para que qualquer pessoa consiga recriar e avaliar a solução do zero:

Configurar o ambiente (Node, JDK 21, Android Studio).

Clonar o repositório e instalar dependências (npm install).

Criar chave de API no Google Cloud, ativar as APIs e configurar no .env.

Iniciar o emulador ou conectar um dispositivo Android físico.

Rodar o app (npx expo start ou npx expo run:android).

Logar com uma das personas de teste.

Navegar pelas telas:

Home → ajuste de autonomia

Mapa → visualização dos postos

Selecionar um posto → detalhes, rota e favoritos

Testar parte visual da fila de espera.

Seguindo este passo a passo, é possível reproduzir a mesma experiência de uso apresentada no desenvolvimento do desafio, em qualquer máquina compatível.
