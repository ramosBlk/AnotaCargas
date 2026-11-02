# 🏋️ AnotaCargas

<p align="center">
  Aplicativo para organização de treinos e acompanhamento de cargas na musculação.
</p>

<p align="center">
  <strong>Organize seus exercícios. Registre suas cargas. Acompanhe sua evolução.</strong>
</p>

---

## 📌 Sobre o projeto

O **AnotaCargas** é uma aplicação desenvolvida para facilitar o registro, a organização e o acompanhamento das cargas utilizadas durante os treinos de musculação.

A proposta é oferecer uma ferramenta simples e intuitiva, permitindo que o usuário organize seus exercícios por grupos musculares, registre as cargas utilizadas e atualize suas informações sempre que necessário.

O aplicativo busca centralizar as informações dos treinos em um único ambiente, tornando a consulta e o gerenciamento dos exercícios mais práticos.

## 🎯 Objetivos

- Facilitar o registro das cargas utilizadas nos exercícios.
- Organizar os exercícios por grupos musculares.
- Permitir atualizações rápidas das cargas.
- Manter os registros salvos para consultas posteriores.
- Oferecer uma interface simples e intuitiva para dispositivos móveis.

## ⚙️ Funcionalidades

### 📁 Organização por grupos musculares

O aplicativo permite organizar os exercícios em pastas, representando diferentes grupos musculares.

Exemplos de categorias:
- Peito
- Costas
- Ombros
- Bíceps
- Tríceps
- Pernas

O usuário também pode criar suas próprias categorias, conforme sua organização de treino.

### 🏋️ Gerenciamento de exercícios

Cada pasta pode armazenar diferentes exercícios, permitindo:

- Cadastrar novos exercícios.
- Informar o nome do exercício.
- Registrar a carga utilizada.
- Consultar os exercícios cadastrados.
- Editar nomes e cargas.
- Excluir exercícios.

### 💾 Persistência de dados

A aplicação foi planejada para manter as informações registradas mesmo após o encerramento e a reabertura do aplicativo.

As operações de cadastro, edição e exclusão devem refletir corretamente no armazenamento dos dados.

## 🧠 Processo de desenvolvimento

Um dos principais pontos do projeto foi a preocupação com o planejamento antes de iniciar a implementação.

O desenvolvimento contou com o auxílio da **Alura** e **Google AI Studio**, utilizado como ferramenta de apoio na construção da aplicação.

Antes da implementação em código, foi realizado um levantamento estruturado para definir o comportamento esperado do sistema.

### Etapas do planejamento

**1. Levantamento de requisitos**

Identificação das necessidades do aplicativo e definição das funcionalidades essenciais para sua primeira versão.

**2. Definição dos requisitos funcionais e não funcionais**

Especificação das operações disponíveis ao usuário, bem como dos requisitos relacionados à usabilidade, confiabilidade e persistência dos dados.

**3. Especificação do CRUD**

Definição das quatro operações fundamentais de gerenciamento:

| Operação | Descrição |
|---|---|
| Create | Cadastro de pastas e exercícios |
| Read | Consulta e visualização dos registros |
| Update | Edição de informações e cargas |
| Delete | Exclusão de pastas e exercícios |

**4. Definição das regras de negócio**

Estabelecimento das condições necessárias para garantir o funcionamento adequado da aplicação, incluindo validação de campos obrigatórios e relacionamento entre pastas e exercícios.

**5. Definição dos critérios de aceitação e testes**

Elaboração de cenários para verificar se as funcionalidades atendem aos requisitos estabelecidos, incluindo testes de cadastro, edição, exclusão e persistência dos dados.

**6. Implementação da aplicação**

Após a definição do escopo e das regras de funcionamento, iniciou-se a implementação utilizando o Google AI Studio como ferramenta de apoio.

Essa metodologia permitiu estabelecer uma direção clara para o desenvolvimento, reduzindo improvisações e facilitando a validação das funcionalidades.

## 🧪 Validação e testes

A primeira versão considera os seguintes cenários de validação:

- Cadastro de grupos musculares.
- Cadastro de exercícios dentro das respectivas pastas.
- Edição de exercícios e cargas.
- Exclusão de exercícios com confirmação.
- Edição e exclusão de pastas.
- Validação de campos obrigatórios.
- Aceitação de valores decimais nas cargas.
- Verificação da persistência dos dados após fechar e reabrir a aplicação.

## 🚀 Escopo do projeto

A primeira versão (MVP) tem como prioridade entregar as funcionalidades essenciais para o gerenciamento de cargas.

O desenvolvimento segue uma abordagem incremental, permitindo que novas funcionalidades sejam planejadas e incorporadas futuramente, sem comprometer a estrutura inicial.

## 🛠️ Tecnologias e ferramentas

- **Google AI Studio:** apoio ao desenvolvimento da aplicação por meio de inteligência artificial.
- **Git e GitHub:** versionamento e armazenamento do código-fonte.
- **Engenharia de Software:** levantamento de requisitos, especificação CRUD, regras de negócio e critérios de aceitação.

## 📂 Repositório

O código-fonte e o histórico de desenvolvimento estão disponíveis em:

[AnotaCargas – GitHub](https://github.com/ramosBlk/AnotaCargas)

## 📈 Evolução do projeto

O AnotaCargas foi concebido para evoluir de acordo com as necessidades de utilização, mantendo como princípio a organização das informações e a facilidade de gerenciamento dos treinos.

Novas funcionalidades poderão ser incorporadas em versões futuras, conforme a evolução do projeto.

---

<p align="center">
  Desenvolvido com auxílio de inteligência artificial e aplicação de conceitos de Engenharia de Software.
</p>
