/**
 * ============================================================================
 * MathBlitz: A Timed Mental Math Challenge
 * Core Application Engine
 *
 * Includes:
 * - 12 Medium-Level Random Question Generators
 * - Mathematically Sound Logic & Modulo 7 Calendar Arithmetic
 * - Fraction Simplification & Integer Safe Decimal Math
 * - Mixed Blitz & Category-Specific Practice Modes
 * - Dynamic Timers, Scoring, Streak Multipliers, and Accuracy Analytics
 * - Web Audio API Synthesized Sound Effects
 * - LocalStorage Persistence for High Scores & Settings
 * ============================================================================
 */

(() => {
  'use strict';

  /* ==========================================================================
     1. CONSTANTS & CATEGORY DEFINITIONS
     ========================================================================== */

  /**
   * The 12 official categories required by MathBlitz with their metadata.
   */
  const CATEGORIES = [
    {
      id: 'number_theory',
      name: 'Number Theory',
      icon: '🧩',
      desc: 'Primes, composites, divisibility & factors'
    },
    {
      id: 'powers_exponents',
      name: 'Powers & Exponents',
      icon: '⚡',
      desc: 'Base powers, exponent rules & arithmetic'
    },
    {
      id: 'missing_number_equations',
      name: 'Missing Number in Equations',
      icon: '❓',
      desc: 'Find the unknown in arithmetic expressions'
    },
    {
      id: 'addition',
      name: 'Addition',
      icon: '➕',
      desc: 'Multi-digit & multi-term mental addition'
    },
    {
      id: 'hcf',
      name: 'HCF (GCD)',
      icon: '📐',
      desc: 'Highest common factors of positive integers'
    },
    {
      id: 'lcm',
      name: 'LCM',
      icon: '🔄',
      desc: 'Lowest common multiples in mental range'
    },
    {
      id: 'fractions',
      name: 'Fractions',
      icon: '➗',
      desc: 'Simplification, addition, subtraction & multiplication'
    },
    {
      id: 'number_series',
      name: 'Missing Number in Series',
      icon: '🔢',
      desc: 'Arithmetic, geometric & quadratic patterns'
    },
    {
      id: 'square_numbers',
      name: 'Square Numbers',
      icon: '🔲',
      desc: '2-digit squares, square roots & differences'
    },
    {
      id: 'calendar_days',
      name: 'Calendar & Days',
      icon: '📅',
      desc: 'Day of week calculations using modulo 7'
    },
    {
      id: 'decimal_add_sub',
      name: 'Decimal Addition & Subtraction',
      icon: '🏷️',
      desc: 'Precise mental decimal arithmetic'
    },
    {
      id: 'decimal_mult_div',
      name: 'Decimal Mult & Division',
      icon: '✖️',
      desc: 'Place-value scaling & mental division'
    }
  ];

  const DAYS_OF_WEEK = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  /* ==========================================================================
     2. MATHEMATICAL UTILITIES
     ========================================================================== */

  /**
   * Euclidean Algorithm for Greatest Common Divisor (GCD/HCF)
   */
  function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  }

  /**
   * Lowest Common Multiple (LCM)
   */
  function lcm(a, b) {
    if (a === 0 || b === 0) return 0;
    return Math.abs(a * b) / gcd(a, b);
  }

  /**
   * Generate a random integer between min and max (inclusive)
   */
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Pick a random item from an array
   */
  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /**
   * Fisher-Yates array shuffle
   */
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /**
   * Reduces fraction (n/d) to lowest terms using GCD and formats as string.
   * If denominator is 1, returns integer string.
   */
  function formatFraction(n, d) {
    if (d === 0) return 'undefined';
    if (n === 0) return '0';
    const sign = (n < 0) ^ (d < 0) ? '-' : '';
    const absN = Math.abs(n);
    const absD = Math.abs(d);
    const g = gcd(absN, absD);
    const redN = absN / g;
    const redD = absD / g;
    if (redD === 1) return `${sign}${redN}`;
    return `${sign}${redN}/${redD}`;
  }

  /**
   * Checks if an integer is prime
   */
  function isPrime(n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    for (let i = 5; i * i <= n; i += 6) {
      if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
  }

  /**
   * Helper to assemble 4 strictly distinct multiple-choice options.
   * Takes the correct answer and a generator function that produces plausible distractors.
   */
  function buildOptions(correctVal, distractorGenerator) {
    const options = new Set();
    const correctStr = String(correctVal).trim();
    options.add(correctStr);

    let attempts = 0;
    while (options.size < 4 && attempts < 120) {
      attempts++;
      const dist = String(distractorGenerator(options.size)).trim();
      if (dist && dist !== correctStr && !options.has(dist)) {
        options.add(dist);
      }
    }

    // Mathematical fallback to guarantee exactly 4 unique choices
    let delta = 1;
    while (options.size < 4) {
      const num = Number(correctVal);
      let fallback;
      if (!isNaN(num)) {
        fallback = String(num + delta);
      } else {
        fallback = `${correctStr}-${delta}`;
      }
      if (!options.has(fallback)) {
        options.add(fallback);
      }
      delta = delta > 0 ? -delta : -delta + 1;
    }

    return shuffle(Array.from(options));
  }

  /* ==========================================================================
     3. QUESTION GENERATORS (12 CATEGORIES - MEDIUM LEVEL)
     ========================================================================== */

  /**
   * Category 1: Number Theory
   * Focuses on primes, tricky composites, divisibility rules, remainders, and factor counts.
   */
  function generateNumberTheory(diff) {
    const type = randInt(1, 5);
    let question, answer, explanation, options;

    if (type === 1) {
      // Prime identification with tricky composites
      const primes = [29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113];
      const trickyComposites = [51, 57, 87, 91, 119, 133, 143, 117, 93, 77, 69, 85, 95, 65, 121, 111];

      const correctPrime = pickRandom(primes);
      const chosenComposites = shuffle(trickyComposites).slice(0, 3);
      answer = String(correctPrime);
      question = 'Which of the following numbers is a PRIME number?';
      explanation = `${correctPrime} is prime because its only positive divisors are 1 and ${correctPrime}. The other options are composite numbers (e.g., 51 = 3 × 17, 91 = 7 × 13, 119 = 7 × 17).`;
      options = shuffle([answer, ...chosenComposites.map(String)]);
    } else if (type === 2) {
      // Composite identification
      const primes = [31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101];
      const composites = [
        { num: 51, fact: '3 × 17' },
        { num: 57, fact: '3 × 19' },
        { num: 87, fact: '3 × 29' },
        { num: 91, fact: '7 × 13' },
        { num: 119, fact: '7 × 17' },
        { num: 143, fact: '11 × 13' },
        { num: 117, fact: '9 × 13' },
        { num: 133, fact: '7 × 19' },
        { num: 77, fact: '7 × 11' }
      ];
      const chosenComp = pickRandom(composites);
      const chosenPrimes = shuffle(primes).slice(0, 3);
      answer = String(chosenComp.num);
      question = 'Which of the following numbers is COMPOSITE?';
      explanation = `${chosenComp.num} is composite because it factors into ${chosenComp.fact}. The other three options are prime numbers.`;
      options = shuffle([answer, ...chosenPrimes.map(String)]);
    } else if (type === 3) {
      // Divisibility tests
      const divisors = [3, 4, 6, 7, 8, 9, 11];
      const d = pickRandom(divisors);
      const q = randInt(25, 110);
      const divisibleNum = d * q;
      answer = String(divisibleNum);
      question = `Which of the following numbers is divisible by ${d}?`;

      const rules = {
        3: 'the sum of its digits is divisible by 3',
        4: 'its last two digits form a number divisible by 4',
        6: 'it is even and the sum of its digits is divisible by 3',
        7: 'it divides evenly by 7 with remainder 0',
        8: 'its last three digits form a number divisible by 8',
        9: 'the sum of its digits is divisible by 9',
        11: 'the alternating sum of its digits is divisible by 11'
      };
      explanation = `${divisibleNum} ÷ ${d} = ${q}. For divisibility by ${d}: ${rules[d]}.`;

      options = buildOptions(divisibleNum, () => {
        const offset = pickRandom([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const cand = divisibleNum + offset;
        return cand % d !== 0 ? cand : cand + 1;
      });
    } else if (type === 4) {
      // Remainder when divided by D
      const d = pickRandom([6, 7, 8, 9, 11, 12]);
      const rem = randInt(1, d - 1);
      const q = randInt(20, 85);
      const n = q * d + rem;
      answer = String(rem);
      question = `What is the remainder when ${n} is divided by ${d}?`;
      explanation = `${n} = ${d} × ${q} + ${rem}. Therefore, the remainder is ${rem}.`;
      options = buildOptions(rem, () => randInt(0, d - 1));
    } else {
      // Total factor counts
      const factorData = [
        { n: 24, count: 8, factors: '1, 2, 3, 4, 6, 8, 12, 24' },
        { n: 36, count: 9, factors: '1, 2, 3, 4, 6, 9, 12, 18, 36' },
        { n: 48, count: 10, factors: '1, 2, 3, 4, 6, 8, 12, 16, 24, 48' },
        { n: 60, count: 12, factors: '1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60' },
        { n: 72, count: 12, factors: '1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, 72' },
        { n: 80, count: 10, factors: '1, 2, 4, 5, 8, 10, 16, 20, 40, 80' },
        { n: 90, count: 12, factors: '1, 2, 3, 5, 6, 9, 10, 15, 18, 30, 45, 90' },
        { n: 100, count: 9, factors: '1, 2, 4, 5, 10, 20, 25, 50, 100' },
        { n: 120, count: 16, factors: '1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 24, 30, 40, 60, 120' }
      ];
      const item = pickRandom(factorData);
      answer = String(item.count);
      question = `How many total factors (divisors) does ${item.n} have?`;
      explanation = `The factors of ${item.n} are: ${item.factors} (giving ${item.count} total factors).`;
      options = buildOptions(item.count, () => pickRandom([item.count - 3, item.count - 2, item.count - 1, item.count + 1, item.count + 2, item.count + 4]));
    }

    return {
      categoryId: 'number_theory',
      categoryName: 'Number Theory',
      question,
      answer,
      options,
      explanation,
      hint: 'Remember: Primes have only 2 factors; composites have 3 or more. Check divisibility rules by summing digits (for 3 and 9) or examining last digits.'
    };
  }

  /**
   * Category 2: Powers and Exponents
   * Direct power evaluations, sums/differences of powers, power product/quotient laws.
   */
  function generatePowersAndExponents(diff) {
    const type = randInt(1, 4);
    let question, answer, explanation, options;

    if (type === 1) {
      // Direct power calculation
      const powers = [
        { b: 2, e: 5, ans: 32 },
        { b: 2, e: 6, ans: 64 },
        { b: 2, e: 7, ans: 128 },
        { b: 2, e: 8, ans: 256 },
        { b: 3, e: 3, ans: 27 },
        { b: 3, e: 4, ans: 81 },
        { b: 4, e: 3, ans: 64 },
        { b: 5, e: 3, ans: 125 },
        { b: 6, e: 3, ans: 216 },
        { b: 10, e: 3, ans: 1000 },
        { b: 11, e: 2, ans: 121 },
        { b: 12, e: 2, ans: 144 },
        { b: 15, e: 2, ans: 225 },
        { b: 20, e: 2, ans: 400 }
      ];
      const p = pickRandom(powers);
      answer = String(p.ans);
      question = `Evaluate: ${p.b}^${p.e}`;
      explanation = `${p.b}^${p.e} = ${Array(p.e).fill(p.b).join(' × ')} = ${p.ans}.`;
      options = buildOptions(p.ans, () => pickRandom([p.b * p.e, p.ans - p.b, p.ans + p.b, p.ans * 2, Math.floor(p.ans / 2), p.ans + 10]));
    } else if (type === 2) {
      // Sums / differences of powers
      const sub = randInt(1, 3);
      if (sub === 1) {
        const b1 = 2;
        const e1 = randInt(4, 6); // 16, 32, 64
        const b2 = 3;
        const e2 = randInt(2, 4); // 9, 27, 81
        const v1 = Math.pow(b1, e1);
        const v2 = Math.pow(b2, e2);
        const sum = v1 + v2;
        answer = String(sum);
        question = `Evaluate: ${b1}^${e1} + ${b2}^${e2}`;
        explanation = `${b1}^${e1} = ${v1} and ${b2}^${e2} = ${v2}. Thus ${v1} + ${v2} = ${sum}.`;
        options = buildOptions(sum, () => sum + pickRandom([-12, -10, -5, 5, 10, 12, 16]));
      } else if (sub === 2) {
        const pairs = [
          { exp: '5^3 - 4^3', v1: 125, v2: 64, ans: 61 },
          { exp: '2^6 - 2^4', v1: 64, v2: 16, ans: 48 },
          { exp: '3^4 - 2^5', v1: 81, v2: 32, ans: 49 },
          { exp: '6^3 - 5^3', v1: 216, v2: 125, ans: 91 },
          { exp: '4^3 - 3^3', v1: 64, v2: 27, ans: 37 }
        ];
        const p = pickRandom(pairs);
        answer = String(p.ans);
        question = `Evaluate: ${p.exp}`;
        explanation = `${p.v1} - ${p.v2} = ${p.ans}.`;
        options = buildOptions(p.ans, () => p.ans + pickRandom([-15, -10, -6, 6, 10, 15]));
      } else {
        const zeroBase = randInt(6, 19);
        const powBase = pickRandom([2, 3]);
        const exp = powBase === 2 ? randInt(3, 5) : randInt(2, 3);
        const powVal = Math.pow(powBase, exp);
        const total = 1 + powVal;
        answer = String(total);
        question = `Evaluate: ${zeroBase}^0 + ${powBase}^${exp}`;
        explanation = `Any non-zero base to power 0 equals 1 (${zeroBase}^0 = 1). Since ${powBase}^${exp} = ${powVal}, 1 + ${powVal} = ${total}.`;
        options = buildOptions(total, () => pickRandom([total - 1, total + 1, powVal, zeroBase + powVal, total + 10]));
      }
    } else if (type === 3) {
      // Exponent Product Law: b^x * b^y = b^(x+y)
      const b = pickRandom([2, 3, 5, 7]);
      const x = randInt(2, 6);
      const y = randInt(2, 6);
      const sum = x + y;
      answer = String(x);
      question = `If ${b}^x × ${b}^${y} = ${b}^${sum}, what is the value of x?`;
      explanation = `By the product of powers rule, ${b}^x × ${b}^${y} = ${b}^(x + ${y}). Therefore, x + ${y} = ${sum} ⟹ x = ${x}.`;
      options = buildOptions(x, () => pickRandom([y, sum, sum - 1, sum + 1, x + 2, Math.max(1, x - 2)]));
    } else {
      // Power of a Power Law: (b^p)^x = b^(p*x)
      const b = pickRandom([2, 3, 5]);
      const p = randInt(2, 4);
      const q = randInt(2, 4);
      const prod = p * q;
      answer = String(q);
      question = `If (${b}^${p})^x = ${b}^${prod}, what is the value of x?`;
      explanation = `Using (${b}^${p})^x = ${b}^(${p}x), we have ${p}x = ${prod} ⟹ x = ${q}.`;
      options = buildOptions(q, () => pickRandom([p, prod, p + q, Math.max(1, q - 1), q + 2]));
    }

    return {
      categoryId: 'powers_exponents',
      categoryName: 'Powers & Exponents',
      question,
      answer,
      options,
      explanation,
      hint: 'Key laws: bᵐ × bⁿ = bᵐ⁺ⁿ, (bᵐ)ⁿ = bᵐⁿ, and any non-zero number to power 0 is 1.'
    };
  }

  /**
   * Category 3: Missing Number in Equations
   * Single-variable arithmetic equations: additions, subtractions, multiplications, divisions, and two-step expressions.
   */
  function generateMissingNumberInEquations(diff) {
    const type = randInt(1, 4);
    let question, answer, explanation, options;

    if (type === 1) {
      // A + ? = B or ? + A = B
      const A = randInt(35, 140);
      const missing = randInt(25, 95);
      const B = A + missing;
      answer = String(missing);
      const flip = Math.random() < 0.5;
      question = flip ? `${A} + ? = ${B}` : `? + ${A} = ${B}`;
      explanation = `Subtract ${A} from ${B}: ${B} - ${A} = ${missing}.`;
      options = buildOptions(missing, () => missing + pickRandom([-10, -1, 1, 10, -9, 9, -20, 20]));
    } else if (type === 2) {
      // Subtraction: ? - A = B or A - ? = B
      const isFirst = Math.random() < 0.5;
      if (isFirst) {
        const A = randInt(28, 95);
        const B = randInt(35, 115);
        const missing = A + B;
        answer = String(missing);
        question = `? - ${A} = ${B}`;
        explanation = `Add ${A} to both sides: ? = ${B} + ${A} = ${missing}.`;
        options = buildOptions(missing, () => missing + pickRandom([-10, -1, 1, 10, -9, 9, -20]));
      } else {
        const B = randInt(25, 80);
        const missing = randInt(25, 80);
        const A = B + missing;
        answer = String(missing);
        question = `${A} - ? = ${B}`;
        explanation = `Rearrange: ? = ${A} - ${B} = ${missing}.`;
        options = buildOptions(missing, () => missing + pickRandom([-10, -1, 1, 10, -5, 5]));
      }
    } else if (type === 3) {
      // Multiplication / Division: A * ? = B or ? / A = B
      const isMult = Math.random() < 0.5;
      if (isMult) {
        const A = randInt(7, 18);
        const missing = randInt(7, 22);
        const B = A * missing;
        answer = String(missing);
        question = `${A} × ? = ${B}`;
        explanation = `Divide both sides by ${A}: ? = ${B} ÷ ${A} = ${missing}.`;
        options = buildOptions(missing, () => missing + pickRandom([-3, -2, -1, 1, 2, 3, 4]));
      } else {
        const A = randInt(6, 14);
        const B = randInt(8, 20);
        const missing = A * B;
        answer = String(missing);
        question = `? ÷ ${A} = ${B}`;
        explanation = `Multiply both sides by ${A}: ? = ${B} × ${A} = ${missing}.`;
        options = buildOptions(missing, () => missing + pickRandom([-A, A, -10, 10, -2 * A, 2 * A]));
      }
    } else {
      // Two-step equation: A * ? + B = C
      const A = randInt(3, 9);
      const missing = randInt(4, 15);
      const B = randInt(12, 45);
      const C = A * missing + B;
      answer = String(missing);
      question = `${A} × ? + ${B} = ${C}`;
      explanation = `Subtract ${B} from both sides: ${A} × ? = ${C - B}. Then divide by ${A}: ? = ${C - B} ÷ ${A} = ${missing}.`;
      options = buildOptions(missing, () => missing + pickRandom([-3, -2, -1, 1, 2, 3, 4]));
    }

    return {
      categoryId: 'missing_number_equations',
      categoryName: 'Missing Number in Equations',
      question,
      answer,
      options,
      explanation,
      hint: 'Isolate the unknown (?) by performing inverse operations in reverse order (PEMDAS backwards).'
    };
  }

  /**
   * Category 4: Addition
   * Mental addition: 2-digit double carries, 3-digit + 2-digit, 3-digit + 3-digit, and three-term sums.
   */
  function generateAddition(diff) {
    const type = randInt(1, 4);
    let question, answer, explanation, options;

    if (type === 1) {
      // Two 2-digit numbers with carries
      const a = randInt(48, 99);
      const b = randInt(38, 98);
      const sum = a + b;
      answer = String(sum);
      question = `Evaluate: ${a} + ${b}`;
      explanation = `${a} + ${b} = ${sum}. (Mental tip: ${a} + ${b} = (${a} + ${100 - (100 - b % 10)}) or split tens and units).`;
      options = buildOptions(sum, () => sum + pickRandom([-10, -1, 1, 10, -9, 9, -11, 11, -20, 20]));
    } else if (type === 2) {
      // 3-digit + 2-digit
      const a = randInt(160, 880);
      const b = randInt(45, 98);
      const sum = a + b;
      answer = String(sum);
      question = `Evaluate: ${a} + ${b}`;
      explanation = `${a} + ${b} = ${sum}.`;
      options = buildOptions(sum, () => sum + pickRandom([-10, -1, 1, 10, -9, 9, -100, 100]));
    } else if (type === 3) {
      // 3-digit + 3-digit
      const a = randInt(180, 580);
      const b = randInt(175, 490);
      const sum = a + b;
      answer = String(sum);
      question = `Evaluate: ${a} + ${b}`;
      explanation = `${a} + ${b} = ${sum}.`;
      options = buildOptions(sum, () => sum + pickRandom([-10, -1, 1, 10, -100, 100, -9, 9]));
    } else {
      // Three 2-digit numbers
      const a = randInt(25, 75);
      const b = randInt(25, 75);
      const c = randInt(25, 75);
      const sum = a + b + c;
      answer = String(sum);
      question = `Evaluate: ${a} + ${b} + ${c}`;
      explanation = `(${a} + ${b}) + ${c} = ${a + b} + ${c} = ${sum}.`;
      options = buildOptions(sum, () => sum + pickRandom([-10, -1, 1, 10, -9, 9, -20, 20]));
    }

    return {
      categoryId: 'addition',
      categoryName: 'Addition',
      question,
      answer,
      options,
      explanation,
      hint: 'Break numbers into tens and ones (e.g., 68 + 75 = 68 + 70 + 5 = 138 + 5 = 143).'
    };
  }

  /**
   * Category 5: HCF (Highest Common Factor / GCD)
   * Guaranteed positive integers. Uses known coprime pairs multiplied by a common factor.
   */
  function generateHCF(diff) {
    const g = pickRandom([6, 8, 9, 12, 14, 15, 16, 18, 20, 24, 25, 28, 30]);
    let x, y;
    do {
      x = randInt(2, 9);
      y = randInt(2, 9);
    } while (x === y || gcd(x, y) !== 1);

    const a = g * x;
    const b = g * y;
    const answer = String(g);
    const question = `Find the HCF (Highest Common Factor) of ${a} and ${b}.`;
    const explanation = `The greatest common factor of ${a} and ${b} is ${g}. (Notice ${a} = ${g} × ${x} and ${b} = ${g} × ${y}, where ${x} and ${y} share no common factor).`;

    const options = buildOptions(g, () => {
      const candidates = [
        Math.floor(g / 2),
        Math.floor(g / 3),
        g * 2,
        g + 2,
        g - 2,
        g + 4,
        Math.max(2, g - 4)
      ].filter(v => v > 0 && v !== g);
      return pickRandom(candidates);
    });

    return {
      categoryId: 'hcf',
      categoryName: 'HCF (GCD)',
      question,
      answer,
      options,
      explanation,
      hint: 'The HCF divides both numbers completely. Check the difference between the numbers or test common factors.'
    };
  }

  /**
   * Category 6: LCM (Lowest Common Multiple)
   * Guaranteed positive integers. Multiples kept within mental math range.
   */
  function generateLCM(diff) {
    const g = pickRandom([2, 3, 4, 5, 6, 7, 8, 9, 10]);
    let x, y;
    do {
      x = randInt(2, 7);
      y = randInt(2, 7);
    } while (x === y || gcd(x, y) !== 1 || g * x * y > 240);

    const a = g * x;
    const b = g * y;
    const correctLCM = g * x * y;
    const answer = String(correctLCM);
    const question = `Find the LCM (Lowest Common Multiple) of ${a} and ${b}.`;
    const explanation = `LCM(${a}, ${b}) = (${a} × ${b}) ÷ HCF(${a}, ${b}) = (${a} × ${b}) ÷ ${g} = ${correctLCM}.`;

    const options = buildOptions(correctLCM, () => {
      const candidates = [
        a * b,
        Math.floor(correctLCM / 2),
        correctLCM + g,
        correctLCM - g,
        correctLCM + a,
        correctLCM * 2
      ].filter(v => v > 0 && v !== correctLCM);
      return pickRandom(candidates);
    });

    return {
      categoryId: 'lcm',
      categoryName: 'LCM',
      question,
      answer,
      options,
      explanation,
      hint: 'LCM is the smallest number that both numbers divide into evenly: LCM = (a × b) / HCF(a, b).'
    };
  }

  /**
   * Category 7: Fractions
   * Simplification, addition, subtraction, multiplication, and division.
   * All results are strictly simplified to lowest terms where appropriate.
   */
  function generateFractions(diff) {
    const type = randInt(1, 4);
    let question, answer, explanation, options;

    if (type === 1) {
      // Fraction Simplification
      const basePairs = [
        [1, 2], [1, 3], [2, 3], [1, 4], [3, 4],
        [1, 5], [2, 5], [3, 5], [4, 5],
        [1, 6], [5, 6], [3, 8], [5, 8], [7, 8]
      ];
      const [num, den] = pickRandom(basePairs);
      const factor = randInt(3, 9);
      const rawNum = num * factor;
      const rawDen = den * factor;
      answer = formatFraction(num, den);
      question = `Simplify to lowest terms: ${rawNum}/${rawDen}`;
      explanation = `Divide both numerator and denominator by their GCD (${factor}): ${rawNum} ÷ ${factor} = ${num}, and ${rawDen} ÷ ${factor} = ${den}. Reduced fraction = ${answer}.`;

      options = buildOptions(answer, () => {
        const altNum = pickRandom([num + 1, Math.max(1, num - 1), num]);
        const altDen = pickRandom([den + 1, Math.max(2, den - 1), den]);
        return formatFraction(altNum, altDen);
      });
    } else if (type === 2) {
      // Fraction Addition
      const d1 = pickRandom([2, 3, 4, 5, 6]);
      const d2 = pickRandom([2, 3, 4, 5, 6]);
      const n1 = randInt(1, d1 - 1);
      const n2 = randInt(1, d2 - 1);

      const commonDen = lcm(d1, d2);
      const sumNum = n1 * (commonDen / d1) + n2 * (commonDen / d2);
      answer = formatFraction(sumNum, commonDen);
      question = `Evaluate: ${n1}/${d1} + ${n2}/${d2}`;
      explanation = `Common denominator is ${commonDen}: ${n1 * (commonDen / d1)}/${commonDen} + ${n2 * (commonDen / d2)}/${commonDen} = ${sumNum}/${commonDen} = ${answer}.`;

      options = buildOptions(answer, () => {
        const wrongNum = sumNum + pickRandom([-2, -1, 1, 2]);
        return formatFraction(wrongNum, commonDen);
      });
    } else if (type === 3) {
      // Fraction Subtraction
      const d1 = pickRandom([3, 4, 5, 6, 8]);
      const d2 = pickRandom([2, 3, 4, 6]);
      const n1 = randInt(2, d1);
      const n2 = randInt(1, d2 - 1);

      if (n1 * d2 <= n2 * d1) {
        return generateFractions(diff);
      }

      const commonDen = lcm(d1, d2);
      const diffNum = n1 * (commonDen / d1) - n2 * (commonDen / d2);
      answer = formatFraction(diffNum, commonDen);
      question = `Evaluate: ${n1}/${d1} - ${n2}/${d2}`;
      explanation = `Common denominator is ${commonDen}: ${n1 * (commonDen / d1)}/${commonDen} - ${n2 * (commonDen / d2)}/${commonDen} = ${diffNum}/${commonDen} = ${answer}.`;

      options = buildOptions(answer, () => {
        const wrongNum = Math.max(1, diffNum + pickRandom([-2, -1, 1, 2]));
        return formatFraction(wrongNum, commonDen);
      });
    } else {
      // Fraction Multiplication or Division
      const isMult = Math.random() < 0.5;
      const n1 = randInt(1, 5);
      const d1 = randInt(2, 6);
      const n2 = randInt(1, 5);
      const d2 = randInt(2, 6);

      if (isMult) {
        const resN = n1 * n2;
        const resD = d1 * d2;
        answer = formatFraction(resN, resD);
        question = `Evaluate: ${n1}/${d1} × ${n2}/${d2}`;
        explanation = `Multiply straight across: (${n1} × ${n2}) / (${d1} × ${d2}) = ${resN}/${resD} = ${answer}.`;
        options = buildOptions(answer, () => formatFraction(Math.max(1, resN + pickRandom([-1, 1])), resD));
      } else {
        const resN = n1 * d2;
        const resD = d1 * n2;
        answer = formatFraction(resN, resD);
        question = `Evaluate: ${n1}/${d1} ÷ ${n2}/${d2}`;
        explanation = `Multiply by reciprocal: ${n1}/${d1} × ${d2}/${n2} = ${resN}/${resD} = ${answer}.`;
        options = buildOptions(answer, () => formatFraction(Math.max(1, resN + pickRandom([-1, 1])), resD));
      }
    }

    return {
      categoryId: 'fractions',
      categoryName: 'Fractions',
      question,
      answer,
      options,
      explanation,
      hint: 'Find a common denominator for +/-. For division, multiply by the flipped second fraction (reciprocal).'
    };
  }

  /**
   * Category 8: Missing Number in Number Series
   * Clear patterns: arithmetic, increasing differences, doubling with offset, Fibonacci, or squares offset.
   */
  function generateNumberSeries(diff) {
    const type = randInt(1, 5);
    let series = [];
    let answer, explanation, missingIdx;

    if (type === 1) {
      // Arithmetic series with fixed step
      const step = pickRandom([6, 7, 8, 9, 11, 12, 13, 14, 15]);
      const start = randInt(10, 50);
      series = [start, start + step, start + 2 * step, start + 3 * step, start + 4 * step];
      missingIdx = pickRandom([2, 3, 4]);
      answer = String(series[missingIdx]);
      explanation = `The pattern is an arithmetic progression adding ${step} at each step.`;
    } else if (type === 2) {
      // Second-order difference (+3, +5, +7...)
      const start = randInt(2, 15);
      const baseDiff = pickRandom([2, 3, 4]);
      const stepInc = 2;
      series = [start];
      let curDiff = baseDiff;
      for (let i = 0; i < 4; i++) {
        series.push(series[series.length - 1] + curDiff);
        curDiff += stepInc;
      }
      missingIdx = pickRandom([3, 4]);
      answer = String(series[missingIdx]);
      explanation = `The differences between consecutive terms increase by ${stepInc} each time (+${baseDiff}, +${baseDiff + 2}, +${baseDiff + 4}, etc.).`;
    } else if (type === 3) {
      // Doubling with constant offset
      const start = randInt(3, 8);
      const mult = 2;
      const add = pickRandom([-1, 1, 2]);
      series = [start];
      for (let i = 0; i < 4; i++) {
        series.push(series[series.length - 1] * mult + add);
      }
      missingIdx = 4;
      answer = String(series[missingIdx]);
      explanation = `Each term is obtained by multiplying the previous term by 2 ${add >= 0 ? '+ ' + add : '- ' + Math.abs(add)}.`;
    } else if (type === 4) {
      // Fibonacci / Additive series
      const s1 = randInt(2, 6);
      const s2 = randInt(3, 7);
      series = [s1, s2, s1 + s2, s2 + (s1 + s2), (s1 + s2) + (s2 + (s1 + s2))];
      missingIdx = 4;
      answer = String(series[missingIdx]);
      explanation = `Each term is the sum of the two preceding terms (${series[2]} + ${series[3]} = ${series[4]}).`;
    } else {
      // Square offset: n^2 + k
      const offset = pickRandom([-2, -1, 1, 2, 3]);
      const startN = randInt(2, 4);
      series = [];
      for (let i = 0; i < 5; i++) {
        const n = startN + i;
        series.push(n * n + offset);
      }
      missingIdx = pickRandom([3, 4]);
      answer = String(series[missingIdx]);
      explanation = `The nth term follows the pattern n² ${offset >= 0 ? '+ ' + offset : '- ' + Math.abs(offset)} for consecutive integers.`;
    }

    const displayedSeries = series.map((v, i) => (i === missingIdx ? '?' : v)).join(', ');
    const question = `Find the missing number in the series: ${displayedSeries}`;
    const numAns = Number(answer);
    const options = buildOptions(answer, () => numAns + pickRandom([-4, -3, -2, -1, 1, 2, 3, 4, 5]));

    return {
      categoryId: 'number_series',
      categoryName: 'Missing Number in Series',
      question,
      answer,
      options,
      explanation,
      hint: 'Look at the differences between adjacent numbers. Are they constant, increasing, or multiplied?'
    };
  }

  /**
   * Category 9: Square Numbers
   * 2-digit squares, square roots, consecutive square differences, and unit digit rules.
   */
  function generateSquareNumbers(diff) {
    const type = randInt(1, 4);
    let question, answer, explanation, options;

    if (type === 1) {
      // Direct square calculation
      const n = randInt(13, 30);
      const sq = n * n;
      answer = String(sq);
      question = `What is the value of ${n}²?`;
      explanation = `${n}² = ${n} × ${n} = ${sq}. (Mental tip: for numbers ending in 5, e.g. 25², 2 × 3 = 6 ⟹ 625).`;
      options = buildOptions(sq, () => pickRandom([(n - 1) * (n - 1), (n + 1) * (n + 1), sq + 10, sq - 10, sq + 20, sq - 20, n * 2]));
    } else if (type === 2) {
      // Square roots
      const n = randInt(14, 30);
      const sq = n * n;
      answer = String(n);
      question = `Find the square root: √${sq}`;
      explanation = `Since ${n} × ${n} = ${sq}, √${sq} = ${n}.`;
      options = buildOptions(n, () => n + pickRandom([-3, -2, -1, 1, 2, 3, 4]));
    } else if (type === 3) {
      // Consecutive squares difference: (n+1)^2 - n^2 = (n+1) + n
      const n = randInt(15, 40);
      const nNext = n + 1;
      const diffVal = nNext + n;
      answer = String(diffVal);
      question = `Evaluate: ${nNext}² - ${n}²`;
      explanation = `Algebraic shortcut: a² - b² = (a - b)(a + b). Since (${nNext} - ${n}) = 1, ${nNext}² - ${n}² = ${nNext} + ${n} = ${diffVal}.`;
      options = buildOptions(diffVal, () => diffVal + pickRandom([-4, -2, -1, 1, 2, 4, 10]));
    } else {
      // Units digit of a square
      const n = randInt(23, 99);
      const lastDigit = n % 10;
      const unitDigit = (lastDigit * lastDigit) % 10;
      answer = String(unitDigit);
      question = `What is the units (last) digit of ${n}²?`;
      explanation = `The units digit of ${n}² depends strictly on the units digit of ${n}: ${lastDigit}² = ${lastDigit * lastDigit}, which ends in ${unitDigit}.`;
      options = buildOptions(unitDigit, () => pickRandom([0, 1, 4, 5, 6, 9]));
    }

    return {
      categoryId: 'square_numbers',
      categoryName: 'Square Numbers',
      question,
      answer,
      options,
      explanation,
      hint: 'Remember: (n + 1)² - n² = 2n + 1 (the sum of the two base numbers). Perfect squares only end in 0, 1, 4, 5, 6, or 9.'
    };
  }

  /**
   * Category 10: Calendar and Days
   * Correct modulo 7 day calculations: future days, past days, same-month dates, and relative day offsets.
   */
  function generateCalendarAndDays(diff) {
    const type = randInt(1, 4);
    let question, answer, explanation;

    if (type === 1) {
      // Future day calculation: (start + (N % 7)) % 7
      const startIdx = randInt(0, 6);
      const startDay = DAYS_OF_WEEK[startIdx];
      const n = randInt(15, 100);
      const rem = n % 7;
      const targetIdx = (startIdx + rem) % 7;
      answer = DAYS_OF_WEEK[targetIdx];
      question = `If today is ${startDay}, what day of the week will it be in ${n} days?`;
      explanation = `${n} days = ${Math.floor(n / 7)} weeks and ${rem} extra days (${n} mod 7 = ${rem}). Counting ${rem} days forward from ${startDay} lands on ${answer}.`;
    } else if (type === 2) {
      // Past day calculation: ((start - (N % 7)) % 7 + 7) % 7
      const startIdx = randInt(0, 6);
      const startDay = DAYS_OF_WEEK[startIdx];
      const n = randInt(15, 90);
      const rem = n % 7;
      const targetIdx = ((startIdx - rem) % 7 + 7) % 7;
      answer = DAYS_OF_WEEK[targetIdx];
      question = `If today is ${startDay}, what day of the week was it ${n} days ago?`;
      explanation = `${n} days ago = ${Math.floor(n / 7)} weeks and ${rem} extra days (${n} mod 7 = ${rem}). Counting ${rem} days backward from ${startDay} lands on ${answer}.`;
    } else if (type === 3) {
      // Same-month date shift
      const startDayIdx = randInt(0, 6);
      const startDayName = DAYS_OF_WEEK[startDayIdx];
      const date1 = randInt(2, 6);
      const date2 = randInt(22, 29);
      const diffDays = date2 - date1;
      const rem = diffDays % 7;
      const targetIdx = (startDayIdx + rem) % 7;
      answer = DAYS_OF_WEEK[targetIdx];
      question = `If the ${date1}th of a month is a ${startDayName}, what day of the week is the ${date2}th of the same month?`;
      explanation = `The difference is ${date2} - ${date1} = ${diffDays} days. ${diffDays} mod 7 = ${rem}. Advancing ${rem} days from ${startDayName} gives ${answer}.`;
    } else {
      // Relative reference: "If X days ago was [Day]..."
      const ago = randInt(2, 5);
      const pastDayIdx = randInt(0, 6);
      const pastDayName = DAYS_OF_WEEK[pastDayIdx];
      const ahead = randInt(15, 50);

      const todayIdx = (pastDayIdx + ago) % 7;
      const targetIdx = (todayIdx + (ahead % 7)) % 7;
      answer = DAYS_OF_WEEK[targetIdx];
      question = `If ${ago} days ago was ${pastDayName}, what day will it be ${ahead} days from today?`;
      explanation = `If ${ago} days ago was ${pastDayName}, today is ${DAYS_OF_WEEK[todayIdx]}. In ${ahead} days (${ahead} mod 7 = ${ahead % 7} days ahead), it will be ${answer}.`;
    }

    // Distractors: 3 other distinct days of the week
    const otherDays = DAYS_OF_WEEK.filter(d => d !== answer);
    const options = shuffle([answer, ...shuffle(otherDays).slice(0, 3)]);

    return {
      categoryId: 'calendar_days',
      categoryName: 'Calendar & Days',
      question,
      answer,
      options,
      explanation,
      hint: 'Use modulo 7: divide the number of days by 7 and only count the remainder forward (or backward).'
    };
  }

  /**
   * Category 11: Decimal Addition and Subtraction
   * Exact integer-scaled math (in cents) to prevent floating-point rounding errors.
   */
  function generateDecimalAddSub(diff) {
    const isAdd = Math.random() < 0.5;
    let question, answer, explanation, options;

    if (isAdd) {
      const aCents = randInt(1250, 7890);
      const bCents = randInt(850, 4550);
      const sumCents = aCents + bCents;
      const a = (aCents / 100).toFixed(2);
      const b = (bCents / 100).toFixed(2);
      const sum = (sumCents / 100).toFixed(2);
      answer = sum;
      question = `Evaluate: ${a} + ${b}`;
      explanation = `Align decimal points: ${a} + ${b} = ${sum}.`;

      options = buildOptions(sum, () => {
        const deltas = [-100, -10, -1, 1, 10, 100, -90, 90];
        const distCents = sumCents + pickRandom(deltas);
        return (distCents / 100).toFixed(2);
      });
    } else {
      const aCents = randInt(3500, 9500);
      const bCents = randInt(1200, aCents - 500);
      const diffCents = aCents - bCents;
      const a = (aCents / 100).toFixed(2);
      const b = (bCents / 100).toFixed(2);
      const diffStr = (diffCents / 100).toFixed(2);
      answer = diffStr;
      question = `Evaluate: ${a} - ${b}`;
      explanation = `Align decimal points: ${a} - ${b} = ${diffStr}.`;

      options = buildOptions(diffStr, () => {
        const deltas = [-100, -10, -1, 1, 10, 100, -90, 90];
        const distCents = diffCents + pickRandom(deltas);
        return (distCents / 100).toFixed(2);
      });
    }

    return {
      categoryId: 'decimal_add_sub',
      categoryName: 'Decimal Addition & Subtraction',
      question,
      answer,
      options,
      explanation,
      hint: 'Align decimals vertically. Treat the numbers like whole cents, calculate, then place the decimal back.'
    };
  }

  /**
   * Category 12: Decimal Multiplication and Division
   * Scaled mental math, place-value traps, and clean quotient division.
   */
  function generateDecimalMultDiv(diff) {
    const isMult = Math.random() < 0.5;
    let question, answer, explanation, options;

    if (isMult) {
      const items = [
        { a: 0.6, b: 0.7, ans: 0.42 },
        { a: 0.8, b: 0.9, ans: 0.72 },
        { a: 1.2, b: 0.4, ans: 0.48 },
        { a: 1.5, b: 0.6, ans: 0.90 },
        { a: 2.5, b: 1.4, ans: 3.50 },
        { a: 0.15, b: 6, ans: 0.90 },
        { a: 0.08, b: 25, ans: 2.00 },
        { a: 3.5, b: 0.4, ans: 1.40 },
        { a: 1.25, b: 8, ans: 10.00 },
        { a: 0.25, b: 16, ans: 4.00 },
        { a: 4.5, b: 0.6, ans: 2.70 },
        { a: 0.4, b: 0.05, ans: 0.02 }
      ];
      const it = pickRandom(items);
      answer = String(it.ans);
      question = `Evaluate: ${it.a} × ${it.b}`;
      explanation = `${it.a} × ${it.b} = ${it.ans}. (Mental trick: ignore the decimals to multiply whole numbers, then count the total decimal places).`;

      options = buildOptions(answer, () => {
        const multShifts = [it.ans * 10, it.ans / 10, it.ans * 0.1, it.ans + 0.1, it.ans - 0.1, it.ans * 2];
        return String(Number(pickRandom(multShifts).toFixed(3)));
      });
    } else {
      const items = [
        { a: 4.8, b: 0.6, ans: 8 },
        { a: 7.2, b: 0.9, ans: 8 },
        { a: 1.44, b: 1.2, ans: 1.2 },
        { a: 3.6, b: 0.09, ans: 40 },
        { a: 7.5, b: 1.5, ans: 5 },
        { a: 2.4, b: 0.08, ans: 30 },
        { a: 8.4, b: 0.7, ans: 12 },
        { a: 1.75, b: 0.25, ans: 7 },
        { a: 0.54, b: 0.06, ans: 9 },
        { a: 15.6, b: 3, ans: 5.2 },
        { a: 5.6, b: 0.8, ans: 7 },
        { a: 0.72, b: 0.08, ans: 9 }
      ];
      const it = pickRandom(items);
      answer = String(it.ans);
      question = `Evaluate: ${it.a} ÷ ${it.b}`;
      explanation = `${it.a} ÷ ${it.b} = ${it.ans}. (Mental trick: shift both decimal points by the same power of 10 to turn the divisor into a whole number).`;

      options = buildOptions(answer, () => {
        const divShifts = [it.ans * 10, it.ans / 10, it.ans + 1, it.ans - 1, it.ans * 2];
        return String(Number(pickRandom(divShifts).toFixed(2)));
      });
    }

    return {
      categoryId: 'decimal_mult_div',
      categoryName: 'Decimal Mult & Division',
      question,
      answer,
      options,
      explanation,
      hint: 'Multiply as whole numbers and place the decimal. For division, multiply both numerator and denominator by 10 or 100.'
    };
  }

  // Lookup map of generator functions
  const GENERATOR_MAP = {
    number_theory: generateNumberTheory,
    powers_exponents: generatePowersAndExponents,
    missing_number_equations: generateMissingNumberInEquations,
    addition: generateAddition,
    hcf: generateHCF,
    lcm: generateLCM,
    fractions: generateFractions,
    number_series: generateNumberSeries,
    square_numbers: generateSquareNumbers,
    calendar_days: generateCalendarAndDays,
    decimal_add_sub: generateDecimalAddSub,
    decimal_mult_div: generateDecimalMultDiv
  };

  /**
   * Master question dispatcher
   */
  function generateQuestion(categoryId, difficulty) {
    const gen = GENERATOR_MAP[categoryId];
    if (gen) {
      return gen(difficulty);
    }
    // Fallback to random category
    const randCat = pickRandom(Object.keys(GENERATOR_MAP));
    return GENERATOR_MAP[randCat](difficulty);
  }

  /* ==========================================================================
     4. AUDIO ENGINE (Web Audio API Synthesizer)
     ========================================================================== */

  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.enabled = localStorage.getItem('mathblitz_sound') !== 'false';
    }

    init() {
      if (!this.ctx && typeof AudioContext !== 'undefined') {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem('mathblitz_sound', this.enabled ? 'true' : 'false');
      return this.enabled;
    }

    playCorrect() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5

      osc2.frequency.setValueAtTime(659.25, now); // E5
      osc2.frequency.exponentialRampToValueAtTime(783.99, now + 0.12); // G5

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.32);
      osc2.stop(now + 0.32);
    }

    playWrong() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.28);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    }

    playTick() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    }

    playStreak() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noteStart = now + idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.15, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.18);
      });
    }

    playGameOver() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const notes = [440, 554.37, 659.25, 880];
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noteStart = now + idx * 0.14;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.2, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.4);
      });
    }
  }

  const sound = new SoundEngine();

  /* ==========================================================================
     5. LOCALSTORAGE HIGH SCORE & SETTINGS MANAGER
     ========================================================================== */

  const STORAGE_KEY_SCORES = 'mathblitz_highscores_v2';

  function getHighScores() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SCORES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('Failed to read high scores from localStorage', e);
      return [];
    }
  }

  function saveHighScore(record) {
    try {
      const scores = getHighScores();
      scores.push({
        ...record,
        date: new Date().toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        timestamp: Date.now()
      });
      // Sort descending by score
      scores.sort((a, b) => b.score - a.score);
      // Keep top 50 records
      const trimmed = scores.slice(0, 50);
      localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(trimmed));
      return scores[0].timestamp === record.timestamp; // True if this was an all-time personal best!
    } catch (e) {
      console.warn('Failed to save high score', e);
      return false;
    }
  }

  function clearHighScores() {
    localStorage.removeItem(STORAGE_KEY_SCORES);
  }

  /* ==========================================================================
     6. GAME STATE & APPLICATION CONTROLLER
     ========================================================================== */

  const state = {
    // Configuration
    mode: 'mixed', // 'mixed' | 'practice'
    difficulty: 'medium', // 'easy' | 'medium' | 'hard'
    mixedDuration: 90,
    practiceStyle: 'timed', // 'timed' | 'untimed'
    practiceDuration: 90,
    practiceQuestionTarget: 15,
    selectedCategoryIds: CATEGORIES.map(c => c.id), // All 12 by default

    // Active Game Session
    isPlaying: false,
    isAnswerLocked: false,
    currentQuestionIndex: 0,
    currentQuestion: null,
    score: 0,
    streak: 0,
    maxStreak: 0,
    correctCount: 0,
    totalAnswered: 0,
    timeRemaining: 90,
    timerInterval: null,
    questionStartTime: 0,
    sessionStartTime: 0,
    questionHistory: [] // [{ question, userAnswer, isCorrect, timeTaken, ... }]
  };

  /* ==========================================================================
     7. DOM ELEMENT REFERENCES
     ========================================================================== */

  const DOM = {
    // Screens
    screenHome: document.getElementById('screen-home'),
    screenGame: document.getElementById('screen-game'),
    screenResults: document.getElementById('screen-results'),

    // Header buttons
    brandHomeBtn: document.getElementById('brand-home-btn'),
    soundToggleBtn: document.getElementById('sound-toggle-btn'),
    soundIcon: document.getElementById('sound-icon'),
    leaderboardBtn: document.getElementById('leaderboard-btn'),
    helpBtn: document.getElementById('help-btn'),

    // Home screen elements
    tabMixed: document.getElementById('tab-mixed'),
    tabPractice: document.getElementById('tab-practice'),
    diffBtns: document.querySelectorAll('.diff-btn'),
    mixedSettings: document.getElementById('mixed-settings'),
    practiceSettings: document.getElementById('practice-settings'),
    mixedTimerPills: document.getElementById('mixed-timer-pills'),
    practiceStylePills: document.getElementById('practice-style-pills'),
    categoryGrid: document.getElementById('category-grid'),
    categorySelectionCount: document.getElementById('category-selection-count'),
    selectAllCatsBtn: document.getElementById('select-all-cats-btn'),
    clearAllCatsBtn: document.getElementById('clear-all-cats-btn'),
    startGameBtn: document.getElementById('start-game-btn'),

    // Quick Stats Bar
    quickBestScore: document.getElementById('quick-best-score'),
    quickBestStreak: document.getElementById('quick-best-streak'),
    quickBestAccuracy: document.getElementById('quick-best-accuracy'),

    // Gameplay elements
    quitGameBtn: document.getElementById('quit-game-btn'),
    hudTimerContainer: document.getElementById('hud-timer-container'),
    timerDisplay: document.getElementById('timer-display'),
    timerUnit: document.getElementById('timer-unit'),
    timerBar: document.getElementById('timer-bar'),
    streakDisplay: document.getElementById('streak-display'),
    multiplierBadge: document.getElementById('multiplier-badge'),
    scoreDisplay: document.getElementById('score-display'),
    scorePopup: document.getElementById('score-popup'),
    questionCategoryIcon: document.getElementById('question-category-icon'),
    questionCategoryName: document.getElementById('question-category-name'),
    questionCounter: document.getElementById('question-counter'),
    questionDiffBadge: document.getElementById('question-diff-badge'),
    questionText: document.getElementById('question-text'),
    optionsGrid: document.getElementById('options-grid'),
    practiceHintWrap: document.getElementById('practice-hint-wrap'),
    hintToggleBtn: document.getElementById('hint-toggle-btn'),
    hintContent: document.getElementById('hint-content'),
    feedbackBanner: document.getElementById('feedback-banner'),
    feedbackIcon: document.getElementById('feedback-icon'),
    feedbackHeadline: document.getElementById('feedback-headline'),
    feedbackSub: document.getElementById('feedback-sub'),

    // Results screen elements
    newHighscoreBadge: document.getElementById('new-highscore-badge'),
    resultsTitle: document.getElementById('results-title'),
    resultsSubtitle: document.getElementById('results-subtitle'),
    resScore: document.getElementById('res-score'),
    resAccuracy: document.getElementById('res-accuracy'),
    resAccuracyRatio: document.getElementById('res-accuracy-ratio'),
    resMaxStreak: document.getElementById('res-max-streak'),
    resAvgTime: document.getElementById('res-avg-time'),
    categoryBreakdownList: document.getElementById('category-breakdown-list'),
    reviewCount: document.getElementById('review-count'),
    reviewList: document.getElementById('review-list'),
    playAgainBtn: document.getElementById('play-again-btn'),
    changeModeBtn: document.getElementById('change-mode-btn'),
    viewLeaderboardBtn: document.getElementById('view-leaderboard-btn'),

    // Modals
    leaderboardModal: document.getElementById('leaderboard-modal'),
    closeLeaderboardBtn: document.getElementById('close-leaderboard-btn'),
    doneLeaderboardBtn: document.getElementById('done-leaderboard-btn'),
    scoresTbody: document.getElementById('scores-tbody'),
    scoresEmptyState: document.getElementById('scores-empty-state'),
    clearScoresBtn: document.getElementById('clear-scores-btn'),
    subTabs: document.querySelectorAll('.sub-tab'),

    helpModal: document.getElementById('help-modal'),
    closeHelpBtn: document.getElementById('close-help-btn'),
    doneHelpBtn: document.getElementById('done-help-btn'),

    exitModal: document.getElementById('exit-modal'),
    cancelExitBtn: document.getElementById('cancel-exit-btn'),
    cancelExitXBtn: document.getElementById('cancel-exit-x-btn'),
    confirmExitBtn: document.getElementById('confirm-exit-btn')
  };

  /* ==========================================================================
     8. UI RENDERERS & SCREEN SWITCHERS
     ========================================================================== */

  /**
   * Switch active screen with smooth transitions
   */
  function showScreen(screenEl) {
    [DOM.screenHome, DOM.screenGame, DOM.screenResults].forEach(s => s.classList.remove('active'));
    screenEl.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Render the 12 Category Selection Cards on Home Screen
   */
  function renderCategoryGrid() {
    DOM.categoryGrid.innerHTML = '';
    CATEGORIES.forEach(cat => {
      const isSelected = state.selectedCategoryIds.includes(cat.id);
      const card = document.createElement('div');
      card.className = `cat-item-card ${isSelected ? 'selected' : ''}`;
      card.dataset.id = cat.id;
      card.setAttribute('role', 'checkbox');
      card.setAttribute('aria-checked', isSelected ? 'true' : 'false');
      card.tabIndex = 0;

      card.innerHTML = `
        <div class="cat-item-checkbox">${isSelected ? '✓' : ''}</div>
        <span class="cat-item-icon">${cat.icon}</span>
        <div class="cat-item-info">
          <strong class="cat-item-name">${cat.name}</strong>
          <span class="cat-item-desc">${cat.desc}</span>
        </div>
      `;

      card.addEventListener('click', () => toggleCategory(cat.id, card));
      card.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          toggleCategory(cat.id, card);
        }
      });

      DOM.categoryGrid.appendChild(card);
    });

    updateCategoryCountLabel();
  }

  function toggleCategory(catId, cardEl) {
    const idx = state.selectedCategoryIds.indexOf(catId);
    if (idx > -1) {
      if (state.selectedCategoryIds.length <= 1) {
        // Prevent deselecting all
        return;
      }
      state.selectedCategoryIds.splice(idx, 1);
      cardEl.classList.remove('selected');
      cardEl.setAttribute('aria-checked', 'false');
      cardEl.querySelector('.cat-item-checkbox').textContent = '';
    } else {
      state.selectedCategoryIds.push(catId);
      cardEl.classList.add('selected');
      cardEl.setAttribute('aria-checked', 'true');
      cardEl.querySelector('.cat-item-checkbox').textContent = '✓';
    }
    updateCategoryCountLabel();
  }

  function updateCategoryCountLabel() {
    const count = state.selectedCategoryIds.length;
    DOM.categorySelectionCount.textContent = count === 12
      ? 'All 12 categories selected'
      : `${count} of 12 categories selected`;
  }

  /**
   * Update Quick Stats Banner on Home Screen from saved records
   */
  function updateQuickStatsBanner() {
    const scores = getHighScores();
    if (scores.length > 0) {
      const bestScore = Math.max(...scores.map(s => s.score));
      const bestStreak = Math.max(...scores.map(s => s.maxStreak || 0));
      const avgAccuracy = Math.round(
        scores.reduce((acc, cur) => acc + (cur.accuracy || 0), 0) / scores.length
      );

      DOM.quickBestScore.textContent = `${bestScore.toLocaleString()} pts`;
      DOM.quickBestStreak.textContent = `${bestStreak}`;
      DOM.quickBestAccuracy.textContent = `${avgAccuracy}%`;
    } else {
      DOM.quickBestScore.textContent = '0 pts';
      DOM.quickBestStreak.textContent = '0';
      DOM.quickBestAccuracy.textContent = '--%';
    }
  }

  /**
   * Update Sound Toggle Button Icon
   */
  function updateSoundUI() {
    DOM.soundIcon.textContent = sound.enabled ? '🔊' : '🔇';
    DOM.soundToggleBtn.title = sound.enabled ? 'Mute Sound' : 'Unmute Sound';
  }

  /* ==========================================================================
     9. GAME ENGINE & ROUND LIFECYCLE
     ========================================================================== */

  /**
   * Start a new Game Challenge Session
   */
  function startGame() {
    sound.init();

    // Reset session variables
    state.isPlaying = true;
    state.isAnswerLocked = false;
    state.currentQuestionIndex = 0;
    state.score = 0;
    state.streak = 0;
    state.maxStreak = 0;
    state.correctCount = 0;
    state.totalAnswered = 0;
    state.questionHistory = [];
    state.sessionStartTime = Date.now();

    // Configure Timer based on Mode
    const isUntimed = state.mode === 'practice' && state.practiceStyle === 'untimed';
    if (isUntimed) {
      DOM.hudTimerContainer.classList.add('hidden');
    } else {
      DOM.hudTimerContainer.classList.remove('hidden');
      const roundTime = state.mode === 'mixed' ? state.mixedDuration : state.practiceDuration;
      state.timeRemaining = roundTime;
      updateTimerUI(roundTime, roundTime);
      startRoundTimer(roundTime);
    }

    // Configure Practice Hint Wrap
    if (state.mode === 'practice') {
      DOM.practiceHintWrap.classList.remove('hidden');
      DOM.hintContent.classList.add('hidden');
      DOM.hintToggleBtn.textContent = '💡 Show Math Tip';
    } else {
      DOM.practiceHintWrap.classList.add('hidden');
    }

    // Reset HUD displays
    DOM.scoreDisplay.textContent = '0';
    DOM.streakDisplay.textContent = '0';
    DOM.multiplierBadge.textContent = '1.0x';
    DOM.feedbackBanner.className = 'feedback-banner';

    // Show Game Screen & Serve First Question
    showScreen(DOM.screenGame);
    nextQuestion();
  }

  /**
   * Round Timer Loop (1-second tick)
   */
  function startRoundTimer(totalRoundTime) {
    clearInterval(state.timerInterval);
    state.timerInterval = setInterval(() => {
      if (!state.isPlaying) return;

      state.timeRemaining--;
      updateTimerUI(state.timeRemaining, totalRoundTime);

      if (state.timeRemaining <= 5 && state.timeRemaining > 0) {
        sound.playTick();
      }

      if (state.timeRemaining <= 0) {
        clearInterval(state.timerInterval);
        endGame('Time expired!');
      }
    }, 1000);
  }

  /**
   * Update visual timer digits and progress bar
   */
  function updateTimerUI(currentSec, totalSec) {
    DOM.timerDisplay.textContent = Math.max(0, currentSec);
    const pct = Math.max(0, Math.min(100, (currentSec / totalSec) * 100));
    DOM.timerBar.style.width = `${pct}%`;

    DOM.timerBar.classList.remove('warning', 'danger');
    if (pct <= 15) {
      DOM.timerBar.classList.add('danger');
    } else if (pct <= 35) {
      DOM.timerBar.classList.add('warning');
    }
  }

  /**
   * Present next question to user
   */
  function nextQuestion() {
    state.isAnswerLocked = false;
    DOM.feedbackBanner.className = 'feedback-banner';
    DOM.hintContent.classList.add('hidden');
    DOM.hintToggleBtn.textContent = '💡 Show Math Tip';

    // Check if untimed practice question limit reached
    if (state.mode === 'practice' && state.practiceStyle === 'untimed') {
      if (state.currentQuestionIndex >= state.practiceQuestionTarget) {
        endGame('Practice Target Complete!');
        return;
      }
    }

    state.currentQuestionIndex++;
    state.questionStartTime = Date.now();

    // Select category: from pool of selected categories
    const pool = state.mode === 'mixed'
      ? CATEGORIES.map(c => c.id)
      : state.selectedCategoryIds;
    const catId = pickRandom(pool);
    const questionObj = generateQuestion(catId, state.difficulty);
    state.currentQuestion = questionObj;

    // Render Question Header Meta
    const catMeta = CATEGORIES.find(c => c.id === questionObj.categoryId) || { icon: '⚡', name: questionObj.categoryName };
    DOM.questionCategoryIcon.textContent = catMeta.icon;
    DOM.questionCategoryName.textContent = catMeta.name;
    DOM.questionCounter.textContent = `Question ${state.currentQuestionIndex}`;
    DOM.questionDiffBadge.textContent = state.difficulty.toUpperCase();

    // Render Question Text
    DOM.questionText.textContent = questionObj.question;

    // Render Practice Hint
    DOM.hintContent.textContent = questionObj.hint || questionObj.explanation;

    // Render 4 Multiple-Choice Buttons
    DOM.optionsGrid.innerHTML = '';
    const optionLabels = ['A', 'B', 'C', 'D'];

    questionObj.options.forEach((optVal, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-btn';
      btn.dataset.value = optVal;
      btn.dataset.key = String(idx + 1);

      btn.innerHTML = `
        <span class="option-key">${optionLabels[idx]}</span>
        <span class="option-text">${optVal}</span>
      `;

      btn.addEventListener('click', () => handleAnswer(optVal, btn));
      DOM.optionsGrid.appendChild(btn);
    });
  }

  /**
   * Handle user choice selection
   */
  function handleAnswer(selectedValue, buttonEl) {
    if (state.isAnswerLocked || !state.isPlaying) return;
    state.isAnswerLocked = true;

    const q = state.currentQuestion;
    const isCorrect = String(selectedValue).trim() === String(q.answer).trim();
    const timeTaken = (Date.now() - state.questionStartTime) / 1000;

    state.totalAnswered++;

    // Calculate Streak & Multiplier
    let multiplier = 1.0;
    if (isCorrect) {
      state.correctCount++;
      state.streak++;
      if (state.streak > state.maxStreak) {
        state.maxStreak = state.streak;
      }

      // Multiplier tiers: 3+ -> 1.5x, 5+ -> 2.0x, 7+ -> 3.0x
      if (state.streak >= 7) multiplier = 3.0;
      else if (state.streak >= 5) multiplier = 2.0;
      else if (state.streak >= 3) multiplier = 1.5;

      // Speed bonus: up to +50 points if answered within 3.5s
      const speedBonus = Math.max(0, Math.round((3.5 - Math.min(3.5, timeTaken)) * 15));
      const pointsGained = Math.round((100 + speedBonus) * multiplier);
      state.score += pointsGained;

      // Audio feedback
      if (state.streak % 5 === 0 && state.streak > 0) {
        sound.playStreak();
      } else {
        sound.playCorrect();
      }

      // Visual feedback on button
      buttonEl.classList.add('correct');

      // Score popup & streak animation
      showScorePopup(`+${pointsGained}`);
      DOM.feedbackHeadline.textContent = 'Correct!';
      DOM.feedbackSub.textContent = `+${pointsGained} pts • ${multiplier}x Streak Multiplier`;
      DOM.feedbackIcon.textContent = '✓';
      DOM.feedbackBanner.className = 'feedback-banner show correct';

    } else {
      // Wrong answer
      state.streak = 0;
      multiplier = 1.0;
      sound.playWrong();

      // Visual feedback: mark wrong, highlight correct answer
      buttonEl.classList.add('wrong');
      const allButtons = DOM.optionsGrid.querySelectorAll('.option-btn');
      allButtons.forEach(b => {
        if (String(b.dataset.value).trim() === String(q.answer).trim()) {
          b.classList.add('correct');
        }
      });

      DOM.feedbackHeadline.textContent = 'Incorrect!';
      DOM.feedbackSub.textContent = `Correct Answer: ${q.answer}`;
      DOM.feedbackIcon.textContent = '✕';
      DOM.feedbackBanner.className = 'feedback-banner show wrong';
    }

    // Update HUD metrics
    DOM.scoreDisplay.textContent = state.score.toLocaleString();
    DOM.streakDisplay.textContent = state.streak;
    DOM.multiplierBadge.textContent = `${multiplier.toFixed(1)}x`;

    // Record question history for review
    state.questionHistory.push({
      categoryId: q.categoryId,
      categoryName: q.categoryName,
      question: q.question,
      userAnswer: selectedValue,
      correctAnswer: q.answer,
      isCorrect,
      timeTaken: timeTaken.toFixed(1),
      explanation: q.explanation
    });

    // Pause briefly before advancing to next question
    const delay = isCorrect ? 550 : 1200;
    setTimeout(() => {
      if (state.isPlaying) {
        nextQuestion();
      }
    }, delay);
  }

  /**
   * Floating points animation near score badge
   */
  function showScorePopup(text) {
    DOM.scorePopup.textContent = text;
    DOM.scorePopup.classList.remove('animate');
    void DOM.scorePopup.offsetWidth; // Trigger reflow
    DOM.scorePopup.classList.add('animate');
  }

  /**
   * Conclude game session and present results
   */
  function endGame(reason) {
    state.isPlaying = false;
    clearInterval(state.timerInterval);

    sound.playGameOver();

    // Calculate final metrics
    const accuracy = state.totalAnswered > 0
      ? Math.round((state.correctCount / state.totalAnswered) * 100)
      : 0;

    const totalSessionSeconds = (Date.now() - state.sessionStartTime) / 1000;
    const avgTimePerQ = state.totalAnswered > 0
      ? (totalSessionSeconds / state.totalAnswered).toFixed(1)
      : '0.0';

    // Populate Results Screen
    DOM.resScore.textContent = state.score.toLocaleString();
    DOM.resAccuracy.textContent = `${accuracy}%`;
    DOM.resAccuracyRatio.textContent = `${state.correctCount} / ${state.totalAnswered} correct`;
    DOM.resMaxStreak.textContent = `🔥 ${state.maxStreak}`;
    DOM.resAvgTime.textContent = `${avgTimePerQ}s`;

    // Save Record to LocalStorage
    const isNewBest = saveHighScore({
      mode: state.mode === 'mixed' ? 'Mixed Challenge' : 'Practice Zone',
      difficulty: state.difficulty,
      score: state.score,
      accuracy,
      maxStreak: state.maxStreak,
      totalQuestions: state.totalAnswered
    });

    if (isNewBest && state.score > 0) {
      DOM.newHighscoreBadge.classList.remove('hidden');
    } else {
      DOM.newHighscoreBadge.classList.add('hidden');
    }

    // Render Category Breakdown
    renderCategoryBreakdown();

    // Render Question Review List
    renderQuestionReviewList();

    // Update Quick Stats for future reference
    updateQuickStatsBanner();

    // Transition to Results Screen
    showScreen(DOM.screenResults);
  }

  /**
   * Render Category Performance Breakdown cards on Results Screen
   */
  function renderCategoryBreakdown() {
    DOM.categoryBreakdownList.innerHTML = '';
    const catStats = {};

    state.questionHistory.forEach(item => {
      if (!catStats[item.categoryId]) {
        catStats[item.categoryId] = {
          name: item.categoryName,
          correct: 0,
          total: 0
        };
      }
      catStats[item.categoryId].total++;
      if (item.isCorrect) catStats[item.categoryId].correct++;
    });

    Object.keys(catStats).forEach(catId => {
      const stat = catStats[catId];
      const pct = Math.round((stat.correct / stat.total) * 100);
      const meta = CATEGORIES.find(c => c.id === catId) || { icon: '📊' };

      const itemEl = document.createElement('div');
      itemEl.className = 'breakdown-item';
      itemEl.innerHTML = `
        <div class="breakdown-top">
          <span class="breakdown-name">${meta.icon} ${stat.name}</span>
          <span class="breakdown-score">${stat.correct}/${stat.total} (${pct}%)</span>
        </div>
        <div class="breakdown-progress-track">
          <div class="breakdown-progress-fill" style="width: ${pct}%"></div>
        </div>
      `;
      DOM.categoryBreakdownList.appendChild(itemEl);
    });

    if (Object.keys(catStats).length === 0) {
      DOM.categoryBreakdownList.innerHTML = '<p class="empty-state">No questions completed.</p>';
    }
  }

  /**
   * Render Step-by-Step Question Review on Results Screen
   */
  function renderQuestionReviewList() {
    DOM.reviewList.innerHTML = '';
    DOM.reviewCount.textContent = `${state.questionHistory.length} questions attempted`;

    state.questionHistory.forEach((q, idx) => {
      const itemEl = document.createElement('div');
      itemEl.className = `review-item ${q.isCorrect ? 'is-correct' : 'is-wrong'}`;

      itemEl.innerHTML = `
        <div class="review-item-header">
          <span class="review-item-cat">${q.categoryName} • Q#${idx + 1} (${q.timeTaken}s)</span>
          <span class="review-status-badge ${q.isCorrect ? 'correct' : 'wrong'}">
            ${q.isCorrect ? '✓ Correct' : '✕ Incorrect'}
          </span>
        </div>
        <div class="review-question-text">${q.question}</div>
        <div class="review-answers-row">
          <div class="review-ans-group">
            <strong>Your Answer:</strong> <span style="color: ${q.isCorrect ? 'var(--emerald)' : 'var(--rose)'}; font-weight: 700;">${q.userAnswer}</span>
          </div>
          ${!q.isCorrect ? `
            <div class="review-ans-group">
              <strong>Correct Answer:</strong> <span style="color: var(--emerald); font-weight: 700;">${q.correctAnswer}</span>
            </div>
          ` : ''}
        </div>
        <div class="review-explanation">
          💡 <strong>Explanation:</strong> ${q.explanation}
        </div>
      `;

      DOM.reviewList.appendChild(itemEl);
    });
  }

  /* ==========================================================================
     10. LEADERBOARD / MODAL CONTROLLER
     ========================================================================== */

  function openLeaderboardModal(filter = 'all') {
    renderLeaderboardTable(filter);
    DOM.leaderboardModal.classList.remove('hidden');
  }

  function renderLeaderboardTable(filter) {
    const scores = getHighScores();
    DOM.scoresTbody.innerHTML = '';

    const filtered = scores.filter(item => {
      if (filter === 'all') return true;
      if (filter === 'mixed') return item.mode.includes('Mixed');
      if (filter === 'practice') return item.mode.includes('Practice');
      return true;
    });

    if (filtered.length === 0) {
      DOM.scoresEmptyState.classList.remove('hidden');
    } else {
      DOM.scoresEmptyState.classList.add('hidden');
      filtered.forEach((rec, idx) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><strong>#${idx + 1}</strong></td>
          <td>${rec.mode}</td>
          <td><span class="diff-indicator">${rec.difficulty || 'medium'}</span></td>
          <td style="color: var(--cyan); font-weight: 800;">${rec.score.toLocaleString()}</td>
          <td>${rec.accuracy || 0}%</td>
          <td style="color: var(--text-dim); font-size: 0.8rem;">${rec.date}</td>
        `;
        DOM.scoresTbody.appendChild(row);
      });
    }
  }

  /* ==========================================================================
     11. EVENT LISTENERS & INITIALIZATION
     ========================================================================== */

  function setupEventListeners() {
    // Brand header returns to home
    DOM.brandHomeBtn.addEventListener('click', () => {
      if (state.isPlaying) {
        DOM.exitModal.classList.remove('hidden');
      } else {
        showScreen(DOM.screenHome);
      }
    });

    // Sound Toggle
    DOM.soundToggleBtn.addEventListener('click', () => {
      sound.toggle();
      updateSoundUI();
    });

    // Leaderboard Modal Open/Close
    DOM.leaderboardBtn.addEventListener('click', () => openLeaderboardModal('all'));
    DOM.viewLeaderboardBtn.addEventListener('click', () => openLeaderboardModal('all'));
    DOM.closeLeaderboardBtn.addEventListener('click', () => DOM.leaderboardModal.classList.add('hidden'));
    DOM.doneLeaderboardBtn.addEventListener('click', () => DOM.leaderboardModal.classList.add('hidden'));

    // Leaderboard Filters
    DOM.subTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        DOM.subTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderLeaderboardTable(tab.dataset.filter);
      });
    });

    // Clear Scores
    DOM.clearScoresBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all high scores and records?')) {
        clearHighScores();
        renderLeaderboardTable('all');
        updateQuickStatsBanner();
      }
    });

    // Help Modal Open/Close
    DOM.helpBtn.addEventListener('click', () => DOM.helpModal.classList.remove('hidden'));
    DOM.closeHelpBtn.addEventListener('click', () => DOM.helpModal.classList.add('hidden'));
    DOM.doneHelpBtn.addEventListener('click', () => DOM.helpModal.classList.add('hidden'));

    // Mode Selection Tabs
    DOM.tabMixed.addEventListener('click', () => {
      state.mode = 'mixed';
      DOM.tabMixed.classList.add('active');
      DOM.tabPractice.classList.remove('active');
      DOM.tabMixed.setAttribute('aria-selected', 'true');
      DOM.tabPractice.setAttribute('aria-selected', 'false');

      DOM.mixedSettings.classList.remove('hidden');
      DOM.practiceSettings.classList.add('hidden');
      DOM.startGameBtn.querySelector('.cta-text').textContent = 'Start Mixed Challenge';
    });

    DOM.tabPractice.addEventListener('click', () => {
      state.mode = 'practice';
      DOM.tabPractice.classList.add('active');
      DOM.tabMixed.classList.remove('active');
      DOM.tabPractice.setAttribute('aria-selected', 'true');
      DOM.tabMixed.setAttribute('aria-selected', 'false');

      DOM.mixedSettings.classList.add('hidden');
      DOM.practiceSettings.classList.remove('hidden');
      DOM.startGameBtn.querySelector('.cta-text').textContent = 'Start Practice Session';
    });

    // Difficulty Selector
    DOM.diffBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        DOM.diffBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
        state.difficulty = btn.dataset.diff;
      });
    });

    // Mixed Timer Duration Pills
    DOM.mixedTimerPills.querySelectorAll('.pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        DOM.mixedTimerPills.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.mixedDuration = parseInt(btn.dataset.time, 10);
      });
    });

    // Practice Style Pills (Timed vs Untimed)
    DOM.practiceStylePills.querySelectorAll('.pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        DOM.practiceStylePills.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.practiceStyle = btn.dataset.style;
        if (btn.dataset.time) state.practiceDuration = parseInt(btn.dataset.time, 10);
        if (btn.dataset.count) state.practiceQuestionTarget = parseInt(btn.dataset.count, 10);
      });
    });

    // Practice Category Select All / Clear All
    DOM.selectAllCatsBtn.addEventListener('click', () => {
      state.selectedCategoryIds = CATEGORIES.map(c => c.id);
      renderCategoryGrid();
    });

    DOM.clearAllCatsBtn.addEventListener('click', () => {
      // Leave at least the first category selected
      state.selectedCategoryIds = [CATEGORIES[0].id];
      renderCategoryGrid();
    });

    // Start Challenge CTA
    DOM.startGameBtn.addEventListener('click', () => startGame());

    // Practice Hint Toggle in Game
    DOM.hintToggleBtn.addEventListener('click', () => {
      const isHidden = DOM.hintContent.classList.toggle('hidden');
      DOM.hintToggleBtn.textContent = isHidden ? '💡 Show Math Tip' : 'Hide Math Tip';
    });

    // Quit Challenge confirmation
    DOM.quitGameBtn.addEventListener('click', () => {
      DOM.exitModal.classList.remove('hidden');
    });

    DOM.cancelExitBtn.addEventListener('click', () => DOM.exitModal.classList.add('hidden'));
    DOM.cancelExitXBtn.addEventListener('click', () => DOM.exitModal.classList.add('hidden'));
    DOM.confirmExitBtn.addEventListener('click', () => {
      DOM.exitModal.classList.add('hidden');
      state.isPlaying = false;
      clearInterval(state.timerInterval);
      showScreen(DOM.screenHome);
    });

    // Results Actions
    DOM.playAgainBtn.addEventListener('click', () => startGame());
    DOM.changeModeBtn.addEventListener('click', () => showScreen(DOM.screenHome));

    // Keyboard Shortcuts: 1, 2, 3, 4 or A, B, C, D to answer; Esc to exit
    window.addEventListener('keydown', (e) => {
      // Don't intercept if modals are open
      const isAnyModalOpen = !DOM.leaderboardModal.classList.contains('hidden') ||
                             !DOM.helpModal.classList.contains('hidden') ||
                             !DOM.exitModal.classList.contains('hidden');

      if (e.key === 'Escape') {
        if (isAnyModalOpen) {
          DOM.leaderboardModal.classList.add('hidden');
          DOM.helpModal.classList.add('hidden');
          DOM.exitModal.classList.add('hidden');
        } else if (state.isPlaying) {
          DOM.exitModal.classList.remove('hidden');
        }
        return;
      }

      if (!state.isPlaying || state.isAnswerLocked || isAnyModalOpen) return;

      let keyIndex = -1;
      if (e.key === '1' || e.key.toLowerCase() === 'a') keyIndex = 0;
      else if (e.key === '2' || e.key.toLowerCase() === 'b') keyIndex = 1;
      else if (e.key === '3' || e.key.toLowerCase() === 'c') keyIndex = 2;
      else if (e.key === '4' || e.key.toLowerCase() === 'd') keyIndex = 3;

      if (keyIndex >= 0) {
        const optionButtons = DOM.optionsGrid.querySelectorAll('.option-btn');
        if (optionButtons[keyIndex]) {
          optionButtons[keyIndex].click();
        }
      }
    });

    // Modal background click to close
    [DOM.leaderboardModal, DOM.helpModal, DOM.exitModal].forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
        }
      });
    });
  }

  /**
   * Application Bootstrapper
   */
  function init() {
    updateSoundUI();
    renderCategoryGrid();
    updateQuickStatsBanner();
    setupEventListeners();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
