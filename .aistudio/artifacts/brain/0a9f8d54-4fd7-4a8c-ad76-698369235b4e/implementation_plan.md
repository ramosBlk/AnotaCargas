# ESPECIFICAÇÃO DE REQUISITOS DE SOFTWARE (SRS) – MVP
## Aplicativo Mobile para Registro e Gerenciamento de Cargas de Treino

---

### 1. Descrição Geral do Aplicativo

O **Aplicativo de Controle de Cargas de Treino (MVP)** é uma solução mobile concebida para atender à necessidade recorrente de praticantes de musculação: o registro rápido, descomplicado e seguro das cargas utilizadas em cada exercício.

Em ambientes de treino (academias), os usuários necessitam consultar e registrar alterações de peso em intervalos curtos entre as séries, muitas vezes operando o dispositivo com apenas uma das mãos. Cadernos físicos, blocos de notas genéricos ou aplicativos excessivamente complexos geram fricção, perda de tempo e inconsistência nos registros.

O objetivo deste MVP é entregar uma ferramenta utilitária essencial, com usabilidade intuitiva, zero sobrecarga cognitiva e persistência local garantida. O aplicativo centraliza as quatro operações fundamentais de dados (CRUD: Cadastrar, Listar, Editar e Excluir), permitindo que o atleta mantenha o foco total na execução do seu treino.

---

### 2. Requisitos Funcionais

A tabela e os tópicos a seguir detalham os requisitos funcionais que orientam o desenvolvimento e a homologação da primeira versão do sistema:

| Código | Nome do Requisito | Descrição Detalhada |
| :--- | :--- | :--- |
| **RF01** | **Cadastrar exercício** | O sistema deve disponibilizar formulário/mecanismo de entrada para inclusão de novos exercícios. Deve permitir a inserção do **nome do exercício** (texto) e da **carga utilizada** (numérica, com suporte a decimais). Após a confirmação, o registro deve ser salvo e passar a compor imediatamente a listagem geral. |
| **RF02** | **Listar exercícios** | O sistema deve apresentar todos os exercícios atualmente cadastrados em uma lista vertical otimizada para visualização mobile. Cada item da lista deve exibir com destaque visual o nome do exercício e a carga (com indicação da unidade, ex.: kg). A listagem deve ser atualizada de forma reativa a cada inclusão, alteração ou exclusão de dados. Deve conter mensagem amigável quando nenhum exercício estiver cadastrado (*Empty State*). |
| **RF03** | **Editar exercício** | O sistema deve permitir que o usuário selecione qualquer exercício já cadastrado para edição. Os campos de nome e carga devem ser pré-preenchidos com os dados atuais. Ao confirmar a edição, as informações devem ser atualizadas no registro existente (mantendo o identificador interno sem duplicação) e refletidas instantaneamente na interface. |
| **RF04** | **Excluir exercício** | O sistema deve disponibilizar um controle para exclusão individual de exercícios. Ao acionar a exclusão, o sistema obrigatoriamente exibirá um diálogo de confirmação. Se confirmado pelo usuário, o exercício é removido permanentemente do armazenamento e da listagem. Se cancelado, o registro permanece inalterado. |
| **RF05** | **Persistir informações** | O sistema deve gravar todos os dados cadastrados, modificados ou excluídos no armazenamento persistente local do dispositivo (ex.: LocalStorage, IndexedDB, SQLite ou AsyncStorage). Os dados devem permanecer íntegros e disponíveis mesmo se o aplicativo for encerrado em segundo plano, fechado forçadamente ou se o dispositivo for reiniciado. |

---

### 3. Requisitos Não Funcionais

