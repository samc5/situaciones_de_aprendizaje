import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';

// --- TYPES ---
interface Criteria {
  '0': string;
  '1': string;
  '2': string;
  '3': string;
  '4': string;
}

interface CompetencyItem {
  competency: string;
  related_descriptor_codes: string[];
}

interface Activity {
  title: string;
  description: string;
  duration: number;
  sessions: number;
  competencies: CompetencyItem[];
  knowledge: string[];
  AInara?: string[];
  Criteria: Criteria;
}

interface LessonPlan {
  language: string;
  title: string;
  context: string;
  justification: string;
  agelvl: 'infantil' | 'primaria' | 'secundaria' | 'bachillerato';
  SDG?: string[];
  activity1: Activity;
  activity2?: Activity;
  activity3?: Activity;
  activity4?: Activity;
  activity5?: Activity;
}

// --- DATA ---
const lessonData: LessonPlan = {
  "language": "es",
  "title": "Un Viaje Animal a Través del Tiempo",
  "context": "Esta situación de aprendizaje invita a los estudiantes a un fascinante recorrido por la historia del reino animal. Aprenderán vocabulario en español sobre animales de diferentes épocas, desde los dinosaurios hasta las especies descubiertas recientemente, conectando el aprendizaje de la lengua con la ciencia y la historia.",
  "justification": "Esta propuesta integra el aprendizaje del español en un contexto interdisciplinar y motivador. Al explorar la evolución de los animales, los alumnos no solo amplían su léxico, sino que también desarrollan su curiosidad científica, su comprensión histórica y su conciencia sobre la conservación del medio ambiente, fomentando un aprendizaje competencial y significativo.",
  "agelvl": "primaria",
  "SDG": [ "4", "15" ],
  "activity1": {
    "title": "Gigantes del Pasado: Los Dinosaurios",
    "description": "Los estudiantes se introducirán en la era prehistórica y aprenderán los nombres en español de varios dinosaurios (Tiranosaurio Rex, Triceratops, Velociraptor). Crearán sus propias tarjetas de vocabulario (flashcards) con el nombre del dinosaurio y un dibujo, practicando la pronunciación y la escritura de las nuevas palabras.",
    "duration": 60,
    "sessions": 1,
    "competencies": [
      {
        "competency": "Comprender e interpretar textos orales y multimodales, reconociendo la intención comunicativa y las ideas principales.",
        "related_descriptor_codes": ["CCL2", "CCL5"]
      },
      {
        "competency": "Identificar y describir seres vivos, materiales y elementos del entorno, estableciendo relaciones básicas entre ellos.",
        "related_descriptor_codes": ["STEM2"]
      },
      {
        "competency": "Explorar y experimentar con diferentes materiales, herramientas y técnicas artísticas para expresar emociones, ideas y vivencias.",
        "related_descriptor_codes": ["CEC2", "CPSAA1"]
      },
      {
        "competency": "Mostrar interés por conocer otras lenguas y culturas, valorando la diversidad lingüística y cultural.",
        "related_descriptor_codes": ["CP3", "CC1"]
      }
    ],
    "knowledge": [
        "Vocabulario básico sobre dinosaurios y prehistoria.",
        "Uso de herramientas analógicas para la creación artística.",
        "Estrategias básicas de comprensión oral."
    ],
    "AInara": [ "[image]", "[document]", "[quiz]", "[wordssearch]" ],
    "Criteria": {
      "0": "No realiza la actividad.",
      "1": "Sus tarjetas están incompletas o son incorrectas, y muestra poca participación en el aprendizaje del vocabulario.",
      "2": "Crea tarjetas sencillas, con algunos errores, y participa de forma limitada en las actividades orales.",
      "3": "Crea tarjetas correctas y participa adecuadamente en la actividad de repetición y aprendizaje del vocabulario.",
      "4": "Crea tarjetas detalladas y correctas, participa activamente y utiliza las nuevas palabras en español para describir a los dinosaurios."
    }
  },
  "activity2": {
    "title": "La Era de los Mamíferos",
    "description": "Esta actividad se centra en la Era Cenozoica. Los estudiantes aprenderán los nombres en español de mamíferos prehistóricos (mamut, tigre dientes de sable) y mamíferos modernos tempranos. En grupos, crearán un pequeño diorama o mural que muestre a estos animales en su hábitat.",
    "duration": 60,
    "sessions": 1,
    "competencies": [
      {
        "competency": "Comprender hechos, procesos y cambios sociales y geográficos del entorno próximo y del mundo.",
        "related_descriptor_codes": ["CC1", "STEM3", "CD1"]
      },
      {
        "competency": "Identificar y describir seres vivos, materiales y elementos del entorno, estableciendo relaciones básicas entre ellos.",
        "related_descriptor_codes": ["STEM2"]
      },
      {
        "competency": "Crear producciones artísticas individuales y colectivas mostrando creatividad, cuidado y respeto.",
        "related_descriptor_codes": ["CEC2", "CE1"]
      },
      {
        "competency": "Producir textos orales coherentes y adecuados, participando activamente en situaciones comunicativas.",
        "related_descriptor_codes": ["CCL1", "CCL5"]
      }
    ],
    "knowledge": [
        "Clasificación básica de mamíferos.",
        "Trabajo cooperativo y roles en el grupo.",
        "Técnicas plásticas para la representación tridimensional."
    ],
    "AInara": [ "[image]", "[document]", "[relations]" ],
    "Criteria": {
      "0": "No participa en la actividad.",
      "1": "Apenas colabora con su grupo, el mural está incompleto y tiene dificultades para recordar el vocabulario.",
      "2": "Muestra alguna dificultad para colaborar, el mural es simple o tiene imprecisiones y nombra solo algunos animales.",
      "3": "Colabora bien en su grupo, el mural es correcto y puede nombrar la mayoría de los animales en español.",
      "4": "Colabora excelentemente en su grupo, crea un mural detallado y preciso, y puede nombrar y describir a los animales en español."
    }
  },
  "activity3": {
    "title": "Compañeros de Viaje: Animales y Civilizaciones",
    "description": "Los estudiantes exploran el papel de los animales en la historia de la humanidad (domesticación, transporte, símbolos). En grupos, elegirán una civilización y un animal importante para ella, investigarán y prepararán una breve presentación oral para la clase usando el vocabulario aprendido.",
    "duration": 120,
    "sessions": 2,
    "competencies": [
      {
        "competency": "Comprender hechos, procesos y cambios sociales y geográficos del entorno próximo y del mundo.",
        "related_descriptor_codes": ["CC1", "STEM3", "CD1"]
      },
      {
        "competency": "Movilizar estrategias de búsqueda, selección y análisis crítico de información en diferentes soportes.",
        "related_descriptor_codes": ["CD1", "CCL3"]
      },
      {
        "competency": "Producir textos orales coherentes y adecuados, participando activamente en situaciones comunicativas.",
        "related_descriptor_codes": ["CCL1", "CCL5"]
      },
      {
        "competency": "Participar en la planificación y realización de proyectos cooperativos relacionados con el entorno social y natural.",
        "related_descriptor_codes": ["CE1", "CC3", "CPSAA5"]
      }
    ],
    "knowledge": [
        "Relación entre ser humano y animales en la historia.",
        "Uso de fuentes de información sencillas.",
        "Estructura de una presentación oral básica."
    ],
    "AInara": [ "[text]", "[document]", "[audios]" ],
    "Criteria": {
      "0": "No realiza la presentación.",
      "1": "La investigación es mínima, la presentación está desorganizada y comete errores significativos de vocabulario.",
      "2": "La investigación es básica, la presentación es algo confusa y comete algunos errores de vocabulario.",
      "3": "La investigación es adecuada y la presentación es clara, con un uso mayoritariamente correcto del vocabulario.",
      "4": "Realiza una investigación exhaustiva y una presentación clara y atractiva, utilizando correctamente el vocabulario en español."
    }
  },
  "activity4": {
    "title": "Nuevos Descubrimientos y Nuestro Futuro",
    "description": "La actividad final se centra en especies descubiertas recientemente y la importancia de la conservación. Los alumnos aprenderán vocabulario en español relacionado (proteger, conservar, especie en peligro). Crearán un póster o una historia digital sobre un animal en peligro de extinción, explicando por qué es importante protegerlo.",
    "duration": 60,
    "sessions": 1,
    "competencies": [
       {
        "competency": "Participar en acciones de cuidado del entorno y uso sostenible de los recursos naturales.",
        "related_descriptor_codes": ["STEM5", "CC3"]
      },
      {
        "competency": "Promover el cuidado del entorno y el uso sostenible de los recursos mediante acciones responsables.",
        "related_descriptor_codes": ["STEM5", "CC3"]
      },
      {
        "competency": "Producir textos escritos coherentes, con distintas finalidades comunicativas, utilizando recursos básicos.",
        "related_descriptor_codes": ["CCL1", "CCL3"]
      },
      {
        "competency": "Comprender e interpretar textos orales, escritos y multimodales de creciente complejidad.",
        "related_descriptor_codes": ["CCL2", "CCL3"]
      }
    ],
    "knowledge": [
        "Conceptos de conservación y sostenibilidad.",
        "Vocabulario de ecología básico.",
        "Herramientas digitales para la creación de contenidos."
    ],
    "AInara": [ "[multiformat]", "[image]", "[document]" ],
    "Criteria": {
      "0": "No completa la actividad.",
      "1": "El trabajo está incompleto, el mensaje no se transmite y presenta errores significativos en español.",
      "2": "Su trabajo es básico, el mensaje de conservación es poco claro y contiene varios errores.",
      "3": "Crea un buen trabajo que comunica el mensaje principal, con pequeños errores en el uso del español.",
      "4": "Crea un trabajo creativo e informativo, que comunica claramente el mensaje de conservación utilizando un español correcto y apropiado."
    }
  }
};

