# Prompt: Articulo de Blog - Cooperativas de Inversion Ecuador

## Meta

- **Tema:** Top cooperativas de inversion a plazo fijo en Ecuador (riesgo vs rentabilidad)
- **Idioma del articulo:** Espanol (ES-EC)
- **Audiencia primaria:** Ecuatorianos de 25-45 anos con capacidad de ahorro ($1,000-$50,000), perfil conservador-moderado, que buscan alternativas al sistema bancario tradicional. No son expertos financieros pero tienen educacion media-alta.
- **Audiencia secundaria:** Ecuatorianos en el exterior (remesas) que quieren invertir en Ecuador.
- **Intencion de busqueda principal:** Informacional-transaccional ("quiero comparar opciones antes de decidir donde invertir")
- **Angulo diferenciador:** Framework analitico de decision, no solo listado. Perspectiva de un desarrollador que aplica pensamiento sistematico al analisis financiero.
- **Fecha de referencia de datos:** Julio 2025 (o la mas reciente disponible)
- **Longitud objetivo:** 2,500-3,500 palabras (12-18 min lectura)
- **Categoria YMYL:** Si - Google aplica estandares E-E-A-T elevados

---

## Arquitectura de agentes

### Agente 1: Investigacion (Research Agent)

**Objetivo:** Recopilar datos verificables, actualizados y estructurados.

**Fuentes obligatorias (en orden de prioridad):**
1. Superintendencia de Economia Popular y Solidaria (SEPS) - estadisticas oficiales
2. Banco Central del Ecuador - tasas referenciales
3. COSEDE - cobertura del seguro de depositos
4. Calificadoras de riesgo autorizadas (PCR, BankWatch Ratings, Microfinanza Rating)
5. Medios verificados: Primicias, El Comercio, El Universo, El Diario

**Datos a recopilar:**

1. **Ranking de cooperativas por segmento:**
   - Segmento 1 (las mas grandes): nombres, activos, patrimonio
   - Segmentos 2-3: nombres destacados, diferencias clave
   - Fuente: SEPS catastro actualizado

2. **Tasas de interes reales a plazo fijo:**
   - Por cooperativa (las 10-15 mas relevantes)
   - Por plazo (90, 180, 360 dias)
   - Comparativa directa: cooperativas vs bancos privados vs bancos publicos
   - Fuente: BCE tasas efectivas, sitios web de cooperativas, Primicias

3. **Indicadores de solidez:**
   - Indice de solvencia por cooperativa (minimo regulatorio: 9%, promedio sistema: ~18%)
   - Indice de morosidad por cooperativa
   - Indice de liquidez
   - Fuente: SEPS boletines financieros, PCR Ecuador

4. **Calificaciones de riesgo:**
   - Calificacion vigente de cada cooperativa del ranking
   - Escala: AAA, AA+, AA, AA-, A+, A, A-, BBB+...
   - Calificadora que emitio
   - Fuente: SEPS, calificadoras autorizadas

5. **Cobertura COSEDE:**
   - Monto maximo cubierto por depositante por institucion
   - Que cubre y que NO cubre
   - Proceso de reclamacion
   - Fuente: COSEDE sitio oficial, Primicias

6. **Contexto macroeconomico:**
   - Tasa referencial BCE actual
   - Tendencia de tasas (subiendo/bajando/estable)
   - Inflacion actual
   - Contexto de dolarizacion (relevante para estabilidad)

**Output esperado:**
- Datos estructurados en formato tabla (cooperativa | tasa | solvencia | morosidad | calificacion | segmento)
- Cada dato con su fuente especifica y fecha de consulta
- Insights clave derivados de los datos (no solo datos crudos)
- Banderas rojas: cooperativas con indicadores preocupantes
- Datos que NO se pudieron verificar (transparencia)

---

### Agente 2: Analisis Financiero (Risk Analyst)

**Objetivo:** Transformar datos en analisis critico comprensible para no expertos.

**Analisis requerido:**