| Código | Categoria | Descrição |
| :--- | :--- | :--- |
| **RNF01** | **Compatibilidade e Responsividade** | O aplicativo deve ser projetado com arquitetura *Mobile-First*, garantindo adaptação a diferentes dimensões de tela (resoluções a partir de 320px de largura). Elementos interativos (botões, campos de texto e áreas de toque) devem respeitar a dimensão mínima recomendada de 44x44 pixels (ou 48x48 dp) para toques ergonômicos. |
| **RNF02** | **Usabilidade e Ergonomia** | A interface gráfica deve ser minimalista, com tipografia legível e contraste adequado para ambientes de treino com iluminação variável. Teclados virtuais em dispositivos móveis devem ser acionados adequadamente (teclado decimal/numérico ao focar no campo de carga). |
| **RNF03** | **Desempenho** | As operações de consulta, renderização, cadastro, edição e exclusão local devem responder em tempo perceptível nulo (< 100 ms). A inicialização do aplicativo (*cold start*) deve ser inferior a 1,5 segundos. |
| **RNF04** | **Confiabilidade e Sobrevivência de Dados** | O sistema deve assegurar a integridade dos registros persistidos. Caso o aplicativo seja encerrado subitamente durante o uso, nenhum dado previamente gravado poderá ser corrompido ou perdido. |
| **RNF05** | **Integridade e Validação** | O sistema deve impedir a entrada de dados inválidos ou corrompidos, validando rigorosamente strings vazias (ou compostas apenas por espaços em branco) e formatos numéricos incoerentes antes de qualquer tentativa de persistência. |

---

### 4. Regras de Negócio

- **RN01 – Obrigatoriedade dos Campos:** Tanto o campo de nome do exercício quanto o campo de carga são de preenchimento estritamente obrigatório. Tentativas de envio com qualquer um dos campos ausentes ou em branco devem ser bloqueadas.
- **RN02 – Formato e Domínio da Carga:** O campo de carga deve aceitar estritamente valores numéricos estritamente positivos (`carga > 0`). Valores inteiros (ex.: `20`, `45`) e valores decimais (ex.: `12.5`, `2.25`) devem ser aceitos, permitindo o uso de ponto ou vírgula como separador decimal.
- **RN03 – Unicidade de Identificador e Semântica de Edição:** Cada registro de exercício deve possuir um identificador único exclusivo e imutável (UUID, ID auto-incremental ou carimbo temporal). A ação de edição deve atualizar as propriedades `nome` e `carga` do ID correspondente, sendo terminantemente proibida a criação de um novo registro ou duplicata decorrente de edição.
- **RN04 – Prevenção contra Exclusão Acidental:** Nenhuma exclusão pode ser executada com apenas um toque direto. A confirmação explícita pelo usuário em janela/modal de diálogo é mandatória.
- **RN05 – Persistência Atômica:** Qualquer operação de mutação (inclusão, alteração ou exclusão) deve disparar a gravação imediata no armazenamento persistente local antes ou concomitantemente à atualização do estado em tela.
- **RN06 – Normalização de Texto:** Espaços em branco sobressalentes no início ou no fim do nome do exercício devem ser automaticamente removidos (*trimming*) antes da persistência.

---

### 5. Casos de Teste e Homologação da Primeira Versão

Os casos de teste abaixo especificam as ações, os dados de entrada e os resultados esperados para atestar a qualidade e o cumprimento dos requisitos:

#### CT01 – Testar cadastro de exercício
- **Objetivo:** Validar a funcionalidade de inserção de novo registro com dados válidos.
- **Pré-condições:** Aplicativo aberto na tela principal.
- **Procedimento:**
  1. Acessar o formulário de cadastro (ou campos de inclusão).
  2. Informar o nome: `"Supino Reto"`.
  3. Informar a carga: `"80"`.
  4. Pressionar o botão de confirmação/salvar.
- **Resultado Esperado:** O formulário é limpo ou fechado, o exercício `"Supino Reto"` com carga `"80 kg"` passa a ser exibido na lista principal, e os dados são salvos na base persistente.

#### CT02 – Testar campos obrigatórios
- **Objetivo:** Verificar se o sistema bloqueia tentativas de cadastro com campos ausentes.
- **Pré-condições:** Aplicativo aberto no formulário de cadastro.
- **Procedimento:**
  1. Tentar salvar mantendo tanto o nome quanto a carga em branco.
  2. Preencher apenas o nome (`"Agachamento"`) e manter a carga vazia; tentar salvar.
  3. Preencher apenas a carga (`"60"`) e manter o nome vazio; tentar salvar.
  4. Preencher o nome com espaços em branco (`"   "`) e carga válida; tentar salvar.
