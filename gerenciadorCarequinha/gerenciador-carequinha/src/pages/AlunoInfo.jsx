import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { API_ALUNOS, API_SALAS } from '../hooks/configApi';
import NotasEditor from '../blueprints/NotasEditor';


const COMPETENCIAS_BERCARIO = [
    {
        id: 1,
        titulo: "O eu, o outro e o nós",
        itens: [
            { id: "EI01EO01X", texto: "Perceber que suas ações têm efeitos nas outras crianças, nos adultos e no ambiente." },
            { id: "EI01EO02", texto: "Perceber as possibilidades e os limites de seu corpo nas brincadeiras e interações das quais participa." },
            { id: "EI01EO03X", texto: "Interagir com crianças da mesma faixa etária, de faixas etárias diferentes e adultos ao explorar espaços, materiais, objetos e brinquedos." },
            { id: "EI01EO04", texto: "Comunicar necessidades, desejos e emoções, utilizando gestos, balbucios, palavras." },
            { id: "EI01EO05X", texto: "Reconhecer seu corpo e expressar suas sensações em momentos de alimentação, higiene, brincadeira, descanso e nas interações com o outro e com o meio." },
            { id: "EI01EO06X", texto: "Interagir com outras crianças da mesma faixa etária, de faixa etária diferente e com adultos, adaptando-se ao convívio social." },
            { id: "EI01EO07", texto: "Construir progressivamente sua identidade pessoal, desenvolvendo imagem positiva de si mesma, sentimento de autoestima, autonomia e confiança." }
        ]
    },
    {
        id: 2,
        titulo: "Corpo, gestos e movimentos",
        itens: [
            { id: "EI01CG01", texto: "Movimentar as partes do corpo para exprimir corporalmente emoções, necessidades e desejos." },
            { id: "EI01CG02", texto: "Experimentar as possibilidades corporais nas brincadeiras e interações em ambientes acolhedores e desafiantes, percebendo seus limites e potencialidades." },
            { id: "EI01CG03", texto: "Imitar gestos e movimentos de outras crianças, adultos e animais, desenvolvendo a capacidade de criar e imaginar." },
            { id: "EI01CG04", texto: "Participar do cuidado do seu corpo e da promoção do seu bem-estar." },
            { id: "EI01CG05", texto: "Utilizar os movimentos de preensão, encaixe e lançamento, ampliando suas possibilidades de manuseio de diferentes materiais e objetos." }
        ]
    },
    {
        id: 3,
        titulo: "Traços, sons, cores e formas",
        itens: [
            { id: "EI01TS01", texto: "Explorar sons produzidos com o próprio corpo e com objetos do ambiente." },
            { id: "EI01TS02", texto: "Traçar marcas gráficas, em diferentes suportes, usando instrumentos riscantes e tintas." },
            { id: "EI01TS03", texto: "Explorar diferentes fontes sonoras e materiais para acompanhar brincadeiras cantadas, canções, músicas e melodias." },
            { id: "EI01TS04", texto: "Perceber e expressar por meio da produção das artes plásticas, visuais e corporais a imaginação, emoção e sensibilidade." }
        ]
    },
    {
        id: 4,
        titulo: "Escuta, fala, pensamento e imaginação",
        itens: [
            { id: "EI01EF01", texto: "Reconhecer quando é chamado por seu nome e reconhecer os nomes de pessoas com quem convive." },
            { id: "EI01EF02X", texto: "Demonstrar interesse ao ouvir a leitura de poemas, outros gêneros e a apresentação de músicas e outras manifestações artísticas." },
            { id: "EI01EF03", texto: "Demonstrar interesse ao ouvir histórias lidas ou contadas, observando ilustrações e os movimentos de leitura do adulto leitor (modo de segurar o portador e de virar as páginas)." },
            { id: "EI01EF04", texto: "Reconhecer elementos das ilustrações de histórias, apontando-os, a pedido do adulto-leitor." },
            { id: "EI01EF05", texto: "Imitar as variações de entonação e gestos realizados pelos adultos, ao ler histórias e ao cantar." },
            { id: "EI01EF06", texto: "Comunicar-se com outras pessoas usando movimentos, gestos, balbucios, fala e outras formas de expressão." },
            { id: "EI01EF07", texto: "Conhecer e manipular materiais impressos e audiovisuais em diferentes portadores (livro, revista, gibi, jornal, cartaz, CD, tablet etc.)." },
            { id: "EI01EF08", texto: "Participar de situações de escuta de textos em diferentes gêneros textuais (poemas, fábulas, contos, receitas, quadrinhos, anúncios etc.)." },
            { id: "EI01EF09", texto: "Conhecer e manipular diferentes instrumentos e suportes de escrita." }
        ]
    },
    {
        id: 5,
        titulo: "Espaços, tempos, quantidades, relações e transformações",
        itens: [
            { id: "EI01ET01", texto: "Explorar e descobrir as propriedades de objetos e materiais (odor, cor, sabor, temperatura)." },
            { id: "EI01ET02", texto: "Explorar relações de causa e efeito (transbordar, tingir, misturar, mover e remover etc.) na interação com o mundo físico." },
            { id: "EI01ET03X", texto: "Explorar o ambiente pela ação e observação, manipulando, experimentando e fazendo descobertas, desenvolvendo comportamento sustentável." },
            { id: "EI01ET04X", texto: "Manipular, experimentar, arrumar e explorar o espaço por meio de experiências de deslocamentos de si, dos outros e dos objetos." },
            { id: "EI01ET05", texto: "Manipular materiais diversos e variados para comparar as diferenças e semelhanças entre eles." },
            { id: "EI01ET06", texto: "Vivenciar diferentes ritmos, velocidades e fluxos nas interações e brincadeiras (em danças, balanços, escorregadores etc.)." }
        ]
    }
];

