import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  ImageRun,
} from "docx";
import { saveAs } from "file-saver";

function paragraph(text = "") {
  return new Paragraph({
    children: [
      new TextRun({
        text: String(text),
        size: 24,
      }),
    ],
    spacing: { after: 160 },
  });
}

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    text: String(text),
    heading: level,
    spacing: { before: 240, after: 160 },
  });
}

function bullet(text = "") {
  return new Paragraph({
    children: [
      new TextRun({
        text: String(text),
        size: 24,
      }),
    ],
    bullet: { level: 0 },
    spacing: { after: 100 },
  });
}

function safeFileName(text) {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function exportTopicToWord(topic, subjectName = "Asignatura") {
  const children = [];

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `${subjectName} - ${topic.titulo || topic.nombre || "Tema"}`,
          bold: true,
          size: 36,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  if (topic.apuntes?.introduccion) {
    children.push(heading("Introducción", HeadingLevel.HEADING_1));
    children.push(paragraph(topic.apuntes.introduccion));
  }

  if (Array.isArray(topic.apuntes?.secciones)) {
    topic.apuntes.secciones.forEach((seccion) => {
      children.push(heading(seccion.titulo || "Sección", HeadingLevel.HEADING_1));

      if (seccion.contenido) {
        children.push(paragraph(seccion.contenido));
      }

      if (Array.isArray(seccion.puntos)) {
        seccion.puntos.forEach((punto) => {
          children.push(bullet(punto));
        });
      }

      if (Array.isArray(seccion.subsecciones)) {
        seccion.subsecciones.forEach((sub) => {
          children.push(heading(sub.titulo || "Subsección", HeadingLevel.HEADING_2));

          if (sub.contenido) {
            children.push(paragraph(sub.contenido));
          }

          if (Array.isArray(sub.puntos)) {
            sub.puntos.forEach((punto) => {
              children.push(bullet(punto));
            });
          }
        });
      }
    });
  }

  if (Array.isArray(topic.resumen) && topic.resumen.length > 0) {
    children.push(heading("Resumen", HeadingLevel.HEADING_1));
    topic.resumen.forEach((item) => children.push(bullet(item)));
  }

  if (Array.isArray(topic.conceptosClave) && topic.conceptosClave.length > 0) {
    children.push(heading("Conceptos clave", HeadingLevel.HEADING_1));

    topic.conceptosClave.forEach((concepto) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: concepto.termino || concepto.nombre || "Concepto",
              bold: true,
              size: 24,
            }),
            new TextRun({
              text: concepto.definicion ? `: ${concepto.definicion}` : "",
              size: 24,
            }),
          ],
          spacing: { after: 120 },
        })
      );
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `${safeFileName(subjectName)}-${safeFileName(topic.titulo || topic.nombre || "tema")}.docx`;
  saveAs(blob, fileName);
}

export async function exportQuestionsToWord(questions = [], subjectName = "Asignatura") {
  const children = [];

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `${subjectName} - Preguntas de examen`,
          bold: true,
          size: 36,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  questions.forEach((question, index) => {
    children.push(
      heading(
        `${index + 1}. ${question.tipo || "Pregunta"}`,
        HeadingLevel.HEADING_2
      )
    );

    if (question.bloque) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: "Bloque: ", bold: true, size: 22 }),
            new TextRun({ text: question.bloque, size: 22 }),
          ],
          spacing: { after: 100 },
        })
      );
    }

    if (question.temaId) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: "Tema: ", bold: true, size: 22 }),
            new TextRun({ text: question.temaId, size: 22 }),
          ],
          spacing: { after: 100 },
        })
      );
    }

    children.push(paragraph(question.enunciado || ""));

    if (Array.isArray(question.opciones) && question.opciones.length > 0) {
      question.opciones.forEach((opcion) => {
        const label = opcion.id || opcion.letra || "";
        const text = opcion.texto || opcion;
        children.push(bullet(`${label ? `${label}) ` : ""}${text}`));
      });
    }

    if (question.respuestaCorrecta) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: "Respuesta correcta: ", bold: true, size: 24 }),
            new TextRun({ text: String(question.respuestaCorrecta), size: 24 }),
          ],
          spacing: { after: 120 },
        })
      );
    }

    if (question.respuesta) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: "Respuesta: ", bold: true, size: 24 }),
            new TextRun({ text: String(question.respuesta), size: 24 }),
          ],
          spacing: { after: 120 },
        })
      );
    }

    if (question.explicacion) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: "Explicación: ", bold: true, size: 24 }),
            new TextRun({ text: String(question.explicacion), size: 24 }),
          ],
          spacing: { after: 200 },
        })
      );
    }

    if (Array.isArray(question.imagenes) && question.imagenes.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "[Esta pregunta contiene una imagen asociada en la aplicación.]",
              italics: true,
              size: 22,
            }),
          ],
          spacing: { after: 200 },
        })
      );
    }
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `${safeFileName(subjectName)}-preguntas-examen.docx`;
  saveAs(blob, fileName);
}