- **Resultado Esperado:** Em todos os passos, o sistema impede a gravação, mantém o usuário na tela de preenchimento e exibe mensagens claras de orientação e validação destacando o campo pendente.

#### CT03 – Testar edição de exercício
- **Objetivo:** Garantir que um registro existente possa ser atualizado sem duplicação de dados.
- **Pré-condições:** Um exercício `"Desenvolvimento com Halteres"` com carga `"20 kg"` cadastrado na lista.
- **Procedimento:**
  1. Selecionar o botão/ação de editar do exercício mencionado.
  2. Verificar se os campos carregam o nome e a carga atuais.
  3. Alterar a carga para `"24"`.
  4. Alterar o nome para `"Desenvolvimento com Halteres (Ombros)"`.
  5. Confirmar a gravação da alteração.
- **Resultado Esperado:** A listagem exibe o exercício com o novo nome e a nova carga (`"24 kg"`). A contagem total de exercícios permanece a mesma (não há criação de um novo registro duplicado).

#### CT04 – Testar exclusão com confirmação e cancelamento
- **Objetivo:** Testar o fluxo de segurança para deleção de registros.
- **Pré-condições:** Exercício `"Remada Curvada"` cadastrado e visível na lista.
- **Procedimento:**
  1. Tocar no botão de exclusão do exercício.
  2. Verificar se um modal/alerta de confirmação é exibido perguntando se o usuário tem certeza.
  3. Pressionar a opção `"Cancelar"`.
  4. Verificar a listagem.
  5. Acionar novamente a exclusão do mesmo exercício.
  6. Pressionar a opção `"Confirmar"` / `"Excluir"`.
- **Resultado Esperado:** No passo 4, o exercício permanece intocado na lista. No passo 6, o exercício é removido permanentemente da lista e do armazenamento.

#### CT05 – Testar persistência de dados
- **Objetivo:** Validar se os dados salvos resistem ao encerramento e reinício do aplicativo.
- **Pré-condições:** Aplicativo aberto com 3 exercícios distintos cadastrados (ex.: `"Leg Press"`, `"Puxada Alta"`, `"Tríceps Corda"`).
- **Procedimento:**
  1. Verificar os 3 registros na listagem.
  2. Fechar completamente a aplicação (finalizar o processo da aplicação no dispositivo).
  3. Abrir novamente o aplicativo.
- **Resultado Esperado:** Ao carregar a tela inicial, todos os 3 exercícios continuam listados com seus respectivos nomes e cargas intactos.

#### CT06 – Testar persistência após edição
- **Objetivo:** Validar se alterações por edição continuam salvas após reiniciar o app.
- **Pré-condições:** Exercício `"Rosca Direta"` cadastrado inicialmente com `"15 kg"`.
- **Procedimento:**
  1. Editar a carga do exercício para `"17.5 kg"`.
  2. Confirmar a edição e verificar a tela.
  3. Encerrar completamente o aplicativo.
  4. Reabrir o aplicativo.
- **Resultado Esperado:** Ao reabrir, o exercício `"Rosca Direta"` é exibido com o valor atualizado de `"17.5 kg"`, e não com o valor original.

#### CT07 – Testar persistência após exclusão
- **Objetivo:** Validar se a exclusão de um exercício é mantida após o ciclo de reinicialização.
- **Pré-condições:** Lista contendo `"Cadeira Extensora"` e `"Mesa Flexora"`.
- **Procedimento:**
  1. Excluir o exercício `"Cadeira Extensora"`, confirmando a ação no diálogo.
  2. Fechar completamente o aplicativo.
  3. Reabrir o aplicativo.
- **Resultado Esperado:** Ao iniciar, apenas `"Mesa Flexora"` deve constar na listagem. `"Cadeira Extensora"` continua excluído permanentemente.

