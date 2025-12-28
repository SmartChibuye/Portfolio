// Questions data for ZamQuiz Champion

// Math Questions
const mathQuestions = [
  /* ... same as before, but I'll condense for the update ... */
  {
    question: "What is the value of π (pi) to two decimal places?",
    options: ["3.14", "3.12", "3.16", "3.18"],
    answer: "3.14",
    type: "multiple"
  },
  {
    question: "If a rectangle has a length of 12 cm and a width of 8 cm, what is its area?",
    options: ["96 cm²", "40 cm²", "20 cm²", "64 cm²"],
    answer: "96 cm²",
    type: "multiple"
  },
  {
    question: "Solve for x: 2x + 5 = 13",
    options: ["x = 4", "x = 6", "x = 8", "x = 3"],
    answer: "x = 4",
    type: "multiple"
  },
  {
    question: "Which of the following is a prime number?",
    options: ["21", "29", "15", "27"],
    answer: "29",
    type: "multiple"
  },
  {
    question: "The sum of angles in a triangle is 180 degrees.",
    options: ["True", "False"],
    answer: "True",
    type: "boolean"
  },
  {
    question: "What is the square root of 144?",
    options: ["12", "14", "10", "16"],
    answer: "12",
    type: "multiple"
  },
  {
    question: "If 2x - 3 = 7, then x equals ____.",
    answer: "5",
    type: "fill"
  },
  {
    question: "A right-angled triangle has sides of 3 cm and 4 cm. What is the length of the hypotenuse?",
    options: ["5 cm", "7 cm", "6 cm", "9 cm"],
    answer: "5 cm",
    type: "multiple"
  },
  {
    question: "What is the average of the numbers 10, 15, 20, 25, and 30?",
    options: ["20", "18", "22", "25"],
    answer: "20",
    type: "multiple"
  },
  {
    question: "Every square is a rectangle.",
    options: ["True", "False"],
    answer: "True",
    type: "boolean"
  },
  {
    question: "Every rectangle is a square.",
    options: ["True", "False"],
    answer: "False",
    type: "boolean"
  },
  {
    question: "If a = 5 and b = 3, what is the value of a² - b²?",
    options: ["16", "22", "25", "9"],
    answer: "16",
    type: "multiple"
  },
  {
    question: "The factors of 12 are ____.",
    answer: "1, 2, 3, 4, 6, 12",
    type: "fill"
  },
  {
    question: "What is the perimeter of a square with sides measuring 9 cm?",
    options: ["36 cm", "81 cm", "24 cm", "18 cm"],
    answer: "36 cm",
    type: "multiple"
  },
  {
    question: "In a class of 40 students, 25 play football. What percentage of students play football?",
    options: ["62.5%", "25%", "40%", "50%"],
    answer: "62.5%",
    type: "multiple"
  }
];

// Science Questions
const scienceQuestions = [
  {
    question: "Which of the following is NOT a state of matter?",
    options: ["Solid", "Liquid", "Gas", "Energy"],
    answer: "Energy",
    type: "multiple"
  },
  {
    question: "What is the chemical symbol for water?",
    options: ["H2O", "CO2", "O2", "NaCl"],
    answer: "H2O",
    type: "multiple"
  },
  {
    question: "Plants produce oxygen during photosynthesis.",
    options: ["True", "False"],
    answer: "True",
    type: "boolean"
  },
  {
    question: "Which organ is responsible for filtering blood in the human body?",
    options: ["Liver", "Kidney", "Heart", "Lungs"],
    answer: "Kidney",
    type: "multiple"
  },
  {
    question: "The closest planet to the Sun is ____.",
    answer: "Mercury",
    type: "fill"
  },
  {
    question: "What is the process by which plants make their own food called?",
    options: ["Respiration", "Photosynthesis", "Digestion", "Transpiration"],
    answer: "Photosynthesis",
    type: "multiple"
  },
  {
    question: "What is the main function of the lungs?",
    options: ["To pump blood", "To filter waste", "To exchange gases", "To digest food"],
    answer: "To exchange gases",
    type: "multiple"
  },
  {
    question: "Acids turn blue litmus paper red.",
    options: ["True", "False"],
    answer: "True",
    type: "boolean"
  },
  {
    question: "The Earth rotates around the Sun.",
    options: ["True", "False"],
    answer: "True",
    type: "boolean"
  },
  {
    question: "The human body has ____ pairs of chromosomes.",
    answer: "23",
    type: "fill"
  },
  {
    question: "Which of the following is a renewable energy source?",
    options: ["Coal", "Natural gas", "Solar energy", "Petroleum"],
    answer: "Solar energy",
    type: "multiple"
  },
  {
    question: "What is the unit of force?",
    options: ["Watt", "Joule", "Newton", "Ampere"],
    answer: "Newton",
    type: "multiple"
  },
  {
    question: "All living organisms are made up of cells.",
    options: ["True", "False"],
    answer: "True",
    type: "boolean"
  },
  {
    question: "Which of the following is NOT a primary color of light?",
    options: ["Red", "Green", "Blue", "Yellow"],
    answer: "Yellow",
    type: "multiple"
  },
  {
    question: "The human skeleton consists of ____ bones.",
    answer: "206",
    type: "fill"
  }
];

