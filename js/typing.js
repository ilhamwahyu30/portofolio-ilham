/**
 * TYPEWRITER EFFECT CONTROLLER (typing.js)
 * Creates dynamic text typing & backspacing animations for portfolio titles.
 */

class TypeWriter {
  constructor(element, words, wait = 2500) {
    this.element = element;
    this.words = words;
    this.txt = '';
    this.wordIndex = 0;
    this.wait = parseInt(wait, 10);
    this.isDeleting = false;
    this.type();
  }

  type() {
    // Current index of word
    const current = this.wordIndex % this.words.length;
    // Get full text of current word
    const fullTxt = this.words[current];

    // Check if deleting
    if (this.isDeleting) {
      // Remove character
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      // Add character
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    // Insert txt into element
    this.element.innerHTML = `<span class="gradient-text">${this.txt}</span><span class="typing-cursor">|</span>`;

    // Initial Type Speed
    let typeSpeed = 120;

    if (this.isDeleting) {
      typeSpeed /= 2; // Deleting is faster
    }

    // If word is complete
    if (!this.isDeleting && this.txt === fullTxt) {
      // Make pause at end
      typeSpeed = this.wait;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      // Move to next word
      this.wordIndex++;
      // Pause before start typing
      typeSpeed = 400;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// Auto Init on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const typingElement = document.querySelector('[data-typewriter]') || document.getElementById('typewriter-text');
  
  if (typingElement) {
    const defaultWords = [
      'Full-Stack Developer',
      'Web Application Architect',
      'UI/UX & Frontend Specialist',
      'Cloud & DevOps Explorer'
    ];

    const wordsData = typingElement.getAttribute('data-words');
    const words = wordsData ? JSON.parse(wordsData) : defaultWords;
    const wait = typingElement.getAttribute('data-wait') || 2200;

    new TypeWriter(typingElement, words, wait);
  }
});