// --- CONSTANTS ---
const SDG_INFO: { [key: string]: { name: string; color: string; emoji: string } } = {
  '4': { name: 'Quality Education', color: 'bg-red-500', emoji: '📚' },
  '15': { name: 'Life on Land', color: 'bg-green-500', emoji: '🌳' },
};
const AINARA_INFO: { [key: string]: { name: string; emoji: string } } = {
  '[image]': { name: 'Imagen', emoji: '🖼️' },
  '[text]': { name: 'Textos', emoji: '📝' },
  '[audios]': { name: 'Audios', emoji: '🎧' },
  '[document]': { name: 'Documentos', emoji: '📄' },
  '[audiobook]': { name: 'Audiolibro', emoji: '📖' },
  '[reading]': { name: 'Lecturas', emoji: '🧐' },
  '[easy_reading]': { name: 'Lectura facilitada', emoji: '🤓' },
  '[cefr]': { name: 'MCER', emoji: '🇪🇺' },
  '[subtitles]': { name: 'Subtítulos', emoji: '💬' },
  '[quiz]': { name: 'Cuestionarios', emoji: '❓' },
  '[relations]': { name: 'Relaciones', emoji: '🔗' },
  '[wordssearch]': { name: 'Sopa de Letras', emoji: '🔎' },
  '[multiformat]': { name: 'Multiformato', emoji: '🎨' },
};