const COMPETENCIAS_MATERNAL_PRIMARIO = [
    {
        id: 1,
        titulo: "Valores Humanos",
        itens: [
            { id: "EVH1", texto: "Compreende a verdade diferenciando o que é imutável do que é transitório." },
            { id: "EVH2", texto: "Conhece sua história pessoal e valoriza positivamente sua experiência de vida." },
            { id: "EVH3", texto: "Reconhece seus dons e talentos e os do próximo." },
            { id: "EVH4", texto: "Faz opções e escolhas adequadas considerando o bem e o mal." },
            { id: "EVH5", texto: "Busca soluções para seus conflitos." },
            { id: "EVH6", texto: "Convive sem preconceito respeitando fatos e ou situações." },
            { id: "EVH7", texto: "Busca por meio de experiências, a aprimoração de atitudes e valores." },
            { id: "EVH8", texto: "Demonstra harmonia entre pensamento, palavra e ação." },
            { id: "EVH9", texto: "Reconhece a importância de agir corretamente demonstrando espírito de iniciativa, traquejo social e práticas éticas." },
            { id: "EVH10", texto: "Responsabiliza-se por seus atos." },
            { id: "EVH11", texto: "Cuida da sua higiene." },
            { id: "EVH12", texto: "Cuida do seu material com zelo." },
            { id: "EVH13", texto: "Cuida do material da escola." },
            { id: "EVH14", texto: "Demonstra iniciativa para superar dificuldades." },
            { id: "EVH15", texto: "Demonstra respeito por si mesmo, pelo outro e pela natureza." },
            { id: "EVH16", texto: "Trata o outro com bondade e amabilidade." },
            { id: "EVH17", texto: "Age com equilíbrio e planeja ações solidárias." },
            { id: "EVH18", texto: "Age com prudência, visando o bem comum." },
            { id: "EVH19", texto: "Possui controle emocional e harmoniza suas energias buscando a paz em seu interior." },
            { id: "EVH20", texto: "Possui equilíbrio interior demonstrando capacidade de esperar com tranquilidade." },
            { id: "EVH21", texto: "Domina seus impulsos e atos inferiores." },
            { id: "EVH22", texto: "Demonstra tolerância, compreensão e respeito às diferenças individuais." },
            { id: "EVH23", texto: "Concentra nas atividades que está realizando." },
            { id: "EVH24", texto: "Demonstra desprendimento e desapego vivendo em harmonia com os aspectos materiais e espirituais." },
            { id: "EVH25", texto: "Demonstra ter consciência de seus dons e de que pode contribuir com o crescimento dos outros." },
            { id: "EVH26", texto: "Compreende o amor como uma energia que cria, rege e sustenta o universo." },
            { id: "EVH27", texto: "Valoriza a amizade e relaciona-se bem com os outros." },
            { id: "EVH28", texto: "Demonstra gratidão em diferentes situações." },
            { id: "EVH29", texto: "Desculpa o próximo." },
            { id: "EVH30", texto: "Compadece-se pelo sentimento e sofrimento do outro." },
            { id: "EVH31", texto: "Percebe que todos são iguais em essência." },
            { id: "EVH32", texto: "Demonstra alegria." },
            { id: "EVH33", texto: "Expressa a consciência da não-violência através de um relacionamento compreensivo e harmonioso com tudo e com todos." },
            { id: "EVH34", texto: "Participa ativamente de trabalhos em equipe." },
            { id: "EVH35", texto: "Reconhece-se como parte de um todo cuja essência é única." },
            { id: "EVH36", texto: "Respeita todas as formas de vida e reconhece suas interdependências." },
            { id: "EVH37", texto: "Valoriza a terra em que vive e contribui para o seu crescimento e desenvolvimento." },
            { id: "EVH38", texto: "Aproveita bem o tempo na execução das atividades propostas." },
            { id: "EVH39", texto: "Faz uso adequado do dinheiro, percebendo-o como fonte de possibilidades e não como instrumento de poder." }
        ]
    },
    {
        id: 2,
        titulo: "Arte",
        itens: [
            { id: "ART1", texto: "Reconhece as artes visuais como um meio de comunicação, expressão e construção do conhecimento." },
            { id: "ART2", texto: "Explora propriedades características de diferentes materiais." },
            { id: "ART3", texto: "Observa e identifica imagens variadas." },
            { id: "ART4", texto: "Rasga com movimento de pinça." },
            { id: "ART5", texto: "Interessa-se pelas próprias produções." },
            { id: "ART6", texto: "Organiza o espaço após a realização de atividades." },
            { id: "ART7", texto: "Utiliza a tesoura como instrumento de recorte." },
            { id: "ART8", texto: "Expressa-se livremente através de desenho, pintura, colagem, dobradura e escultura." },
            { id: "ART9", texto: "Conhece espaços e objetos de divulgação da arte." },
            { id: "ART10", texto: "Conhece vida e obra de alguns artistas." },
            { id: "ART11", texto: "Utiliza técnicas diversas em releituras de obras conhecidas." },
            { id: "ART12", texto: "Identifica cores variadas." },
            { id: "ART13", texto: "Experimenta misturas de cores e as utiliza em seus desenhos." },
            { id: "ART14", texto: "Realiza atividades artísticas com atenção e concentração." },
            { id: "ART15", texto: "Pinta, utilizando técnicas variadas." },
            { id: "ART16", texto: "Identifica produções artísticas." },
            { id: "ART17", texto: "Demonstra interesse por obras de arte e seus autores." },
            { id: "ART18", texto: "Expressa-se através de releitura de obras de arte." },
            { id: "ART19", texto: "Protege o próprio corpo e o do colega ao manusear instrumentos, materiais e objetos." },
            { id: "ART20", texto: "Utiliza a dança como uma linguagem que possibilita consciência corporal, interação, expressão e ritmo." },
            { id: "ART21", texto: "Acompanha ritmos musicais." },
            { id: "ART22", texto: "Explora as possibilidades de gestos, posturas e ritmos corporais." },
            { id: "ART23", texto: "Expressa-se livremente por meio da dança." },
            { id: "ART24", texto: "Aprecia diferentes modalidades de dança." },
            { id: "ART25", texto: "Participa das atividades de dança respeitando os estilos individuais de interpretação e criação." },
            { id: "ART26", texto: "Interage com a música, percebendo-a como uma forma de expressão individual e coletiva que favorece a socialização, o desenvolvimento da afetividade, da criatividade e do senso rítmico." },
            { id: "ART27", texto: "Percebe e imita sons." },
            { id: "ART28", texto: "Produz sons por meio da manipulação de objetos." },
            { id: "ART29", texto: "Acompanha ritmos musicais." },
            { id: "ART30", texto: "Distingue sons e ruídos." },
            { id: "ART31", texto: "Interpreta, por meio da voz, repertórios musicais." },
            { id: "ART32", texto: "Cria sons e ritmos com o próprio corpo." },
            { id: "ART33", texto: "Experimenta o silêncio como linguagem musical." },
            { id: "ART34", texto: "Orienta-se pela presença de um som." },
            { id: "ART35", texto: "Explora e identifica alguns instrumentos musicais." },
            { id: "ART36", texto: "Expressa sensações, sentimentos e pensamentos por meio da música." },
            { id: "ART37", texto: "Demonstra interesse por obras musicais diversas, seus compositores e intérpretes." },
            { id: "ART38", texto: "Explora sons vocais." },
            { id: "ART39", texto: "Utiliza a linguagem teatral para interagir com o outro e com o meio, expressando emoções, ideias e ampliando conhecimentos." },
            { id: "ART40", texto: "Utiliza objetos para simbolizar realidades do mundo físico e social." },
            { id: "ART41", texto: "Faz releitura cênica." },
            { id: "ART42", texto: "Cria pantomimas de cenas do cotidiano." },
            { id: "ART43", texto: "Cria diálogos simples." },
            { id: "ART44", texto: "Explora as possibilidades gestuais e de movimento do próprio corpo em diferentes espaços." },
            { id: "ART45", texto: "Interpreta personagens explorando movimentos, gestos e voz em jogos de improvisação." }
        ]
    },
    {
        id: 3,
        titulo: "Educação Física / Movimento",
        itens: [
            { id: "EF1", texto: "Demonstra controle sobre o próprio corpo utilizando-o intencionalmente como instrumento de interação com o outro e com o meio através do movimento." },
            { id: "EF2", texto: "Apresenta confiança progressiva em suas capacidades motoras." },
            { id: "EF3", texto: "Desloca-se no espaço com destreza progressiva." },
            { id: "EF4", texto: "Utiliza as possibilidades de movimento do próprio corpo em jogos e brincadeiras." },
            { id: "EF5", texto: "Controla gradualmente o próprio movimento." },
            { id: "EF6", texto: "Amplia gradativamente a independência de movimentos de um lado do corpo em relação ao outro." },
            { id: "EF7", texto: "Define a própria dominância lateral." },
            { id: "EF8", texto: "Respeita a própria integridade física e a dos colegas." },
            { id: "EF9", texto: "Identifica suas próprias sensações e sinais vitais." },
            { id: "EF10", texto: "Participa da elaboração de regras e combinados do grupo." },
            { id: "EF11", texto: "Respeita regras e combinados elaborados." }
        ]
    },
    {
        id: 4,
        titulo: "Linguagem Oral e Escrita",
        itens: [
            { id: "LOE1", texto: "Compreende o sentido das mensagens que ouve." },
            { id: "LOE2", texto: "Expressa desejos, necessidades e sentimentos." },
            { id: "LOE3", texto: "Segue instruções." },
            { id: "LOE4", texto: "Reproduz textos oralmente." },
            { id: "LOE5", texto: "Elabora perguntas e respostas de acordo com os contextos de que participa." },
            { id: "LOE6", texto: "Transmite informações." },
            { id: "LOE7", texto: "Narra fatos." },
            { id: "LOE8", texto: "Cria histórias." },
            { id: "LOE9", texto: "Explica e defende suas ideias." },
            { id: "LOE10", texto: "Expressa seu pensamento com organização lógica temporal e causal." },
            { id: "LOE11", texto: "Lê imagens em contextos diversos." },
            { id: "LOE12", texto: "Manifesta interesse pela leitura." },
            { id: "LOE13", texto: "Faz pseudoleitura." },
            { id: "LOE14", texto: "Distingue desenho de escrita." },
            { id: "LOE15", texto: "Identifica a primeira letra do nome dentro de um conjunto de letras." },
            { id: "LOE16", texto: "Levanta hipóteses sobre o conteúdo de diferentes suportes textuais." },
            { id: "LOE17", texto: "Faz leitura incidental." },
            { id: "LOE18", texto: "Reconhece a leitura como fonte de prazer e informação." },
            { id: "LOE19", texto: "Identifica letras do alfabeto em contextos significativos." },
            { id: "LOE20", texto: "Identifica o primeiro nome dentro do conjunto de nomes do grupo." },
            { id: "LOE21", texto: "Compreende textos de diferentes gêneros." },
            { id: "LOE22", texto: "Lê observando a direção e o alinhamento da escrita." },
            { id: "LOE23", texto: "Distingue letras de numerais e outros sinais gráficos." },
            { id: "LOE24", texto: "Identifica as letras do alfabeto." },
            { id: "LOE25", texto: "Percebe a existência de diferentes tipos de letras." },
            { id: "LOE26", texto: "Percebe a letra como unidade da palavra." },
            { id: "LOE27", texto: "Percebe a palavra como componente do texto." },
            { id: "LOE28", texto: "Estabelece relações entre os sons da fala e a grafia." },
            { id: "LOE29", texto: "Percebe a semelhança de sons em palavras distintas." },
            { id: "LOE30", texto: "Reconhece globalmente palavras significativas." },
            { id: "LOE31", texto: "Manuseia diferentes ferramentas e suportes de escrita para desenhar, traçar letras e outros sinais gráficos." },
            { id: "LOE32", texto: "Transcreve o primeiro nome." },
            { id: "LOE33", texto: "Escreve espontaneamente utilizando o conhecimento de que dispõe sobre o sistema de escrita." },
            { id: "LOE34", texto: "Escreve observando a direção e o alinhamento da escrita." },
            { id: "LOE35", texto: "Escreve o primeiro nome." },
            { id: "LOE36", texto: "Transcreve o nome completo." },
            { id: "LOE37", texto: "Escreve, por memorização, palavras com as quais tem familiaridade." },
            { id: "LOE38", texto: "Escreve espontaneamente empregando hipóteses do nível pré-silábico." },
            { id: "LOE39", texto: "Escreve espontaneamente empregando hipóteses do nível silábico." },
            { id: "LOE40", texto: "Escreve espontaneamente empregando hipóteses do nível silábico-alfabético." },
            { id: "LOE41", texto: "Escreve espontaneamente empregando hipóteses do nível alfabético." },
            { id: "LOE42", texto: "Produz pequenos textos coletivamente." }
        ]
    },
    {
        id: 5,
        titulo: "Matemática",
        itens: [
            { id: "MAT1", texto: "Organiza objetos no espaço conforme suas características." },
            { id: "MAT2", texto: "Estabelece relações de comparação entre objetos observando suas propriedades." },
            { id: "MAT3", texto: "Representa objetos através de desenhos ou símbolos." },
            { id: "MAT4", texto: "Observa, manipula e identifica características de objetos variados." },
            { id: "MAT5", texto: "Identifica e nomeia formas geométricas planas." },
            { id: "MAT6", texto: "Utiliza pontos de referência para situar-se e deslocar-se no espaço." },
            { id: "MAT7", texto: "Utiliza conceitos básicos de posição." },
            { id: "MAT8", texto: "Realiza contagem oral em contextos diversos." },
            { id: "MAT9", texto: "Classifica objetos de acordo com seus atributos." },
            { id: "MAT10", texto: "Organiza elementos em séries." },
            { id: "MAT11", texto: "Utiliza conceitos básicos de quantidade." },
            { id: "MAT12", texto: "Representa quantidades utilizando diferentes linguagens." },
            { id: "MAT13", texto: "Utiliza noções simples de cálculo mental como estratégia para resolver problemas." },
            { id: "MAT14", texto: "Relaciona número à sua respectiva quantidade." },
            { id: "MAT15", texto: "Associa número a numeral." },
            { id: "MAT16", texto: "Lê e utiliza tabelas e gráficos simples." },
            { id: "MAT17", texto: "Utiliza conceitos básicos de dimensão." },
            { id: "MAT18", texto: "Utiliza conceitos básicos de massa." },
            { id: "MAT19", texto: "Utiliza conceitos básicos de capacidade." },
            { id: "MAT20", texto: "Utiliza conceitos básicos de temperatura." },
            { id: "MAT21", texto: "Utiliza conceitos básicos de tempo." },
            { id: "MAT22", texto: "Utiliza conceitos básicos de valor." },
            { id: "MAT23", texto: "Compara grandezas utilizando diferentes procedimentos." },
            { id: "MAT24", texto: "Percebe a lógica da sequência temporal." },
            { id: "MAT25", texto: "Percebe causas e efeitos das mudanças de temperatura." }
        ]
    },
    {
        id: 6,
        titulo: "Natureza e Sociedade",
        itens: [
            { id: "NS1", texto: "Explora o meio ambiente através da ação e observação." },
            { id: "NS2", texto: "Descreve o ambiente em que se encontra." },
            { id: "NS3", texto: "Percebe alguns elementos que compõem a paisagem do lugar onde vive." },
            { id: "NS4", texto: "Explora diferentes tipos de objetos identificando suas propriedades evidentes." },
            { id: "NS5", texto: "Demonstra atitudes de cuidado, preservação e valorização do meio ambiente." },
            { id: "NS6", texto: "Observa e descreve animais identificando semelhanças e diferenças entre eles." },
            { id: "NS7", texto: "Observa e descreve plantas identificando semelhanças e diferenças entre elas." },
            { id: "NS8", texto: "Observa e descreve ambientes, lugares e paisagens." },
            { id: "NS9", texto: "Identifica mudanças e permanências ocorridas em ambientes, lugares e paisagens." },
            { id: "NS10", texto: "Percebe a influência da natureza no modo de viver das pessoas." },
            { id: "NS11", texto: "Explora diferentes tipos de objetos e materiais identificando suas propriedades não evidentes e relações de causa e efeito." },
            { id: "NS12", texto: "Observa processos e etapas de transformação de materiais e objetos." },
            { id: "NS13", texto: "Conhece algumas invenções do homem e sua utilidade." },
            { id: "NS14", texto: "Identifica profissões relacionadas a plantas e animais." },
            { id: "NS15", texto: "Elabora hipóteses intuitivas sobre alguns fenômenos da natureza." },
            { id: "NS16", texto: "Relaciona partes do corpo com peças do vestuário e objetos pessoais." },
            { id: "NS17", texto: "Identifica objetos usados na higiene pessoal." },
            { id: "NS18", texto: "Identifica e localiza as partes do corpo em si e em outras pessoas." },
            { id: "NS19", texto: "Apresenta hábitos de higiene pessoal." },
            { id: "NS20", texto: "Identifica alimentos saudáveis." },
            { id: "NS21", texto: "Reconhece a necessidade de cuidados higiênicos com os alimentos." },
            { id: "NS22", texto: "Demonstra cuidado com o próprio corpo em relação à aparência, saúde e segurança." },
            { id: "NS23", texto: "Explora os órgãos sensoriais identificando suas funções." },
            { id: "NS24", texto: "Nomeia partes do corpo e identifica algumas de suas funções." },
            { id: "NS25", texto: "Valoriza atitudes relacionadas à saúde, à segurança e ao bem-estar individual e coletivo." },
            { id: "NS26", texto: "Identifica e caracteriza as fases de vida pelas quais passa o ser humano." },
            { id: "NS27", texto: "Interage com as pessoas com as quais convive estabelecendo vínculos afetivos." },
            { id: "NS28", texto: "Controla progressivamente suas necessidades e suas reações relacionadas a desejos e sentimentos, em situações cotidianas." },
            { id: "NS29", texto: "Identifica relações de parentesco." },
            { id: "NS30", texto: "Narra acontecimentos familiares." },
            { id: "NS31", texto: "Conhece algumas tradições culturais de sua comunidade." },
            { id: "NS32", texto: "Reconhece costumes e valores existentes na família." },
            { id: "NS33", texto: "Representa os lugares onde vive e se relaciona, utilizando diferentes linguagens." },
            { id: "NS34", texto: "Reconhece a importância da moradia na vida das pessoas." },
            { id: "NS35", texto: "Identifica móveis e utensílios domésticos relacionando-os aos respectivos cômodos da casa." },
            { id: "NS36", texto: "Identifica diferentes tipos de moradia existentes na comunidade." },
            { id: "NS37", texto: "Conhece o espaço físico da escola, seus equipamentos, profissionais e respectivas funções." },
            { id: "NS38", texto: "Reconhece papéis sociais existentes em seu grupo de convívio." },
            { id: "NS39", texto: "Estabelece comparações entre homem e mulher identificando diferenças físicas, sociais e psicológicas." },
            { id: "NS40", texto: "Demonstra atitudes de respeito à diversidade nos grupos sociais dos quais participa." }
        ]
    }
];