// ICT Questions
const ictQuestions = [
  {
    question: "What does CPU stand for?",
    options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Central Processor Unit"],
    answer: "Central Processing Unit",
    type: "multiple"
  },
  {
    question: "Which of the following is an input device?",
    options: ["Printer", "Monitor", "Keyboard", "Speaker"],
    answer: "Keyboard",
    type: "multiple"
  },
  {
    question: "What does URL stand for?",
    options: ["Universal Resource Locator", "Uniform Resource Locator", "Universal Reference Link", "Uniform Reference Link"],
    answer: "Uniform Resource Locator",
    type: "multiple"
  },
  {
    question: "RAM stands for Random Access Memory.",
    options: ["True", "False"],
    answer: "True",
    type: "boolean"
  },
  {
    question: "HTML is used for programming computer software.",
    options: ["True", "False"],
    answer: "False",
    type: "boolean"
  },
  {
    question: "The main circuit board in a computer is called a ____.",
    answer: "motherboard",
    type: "fill"
  },
  {
    question: "Which of these is NOT a web browser?",
    options: ["Chrome", "Firefox", "Excel", "Safari"],
    answer: "Excel",
    type: "multiple"
  },
  {
    question: "What does PDF stand for?",
    options: ["Personal Document Format", "Portable Document Format", "Printed Document Format", "Published Document Format"],
    answer: "Portable Document Format",
    type: "multiple"
  },
  {
    question: "A computer virus is a type of malware.",
    options: ["True", "False"],
    answer: "True",
    type: "boolean"
  },
  {
    question: "The permanent memory in a computer is called ____.",
    answer: "ROM",
    type: "fill"
  },
  {
    question: "Which of the following is a social media platform?",
    options: ["Microsoft Word", "Facebook", "PowerPoint", "Photoshop"],
    answer: "Facebook",
    type: "multiple"
  },
  {
    question: "In spreadsheet software, a cell is identified by its column and row.",
    options: ["True", "False"],
    answer: "True",
    type: "boolean"
  },
  {
    question: "What does Wi-Fi stand for?",
    options: ["Wireless Fidelity", "Wired Final", "Wireless Fiber", "Wired Fidelity"],
    answer: "Wireless Fidelity",
    type: "multiple"
  },
  {
    question: "The act of downloading a file from the internet to your computer is called ____.",
    answer: "downloading",
    type: "fill"
  },
  {
    question: "Which of these devices is used to connect to the internet?",
    options: ["Printer", "Scanner", "Modem", "Projector"],
    answer: "Modem",
    type: "multiple"
  }
];

// Civics Questions
const civicsQuestions = [
  {
    question: "What is the capital city of Zambia?",
    options: ["Livingstone", "Lusaka", "Ndola", "Kitwe"],
    answer: "Lusaka",
    type: "multiple"
  },
  {
    question: "How many colors are in the Zambian flag?",
    options: ["3", "4", "5", "6"],
    answer: "4",
    type: "multiple"
  },
  {
    question: "The first president of Zambia was ____.",
    answer: "Kenneth Kaunda",
    type: "fill"
  },
  {
    question: "Zambia gained independence in which year?",
    options: ["1960", "1963", "1964", "1970"],
    answer: "1964",
    type: "multiple"
  },
  {
    question: "The Zambian motto is 'One Zambia, One Nation'.",
    options: ["True", "False"],
    answer: "True",
    type: "boolean"
  },
  {
    question: "What do the colors in the Zambian flag represent?",
    options: ["Wildlife and nature", "People, mineral wealth, agriculture, and freedom", "The four major rivers", "The four major tribes"],
    answer: "People, mineral wealth, agriculture, and freedom",
    type: "multiple"
  },
  {
    question: "How many provinces does Zambia have?",
    options: ["7", "9", "10", "12"],
    answer: "10",
    type: "multiple"
  },
  {
    question: "The Zambian constitution is the highest law in the country.",
    options: ["True", "False"],
    answer: "True",
    type: "boolean"
  },
  {
    question: "Who has the power to make laws in Zambia?",
    options: ["The President", "Parliament", "The Courts", "Local Councils"],
    answer: "Parliament",
    type: "multiple"
  },
  {
    question: "Zambia shares borders with ____ countries.",
    answer: "8",
    type: "fill"
  },
  {
    question: "Which of these is NOT a neighboring country to Zambia?",
    options: ["Zimbabwe", "Malawi", "Kenya", "Tanzania"],
    answer: "Kenya",
    type: "multiple"
  },
  {
    question: "The Zambian national anthem is called 'Stand and Sing of Zambia, Proud and Free'.",
    options: ["True", "False"],
    answer: "True",
    type: "boolean"
  },
  {
    question: "What is the main religion in Zambia?",
    options: ["Islam", "Hinduism", "Christianity", "Traditional beliefs"],
    answer: "Christianity",
    type: "multiple"
  },
  {
    question: "The largest ethnic group in Zambia is ____.",
    answer: "Bemba",
    type: "fill"
  },
  {
    question: "Zambia is a landlocked country.",
    options: ["True", "False"],
    answer: "True",
    type: "boolean"
  }
];

// Function to get questions based on subject
function getQuestions(subject) {
  let defaults = [];
  switch (subject) {
    case 'math': defaults = mathQuestions; break;
    case 'science': defaults = scienceQuestions; break;
    case 'ict': defaults = ictQuestions; break;
    case 'civics': defaults = civicsQuestions; break;
  }

  // Combine with teacher's custom questions
  const customQuestions = JSON.parse(localStorage.getItem(`questions_${subject}`) || '[]');
  return [...defaults, ...customQuestions];
}

// Function to shuffle an array using Fisher-Yates algorithm
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Get random questions for a quiz
function getRandomQuestions(subject, count) {
  const allQuestions = getQuestions(subject);
  if (allQuestions.length === 0) return [];

  const shuffledQuestions = shuffleArray(allQuestions);
  return shuffledQuestions.slice(0, Math.min(count, shuffledQuestions.length));
}