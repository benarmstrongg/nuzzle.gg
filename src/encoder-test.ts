const VALID_URL_CHARS = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '-',
  '_',
  '.',
  '~',
  '!',
  '$',
  "'",
  '(',
  ')',
  '*',
  ',',
  ';',
  '+',
  '=',
  '@',
  ':',
  '[',
  ']',
];

type Question<TKeys extends readonly string[]> = {
  key: TKeys[number];
  choices: readonly string[];
};

type EncodingType = 'data' | 'hash';

type EncodedResult = {
  type: EncodingType;
  value: string;
};

type EncoderOptions = {
  charset?: string[];
  maxLength?: number;
};

type Encoder<
  TKeys extends readonly string[],
  TQuestions extends readonly Question<TKeys>[],
  TAnswers extends {
    [Key in TQuestions[number]['key']]: TQuestions[number]['choices'][number];
  }
> = {
  encode(answers: TAnswers): EncodedResult;
  decode(encoded: EncodedResult): TAnswers;
  options: Omit<EncoderOptions, 'charset'>;
  charset: string[];
};

export function createEncoder<
  const TKeys extends readonly string[],
  const TQuestions extends readonly Question<TKeys>[],
  const TAnswers extends {
    [Key in TQuestions[number]['key']]: TQuestions[number]['choices'][number];
  }
>(
  questions: [...TQuestions],
  options: EncoderOptions = {}
): Encoder<TKeys, TQuestions, TAnswers> {
  let answerSize = 1;
  const mostChoicesQuestion = questions.sort(
    (a, b) => b.choices.length - a.choices.length
  )[0];
  const charset = options.charset || VALID_URL_CHARS;

  if (mostChoicesQuestion.choices.length > charset.length) {
    while (mostChoicesQuestion.choices.length > charset.length * answerSize) {
      answerSize++;
    }
  }

  function encode(answers: TAnswers): EncodedResult {
    let type: EncodingType = 'data';
    const encodedAnswers = questions.map((question) =>
      encodeChoice(
        question.choices.indexOf(answers[question.key]),
        charset,
        answerSize
      )
    );
    const value = `${answerSize}${encodedAnswers.join('')}`;
    if (options.maxLength && value.length > options.maxLength) {
      type = 'hash';
    }
    return {
      type,
      value,
    };
  }

  function decode(encoded: EncodedResult): TAnswers {
    const { type, value } = encoded;
    if (type === 'hash') {
      throw new Error('Hash decoding is not yet supported');
    }
    const answerSize = parseInt(value[0], 10);
    let answers: Partial<TAnswers> = {};
    questions.forEach((question, i) => {
      let encodedAnswerParts = value
        .substring(i * answerSize + 1, (i + 1) * answerSize + 1)
        .split('');
      let choiceIndex = 0;
      while (encodedAnswerParts.length > 0) {
        choiceIndex += charset.indexOf(encodedAnswerParts.pop()!);
      }
      answers[question.key] = question.choices[
        choiceIndex
      ] as TAnswers[TKeys[number]];
    });
    return answers as TAnswers;
  }

  return { encode, decode, charset, options };
}

function encodeChoice(
  index: number,
  charset: string[],
  answerSize: number
): string {
  let s = '';
  for (let i = 0; i < answerSize - 1; i++) {
    s += charset[charset.length - 1];
  }
  s += charset[index - charset.length * (answerSize - 1)];
  return s;
}

// export function q<
//     const TKey extends string,
//     const TChoices extends readonly string[]
// >(key: TKey, choices: TChoices): Question2<TKey, TChoices> {
//     return { key, choices };
// }