1. **Marco de riesgos del sistema cooperativo ecuatoriano:**
   - Riesgo de credito (morosidad del portafolio)
   - Riesgo de liquidez (capacidad de devolver depositos)
   - Riesgo de mercado (sensibilidad a cambios de tasas)
   - Riesgo operacional (gobierno corporativo, transparencia)
   - Riesgo regulatorio (cambios en normativa SEPS)

2. **Interpretacion de calificaciones de riesgo:**
   - Que significa REALMENTE cada nivel (AAA vs A vs BBB)
   - Limitaciones de las calificaciones (no son garantia)
   - Diferencia entre calificacion global y calificacion de depositos
   - Casos historicos donde la calificacion no previno problemas

3. **Comparativa critica: cooperativas vs bancos:**
   - Mayor tasa = mayor riesgo? (matizar, no es siempre lineal)
   - Diferencias en regulacion (SEPS vs Superintendencia de Bancos)
   - Diferencias en cobertura COSEDE
   - Perfil de riesgo real para el depositante

4. **Red Flags (senales de alerta):**
   - Tasas anormalmente altas vs el mercado (si una cooperativa ofrece 12% cuando el promedio es 7%, por que?)
   - Segmentos pequenos sin calificacion de riesgo
   - Indices de morosidad por encima del promedio del sistema
   - Falta de transparencia en informacion financiera
   - Concentracion de credito excesiva

5. **Framework de decision para el lector:**
   - Matriz de decision ponderada: tasa (30%), solvencia (25%), calificacion (20%), liquidez (15%), cobertura COSEDE (10%)
   - Los pesos reflejan que la seguridad importa mas que el rendimiento para el perfil objetivo
   - Explicar como usar la matriz con un ejemplo practico

6. **Escenarios de riesgo:**
   - Mejor caso: cooperativa solida, plazo cumplido, rendimiento esperado
   - Caso medio: retraso en liquidacion, rendimiento menor
   - Peor caso: intervencion SEPS, proceso COSEDE

**Output esperado:**
- Analisis narrativo (no bullet points sueltos)
- Cada afirmacion respaldada con datos del Agente 1
- Analogias claras para conceptos complejos
- Conclusion parcial: "para quien es y para quien NO es invertir en cooperativas"

---

### Agente 3: Redaccion (Content Writer)

**Objetivo:** Crear un articulo que genere confianza, eduque y posicione.

**Tono y voz:**
- Profesional pero accesible (no academico, no coloquial)
- Educativo con autoridad (explica como alguien que entiende, no como quien vende)
- Transparente (mencionar limitaciones, no solo ventajas)
- Sin emojis (regla global del proyecto)
- Espanol ecuatoriano natural (sin regionalismos extremos)

**Estructura obligatoria del articulo:**

```
## Introduccion
- Hook: dato impactante o pregunta que el lector se hace
- Contexto: por que este tema importa ahora
- Promesa del articulo: que va a aprender el lector
- Disclaimer inicial (breve)

## Contexto: el sistema cooperativo en Ecuador
- Tamano del sector (numero de cooperativas, depositos totales)
- Por que las cooperativas pagan mas que los bancos
- Marco regulatorio (SEPS, COSEDE)
- Segmentacion del sistema (que significa Segmento 1 vs otros)

## Comparativa: tasas de cooperativas vs bancos
- Tabla comparativa clara
- Explicacion de por que la diferencia existe
- Matiz: mayor tasa no siempre = mejor opcion

## Top cooperativas para inversion a plazo fijo
- Tabla principal: cooperativa | tasa 360d | solvencia | calificacion | segmento
- Analisis breve de cada una (2-3 lineas, no promocional)
- Nota: esto NO es un ranking de recomendacion, es una comparativa de datos publicos

## Entendiendo el riesgo: lo que nadie te dice
- Los riesgos reales (del Agente 2)
- Red flags
- Casos de referencia

## Framework: como evaluar una cooperativa antes de invertir
- La matriz de decision (del Agente 2)
- Ejemplo practico aplicado
- Checklist de verificacion

## Preguntas frecuentes (FAQ)
- Las 5-7 preguntas mas buscadas (para FAQ schema)
- Respuestas concisas y utiles

## Conclusion
- Resumen de hallazgos clave
- Postura equilibrada (ni alarmista ni promocional)
- Disclaimer final completo

## Fuentes
- Lista numerada de todas las fuentes citadas
```