const KEY_COMPETENCIES_MAP: { [key: string]: string } = {
  'CCL1': 'Expresión oral, escrita, signada o multimodal.',
  'CCL2': 'Comprensión e interpretación de textos.',
  'CCL3': 'Búsqueda, selección y tratamiento de información.',
  'CCL4': 'Competencia literaria y lectura.',
  'CCL5': 'Uso ético, inclusivo y democrático del lenguaje.',
  'CP1': 'Uso básico de al menos una lengua adicional.',
  'CP2': 'Transferencias entre lenguas y estrategias plurilingües.',
  'CP3': 'Valoración de la diversidad lingüística y cultural.',
  'STEM1': 'Razonamiento matemático y resolución de problemas.',
  'STEM2': 'Pensamiento científico: observar, preguntar, experimentar.',
  'STEM3': 'Diseño y realización de proyectos y prototipos.',
  'STEM4': 'Comunicación y representación científica y matemática.',
  'STEM5': 'Salud, sostenibilidad y acción responsable sobre el entorno.',
  'CD1': 'Búsqueda y tratamiento de información digital.',
  'CD2': 'Creación e integración de contenidos digitales.',
  'CD3': 'Trabajo cooperativo y comunicación en entornos digitales.',
  'CD4': 'Uso seguro, crítico y saludable de la tecnología.',
  'CD5': 'Soluciones digitales y pensamiento computacional.',
  'CPSAA1': 'Conciencia y gestión personal y emocional.',
  'CPSAA2': 'Salud física y mental.',
  'CPSAA3': 'Empatía, convivencia y resolución pacífica.',
  'CPSAA4': 'Metacognición, planificación y autorregulación.',
  'CPSAA5': 'Motivación, colaboración y aprendizaje continuo.',
  'CC1': 'Participación democrática y normas sociales.',
  'CC2': 'Valores, derechos y deberes.',
  'CC3': 'Compromiso social y mejora del entorno.',
  'CE1': 'Iniciativa, curiosidad e identificación de oportunidades.',
  'CE2': 'Diseño y desarrollo de proyectos.',
  'CE3': 'Evaluación, revisión y mejora de proyectos.',
  'CEC1': 'Comprensión y valoración de manifestaciones culturales y artísticas.',
  'CEC2': 'Creación artística y expresión personal.',
  'CEC3': 'Participación en actividades culturales con actitud crítica y respetuosa.'
};

