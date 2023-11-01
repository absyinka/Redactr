document
  .getElementById('submitButton')
  .addEventListener('click', function (event) {
    event.preventDefault()

    const startTime = performance.now()
    const messageField = document.getElementById('message').value.trim()
    const wordsField = document.getElementById('words').value.trim()
    const redactCharsField = document.getElementById('redactChars').value.trim()
    const redactrOutput = document.getElementById('redactrOutput')
    const statsOutput = document.getElementById('stats')

    let redactedText = redactrEngine(messageField, wordsField, redactCharsField)
    const endtime = performance.now()
    const timeTaken = endtime - startTime

    if (redactedText) {
      redactrOutput.innerHTML = `<h4><strong>REDACTED WORD:</strong></h4> <p>${redactedText}</p>`
      redactrOutput.style.visibility = 'visible'
      redactrOutput.style.color = '#f33'
    }

    const { totalWordCount, matchedWordCount, scrambledWordCharCount } =
      getStats(messageField, wordsField)

    let stats = `<h4><strong>REDACTR STATS:</strong><h4>
                  <p>Scanned Word Count: ${totalWordCount}</p>
                  <p>Matched Word Count: ${matchedWordCount}</p>
                  <p>Scrambled Character Count: ${scrambledWordCharCount}</p>
                  <p>Process Time: ${timeTaken.toFixed(3)} milliseconds</p>`

    if (totalWordCount > 0) {
      statsOutput.innerHTML = stats
      statsOutput.style.visibility = 'visible'
      statsOutput.style.color = 'green'
    }
  })

function redactrEngine(originalText, redactedWordsString, redactValue) {
  const textWithoutSpecialChar = cleanWord(originalText)

  const wordsToRedact = redactedWordsString.split(',')

  const trimmedWordsToRedact = wordsToRedact.map((word) => word.trim())

  if (isNullOrWhitespace(redactValue)) {
    redactValue = '***'
  }

  const regexPattern = trimmedWordsToRedact
    .map((word) => word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
    .join('|')

  const redactedText = originalText.replace(
    new RegExp(`\\b(${regexPattern})\\b`, 'gi'),
    redactValue
  )

  return redactedText
}

function getStats(originalText, redactedWordsString) {
  const cleanedWord = cleanWord(originalText)
  const originalWords = cleanedWord.split(/\s+/)
  const cleanRedactedText = cleanWord(redactedWordsString)
  const arrayOfWordsToScramble = cleanRedactedText.split(/\s+/)
  const redactedText = removeSpecialCharsAndWhitespace(cleanRedactedText)

  let totalWordCount = originalWords.length
  let matchedWordCount = countMatchingItems(
    originalWords,
    arrayOfWordsToScramble
  )

  let scrambledWordCharCount = redactedText.length

  return { totalWordCount, matchedWordCount, scrambledWordCharCount }
}

function removeSpecialCharsAndWhitespace(sentence) {
  const regex = /[-\/\\^$*+?.()|[\]{}_\s]/g
  const cleanedSentence = sentence.replace(regex, '')
  return cleanedSentence
}

function countMatchingItems(array1, array2) {
  let count = 0

  for (const item1 of array1) {
    for (const item2 of array2) {
      if (item1.toLowerCase() === item2.toLowerCase()) {
        count++
        break
      }
    }
  }

  return count
}

function isNullOrWhitespace(input) {
  return input === null || input.trim() === ''
}

function cleanWord(word) {
  const cleanedWord = word.replace(/[!@#$%^&*()_+{}\[\]:;"'<>,.?~\\/-]/g, ' ')
  return cleanedWord
}
