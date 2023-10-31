document
  .getElementById('submitButton')
  .addEventListener('click', function (event) {
    event.preventDefault()

    let message = document.getElementById('message').value

    let wordsToScramble = document.getElementById('words').value

    let wordSplit = wordsToScramble.split(',')

    let redactStringCharacters =
      document.getElementById('redactCharacters').value

    let redactedWord = replaceWordsWithAsterisks(
      message,
      wordSplit,
      redactStringCharacters
    )
    let output = document.getElementById('redactrOutput')
    let statsOutput = document.getElementById('stats')

    if (redactedWord) {
      output.innerHTML = `<h4><strong>REDACTED WORD:</strong></h4> <p>${redactedWord}</p>`
      output.style.visibility = 'visible'
      output.style.color = '#f33'
    }

    const { totalWordCount, matchedWordCount, scrambledWordCharCount } = getStats(
      message,
      wordSplit
    )

    let stats = `<h4><strong>REDACTR STATS:</strong><h4>
                  <p>Scanned Word Count: ${totalWordCount}</p>
                  <p>Matched Word Count:${matchedWordCount}</p>
                  <p>Scrambled Character Count: ${scrambledWordCharCount}</p>`

    if (totalWordCount > 0) {
      statsOutput.innerHTML = stats
      statsOutput.style.visibility = 'visible'
      statsOutput.style.color = 'green'
    }
  })

function replaceWordsWithAsterisks(
  inputText,
  wordsToReplace,
  replacementString
) {
  var regexPattern = wordsToReplace
                        .map((word) => word.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
                        .join('|')
  var regex = new RegExp(regexPattern, 'gi') // 'gi' for global and case-insensitive matching

  if (isNullOrWhitespace(replacementString)) {
    replacementString = '***'
  }

  var resultText = inputText.replace(regex, replacementString)

  return resultText
}

function getStats(originalText, wordsToScramble) {
  const originalWords = originalText.split(/\s+/)
  const reversedText = wordsToScramble.join('')
  const redactedText = reversedText

  let totalWordCount = originalWords.length
  let matchedWordCount = countMatchingItems(originalWords, wordsToScramble)
  let scrambledWordCharCount = redactedText.length

  return { totalWordCount, matchedWordCount, scrambledWordCharCount }
}

function countMatchingItems(array1, array2) {
  let count = 0

  for (const item of array1) {
    if (array2.includes(item)) {
      count++
    }
  }

  return count
}

function isNullOrWhitespace(input) {
  return input === null || input.trim() === ''
}