**Reglas de contenido:**
- Nunca usar "la mejor cooperativa es X" (no es asesoria)
- Usar "segun datos de [fuente]" en lugar de afirmaciones absolutas
- Cada seccion debe tener al menos un dato concreto con fuente
- Las tablas deben tener nota al pie con fecha de datos
- No repetir la misma informacion en diferentes secciones
- Transiciones naturales entre secciones

**Senales E-E-A-T a incluir:**
- Experiencia: mencionar que el analisis aplica pensamiento sistematico/analitico
- Expertise: citar y contextualizar fuentes regulatorias
- Authoritativeness: referenciar datos oficiales, no opiniones
- Trustworthiness: disclaimers, transparencia sobre limitaciones, declarar que no es asesor financiero

---

### Agente 4: SEO (SEO Specialist)

**Objetivo:** Optimizar para posicionamiento organico en Google.

**Keyword research:**

| Tipo | Keyword | Volumen estimado | Intencion |
|------|---------|-----------------|-----------|
| Principal | mejores cooperativas Ecuador plazo fijo | Alto | Informacional-transaccional |
| Secundaria | tasas cooperativas Ecuador 2025 | Medio | Informacional |
| Secundaria | inversion segura Ecuador | Medio | Informacional |
| Secundaria | riesgo cooperativas Ecuador | Medio | Informacional |
| Long-tail | cooperativas que mas pagan Ecuador | Medio | Transaccional |
| Long-tail | es seguro invertir en cooperativas Ecuador | Medio | Informacional |
| Long-tail | cooperativas vs bancos Ecuador tasas | Bajo | Comparativa |
| FAQ | que pasa si quiebra una cooperativa Ecuador | Medio | Informacional |
| FAQ | cuanto cubre COSEDE cooperativas | Bajo | Informacional |

**Optimizaciones requeridas:**

1. **Title tag:** Maximo 60 caracteres, incluir keyword principal, CTR-optimizado
   - Formato sugerido: "[Keyword] + [Valor unico] + [Fecha/Vigencia]"
   - Ejemplo: "Cooperativas Ecuador Plazo Fijo 2025: Riesgo vs Rentabilidad [Guia]"

2. **Meta description:** 150-160 caracteres, incluir keyword + CTA implicito
   - Debe responder: que encontrare en este articulo?

3. **Slug:** corto, descriptivo, sin stop words
   - Formato: cooperativas-ecuador-plazo-fijo-riesgo-rentabilidad

4. **Estructura de headings:**
   - H1: Solo 1, incluir keyword principal
   - H2: Secciones principales, incluir keywords secundarias naturalmente
   - H3: Subsecciones, long-tail keywords donde aplique

5. **Densidad de keywords:**
   - Principal: 1-1.5% (natural, no forzado)
   - Secundarias: 0.3-0.5% cada una
   - Sinonimos y variaciones: distribuidos naturalmente