#### CT08 – Testar cargas com valores decimais
- **Objetivo:** Verificar o suporte e a correta formatação de valores fracionários de carga.
- **Pré-condições:** Aplicativo aberto na tela de cadastro.
- **Procedimento:**
  1. Cadastrar exercício com carga inteira: `"Agachamento Búlgaro"` com carga `"14"`.
  2. Cadastrar exercício com carga decimal com ponto: `"Elevação Lateral"` com carga `"7.5"`.
  3. Cadastrar exercício com carga decimal com vírgula (se aplicável ao teclado do usuário): `"Supino Inclinado"` com carga `"22,5"`.
- **Resultado Esperado:** Todos os registros são aceitos e exibidos com clareza na listagem (ex.: `14 kg`, `7.5 kg`, `22.5 kg`), preservando a precisão decimal sem truncamentos indevidos.

---

### 6. Critérios de Aceitação da Primeira Versão (Checklist de Homologação)

A primeira versão (MVP) será formalmente aceita quando todos os itens do checklist abaixo forem satisfeitos:

- [ ] **Cadastro de Exercícios e Cargas:** O usuário consegue registrar qualquer exercício informando nome e carga com sucesso.
- [ ] **Visualização da Lista:** Todos os exercícios salvos são exibidos em ordem compreensível, destacando claramente nome e carga.
- [ ] **Edição de Registros:** É possível alterar o nome e/ou a carga de um item já existente, atualizando o registro original sem gerar duplicatas.
- [ ] **Exclusão com Confirmação:** A exclusão só se concretiza após confirmação deliberada do usuário em janela de diálogo.
- [ ] **Validação Rigorosa de Campos:** O sistema impede envio de campos vazios ou cargas inválidas/negativas, orientando o usuário.
- [ ] **Aceite de Cargas Decimais:** Cargas fracionadas (ex.: 0.5 kg, 12.5 kg) são processadas, armazenadas e exibidas adequadamente.
- [ ] **Persistência Confiável:** Os dados (inclusões, edições e exclusões) permanecem rigorosamente mantidos após fechar e reabrir o app.
- [ ] **Consistência de Estado:** A interface reflete imediatamente qualquer alteração efetuada pelo usuário sem necessidade de recarregar manualmente a tela.
- [ ] **Ergonomia e Adaptação Mobile:** A interface exibe botões acessíveis, campos confortáveis ao toque e adaptação a telas de smartphones.

---

### 7. Delimitação do Escopo do MVP

#### 7.1. Funcionalidades Incluídas no Escopo (In-Scope)
- Cadastro de exercícios com nome e valor de carga.
- Listagem consolidada de todos os exercícios cadastrados.
- Edição direta de nome e carga de exercícios existentes.
- Exclusão com confirmação em diálogo modal.
- Validação de integridade de dados (campos obrigatórios e formato numérico).
- Suporte a cargas decimais.
- Persistência de dados local no dispositivo.
- Interface responsiva com foco e ergonomia mobile.

#### 7.2. Funcionalidades Excluídas do Escopo do MVP (Out-of-Scope)
Para assegurar a entrega ágil e concentrada nas dores fundamentais do usuário, as seguintes funcionalidades **não** fazem parte do MVP:
- **Histórico e Progressão de Cargas:** Registro temporal de cargas anteriores por data.
- **Gráficos e Estatísticas de Desempenho:** Curvas de evolução, gráficos comparativos ou métricas de volume de treino (tonelagem).
- **Divisão por Grupos Musculares / Rotinas:** Categorização por treinos específicos (Treino A, B, C, Push/Pull/Legs) ou por músculos trabalhados.
- **Controle de Repetições, Séries e Tempo de Descanso:** Temporizadores e contadores de séries.
- **Autenticação e Perfis de Usuário:** Criação de contas, login, senhas e sincronização em nuvem.
- **Integração com APIs Externas e Redes Sociais:** Exportação para Strava, Apple Saúde, Google Fit ou compartilhamento de treinos.

*Essas funcionalidades comporão o backlog para versões incrementais futuras (v1.1, v2.0).*