const COMPETENCY_GROUPS: { [prefix: string]: string } = {
  'CCL': 'Competencia en comunicación lingüística',
  'CP': 'Competencia plurilingüe',
  'STEM': 'Competencia matemática y competencia en ciencia, tecnología e ingeniería',
  'CD': 'Competencia digital',
  'CPSAA': 'Competencia personal, social y de aprender a aprender',
  'CC': 'Competencia ciudadana',
  'CE': 'Competencia emprendedora',
  'CEC': 'Competencia en conciencia y expresión culturales',
};

const CRITERIA_COLORS = {
  '4': 'bg-emerald-100 border-emerald-500 text-emerald-800',
  '3': 'bg-sky-100 border-sky-500 text-sky-800',
  '2': 'bg-amber-100 border-amber-500 text-amber-800',
  '1': 'bg-orange-100 border-orange-500 text-orange-800',
  '0': 'bg-red-100 border-red-500 text-red-800',
};

const COMUNIDADES = [
  "Andalucía", "Aragón", "Principado de Asturias", "Illes Balears", "Canarias", "Cantabria",
  "Castilla-La Mancha", "Castilla y León", "Cataluña", "Extremadura",
  "Galicia", "Comunidad de Madrid", "Región de Murcia", "Comunidad Foral de Navarra", 
  "País Vasco", "La Rioja", "Comunitat Valenciana", "Ceuta", "Melilla"
];

const ETAPAS = [
    { value: 'infantil', label: 'Infantil' },
    { value: 'primaria', label: 'Primaria' },
    { value: 'secundaria', label: 'Secundaria' },
    { value: 'bachillerato', label: 'Bachillerato' }
];


// --- HELPER COMPONENTS ---

const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onMouseMove={handleMouseMove}
      className="inline-block"
    >
      {children}
      {visible && text && createPortal(
        <div
          className="fixed w-max max-w-xs bg-gray-900/90 backdrop-blur-sm text-white text-sm rounded-md py-2 px-3 shadow-lg z-50 pointer-events-none"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: `translate(15px, -100%)`, 
          }}
        >
          {text}
        </div>,
        document.body
      )}
    </div>
  );
};