const REGISTRO_DESEMPENHO = {
    titulo: "REGISTRO DO NÍVEL DE DESEMPENHO DA CRIANÇA",
    secoes: [
        {
            titulo: "FORMAÇÃO PESSOAL E SOCIAL",
            subtitulo: "Comportamento",
            itens: [
                { id: "comp1", texto: "Demonstra autonomia em suas ações", isCompetencia: true },
                { id: "comp2", texto: "É pontual", isCompetencia: true },
                { id: "comp3", texto: "É assídua", isCompetencia: true },
                { id: "comp4", texto: "Organiza seu material escolar", isCompetencia: true },
                { id: "comp5", texto: "Cuida do ambiente", isCompetencia: true },
                { id: "comp6", texto: "Acata e cumpre normas", isCompetencia: true },
                { id: "comp7", texto: "Demonstra atitudes solidárias", isCompetencia: true }
            ]
        },
        {
            titulo: "FORMAÇÃO PESSOAL E SOCIAL",
            subtitulo: "Relacionamento Interpessoal e Participação",
            itens: [
                { id: "comp8", texto: "Com as educadoras e funcionários", isCompetencia: true },
                { id: "comp9", texto: "Com os colegas", isCompetencia: true },
                { id: "comp10", texto: "Compreende as orientações da educadora", isCompetencia: true },
                { id: "comp11", texto: "Participa das atividades coletivas", isCompetencia: true },
                { id: "comp12", texto: "Realiza as atividades individuais.", isCompetencia: true }
            ]
        },
        {
            titulo: "COMPETÊNCIAS",
            subtitulo: null,
            itens: [
                { id: "comp13", texto: "ARTE", isCompetencia: true },
                { id: "comp14", texto: "EDUCAÇÃO FÍSICA", isCompetencia: true },
                { id: "comp15", texto: "LINGUAGEM ORAL", isCompetencia: true },
                { id: "comp16", texto: "LINGUAGEM ESCRITA", isCompetencia: true },
                { id: "comp17", texto: "MATEMÁTICA", isCompetencia: true },
                { id: "comp18", texto: "NATUREZA E SOCIEDADE", isCompetencia: true }
            ]
        },
        {
            titulo: "OUTROS COMPONENTES CURRICULARES",
            subtitulo: null,
            itens: [
                { id: "comp19", texto: "_________________________", isCompetencia: false },
                { id: "comp20", texto: "_________________________", isCompetencia: false },
                { id: "comp21", texto: "_________________________", isCompetencia: false }
            ]
        },
        {
            titulo: "PROJETOS DESENVOLVIDOS",
            subtitulo: null,
            itens: [
                { id: "proj1", texto: "1º PERÍODO", isCompetencia: false, isProjeto: true },
                { id: "proj2", texto: "2º PERÍODO", isCompetencia: false, isProjeto: true },
                { id: "proj3", texto: "3º PERÍODO", isCompetencia: false, isProjeto: true }
            ]
        }
    ]
};

