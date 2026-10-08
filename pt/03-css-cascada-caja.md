# Lição 3 — CSS: cascata, especificidade e caixa

**Tempo:** duas sessões de cerca de 90 min. Uma divisão que funciona: na primeira, “O porquê antes do como” e a cascata (3.1), com as suas figuras para prever qual regra vence; na segunda, a caixa (3.2), as variáveis (3.3), o painel legível, “O erro que você vai ver” e os exercícios. Cada sessão termina em uma página que você pode abrir e medir.

**O que você constrói:** o painel `revisor`, já legível: tipografia, cores, uma tabela organizada e os selos de estado

**O que você aprende:** de onde vem cada estilo e qual vence; o modelo de caixa e `box-sizing`; variáveis de cor e tipografia

**As páginas desta lição.** Todas as figuras estão em [`programas/03-css-cascada-caja/`](https://github.com/HabilMX/curso-web/tree/main/programas/03-css-cascada-caja) do [repositório do curso](https://github.com/HabilMX/curso-web), cada uma com a sua saída esperada ao lado; a folha do painel legível está em `fig03_08/styles.css`. Abra-as com o seu servidor local, como na Lição 1.

## Ao terminar, você vai conseguir

- Conectar uma folha de estilo a uma página e escrever regras com seletores de elemento, de classe, de identificador e de estado.
- Prever qual regra vence quando duas colidem, calculando a especificidade delas e aplicando a ordem da cascata, sem recorrer a `!important`.
- Calcular à mão a largura real de uma caixa com `content-box` e com `border-box`, e conferi-la nas ferramentas do navegador.
- Declarar variáveis de cor, espaço e tipografia, e usá-las para que uma mudança de decisão seja feita em um único lugar.
- Conferir com números que uma cor de texto cumpre o contraste mínimo e que o foco do teclado é visível.
- Ler as mensagens do validador de CSS e reconhecer os dois erros que não produzem mensagem alguma.

## O porquê antes do como

Ao terminar a Lição 2 o painel funcionava e parecia uma página de 1995: fonte com serifa, um botão cinza do sistema, uma tabela sem linhas em que as colunas se colam umas nas outras. Isso não é um defeito do HTML; é o que o navegador faz quando ninguém lhe diz como desenhar. Todo navegador traz a sua própria folha de estilo, e é a que você tem visto.

Hoje dizemos a ele como queremos que fique. O painel deve poder ser lido: uma fonte legível, tamanhos que hierarquizem, uma tabela com linhas separadas e números alinhados, e um selo de cor junto ao estado de cada serviço para que se distinga de relance o que está bem do que está fora do ar. Esse é o resultado visível.

O que você de fato aprende hoje é outra coisa, e é o que separa quem escreve CSS de quem o sofre. **Quase todos os problemas de CSS são de um de dois tipos: “a minha regra não se aplica” e “a minha caixa não mede o que escrevi”.** O primeiro se chama cascata e o segundo modelo de caixa. Quem não entende a cascata resolve cada conflito aumentando a força: mais seletores, um identificador, um `!important`, e depois outro `!important` para vencer o primeiro. Quem não entende a caixa acaba subtraindo pixels a olho até que algo caiba. Os dois terminam com uma folha de estilo em que ninguém se atreve a tocar em nada.

Por isso a lição segue esta ordem. Primeiro a **cascata** (seção 3.1): como o navegador decide, entre várias regras que brigam pelo mesmo elemento, qual fica. Depois a **caixa** (3.2): quanto mede de verdade cada elemento. E no fim as **variáveis** (3.3), que deixam você escrever cada decisão uma única vez: a cor do texto, o espaçamento, a fonte. Em cada seção há uma página que você pode abrir, mudar e quebrar. A do final é o painel completo.

Um critério atravessa tudo: o CSS desta lição **não esconde nada do que você aprendeu na anterior**. O foco do teclado se vê, o estado não depende só da cor, os textos têm contraste suficiente. Confere-se com números, não a olho.

## Os conceitos

### 3.1 De onde vem cada estilo e qual vence

#### 3.1.1 Uma regra, de ponta a ponta

Uma folha de estilo é uma lista de **regras**. Cada regra tem duas metades: o **seletor**, que diz a quais elementos se aplica, e o **bloco de declarações** entre chaves, que diz o que muda neles. Cada declaração é um par `propriedade: valor;` e fecha com ponto e vírgula.

```html
<!-- fig03_01.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mi primer estilo</title>
  <style>
    h1 {
      color: #0b5cad;
    }
    p {
      max-width: 40rem;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <main>
    <h1>Revisor de servicios</h1>
    <p>Cada regla tiene un selector, que dice a qué elementos se aplica, y declaraciones entre llaves, que dicen qué cambia en ellos.</p>
  </main>
</body>
</html>
```

```text
Revisor de servicios
Cada regla tiene un selector, que dice a qué elementos se aplica, y declaraciones entre llaves, que dicen qué cambia en ellos.
```

Nessa página, `h1` é um seletor que significa “todos os títulos de primeiro nível”; a declaração `color: #0b5cad;` muda a cor do texto para um azul escrito em hexadecimal (dois algarismos para o vermelho, dois para o verde e dois para o azul). A segunda regra limita a largura dos parágrafos a `40rem` (o `rem` é uma unidade que vale o tamanho da fonte da página, 16 pixels por padrão, então são 640 pixels; você a verá a fundo em 3.2.3) e separa as linhas com uma altura de `1.6` vez o tamanho da fonte. O texto de saída aparece igual ao de sem estilos, e é a razão por que neste curso, além do texto, se conferem os valores calculados: a cor desse `<h1>`, medida no Chrome 154, é `rgb(11, 92, 173)`, que é o mesmo azul em outra notação.

Há três maneiras de conectar CSS a uma página, e convém conhecer as três para saber por que se prefere uma:

1. **Uma folha externa**, com `<link rel="stylesheet" href="styles.css">` dentro de `<head>`. É a que você usará no painel. O navegador a guarda na memória e a reutiliza em todas as páginas do site, e o mesmo arquivo pode ser aberto e alterado sem tocar no HTML.
2. **Um bloco `<style>`** dentro de `<head>`, como acima. É prático para um experimento de uma única página, e por isso as figuras desta lição o usarão. Num site real convém evitá-lo, por uma razão de segurança que você verá na Lição 11.
3. **O atributo `style`** posto sobre um elemento (`<p style="color: red">`). Tem uma força especial na cascata, que você verá em seguida, e é justamente por isso que quase nunca convém: mistura a aparência com o conteúdo e é muito difícil de vencer sem truques.

#### 3.1.2 Os seletores de que você precisa hoje

Um seletor é uma pergunta que o navegador faz a cada elemento: “é você?”. Estes são os que você usará no painel, do mais geral ao mais preciso:

- **De tipo** (por nome de elemento): `p`, `table`, `h2`. Aplica-se a todos os desse tipo.
- **De classe**: `.status`. O ponto indica que procura elementos cujo atributo `class` contenha esse nome. Um elemento pode ter várias classes separadas por espaços (`class="status status-down"`), e uma classe pode estar em muitos elementos. É a ferramenta principal do CSS, e é a razão por que na Lição 2 você pôs `class` nos selos.
- **De identificador**: `#summary`. O sinal de número (`#`) procura o único elemento com esse `id`. Um `id` não pode se repetir numa página.
- **De atributo**: `input[type="search"]`. Colchetes: elementos que têm esse atributo com esse valor.
- **De pseudoclasse**: `a:hover`, `:focus-visible`, `td:last-child`. Os dois pontos assinalam um **estado** ou uma **posição** do elemento: quando o mouse está em cima, quando o teclado o tem em foco, quando é o último filho do seu pai.
- **De descendente**: `dl div` (com um espaço). Elementos `div` que estão dentro de um `dl`, a qualquer profundidade.
- **Lista**: `th, td` (com vírgula). É uma abreviatura de duas regras com as mesmas declarações.

Um seletor se lê da direita para a esquerda: em `dl div:last-child`, o alvo é um `div` que é último filho, e só conta se além disso estiver dentro de um `dl`. Os seletores podem ser combinados sem espaço: `p.alert` é um `<p>` que além disso tem a classe `alert`.

#### 3.1.3 Quando duas regras colidem: a cascata

Aqui está o conceito central da lição. Quase nunca há uma única regra sobre um elemento. Há a folha do navegador, a sua folha, outra regra mais abaixo na sua folha, e às vezes um atributo `style`. Quando várias regras dão valores diferentes à mesma propriedade do mesmo elemento, o navegador tem de escolher uma. A palavra *cascata* de “folhas de estilo em cascata” (CSS, pela sigla em inglês) é o nome do algoritmo com que ele escolhe. Não é mágica nem acaso: são passos, numa ordem fixa que está [escrita na especificação](https://www.w3.org/TR/css-cascade-5/), e o primeiro que desempata decide.

Esta é a lista, resumida e na ordem em que se aplica. Para cada propriedade de cada elemento, o navegador:

1. **Descarta as regras que não se aplicam**: as que não selecionam esse elemento ou que trazem um valor inválido.
2. **Compara a origem e a importância.** Há três origens: a folha do navegador, a do usuário (preferências do leitor, que quase ninguém usa) e a sua, a do autor. Entre declarações normais, vence a do autor. Com `!important` a ordem se inverte, para que o leitor com necessidades especiais possa vencer o autor.
3. **Compara os estilos do atributo `style`.** Uma declaração posta no atributo `style` vence as que vêm das folhas, não importa a especificidade delas.
4. **Compara as camadas** (`@layer`), um mecanismo que você verá em 3.1.5. Entre declarações normais, as que estão em uma camada declarada mais tarde vencem as de uma camada anterior; e as que não estão em nenhuma camada vencem todas as que estão. Com `!important` essa ordem se inverte, assim como com as origens.
5. **Compara a especificidade** do seletor, que é o tema do próximo trecho.
6. **Se tudo o que veio antes empata, vence a última.** A regra que aparece mais abaixo na folha.

Duas coisas importam nessa lista. **Primeira: a ordem das regras é o último critério, não o primeiro.** Muita gente acredita que “a última regra vence” e se confunde quando isso não ocorre. Só vence a última quando os critérios anteriores empataram. **Segunda: cada passo decide por completo.** Se um passo dá vencedor, os seguintes nem são olhados; uma regra com dez identificadores no seu seletor não pode vencer uma declaração com `!important`.

#### 3.1.4 Especificidade: contar com três algarismos

A especificidade é o quinto passo, o que quase sempre decide. É uma medida de **quão preciso é um [seletor](https://www.w3.org/TR/selectors-4/#specificity)**, e se calcula com três algarismos que se escrevem (A, B, C):

- **A** conta os identificadores (`#summary`).
- **B** conta as classes, os atributos e as pseudoclasses (`.status`, `[type="search"]`, `:hover`, `:last-child`).
- **C** conta os tipos de elemento (`p`, `table`) e os pseudoelementos (`::before`).

O seletor universal `*` não soma nada. E os algarismos são comparados **da esquerda para a direita, um por um, não como um número de três dígitos**: primeiro A; se empatam, B; se empatam, C. Um único identificador (1,0,0) vence qualquer número de classes, ainda que sejam mil, porque A é comparado primeiro. Por isso o navegador vê `#summary` como muito mais forte que `.status`.

Alguns exemplos, com a sua conta:

| Seletor | Conta (A, B, C) | Por quê |
|---|---|---|
| `p` | (0, 0, 1) | um tipo |
| `.alert` | (0, 1, 0) | uma classe |
| `p.alert` | (0, 1, 1) | uma classe e um tipo |
| `a:hover` | (0, 1, 1) | uma pseudoclasse e um tipo |
| `input[type="search"]` | (0, 1, 1) | um atributo e um tipo |
| `dl div:last-child` | (0, 1, 2) | uma pseudoclasse e dois tipos |
| `#summary dd` | (1, 0, 1) | um identificador e um tipo |
| `:where(.card) p` | (0, 0, 1) | `:where()` sempre vale zero |

A última linha merece uma explicação. `:where()` e `:is()` são pseudoclasses que recebem uma lista de seletores. A diferença entre as duas é justamente a sua especificidade: **[`:where()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:where) sempre vale zero** e `:is()` toma a do mais específico dos seus argumentos. Com `:where()` você pode escrever um estilo base que qualquer um sobrescreve sem esforço. Você a usará para isso, mais adiante, e a vê em uso no primeiro exercício.

Vejamos tudo junto. A página seguinte tem quatro parágrafos e cinco regras de cor que disputam:

```html
<!-- fig03_02.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>¿Quién gana?</title>
  <style>
    p { color: dimgray; }
    .alert { color: saddlebrown; }
    p.alert { color: crimson; }
    #three, #four { color: royalblue; }
    p { color: black; }
  </style>
</head>
<body>
  <main>
    <h1>¿Quién gana?</h1>
    <p>Uno: solo el nombre del elemento.</p>
    <p class="alert">Dos: con una clase.</p>
    <p class="alert" id="three">Tres: con clase e identificador.</p>
    <p class="alert" id="four" style="color: darkgreen">Cuatro: con el atributo style.</p>
  </main>
</body>
</html>
```

```text
¿Quién gana?
Uno: solo el nombre del elemento.
Dos: con una clase.
Tres: con clase e identificador.
Cuatro: con el atributo style.
```

Antes de ler a resposta, faça a sua própria aposta com as duas listas de cima. Eu medi as cores calculadas no Chrome 154 e isto foi o que saiu:

- **Um** é preto (`rgb(0, 0, 0)`). Só se aplicam a ele `p { dimgray }` e `p { black }`. As duas têm a mesma especificidade, (0,0,1), então decide a ordem e vence a última: preto. Este é o caso em que “a última vence” é verdade.
- **Dois** é carmesim (`rgb(220, 20, 60)`). Aplicam-se a ele três regras: `p` (0,0,1), `.alert` (0,1,0) e `p.alert` (0,1,1). Vence a de maior especificidade, `p.alert`, **ainda que esteja antes de `p { black }`**. A ordem não é olhada, porque o passo anterior já desempatou.
- **Três** é azul royal (`rgb(65, 105, 225)`). O seu identificador dá (1,0,0) e vence todas as regras anteriores.
- **Quatro** é verde escuro (`rgb(0, 100, 0)`). Tem o mesmo identificador que o três, mas o atributo `style` é comparado antes da especificidade, e vence. É o caso que a seção 3.1.1 anunciava: por isso um `style` posto no HTML é tão difícil de vencer a partir da folha.

Há uma conta que você deveria fazer de cabeça ao ver este resultado: **o elemento Três tem cinco regras de cor que o selecionam (as duas de `p`, `.alert`, `p.alert` e a do identificador), e a que venceu é a que menos se parece com “a última coisa que escrevi”.** Se você não compreende a ordem da lista, a única ferramenta que lhe resta é aumentar a força, e a força só pode ser aumentada até certo ponto.

#### 3.1.5 Camadas: a saída limpa

As camadas (`@layer`) existem para quando os critérios de especificidade viram um estorvo. Uma camada é um grupo com nome de regras; você declara a **ordem das camadas** uma vez, e entre camadas manda essa ordem, **sem olhar a especificidade**.

```html
<!-- fig03_03.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Capas</title>
  <style>
    @layer base, components, overrides;

    @layer base {
      a { color: gray; }
    }
    @layer components {
      .link { color: green; }
    }
    @layer overrides {
      a { color: blue; }
    }
    .plain { color: purple; }
  </style>
</head>
<body>
  <main>
    <h1>Capas</h1>
    <p><a href="#uno" class="link">Un enlace con clase, en la capa components</a></p>
    <p><a href="#dos">Un enlace sin clase</a></p>
    <p><a href="#tres" class="plain">Un enlace con una regla sin capa</a></p>
  </main>
</body>
</html>
```

```text
Capas
Un enlace con clase, en la capa components
Un enlace sin clase
Un enlace con una regla sin capa
```

A primeira linha do bloco `<style>` declara a ordem: `base`, depois `components`, depois `overrides`. A última camada vence. Olhe o primeiro link: o seletor `.link` tem especificidade (0,1,0) e o seletor `a` da camada `overrides` só (0,0,1); numa folha sem camadas, venceria `.link`. Aqui vence `a`, e o link é azul (`rgb(0, 0, 255)`), porque a camada dele vem depois. O segundo link também é azul. O terceiro é roxo: `.plain` não está em nenhuma camada, e as declarações normais **sem camada vencem todas as que a têm**.

Isto é o que torna úteis as camadas. Você pode ordenar a sua folha na ordem em que quer que as coisas vençam (um reset no início, depois os estilos do corpo, depois os componentes), e a especificidade só conta dentro de cada camada. Ninguém precisa de um `!important` para vencer uma regra que está em uma camada anterior. E a regra sem camada é a porta de emergência: se alguém escreve uma folha sem camadas, vence tudo. Tudo isto vale para as declarações normais; [a especificação](https://www.w3.org/TR/css-cascade-5/#cascade-layering) inverte a ordem para as que levam `!important`: entre elas vence a **primeira** camada, e uma declaração `!important` dentro de uma camada vence uma `!important` sem camada. É mais uma razão para não usá-lo: quebra a intuição de que o último manda.

As camadas estão disponíveis de forma geral nos navegadores desde março de 2022; [o site de referência da Mozilla](https://developer.mozilla.org/pt-BR/docs/Web/CSS/@layer) as marca como “Widely available” (amplamente disponível). O painel de hoje as usa.

#### 3.1.6 A herança: o que não precisa de regra

Falta uma peça, e é a que explica por que às vezes um elemento tem um estilo sem que nenhuma regra fale com ele. Algumas propriedades **[são herdadas](https://developer.mozilla.org/pt-BR/docs/Web/CSS/CSS_cascade/Inheritance)**: se um elemento não tem valor próprio, toma o do seu pai. A cor do texto, a fonte, o tamanho e a altura de linha são herdados. Outras não: a margem, o preenchimento, a borda e o fundo são de cada elemento, e não passam aos seus filhos (se a borda fosse herdada, cada parágrafo dentro de um cartão teria a sua própria moldura).

```html
<!-- fig03_04.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Herencia</title>
  <style>
    article {
      color: darkgreen;
      font-style: italic;
      border: 2px solid black;
      padding: 1rem;
    }
  </style>
</head>
<body>
  <main>
    <h1>Herencia</h1>
    <article>
      <p>Este párrafo hereda el color y la cursiva, pero no el borde.</p>
      <p><label>Un campo: <input type="text" value="no hereda la fuente"></label></p>
    </article>
  </main>
</body>
</html>
```

```text
Herencia
Este párrafo hereda el color y la cursiva, pero no el borde.
Un campo:
```

Medi no Chrome 154. O parágrafo tem a cor verde escura e o itálico do `<article>` (herda-os), e a sua borda é de `0px`: não a herdou. O rótulo, que é um elemento de texto, também herda o verde. E o campo de texto, não: a sua cor calculada é preta e o seu itálico é `normal`. Um campo de formulário não herda do pai a fonte nem a cor porque a folha de estilo do navegador dá a eles valores próprios. No meu computador, o campo usava Arial a 13.33 px enquanto o parágrafo usava 16 px; os valores exatos dependem do sistema operacional, mas a diferença existe em todos. É a razão por que o painel traz a regra `font: inherit` para os seus campos e botões: sem ela, o campo de busca parece de outra página.

Há quatro palavras que deixam mandar à mão sobre a herança: `inherit` (toma o valor do pai, ainda que a propriedade normalmente não seja herdada), `initial` (o valor inicial da especificação), `unset` (herda se a propriedade é herdável, e se não, usa a inicial) e `revert` (desfaz os estilos do autor e volta ao valor que a origem anterior poria: a folha do usuário se existir, e se não, a do navegador). Delas, `inherit` é a que você usará.

E um aviso sobre a ordem em que tudo ocorre. **A herança é o mais fraco que existe**: um valor herdado perde para qualquer regra que aponte para o elemento, por mais fraca que seja. Por isso `* { color: black }`, com a sua especificidade zero, quebra a cor herdada de todo o documento: “fala” diretamente com cada elemento.

#### 3.1.7 O `!important` e como se chega a precisar dele

A declaração [`!important`](https://developer.mozilla.org/en-US/docs/Web/CSS/important) vai no final de um valor (`color: red !important;`) e muda o seu passo na cascata: passa a um grupo que vence todas as declarações normais, com qualquer seletor. É uma ferramenta de emergência com um caso de uso legítimo, que é a folha de estilo de um usuário que precisa de fonte grande. Para quem escreve uma folha de autor, é quase sempre um sinal de que há um conflito não entendido.

O caminho para a guerra de `!important` é sempre o mesmo. Uma regra não vence; sobe-se a especificidade dela; sobe a de outra regra próxima; alguém acrescenta um `!important`; a regra que devia vencê-lo precisa de outro `!important`; e a partir daí cada mudança exige mais um. A saída não é aumentar a força, mas **diminuí-la**: escrever seletores com a especificidade mais baixa que funcione e deixar que a ordem, as camadas e o `:where()` façam o trabalho. No quarto exercício você tem uma folha com esse problema para desfazer.

Uma ferramenta torna isso muito mais fácil: **o [inspetor do navegador](https://developer.chrome.com/docs/devtools/css)**. Clique com o botão direito sobre qualquer elemento e escolha “Inspecionar”. No painel de estilos você verá todas as regras que se aplicam a ele, na ordem em que a cascata as avalia, e as que perderam aparecem **riscadas**. No painel de valores calculados (*Computed*, “Computado” no Firefox em português) você verá o valor final de cada propriedade e, ao expandi-lo, qual regra o pôs. Quando uma regra “não dá bola”, a resposta quase sempre está ali, a dois cliques.

### 3.2 Cada elemento é uma caixa

#### 3.2.1 As quatro camadas de uma caixa

Para o CSS, todo elemento é uma caixa retangular. Essa caixa tem quatro zonas aninhadas, de dentro para fora:

- **O conteúdo**: o texto ou os elementos filhos.
- **O preenchimento** (*padding*): espaço entre o conteúdo e a borda. Faz parte da caixa e toma o seu fundo.
- **A borda** (*border*): uma linha ao redor do preenchimento.
- **A margem** (*margin*): espaço entre esta borda e a caixa vizinha. É transparente e não toma fundo.

E há uma pergunta que decide se a sua página mede o que você escreveu: quando você escreve `width: 300px`, essa largura é do conteúdo, ou da caixa com preenchimento e borda? A resposta histórica, que continua sendo a que o navegador aplica se ninguém lhe diz outra coisa, é **do conteúdo**. (Há exceções na folha do próprio navegador: medi no Chrome 154, e os botões, as listas suspensas `<select>`, os campos de busca e as tabelas já trazem `border-box`; um campo de texto normal ou um `<div>`, não.) Chama-se [`box-sizing: content-box`](https://developer.mozilla.org/pt-BR/docs/Web/CSS/box-sizing). Com ela, o preenchimento e a borda se **somam** por fora:

```html
<!-- fig03_05.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Cajas</title>
  <style>
    .box {
      width: 300px;
      padding: 20px;
      border: 5px solid black;
      margin: 10px;
      background: #cfe2ff;
    }
    .border-box {
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  <main>
    <h1>Cajas</h1>
    <div class="box">Caja con content-box (lo normal sin reglas)</div>
    <div class="box border-box">Caja con border-box</div>
  </main>
</body>
</html>
```

```text
Cajas
Caja con content-box (lo normal sin reglas)
Caja con border-box
```

As duas caixas têm a mesma regra de largura, `width: 300px`. A conta da primeira, com `content-box`: 300 de conteúdo, mais 20 de preenchimento de cada lado (40), mais 5 de borda de cada lado (10): **350 pixels de largura total**. A da segunda, com `box-sizing: border-box`, a largura de 300 já **inclui** o preenchimento e a borda, e o conteúdo fica com o que sobra: 300 − 40 − 10 = **250**. Medi no Chrome 154: a primeira mede 350 pixels de largura e a segunda 300. A propriedade `width` calculada vale `300px` nas duas; o que muda é o que ela significa.

Agora imagine o problema real. Você tem um cartão dentro de uma coluna de 500 pixels, e põe `width: 100%` para que preencha a coluna, 16 pixels de preenchimento para que o texto respire e uma borda de 2 pixels. Com `content-box`, o cartão mede 500 de conteúdo + 32 de preenchimento + 4 de borda = 536 pixels: **sai da sua coluna por 36 pixels**, e aparece uma barra de rolagem horizontal. O iniciante resolve isso por tentativa e erro. Quem sabe da caixa resolve com uma linha.

A linha é `box-sizing: border-box`, e é o costume de quase todo o CSS profissional: com ela, a largura que você escreve é a largura que você vê, e o preenchimento e a borda são subtraídos do conteúdo por dentro. Escreve-se uma única vez, para todos os elementos, e aparece na primeira camada do painel:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

Três seletores separados por vírgula: todos os elementos e os dois pseudoelementos que o CSS pode inserir antes e depois do conteúdo de cada um. Eles são incluídos para que nenhuma caixa gerada escape do critério.

Para ver a caixa de qualquer elemento, o inspetor tem um diagrama: no Chrome, no painel de valores calculados; no Firefox, na [aba “Layout”](https://firefox-source-docs.mozilla.org/devtools-user/page_inspector/how_to/examine_and_edit_the_box_model/index.html). É um retângulo dentro de outro com as quatro espessuras anotadas. **Quando uma caixa não medir o que você espera, não subtraia pixels: abra o diagrama e veja qual das quatro zonas é a que sobra.**

#### 3.2.2 Bloco, em linha e as margens que se juntam

Há uma segunda regra que explica casos que desconcertam: nem todas as caixas se comportam igual. A propriedade [`display`](https://developer.mozilla.org/pt-BR/docs/Web/CSS/display) decide como uma caixa se coloca em relação às vizinhas. Três valores explicam a maioria dos casos de hoje:

- **`block`**: a caixa ocupa uma linha inteira. Aceita `width` e `height`, e as suas quatro margens. São assim os parágrafos, os títulos, as seções, as tabelas.
- **`inline`**: a caixa flui dentro de uma linha de texto, como uma palavra. **Ignora `width` e `height`** e as suas margens verticais. São assim os `<span>`, os links e as tags `<strong>`.
- **`inline-block`**: flui como uma palavra, mas se deixa dimensionar como um bloco. É o que um selo precisa.

```html
<!-- fig03_06.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Display</title>
  <style>
    .sample {
      width: 200px;
      height: 40px;
      background: #cfe2ff;
    }
    .as-block { display: block; }
    .as-inline { display: inline; }
    .as-inline-block { display: inline-block; }
  </style>
</head>
<body>
  <main>
    <h1>Display</h1>
    <span class="sample as-block">block</span>
    <span class="sample as-inline">inline</span>
    <span class="sample as-inline-block">inline-block</span>
  </main>
</body>
</html>
```

```text
Display
block
inline inline-block
```

Os três `<span>` têm a mesma regra `width: 200px; height: 40px;`. Medi: o `block` e o `inline-block` medem 200 × 40. O `inline` mede **36 × 18**: a sua largura e altura saem do texto “inline”, porque a uma caixa em linha as dimensões são ignoradas. Se algum dia você escrever um `width` e “não fizer nada”, olhe primeiro o `display` do elemento. O `<span class="status">` do painel precisa de preenchimento nos lados e cantos arredondados, e por isso se declara `display: inline-block`.

A outra esquisitice das caixas são as margens. Quando dois blocos estão um em cima do outro e o de cima tem uma margem inferior e o de baixo uma margem superior, o espaço entre eles **não é a soma dos dois**: as margens se **juntam** e fica a maior.

```html
<!-- fig03_07.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Márgenes</title>
  <style>
    .first  { margin: 0 0 20px; background: #cfe2ff; }
    .second { margin: 30px 0 0;  background: #d1e7dd; }
  </style>
</head>
<body>
  <main>
    <h1>Márgenes</h1>
    <p class="first">Primer párrafo: margen inferior de 20 px.</p>
    <p class="second">Segundo párrafo: margen superior de 30 px.</p>
  </main>
</body>
</html>
```

```text
Márgenes
Primer párrafo: margen inferior de 20 px.
Segundo párrafo: margen superior de 30 px.
```

Se as margens se somassem, haveria 50 pixels entre os dois parágrafos. Medi: há **30**. Chama-se *[colapso de margens](https://developer.mozilla.org/pt-BR/docs/Web/CSS/CSS_box_model/Mastering_margin_collapsing)* e só ocorre entre margens **verticais** de blocos vizinhos (e entre um bloco e o seu primeiro filho, quando não há preenchimento nem borda que os separe). O preenchimento nunca colapsa, e os elementos dentro de um contêiner flexível ou de uma grade, que você verá na Lição 4, tampouco. Se o seu espaço vertical não soma, é isto. O costume que o evita é escrever as margens em uma única direção (por exemplo, todas para baixo) e deixar que o colapso trabalhe a seu favor.

#### 3.2.3 Unidades: pixels, rem e porcentagens

Para escrever um tamanho você precisa escolher uma unidade, e a escolha tem consequências de acessibilidade que não se veem na tela de quem programa.

- **`px`** é um pixel de CSS. É uma medida fixa. Use-a para o que não deve crescer com o texto: uma borda de 1 px, uma sombra.
- **[`rem`](https://developer.mozilla.org/en-US/docs/Web/CSS/length)** é o tamanho da fonte da raiz do documento. Por padrão os navegadores a põem em 16 px, então `1rem` são 16 px e `2rem` são 32. A diferença com o `px` é a que importa: **o leitor pode mudar o seu tamanho de fonte preferido na configuração do navegador**, e tudo o que está escrito em `rem` cresce com ele, enquanto o escrito em `px` não. Resta o zoom da página (Ctrl e +), que aumenta tudo, inclusive os `px`, e que as diretrizes aceitam como forma de cumprir; mas quem já fixou o seu tamanho de fonte preferido para ler em todos os sites vê que a sua página o ignora, e tem de dar zoom nela toda vez. Por isso o painel escreve os seus tamanhos de fonte e quase todos os seus espaçamentos em `rem`. É o critério que as diretrizes de acessibilidade chamam de redimensionar o texto ([WCAG 1.4.4](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)).
- **`%`** é uma porcentagem do contêiner: `width: 100%` é “tão largo quanto o meu pai”.
- **`ch`** é a largura do algarismo zero na fonte atual. Serve para limitar a largura de um texto: com mais de uns 75 caracteres por linha o olho se perde ao saltar para a seguinte.

Mais uma linha sobre a altura de linha. Escreve-se `line-height: 1.6`, **sem unidade**: um número sozinho significa “1.6 vez o tamanho da fonte de cada elemento”, e os filhos o herdam como multiplicador. Com uma unidade (`1.6rem`) é herdada como uma quantidade fixa, e um título grande ficaria com as linhas coladas.

### 3.3 Variáveis: cada decisão, uma única vez

#### 3.3.1 Propriedades personalizadas

Imagine que o azul do painel aparece no título, nos links, no botão, no contorno do foco. São quatro lugares. No dia em que alguém disser “melhor um azul mais escuro”, ou “o cliente quer verde”, você tem de encontrar os quatro e mudá-los sem esquecer nenhum. O CSS resolve isso com **[propriedades personalizadas](https://developer.mozilla.org/pt-BR/docs/Web/CSS/Using_CSS_custom_properties)**, que são conhecidas como **variáveis**.

Uma variável é uma propriedade cujo nome **você inventa** e sempre começa com dois hifens. Declara-se dentro de uma regra, e usa-se com a função `var()`:

```css
:root {
  --color-accent: #0b5cad;
}

a {
  color: var(--color-accent);
}

button {
  background: var(--color-accent);
}
```

`:root` é a pseudoclasse que seleciona a raiz do documento (o elemento `<html>`), e é usada como o lugar canônico das variáveis globais. As variáveis **são herdadas**, como a cor: uma variável declarada em `:root` está disponível em todo o documento, e uma declarada em um elemento está disponível nele e nos seus descendentes. Isso é usado para o truque que move os selos do painel, que você verá em um momento.

Há uma disciplina de nomes que vale mais que qualquer outro conselho: **o nome diz para que serve, não como parece.** `--color-accent` é um bom nome; `--blue` é uma armadilha, porque no dia em que o acento for verde, a variável `--blue` valerá verde e ninguém entenderá o código. O mesmo com `--color-down-text` para o texto do estado fora do ar, ou `--space-3` para um espaçamento. Uma variável é uma **decisão** com nome.

E três variáveis que merecem uma explicação à parte são as do selo. Repare em como se resolve a cor dos dois selos, o verde de “Disponible” (“Disponível”) e o vermelho de “Caído” (“Fora do ar”), com uma única regra:

```css
.status {
  background: var(--badge-bg);
  color: var(--badge-text);
}

.status-available {
  --badge-bg: var(--color-available-bg);
  --badge-text: var(--color-available-text);
}

.status-down {
  --badge-bg: var(--color-down-bg);
  --badge-text: var(--color-down-text);
}
```

A regra `.status` sabe **como** se desenha um selo, mas não de que cor; as duas classes seguintes só dizem **de que cor**, mudando duas variáveis. Graças à herança das variáveis, `.status` as vê. Esta forma de escrever tem uma vantagem que você logo notará: acrescentar um terceiro estado no futuro é acrescentar uma classe de três linhas, sem tocar na regra do selo. Uma nota: um selo que só tenha a classe `status` e nenhuma das outras duas fica sem cor de fundo, porque as variáveis que usa não existem. É o comportamento correto e será visto na seção de erros.

#### 3.3.2 Tipografia e espaço

As variáveis não são só para cores. O painel declara a sua escala de espaçamentos (`--space-1` a `--space-5`, de um quarto de `rem` a dois e meio) e a sua família de fonte:

```css
--font-body: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
```

Uma lista de famílias se lê da esquerda para a direita como “use a primeira que existir, e se não a seguinte”. [`system-ui`](https://developer.mozilla.org/pt-BR/docs/Web/CSS/font-family) pede a fonte com que o sistema operacional desenha os seus próprios menus, que é a mais legível em cada plataforma e não é baixada de lugar nenhum. As demais são os nomes da fonte do sistema de cada plataforma, caso o navegador não entenda `system-ui`, e a última, `sans-serif`, é uma família genérica, que é a rede de segurança. Não é preciso baixar nenhuma fonte para começar.

A **escala** de espaços tem um propósito que não é estético. Quando cada espaçamento do painel sai das mesmas cinco medidas, a página tem um ritmo, e quando alguém quer mais ar, muda uma medida e tudo se ajeita. As alturas de linha (`1.6` para o corpo e `1.2` para os títulos, que são curtos) fecham o sistema.

Uma propriedade pequena que faz diferença numa tabela de números: [`font-variant-numeric: tabular-nums`](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric). Com ela, todos os algarismos ocupam a mesma largura, então `120 ms` e `950 ms` se alinham algarismo por algarismo. É o que faz com que uma coluna de tempos possa ser comparada de relance. O painel a aplica à coluna de tempos junto com `text-align: right`.

#### 3.3.3 Contraste e foco: o que se mede

As diretrizes de acessibilidade (WCAG 2.2) pedem que o texto normal tenha uma razão de contraste de **ao menos 4.5 para 1** contra o seu fundo ([critério 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)), e que os componentes da interface e o indicador de foco cheguem a **3 para 1** (1.4.11). A razão se calcula com uma fórmula sobre a luminosidade das duas cores, e você não precisa aprendê-la: o seletor de cor das ferramentas do navegador a calcula, e há verificadores online como [o da WebAIM](https://webaim.org/resources/contrastchecker/). O que você precisa é do hábito de **medir antes de escolher**. Estas são as cifras das cores do painel, que calculei com a fórmula do W3C:

| Combinação | Contraste | Mínimo |
|---|---|---|
| Texto principal sobre o fundo branco | 16.56 : 1 | 4.5 |
| Texto atenuado (`--color-muted`) sobre branco | 6.39 : 1 | 4.5 |
| Texto atenuado sobre o fundo da página | 6.00 : 1 | 4.5 |
| Links e botão sobre branco | 6.67 : 1 | 4.5 |
| Letras brancas do botão sobre o acento | 6.67 : 1 | 4.5 |
| Selo “Disponible” | 7.21 : 1 | 4.5 |
| Selo “Caído” | 7.08 : 1 | 4.5 |
| Borda do campo de busca sobre branco | 4.55 : 1 | 3 |
| Anel do foco sobre branco | 6.67 : 1 | 3 |

Uma cifra é uma decisão que pode ser revista. “Fica bom” não.

Há um segundo critério sobre a cor, e é que **a cor não pode ser a única forma de comunicar algo** ([WCAG 1.4.1, “Uso de cor”](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)). O selo vermelho de “Caído” se distingue do verde para quem vê cores, mas uma pessoa com daltonismo vermelho-verde pode não distinguir esses dois. Por isso o selo leva além disso **texto** (“Caído”): diz com palavras, e a cor só reforça. Essa decisão você já tomou na Lição 2 ao escrever “Caído” dentro do `<span>`. O CSS a melhora sem mudá-la.

E o foco. Na lição anterior você fez o teste da tecla Tab; mas o navegador mostrava o foco com o seu anel padrão. É comum, na folha de um iniciante, encontrar `outline: none` para “tirar esse contorno feio”. É um erro com custo: quem navega com o teclado fica sem saber onde está. O critério das diretrizes é que o foco seja visível ([WCAG 2.4.7](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)). A ferramenta correta é a pseudoclasse **[`:focus-visible`](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible)**, que seleciona um elemento em foco **quando o navegador acha que o foco deve ser mostrado**: com o teclado sim, e ao clicar com o mouse num botão, normalmente não. Assim você pode dar um contorno próprio, visível e firme, sem incomodar quem usa o mouse. Está disponível de forma geral nos navegadores desde março de 2022.

## Exemplo resolvido: o painel legível

Você já tem as três ideias. Esta é a folha do painel completo; percorra-a por camadas, que é como está escrita.

```css
/* fig03_08/styles.css */

/* El orden de las capas se declara una sola vez, arriba. La última gana. */
@layer reset, base, components;

@layer reset {
  /* La caja: el ancho que escribes es el ancho que se ve. */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  /* El navegador no hace que los campos hereden la letra del texto. */
  input,
  button {
    font: inherit;
  }
}

@layer base {
  /* Las decisiones del panel viven aquí, con nombres que dicen para qué sirven. */
  :root {
    --color-text: #1b1f24;
    --color-muted: #57606a;
    --color-page: #f6f8fa;
    --color-surface: #ffffff;
    --color-border: #d0d7de;
    --color-control: #6e7781;
    --color-accent: #0b5cad;

    --color-available-text: #0f5132;
    --color-available-bg: #d1e7dd;
    --color-down-text: #842029;
    --color-down-bg: #f8d7da;

    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 1rem;
    --space-4: 1.5rem;
    --space-5: 2.5rem;

    --font-body: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    --line-height: 1.6;
    --radius: 0.375rem;
  }

  body {
    margin: 0;
    background: var(--color-page);
    color: var(--color-text);
    font-family: var(--font-body);
    line-height: var(--line-height);
  }

  /* Un ancho cómodo para leer, centrado: auto reparte el espacio sobrante. */
  header,
  main,
  footer {
    max-width: 60rem;
    margin: 0 auto;
    padding: var(--space-3);
  }

  h1 {
    margin: 0 0 var(--space-2);
    font-size: 2rem;
    line-height: 1.2;
  }

  h2 {
    margin: 0 0 var(--space-3);
    font-size: 1.375rem;
    line-height: 1.3;
  }

  a {
    color: var(--color-accent);
  }

  /* Que el foco del teclado se vea siempre: nunca outline: none sin reemplazo. */
  :focus-visible {
    outline: 3px solid var(--color-accent);
    outline-offset: 2px;
  }

  footer {
    color: var(--color-muted);
  }
}

@layer components {
  /* Cada sección es una hoja blanca sobre el fondo de la página. */
  section {
    margin-bottom: var(--space-4);
    padding: var(--space-3) var(--space-4);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
  }

  /* El resumen: cada par nombre-valor en su renglón. */
  dl div {
    padding: var(--space-2) 0;
    border-bottom: 1px solid var(--color-border);
  }

  dl div:last-child {
    border-bottom: 0;
  }

  dt {
    color: var(--color-muted);
  }

  dd {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  /* Los controles. */
  label {
    margin-right: var(--space-3);
  }

  input[type="search"] {
    min-height: 2.5rem;
    padding: var(--space-1) var(--space-2);
    border: 1px solid var(--color-control);
    border-radius: var(--radius);
  }

  fieldset {
    margin: var(--space-3) 0;
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
  }

  button {
    min-height: 2.5rem;
    padding: var(--space-1) var(--space-3);
    border: 0;
    border-radius: var(--radius);
    background: var(--color-accent);
    color: var(--color-surface);
    font-weight: 600;
    cursor: pointer;
  }

  button:hover {
    background: var(--color-text);
  }

  /* La tabla. */
  table {
    width: 100%;
    margin-top: var(--space-3);
    border-collapse: collapse;
  }

  caption {
    padding-bottom: var(--space-2);
    color: var(--color-muted);
    text-align: left;
  }

  th,
  td {
    padding: var(--space-2) var(--space-3);
    border-bottom: 1px solid var(--color-border);
    text-align: left;
  }

  /* Los números a la derecha y con cifras del mismo ancho para que alineen. */
  th:last-child,
  td:last-child {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  /* La insignia de estado: una sola regla, y las variantes solo cambian variables. */
  .status {
    display: inline-block;
    padding: 0 var(--space-2);
    border-radius: 999px;
    background: var(--badge-bg);
    color: var(--badge-text);
    font-size: 0.875rem;
    font-weight: 600;
  }

  .status-available {
    --badge-bg: var(--color-available-bg);
    --badge-text: var(--color-available-text);
  }

  .status-down {
    --badge-bg: var(--color-down-bg);
    --badge-text: var(--color-down-text);
  }
}
```

E a página, que é a da Lição 2 com uma única linha nova em `<head>`: o link para a folha. No repositório a folha vive em `fig03_08/styles.css`; no seu projeto guarde-a como `css/styles.css`, dentro da pasta `css` que você criou no Exercício 1 da Lição 1, e escreva `href="css/styles.css"`.

```html
<!-- fig03_08.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisor de servicios</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="fig03_08/styles.css">
</head>
<body>
  <header>
    <h1>Revisor de servicios</h1>
    <p>Última revisión:
      <time datetime="2026-10-07T10:30:00-06:00">7 de octubre de 2026, 10:30</time>
    </p>
    <nav>
      <p>Ir a: <a href="#summary">Resumen</a> o <a href="#services">Servicios</a></p>
    </nav>
  </header>

  <main>
    <section id="summary">
      <h2>Resumen</h2>
      <dl>
        <div>
          <dt>Servicios revisados</dt>
          <dd>5</dd>
        </div>
        <div>
          <dt>Disponibles</dt>
          <dd>4 de 5</dd>
        </div>
        <div>
          <dt>Caídos</dt>
          <dd>1</dd>
        </div>
        <div>
          <dt>Respuesta promedio</dt>
          <dd>465 ms</dd>
        </div>
      </dl>
    </section>

    <section id="services">
      <h2>Servicios</h2>

      <p>
        <label for="search">Buscar servicio</label>
        <input type="search" id="search" name="search">
      </p>

      <fieldset>
        <legend>Mostrar</legend>
        <label><input type="radio" name="filter" value="all" checked> Todos</label>
        <label><input type="radio" name="filter" value="available"> Disponibles</label>
        <label><input type="radio" name="filter" value="down"> Caídos</label>
      </fieldset>

      <p><button type="button">Revisar ahora</button></p>

      <table>
        <caption>Estado de los servicios en la última revisión</caption>
        <thead>
          <tr>
            <th scope="col">Servicio</th>
            <th scope="col">Estado</th>
            <th scope="col">Tiempo de respuesta</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Catálogo</th>
            <td><span class="status status-available">Disponible</span></td>
            <td>120 ms</td>
          </tr>
          <tr>
            <th scope="row">Pagos</th>
            <td><span class="status status-available">Disponible</span></td>
            <td>480 ms</td>
          </tr>
          <tr>
            <th scope="row">Inventario</th>
            <td><span class="status status-down">Caído</span></td>
            <td>sin respuesta</td>
          </tr>
          <tr>
            <th scope="row">Notificaciones</th>
            <td><span class="status status-available">Disponible</span></td>
            <td>310 ms</td>
          </tr>
          <tr>
            <th scope="row">Búsqueda</th>
            <td><span class="status status-available">Disponible</span></td>
            <td>950 ms</td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>

  <footer>
    <p>Datos de ejemplo escritos a mano.</p>
  </footer>
</body>
</html>
```

```text
Revisor de servicios

Última revisión: 7 de octubre de 2026, 10:30

Ir a: Resumen o Servicios

Resumen
Servicios revisados
5
Disponibles
4 de 5
Caídos
1
Respuesta promedio
465 ms
Servicios

Buscar servicio 

Mostrar
 Todos  Disponibles  Caídos

Revisar ahora

Estado de los servicios en la última revisión
Servicio	Estado	Tiempo de respuesta
Catálogo	Disponible	120 ms
Pagos	Disponible	480 ms
Inventario	Caído	sin respuesta
Notificaciones	Disponible	310 ms
Búsqueda	Disponible	950 ms

Datos de ejemplo escritos a mano.
```

O texto é o mesmo da Lição 2, e é o correto: o CSS não muda o que a página diz, só como ela é desenhada. Abra a página no seu servidor local e observe o que de fato mudou. As decisões, uma por uma:

- **Três camadas em ordem:** `reset` (a caixa e as fontes dos controles), `base` (variáveis, corpo, títulos, links, foco) e `components` (seções, resumo, controles, tabela, selos). Como cada regra vive em uma camada e entre camadas manda a ordem, **não há um único `!important` nem é preciso que nenhum dos seletores seja especialmente específico**. Se amanhã alguém escrever uma regra sem camada, essa vence tudo: é a porta de emergência, e por isso se escreve com intenção.
- **Todas as decisões, em `:root`:** cores, espaçamentos, fonte. O resto da folha não contém uma única cor escrita em hexadecimal; tudo sai de `var()`. Para mudar o azul do painel inteiro, muda-se uma linha. É o exercício 3.
- **`margin: 0 auto` com `max-width: 60rem`:** o conteúdo tem uma largura máxima confortável, e `auto` nas margens laterais reparte o espaço que sobra para os dois lados. É a forma de centralizar um bloco com largura.
- **`:focus-visible`:** um anel de 3 pixels na cor de acento, separado 2 pixels do elemento. Pressione Tab: o anel aparece no link, no campo, no grupo de rádios e no botão. Conferi no Chrome: o botão em foco com o teclado tem um contorno `solid` de `3px` e cor `rgb(11, 92, 173)`.
- **A tabela:** `border-collapse: collapse` junta as bordas das células em uma única linha (por padrão cada célula desenha as suas, com um vão entre elas). As células levam preenchimento para que respirem, e as linhas se limitam à parte de baixo de cada linha da tabela.
- **Os números:** `th:last-child, td:last-child` seleciona a última célula de cada linha, que é a de tempos, e a alinha à direita com algarismos tabulares. Repare que o `<th>` do nome da linha não é afetado: é o primeiro filho da sua linha, não o último.
- **Os selos:** uma regra, duas variantes, e o texto continua ali: a cor só reforça o que a palavra diz.
- **O botão:** mede ao menos `2.5rem` de altura (40 pixels com a fonte de 16), acima do mínimo de 24 × 24 que as diretrizes pedem para os alvos de toque ([WCAG 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)). O campo de busca também mede 40.

E uma conta honesta antes de fechar. Com o navegador a 1000 pixels de largura, o painel fica bom. **Se você o reduzir a 320 pixels, que é a largura de um celular pequeno, aparece uma barra de rolagem horizontal**: medi que o documento mede 414 pixels de largura numa janela de 320. A tabela com as suas três colunas não cabe. Não é um descuido desta lição: é o tema da seguinte. Hoje o painel é legível; nas lições 4 e 5 ele é organizado e se torna adaptável.

## O erro que você vai ver

O navegador não mostra erros de CSS. Se você escrever mal uma propriedade ou um valor, simplesmente **ignora a declaração** e segue em frente. Isso faz com que os erros de CSS sejam silenciosos, e por isso costumam ser procurados onde se manifestam (“por que o meu título não é azul?”) e não onde nasceram. Para vê-los há dois instrumentos: o validador de CSS do W3C, e o inspetor do navegador, onde uma declaração inválida aparece riscada ou marcada.

Esta página tem quatro erros de sintaxe e uma variável escrita errado:

```html
<!-- fig03_09.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Estilos que no hacen caso</title>
  <style>
    h1 {
      colour: navy;
    }
    p {
      color: #12;
    }
    table {
      width: 100 px;
    }
    .status {
      padding: 0.25rem 0.5rem
      border-radius: 999px;
    }
    .note {
      color: var(--color-textt);
    }
  </style>
</head>
<body>
  <main>
    <h1>Estilos que no hacen caso</h1>
    <p>Ninguna de estas reglas hace lo que el autor quería.</p>
    <p class="note">Este párrafo usa una variable que no existe.</p>
  </main>
</body>
</html>
```

O [validador de CSS do W3C](https://jigsaw.w3.org/css-validator/) vive em `https://jigsaw.w3.org/css-validator/` e aceita um arquivo, um endereço ou o texto colado. Isto é o que ele responde sobre o bloco de estilos de cima (copiado do resultado real):

```text
Line : 3 h1
       Property “colour” doesn't exist. The closest matching property name is “color” : 
       navy
Line : 6 p
       (Value Error : color (nullcolors.html#propdef-color))
       “#12” is not a valid color 3 or 6 hexadecimals numbers : 
Line : 9 table
       (Value Error : width (nullvisudet.html#propdef-width))
       Too many values or values are not recognized : 
Line : 13 .status
       (Value Error : padding (nullbox.html#propdef-padding))
       Missing a semicolon before the property name “border-radius”
```

Cada mensagem traz a linha do arquivo e o seletor onde ocorre. Uma por uma:

1. **`colour` não existe.** A ortografia britânica de “color”. E a mensagem diz qual é a propriedade que você quis escrever. O navegador ignorou a declaração e o título ficou preto; não houve aviso.
2. **`#12` não é uma cor.** Uma cor hexadecimal tem 3 ou 6 algarismos (e 4 ou 8 se leva transparência). O valor foi descartado.
3. **`100 px`** tem um espaço. Para o CSS são dois valores, e a largura só aceita um: escreve-se `100px`, colado.
4. **Falta um ponto e vírgula** no final da declaração de `padding`. O navegador leu `0.25rem 0.5rem border-radius: 999px` como um único valor inválido, e **perdeu as duas declarações**. É o erro mais comum, e o que mais surpreende, porque uma linha mal fechada leva consigo também a de baixo.

O erro da variável é outro: `var(--color-textt)` tem um `t` a mais e a variável não existe. O validador **não o detecta** (o seu aviso sobre o painel diz que, pela sua natureza dinâmica, as variáveis não são verificadas de forma estática). O navegador tampouco protesta: medi no Chrome e o parágrafo ficou com a cor preta de sempre, a do texto herdado. Uma variável que não existe faz com que a declaração seja inválida *no momento de calcular o valor*, e a propriedade volta ao seu valor herdado ou inicial, em silêncio. A forma de encontrá-la é a que você já conhece: no inspetor, a declaração aparece marcada, e o valor calculado do parágrafo não é o que você esperava. Outro bom costume: uma variável pode levar um valor de reserva como segundo argumento, `var(--color-text, black)`, que é usado quando a variável não existe.

Uma última verificação sobre o painel deste capítulo: passei a sua folha pelo mesmo validador e ele respondeu “Congratulations! No Error Found”, com só dois avisos que dizem que as variáveis não são verificadas de forma estática.

## O que se faz errado

**1. Resolver um conflito aumentando a força.** Mais seletores, um identificador, um `!important`. *Custo:* cada remendo exige outro mais forte, e a folha acaba impossível de mudar. Correção: calcule a especificidade das duas regras, baixe a que não precisa ser forte, e ordene com camadas.

**2. Usar identificadores para dar estilo.** `#summary dd { ... }`. *Custo:* um identificador pesa (1,0,0), que vence mil classes, e a única forma de vencê-lo é outro identificador. Correção: o estilo vai com classes ou com seletores de elemento; o `id` fica para os links internos e para os rótulos.

**3. O atributo `style` no HTML.** *Custo:* vence quase tudo e mistura aparência com conteúdo; para mudar uma cor você tem de editar o HTML em cem lugares. Correção: uma classe.

**4. `outline: none` sem substituto.** *Custo:* o usuário de teclado fica sem saber onde está. Correção: `:focus-visible` com um contorno próprio.

**5. Tamanhos de fonte em `px`.** *Custo:* quem aumenta o tamanho da fonte na configuração do navegador não vê efeito, e só lhe resta dar zoom na sua página toda vez. Correção: `rem`.

**6. Comunicar o estado só com a cor.** Um selo que só é vermelho ou verde. *Custo:* perde-se para quem não distingue essas cores e para quem usa um leitor de tela. Correção: a palavra sempre; a cor, de reforço.

**7. Subtrair pixels a olho.** `width: 280px` para que “caiba” com o preenchimento. *Custo:* o número depende de um cálculo que ninguém escreveu, e quebra ao mudar o preenchimento. Correção: `box-sizing: border-box` para todos e a largura que você de fato quer.

**8. Nomear as variáveis pela sua cor.** `--blue`, `--red`. *Custo:* no dia em que a decisão muda, o nome mente. Correção: nomes por função, como `--color-accent`.

**9. Copiar valores soltos em cada regra.** O mesmo `#0b5cad` em cinco lugares. *Custo:* mudá-lo é procurar e substituir, e sempre se esquece um. Correção: uma variável.

## Exercícios

### Exercício 1 — Preveja antes de abrir

Dada esta página, escreva de que cor será cada elemento da lista (A, B e C) **antes** de abri-la. Depois abra-a e compare. Por último, mude **uma única coisa** numa regra para que B apareça verde e C carmesim, sem usar `!important`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Predice antes de abrir</title>
  <style>
    li { color: black; }
    #list li { color: navy; }
    .done { color: green; }
    li.urgent { color: crimson; }
  </style>
</head>
<body>
  <ul id="list">
    <li>A</li>
    <li class="done">B</li>
    <li class="done urgent">C</li>
  </ul>
</body>
</html>
```

### Exercício 2 — O cartão que sai para fora

Um cartão tem `width: 100%`, `padding: 16px` e `border: 2px solid black`, dentro de uma coluna de 500 px de largura. Calcule à mão quanto mede o cartão com `content-box` e quanto com `border-box`. Depois escreva a página, meça-a com o inspetor e confira a sua conta.

### Exercício 3 — Mudar o acento em uma linha

Mude a cor de acento do painel para outra à sua escolha editando **uma única linha** da folha. Antes de escolhê-la, confira com o seletor de cor das ferramentas do navegador ou com o verificador da WebAIM que ela cumpre 4.5 : 1 sobre branco. Depois responda: o que no painel mudou de cor com essa única linha?

### Exercício 4 — Desfazer uma guerra de `!important`

Esta folha tem um `!important` que impede que o selo de “Caído” apareça vermelho. Conserte-a **removendo-o e sem acrescentar outro**, e sem mudar o HTML:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Guerra de important</title>
  <style>
    .status { color: gray !important; padding: 0 8px; }
    .status-down { color: red; }
  </style>
</head>
<body>
  <p><span class="status status-down">Caído</span></p>
</body>
</html>
```

## Soluções

### Solução 1

As três são **azuis** (`navy`, `rgb(0, 0, 128)`). A regra `#list li` tem especificidade (1,0,1), com um identificador, e vence todas as demais: `.done` é (0,1,0) e `li.urgent` é (0,1,1), e nenhuma chega a ter identificador. É a armadilha de usar identificadores para dar estilo: uma vez que um aparece, nenhuma classe pode competir.

Para que B seja verde e C carmesim é preciso **baixar** a força dessa regra, não subir a das outras. `:where()` vale zero, então `:where(#list) li` tem especificidade (0,0,1):

```css
li { color: black; }
:where(#list) li { color: navy; }
.done { color: green; }
li.urgent { color: crimson; }
```

Com essa mudança, medi no Chrome 154: A é azul (`rgb(0, 0, 128)`), B verde (`rgb(0, 128, 0)`) e C carmesim (`rgb(220, 20, 60)`). A continua azul porque `:where(#list) li` e `li` empatam em (0,0,1) e vence a que está mais abaixo.

### Solução 2

Com `content-box`: 500 de largura do conteúdo + 32 de preenchimento (16 + 16) + 4 de borda (2 + 2) = **536 pixels**, que saem 36 pixels da coluna de 500. Com `border-box`: a largura de `100%` (500) já inclui tudo, então mede **500**. A minha medição coincidiu: 536 e 500.

```css
.wrap { width: 500px; }
.card { width: 100%; padding: 16px; border: 2px solid black; }
.card.fixed { box-sizing: border-box; }
```

### Solução 3

É preciso mudar a linha `--color-accent` dentro de `:root`. Por exemplo, `#6f2da8` (um roxo) dá 8.03 : 1 sobre branco, o que cumpre com folga. Uma cor como `#9a4dff` parece viva e **não cumpre**: 4.30 : 1, abaixo de 4.5. Com essa única linha mudam de cor: os links, o fundo do botão, o contorno do foco e, por tabela, o texto do botão, que é branco (`--color-surface`) e também precisa de contraste suficiente contra o novo acento. Essa é a vantagem de nomear a decisão e não a cor: quatro lugares, uma linha. E a lição que acompanha: ao mudar uma variável é preciso revisar **todas** as combinações em que ela participa, não só a que você tinha em mente.

### Solução 4

O `!important` faz com que `.status` vença tudo. Ao removê-lo, as duas regras têm a mesma especificidade (0,1,0) e decide a ordem: `.status-down` vem depois, então vence, e o texto é vermelho. Um ajuste que além disso torna a folha mais sólida é usar o padrão de variáveis da seção 3.3.1:

```css
.status { color: var(--badge-text); padding: 0 8px; }
.status-down { --badge-text: red; }
```

Com esse padrão não há conflito possível: a regra `.status` nunca diz uma cor, só lê uma variável. E quem precisar de outra variante acrescenta uma classe de uma linha. Antes de usá-lo, meça que `red` sobre o fundo real cumpra o contraste.

## Como sei que consegui

- [ ] O painel abre em `http://localhost:8000/` com a folha aplicada, sem erros no console das ferramentas do navegador.
- [ ] O validador de CSS (`https://jigsaw.w3.org/css-validator/`) responde “Congratulations! No Error Found” sobre o seu `styles.css`.
- [ ] Ao pressionar Tab você vê um anel azul de 3 pixels ao redor do link, do campo, dos rádios e do botão, e procurar `outline: none` na sua folha não dá nenhum resultado.
- [ ] No inspetor, sobre a caixa com `border-box` de `fig03_05.html`, o diagrama da caixa mostra um conteúdo de 250 pixels de largura (300 menos 40 de preenchimento e 10 de borda), e sobre a outra, 300.
- [ ] Você consegue prever a cor dos quatro parágrafos de `fig03_02.html` antes de abri-la, dizendo qual passo da cascata desempata cada um.
- [ ] Cada cor de texto da sua folha cumpre 4.5 : 1 contra o seu fundo, e você sabe dizer com que ferramenta a mediu.
- [ ] Mudar o valor de `--color-accent` muda, ao mesmo tempo, os links, o botão e o anel do foco.

## Para ler mais

- [MDN, “Cascata, especificidade e herança”](https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Core/Styling_basics/Handling_conflicts) — o artigo de aprendizado da Mozilla sobre este mesmo tema, com desafios de prática. Consultado em 7 de outubro de 2026.
- [W3C, “CSS Cascading and Inheritance Level 5”](https://www.w3.org/TR/css-cascade-5/) — a especificação onde está escrito o algoritmo da cascata, com as suas camadas e a sua ordem. Em inglês. Consultada em 7 de outubro de 2026.
- [MDN, “O modelo de caixa”](https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Core/Styling_basics/Box_model) — a caixa, o preenchimento, a borda e a margem com diagramas e `box-sizing`. Consultado em 7 de outubro de 2026.
- [web.dev, “Learn CSS”](https://web.dev/learn/css) — curso gratuito do Google por temas, útil como referência ordenada de seletores, caixa, cascata e herança. Em inglês. Consultado em 7 de outubro de 2026.
