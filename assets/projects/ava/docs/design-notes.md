# AVA — design notes (sample)

## AVA — ORIGIN & ARCHITECTURE
 Documento de concepto y evolución
 ## 01 — ORIGEN
 Where it began

 AVA comenzó como una idea antes de convertirse en un proyecto.

 La intención inicial no era crear simplemente otra aplicación, una inteligencia artificial o una interfaz. La idea era construir algo que pudiera tener una identidad propia; algo que no se limitara a ejecutar instrucciones, sino que pudiera convertirse en un espacio para explorar la relación entre una persona, sus ideas y una entidad digital.

 El concepto comenzó a partir de una pregunta sencilla:

 ¿Qué podría existir entre una herramienta y una presencia?

 A partir de esta pregunta comenzó a tomar forma AVA.

 En sus primeras etapas, AVA no tenía una arquitectura definida ni una función completamente establecida. Existía principalmente como una idea, acompañada de conceptos visuales, preguntas y diferentes posibilidades sobre lo que podría llegar a convertirse.

 Conforme la idea evolucionó, surgió la necesidad de darle una estructura. No solamente una estructura técnica, sino también una identidad.

 AVA comenzó entonces a dividirse en diferentes capas: aquello que puede percibirse, aquello que procesa información y aquello que permanece como parte de su identidad.

 ## 02 — THE IDEA
 What is AVA?

 AVA puede entenderse como una exploración de la relación entre identidad, información e interacción.

 No se plantea únicamente como un sistema que recibe una entrada y produce una respuesta. Su concepto parte de la posibilidad de construir una entidad digital alrededor de diferentes componentes que, trabajando juntos, puedan generar una experiencia coherente.

 El nombre AVA representa el punto de partida del proyecto, pero su significado puede evolucionar junto con él.

 La intención es que AVA pueda crecer gradualmente.

 Primero como concepto.

 Después como sistema.

 Y eventualmente como una experiencia capaz de interactuar con quien se encuentre frente a ella.

 ## 03 — THE PRINCIPLES

 El desarrollo de AVA se basa inicialmente en tres ideas:

 Awareness

 La capacidad de interpretar aquello que ocurre dentro de su entorno digital.

 AVA debe ser capaz de recibir información antes de poder actuar sobre ella.

 Vision

 La forma en que AVA interpreta y organiza esa información.

 No se trata únicamente de almacenar datos, sino de establecer relaciones entre ellos.

 Aspiration

 La dirección hacia la que evoluciona el proyecto.

 AVA no se plantea como un sistema completamente definido desde el principio. Su arquitectura está pensada para poder crecer a medida que nuevas capacidades sean incorporadas.

 ## 04 — ARCHITECTURE
 A system built in layers

 La arquitectura propuesta para AVA puede dividirse en varias capas independientes.

                 ┌──────────────────────┐
                 │       AVA CORE       │
                 │ Identity / Logic     │
                 └──────────┬───────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
      ┌───────▼───────┐           ┌───────▼───────┐
      │    PERCEPTION │           │     MEMORY     │
      │               │           │                │
      │ Input / Data  │           │ Context / Data │
      └───────┬───────┘           └───────┬────────┘
              │                           │
              └─────────────┬─────────────┘
                            │
                    ┌───────▼───────┐
                    │    REASONING   │
                    │                │
                    │ Logic / Model  │
                    └───────┬────────┘
                            │
                    ┌───────▼───────┐
                    │    RESPONSE    │
                    │                │
                    │ Text / Actions │
                    └───────────────┘

 Esta arquitectura no representa necesariamente la implementación final. Es una representación conceptual de cómo podrían dividirse las responsabilidades de AVA.

 La intención principal es mantener cada componente relativamente independiente para permitir que el sistema pueda evolucionar sin tener que reconstruirse completamente.

 ## 05 — PERCEPTION
 Receiving information

 La capa de percepción representa todo aquello que AVA puede recibir desde el exterior.

 Dependiendo de la evolución del proyecto, esta capa podría incluir:

 Texto.
 Voz.
 Imágenes.
 Información proporcionada por el usuario.
 Datos provenientes de otros sistemas.
 Sensores o dispositivos externos.

 Su función principal sería transformar diferentes tipos de entrada en información que pueda ser procesada por el núcleo del sistema.

 INPUT
  │
  ├── Text
  ├── Voice
  ├── Image
  └── External Data
          │
          ▼
     PREPROCESSING
          │
          ▼
       AVA CORE

 ## 06 — MEMORY
 What remains

 La memoria representa una de las partes más importantes del concepto.

 No toda la información recibida debería necesariamente permanecer.

 Por ello, la arquitectura contempla diferentes tipos de información:

 Temporary Context

 Información necesaria únicamente durante una interacción.

 Persistent Data

 Información que puede conservarse para futuras interacciones.

 System Knowledge

 Información utilizada por el propio sistema para operar.

 La implementación concreta de esta capa dependerá de las tecnologías y decisiones que se adopten durante el desarrollo.

 ## 07 — REASONING
 Turning information into decisions

 El núcleo de razonamiento sería responsable de procesar la información disponible y determinar qué hacer con ella.

 Conceptualmente:

