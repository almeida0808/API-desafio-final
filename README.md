<div align="center">
  <img alt="Logo Explorer" title="Explorer" src="https://i.imgur.com/2IqqDoo.png">
</div>
<br>

# API - FoodExplorer
Desenvolvimento de uma API que concentrará dados de usuários, pedidos e pratos do cardápio.
<br>
<br>
<h3 align="center">Desenvolvido em: </h3>
<div align="center">
    <img align="center" alt="JS" height="50" width="60" src="https://cdn.worldvectorlogo.com/logos/javascript-1.svg">
    <img align="center" alt="Nodejs" height="50" width="60" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-plain.svg">
</div>
<br>


# Detalhes sobre a arquitetura do projeto

/src/ <br>
  - /server.js        -> Responsável pela inicialização do projeto
  - /Routes/          -> Serão mantidas todas as rotas da aplicação
    - /index.js       -> Centraliza as rotas da aplicação
    - /user.routes.js -> Possui só as rotas de users
  - /Controllers/     -> Será a parte que irá processar as requisições (local com a regra de negócio)
    - /UsersController.js
  - /Utils/           -> Local responsável pelas utilizadas e padronizações da aplicação



### Instalação
```bash
# Faça o clone do repositório

# Modifique as variáveis de ambiente em um arquivo .env
  AUTH_SECRET=
  PORT=

# Faça a instalação das depêndencias
  npm i

# Rode as migration
  npm run migrate

# Executando o projeto no ambiente de desenvolvimento
  npm run dev
```

## ✔️ Autores

- [Lucas Almeida](https://github.com/almeida0808/)

## 📄 Professores da trilha Explorer

- [Rodrigo Gonçalves](https://github.com/rodrigorgtic)
- [Mayk Brito](https://github.com/maykbrito)

## 📄 Referência

- [Rockeseat](https://www.rocketseat.com.br/)
