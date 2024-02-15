# Kanban - Crud Front End

Este é o frontend do projeto de um Kanban Board, uma aplicação web para gerenciar tarefas em colunas organizadas. Este
documento contém informações sobre como baixar, configurar e executar o projeto, além de detalhes sobre as tecnologias
utilizadas.

## Pré-requisitos

- Node.js instalado na sua máquina
- Um navegador web moderno (como Chrome, Firefox, Safari, etc.)

## Instalação

1. Clone este repositório para o seu computador:
   ```bash
   git clone https://github.com/AndreBezBirolo/desafio-tecnico-clint-front.git
   ```

2. Navegue até o diretório do projeto:
   ```bash
   cd desafio-tecnico-clint-front
   ```

3. Instale as dependências do projeto utilizando npm ou yarn:
   ```bash
   npm install
   # ou
   yarn install
   ```

## Configuração

Antes de executar o projeto, você precisa configurar o arquivo `.env` na raiz do projeto. Copie o conteúdo do
arquivo `.env.example` e configure as variáveis de ambiente conforme o seu ambiente de desenvolvimento.

```bash
REACT_APP_BACKEND_URL=http://localhost:3000
```

Certifique-se de substituir `http://localhost:3000` pela URL do backend do seu projeto, se for diferente.

## Execução

Após a instalação e configuração, você pode iniciar o servidor de desenvolvimento executando o seguinte comando:

```bash
npm start
# ou
yarn start
```

Isso iniciará o servidor de desenvolvimento e abrirá a aplicação no seu navegador padrão. Se isso não acontecer, você
pode acessar a aplicação em [http://localhost:3001](http://localhost:3001).

## Detalhes e Tecnologias Utilizadas

Este projeto frontend foi desenvolvido utilizando as seguintes tecnologias:

- React.js: uma biblioteca JavaScript para criar interfaces de usuário
- TypeScript: uma linguagem de programação que adiciona tipos à JavaScript
- Axios: um cliente HTTP baseado em Promises para fazer requisições ao backend
- React Bootstrap: uma biblioteca de componentes React baseada no Bootstrap
- react-beautiful-dnd: uma biblioteca para arrastar e soltar elementos em React
- Lodash: uma biblioteca utilitária JavaScript

## Contribuição

As contribuições são bem-vindas! Para sugestões, abra um problema. Para alterações importantes, envie um pull request.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).