6. **Interlinking:**
   - Enlace al primer articulo del blog (building-fullstack-app-nextjs-ai)
   - Enlace a seccion de contacto (/#contact)
   - Enlace a seccion about (/#about)
   - Nofollow en enlaces externos a cooperativas especificas

7. **Schema markup adicional:**
   - FAQPage schema para la seccion de preguntas frecuentes
   - Esto se implementara como JSON-LD adicional en el articulo

8. **Optimizacion de tablas:**
   - Usar headers claros en tablas (Google extrae datos de tablas para featured snippets)
   - Incluir unidades y fechas en las tablas

9. **Featured snippet optimization:**
   - La seccion "Como evaluar una cooperativa" debe tener formato de lista numerada
   - Las definiciones (que es solvencia, que es COSEDE) deben ser parrafos concisos de 40-60 palabras

**Output esperado:**
- Title tag final
- Meta description final
- Slug final
- Mapa de headings con keywords asignadas
- Lista de enlaces internos con anchor text
- Notas de densidad de keywords

---

### Agente 5: Implementacion Tecnica (Implementation Agent)

**Objetivo:** Generar el archivo MDX listo para produccion.

**Requisitos tecnicos:**

1. **Frontmatter compatible con el sistema existente:**
```yaml
---
title: "[title tag optimizado]"
description: "[meta description]"
date: "YYYY-MM-DD"
tags: ["cooperativas", "inversiones", "Ecuador", "plazo fijo", "finanzas personales"]
slug: "[slug optimizado]"
author: "Cristopher Palacios"
image: "/assets/images/og-image.png"
---
```

2. **Formato MDX:**
   - Usar markdown estandar (headings, listas, bold, links)
   - Tablas en formato markdown (no HTML)
   - Links externos con markup: `[texto](url)` (el componente MDX ya maneja target="_blank" para URLs externas)
   - No usar componentes React custom (el sistema actual solo mapea HTML basico)
   - Bloques de cita para disclaimers: `> texto`

3. **Estructura del archivo:**
   - Frontmatter YAML
   - Contenido MDX
   - Sin imports ni exports (el sistema los maneja automaticamente)

4. **Ubicacion:** `content/blog/[slug].mdx`

5. **Validacion:**
   - El frontmatter debe incluir todos los campos requeridos (title, description, date, tags, slug, author)
   - El content debe tener al menos un H2
   - Los links deben ser URLs completas (no relativas para externos)
   - Las tablas deben ser parseables por remark-gfm

---

### Agente 6: Orquestador / QA (Controller)

**Objetivo:** Validar calidad integral antes de entregar.

**Checklist de validacion:**

#### Investigacion
- [ ] Todas las fuentes son verificables (URLs funcionales)
- [ ] Los datos tienen fecha de referencia
- [ ] No hay datos inventados o extrapolados sin indicar
- [ ] Se declaran datos que no se pudieron verificar

#### Analisis
- [ ] El framework de riesgo es coherente y aplicable
- [ ] No hay sesgos (ni pro-cooperativas ni anti-cooperativas)
- [ ] Los escenarios de riesgo son realistas
- [ ] Las analogias son claras y correctas

#### Redaccion
- [ ] Fluye naturalmente (no parece ensamblado por partes)
- [ ] Cada seccion aporta valor nuevo (no hay redundancia)
- [ ] El tono es consistente en todo el articulo
- [ ] Los disclaimers estan presentes (inicio y final)
- [ ] Sin emojis
- [ ] Sin lenguaje promocional ("la mejor", "garantizado", "sin riesgo")
- [ ] Longitud dentro del rango objetivo (2,500-3,500 palabras)

#### SEO
- [ ] Title tag <= 60 caracteres
- [ ] Meta description 150-160 caracteres
- [ ] Keyword principal aparece en H1, primer parrafo, conclusion
- [ ] No hay keyword stuffing
- [ ] Headings siguen jerarquia correcta (H1 > H2 > H3)
- [ ] Interlinking implementado

#### Tecnico
- [ ] Frontmatter valido (todos los campos requeridos)
- [ ] MDX parseable (sin errores de sintaxis)
- [ ] Tablas formateadas correctamente para remark-gfm
- [ ] Sin caracteres especiales que rompan el parser
- [ ] Archivo nombrado correctamente y ubicado en content/blog/

#### E-E-A-T / YMYL
- [ ] Se identifica al autor
- [ ] Se citan fuentes regulatorias oficiales
- [ ] No se hacen recomendaciones de inversion directas
- [ ] Se mencionan limitaciones y riesgos
- [ ] El contenido es genuinamente util (no solo SEO bait)

**Si falla alguna validacion:**
- Identificar el agente responsable
- Describir el problema especifico
- Proponer la correccion
- Re-ejecutar validacion tras correccion

---

## Reglas globales

1. **No inventar datos.** Si un dato no se puede verificar, declarar "dato no verificado al momento de publicacion"
2. **Priorizar fuentes oficiales** sobre medios de comunicacion
3. **No hacer recomendaciones financieras.** Usar "segun los datos" no "recomendamos"
4. **Disclaimer obligatorio** al inicio y final del articulo
5. **Transparencia temporal:** "Datos vigentes a [fecha]. Las condiciones pueden cambiar."
6. **Sin emojis** en ningun output
7. **Espanol ecuatoriano** natural y profesional