function getPartQuestions(questions, part) {
  return questions.filter(q => part.tipos?.includes(q.tipo));
}

export async function exportQuestionsByBlocksToWord({
  subject,
  questions = [],
  examParts = [],
  title: exportTitle = 'Preguntas de examen',
  fileSuffix = 'preguntas-examen',
}) {
  const children = [];

  const subjectName =
    subject?.abreviatura ||
    subject?.nombre ||
    subject?.id ||
    'Asignatura';

  children.push(title(`${subjectName} - ${exportTitle}`));
  children.push(labelParagraph('Total de preguntas', questions.length));
  children.push(paragraph(''));

  if (!questions.length) {
    children.push(paragraph('No hay preguntas disponibles.'));
  } else if (Array.isArray(examParts) && examParts.length > 0) {
    examParts.forEach(part => {
      const partQuestions = getPartQuestions(questions, part);

      children.push(
        heading(
          `${part.icono ? `${part.icono} ` : ''}${part.nombre} (${partQuestions.length})`,
          HeadingLevel.HEADING_1
        )
      );

      if (part.desc) {
        children.push(paragraph(part.desc));
      }

      if (partQuestions.length === 0) {
        children.push(paragraph('No hay preguntas en este bloque.'));
      } else {
        partQuestions.forEach((q, index) => addQuestion(children, q, index));
      }
    });

    const assignedTypes = new Set(examParts.flatMap(p => p.tipos || []));
    const otherQuestions = questions.filter(q => !assignedTypes.has(q.tipo));

    if (otherQuestions.length > 0) {
      children.push(
        heading(`Otras preguntas (${otherQuestions.length})`, HeadingLevel.HEADING_1)
      );

      otherQuestions.forEach((q, index) => addQuestion(children, q, index));
    }
  } else {
    const groups = {
      test: questions.filter(q => q.tipo === 'test' || q.tipo === 'verdadero_falso'),
      cortas: questions.filter(q => q.tipo === 'corta'),
      desarrollo: questions.filter(q => q.tipo === 'desarrollo'),
      practicas: questions.filter(q => q.tipo === 'practica' || q.tipo === 'practicas'),
      otras: questions.filter(q =>
        !['test', 'verdadero_falso', 'corta', 'desarrollo', 'practica', 'practicas'].includes(q.tipo)
      ),
    };

    const labels = {
      test: 'Tipo test',
      cortas: 'Preguntas cortas',
      desarrollo: 'Preguntas de desarrollo',
      practicas: 'Problemas prácticos',
      otras: 'Otras preguntas',
    };

    Object.entries(groups).forEach(([key, items]) => {
      if (items.length === 0) return;

      children.push(
        heading(`${labels[key]} (${items.length})`, HeadingLevel.HEADING_1)
      );

      items.forEach((q, index) => addQuestion(children, q, index));
    });
  }

  const doc = new Document({
    sections: [
      {
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);

  saveAs(
    blob,
    `${safeFileName(subjectName)}-${safeFileName(fileSuffix)}.docx`
  );
}