export default function AlunoInfo() {
    const { pid } = useParams();
    const navigate = useNavigate();

    const [aluno, setAluno] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [saving, setSaving] = useState(false);

    const [todasSalas, setTodasSalas] = useState([]);
    const [salaSearch, setSalaSearch] = useState('');
    const [salaDropdownOpen, setSalaDropdownOpen] = useState(false);
    const [salasSelecionadas, setSalasSelecionadas] = useState([]);

    const [compMap, setCompMap] = useState({});
    const [expandedC, setExpandedC] = useState(null);
    const [expandedSub, setExpandedSub] = useState({});

    const [desempenhoMap, setDesempenhoMap] = useState({});
    const [expandedDesempenho, setExpandedDesempenho] = useState({});

    const [competenciasAtivas, setCompetenciasAtivas] = useState(null);

    useEffect(() => { 
        fetchAluno();
        fetchTodasSalas(); 
    }, [pid]);

    function getCompetenciasByTipo(tipos) {
        if (!tipos || tipos.length === 0) return null;
        
        const isBerçario = tipos.some(t => t && t.toLowerCase() === 'berçario');
        if (isBerçario) {
            return COMPETENCIAS_BERCARIO;
        }
        
        return COMPETENCIAS_MATERNAL_PRIMARIO;
    }

    async function fetchAluno() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_ALUNOS}/${pid}`);
            if (!res.ok) throw new Error('Aluno não encontrado');
            const data = await res.json();
            setAluno(data);
            setFormData(data);

            if (data.salas) {
                setSalasSelecionadas(data.salas.map(s => ({ sid: s.sid, nome: s.nome, tipo: s.tipo })));
            }

            let tiposSalas = [];
            
            if (data.salas && data.salas.length > 0) {
                tiposSalas = data.salas.map(s => s.tipo || '').filter(Boolean);
            }
            
            const competencias = getCompetenciasByTipo(tiposSalas);
            setCompetenciasAtivas(competencias);

            const map = {};
            (data.competencias || []).forEach(c => {
                map[c.itemId] = { nota: c.nota, observacao: c.observacao };
            });
            setCompMap(map);

            const desempenhoMapLocal = {};
            (data.desempenho || []).forEach(d => {
                desempenhoMapLocal[d.itemId] = { 
                    periodo1: d.periodo1 || '',
                    periodo2: d.periodo2 || '',
                    periodo3: d.periodo3 || ''
                };
            });
            setDesempenhoMap(desempenhoMapLocal);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function fetchTodasSalas() {
        try {
            const res = await fetch(API_SALAS);
            if (res.ok) {
                setTodasSalas(await res.json());
            }
        } catch (err) {
            console.error('Erro ao carregar salas:', err);
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const salasFiltradas = todasSalas.filter(s =>
        s.nome.toLowerCase().includes(salaSearch.toLowerCase()) &&
        !salasSelecionadas.find(sel => sel.sid === s.sid)
    );

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    function selectSala(sala) {
        setSalasSelecionadas(prev => [...prev, { sid: sala.sid, nome: sala.nome, tipo: sala.tipo }]);
        setSalaSearch('');
    }

    function removeSala(sid) {
        setSalasSelecionadas(prev => prev.filter(s => s.sid !== sid));
    }

    async function handleSaveAluno() {
        setSaving(true);
        try {
            const res = await fetch(`${API_ALUNOS}/${pid}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Erro ao salvar dados do aluno');
            const alunoAtualizado = await res.json();
            
            const salasAtuais = aluno.salas?.map(s => s.sid) || [];
            const novasSalas = salasSelecionadas.map(s => s.sid);
            
            const salasParaRemover = salasAtuais.filter(sid => !novasSalas.includes(sid));
            for (const sid of salasParaRemover) {
                await fetch(`${API_SALAS}/${sid}/alunos/${pid}`, { method: 'DELETE' });
            }
            
            const salasParaAdicionar = novasSalas.filter(sid => !salasAtuais.includes(sid));
            for (const sid of salasParaAdicionar) {
                await fetch(`${API_SALAS}/${sid}/alunos/${pid}`, { method: 'POST' });
            }
            
            await fetchAluno();
            setEditMode(false);
            alert('Dados do aluno salvos com sucesso!');
        } catch (err) {
            alert(err.message);
        } finally {
            setSaving(false);
        }
    }

    async function handleSaveCompetencia(itemId) {
        const { nota, observacao } = compMap[itemId] || {};
        try {
            const res = await fetch(`${API_ALUNOS}/${pid}/competencias`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId, nota, observacao: observacao || '' }),
            });
            if (!res.ok) throw new Error('Erro ao salvar competência');
            alert('Competência salva com sucesso!');
        } catch (err) {
            alert(err.message || 'Erro ao salvar competência');
        }
    }

    async function handleSaveDesempenho(itemId, periodo, valor) {
        try {
            const res = await fetch(`${API_ALUNOS}/${pid}/desempenho`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId, periodo, valor }),
            });
            if (!res.ok) throw new Error('Erro ao salvar desempenho');
            return res.json();
        } catch (err) {
            alert('Erro ao salvar desempenho');
        }
    }

    function setComp(itemId, field, value) {
        setCompMap(prev => ({
            ...prev,
            [itemId]: { ...prev[itemId], [field]: value },
        }));
    }

    function setDesempenho(itemId, periodo, value) {
        setDesempenhoMap(prev => ({
            ...prev,
            [itemId]: { ...prev[itemId], [periodo]: value },
        }));
        handleSaveDesempenho(itemId, periodo, value);
    }

    async function handleSaveNotas(notas) {
        const response = await fetch(`${API_ALUNOS}/${pid}/notas`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notas }),
        });
        
        if (!response.ok) throw new Error('Erro ao salvar notas');
        const data = await response.json();
        
        // Atualizar o estado do aluno
        setAluno(prev => ({ ...prev, notas: data.notas }));
        setFormData(prev => ({ ...prev, notas: data.notas }));
        
        return data;
    }

    if (loading) return <div className="loading-message">Carregando...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!aluno) return null;

    const temSala = aluno.salas && aluno.salas.length > 0;
    const competencias = competenciasAtivas;

    return (
        <div className="info-container">
            <div className="info-header">
                <button onClick={() => navigate(-1)} className="btn-voltar">← Voltar</button>
                <h1>{aluno.nome}</h1>
                {temSala && (
                    <div className="turmas-chips" style={{ display: 'inline-flex' }}>
                        {aluno.salas.map(s => (
                            <span key={s.sid} className="aluno-chip" style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/salas/${s.sid}`)}>
                                {s.nome}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="form-body">
                <div className="form-header">
                    <h2>Dados do Aluno</h2>
                    {editMode ? (
                        <div className="form-actions">
                            <button onClick={handleSaveAluno} disabled={saving} className="btn-salvar">
                                {saving ? 'Salvando...' : 'Salvar'}
                            </button>
                            <button onClick={() => { setEditMode(false); setFormData(aluno); }} className="btn-cancelar">
                                Cancelar
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setEditMode(true)} className="btn-editar">
                            <i className="bi bi-pencil" /> Editar
                        </button>
                    )}
                </div>

                <div className="form-grid">
                    <div className="form-input nome">
                        <label>Nome</label>
                        {editMode ? (
                            <input type="text" name="nome" value={formData.nome || ''} onChange={handleChange} />
                        ) : (
                            <span className="info-value">{aluno.nome || '—'}</span>
                        )}
                    </div>

                    <div className="form-input data">
                        <label>Data de Nascimento</label>
                        {editMode ? (
                            <input type="date" name="dataNascimento" value={formData.dataNascimento || ''} onChange={handleChange} />
                        ) : (
                            <span className="info-value">{aluno.dataNascimento || '—'}</span>
                        )}
                    </div>

                    <div className="form-input idade">
                        <label>Idade</label>
                        {editMode ? (
                            <span className="info-value">{aluno.idade || '—'}</span>
                        ) : (
                            <span className="info-value">{aluno.idade || '—'}</span>
                        )}
                    </div>

                    <div className="form-input sexo">
                        <label>Sexo</label>
                        {editMode ? (
                            <select name="sexo" value={formData.sexo || ''} onChange={handleChange}>
                                <option value="">Selecione...</option>
                                <option value="M">Masculino</option>
                                <option value="F">Feminino</option>
                            </select>
                        ) : (
                            <span className="info-value">
                                {aluno.sexo === 'M' ? 'Masculino' : aluno.sexo === 'F' ? 'Feminino' : aluno.sexo || '—'}
                            </span>
                        )}
                    </div>

                    <div className="form-input tel">
                        <label>Telefone</label>
                        {editMode ? (
                            <input type="tel" name="telefone" value={formData.telefone || ''} onChange={handleChange} />
                        ) : (
                            <span className="info-value">{aluno.telefone || '—'}</span>
                        )}
                    </div>

                    <div className="form-input pais">
                        <label>Responsáveis</label>
                        {editMode ? (
                            <>
                                <input type="text" name="nomePai1" placeholder="Responsável 1"
                                    value={formData.nomePai1 || ''} onChange={handleChange} />
                                <input type="text" name="nomePai2" placeholder="Responsável 2 (opcional)"
                                    value={formData.nomePai2 || ''} onChange={handleChange}
                                    style={{ marginTop: '8px' }} />
                            </>
                        ) : (
                            <span className="info-value">
                                {[aluno.nomePai1, aluno.nomePai2].filter(Boolean).join(' / ') || '—'}
                            </span>
                        )}
                    </div>

                    <div className="form-input end">
                        <label>Endereço</label>
                        {editMode ? (
                            <input type="text" name="endereco" value={formData.endereco || ''} onChange={handleChange} />
                        ) : (
                            <span className="info-value">{aluno.endereco || '—'}</span>
                        )}
                    </div>

                    <div className="form-input numero">
                        <label>Número</label>
                        {editMode ? (
                            <input type="text" name="numero" value={formData.numero || ''} onChange={handleChange} />
                        ) : (
                            <span className="info-value">{aluno.numero || '—'}</span>
                        )}
                    </div>
    
                </div>
            </div>

            <br />

            <h2>Competências</h2>
            {!temSala ? (
                <div className="item-list empty" style={{ marginTop: '1rem' }}>
                    <label>Este aluno ainda não está matriculado em nenhuma sala. As competências serão exibidas quando uma sala for designada.</label>
                </div>
            ) : competencias ? (
                <div className="competencias-container">
                    {competencias.map(comp => {
                        const isOpen = expandedC === comp.id;

                        return (
                            <div key={comp.id} className="competencia-card">
                                <div className="competencia-header" onClick={() => setExpandedC(isOpen ? null : comp.id)}>
                                    <div className="competencia-titulo-area">
                                        <span className="competencia-numero">{comp.titulo}</span>
                                    </div>
                                    <div className={`competencia-arrow ${isOpen ? 'expanded' : ''}`}>▼</div>
                                </div>

                                <div className={`competencia-subitens ${isOpen ? 'show' : ''}`}>
                                    {comp.itens.map(item => {
                                        const key = `${comp.id}-${item.id}`;
                                        const isSubOpen = expandedSub[key];
                                        const saved = compMap[item.id] || {};

                                        return (
                                            <div key={item.id} className="subitem-container">
                                                <div className="subitem-header" onClick={() => setExpandedSub(p => ({ ...p, [key]: !p[key] }))}>
                                                    <span className="subitem-id">{item.id}</span>
                                                    <span className="subitem-texto">{item.texto}</span>
                                                    {saved.nota && (
                                                        <span className={`comp-nota comp-nota-${saved.nota.toLowerCase()}`}>
                                                            {saved.nota === 'S' ? 'Satisfatório' : saved.nota === 'PS' ? 'Parcial' : 'Não Satisfatório'}
                                                        </span>
                                                    )}
                                                    <div className={`subitem-arrow ${isSubOpen ? 'expanded' : ''}`}>▼</div>
                                                </div>

                                                <div className={`subitem-avaliacao ${isSubOpen ? 'show' : ''}`}>
                                                    <div className="avaliacao-content">
                                                        <div className="avaliacao-opcoes">
                                                            {['S', 'PS', 'NS'].map(opcao => (
                                                                <label key={opcao} className="avaliacao-label">
                                                                    <input
                                                                        type="radio"
                                                                        name={`${item.id}-avaliacao`}
                                                                        value={opcao}
                                                                        checked={saved.nota === opcao}
                                                                        onChange={() => setComp(item.id, 'nota', opcao)}
                                                                    />
                                                                    {opcao === 'S' && 'Satisfatório'}
                                                                    {opcao === 'PS' && 'Parcialmente Satisfatório'}
                                                                    {opcao === 'NS' && 'Não Satisfatório'}
                                                                </label>
                                                            ))}
                                                        </div>

                                                        <textarea
                                                            className="avaliacao-obs"
                                                            placeholder="Observações (opcional)..."
                                                            rows="2"
                                                            value={saved.observacao || ''}
                                                            onChange={e => setComp(item.id, 'observacao', e.target.value)}
                                                        />
                                                        <button className="btn-salvar-comp" onClick={() => handleSaveCompetencia(item.id)}>
                                                            Salvar Avaliação
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : null}

            <br />

            <h2>{REGISTRO_DESEMPENHO.titulo}</h2>
            <div className="desempenho-container">
                {REGISTRO_DESEMPENHO.secoes.map((secao, idx) => {
                    const isOpen = expandedDesempenho[idx] || false;

                    return (
                        <div key={idx} className="competencia-card">
                            <div className="competencia-header" onClick={() => 
                                setExpandedDesempenho(prev => ({ ...prev, [idx]: !prev[idx] }))
                            }>
                                <div className="competencia-titulo-area">
                                    <span className="competencia-numero">
                                        {secao.titulo || (secao.subtitulo || 'Competências')}
                                    </span>
                                    {secao.subtitulo && (
                                        <span className="competencia-descricao">{secao.subtitulo}</span>
                                    )}
                                </div>
                                <div className={`competencia-arrow ${isOpen ? 'expanded' : ''}`}>▼</div>
                            </div>

                            <div className={`competencia-subitens ${isOpen ? 'show' : ''}`}>
                                {secao.itens.map((item) => {
                                    const saved = desempenhoMap[item.id] || {};
                                    const isProjeto = item.isProjeto || false;

                                    return (
                                        <div key={item.id} className={`subitem-container ${isProjeto ? 'projeto-container' : ''}`}>
                                            <div className="subitem-header" style={{ cursor: 'default' }}>
                                                <span className="subitem-texto" style={{ fontWeight: item.isCompetencia ? '600' : 'normal' }}>
                                                    {item.texto}
                                                </span>
                                            </div>

                                            <div className="desempenho-periodos">
                                                {isProjeto ? (
                                                    <div className="projeto-periodos">
                                                        <div className="periodo-item">
                                                            <label>1º Período</label>
                                                            <textarea
                                                                rows="2"
                                                                value={saved.periodo1 || ''}
                                                                onChange={e => setDesempenho(item.id, 'periodo1', e.target.value)}
                                                                placeholder="Descreva o projeto..."
                                                            />
                                                        </div>
                                                        <div className="periodo-item">
                                                            <label>2º Período</label>
                                                            <textarea
                                                                rows="2"
                                                                value={saved.periodo2 || ''}
                                                                onChange={e => setDesempenho(item.id, 'periodo2', e.target.value)}
                                                                placeholder="Descreva o projeto..."
                                                            />
                                                        </div>
                                                        <div className="periodo-item">
                                                            <label>3º Período</label>
                                                            <textarea
                                                                rows="2"
                                                                value={saved.periodo3 || ''}
                                                                onChange={e => setDesempenho(item.id, 'periodo3', e.target.value)}
                                                                placeholder="Descreva o projeto..."
                                                            />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="desempenho-opcoes">
                                                        <div className="periodo-item">
                                                            <label>1º Período</label>
                                                            <select
                                                                value={saved.periodo1 || ''}
                                                                onChange={e => setDesempenho(item.id, 'periodo1', e.target.value)}
                                                            >
                                                                <option value="">Selecione...</option>
                                                                <option value="A">Atingiu</option>
                                                                <option value="PA">Parcialmente Atingiu</option>
                                                                <option value="NA">Não Atingiu</option>
                                                            </select>
                                                        </div>
                                                        <div className="periodo-item">
                                                            <label>2º Período</label>
                                                            <select
                                                                value={saved.periodo2 || ''}
                                                                onChange={e => setDesempenho(item.id, 'periodo2', e.target.value)}
                                                            >
                                                                <option value="">Selecione...</option>
                                                                <option value="A">Atingiu</option>
                                                                <option value="PA">Parcialmente Atingiu</option>
                                                                <option value="NA">Não Atingiu</option>
                                                            </select>
                                                        </div>
                                                        <div className="periodo-item">
                                                            <label>3º Período</label>
                                                            <select
                                                                value={saved.periodo3 || ''}
                                                                onChange={e => setDesempenho(item.id, 'periodo3', e.target.value)}
                                                            >
                                                                <option value="">Selecione...</option>
                                                                <option value="A">Atingiu</option>
                                                                <option value="PA">Parcialmente Atingiu</option>
                                                                <option value="NA">Não Atingiu</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
            <br />

            <h2>Notas</h2>
            <div className="form-body">
                <NotasEditor
                    valorInicial={aluno.notas || ''}
                    onSave={handleSaveNotas}
                    placeholder="Digite suas anotações sobre este aluno..."
                    label="Anotações sobre o aluno "
                />
            </div>
            
        </div>
    );
}