const ActivityCard: React.FC<{ activity: Activity; index: number; keyCompetencyMap: Map<string, string>; }> = ({ activity, index, keyCompetencyMap }) => {
    const borderColors = ['border-sky-500', 'border-violet-500', 'border-emerald-500', 'border-amber-500', 'border-rose-500'];
    const criteriaEntries = Object.entries(activity.Criteria).reverse() as [keyof Criteria, string][];

    return (
        <div className={`bg-white rounded-2xl shadow-lg transition-all hover:shadow-2xl overflow-hidden border-t-8 ${borderColors[index % borderColors.length]}`}>
            <div className="p-6 md:p-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-1">Actividad {index + 1}: {activity.title}</h3>
                <div className="flex items-center gap-6 text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                        <span>{activity.duration} minutos</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                        <span>{activity.sessions} sesión(es)</span>
                    </div>
                </div>
                <p className="text-slate-600 leading-relaxed mb-6">{activity.description}</p>
                
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" /></svg>
                            Competencias Específicas
                        </h4>
                        <div className="space-y-3">
                            {activity.competencies.map((comp, i) => (
                                <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-100 shadow-sm">
                                    <p className="text-sm text-slate-700 mb-2">{comp.competency}</p>
                                    <div className="flex flex-wrap gap-1">
                                        {comp.related_descriptor_codes.map(code => (
                                            <Tooltip key={code} text={keyCompetencyMap.get(code) || 'Clave desconocida'}>
                                                <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded border border-indigo-100 cursor-help">
                                                    {code}
                                                </span>
                                            </Tooltip>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                         <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" /></svg>
                            Saberes Básicos
                        </h4>
                        <ul className="list-disc list-outside pl-4 space-y-1 text-sm text-slate-600">
                             {activity.knowledge && activity.knowledge.length > 0 ? (
                                activity.knowledge.map((k, i) => (
                                    <li key={i}>{k}</li>
                                ))
                             ) : (
                                <li className="text-slate-400 italic">No especificados</li>
                             )}
                        </ul>
                    </div>
                </div>

                {activity.AInara && (
                    <div className="mb-8">
                        <h4 className="font-semibold text-slate-700 mb-3">Sugerencias de AInara</h4>
                        <div className="flex flex-wrap gap-2">
                            {activity.AInara.map(ainaraCode => (
                                <span key={ainaraCode} className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                                    {AINARA_INFO[ainaraCode]?.emoji}
                                    <span className="ml-1.5">{AINARA_INFO[ainaraCode]?.name || ainaraCode}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                
                <div>
                    <h4 className="font-semibold text-slate-700 mb-4 text-center">Criterios de Evaluación</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {criteriaEntries.map(([level, desc]) => (
                            <div key={level} className={`p-4 rounded-lg border-l-4 ${CRITERIA_COLORS[level]}`}>
                                <p className="font-extrabold text-2xl mb-2">{level}</p>
                                <p className="text-xs">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ErrorDisplay: React.FC<{ errors: string[] }> = ({ errors }) => {
  if (errors.length === 0) return null;
  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-md shadow-md mb-8" role="alert">
      <div className="flex">
        <div className="py-1">
          <svg className="h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className="font-bold">Se encontraron los siguientes errores:</p>
          <ul className="mt-2 list-disc list-inside text-sm">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// --- SCREENS ---

const LessonVisualizer: React.FC<{ lessonPlan: LessonPlan; onReset: () => void; }> = ({ lessonPlan, onReset }) => {
    const keyCompetencyMap = useMemo(() => new Map(Object.entries(KEY_COMPETENCIES_MAP)), []);
    
    const allActivities = Object.entries(lessonPlan)
        .filter(([key]) => key.startsWith('activity'))
        .map(([, activity]) => activity as Activity);

    const activeKeyCompetencies = useMemo(() => {
      const groups = new Set<string>();
      allActivities.forEach(act => {
        if (act.competencies) {
          act.competencies.forEach(comp => {
            if (comp.related_descriptor_codes) {
              comp.related_descriptor_codes.forEach(code => {
                const prefix = code.match(/^[A-Z]+/)?.[0];
                if (prefix && COMPETENCY_GROUPS[prefix]) {
                  groups.add(COMPETENCY_GROUPS[prefix]);
                }
              });
            }
          });
        }
      });
      return Array.from(groups).sort();
    }, [allActivities]);
  
    const validationErrors = useMemo(() => {
        const errors = new Set<string>();

        const activities = Object.values(lessonPlan).filter(
        (value): value is Activity => typeof value === 'object' && value !== null && 'competencies' in value
        );
        
        activities.forEach((activity, index) => {
            if(!activity.competencies || activity.competencies.length === 0) {
                 errors.add(`La Actividad ${index + 1} no tiene competencias asignadas.`);
            } else {
                activity.competencies.forEach(comp => {
                    if (comp.related_descriptor_codes) {
                        comp.related_descriptor_codes.forEach(code => {
                             if (!keyCompetencyMap.has(code)) {
                                errors.add(`Código de competencia clave desconocido en Actividad ${index + 1}: "${code}"`);
                            }
                        })
                    }
                });
            }
             if(!activity.knowledge || activity.knowledge.length === 0) {
                 errors.add(`La Actividad ${index + 1} no tiene Saberes Básicos asignados.`);
            }
        });

        return Array.from(errors);
    }, [lessonPlan, keyCompetencyMap]);


    return (
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
            <ErrorDisplay errors={validationErrors} />

            <header className="relative text-center mb-12">
                <button 
                    onClick={onReset}
                    className="absolute top-0 left-0 flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-600 font-semibold px-4 py-2 rounded-lg shadow-sm border border-slate-200 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Atrás
                </button>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">{lessonPlan.title}</h1>
                <p className="max-w-3xl mx-auto text-lg text-slate-600">{lessonPlan.context}</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-md border border-slate-200">
                    <h2 className="text-xl font-bold mb-4 text-slate-800 border-b pb-2">Detalles del Plan</h2>
                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-slate-500">Idioma:</span>
                            <span className="font-bold uppercase bg-slate-100 text-slate-700 px-2 py-1 rounded">{lessonPlan.language}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-slate-500">Nivel:</span>
                            <span className="font-bold capitalize bg-indigo-100 text-indigo-700 px-2 py-1 rounded">{lessonPlan.agelvl}</span>
                        </div>
                        {lessonPlan.SDG && (
                            <div>
                            <h3 className="font-semibold text-slate-500 mb-2">Objetivos de Desarrollo Sostenible:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {lessonPlan.SDG.map(sdg => (
                                        <Tooltip key={sdg} text={SDG_INFO[sdg]?.name || 'Unknown SDG'}>
                                            <div className={`flex items-center text-white text-xs font-bold px-2.5 py-1.5 rounded-full ${SDG_INFO[sdg]?.color || 'bg-gray-400'}`}>
                                                {SDG_INFO[sdg]?.emoji}
                                                <span className="ml-1">ODS {sdg}</span>
                                            </div>
                                        </Tooltip>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="lg:col-span-2 bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl shadow-md border border-slate-200">
                    <h2 className="text-xl font-bold mb-2 text-indigo-900">Justificación Pedagógica</h2>
                    <p className="text-slate-700 leading-relaxed">{lessonPlan.justification}</p>
                </div>
            </div>

            {activeKeyCompetencies.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 mb-12">
                <h2 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Competencias Clave Trabajadas
                </h2>
                <div className="flex flex-wrap gap-2">
                  {activeKeyCompetencies.map((compName, i) => (
                    <span key={i} className="inline-block bg-violet-50 text-violet-800 border border-violet-200 px-3 py-1.5 rounded-lg text-sm font-medium">
                      {compName}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-8">
                {allActivities.map((activity, index) => (
                    <ActivityCard key={index} activity={activity} index={index} keyCompetencyMap={keyCompetencyMap} />
                ))}
            </div>
        </main>
    );
};

const API_URL = 'http://localhost:8000';

const JSONInputScreen: React.FC<{
    jsonInput: string;
    setJsonInput: (value: string) => void;
    jsonError: string | null;
    onVisualize: () => void;
}> = ({ jsonInput, setJsonInput, jsonError, onVisualize }) => {
    
    const [region, setRegion] = useState('');
    const [stage, setStage] = useState('');
    const [topic, setTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!region || !stage || !topic) {
            setGenerationError('Por favor, completa todos los campos.');
            return;
        }

        setIsGenerating(true);
        setGenerationError(null);
        
        try {
            const response = await fetch(`${API_URL}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    region, 
                    stage, 
                    topic 
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error generando la situación');
            }
            
            const data = await response.json();
            setJsonInput(JSON.stringify(data.data, null, 2));
            setGenerationError(null);
            
        } catch (error) {
            console.error('Error generating lesson:', error);
            const errorMessage = error instanceof Error 
                ? error.message 
                : 'Error desconocido. Por favor, intenta de nuevo.';
            setGenerationError(errorMessage);
        } finally {
            setIsGenerating(false);
        }
    };
    return (
        <div className="min-h-screen p-6 md:p-12 flex items-center justify-center">
            <div className="w-full max-w-7xl">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">Generador de Situaciones de Aprendizaje</h1>
                    <p className="text-lg text-slate-600">Completa los datos y la IA diseñará una propuesta pedagógica completa.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-stretch h-full">
                    
                    {/* LEFT COLUMN: FORM */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 flex-1">
                            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Configuración
                            </h2>
                            
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Comunidad Autónoma</label>
                                    <select 
                                        value={region} 
                                        onChange={(e) => setRegion(e.target.value)}
                                        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2.5 border"
                                    >
                                        <option value="">Selecciona una comunidad...</option>
                                        {COMUNIDADES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Etapa Educativa</label>
                                    <select 
                                        value={stage} 
                                        onChange={(e) => setStage(e.target.value)}
                                        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2.5 border"
                                    >
                                        <option value="">Selecciona una etapa...</option>
                                        {ETAPAS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Temática</label>
                                    <input 
                                        type="text" 
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="Ej: El ciclo del agua, La Revolución Francesa..."
                                        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2.5 border"
                                    />
                                </div>

                                <button
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !region || !stage || !topic}
                                    className={`w-full font-bold py-3 px-4 rounded-lg shadow-md transition-all transform flex justify-center items-center gap-2 mt-4
                                        ${isGenerating || !region || !stage || !topic 
                                            ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                                            : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105 text-white'
                                        }`}
                                >
                                    {isGenerating ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Generando...
                                        </>
                                    ) : (
                                        <>
                                            <span>Generar Situación</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" /></svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: EDITOR */}
                    <div className="w-full lg:w-2/3 flex flex-col gap-4">
                        <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-700 flex flex-col h-full overflow-hidden">
                             <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex justify-between items-center">
                                <span className="text-xs font-mono text-slate-400">JSON Output</span>
                                <span className="flex gap-2">
                                     <span className="w-3 h-3 rounded-full bg-red-500"></span>
                                     <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                                     <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                </span>
                            </div>
                            <textarea
                                className="flex-1 w-full p-4 font-mono text-sm bg-slate-900 text-green-400 focus:outline-none resize-none"
                                value={jsonInput}
                                onChange={(e) => setJsonInput(e.target.value)}
                                placeholder="// El JSON generado aparecerá aquí..."
                                spellCheck="false"
                            />
                             {jsonError && (
                                <div className="bg-red-900/50 text-red-200 text-sm p-3 border-t border-red-800">
                                    {jsonError}
                                </div>
                            )}
                        </div>
                        
                        <button
                            onClick={onVisualize}
                            disabled={!jsonInput || jsonInput === "{}"}
                            className={`w-full font-bold py-3 px-6 rounded-lg shadow-md transition-colors flex justify-center items-center gap-2
                                ${!jsonInput || jsonInput === "{}"
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
                        >
                            <span>Visualizar Resultado</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- MAIN APP ---

export default function App() {
    const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
    const [jsonInput, setJsonInput] = useState<string>(''); // Start empty
    const [jsonError, setJsonError] = useState<string | null>(null);

    const handleVisualize = () => {
        if (!jsonInput.trim()) {
            setJsonError('El campo de entrada no puede estar vacío.');
            return;
        }
        try {
            const parsedData = JSON.parse(jsonInput);
            setLessonPlan(parsedData);
            setJsonError(null);
        } catch (error) {
            setJsonError('Formato JSON no válido. Por favor, comprueba tu entrada.');
            setLessonPlan(null);
        }
    };

    const handleReset = () => {
        setLessonPlan(null);
        // We keep the previous JSON input so they can edit it if they go back
    };

    return (
        <div className="bg-slate-50 min-h-screen text-slate-800 font-sans">
            {!lessonPlan ? (
                <JSONInputScreen
                    jsonInput={jsonInput}
                    setJsonInput={setJsonInput}
                    jsonError={jsonError}
                    onVisualize={handleVisualize}
                />
            ) : (
                <LessonVisualizer lessonPlan={lessonPlan} onReset={handleReset} />
            )}
        </div>
    );
}