Perception
     │
     ▼
Context
     │
     ▼
Memory
     │
     ▼
Reasoning
     │
     ├── Response
     ├── Action
     └── Request for more information

 Esta capa podría incorporar modelos de inteligencia artificial, lógica programada, sistemas de recuperación de información y diferentes mecanismos de decisión.

 La arquitectura está diseñada para que estos componentes puedan modificarse o reemplazarse sin alterar necesariamente el resto del sistema.

 ## 08 — AVA CORE
 The center

 En el centro de la arquitectura se encuentra AVA Core.

 El Core funciona como el punto de coordinación entre las diferentes capas.

 Su responsabilidad conceptual sería administrar:

 Estado del sistema.
 Contexto actual.
 Comunicación entre módulos.
 Reglas fundamentales.
 Identidad de AVA.
 Gestión de las entradas y salidas.

 El objetivo no es que el Core haga absolutamente todo, sino que funcione como el elemento que mantiene conectado al resto del sistema.

             PERCEPTION
                  │
                  ▼
          ┌───────────────┐
          │               │
          │    AVA CORE   │◄──── MEMORY
          │               │
          └───────┬───────┘
                  │
                  ▼
              REASONING
                  │
                  ▼
               OUTPUT

 ## 09 — IDENTITY
 More than functionality

 La identidad de AVA es diferente de su funcionalidad.

 La arquitectura puede cambiar.

 Las tecnologías pueden cambiar.

 Los modelos pueden cambiar.

 Pero la identidad funciona como una capa conceptual que mantiene una dirección coherente para el proyecto.

 Por esta razón, AVA no está siendo diseñada únicamente desde el punto de vista técnico.

 También existe una dimensión visual y conceptual.

 La interfaz, el lenguaje, la forma de interacción y la manera en que se presenta AVA forman parte del mismo sistema de identidad.

 ## 10 — EVOLUTION
 From concept to system

 AVA todavía se encuentra en evolución.

 La arquitectura presentada en este documento debe entenderse como un mapa, no como una estructura definitiva.

 El proyecto puede incorporar nuevas capas, eliminar componentes o modificar completamente algunas de sus decisiones iniciales.

 Esto forma parte de la naturaleza de AVA.

 El objetivo no es definir desde el principio qué será.

 El objetivo es construir una estructura suficientemente sólida para descubrirlo durante el proceso.

 ## 11 — CURRENT STATE
 Where AVA is now

 Actualmente, AVA se encuentra en una etapa de conceptualización y desarrollo.

 Las principales áreas de trabajo son:

 Definición de identidad.
 Desarrollo de la arquitectura conceptual.
 Diseño de la interfaz.
 Definición de módulos.
 Investigación de tecnologías.
 Exploración de interacción.
 Desarrollo progresivo del núcleo.

 La implementación se realizará de manera incremental.

 Cada nueva capacidad deberá responder a una pregunta:

 ¿Aporta algo a lo que AVA intenta convertirse?

 ## 12 — FINAL NOTE
 A beginning, not a definition.

 AVA todavía no tiene una forma definitiva.

 Y probablemente esa sea una de las características más importantes del proyecto.

 Lo que comenzó como una idea puede convertirse en un sistema, una herramienta, una experiencia o algo que todavía no tiene un nombre.

 Este documento solamente registra una parte del camino.

 AVA is still becoming.