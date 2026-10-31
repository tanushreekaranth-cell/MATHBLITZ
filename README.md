# ⚡ MathBlitz: A Timed Mental Math Challenge

A fast-paced, responsive web application designed to train and test mental math agility across 12 rigorous Medium-level categories.

---

## 🚀 Features

- **12 Medium-Level Categories**:
  1. **Number Theory**: Prime vs composite identification, tricky composites (51, 91, 119), divisibility rules (3, 4, 6, 7, 8, 9, 11), factor counts, and remainders.
  2. **Powers and Exponents**: Exponent arithmetic ($2^5, 3^4, 4^3, 5^3$), power sum/difference evaluations, product rules ($b^x \times b^y = b^{x+y}$), and zero exponents.
  3. **Missing Number in Equations**: Solving for unknowns in linear expressions ($A \times ? + B = C$, $? - A = B$, $A \times ? = B$).
  4. **Addition**: Multi-digit additions with carries, 3-digit + 2-digit, 3-digit + 3-digit, and three-term mental sums.
  5. **HCF (GCD)**: Highest Common Factor of positive integers generated via coprime factors.
  6. **LCM**: Lowest Common Multiple strictly within mental math range, computed via $(A \times B) / \text{GCD}(A, B)$.
  7. **Fractions**: Fraction simplification to lowest terms, addition and subtraction with unlike denominators, multiplication, and reciprocal division.
  8. **Missing Number in Series**: Arithmetic progressions, second-order differences (+3, +5, +7...), geometric doubling with offsets, Fibonacci sequences, and quadratic patterns.
  9. **Square Numbers**: 2-digit squares ($13^2$ to $30^2$), square roots ($\sqrt{196}$ to $\sqrt{900}$), consecutive squares differences ($(n+1)^2 - n^2 = (n+1) + n$), and unit digit rules.
  10. **Calendar and Days**: Modulo 7 arithmetic for calculating future days, past days, relative offsets ("If 3 days ago was Thursday..."), and same-month dates.
  11. **Decimal Addition and Subtraction**: Precision decimal calculations handled in integer cents to eliminate IEEE 754 floating-point drift.
  12. **Decimal Multiplication and Division**: Powers of 10 scaling, place-value traps, and clean quotient mental division.

- **Game Modes**:
  - **Mixed Challenge**: Rapid-fire blitz randomly pulling from all 12 categories with 60s, 90s, or 120s round options.
  - **Practice Zone**: Select individual categories (or custom subsets) to practice at your own pace, in either timed mode or untimed (15 or 30 questions) with collapsible step-by-step mathematical tips.
  - **Difficulty Levels**: Features **Medium** difficulty as the featured default, with support for Easy and Hard scaling.

- **Game Mechanics**:
  - **Dynamic Timer**: Visual progress bar that shifts from cyan to warning amber and pulsing crimson under 15% remaining time.
  - **Streak Multipliers**:
    - $\ge 3$ streak: **1.5x**
    - $\ge 5$ streak: **2.0x**
    - $\ge 7$ streak: **3.0x**
  - **Speed Bonus**: Up to $+50$ points for quick mental responses under 3.5 seconds.
  - **Four Multiple-Choice Options**: Strictly 4 distinct choices with exactly one mathematically correct answer and 3 plausible distractors.
  - **Synthesized Audio Engine**: Built-in Web Audio API sound effects (correct chord, wrong buzzer, streak fanfare, countdown ticking, and game over trumpet) with mute/unmute toggle.
  - **High Scores & Leaderboard**: Saved in `localStorage`, filterable by mode, with personal best metrics previewed on the home screen.
  - **Detailed Results & Review**: Final accuracy percentage, max streak, average pace, category performance bars, and a step-by-step review with mathematical explanations for every attempted question.
  - **Keyboard Accessibility**: Use keys `1`, `2`, `3`, `4` or `A`, `B`, `C`, `D` to answer, and `Esc` to quit.

---

## 📁 File Structure

- [`index.html`](file:///c:/Users/tanus/OneDrive/Desktop/MATHBLITZ-A%20TIMED%20MENTAL%20MATH%20CHALLENGE/index.html) — Semantic HTML5 markup, screen views, modals, and accessible UI controls.
- [`style.css`](file:///c:/Users/tanus/OneDrive/Desktop/MATHBLITZ-A%20TIMED%20MENTAL%20MATH%20CHALLENGE/style.css) — Modern dark-arcade aesthetic with glowing accents, animations, and responsive mobile-first breakpoints.
- [`app.js`](file:///c:/Users/tanus/OneDrive/Desktop/MATHBLITZ-A%20TIMED%20MENTAL%20MATH%20CHALLENGE/app.js) — Pure vanilla JavaScript containing the 12 math generators, modulo 7 calendar engine, fraction reducer, audio synthesizer, and game state manager.
- [`test-generators.js`](file:///c:/Users/tanus/OneDrive/Desktop/MATHBLITZ-A%20TIMED%20MENTAL%20MATH%20CHALLENGE/test-generators.js) — Verification test script testing 12,000 question iterations across all categories.

---

## 🧪 Testing the Generators

To verify that all 12 categories generate valid questions with no duplicate options:

```bash
node test-generators.js
```

---

## 🌐 How to Run the App

Simply open [`index.html`](file:///c:/Users/tanus/OneDrive/Desktop/MATHBLITZ-A%20TIMED%20MENTAL%20MATH%20CHALLENGE/index.html) in any modern web browser, or serve it locally using any static web server (e.g. `npx serve` or Live Server).
