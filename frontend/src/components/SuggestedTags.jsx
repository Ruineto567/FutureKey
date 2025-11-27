import { useState } from "react";
import "../styles/SuggestedTags.css";

const TAGS_POR_CATEGORIA = {
  escola: [
   "#aprendizado", "#aprendizadododia", "#aprendizadoincrivel", "#aprendizadoonline", "#aprendizadotips", "#auladodia", "#aulalove", "#aulareal", "#conteudoaprendizado", "#conteudoescola", "#conteudopedagogia", "#conteudoprofessores", "#dicasdeensino", "#dicasdeescola", "#educacao", "#educacao2024", "#educacaobrasil", "#educacaolife", "#educacaonews", "#ensinolove", "#escola", "#escola2024", "#escolabrasil", "#escolainspiracao", "#mundodeensino", "#mundodeescola", "#mundodeprofessores", "#novidadesaula", "#novidadesensino", "#novidadespedagogia", "#novidadesprofessores", "#pedagogia", "#pedagogia2024", "#pedagogiabrasil", "#pedagogialove", "#pedagogiareal", "#professores", "#professores2024", "#professoreslove", "#professorestips", "#rotinapedagogia", "#sobreprofessores", "#topalunos", "#topeducacao", "#vidadealunos", "#vidadeensino"
  ],
  marketing: [
    "#amoconteudodigital", "#amosocialmedia", "#apaixonadoporestrategiadigital", "#apaixonadoporsocialmedia", "#apaixonadoportrafego", "#brandinginspiracao", "#brandingnews", "#conteudobranding", "#conteudodigital2024", "#conteudodigitalbrasil", "#conteudodigitalreal", "#conteudodigitalstyle", "#copywriting2024", "#copywritingdodia", "#copywritinglife", "#copywritingnews", "#copywritingstyle", "#copywritingtips", "#dicasdebranding", "#estrategiadigital", "#estrategiadigitalincrivel", "#estrategiadigitallife", "#estrategiadigitalonline", "#marketingdigitalincrivel", "#marketingdigitalonline", "#marketingdigitaltips", "#mundodebranding", "#mundodeconteudodigital", "#mundodecopywriting", "#novidadesbranding", "#novidadesconteudodigital", "#novidadesmarketingdigital", "#rotinaconteudodigital", "#rotinaestrategiadigital", "#sobreconteudodigital", "#sobretrafego", "#socialmedia2024", "#socialmediaonline"
  ],
  negocios: [
    "#amobusiness", "#amostartup", "#apaixonadoporgestao", "#apaixonadopornegocios", "#apaixonadoporvendas", "#business2024", "#businessbrasil", "#businessinspiracao", "#businesslife", "#businessnews", "#conteudobusiness", "#conteudoempreendedorismo", "#conteudolideranca", "#dicasdeempresa", "#dicasdegestao", "#empreendedorismolove", "#empreendedorismonews", "#empresabrasil", "#empresaonline", "#gestaoincrivel", "#gestaonews", "#gestaostyle", "#liderancabrasil", "#liderancaonline", "#liderancareal", "#liderancatips", "#mundodeempresa", "#mundodelideranca", "#mundodevendas", "#negociosdodia", "#negociosincrivel", "#negocioslife", "#negociosonline", "#negociosstyle",
  ],
  tecnologia: [
    "#amoia", "#amointeligenciaartificial", "#amotecnologia", "#apaixonadoporautomacao", "#apaixonadoporinteligenciaartificial", "#apaixonadoporstartups", "#automacaobrasil", "#automacaoincrivel", "#automacaolife", "#automacaolove", "#conteudoia", "#conteudostartups", "#dicasdeautomacao", "#dicasdefuturodigital", "#dicasdeinovacao", "#dicasdestartups", "#futurodigitaldodia", "#futurodigitalincrivel", "#futurodigitallife", "#futurodigitalonline", "#futurodigitalreal", "#iabrasil", "#ialife", "#iaonline", "#inovacao2024", "#inovacaobrasil", "#inovacaododia", "#inovacaoincrivel", "#inovacaoinspiracao"
  ],
  moda: [
    "#amobeleza", "#amolookdodia", "#apaixonadoporbeleza", "#apaixonadoporroupas", "#beleza2024", "#belezabrasil", "#conteudofashion", "#conteudotendencias", "#dicasdefashion", "#dicasdelookdodia", "#dicasderoupas", "#estilo2024", "#estilobrasil", "#estilolove", "#fashionincrivel", "#fashioninspiracao", "#fashionlove", "#fashionnews", "#fashionstyle", "#lookdodia", "#lookdodiadodia", "#lookdodiaincrivel", "#lookdodiainspiracao", "#lookdodialove", "#lookdodiatips", "#moda", "#moda2024", "#modabrasil", "#modanews", "#modastyle", "#modatips", "#mundodelookdodia", "#novidadesfashion", "#novidadestendencias", "#rotinaroupas", "#roupas", "#roupasdodia", "#roupasreal", "#roupasstyle", "#sobrebeleza", "#sobrefashion", "#sobrelookdodia", "#sobretendencias", "#tendenciasbrasil"
  ],
  saude: [
    "#amosaudemental", "#apaixonadopornutricao", "#bemestar2024", "#bemestardodia", "#bemestarlife", "#bemestarlove", "#bemestarreal", "#bemestartips", "#conteudoexercicio", "#conteudoqualidadedevida", "#conteudovidasaudavel", "#dicasdevidasaudavel", "#exercicio", "#exercicio2024", "#exercicionews", "#exercicioonline", "#exerciciotips", "#mundodebemestar", "#mundodenutricao", "#novidadesbemestar", "#novidadesnutricao", "#novidadesvidasaudavel", "#nutricao", "#nutricao2024", "#nutricaoincrivel", "#nutricaolove", "#nutricaoreal", "#nutricaotips", "#qualidadedevidaincrivel", "#qualidadedevidalife", "#qualidadedevidanews", "#rotinanutricao", "#rotinasaudemental", "#saude", "#saudeincrivel", "#saudelife", "#saudelove", "#saudementalinspiracao", "#saudementallove", "#saudementaltips", "#saudetips", "#sobreexercicio", "#sobresaudemental"
  ],
  fitness: [
    "#academia2024", "#academialove", "#amofitness", "#apaixonadopormusculacao", "#apaixonadoportreino", "#conteudofoco", "#dicasdefoco", "#emagrecimento", "#emagrecimentobrasil", "#emagrecimentolife", "#emagrecimentolove", "#emagrecimentonews", "#fit", "#fitdodia", "#fitincrivel", "#fitinspiracao", "#fitlove", "#fitnessinspiracao", "#fitnesslove", "#fitnessnews", "#fitnessreal", "#fitnessstyle", "#fitnesstips", "#fitonline", "#focobrasil", "#focododia", "#focoincrivel", "#focoinspiracao", "#focolove", "#focoreal", "#focostyle", "#mundodefit", "#mundodefitness", "#mundodefoco", "#mundodemusculacao", "#mundodetreino", "#musculacao2024", "#musculacaoreal", "#novidadesfitness", "#novidadesmusculacao"
  ],
  educacao: [
    "#amoead", "#amoformacao", "#apaixonadoporaulasonline", "#apaixonadoporead", "#apaixonadoporformacao", "#aprendizagemnews", "#aprendizagemtips", "#aulasonline2024", "#aulasonlineincrivel", "#conteudoaulasonline", "#conteudoeducacaoinfantil", "#dicasdeaulasonline", "#dicasdeead", "#dicasdeeducadores", "#dicasdeformacao", "#ead", "#eadbrasil", "#eadincrivel", "#eadinspiracao", "#eadlife", "#eadlove", "#eadnews", "#educacaoinfantil", "#educacaoinfantillife", "#educacaoinfantillove", "#educacaoinfantilstyle", "#educacaoinfantiltips", "#educadores", "#educadoresincrivel", "#educadoreslife", "#ensinoremoto", "#ensinoremotobrasil", "#ensinoremotolife", "#ensinoremotoreal", "#formacao", "#formacaododia", "#formacaoincrivel", "#formacaolove", "#formacaoreal", "#formacaotips", "#mundodeaulasonline", "#rotinaead", "#sobreaprendizagem", "#sobreaulasonline"
  ],
  arte: [
    "#amoarte", "#amoilustracao", "#apaixonadoporartedigital", "#apaixonadopordesigngrafico", "#arte", "#artebrasil", "#artedigital", "#artedigital2024", "#artedodia", "#artelove", "#artenews", "#arteonline", "#conteudoarte", "#conteudoartedigital", "#conteudodesigngrafico", "#conteudoilustracao", "#conteudopintura", "#criatividade", "#criatividadelove", "#criatividadereal", "#designgraficobrasil", "#designgraficoincrivel", "#designgraficonews", "#designgraficostyle", "#dicasdearte", "#dicasdedesigngrafico", "#ilustracao", "#ilustracao2024", "#ilustracaododia", "#ilustracaolove", "#ilustracaoonline", "#mundodedesigngrafico", "#mundodeilustracao", "#novidadesartedigital", "#novidadesdesigngrafico", "#novidadesilustracao", "#pintura", "#pintura2024", "#pinturabrasil", "#pinturalife"
  ],
  fotografia: [
    "#amophotography", "#apaixonadoporfotografiadigital", "#apaixonadoporphotography", "#conteudofotografiadigital", "#dicasdefoto", "#dicasdefotografia", "#dicasdefotografiaprofissional", "#dicasderetratos", "#foto2024", "#fotododia", "#fotografiabrasil", "#fotografiadigital", "#fotografiadigitalincrivel", "#fotografiadigitallove", "#fotografiadigitalnews", "#fotografiadigitalonline", "#fotografiaincrivel", "#fotografialife", "#fotografiaprofissionalincrivel", "#fotografiaprofissionalnews", "#fotoonline", "#fotoreal", "#fototips", "#mundodefotografia", "#mundodefotografiaprofissional", "#mundodephotography", "#novidadesfotografiaprofissional", "#novidadesphotography", "#photographydodia", "#photographyincrivel", "#photographynews"
  ],
  viagens: [
    "#amonatureza", "#apaixonadoporaventura", "#apaixonadoporturismo", "#aventura", "#aventura2024", "#aventurabrasil", "#aventuralife", "#conteudoaventura", "#conteudoviagem", "#dicasdetrip", "#dicasdeviajar", "#mochilao2024", "#mochilaoinspiracao", "#mochilaolife", "#mochilaoreal", "#mundodeaventura", "#mundodeturismo", "#mundodeviagem", "#natureza", "#naturezalife", "#naturezanews", "#naturezaonline", "#novidadesaventura", "#novidadesmochilao", "#novidadestrip", "#novidadesturismo", "#rotinaaventura", "#rotinamochilao", "#rotinaviajar", "#sobreviagem", "#sobreviajar", "#topmochilao", "#topturismo", "#topviagem", "#trip", "#tripincrivel", "#turismo", "#turismobrasil", "#turismoincrivel", "#turismonews"
  ],
  musica: [
    "#amoinstrumental", "#amomusicabrasileira", "#amoshow", "#apaixonadopormusicabrasileira", "#cantordodia", "#cantorincrivel", "#compositorinspiracao", "#compositorlove", "#compositorreal", "#conteudomusica", "#conteudoplaylists", "#dicasdecantor", "#instrumental", "#instrumental2024", "#instrumentalbrasil", "#instrumentaldodia", "#instrumentalnews", "#instrumentalreal", "#mundodeinstrumental", "#mundodemusica", "#musicabrasileiradodia", "#musicabrasileiralife", "#musicabrasileiranews", "#musicabrasileiraonline", "#musicabrasileirareal", "#musicabrasileiratips", "#musicadodia", "#musicalove", "#musicastyle", "#musicatips", "#novidadescantor", "#novidadescompositor", "#novidadesinstrumental", "#novidadesplaylists", "#playlists2024", "#playlistsinspiracao", "#playlistsonline", "#rotinacantor", "#rotinamusicabrasileira", "#showincrivel", "#showlove"
  ],
  gastronomia: [
    "#amochef", "#amocomida", "#amogastronomia", "#apaixonadoporchef", "#apaixonadoporgastronomia", "#apaixonadoporreceitas", "#chef2024", "#chefdodia", "#chefincrivel", "#cheflove", "#comida2024", "#comidaincrivel", "#comidainspiracao", "#comidalife", "#comidareal", "#conteudochef", "#conteudorestaurante", "#cozinha", "#cozinha2024", "#cozinhainspiracao", "#cozinhanews", "#cozinhareal", "#cozinhastyle", "#cozinhatips", "#culinarialife", "#culinariareal", "#dicasdechef", "#dicasdecomida", "#dicasdeculinaria", "#gastronomia2024", "#gastronomialife", "#gastronomialove", "#gastronomianews", "#gastronomiareal", "#mundodegastronomia", "#novidadescomida", "#receitasincrivel", "#receitaslife", "#receitaslove", "#restaurante", "#restaurantedodia"
  ],
  pets: [
    "#amoamorpelosanimais", "#amorpelosanimaisonline", "#amorpelosanimaisreal", "#amovidadepet", "#animais", "#animaisbrasil", "#animaisonline", "#apaixonadoporanimais", "#apaixonadoporpetlover", "#apaixonadoporvidadepet", "#cats", "#catsinspiracao", "#catsnews", "#conteudoanimais", "#conteudocats", "#conteudopets", "#dicasdepetlover", "#dicasdepets", "#dogs2024", "#dogsdodia", "#dogslife", "#dogsreal", "#dogstips", "#mundodeamorpelosanimais", "#mundodecats", "#mundodedogs", "#mundodepetlover", "#mundodepets", "#novidadesanimais", "#novidadescats", "#novidadespetlover", "#petloverbrasil", "#petloverincrivel", "#petloverlife", "#petloveronline", "#petsbrasil", "#petsdodia", "#petsincrivel", "#petslove", "#petsnews"
  ],
  memes: [
    "#amodiversao", "#amopiadas", "#apaixonadoporpiadas", "#conteudomemes", "#dicasdeengracado", "#diversao2024", "#diversaobrasil", "#diversaoincrivel", "#diversaolove", "#diversaonews", "#diversaoreal", "#diversaotips", "#engracadoincrivel", "#engracadonews", "#humor2024", "#humorinspiracao", "#humorlife", "#humortips", "#memesbrasil", "#memesincrivel", "#memeslove", "#memesonline", "#memesstyle", "#memestips", "#mundodeengracado", "#mundodememes", "#novidadesdiversao", "#novidadesmemes", "#novidadespiadas", "#piadas2024", "#piadaslife", "#piadaslove", "#piadastips", "#rotinamemes", "#rotinaviralizou", "#sobrediversao", "#topengracado", "#tophumor", "#topmemes", "#toppiadas", "#vidadeengracado", "#vidadememes", "#vidadeviralizou", "#viralizou2024", "#viralizouincrivel", "#viralizounews"
  ],
  carros: [
    "#amoautomoveis", "#amocarros", "#amoveiculos", "#apaixonadoporautomoveis", "#apaixonadoporcarrosesportivos", "#auto2024", "#autododia", "#autoinspiracao", "#autolife", "#autolove", "#automoveislove", "#automoveisnews", "#automoveistips", "#autostyle", "#carros2024", "#carrosesportivos2024", "#carrosesportivosdodia", "#carrosesportivoslife", "#carrosesportivosreal", "#carroslove", "#carrosnews", "#conteudoauto", "#conteudoveiculos", "#dicasdecarrosesportivos", "#dicasdemotor", "#motorbrasil", "#motorincrivel", "#motorlife", "#motorlove", "#motorreal", "#motortips", "#mundodeauto", "#mundodecarrosesportivos", "#mundoderacing", "#novidadescarros", "#racingincrivel", "#racinglife", "#racinglove", "#racingstyle", "#rotinaveiculos", "#sobrecarrosesportivos", "#sobremotor", "#topauto", "#topmotor"
  ],
  esportes: [
    "#amocorrida", "#amoesporteesaude", "#apaixonadoporbasquete", "#apaixonadoporcorrida", "#apaixonadoporesportes", "#atletabrasil", "#atletaonline", "#basquete", "#basquete2024", "#basquetedodia", "#basqueteinspiracao", "#basquetelove", "#basquetenews", "#basqueteonline", "#basquetereal", "#basquetestyle", "#conteudoatleta", "#conteudobasquete", "#conteudocorrida", "#conteudoesporteesaude", "#corridainspiracao", "#corridalife", "#dicasdeesportes", "#dicasdefutebol", "#esporteesaudedodia", "#esporteesaudeincrivel", "#esporteesaudeonline", "#esportenatvbrasil", "#esportenatvinspiracao", "#esportenatvnews", "#esportenatvstyle", "#esporteslove", "#esportesonline", "#esportesstyle", "#esportestips", "#futeboldodia", "#futebollife", "#futebolnews", "#mundodeatleta", "#mundodebasquete", "#mundodeesportes"
  ],
  financas: [
    "#amofinancas", "#amoplanejamentofinanceiro", "#amorendaextra", "#apaixonadoporeducacaofinanceira", "#apaixonadoporplanejamentofinanceiro", "#conteudoeducacaofinanceira", "#dicasdeeducacaofinanceira", "#dicasderendaextra", "#dinheiro2024", "#dinheirododia", "#dinheiroincrivel", "#dinheiroinspiracao", "#educacaofinanceira", "#educacaofinanceirabrasil", "#educacaofinanceiradodia", "#educacaofinanceiraincrivel", "#educacaofinanceiralove", "#educacaofinanceirareal", "#educacaofinanceirastyle", "#educacaofinanceiratips", "#financaslife", "#financaslove", "#financastips", "#investimentosincrivel", "#investimentoslife", "#investimentosnews", "#investimentosreal", "#investimentostips", "#mundodedinheiro", "#mundodeeducacaofinanceira", "#mundoderendaextra", "#novidadesdinheiro", "#novidadesplanejamentofinanceiro", "#planejamentofinanceiro2024", "#planejamentofinanceirobrasil", "#planejamentofinanceirolove", "#planejamentofinanceiroonline", "#planejamentofinanceirostyle", "#rendaextra2024", "#rendaextraincrivel", "#rendaextrareal"
  ],
  beleza: [
    "#amobeleza", "#amoskincare", "#apaixonadoporautoestima", "#apaixonadoporcuidadoscomapele", "#apaixonadoporskincare", "#autoestimadodia", "#autoestimainspiracao", "#autoestimalife", "#autoestimareal", "#beleza2024", "#belezabrasil", "#belezainspiracao", "#belezalife", "#belezaonline", "#belezareal", "#belezastyle", "#belezatips", "#conteudobeleza", "#conteudodicasdebeleza", "#conteudomaquiagem", "#conteudoskincare", "#cuidadoscomapele2024", "#cuidadoscomapelebrasil", "#cuidadoscomapeledodia", "#cuidadoscomapeleinspiracao", "#cuidadoscomapelenews", "#cuidadoscomapelestyle", "#dicasdebeleza", "#dicasdebelezabrasil", "#dicasdebelezanews", "#dicasdedicasdebeleza", "#maquiagembrasil", "#maquiageminspiracao", "#maquiagemlife", "#maquiagemlove", "#maquiagemonline", "#maquiagemreal", "#novidadesskincare", "#rotinaskincare", "#skincare", "#skincarelife", "#skincarenews", "#skincareonline"
  ],
  livros: [
    "#amobiblioteca", "#amolerbrasil", "#amolerlife", "#amoresenhas", "#apaixonadoporamoler", "#apaixonadoporautor", "#apaixonadoporbiblioteca", "#apaixonadoporbooklover", "#apaixonadoporleitura", "#apaixonadoporresenhas", "#autorbrasil", "#autornews", "#biblioteca2024", "#bibliotecabrasil", "#bibliotecaincrivel", "#bibliotecainspiracao", "#booklover", "#booklover2024", "#bookloverdodia", "#bookloverinspiracao", "#bookloverreal", "#conteudoamoler", "#conteudobooklover", "#conteudoresenhas", "#dicasdebooklover", "#dicasdelivros", "#leituraincrivel", "#leituralife", "#leituralove", "#leituraonline", "#livros", "#livros2024", "#livroslove", "#livrosnews", "#mundodeautor", "#mundodebooklover", "#mundodelivros", "#novidadesautor", "#novidadesleitura", "#novidadesresenhas", "#resenhasdodia"
  ]
};

export default function SuggestedTags() {
  const [categoria, setCategoria] = useState("");

  return (
    <div className="panel suggested-tags">
      <div className="panel-title">📌 Sugestões de Hashtags</div>

      {/* Campo de seleção */}
      <select
        className="tag-select"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
      >
        <option value="">Selecione uma categoria</option>
        {Object.keys(TAGS_POR_CATEGORIA).map((cat) => (
          <option key={cat} value={cat}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </option>
        ))}
      </select>

      {/* Exibe as tags apenas se houver categoria selecionada */}
      {categoria && (
        <div className="tag-list">
          {TAGS_POR_CATEGORIA[categoria].map((tag) => (
            <span key={tag} className="tag-item">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
